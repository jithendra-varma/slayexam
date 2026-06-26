import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth, isCollegeEmail } from '../context/AuthContext';
import styles from './Auth.module.css';

const BRANCHES = ['CSE', 'ECE', 'Mechanical', 'Civil', 'IT', 'EEE', 'Chemical', 'Other'];
const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

export default function Register() {
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', branch: 'CSE', year: '1st Year' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function set(field) {
    return e => setForm(f => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!isCollegeEmail(form.email)) {
      setError('Only college email addresses (.ac.in or .edu) are allowed.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      await register(form.email, form.password, form.name, form.branch, form.year);
    } catch (err) {
      setError(err.code === 'auth/email-already-in-use'
        ? 'An account with this email already exists.'
        : err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.logo}>SlayExam</h1>
        <p className={styles.sub}>Create your student account</p>
        {error && <div className={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit} className={styles.form}>
          <label>Full Name
            <input type="text" value={form.name} onChange={set('name')} required autoFocus />
          </label>
          <label>College Email <span className={styles.hint}>(must be .ac.in or .edu)</span>
            <input type="email" value={form.email} onChange={set('email')} required />
          </label>
          <label>Password
            <input type="password" value={form.password} onChange={set('password')} required minLength={6} />
          </label>
          <div className={styles.row}>
            <label>Branch
              <select value={form.branch} onChange={set('branch')}>
                {BRANCHES.map(b => <option key={b}>{b}</option>)}
              </select>
            </label>
            <label>Year
              <select value={form.year} onChange={set('year')}>
                {YEARS.map(y => <option key={y}>{y}</option>)}
              </select>
            </label>
          </div>
          <button type="submit" className={styles.btn} disabled={loading}>
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>
        <p className={styles.switch}>
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
