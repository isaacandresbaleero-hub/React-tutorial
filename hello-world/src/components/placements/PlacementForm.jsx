import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPlacement, createPlacement, updatePlacement } from '../../api/client';
import toast from 'react-hot-toast';
import { ArrowLeft, Save } from 'lucide-react';

function PlacementForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    student: '',
    academic_supervisor: '',
    organization_name: '',
    registration_number: '',
    course: '',
    start_date: '',
    end_date: '',
    academic_supervisor_email: '',
    workplace_supervisor_name: '',
    workplace_supervisor_email: '',
  });

  useEffect(() => {
    if (id) {
      fetchPlacement();
    }
  }, [id]);

  const fetchPlacement = async () => {
    try {
      const response = await getPlacement(id);
      setFormData(response.data);
    } catch (error) {
      toast.error('Failed to fetch placement');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (id) {
        await updatePlacement(id, formData);
        toast.success('Placement updated successfully');
      } else {
        await createPlacement(formData);
        toast.success('Placement created successfully');
      }
      navigate('/placements');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save placement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <button onClick={() => navigate('/placements')} className="inline-flex items-center text-blue-600 hover:text-blue-800">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Placements
        </button>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          {id ? 'Edit Placement' : 'New Placement'}
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Student ID</label>
              <input type="number" name="student" value={formData.student} onChange={handleChange} required className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Academic Supervisor ID</label>
              <input type="number" name="academic_supervisor" value={formData.academic_supervisor} onChange={handleChange} required className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Organization Name</label>
              <input type="text" name="organization_name" value={formData.organization_name} onChange={handleChange} required className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Registration Number</label>
              <input type="text" name="registration_number" value={formData.registration_number} onChange={handleChange} required className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Course</label>
              <input type="text" name="course" value={formData.course} onChange={handleChange} required className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <input type="date" name="start_date" value={formData.start_date} onChange={handleChange} required className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">End Date</label>
              <input type="date" name="end_date" value={formData.end_date} onChange={handleChange} required className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Academic Supervisor Email</label>
              <input type="email" name="academic_supervisor_email" value={formData.academic_supervisor_email} onChange={handleChange} required className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Workplace Supervisor Name</label>
              <input type="text" name="workplace_supervisor_name" value={formData.workplace_supervisor_name} onChange={handleChange} required className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Workplace Supervisor Email</label>
              <input type="email" name="workplace_supervisor_email" value={formData.workplace_supervisor_email} onChange={handleChange} required className="input" />
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button type="button" onClick={() => navigate('/placements')} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary">
              <Save className="inline mr-2 h-4 w-4" />
              {loading ? 'Saving...' : 'Save Placement'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PlacementForm;


