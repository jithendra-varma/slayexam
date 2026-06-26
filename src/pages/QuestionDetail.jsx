import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAnswers } from '../hooks/useQA';
import { useAuth } from '../context/AuthContext';
import styles from './QuestionDetail.module.css';

export default function QuestionDetail() {
  const { questionId } = useParams();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { question, answers, loading, addAnswer, upvoteAnswer, acceptAnswer } = useAnswers(questionId);
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleAnswer(e) {
    e.preventDefault();
    if (!body.trim()) return;
    setSubmitting(true);
    await addAnswer({
      body: body.trim(),
      answeredBy: user.uid,
      answererName: profile?.name || user.email,
    });
    setBody('');
    setSubmitting(false);
  }

  if (!question && !loading) return <div className={styles.empty}>Question not found.</div>;

  return (
    <div className={styles.page}>
      <button className={styles.back} onClick={() => navigate(-1)}>← Back</button>

      {question && (
        <div className={styles.question}>
          <h2>{question.title}</h2>
          {question.body && <p className={styles.qbody}>{question.body}</p>}
          <div className={styles.meta}>Asked by {question.askerName} · {question.answerCount} answer{question.answerCount !== 1 ? 's' : ''}</div>
        </div>
      )}

      <div className={styles.section}>
        <h3>{answers.length} Answer{answers.length !== 1 ? 's' : ''}</h3>
        {loading && <div className={styles.empty}>Loading…</div>}
        {answers.map(a => (
          <div key={a.id} className={`${styles.answer} ${a.isAccepted ? styles.accepted : ''}`}>
            {a.isAccepted && <div className={styles.acceptedBadge}>✓ Accepted Answer</div>}
            <div className={styles.aContent}>
              <p>{a.body}</p>
              <div className={styles.aMeta}>By {a.answererName}</div>
            </div>
            <div className={styles.aActions}>
              <button className={styles.upvote} onClick={() => upvoteAnswer(a.id)}>▲ {a.upvotes}</button>
              {question?.askedBy === user?.uid && !a.isAccepted && (
                <button
                  className={styles.accept}
                  onClick={() => acceptAnswer(a.id, question.askedBy, user.uid)}
                >✓ Accept</button>
              )}
            </div>
          </div>
        ))}
      </div>

      <form className={styles.form} onSubmit={handleAnswer}>
        <h3>Your Answer</h3>
        <textarea
          placeholder="Write your answer here…"
          value={body}
          onChange={e => setBody(e.target.value)}
          rows={5}
          required
        />
        <button type="submit" disabled={submitting}>
          {submitting ? 'Posting…' : 'Post Answer'}
        </button>
      </form>
    </div>
  );
}
