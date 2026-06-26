import { useState } from 'react';
import { usePublicPlaylists } from '../hooks/usePlaylists';
import PlaylistCard from '../components/PlaylistCard';
import styles from './Community.module.css';

const BRANCHES = ['All', 'CSE', 'ECE', 'Mechanical', 'Civil', 'IT', 'EEE', 'Other'];

export default function Community() {
  const { playlists, loading } = usePublicPlaylists();
  const [branch, setBranch] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = playlists.filter(p => {
    const matchBranch = branch === 'All' || p.branch === branch;
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase());
    return matchBranch && matchSearch;
  });

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h2>Community Playlists</h2>
        <p>Explore playlists created and shared by students. Top-rated playlists appear first.</p>
      </div>

      <div className={styles.filters}>
        <input
          className={styles.search}
          placeholder="Search playlists…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className={styles.branchRow}>
          {BRANCHES.map(b => (
            <button
              key={b}
              className={`${styles.chip} ${branch === b ? styles.active : ''}`}
              onClick={() => setBranch(b)}
            >{b}</button>
          ))}
        </div>
      </div>

      {loading && <div className={styles.empty}>Loading playlists…</div>}

      {!loading && !filtered.length && (
        <div className={styles.empty}>
          {playlists.length === 0
            ? 'No public playlists yet. Create one and share it!'
            : 'No playlists match your filters.'}
        </div>
      )}

      <div className={styles.grid}>
        {filtered.map(p => (
          <PlaylistCard key={p.id} playlist={p} showCopy />
        ))}
      </div>
    </div>
  );
}
