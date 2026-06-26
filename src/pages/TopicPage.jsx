import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useNotes } from '../hooks/useNotes';
import { useQuestions } from '../hooks/useQA';
import NotesUpload from '../components/NotesUpload';
import NotesList from '../components/NotesList';
import QuestionList from '../components/QuestionList';
import cseData from '../../docs/cse.json';
import eceData from '../../docs/ece.json';
import styles from './TopicPage.module.css';

const DATA = { CSE: cseData, ECE: eceData };
const TABS = ['Videos', 'Notes', 'Q&A'];

export default function TopicPage() {
  const { branch, semester, subjectIndex, topicIndex } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState('Videos');

  const semNum = parseInt(semester, 10);
  const subIdx = parseInt(subjectIndex, 10);
  const topIdx = parseInt(topicIndex, 10);

  const subjects = DATA[branch]?.filter(e => e.semester === semNum) ?? [];
  const subject = subjects[subIdx];
  const topic = subject?.topics[topIdx];

  const { notes, loading: notesLoading, uploadNote, deleteNote, trackDownload } = useNotes(
    branch, semNum, subject?.subject ?? '', topic?.name ?? ''
  );
  const { questions, loading: qLoading, addQuestion, upvoteQuestion } = useQuestions(
    branch, semNum, subject?.subject ?? '', topic?.name ?? ''
  );

  if (!topic) return <div className={styles.error}>Topic not found.</div>;

  return (
    <div className={styles.page}>
      <button className={styles.back} onClick={() => navigate('/')}>← Home</button>

      <div className={styles.header}>
        <div className={styles.breadcrumb}>{branch} · Sem {semester} · {subject?.subject}</div>
        <h1>{topic.name}</h1>
      </div>

      <div className={styles.tabs}>
        {TABS.map(t => (
          <button
            key={t}
            className={`${styles.tab} ${tab === t ? styles.active : ''}`}
            onClick={() => setTab(t)}
          >{t}</button>
        ))}
      </div>

      {tab === 'Videos' && (
        <div className={styles.videoSection}>
          {topic.youtube_links?.length > 0 ? (
            <div className={styles.videoGrid}>
              {topic.youtube_links.map((url, i) => {
                const videoId = url.split('v=')[1]?.split('&')[0];
                return videoId ? (
                  <div key={i} className={styles.videoWrap}>
                    <iframe
                      src={`https://www.youtube.com/embed/${videoId}`}
                      title={`${topic.name} video ${i + 1}`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : null;
              })}
            </div>
          ) : (
            <div className={styles.empty}>No videos linked for this topic yet.</div>
          )}
        </div>
      )}

      {tab === 'Notes' && (
        <div>
          <NotesUpload onUpload={uploadNote} />
          <NotesList
            notes={notes}
            loading={notesLoading}
            onDelete={deleteNote}
            onDownload={trackDownload}
          />
        </div>
      )}

      {tab === 'Q&A' && (
        <QuestionList
          questions={questions}
          loading={qLoading}
          onAdd={addQuestion}
          onUpvote={upvoteQuestion}
        />
      )}
    </div>
  );
}
