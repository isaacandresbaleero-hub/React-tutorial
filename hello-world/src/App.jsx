import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import WorkplaceDashboard from './pages/WorkplaceDashboard';
import AcademicDashboard from './pages/AcademicDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Internships from './pages/Internships';
import WeeklyLogs from './pages/WeeklyLogs';
import Evaluations from './pages/Evaluations';
import Profile from './pages/Profile';
import './App.css';

// The main App component - this is the heart of your React application
function App() {
  const { user } = useAuth();  // Get user info from AuthContext

  // Helper function to determine which dashboard to show based on user role
  const getDashboardByRole = () => {
    if (!user) return '/login';
    
    switch (user.role) {
      case 'student': return '/student-dashboard';
      case 'workplace_supervisor': return '/workplace-dashboard';
      case 'academic_supervisor': return '/academic-dashboard';
      case 'admin': return '/admin-dashboard';
      default: return '/login';
    }
  };

  return (
    <div className="app">
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* PROTECTED ROUTES */}
        <Route element={<PrivateRoute />}>
          <Route element={<Layout />}>
            {/* Dashboards */}
            <Route path="/student-dashboard" element={<StudentDashboard />} />
            <Route path="/workplace-dashboard" element={<WorkplaceDashboard />} />
            <Route path="/academic-dashboard" element={<AcademicDashboard />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            
            {/* Common routes */}
            <Route path="/internships" element={<Internships />} />
            <Route path="/logs" element={<WeeklyLogs />} />
            <Route path="/evaluations" element={<Evaluations />} />
            <Route path="/profile" element={<Profile />} />
            
            {/* Default redirect */}
            <Route path="/" element={<Navigate to={getDashboardByRole()} />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
