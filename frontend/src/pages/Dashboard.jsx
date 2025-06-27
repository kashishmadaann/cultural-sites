import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import useFavorites from '../hooks/useFavorites';
import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaMapMarkerAlt } from 'react-icons/fa';
import { FaHeart as FaHeartSolid } from 'react-icons/fa';

const Dashboard = () => {
  const { user } = useAuth();
  const { favorites, loading, error, fetchFavorites, removeFavorite } = useFavorites();
  const [activeTab, setActiveTab] = useState('favorites');

  useEffect(() => {
    if (user) {
      fetchFavorites();
    }
  }, [user, fetchFavorites]);

  useEffect(() => {
    console.log("Dashboard: sites prop (or site) is", favorites, "site.imageUrl (if available) is", favorites?.map(favorite => favorite?.site?.imageUrl));
  }, [fetchFavorites, favorites]);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please log in to view your dashboard</h2>
          <Link to="/login" className="text-blue-600 hover:text-blue-800">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
          <div className="text-red-600 text-center">
            <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-lg font-semibold">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Welcome to Cultural Sites</h1>
          <p className="text-gray-600">Discover and explore cultural heritage sites in your area</p>
        </div>

        {/* Favorites Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">My Favorites</h2>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : favorites.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((favorite) => {
                const site = favorite?.site || favorite;
                if (!site || !site._id) {
                  console.log("Dashboard: Skipping favorite item (missing site or _id) for favorite", favorite);
                  return null;
                }
                return (
                  <div key={site._id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg text-gray-800">{site.name}</h3>
                      <button
                        onClick={() => removeFavorite(site._id)}
                        className="text-red-500 hover:text-red-600 transition-colors p-2"
                      >
                        <FaHeart className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">No favorites yet. Start exploring to add some!</p>
            </div>
          )}
        </div>

        {/* All Sites Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">All Cultural Sites</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites && favorites.length > 0 ? (
              favorites.map(site => (
                site && site._id ? (
                  <div key={site._id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                    {site.imageUrl && (
                      <img 
                        src={site.imageUrl} 
                        alt={site.name} 
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <div className="p-4">
                      <h3 className="font-semibold text-lg text-gray-800 mb-2">{site.name}</h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{site.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center text-sm text-gray-500">
                          <FaMapMarkerAlt className="mr-1" />
                          {site.category}
                        </span>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => removeFavorite(site._id)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-2"
                          >
                            <FaHeart className="w-5 h-5 text-red-500" />
                          </button>
                          <Link 
                            to={`/sites/${site._id}`}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-600">No sites available at the moment.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 