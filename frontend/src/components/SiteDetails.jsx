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
    console.log("SiteDetails: site prop is", site, "site._id is", site?._id);
    if (user) {
      fetchFavorites();
    }
  }, [user, fetchFavorites, site]);

  if (!site) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
          <div className="text-gray-600 text-center">
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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-800">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">{site.name}</h1>
                <div className="flex items-center space-x-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white">
                    <FaMapMarkerAlt className="mr-2" />
                    {site.category}
                  </span>
                  {site && site._id && (
                    <button
                      onClick={handleFavoriteClick}
                      className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors text-white"
                    >
                      {isFavorited(site._id) ? (
                        <>
                          <FaHeart className="mr-2 text-red-300" />
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
          <div className="p-6">
            {/* Description */}
            {site.description && (
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">About</h2>
                <p className="text-gray-600 leading-relaxed">{site.description}</p>
              </div>
            )}

            {/* Location */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Location</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <FaMapMarkerAlt className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-gray-800 font-medium">Coordinates</p>
                    <p className="text-gray-600">
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
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Additional Information</h2>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-600 whitespace-pre-line">{site.additionalInfo}</p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/sites"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
              >
                <FaArrowLeft className="mr-2" />
                Back to Sites
              </Link>
              {site.latitude && site.longitude && (
                <a
                  href={`https://www.google.com/maps?q=${site.latitude},${site.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-lg hover:shadow-xl"
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
                  className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl"
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