import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { GraduationCap, LogOut, LayoutDashboard, Briefcase, FileText, Users } from 'lucide-react';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNavLinks = () => {
    switch (user?.role) {
      case 'student':
        return [
          { to: '/', label: 'Dashboard', icon: LayoutDashboard },
          { to: '/placements', label: 'My Placements', icon: Briefcase },
          { to: `/placements/${user.active_placement_id}/logs`, label: 'Weekly Logs', icon: FileText },
        ];
      case 'acad_supervisor':
        return [
          { to: '/', label: 'Dashboard', icon: LayoutDashboard },
          { to: '/placements', label: 'Manage Placements', icon: Briefcase },
          { to: '/logs/review', label: 'Review Logs', icon: FileText },
        ];
      case 'work_supervisor':
        return [
          { to: '/', label: 'Dashboard', icon: LayoutDashboard },
          { to: '/placements', label: 'My Students', icon: Users },
          { to: '/logs/review', label: 'Review Logs', icon: FileText },
        ];
      case 'admin':
        return [
          { to: '/', label: 'Dashboard', icon: LayoutDashboard },
          { to: '/placements', label: 'All Placements', icon: Briefcase },
          { to: '/users', label: 'Manage Users', icon: Users },
        ];
      default:
        return [];
    }
  };

  return (
    <nav className="bg-white shadow-sm fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <GraduationCap className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">Internship Manager</span>
          </div>

          <div className="flex items-center space-x-4">
            {getNavLinks().map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="flex items-center text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                <link.icon className="h-4 w-4 mr-2" />
                {link.label}
              </Link>
            ))}
            
            <div className="ml-4 flex items-center space-x-3">
              <span className="text-sm text-gray-600">
                {user?.username} ({user?.role})
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center text-red-600 hover:text-red-700"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;