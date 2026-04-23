import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPlacements } from '../../api/client';
import { Users, Briefcase, TrendingUp, Calendar, UserPlus, Settings } from 'lucide-react';

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPlacements: 0,
    activePlacements: 0,
    completionRate: 0,
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await getPlacements();
      const placements = response.data;
      
      setStats({
        totalUsers: 0, // Would come from users API
        totalPlacements: placements.length,
        activePlacements: placements.filter(p => p.is_active).length,
        completionRate: placements.length ? 
          Math.round((placements.filter(p => !p.is_active).length / placements.length) * 100) : 0,
      });
      
      setRecentActivities(placements.slice(0, 5));
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500">System overview and management</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Total Users</p>
              <p className="text-2xl font-bold">{stats.totalUsers}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <Briefcase className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Total Placements</p>
              <p className="text-2xl font-bold">{stats.totalPlacements}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-full">
              <Calendar className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Active Placements</p>
              <p className="text-2xl font-bold">{stats.activePlacements}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Completion Rate</p>
              <p className="text-2xl font-bold">{stats.completionRate}%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
          </div>
          <div className="p-6 space-y-3">
            <Link to="/placements/new" className="flex items-center text-blue-600 hover:text-blue-800">
              <UserPlus className="h-5 w-5 mr-2" />
              Create New Placement
            </Link>
            <Link to="/users" className="flex items-center text-blue-600 hover:text-blue-800">
              <Users className="h-5 w-5 mr-2" />
              Manage Users
            </Link>
            <Link to="/settings" className="flex items-center text-blue-600 hover:text-blue-800">
              <Settings className="h-5 w-5 mr-2" />
              System Settings
            </Link>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Recent Placements</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {recentActivities.length === 0 ? (
              <div className="px-6 py-12 text-center text-gray-500">No placements found</div>
            ) : (
              recentActivities.map((placement) => (
                <div key={placement.id} className="px-6 py-3">
                  <p className="text-sm font-medium text-gray-900">{placement.organization_name}</p>
                  <p className="text-xs text-gray-500">Created: {new Date(placement.created_at).toLocaleDateString()}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;