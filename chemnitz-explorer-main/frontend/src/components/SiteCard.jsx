import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import useFavorites from '../hooks/useFavorites';
import { useAuth } from '../contexts/AuthContext';

const SiteCard = ({ site }) => {
  const { user } = useAuth();
  const { addFavorite, removeFavorite, isFavorited } = useFavorites();
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  if (!site) return null;

  const handleFavoriteClick = async (e) => {
    e.preventDefault(); // Prevent navigation when clicking the favorite button
    if (!user) {
      window.location.href = '/login';
      return;
    }

    setFavoriteLoading(true);
    try {
      if (isFavorited(site._id)) {
        await removeFavorite(site._id);
      } else {
        await addFavorite(site._id);
      }
    } finally {
      setFavoriteLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold text-gray-800">{site.name}</h3>
          <button
            onClick={handleFavoriteClick}
            className={`p-2 rounded-full ${
              isFavorited(site._id)
                ? 'text-red-500'
                : 'text-gray-400 hover:text-red-500'
            } transition-colors`}
            disabled={favoriteLoading}
            title={user ? (isFavorited(site._id) ? 'Remove from favorites' : 'Add to favorites') : 'Login to add favorites'}
          >
            {favoriteLoading ? (
              <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : isFavorited(site._id) ? (
              <FaHeart className="w-5 h-5" />
            ) : (
              <FaRegHeart className="w-5 h-5" />
            )}
          </button>
        </div>
        <p className="text-sm text-gray-500 mb-2">{site.category}</p>
        <p className="text-gray-700 text-sm mb-3 truncate">
          {site.description.substring(0, 100)}{site.description.length > 100 && '...'}
        </p>
        <Link to={`/sites/${site._id}`}>
          <Button variant="outline" size="sm">View Details</Button>
        </Link>
      </div>
    </div>
  );
};

export default SiteCard; 