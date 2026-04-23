import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPlacements } from '../../api/client';
import { Calendar, Building, CheckCircle, Clock, AlertCircle } from 'lucide-react';

function StudentDashboard() {
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlacements();
  }, []);

  const fetchPlacements = async () => {
    try {
      const response = await getPlacements();
      setPlacements(response.data);
    } catch (error) {
      console.error('Failed to fetch placements:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
      pending: 'bg-yellow-100 text-yellow-800',
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
        <p className="text-gray-500">Track your internship progress</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Active Internships</p>
              <p className="text-2xl font-bold">{placements.filter(p => p.is_active).length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-2xl font-bold">{placements.filter(p => !p.is_active).length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-full">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Pending Logs</p>
              <p className="text-2xl font-bold">0</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">My Internships</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {placements.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-500">
              No internships found. Contact your academic supervisor to get started.
            </div>
          ) : (
            placements.map((placement) => (
              <div key={placement.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {placement.organization_name}
                    </h3>
                    <p className="text-sm text-gray-500">{placement.course}</p>
                    <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                      <span>{placement.start_date} - {placement.end_date}</span>
                      <span>Reg No: {placement.registration_number}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex px-2 py-1 text-xs rounded-full ${getStatusBadge(placement.is_active ? 'active' : 'completed')}`}>
                      {placement.is_active ? 'Active' : 'Completed'}
                    </span>
                    <Link
                      to={`/placements/${placement.id}/logs`}
                      className="block mt-2 text-sm text-blue-600 hover:text-blue-800"
                    >
                      View Weekly Logs →
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;