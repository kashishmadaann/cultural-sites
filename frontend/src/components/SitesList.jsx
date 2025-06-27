import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaMapMarkerAlt } from 'react-icons/fa';
import useFavorites from '../hooks/useFavorites';
import { useAuth } from '../contexts/AuthContext';

const SitesList = ({ sites }) => {
  const { user } = useAuth();
  const { addFavorite, removeFavorite, isFavorited } = useFavorites();
  const [favoriteLoading, setFavoriteLoading] = useState({});

  const handleFavoriteClick = async (siteId, e) => {
    e.preventDefault(); // Prevent navigation when clicking the favorite button
    if (!user) {
      // Redirect to login if not authenticated
      window.location.href = '/login';
      return;
    }

    setFavoriteLoading(prev => ({ ...prev, [siteId]: true }));
    try {
      if (isFavorited(siteId)) {
        await removeFavorite(siteId);
      } else {
        await addFavorite(siteId);
      }
    } finally {
      setFavoriteLoading(prev => ({ ...prev, [siteId]: false }));
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sites.map((site) => (
        <Link
          key={site._id}
          to={`/sites/${site._id}`}
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
        >
          {site.imageUrl && (
            <div className="relative">
              <img
                src={site.imageUrl}
                alt={site.name}
                className="w-full h-48 object-cover"
              />
              <button
                onClick={(e) => handleFavoriteClick(site._id, e)}
                className={`absolute top-2 right-2 p-2 rounded-full ${
                  isFavorited(site._id)
                    ? 'bg-red-500 text-white'
                    : 'bg-white text-gray-600 hover:text-red-500'
                } transition-colors`}
                disabled={favoriteLoading[site._id]}
                title={user ? (isFavorited(site._id) ? 'Remove from favorites' : 'Add to favorites') : 'Login to add favorites'}
              >
                {favoriteLoading[site._id] ? (
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : isFavorited(site._id) ? (
                  <FaHeart className="w-5 h-5" />
                ) : (
                  <FaRegHeart className="w-5 h-5" />
                )}
              </button>
            </div>
          )}
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-2">{site.name}</h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {site.description}
            </p>
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center text-sm text-gray-500">
                <FaMapMarkerAlt className="mr-1" />
                {site.category}
              </span>
              <span className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View Details
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default SitesList; 