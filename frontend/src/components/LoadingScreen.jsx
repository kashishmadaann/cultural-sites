import React from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-emerald-50 via-violet-50 to-rose-100 z-50 flex flex-col items-center justify-center">
      <div className="flex flex-col items-center space-y-6">
        <div className="relative">
          <span className="bg-gradient-to-tr from-emerald-400 to-violet-500 p-4 rounded-full shadow-xl flex items-center justify-center">
            <FaMapMarkerAlt className="w-16 h-16 text-white drop-shadow-lg animate-bounce" />
          </span>
          <div className="absolute inset-0 bg-emerald-400 opacity-20 rounded-full animate-ping"></div>
        </div>
        <h2 className="text-3xl font-extrabold bg-gradient-to-tr from-emerald-500 via-violet-500 to-rose-400 bg-clip-text text-transparent tracking-tight drop-shadow">
          Chemnitz Cultural Sites
        </h2>
        <div className="flex space-x-3 mt-2">
          <div className="w-4 h-4 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-4 h-4 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-4 h-4 bg-rose-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
        <span className="mt-4 text-slate-600 text-base font-medium tracking-wide animate-pulse">
          Loading, please wait...
        </span>
      </div>
    </div>
  );
};

export default LoadingScreen;