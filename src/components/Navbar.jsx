import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, Search, Menu, ChevronDown, User, Settings, LogOut, Shield } from 'lucide-react';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="bg-white/98 backdrop-blur-md border-b border-gray-100 shadow-sm sticky top-0 z-40">
      <div className="px-4 md:px-6 py-3">
        <div className="flex items-center justify-between">
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu size={22} className="text-gray-600" />
          </button>

          {/* Left Side - Page Title (can be dynamic based on route) */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:block">
              <h1 className="text-xl font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Parent Dashboard
              </h1>
              <p className="text-xs text-gray-500">Monitor and protect your family</p>
            </div>
          </div>

          {/* Right side - User Menu & Actions */}
          <div className="flex items-center space-x-3 md:space-x-4">
            
            {/* Notification Bell */}
            {/* <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <Bell size={20} className="text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button> */}

            {/* User Profile Dropdown */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-2 md:space-x-3 hover:bg-gray-50 p-1.5 md:p-2 rounded-xl transition-all duration-200 border border-transparent hover:border-gray-200"
                >
                  <div className="w-8 h-8 md:w-9 md:h-9 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold shadow-md">
                    {user.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div className="text-left hidden sm:block">
                    <p className="font-semibold text-sm text-gray-800">
                      {user.name?.split(' ')[0] || user.email?.split('@')[0]}
                    </p>
                    <p className="text-xs text-gray-500">
                      {user.role === 'admin' ? (
                        <span className="flex items-center gap-1">
                          <Shield size={10} /> Administrator
                        </span>
                      ) : (
                        'Parent Account'
                      )}
                    </p>
                  </div>
                  <ChevronDown size={16} className="text-gray-400 hidden sm:block" />
                </button>

                {showDropdown && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setShowDropdown(false)}
                    ></div>
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-slideDown">
                      {/* User Info */}
                      <div className="p-4 bg-gradient-to-r from-indigo-50 to-cyan-50 border-b border-gray-100">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold shadow-md">
                            {user.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-800">{user.name || 'User'}</p>
                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Menu Items */}
                      <div className="p-2">
                        {/* <Link
                          to="/dashboard"
                          className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                          onClick={() => setShowDropdown(false)}
                        >
                          <User size={16} />
                          <span>Profile Settings</span>
                        </Link> */}
                        {/* <div className="border-t border-gray-100 my-1"></div> */}
                        <button
                          onClick={() => {
                            setShowDropdown(false);
                            handleLogout();
                          }}
                          className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <LogOut size={16} />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-cyan-500 text-white rounded-lg hover:shadow-lg transition-all hover:scale-105 font-medium"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {showMobileMenu && (
          <div className="md:hidden mt-3 pt-3 border-t border-gray-100 animate-slideDown">
            <div className="flex flex-col space-y-2">
              <Link
                to="/dashboard"
                className="px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setShowMobileMenu(false)}
              >
                Dashboard
              </Link>
              <Link
                to="/live-camera"
                className="px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setShowMobileMenu(false)}
              >
                Live Camera
              </Link>
              <Link
                to="/location"
                className="px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setShowMobileMenu(false)}
              >
                Location Tracking
              </Link>
              <Link
                to="/screen-time"
                className="px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setShowMobileMenu(false)}
              >
                Screen Time
              </Link>
              <Link
                to="/payment"
                className="px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setShowMobileMenu(false)}
              >
                Payments
              </Link>
              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  className="px-3 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Admin Panel
                </Link>
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;