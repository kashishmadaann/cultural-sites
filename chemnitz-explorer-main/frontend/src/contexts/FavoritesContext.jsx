import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/api';
import { useAuth } from './AuthContext';

const FavoritesContext = createContext({
  favorites: [],
  loading: false,
  error: null,
  addFavorite: () => {},
  removeFavorite: () => {},
  isFavorite: () => false,
});

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!isAuthenticated) {
        setFavorites([]);
        return;
      }

      try {
        setLoading(true);
        const response = await api.get('/favorites');
        setFavorites(response.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch favorites');
        console.error('Error fetching favorites:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [isAuthenticated]);

  const addFavorite = async (siteId) => {
    try {
      setLoading(true);
      const response = await api.post(`/favorites/${siteId}`);
      setFavorites(prev => [...prev, response.data]);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add favorite');
      console.error('Error adding favorite:', err);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (siteId) => {
    try {
      setLoading(true);
      await api.delete(`/favorites/${siteId}`);
      setFavorites(prev => prev.filter(fav => fav.siteId !== siteId));
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove favorite');
      console.error('Error removing favorite:', err);
    } finally {
      setLoading(false);
    }
  };

  const isFavorite = (siteId) => {
    return favorites.some(fav => fav.siteId === siteId);
  };

  const value = {
    favorites,
    loading,
    error,
    addFavorite,
    removeFavorite,
    isFavorite,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}; 