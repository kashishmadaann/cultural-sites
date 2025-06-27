import React, { useEffect, useState, useCallback } from 'react';
import api from '../api/api';
import SiteCard from '../components/SiteCard';

const SiteListPage = () => {
  const [sites, setSites] = useState([]);
  const [allSites, setAllSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);

  // Debounce function
  const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), delay);
    };
  };

  const fetchSites = async () => {
    try {
      setLoading(true);
      const response = await api.get('/sites');
      const fetchedSites = response.data.data || [];
      setAllSites(fetchedSites);
      setSites(fetchedSites);

      // Extract unique categories
      const uniqueCategories = [...new Set(fetchedSites.map(site => site.category).filter(Boolean))];
      setCategories(uniqueCategories);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch sites:", err);
      setError(err.response?.data?.error || err.message || "Could not fetch sites.");
      setSites([]);
      setAllSites([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSites();
  }, []);

  // Client-side filtering logic
  const applyFilters = useCallback(() => {
    let filtered = [...allSites];
    if (searchTerm) {
      filtered = filtered.filter(site =>
        site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        site.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedCategory) {
      filtered = filtered.filter(site => site.category === selectedCategory);
    }
    setSites(filtered);
  }, [allSites, searchTerm, selectedCategory]);

  // Debounced search input handler
  const debouncedApplyFilters = useCallback(debounce(applyFilters, 300), [applyFilters]);

  useEffect(() => {
    debouncedApplyFilters();
  }, [searchTerm, selectedCategory, debouncedApplyFilters]);

  if (loading) return <div className="container mx-auto p-4 text-center text-xl">Loading sites...</div>;
  if (error) return <div className="container mx-auto p-4 text-center text-red-500 text-xl">Error: {error}</div>;

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6 text-center">
        All Cultural Sites
      </h1>

      {/* Filter and Search Controls */}
      <div className="mb-8 p-4 bg-gray-100 rounded-lg shadow flex flex-col sm:flex-row gap-4 items-center">
        <input
          type="text"
          placeholder="Search by name or description..."
          className="form-input w-full sm:flex-grow px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="form-select w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {sites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sites.map((site) => (
            <SiteCard key={site._id} site={site} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600 text-xl py-10">
          No sites match your current filters. Try adjusting your search.
        </p>
      )}
    </div>
  );
};

export default SiteListPage; 