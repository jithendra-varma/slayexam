import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './QuestionList.module.css';

export default function QuestionList({ questions, loading, onAdd, onUpvote }) {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);
    await onAdd({
      title: title.trim(),
      body: body.trim(),
      askedBy: user.uid,
      askerName: profile?.name || user.email,
    });
    setTitle('');
    setBody('');
    setShowForm(false);
    setSubmitting(false);
  }

  return (
    <div>
      <div className={styles.header}>
        <h4>Doubts & Questions</h4>
        <button className={styles.askBtn} onClick={() => setShowForm(v => !v)}>
          {showForm ? 'Cancel' : '+ Ask a Question'}
        </button>
      </div>

      {showForm && (
        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            placeholder="Question title *"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Describe your doubt in detail (optional)"
            value={body}
            onChange={e => setBody(e.target.value)}
            rows={3}
          />
          <button type="submit" disabled={submitting}>
            {submitting ? 'Posting…' : 'Post Question'}
          </button>
        </form>
      )}

      {loading && <div className={styles.empty}>Loading questions…</div>}

      {!loading && !questions.length && (
        <div className={styles.empty}>No questions yet. Ask the first one!</div>
      )}

      <div className={styles.list}>
        {questions.map(q => (
          <div key={q.id} className={styles.card}>
            <div className={styles.votes}>
              <button className={styles.upvote} onClick={() => onUpvote(q.id)}>▲</button>
              <span>{q.upvotes}</span>
            </div>
            <div className={styles.content} onClick={() => navigate(`/question/${q.id}`)}>
              <div className={styles.qtitle}>{q.title}</div>
              {q.body && <div className={styles.qbody}>{q.body.slice(0, 120)}{q.body.length > 120 ? '…' : ''}</div>}
              <div className={styles.meta}>
                Asked by {q.askerName} · {q.answerCount} answer{q.answerCount !== 1 ? 's' : ''}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
