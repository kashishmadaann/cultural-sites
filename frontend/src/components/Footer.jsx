import React from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-teal-50 via-emerald-50 to-violet-100 border-t-2 border-emerald-200 mt-auto">
      <div className="container mx-auto px-4 py-10">
        <div className="text-center">
          <Link
            to="/"
            className="flex items-center justify-center space-x-3 text-3xl font-extrabold text-emerald-700 hover:text-violet-700 transition-colors tracking-tight"
          >
            <span className="bg-gradient-to-tr from-emerald-400 to-violet-500 p-2 rounded-full shadow-lg">
              <FaMapMarkerAlt className="w-7 h-7 text-white" />
            </span>
            <span className="bg-gradient-to-tr from-emerald-400 to-violet-500 bg-clip-text text-transparent">
              Chemnitz Cultural Sites
            </span>
          </Link>
          <p className="mt-5 text-lg text-slate-700 font-medium">
            Discover and explore the vibrant cultural heritage of Chemnitz.
          </p>
          <p className="mt-8 text-slate-500 text-sm flex items-center justify-center gap-1">
            Made with
            <span className="animate-pulse text-rose-500 text-lg">♥</span>
            by the Chemnitz Culture Team
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;