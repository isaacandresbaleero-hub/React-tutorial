import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPlacements, deletePlacement } from '../../api/client';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import { Plus, Eye, Edit, Trash2, Building, Calendar, User } from 'lucide-react';

function PlacementList() {
  const { user } = useAuth();
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchPlacements();
  }, []);

  const fetchPlacements = async () => {
    try {
      const response = await getPlacements();
      setPlacements(response.data);
    } catch (error) {
      toast.error('Failed to fetch placements');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this placement?')) {
      try {
        await deletePlacement(id);
        toast.success('Placement deleted successfully');
        fetchPlacements();
      } catch (error) {
        toast.error('Failed to delete placement');
      }
    }
  };

  const filteredPlacements = placements.filter(placement => {
    if (filter === 'active') return placement.is_active;
    if (filter === 'completed') return !placement.is_active;
    return true;
  });

  if (loading) {
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Internship Placements</h1>
          <p className="mt-1 text-sm text-gray-500">Manage and track all internship placements</p>
        </div>
        {(user?.role === 'acad_supervisor' || user?.role === 'admin') && (
          <div className="mt-3 sm:mt-0">
            <Link to="/placements/new" className="btn-primary inline-flex items-center">
              <Plus className="mr-2 h-4 w-4" />
              New Placement
            </Link>
          </div>
        )}
      </div>

      <div className="mb-6 flex space-x-2">
        <button onClick={() => setFilter('all')} className={`px-3 py-1 rounded-md text-sm ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>
          All
        </button>
        <button onClick={() => setFilter('active')} className={`px-3 py-1 rounded-md text-sm ${filter === 'active' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}>
          Active
        </button>
        <button onClick={() => setFilter('completed')} className={`px-3 py-1 rounded-md text-sm ${filter === 'completed' ? 'bg-gray-600 text-white' : 'bg-gray-200 text-gray-700'}`}>
          Completed
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredPlacements.length === 0 ? (
            <li className="px-6 py-12 text-center text-gray-500">
              No placements found
            </li>
          ) : (
            filteredPlacements.map((placement) => (
              <li key={placement.id} className="hover:bg-gray-50">
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <Building className="h-5 w-5 text-gray-400 mr-2" />
                        <h3 className="text-lg font-medium text-blue-600">
                          {placement.organization_name}
                        </h3>
                        <span className={`ml-3 px-2 py-1 text-xs rounded-full ${placement.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {placement.is_active ? 'Active' : 'Completed'}
                        </span>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex space-y-2 sm:space-y-0 sm:space-x-6">
                          <div className="flex items-center text-sm text-gray-500">
                            <User className="flex-shrink-0 mr-1.5 h-4 w-4" />
                            Student: {placement.student_username || `ID: ${placement.student}`}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4" />
                            {placement.start_date} - {placement.end_date}
                          </div>
                        </div>
                        <div className="mt-2 sm:mt-0 flex space-x-3">
                          <Link to={`/placements/${placement.id}`} className="text-blue-600 hover:text-blue-800">
                            <Eye className="h-5 w-5" />
                          </Link>
                          {(user?.role === 'acad_supervisor' || user?.role === 'admin') && (
                            <>
                              <Link to={`/placements/${placement.id}/edit`} className="text-gray-600 hover:text-gray-800">
                                <Edit className="h-5 w-5" />
                              </Link>
                              <button onClick={() => handleDelete(placement.id)} className="text-red-600 hover:text-red-800">
                                <Trash2 className="h-5 w-5" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

export default PlacementList;