import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/api';
import SiteDetails from '../components/SiteDetails';

const SitePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [site, setSite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSiteDetails = async () => {
      setLoading(true);
      try {
        // Validate ID format before making the request
        if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
          throw new Error('Invalid site ID format');
        }

        console.log('SitePage: Fetching site details for ID:', id);
        const response = await api.get(`/sites/${id}`);
        console.log('SitePage: API Response:', response.data);
        
        setSite(response.data.data);
        setError(null);
      } catch (err) {
        console.error("SitePage: Error fetching site details:", err);
        const errorMessage = err.response?.data?.error || err.message || "Could not load site information.";
        setError(errorMessage);
        setSite(null);
        
        // If it's an invalid ID format, redirect to sites list after a delay
        if (err.message === 'Invalid site ID format') {
          setTimeout(() => navigate('/sites'), 3000);
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSiteDetails();
    }
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p className="text-xl text-gray-600">Loading site details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 text-center">
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          {error === 'Invalid site ID format' && (
            <p className="text-gray-600 mb-4">Redirecting to sites list...</p>
          )}
          <Link
            to="/sites"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-150"
          >
            Back to Sites List
          </Link>
        </div>
      </div>
    );
  }

  if (!site) {
    return (
      <div className="container mx-auto p-4 text-center">
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Site Not Found</h2>
          <p className="text-gray-700 mb-4">The requested cultural site could not be found.</p>
          <Link
            to="/sites"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-150"
          >
            Back to Sites List
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Link
        to="/sites"
        className="text-indigo-600 hover:text-indigo-800 hover:underline mb-6 inline-block"
      >
        ← Back to Sites List
      </Link>
      <SiteDetails site={site} />
    </div>
  );
};

export default SitePage; 