import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import styles from './NotesUpload.module.css';

const MAX_MB = 10;

export default function NotesUpload({ onUpload }) {
  const { user, profile } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef();

  function handleFile(e) {
    const f = e.target.files[0];
    if (!f) return;
    if (f.size > MAX_MB * 1024 * 1024) {
      setError(`File must be under ${MAX_MB} MB.`);
      return;
    }
    setError('');
    setFile(f);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!file) { setError('Please select a file.'); return; }
    if (!title.trim()) { setError('Please enter a title.'); return; }
    setUploading(true);
    try {
      await onUpload({
        file,
        title: title.trim(),
        description: description.trim(),
        uploadedBy: user.uid,
        uploaderName: profile?.name || user.email,
      });
      setTitle('');
      setDescription('');
      setFile(null);
      inputRef.current.value = '';
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h4>Upload Notes</h4>
      {error && <div className={styles.error}>{error}</div>}
      <label>Title *
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Stack DS handwritten notes" />
      </label>
      <label>Description
        <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Optional short description" />
      </label>
      <label>File * <span className={styles.hint}>(PDF, image, or doc — max {MAX_MB} MB)</span>
        <input ref={inputRef} type="file" accept=".pdf,.jpg,.jpeg,.png,.gif,.webp,.doc,.docx,.ppt,.pptx" onChange={handleFile} />
      </label>
      {file && <div className={styles.fileName}>Selected: {file.name}</div>}
      <button type="submit" className={styles.btn} disabled={uploading}>
        {uploading ? 'Uploading…' : 'Upload'}
      </button>
    </form>
  );
}
