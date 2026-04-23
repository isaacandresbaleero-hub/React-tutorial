import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPlacements } from '../../api/client';
import { useAuth } from '../../contexts/AuthContext';
import { Users, Clock, CheckCircle, UserCheck } from 'lucide-react';

function WorkplaceSupervisorDashboard() {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeStudents: 0,
    pendingReviews: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await getPlacements();
      // Filter placements where workplace supervisor email matches logged-in user
      const myStudents = response.data.filter(p => 
        p.workplace_supervisor_email === user?.email
      );
      setStudents(myStudents);
      setStats({
        totalStudents: new Set(myStudents.map(s => s.student)).size,
        activeStudents: myStudents.filter(s => s.is_active).length,
        pendingReviews: 0, // Would come from API
      });
    } catch (error) {
      console.error('Failed to fetch students:', error);
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
        <h1 className="text-2xl font-bold text-gray-900">Workplace Supervisor Dashboard</h1>
        <p className="text-gray-500">Manage and review your students' progress</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Total Students</p>
              <p className="text-2xl font-bold">{stats.totalStudents}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <UserCheck className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Active Students</p>
              <p className="text-2xl font-bold">{stats.activeStudents}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-full">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Pending Reviews</p>
              <p className="text-2xl font-bold">{stats.pendingReviews}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">My Students</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {students.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-500">
              No students assigned to you yet
            </div>
          ) : (
            students.map((placement) => (
              <div key={placement.id} className="px-6 py-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">Student ID: {placement.student}</p>
                    <p className="text-sm text-gray-500">{placement.organization_name}</p>
                    <p className="text-sm text-gray-500">{placement.course}</p>
                    <p className="text-sm text-gray-500">
                      Period: {placement.start_date} - {placement.end_date}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex px-2 py-1 text-xs rounded-full ${placement.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {placement.is_active ? 'Active' : 'Completed'}
                    </span>
                    <Link
                      to={`/placements/${placement.id}/logs`}
                      className="block mt-2 text-sm text-blue-600 hover:text-blue-800"
                    >
                      View Logs →
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

export default WorkplaceSupervisorDashboard;