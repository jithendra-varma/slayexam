import { useAuth } from '../context/AuthContext';
import styles from './NotesList.module.css';

const TYPE_ICON = { pdf: '📄', image: '🖼️', doc: '📝' };

export default function NotesList({ notes, loading, onDelete, onDownload }) {
  const { user } = useAuth();

  if (loading) return <div className={styles.empty}>Loading notes…</div>;
  if (!notes.length) return <div className={styles.empty}>No notes uploaded yet. Be the first!</div>;

  return (
    <div className={styles.list}>
      {notes.map(note => (
        <div key={note.id} className={styles.card}>
          <div className={styles.icon}>{TYPE_ICON[note.fileType] || '📎'}</div>
          <div className={styles.info}>
            <div className={styles.title}>{note.title}</div>
            {note.description && <div className={styles.desc}>{note.description}</div>}
            <div className={styles.meta}>
              By {note.uploaderName} · {note.downloads} downloads
            </div>
          </div>
          <div className={styles.actions}>
            <a
              href={note.fileUrl}
              target="_blank"
              rel="noreferrer"
              className={styles.download}
              onClick={() => onDownload(note.id)}
            >Download</a>
            {user?.uid === note.uploadedBy && (
              <button className={styles.delete} onClick={() => onDelete(note)}>Delete</button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
