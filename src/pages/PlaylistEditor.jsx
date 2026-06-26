import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePlaylist } from '../hooks/usePlaylists';
import { useAuth } from '../context/AuthContext';
import styles from './PlaylistEditor.module.css';

const BRANCHES = ['CSE', 'ECE', 'Mechanical', 'Civil', 'IT', 'EEE', 'Other'];

function extractYouTubeId(url) {
  const match = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

async function fetchYouTubeTitle(videoId) {
  try {
    const res = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
    const data = await res.json();
    return data.title || videoId;
  } catch {
    return videoId;
  }
}

export default function PlaylistEditor() {
  const { playlistId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { playlist, loading, updateVideos, updateMeta, deletePlaylist } = usePlaylist(playlistId);

  const [customUrl, setCustomUrl] = useState('');
  const [addingUrl, setAddingUrl] = useState(false);
  const [urlError, setUrlError] = useState('');
  const [saving, setSaving] = useState(false);
  const [editMeta, setEditMeta] = useState(false);
  const [meta, setMeta] = useState({});

  if (loading) return <div className={styles.empty}>Loading…</div>;
  if (!playlist) return <div className={styles.empty}>Playlist not found.</div>;
  if (playlist.createdBy !== user?.uid) return <div className={styles.empty}>Not authorized.</div>;

  async function addCustomVideo(e) {
    e.preventDefault();
    setUrlError('');
    const videoId = extractYouTubeId(customUrl);
    if (!videoId) { setUrlError('Invalid YouTube URL.'); return; }
    setAddingUrl(true);
    const title = await fetchYouTubeTitle(videoId);
    const newVideo = { videoId, title, youtubeUrl: `https://www.youtube.com/watch?v=${videoId}`, source: 'custom' };
    await updateVideos([...(playlist.videos || []), newVideo]);
    setCustomUrl('');
    setAddingUrl(false);
  }

  async function removeVideo(index) {
    const updated = playlist.videos.filter((_, i) => i !== index);
    await updateVideos(updated);
  }

  async function moveVideo(index, dir) {
    const vids = [...playlist.videos];
    const target = index + dir;
    if (target < 0 || target >= vids.length) return;
    [vids[index], vids[target]] = [vids[target], vids[index]];
    await updateVideos(vids);
  }

  async function handleMetaSave(e) {
    e.preventDefault();
    setSaving(true);
    await updateMeta({
      title: meta.title || playlist.title,
      description: meta.description ?? playlist.description,
      branch: meta.branch || playlist.branch,
      isPublic: meta.isPublic ?? playlist.isPublic,
    });
    setEditMeta(false);
    setSaving(false);
  }

  async function handleDelete() {
    if (!confirm('Delete this playlist? This cannot be undone.')) return;
    await deletePlaylist();
    navigate('/playlists');
  }

  function startEdit() {
    setMeta({
      title: playlist.title,
      description: playlist.description || '',
      branch: playlist.branch,
      isPublic: playlist.isPublic,
    });
    setEditMeta(true);
  }

  return (
    <div className={styles.page}>
      <button className={styles.back} onClick={() => navigate('/playlists')}>← My Playlists</button>

      <div className={styles.header}>
        <div>
          <h1>{playlist.title}</h1>
          {playlist.description && <p className={styles.desc}>{playlist.description}</p>}
          <div className={styles.meta}>
            {playlist.branch} · {playlist.isPublic ? '🌐 Public' : '🔒 Private'} · {playlist.videos?.length ?? 0} videos
          </div>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.editMetaBtn} onClick={startEdit}>Edit Info</button>
          <button className={styles.deleteBtn} onClick={handleDelete}>Delete</button>
        </div>
      </div>

      {editMeta && (
        <form className={styles.metaForm} onSubmit={handleMetaSave}>
          <label>Title
            <input value={meta.title} onChange={e => setMeta(m => ({ ...m, title: e.target.value }))} />
          </label>
          <label>Description
            <input value={meta.description} onChange={e => setMeta(m => ({ ...m, description: e.target.value }))} />
          </label>
          <label>Branch
            <select value={meta.branch} onChange={e => setMeta(m => ({ ...m, branch: e.target.value }))}>
              {BRANCHES.map(b => <option key={b}>{b}</option>)}
            </select>
          </label>
          <label className={styles.toggle}>
            <input
              type="checkbox"
              checked={meta.isPublic}
              onChange={e => setMeta(m => ({ ...m, isPublic: e.target.checked }))}
            />
            Make Public (visible to all students)
          </label>
          <div className={styles.metaBtns}>
            <button type="submit" className={styles.saveBtn} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
            <button type="button" onClick={() => setEditMeta(false)}>Cancel</button>
          </div>
        </form>
      )}

      <div className={styles.addSection}>
        <h3>Add a YouTube Video</h3>
        <form className={styles.urlForm} onSubmit={addCustomVideo}>
          <input
            type="url"
            placeholder="Paste YouTube URL (e.g. https://www.youtube.com/watch?v=...)"
            value={customUrl}
            onChange={e => setCustomUrl(e.target.value)}
          />
          <button type="submit" disabled={addingUrl}>{addingUrl ? 'Adding…' : 'Add'}</button>
        </form>
        {urlError && <div className={styles.error}>{urlError}</div>}
      </div>

      <div className={styles.videoList}>
        <h3>{playlist.videos?.length ?? 0} Videos</h3>
        {(!playlist.videos || playlist.videos.length === 0) && (
          <div className={styles.empty}>No videos yet. Add one above.</div>
        )}
        {(playlist.videos || []).map((v, i) => (
          <div key={i} className={styles.videoRow}>
            <div className={styles.thumb}>
              <img src={`https://img.youtube.com/vi/${v.videoId}/mqdefault.jpg`} alt={v.title} />
            </div>
            <div className={styles.vInfo}>
              <div className={styles.vTitle}>{v.title}</div>
              <div className={styles.vSource}>{v.source === 'curated' ? '📚 Curated' : '🔗 Custom'}</div>
            </div>
            <div className={styles.vActions}>
              <button onClick={() => moveVideo(i, -1)} disabled={i === 0}>↑</button>
              <button onClick={() => moveVideo(i, 1)} disabled={i === (playlist.videos.length - 1)}>↓</button>
              <button className={styles.removeBtn} onClick={() => removeVideo(i)}>✕</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
