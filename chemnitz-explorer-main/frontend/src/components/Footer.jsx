import React from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-white border-t mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <Link to="/" className="flex items-center justify-center space-x-2 text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
            <FaMapMarkerAlt className="w-6 h-6" />
            <span>Chemnitz Cultural Sites</span>
          </Link>
          <p className="mt-4 text-gray-600">
            Discover and explore the rich cultural heritage of Chemnitz.
          </p>
          <p className="mt-6 text-gray-600 text-sm">
            Made with <span className="text-yellow-500">❤</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 