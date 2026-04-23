import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPlacements } from '../../api/client';
import { Users, Briefcase, FileCheck, Clock, TrendingUp } from 'lucide-react';

function AcademicSupervisorDashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    activePlacements: 0,
    pendingReviews: 0,
    completedPlacements: 0,
  });
  const [recentPlacements, setRecentPlacements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await getPlacements();
      const placements = response.data;
      
      setStats({
        totalStudents: new Set(placements.map(p => p.student)).size,
        activePlacements: placements.filter(p => p.is_active).length,
        pendingReviews: 0, // This would come from a separate API call
        completedPlacements: placements.filter(p => !p.is_active).length,
      });
      
      setRecentPlacements(placements.slice(0, 5));
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
        <h1 className="text-2xl font-bold text-gray-900">Academic Supervisor Dashboard</h1>
        <p className="text-gray-500">Overview of all students and placements</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
              <Briefcase className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Active Placements</p>
              <p className="text-2xl font-bold">{stats.activePlacements}</p>
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
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-