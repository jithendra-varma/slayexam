import { useNavigate } from 'react-router-dom';
import StarRating from './StarRating';
import { useAuth } from '../context/AuthContext';
import { useRating, copyPlaylist } from '../hooks/usePlaylists';
import styles from './PlaylistCard.module.css';

export default function PlaylistCard({ playlist, showEdit = false, showCopy = false }) {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { myRating, submitRating } = useRating(playlist.id, user?.uid);

  async function handleCopy() {
    await copyPlaylist(playlist, user.uid, profile?.name || user.email);
    alert('Playlist copied to your library!');
  }

  return (
    <div className={styles.card}>
      <div className={styles.top}>
        <div className={styles.title}>{playlist.title}</div>
        {playlist.branch && <span className={styles.branch}>{playlist.branch}</span>}
      </div>
      {playlist.description && <div className={styles.desc}>{playlist.description}</div>}
      <div className={styles.meta}>
        By {playlist.creatorName} · {playlist.videos?.length ?? 0} videos
      </div>
      <div className={styles.ratingRow}>
        <StarRating value={Math.round(playlist.rating || 0)} readonly size="sm" />
        <span className={styles.ratingNum}>
          {playlist.rating > 0 ? playlist.rating.toFixed(1) : 'No ratings'} ({playlist.ratingCount})
        </span>
      </div>
      {showCopy && user && (
        <div className={styles.userRating}>
          <span className={styles.rateLabel}>Rate:</span>
          <StarRating value={myRating} onChange={submitRating} size="sm" />
          {myRating > 0 && <span className={styles.rated}>You rated {myRating}★</span>}
        </div>
      )}
      <div className={styles.actions}>
        {showEdit && (
          <button className={styles.editBtn} onClick={() => navigate(`/playlists/${playlist.id}`)}>
            Edit
          </button>
        )}
        {showCopy && (
          <button className={styles.copyBtn} onClick={handleCopy}>Copy to My Library</button>
        )}
      </div>
    </div>
  );
}
