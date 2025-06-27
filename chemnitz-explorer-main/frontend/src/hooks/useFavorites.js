import { useState, useCallback } from 'react';
import api from '../api/api';

const useFavorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch user's favorites
  const fetchFavorites = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/favorites');
      setFavorites(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch favorites');
      console.error('Error fetching favorites:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Add a site to favorites
  const addFavorite = useCallback(async (siteId) => {
    try {
      setLoading(true);
      setError(null);
      await api.post(`/favorites/${siteId}`);
      await fetchFavorites();
      return true;
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to add favorite';
      setError(errMsg);
      console.error('Error adding favorite:', err, 'Response:', err.response?.data);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Remove a site from favorites
  const removeFavorite = useCallback(async (siteId) => {
    try {
      setLoading(true);
      setError(null);
      await api.delete(`/favorites/${siteId}`);
      await fetchFavorites();
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove favorite');
      console.error('Error removing favorite:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Check if a site is favorited
  const isFavorited = (siteId) => {
    if (!favorites || !Array.isArray(favorites)) return false;
    // Support both {site: {...}} and direct site objects
    return favorites.some(fav => {
      if (!fav) return false;
      if (fav.site && fav.site._id) return fav.site._id === siteId;
      if (fav._id) return fav._id === siteId;
      return false;
    });
  };

  return {
    favorites,
    loading,
    error,
    fetchFavorites,
    addFavorite,
    removeFavorite,
    isFavorited
  };
};

export default useFavorites; 