import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// WHAT IS A REACT COMPONENT?
// A component is a piece of the UI. This Login component shows the login screen.

const Login = () => {
  // useState creates a piece of data that can change
  // When it changes, React automatically re-renders the component
  
  // formData stores what the user types in the input fields
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  
  // loading is true while we're waiting for the server to respond
  const [loading, setLoading] = useState(false);
  
  // useAuth() gives us access to the login function from AuthContext
  const { login } = useAuth();
  
  // useNavigate() lets us programmatically change pages
  const navigate = useNavigate();

  // This function runs when the user submits the form
  const handleSubmit = async (e) => {
    e.preventDefault();  // Prevents the page from refreshing (default form behavior)
    
    setLoading(true);  // Show loading state
    
    // Try to login
    const result = await login(formData.username, formData.password);
    
    if (result.success) {
      // If login successful, redirect to the appropriate dashboard based on role
      const roleRoutes = {
        student: '/student-dashboard',
        workplace_supervisor: '/workplace-dashboard',
        academic_supervisor: '/academic-dashboard',
        admin: '/admin-dashboard',
      };
      navigate(roleRoutes[result.user.role]);
    }
    
    setLoading(false);  // Hide loading state
  };

  // Inline styles (you can move these to CSS file later)
  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',  // Full screen height
      backgroundColor: '#f5f5f5',
    },
    card: {
      backgroundColor: 'white',
      padding: '2rem',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      width: '100%',
      maxWidth: '400px',
    },
    title: {
      textAlign: 'center',
      color: '#1976d2',
      marginBottom: '1.5rem',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',  // Space between form elements
    },
    input: {
      width: '100%',
      padding: '0.75rem',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '1rem',
    },
    button: {
      width: '100%',
      padding: '0.75rem',
      backgroundColor: '#1976d2',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      fontSize: '1rem',
      cursor: 'pointer',
    },
  };

  // This is what gets rendered on the screen
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Internship Logging System</h1>
        <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Login</h2>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Username input */}
          <input
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            style={styles.input}
            required
          />
          
          {/* Password input */}
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            style={styles.input}
            required
          />
          
          {/* Submit button */}
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        {/* Link to registration page */}
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <Link to="/register" style={{ color: '#1976d2' }}>
            Don't have an account? Register here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;