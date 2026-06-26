import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import cseData from '../../docs/cse.json';
import eceData from '../../docs/ece.json';
import styles from './Home.module.css';

const DATA = { CSE: cseData, ECE: eceData };
const BRANCHES = Object.keys(DATA);

export default function Home() {
  const { profile } = useAuth();
  const navigate = useNavigate();

  const defaultBranch = BRANCHES.includes(profile?.branch) ? profile.branch : BRANCHES[0];
  const [branch, setBranch] = useState(defaultBranch);
  const [semester, setSemester] = useState(null);
  const [subject, setSubject] = useState(null);

  const semesters = [...new Set(DATA[branch].map(e => e.semester))].sort((a, b) => a - b);
  const subjects = semester != null ? DATA[branch].filter(e => e.semester === semester) : [];
  const topics = subject != null ? subjects[subject]?.topics ?? [] : [];

  function selectBranch(b) {
    setBranch(b);
    setSemester(null);
    setSubject(null);
  }

  function selectSemester(s) {
    setSemester(s);
    setSubject(null);
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h2>Welcome back, {profile?.name?.split(' ')[0] || 'Student'} 👋</h2>
        <p>Pick your branch and explore subjects</p>
      </div>

      <div className={styles.branchRow}>
        {BRANCHES.map(b => (
          <button
            key={b}
            className={`${styles.chip} ${branch === b ? styles.active : ''}`}
            onClick={() => selectBranch(b)}
          >{b}</button>
        ))}
      </div>

      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <h3>Semesters</h3>
          {semesters.map(s => (
            <button
              key={s}
              className={`${styles.semBtn} ${semester === s ? styles.active : ''}`}
              onClick={() => selectSemester(s)}
            >Semester {s}</button>
          ))}
        </aside>

        <main className={styles.main}>
          {semester == null && (
            <div className={styles.empty}>Select a semester to get started</div>
          )}

          {semester != null && subject == null && (
            <>
              <h3>Semester {semester} — Subjects</h3>
              <div className={styles.grid}>
                {subjects.map((sub, idx) => (
                  <button key={idx} className={styles.subjectCard} onClick={() => setSubject(idx)}>
                    <span className={styles.subjectName}>{sub.subject}</span>
                    <span className={styles.topicCount}>{sub.topics.length} topics</span>
                  </button>
                ))}
              </div>
            </>
          )}

          {subject != null && (
            <>
              <div className={styles.breadcrumb}>
                <button onClick={() => setSubject(null)}>← Sem {semester}</button>
                <span>{subjects[subject]?.subject}</span>
              </div>
              <div className={styles.topicList}>
                {topics.map((topic, tIdx) => (
                  <button
                    key={tIdx}
                    className={styles.topicRow}
                    onClick={() => navigate(`/topic/${branch}/${semester}/${subject}/${tIdx}`)}
                  >
                    <span className={styles.topicName}>{topic.name}</span>
                    <span className={styles.arrow}>→</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
