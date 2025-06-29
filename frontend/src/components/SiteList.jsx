import React from 'react';
import { Link } from 'react-router-dom';

const SiteList = ({ sites, onSiteClick, selectedSiteId }) => {
  return (
    <div className="bg-gradient-to-br from-emerald-50 via-violet-50 to-rose-100 rounded-2xl shadow-xl h-[300px] overflow-y-auto border border-emerald-100">
      <div className="p-4">
        <h3 className="font-extrabold text-emerald-700 mb-3 tracking-wide">Sites List</h3>
        {sites.length === 0 ? (
          <p className="text-violet-500 text-sm">No sites found</p>
        ) : (
          <div className="space-y-2">
            {sites.map((site) => (
              <div
                key={site._id}
                onClick={() => onSiteClick(site)}
                className={`p-3 rounded-xl cursor-pointer transition-all ${
                  selectedSiteId === site._id
                    ? 'bg-gradient-to-r from-emerald-200 via-violet-200 to-rose-200 border-l-4 border-emerald-500 shadow'
                    : 'hover:bg-white/70 hover:shadow-md'
                }`}
              >
                <h4 className="font-bold text-violet-700">{site.name}</h4>
                <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">{site.category}</p>
                {site.address && (
                  <p className="text-xs text-slate-500 mt-1">{site.address}</p>
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