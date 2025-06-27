import React from 'react';

const MapControls = ({ 
  searchTerm, 
  onSearchChange, 
  selectedCategories, 
  onCategoryChange,
  categories 
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search sites..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div className="space-y-2">
        <h3 className="font-semibold text-gray-700 mb-2">Filter by Category:</h3>
        {categories.map((category) => (
          <label key={category} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selectedCategories.includes(category)}
              onChange={() => onCategoryChange(category)}
              className="rounded text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-sm text-gray-700">{category}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default MapControls; 