import React from 'react';
import { Link } from 'react-router-dom';

const SiteList = ({ sites, onSiteClick, selectedSiteId }) => {
  return (
    <div className="bg-white rounded-lg shadow-md h-[300px] overflow-y-auto">
      <div className="p-4">
        <h3 className="font-semibold text-gray-700 mb-3">Sites List</h3>
        {sites.length === 0 ? (
          <p className="text-gray-500 text-sm">No sites found</p>
        ) : (
          <div className="space-y-2">
            {sites.map((site) => (
              <div
                key={site._id}
                onClick={() => onSiteClick(site)}
                className={`p-2 rounded cursor-pointer transition-colors ${
                  selectedSiteId === site._id
                    ? 'bg-indigo-100 border-l-4 border-indigo-500'
                    : 'hover:bg-gray-50'
                }`}
              >
                <h4 className="font-medium text-gray-800">{site.name}</h4>
                <p className="text-sm text-gray-600">{site.category}</p>
                {site.address && (
                  <p className="text-xs text-gray-500 mt-1">{site.address}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SiteList; 