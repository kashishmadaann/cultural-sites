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
    <div className="bg-gradient-to-br from-emerald-50 via-violet-50 to-rose-100 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300 border border-emerald-100">
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-extrabold text-emerald-700 tracking-tight">{site.name}</h3>
          <button
            onClick={handleFavoriteClick}
            className={`p-2 rounded-full border-2 ${
              isFavorited(site._id)
                ? 'text-rose-500 border-rose-200 bg-rose-50'
                : 'text-violet-400 border-violet-100 hover:text-rose-500 hover:border-rose-200'
            } transition-all shadow-sm`}
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
        <p className="text-xs font-semibold text-violet-600 mb-2 uppercase tracking-wider">{site.category}</p>
        <p className="text-slate-700 text-sm mb-3 truncate">
          {site.description.substring(0, 100)}
          {site.description.length > 100 && '...'}
        </p>
        <Link to={`/sites/${site._id}`}>
          <Button variant="primary" size="sm" className="mt-2 shadow bg-gradient-to-r from-emerald-400 to-violet-500 hover:from-emerald-500 hover:to-violet-600">
            View Details
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default SiteCard;