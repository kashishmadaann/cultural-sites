import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../contexts/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';

const Admin = () => {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchSites();
  }, [isAuthenticated, navigate]);

  const fetchSites = async () => {
    try {
      const response = await api.get('/sites');
      setSites(response.data?.data || []);
    } catch (error) {
      console.error('Error fetching sites:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSiteImage = async (siteId, imageUrl) => {
    setUpdating(siteId);
    try {
      await api.put(`/sites/${siteId}`, { imageUrl });
      setSites(sites.map(site => 
        site._id === siteId ? { ...site, imageUrl } : site
      ));
      alert('Image updated successfully!');
    } catch (error) {
      console.error('Error updating image:', error);
      alert('Error updating image');
    } finally {
      setUpdating(null);
    }
  };

  const removeSiteImage = async (siteId) => {
    if (!window.confirm('Are you sure you want to remove this image?')) {
      return;
    }
    setUpdating(siteId);
    try {
      await api.put(`/sites/${siteId}`, { imageUrl: null });
      setSites(sites.map(site => 
        site._id === siteId ? { ...site, imageUrl: null } : site
      ));
      alert('Image removed successfully!');
    } catch (error) {
      console.error('Error removing image:', error);
      alert('Error removing image');
    } finally {
      setUpdating(null);
    }
  };

  const handleImageSubmit = (e, siteId) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const imageUrl = formData.get('imageUrl');
    if (imageUrl) {
      updateSiteImage(siteId, imageUrl);
      e.target.reset();
    }
  };

  if (!isAuthenticated) {
    return null; // Will be redirected by useEffect
  }

  if (loading) return <div className="p-8">Loading sites...</div>;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Admin - Manage Site Images</h1>
      
      <div className="space-y-6">
        {sites.map(site => (
          <div key={site._id} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3">
                {site.imageUrl ? (
                  <div className="relative">
                    <img
                      src={site.imageUrl}
                      alt={site.name}
                      className="w-full h-48 object-cover rounded"
                    />
                    <button
                      onClick={() => removeSiteImage(site._id)}
                      disabled={updating === site._id}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 disabled:opacity-50"
                      title="Remove image"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div className="w-full h-48 bg-gray-100 rounded flex items-center justify-center text-gray-400">
                    No image
                  </div>
                )}
              </div>
              
              <div className="md:w-2/3">
                <h3 className="text-xl font-semibold mb-2">{site.name}</h3>
                <p className="text-gray-600 mb-4">{site.category}</p>
                
                <form onSubmit={(e) => handleImageSubmit(e, site._id)} className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Image URL:</label>
                    <input
                      type="url"
                      name="imageUrl"
                      placeholder="https://example.com/image.jpg"
                      defaultValue={site.imageUrl || ''}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={updating === site._id}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                      {updating === site._id ? 'Updating...' : 'Update Image'}
                    </button>
                    {site.imageUrl && (
                      <button
                        type="button"
                        onClick={() => removeSiteImage(site._id)}
                        disabled={updating === site._id}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                      >
                        {updating === site._id ? 'Removing...' : 'Remove Image'}
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Wrap the component with ProtectedRoute
const ProtectedAdmin = () => (
  <ProtectedRoute>
    <Admin />
  </ProtectedRoute>
);

export default ProtectedAdmin; 