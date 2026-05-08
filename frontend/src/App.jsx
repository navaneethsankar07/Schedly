import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CalendarView from './pages/CalendarView';
import LandingPage from './pages/LandingPage';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import WorkflowBoard from './pages/WorkflowBoard';
import WeeklyReport from './pages/WeeklyReport';
import Navbar from './components/Navbar';
import IdeaChatbot from './components/IdeaChatbot';
import CommandPalette from './components/CommandPalette';

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const AppLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-base-200 text-base-content flex flex-col transition-colors duration-300">
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto p-3 sm:p-5 lg:p-8">
        {children}
      </main>
      <IdeaChatbot />
      <CommandPalette />
    </div>
  );
};

const AppRoutes = () => {
  const { user } = useContext(AuthContext);

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <LandingPage />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <Register />} />
      <Route path="/dashboard" element={<ProtectedRoute><AppLayout><Dashboard /></AppLayout></ProtectedRoute>} />
      <Route path="/calendar" element={<ProtectedRoute><AppLayout><CalendarView /></AppLayout></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><AppLayout><Profile /></AppLayout></ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute><AppLayout><Notifications /></AppLayout></ProtectedRoute>} />
      <Route path="/workflow" element={<ProtectedRoute><AppLayout><WorkflowBoard /></AppLayout></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute><AppLayout><WeeklyReport /></AppLayout></ProtectedRoute>} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
