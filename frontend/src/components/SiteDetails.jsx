import React, { useState, useEffect } from 'react';
import MapDisplay from './Map';
import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaMapMarkerAlt, FaArrowLeft, FaExternalLinkAlt, FaMap } from 'react-icons/fa';
import useFavorites from '../hooks/useFavorites';
import { useAuth } from '../contexts/AuthContext';

const SiteDetails = ({ site }) => {
  const { user } = useAuth();
  const { addFavorite, removeFavorite, isFavorited, fetchFavorites } = useFavorites();
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchFavorites();
    }
  }, [user, fetchFavorites, site]);

  if (!site) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-violet-50 to-rose-100 flex items-center justify-center">
        <div className="bg-white/90 p-8 rounded-3xl shadow-2xl max-w-md w-full border-2 border-rose-200">
          <div className="text-slate-600 text-center">
            <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-lg font-semibold">Site not found</p>
          </div>
        </div>
      </div>
    );
  }

  const position = site.latitude && site.longitude ? [site.latitude, site.longitude] : null;

  const handleFavoriteClick = async () => {
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-violet-50 to-rose-100">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white/90 rounded-3xl shadow-2xl overflow-hidden border-2 border-emerald-100">
          {/* Header Section */}
          <div className="p-8 bg-gradient-to-r from-emerald-400 via-violet-400 to-rose-400">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-4xl font-extrabold text-white mb-2 drop-shadow tracking-tight">{site.name}</h1>
                <div className="flex items-center space-x-4">
                  <span className="inline-flex items-center px-4 py-1 rounded-full bg-white/30 backdrop-blur-sm text-emerald-800 font-semibold shadow">
                    <FaMapMarkerAlt className="mr-2 text-violet-500" />
                    {site.category}
                  </span>
                  {site && site._id && (
                    <button
                      onClick={handleFavoriteClick}
                      className={`inline-flex items-center px-4 py-1 rounded-full bg-white/30 backdrop-blur-sm hover:bg-white/50 transition-colors font-semibold shadow ${
                        isFavorited(site._id)
                          ? 'text-rose-500'
                          : 'text-violet-700'
                      }`}
                      disabled={favoriteLoading}
                    >
                      {favoriteLoading ? (
                        <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                      ) : isFavorited(site._id) ? (
                        <>
                          <FaHeart className="mr-2" />
                          <span>Favorited</span>
                        </>
                      ) : (
                        <>
                          <FaRegHeart className="mr-2" />
                          <span>Add to Favorites</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8">
            {/* Description */}
            {site.description && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-emerald-700 mb-4 tracking-wide">About</h2>
                <p className="text-slate-700 leading-relaxed">{site.description}</p>
              </div>
            )}

            {/* Location */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-emerald-700 mb-4 tracking-wide">Location</h2>
              <div className="bg-gradient-to-r from-violet-50 to-emerald-50 rounded-xl p-4 border border-emerald-100">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <FaMapMarkerAlt className="w-6 h-6 text-violet-500" />
                  </div>
                  <div>
                    <p className="text-emerald-800 font-semibold">Coordinates</p>
                    <p className="text-slate-700">
                      Latitude: {site.latitude}<br />
                      Longitude: {site.longitude}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            {site.additionalInfo && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-emerald-700 mb-4 tracking-wide">Additional Information</h2>
                <div className="bg-gradient-to-r from-violet-50 to-emerald-50 rounded-xl p-4 border border-violet-100">
                  <p className="text-slate-700 whitespace-pre-line">{site.additionalInfo}</p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/sites"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-400 to-violet-500 text-white rounded-full hover:from-emerald-500 hover:to-violet-600 font-bold transition-all shadow-md hover:shadow-lg"
              >
                <FaArrowLeft className="mr-2" />
                Back to Sites
              </Link>
              {site.latitude && site.longitude && (
                <a
                  href={`https://www.google.com/maps?q=${site.latitude},${site.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-violet-400 to-rose-400 text-white rounded-full hover:from-violet-500 hover:to-rose-500 font-bold transition-all shadow-md hover:shadow-lg"
                >
                  <FaMap className="mr-2" />
                  Show on Map
                </a>
              )}
              {site.website && (
                <a
                  href={site.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-400 to-rose-400 text-white rounded-full hover:from-emerald-500 hover:to-rose-500 font-bold transition-all shadow-md hover:shadow-lg"
                >
                  <FaExternalLinkAlt className="mr-2" />
                  Go to Website
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiteDetails;