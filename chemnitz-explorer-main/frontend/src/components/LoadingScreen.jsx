import React from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <FaMapMarkerAlt className="w-16 h-16 text-blue-600 animate-bounce" />
          <div className="absolute inset-0 bg-blue-600 opacity-20 rounded-full animate-ping"></div>
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Chemnitz Cultural Sites</h2>
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen; 