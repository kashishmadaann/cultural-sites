import React from 'react';

const MapControls = ({ 
  searchTerm, 
  onSearchChange, 
  selectedCategories, 
  onCategoryChange,
  categories 
}) => {
  return (
    <div className="bg-gradient-to-br from-emerald-50 via-violet-50 to-rose-100 p-6 rounded-2xl shadow-xl border border-emerald-100 mb-6">
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search sites..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full px-5 py-3 border-2 border-violet-200 rounded-xl focus:ring-4 focus:ring-emerald-200 focus:border-emerald-400 bg-white/80 text-lg placeholder:text-slate-400 transition-all"
        />
      </div>
      <div className="space-y-3">
        <h3 className="font-bold text-emerald-700 mb-2 tracking-wide">Filter by Category:</h3>
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <label
              key={category}
              className="flex items-center space-x-2 px-3 py-2 rounded-full bg-white/70 border border-violet-100 shadow hover:bg-emerald-50 transition-all cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedCategories.includes(category)}
                onChange={() => onCategoryChange(category)}
                className="accent-emerald-500 w-5 h-5 rounded focus:ring-emerald-400"
              />
              <span className="text-sm text-violet-700 font-medium capitalize">{category}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MapControls;