import api from '../api/api';
import React, { createContext, useContext, useState, useEffect } from 'react';

// Create context with a default value
const AuthContext = createContext({
  user: null,
  loading: true,
  error: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  isAuthenticated: false
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for token and fetch user on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      console.log('AuthProvider: Initial mount, token exists:', !!token);
      
      if (token) {
        console.log('AuthProvider: Setting auth header with token');
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        await fetchCurrentUser();
      } else {
        console.log('AuthProvider: No token found, skipping user fetch');
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      console.log('AuthProvider: Fetching current user...');
      console.log('AuthProvider: Current auth header:', api.defaults.headers.common['Authorization']);
      
      const response = await api.get('/auth/me');
      console.log('AuthProvider: Current user response:', response.data);
      
      if (response.data.success && response.data.data) {
        setUser(response.data.data);
        setError(null);
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (err) {
      console.error('AuthProvider: Error fetching current user:', err);
      console.error('AuthProvider: Error details:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message
      });
      
      setUser(null);
      setError(err.response?.data?.error || 'Failed to fetch user data');
      // Clear invalid token
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      console.log('Attempting login with credentials:', { email: credentials.email });
      setLoading(true);
      const response = await api.post('/auth/login', credentials);
      console.log('Login response:', response.data);
      
      const { token, data: user } = response.data;
      console.log('Extracted token and user:', { hasToken: !!token, user });
      
      // Store token
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Set user state
      setUser(user);
      setError(null);
      
      // Fetch user details to ensure we have the latest data
      await fetchCurrentUser();
      
      return user;
    } catch (err) {
      console.error('Login error:', err);
      const errorMessage = err.response?.data?.error || 'Login failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await api.post('/auth/register', userData);
      const { token, data: user } = response.data;
      
      // Store token
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(user);
      setError(null);
      return user;
    } catch (err) {
      console.error('Registration error:', err);
      const errorMessage = err.response?.data?.error || 'Registration failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    console.log('AuthContext: Logout called');
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    setError(null);
    setLoading(false); // Ensure loading is false after logout
    console.log('AuthContext: Logout completed, user cleared');
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user
  };

  // Remove the loading check and always render children
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;