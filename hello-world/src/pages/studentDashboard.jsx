import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getDashboardStats, getInternships, getLogs } from '../services/api';

const StudentDashboard = () => {
  const { user } = useAuth();  // Get logged-in user info
  const [stats, setStats] = useState(null);
  const [internships, setInternships] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // useEffect runs when the component first loads
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch all data in parallel (faster)
      const [statsRes, internshipsRes, logsRes] = await Promise.all([
        getDashboardStats(),
        getInternships(),
        getLogs()
      ]);
      
      setStats(statsRes.data);
      setInternships(internshipsRes.data);
      setLogs(logsRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to calculate statistics
  const getStats = () => {
    if (!internships.length) return { total: 0, active: 0, completed: 0 };
    
    const active = internships.filter(i => i.status === 'active').length;
    const completed = internships.filter(i => i.status === 'completed').length;
    
    return {
      total: internships.length,
      active,
      completed,
      pending: internships.length - active - completed
    };
  };

  const internshipStats = getStats();
  const logStats = {
    total: logs.length,
    submitted: logs.filter(l => l.status === 'submitted').length,
    approved: logs.filter(l => l.status === 'approved').length,
    draft: logs.filter(l => l.status === 'draft').length
  };

  if (loading) {
    return <div className="spinner" style={{ margin: '2rem auto' }}></div>;
  }

  const styles = {
    container: {
      padding: '2rem 0',
    },
    welcomeCard: {
      background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
      color: 'white',
      padding: '2rem',
      borderRadius: '8px',
      marginBottom: '2rem',
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '1rem',
      marginBottom: '2rem',
    },
    statCard: {
      background: 'white',
      padding: '1.5rem',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    statNumber: {
      fontSize: '2rem',
      fontWeight: 'bold',
      color: '#1976d2',
    },
    statLabel: {
      color: '#666',
      marginTop: '0.5rem',
    },
    section: {
      background: 'white',
      padding: '1.5rem',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      marginBottom: '1.5rem',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    th: {
      textAlign: 'left',
      padding: '0.75rem',
      borderBottom: '2px solid #ddd',
    },
    td: {
      padding: '0.75rem',
      borderBottom: '1px solid #ddd',
    },
    badge: (status) => ({
      display: 'inline-block',
      padding: '0.25rem 0.5rem',
      borderRadius: '4px',
      fontSize: '0.875rem',
      backgroundColor: status === 'active' ? '#4caf50' : status === 'completed' ? '#2196f3' : '#ff9800',
      color: 'white',
    }),
  };

  return (
    <div style={styles.container}>
      {/* Welcome Card */}
      <div style={styles.welcomeCard}>
        <h1>Welcome, {user?.first_name || user?.username}! 👋</h1>
        <p>Track your internship progress, submit weekly logs, and receive feedback.</p>
      </div>

      {/* Statistics Cards */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{internshipStats.total}</div>
          <div style={styles.statLabel}>Total Internships</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{internshipStats.active}</div>
          <div style={styles.statLabel}>Active Internships</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{logStats.total}</div>
          <div style={styles.statLabel}>Total Logs</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{logStats.approved}</div>
          <div style={styles.statLabel}>Approved Logs</div>
        </div>
      </div>

      {/* My Internships Section */}
      <div style={styles.section}>
        <h2 style={{ marginBottom: '1rem' }}>📋 My Internships</h2>
        {internships.length === 0 ? (
          <p>No internships found. <a href="/internships">Create your first internship</a></p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Title</th>
                <th style={styles.th}>Company</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Progress</th>
                <th style={styles.th}>Dates</th>
              </tr>
            </thead>
            <tbody>
              {internships.map((internship) => (
                <tr key={internship.id}>
                  <td style={styles.td}>{internship.title}</td>
                  <td style={styles.td}>{internship.company_name}</td>
                  <td style={styles.td}>
                    <span style={styles.badge(internship.status)}>
                      {internship.status}
                    </span>
                  </td>
                  <td style={styles.td}>
                    {internship.progress_percentage || 0}%
                  </td>
                  <td style={styles.td}>
                    {internship.start_date} to {internship.end_date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Recent Logs Section */}
      <div style={styles.section}>
        <h2 style={{ marginBottom: '1rem' }}>📝 Recent Weekly Logs</h2>
        {logs.length === 0 ? (
          <p>No logs submitted yet. <a href="/logs">Create your first log</a></p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Week</th>
                <th style={styles.th}>Internship</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Score</th>
                <th style={styles.th}>Submitted</th>
              </tr>
            </thead>
            <tbody>
              {logs.slice(0, 5).map((log) => (
                <tr key={log.id}>
                  <td style={styles.td}>Week {log.week_number}</td>
                  <td style={styles.td}>{log.internship_title || 'N/A'}</td>
                  <td style={styles.td}>
                    <span style={styles.badge(log.status)}>
                      {log.status}
                    </span>
                  </td>
                  <td style={styles.td}>{log.final_score || 'Pending'}</td>
                  <td style={styles.td}>
                    {log.submitted_at ? new Date(log.submitted_at).toLocaleDateString() : 'Not submitted'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;