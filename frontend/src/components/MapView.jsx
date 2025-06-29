import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import api from '../api/api';
import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaLocationArrow, FaChevronDown } from 'react-icons/fa';
import useFavorites from '../hooks/useFavorites';
import { useAuth } from '../contexts/AuthContext';

// Fix for default marker icons
if (typeof window !== 'undefined') {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
}

// Custom circle marker styles for different categories (NEW COLOR SCHEME)
const categoryStyles = {
  museum: {
    color: '#06b6d4', // teal-500
    fillColor: '#06b6d4',
    fillOpacity: 0.75,
    radius: 10,
    weight: 3
  },
  church: {
    color: '#6366f1', // indigo-500
    fillColor: '#6366f1',
    fillOpacity: 0.75,
    radius: 10,
    weight: 3
  },
  monument: {
    color: '#f59e42', // amber-500
    fillColor: '#f59e42',
    fillOpacity: 0.75,
    radius: 10,
    weight: 3
  },
  gallery: {
    color: '#10b981', // emerald-500
    fillColor: '#10b981',
    fillOpacity: 0.75,
    radius: 10,
    weight: 3
  },
  artwork: {
    color: '#f43f5e', // rose-500
    fillColor: '#f43f5e',
    fillOpacity: 0.75,
    radius: 10,
    weight: 3
  },
  theatre: {
    color: '#a21caf', // violet-700
    fillColor: '#a21caf',
    fillOpacity: 0.75,
    radius: 10,
    weight: 3
  },
  'historic building': {
    color: '#64748b', // slate-500
    fillColor: '#64748b',
    fillOpacity: 0.75,
    radius: 10,
    weight: 3
  },
  default: {
    color: '#fbbf24', // yellow-400
    fillColor: '#fbbf24',
    fillOpacity: 0.75,
    radius: 10,
    weight: 3
  }
};

// Get style based on category
const getStyleForCategory = (category) => {
  if (!category) return categoryStyles.default;
  
  const normalizedCategory = category.toLowerCase();
  // Map specific categories to their styles
  if (normalizedCategory.includes('museum')) return categoryStyles.museum;
  if (normalizedCategory.includes('church')) return categoryStyles.church;
  if (normalizedCategory.includes('monument')) return categoryStyles.monument;
  if (normalizedCategory.includes('gallery')) return categoryStyles.gallery;
  if (normalizedCategory.includes('artwork') || normalizedCategory.includes('sculpture') || normalizedCategory.includes('mural') || normalizedCategory.includes('graffiti')) return categoryStyles.artwork;
  if (normalizedCategory.includes('theatre') || normalizedCategory.includes('theater')) return categoryStyles.theatre;
  if (normalizedCategory.includes('historic')) return categoryStyles['historic building'];
  
  return categoryStyles.default;
};

const MapView = () => {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const { user } = useAuth();
  const { addFavorite, removeFavorite, isFavorited } = useFavorites();
  const [userLocation, setUserLocation] = useState(null);
  const [showNearby, setShowNearby] = useState(false);

  useEffect(() => {
    const fetchSites = async () => {
      try {
        const response = await api.get('/sites');
        const sitesData = response.data?.data || [];
        
        if (!Array.isArray(sitesData)) {
          throw new Error('Invalid data format received from server');
        }

        const validSites = sitesData.filter(site => 
          site.latitude && 
          site.longitude && 
          !isNaN(site.latitude) && 
          !isNaN(site.longitude)
        );

        setSites(validSites);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching sites:', err);
        setError(err.response?.data?.error || err.message || 'Failed to load sites');
        setLoading(false);
      }
    };

    fetchSites();
  }, []);

  const filteredSites = sites.filter(site => 
    selectedCategory === null || site.category === selectedCategory
  );

  const categories = [...new Set(sites.map(site => site.category))].filter(Boolean);

  const handleCategoryClick = (category) => {
    setSelectedCategory(prev => prev === category ? null : category);
  };

  // Helper to calculate distance between two lat/lng points in meters
  function getDistanceFromLatLonInM(lat1, lon1, lat2, lon2) {
    function deg2rad(deg) {
      return deg * (Math.PI / 180);
    }
    const R = 6371e3; // Radius of the earth in meters
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in meters
    return d;
  }

  // Handler for GPS button
  const handleShowLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    // Check if we're on HTTPS or localhost
    const isSecure = window.location.protocol === 'https:' || window.location.hostname === 'localhost';
    if (!isSecure) {
      alert('Geolocation requires HTTPS. Please use HTTPS or localhost to access your location.');
      return;
    }

    // Show loading state
    setLocationLoading(true);

    // First attempt: Fast response with cached data
    const tryGetLocation = (attempt = 1) => {
      const options = {
        enableHighAccuracy: attempt === 1 ? false : true, // Try low accuracy first, then high
        timeout: attempt === 1 ? 15000 : 30000, // Shorter timeout for first attempt
        maximumAge: attempt === 1 ? 300000 : 60000 // Allow older cached data for first attempt
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setShowNearby(true);
          setLocationLoading(false);
        },
        (error) => {
          if (attempt === 1 && error.code === error.TIMEOUT) {
            // Try again with high accuracy if first attempt times out
            console.log('First attempt timed out, trying with high accuracy...');
            tryGetLocation(2);
            return;
          }

          let errorMessage = 'Unable to retrieve your location.';
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied. Please allow location access in your browser settings.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable. Please check your device settings.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out. This might be due to slow internet or GPS signal. Try moving to an open area or check your internet connection.';
              break;
            default:
              errorMessage = 'An unknown error occurred while getting your location.';
          }
          
          alert(errorMessage);
          setLocationLoading(false);
        },
        options
      );
    };

    tryGetLocation();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full p-4">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-center">
          <div className="text-red-600">
            <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-lg font-semibold">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (typeof window === 'undefined') {
    return null;
  }

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col mt-24">
      <div className="container mx-auto px-4 py-8 flex flex-col flex-grow">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 flex-shrink-0">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Cultural Sites Map</h1>
          <p className="text-gray-600">Explore cultural sites in your area</p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-6 flex-grow">
          {/* Mobile Dropdown */}
          <div className="lg:hidden relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full bg-white rounded-xl shadow-lg p-4 flex items-center justify-between"
            >
              <span className="font-semibold text-gray-800">
                {selectedCategory || 'All Categories'}
              </span>
              <FaChevronDown className={`transform transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg z-20">
                <div className="p-2">
                  <button
                    onClick={() => {
                      setSelectedCategory(null);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full p-3 rounded-lg text-left transition-all ${
                      selectedCategory === null
                        ? 'bg-blue-50 text-blue-700 font-medium shadow-sm'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => {
                        handleCategoryClick(category);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full p-3 rounded-lg text-left transition-all ${
                        selectedCategory === category
                          ? 'bg-blue-50 text-blue-700 font-medium shadow-sm'
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Desktop Sidebar */}
          <div className="hidden lg:block lg:w-72 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-[calc(4rem+1rem)]">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">Categories</h3>
                {selectedCategory && (
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                  >
                    Show All
                  </button>
                )}
              </div>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryClick(category)}
                    className={`w-full p-3 rounded-lg text-left transition-all ${
                      selectedCategory === category
                        ? 'bg-blue-50 text-blue-700 font-medium shadow-sm'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex-grow flex flex-col">
            <div className="flex justify-end mb-4">
              <button
                onClick={handleShowLocation}
                disabled={locationLoading}
                className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {locationLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Getting location...
                  </>
                ) : (
                  <>
                    <FaLocationArrow className="mr-2" /> Show My Location
                  </>
                )}
              </button>
            </div>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden flex-grow z-10 h-[calc(100vh-24rem)] md:h-[calc(100vh-16rem)]">
              <MapContainer
                center={[50.8278, 12.9242]}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
                className="rounded-xl z-10"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {userLocation && (
                  <>
                    {/* User location marker */}
                    <Marker position={[userLocation.lat, userLocation.lng]}>
                      <Popup>You are here</Popup>
                    </Marker>
                    {/* 1km radius circle */}
                    <Circle
                      center={[userLocation.lat, userLocation.lng]}
                      radius={1000}
                      pathOptions={{ color: 'blue', fillColor: 'blue', fillOpacity: 0.1 }}
                    />
                  </>
                )}
                {filteredSites.map((site) => {
                  const isNearby =
                    userLocation &&
                    getDistanceFromLatLonInM(
                      userLocation.lat,
                      userLocation.lng,
                      site.latitude,
                      site.longitude
                    ) <= 1000;
                  // Use a different color for nearby sites
                  const markerColor = isNearby ? '#ef4444' : getStyleForCategory(site.category).color;
                  return (
                    <CircleMarker
                      key={site._id}
                      center={[site.latitude, site.longitude]}
                      radius={getStyleForCategory(site.category).radius}
                      pathOptions={{
                        color: markerColor,
                        fillColor: markerColor,
                        fillOpacity: getStyleForCategory(site.category).fillOpacity,
                        weight: getStyleForCategory(site.category).weight,
                      }}
                      eventHandlers={{
                        mouseover: (e) => {
                          e.target.setStyle({ radius: 14, fillOpacity: 0.8 });
                        },
                        mouseout: (e) => {
                          e.target.setStyle({
                            radius: getStyleForCategory(site.category).radius,
                            fillOpacity: getStyleForCategory(site.category).fillOpacity,
                          });
                        },
                      }}
                    >
                      <Popup>
                        <div>
                          <h3 className="font-semibold">{site.name}</h3>
                          <p className="text-sm text-gray-600 mb-1">{site.category}</p>
                          <Link to={`/sites/${site._id}`} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                            View Details
                          </Link>
                        </div>
                      </Popup>
                    </CircleMarker>
                  );
                })}
              </MapContainer>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-gradient-to-r from-teal-50 to-indigo-50 rounded-2xl shadow-xl p-8 flex-shrink-0 border border-teal-100">
          <h3 className="text-2xl font-bold text-indigo-700 mb-6 tracking-wide">Map Legend</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Object.entries(categoryStyles).map(([category, style]) => (
              <div
                key={category}
                className="flex items-center space-x-4 p-3 rounded-xl bg-white/80 hover:bg-teal-50 transition-all shadow-sm border border-teal-100"
              >
                <div
                  className="w-6 h-6 rounded-full border-2 border-white shadow"
                  style={{ backgroundColor: style.color }}
                ></div>
                <span className="text-indigo-800 font-medium capitalize tracking-wide">{category.replace('_', ' ')}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;