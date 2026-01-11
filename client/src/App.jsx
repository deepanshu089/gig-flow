import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import GigDetailsPage from './pages/GigDetailsPage';
import socket from './socket';

const PrivateRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  return user ? children : <Navigate to="/login" />;
};

function App() {
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      socket.emit('join', user._id);
      socket.on('notification', (data) => {
          toast.success(data.message, { duration: 5000, icon: '🎉' });
      });
      return () => {
        socket.off('notification');
      }
    }
  }, [user]);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        } />
        <Route path="/gigs/:id" element={<GigDetailsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
