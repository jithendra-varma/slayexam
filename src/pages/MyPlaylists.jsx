import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useMyPlaylists } from '../hooks/usePlaylists';
import PlaylistCard from '../components/PlaylistCard';
import styles from './MyPlaylists.module.css';

const BRANCHES = ['CSE', 'ECE', 'Mechanical', 'Civil', 'IT', 'EEE', 'Other'];

export default function MyPlaylists() {
  const { user, profile } = useAuth();
  const { playlists, loading, createPlaylist } = useMyPlaylists(user?.uid);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', branch: 'CSE' });
  const [creating, setCreating] = useState(false);

  function set(field) {
    return e => setForm(f => ({ ...f, [field]: e.target.value }));
  }

  async function handleCreate(e) {
    e.preventDefault();
    if (!form.title.trim()) return;
    setCreating(true);
    await createPlaylist({
      title: form.title.trim(),
      description: form.description.trim(),
      branch: form.branch,
      creatorName: profile?.name || user.email,
    });
    setForm({ title: '', description: '', branch: 'CSE' });
    setShowForm(false);
    setCreating(false);
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h2>My Playlists</h2>
        <button className={styles.createBtn} onClick={() => setShowForm(v => !v)}>
          {showForm ? 'Cancel' : '+ New Playlist'}
        </button>
      </div>

      {showForm && (
        <form className={styles.form} onSubmit={handleCreate}>
          <label>Title *
            <input value={form.title} onChange={set('title')} placeholder="e.g. OS Exam Prep" required />
          </label>
          <label>Description
            <input value={form.description} onChange={set('description')} placeholder="What's this playlist about?" />
          </label>
          <label>Branch
            <select value={form.branch} onChange={set('branch')}>
              {BRANCHES.map(b => <option key={b}>{b}</option>)}
            </select>
          </label>
          <button type="submit" className={styles.submitBtn} disabled={creating}>
            {creating ? 'Creating…' : 'Create Playlist'}
          </button>
        </form>
      )}

      {loading && <div className={styles.empty}>Loading…</div>}
      {!loading && !playlists.length && (
        <div className={styles.empty}>You haven't created any playlists yet.</div>
      )}

      <div className={styles.grid}>
        {playlists.map(p => (
          <PlaylistCard key={p.id} playlist={p} showEdit />
        ))}
      </div>
    </div>
  );
}
