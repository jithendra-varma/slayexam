import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  const initial = (profile?.name || user?.email || '?')[0].toUpperCase();

  return (
    <nav className={styles.nav}>
      <Link to="/" className={styles.brand}>SlayExam</Link>
      <div className={styles.links}>
        <Link to="/">Home</Link>
        <Link to="/playlists">My Playlists</Link>
        <Link to="/community">Community</Link>
      </div>
      <div className={styles.user}>
        <div className={styles.avatar}>{initial}</div>
        <span className={styles.name}>{profile?.name || user?.email}</span>
        <button className={styles.logout} onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}
