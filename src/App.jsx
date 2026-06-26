import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import TopicPage from './pages/TopicPage';
import QuestionDetail from './pages/QuestionDetail';
import MyPlaylists from './pages/MyPlaylists';
import PlaylistEditor from './pages/PlaylistEditor';
import Community from './pages/Community';

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const { user } = useAuth();

  return (
    <>
      {user && <Navbar />}
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/" replace /> : <Register />} />
        <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/topic/:branch/:semester/:subjectIndex/:topicIndex" element={<PrivateRoute><TopicPage /></PrivateRoute>} />
        <Route path="/question/:questionId" element={<PrivateRoute><QuestionDetail /></PrivateRoute>} />
        <Route path="/playlists" element={<PrivateRoute><MyPlaylists /></PrivateRoute>} />
        <Route path="/playlists/:playlistId" element={<PrivateRoute><PlaylistEditor /></PrivateRoute>} />
        <Route path="/community" element={<PrivateRoute><Community /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
