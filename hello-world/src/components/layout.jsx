import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Layout = () => {
  const { logout, user } = useAuth();

  return (
    <div className="app-layout">
      <header style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}>
        <nav style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <strong>ILES Portal</strong>
            <Link to="/" style={{ marginLeft: '20px' }}>Dashboard</Link>
          </div>
          {user && (
            <div>
              <span>{user.username}</span>
              <button onClick={logout} style={{ marginLeft: '10px' }}>Logout</button>
            </div>
          )}
        </nav>
      </header>

      <main style={{ padding: '2rem' }}>
        {/* This is where your pages (Dashboard, etc.) will be rendered */}
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;