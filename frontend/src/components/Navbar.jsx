import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaBars, FaTimes, FaMapMarkerAlt, FaHeart, FaUser } from 'react-icons/fa';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest('.relative')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    setTimeout(() => {
      window.location.href = '/';
    }, 100);
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-[9999] bg-gradient-to-r from-emerald-50 via-violet-50 to-rose-100 shadow-lg border-b-2 border-emerald-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo and main nav */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2 text-2xl font-extrabold bg-gradient-to-tr from-emerald-400 to-violet-500 bg-clip-text text-transparent tracking-tight hover:opacity-80 transition-all">
              <span className="bg-gradient-to-tr from-emerald-400 to-violet-500 p-2 rounded-full shadow-lg">
                <FaMapMarkerAlt className="w-6 h-6 text-white" />
              </span>
              <span>Chemnitz Cultural Sites</span>
            </Link>
            <div className="hidden md:flex space-x-6">
              <Link 
                to="/map" 
                className="text-violet-700 hover:text-emerald-600 font-semibold transition-all px-2 py-1 rounded-lg hover:bg-emerald-50"
              >
                Map View
              </Link>
              <Link 
                to="/sites" 
                className="text-violet-700 hover:text-emerald-600 font-semibold transition-all px-2 py-1 rounded-lg hover:bg-emerald-50"
              >
                All Sites
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-violet-700 hover:text-emerald-600 focus:outline-none"
            >
              {isMenuOpen ? (
                <FaTimes className="w-6 h-6" />
              ) : (
                <FaBars className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Right side - Auth buttons or user menu */}
          <div className="hidden md:flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-2 text-emerald-700 hover:text-violet-700 font-semibold transition-all px-3 py-1 rounded-lg hover:bg-violet-50"
                >
                  <FaHeart className="w-5 h-5" />
                  <span>Dashboard</span>
                </Link>
                <div className="relative">
                  <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-2 text-violet-700 hover:text-emerald-700 font-semibold transition-all px-3 py-1 rounded-lg hover:bg-emerald-50"
                  >
                    <FaUser className="w-5 h-5" />
                    <span>{user?.name}</span>
                    <svg
                      className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white/90 rounded-xl shadow-2xl py-2 border border-emerald-100 transform origin-top-right transition-all duration-200">
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsDropdownOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-violet-700 hover:bg-emerald-50 hover:text-emerald-700 font-semibold transition-all rounded-lg"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-violet-700 hover:text-emerald-700 font-semibold transition-all px-3 py-1 rounded-lg hover:bg-emerald-50"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-emerald-400 to-violet-500 text-white px-6 py-2 rounded-full hover:from-emerald-500 hover:to-violet-600 font-bold transition-all shadow-md hover:shadow-lg"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white/90 border-t border-emerald-100 mt-2 py-2 rounded-b-2xl shadow-xl">
            <div className="flex flex-col space-y-2 px-4">
              <Link
                to="/map"
                className="text-violet-700 hover:text-emerald-700 font-semibold py-2 transition-all rounded-lg hover:bg-emerald-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Map View
              </Link>
              <Link
                to="/sites"
                className="text-violet-700 hover:text-emerald-700 font-semibold py-2 transition-all rounded-lg hover:bg-emerald-50"
                onClick={() => setIsMenuOpen(false)}
              >
                All Sites
              </Link>
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className="text-emerald-700 hover:text-violet-700 font-semibold py-2 transition-all rounded-lg hover:bg-violet-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                      setTimeout(() => {
                        window.location.href = '/';
                      }, 100);
                    }}
                    className="text-left text-violet-700 hover:text-emerald-700 font-semibold py-2 transition-all rounded-lg hover:bg-emerald-50"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-violet-700 hover:text-emerald-700 font-semibold py-2 transition-all rounded-lg hover:bg-emerald-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="bg-gradient-to-r from-emerald-400 to-violet-500 text-white px-6 py-2 rounded-full hover:from-emerald-500 hover:to-violet-600 font-bold transition-all shadow-md hover:shadow-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;