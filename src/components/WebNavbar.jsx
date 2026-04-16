import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaUser, FaSignOutAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';

const WebNavbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    checkLoginStatus();
    
    // Listen for storage changes (if user logs in/out in another tab)
    window.addEventListener('storage', checkLoginStatus);
    
    return () => {
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, []);

  const checkLoginStatus = () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.token) {
          setIsLoggedIn(true);
          setUserName(user.name || user.email || 'User');
          return;
        }
      } catch (e) {
        console.error("Error parsing user data:", e);
      }
    }
    setIsLoggedIn(false);
    setUserName('');
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUserName('');
    navigate('/');
    toast.success('Logged out successfully');
  };

  return (
    <header className="fixed top-0 w-full bg-white/98 backdrop-blur-md shadow-sm z-50">
      <nav className="max-w-6xl mx-auto flex justify-between items-center px-4 md:px-8 py-4">
        <Link to="/" className="text-2xl md:text-3xl font-black text-indigo-600 tracking-tight">
          Kid<span className="text-cyan-500">zet</span>.
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/features" className="text-gray-700 font-medium hover:text-indigo-600 transition-colors">Features</Link>
          <Link to="/pricing" className="text-gray-700 font-medium hover:text-indigo-600 transition-colors">Pricing</Link>
          {/* <Link to="/setup" className="text-gray-700 font-medium hover:text-indigo-600 transition-colors">Setup & Helps</Link> */}
          <Link to="/contact" className="text-gray-700 font-medium hover:text-indigo-600 transition-colors">Contact</Link>
        </div>

        <div className="hidden md:flex gap-6 items-center">
          {isLoggedIn ? (
            <>
              <Link to="/dashboard" className="text-gray-700 font-medium hover:text-indigo-600 transition-colors flex items-center gap-2">
                <FaUser className="w-4 h-4" />
                {userName}
              </Link>
              <button 
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-600 to-red-500 text-white px-5 py-2 rounded-full font-semibold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2"
              >
                <FaSignOutAlt className="w-3 h-3" />
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="text-gray-700 font-medium hover:text-indigo-600 transition-colors">Dashboard</Link>
              <Link to="/login" className="bg-gradient-to-r from-indigo-600 to-cyan-500 text-white px-5 py-2 rounded-full font-semibold text-sm shadow-md hover:shadow-lg transition-all">Log In</Link>
            </>
          )}
        </div>
        
        {/* Mobile Menu Button */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-gray-700 text-2xl"
        >
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </nav>
      
      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg py-4 px-6 flex flex-col gap-3 animate-slideDown">
          <Link to="/features" className="text-gray-700 font-semibold py-2 border-b border-gray-100" onClick={() => setMobileMenuOpen(false)}>Features</Link>
          <Link to="/pricing" className="text-gray-700 font-semibold py-2 border-b border-gray-100" onClick={() => setMobileMenuOpen(false)}>Pricing</Link>
          <Link to="/setup" className="text-gray-700 font-semibold py-2 border-b border-gray-100" onClick={() => setMobileMenuOpen(false)}>Setup & Helps</Link>
          <Link to="/contact" className="text-gray-700 font-semibold py-2 border-b border-gray-100" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
          
          {isLoggedIn ? (
            <>
              <Link to="/dashboard" className="text-indigo-600 font-bold py-2 flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                <FaUser className="w-4 h-4" />
                {userName}
              </Link>
              <button 
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="text-red-600 font-bold py-2 flex items-center gap-2 text-left"
              >
                <FaSignOutAlt className="w-4 h-4" />
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="text-gray-700 font-semibold py-2 border-b border-gray-100" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
              <Link to="/login" className="text-indigo-600 font-bold py-2" onClick={() => setMobileMenuOpen(false)}>Log In</Link>
            </>
          )}
        </div>
      )}

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: scaleY(0);
            transform-origin: top;
          }
          to {
            opacity: 1;
            transform: scaleY(1);
            transform-origin: top;
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </header>
  );
};

export default WebNavbar;