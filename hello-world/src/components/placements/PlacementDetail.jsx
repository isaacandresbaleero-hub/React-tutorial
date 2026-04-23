import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPlacement } from '../../api/client';
import toast from 'react-hot-toast';
import { ArrowLeft, Building, Calendar, Mail, User, BookOpen, FileText } from 'lucide-react';

function PlacementDetail() {
  const { id } = useParams();
  const [placement, setPlacement] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlacement();
  }, [id]);

  const fetchPlacement = async () => {
    try {
      const response = await getPlacement(id);
      setPlacement(response.data);
    } catch (error) {
      toast.error('Failed to fetch placement details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

  if (!placement) {
    return <div className="text-center py-12 text-gray-500">Placement not found</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <Link to="/placements" className="inline-flex items-center text-blue-600 hover:text-blue-800">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Placements
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
          <h1 className="text-2xl font-bold text-gray-900">{placement.organization_name}</h1>
          <p className="text-gray-600 mt-1">Registration: {placement.registration_number}</p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Building className="h-5 w-5 mr-2 text-blue-600" />
                Organization Details
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Organization Name</p>
                  <p className="font-medium">{placement.organization_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Registration Number</p>
                  <p className="font-medium">{placement.registration_number}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Course</p>
                  <p className="font-medium">{placement.course}</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                Internship Period
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Start Date</p>
                  <p className="font-medium">{placement.start_date}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">End Date</p>
                  <p className="font-medium">{placement.end_date}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span className={`inline-flex px-2 py-1 text-xs rounded-full ${placement.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {placement.is_active ? 'Active' : 'Completed'}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="h-5 w-5 mr-2 text-blue-600" />
                Academic Supervisor
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{placement.academic_supervisor_name || `ID: ${placement.academic_supervisor}`}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{placement.academic_supervisor_email}</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="h-5 w-5 mr-2 text-blue-600" />
                Workplace Supervisor
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{placement.workplace_supervisor_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{placement.workplace_supervisor_email}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t">
            <Link to={`/placements/${placement.id}/logs`} className="btn-primary inline-flex items-center">
              <FileText className="mr-2 h-4 w-4" />
              View Weekly Logs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlacementDetail;