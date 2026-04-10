import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { ref, set } from "firebase/database";
import { auth, googleProvider, database } from "../firebase";
import { FcGoogle } from "react-icons/fc";
import { FaGooglePlay, FaApple } from "react-icons/fa";
import { 
  FaVideo as FaVideoIcon, 
  FaMapMarkerAlt as FaLocationIcon, 
  FaClock as FaClockIcon, 
  FaBan as FaBanIcon 
} from "react-icons/fa";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Helper function to refresh token and update localStorage
  const refreshAndUpdateToken = async (user) => {
    if (!user) return null;
    
    try {
      const newToken = await user.getIdToken(true); // Force refresh
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      
      const updatedUserData = {
        ...userData,
        token: newToken,
        tokenExpiry: Date.now() + 55 * 60 * 1000 // Set expiry to 55 minutes from now
      };
      
      localStorage.setItem("user", JSON.stringify(updatedUserData));
      return newToken;
    } catch (error) {
      console.error("Error refreshing token:", error);
      return null;
    }
  };

  // Set up token refresh interval
  useEffect(() => {
    // Check for existing user and set up auto-refresh
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Initial token setup
        await refreshAndUpdateToken(user);
        
        // Set up interval to refresh token every 50 minutes (before 1-hour expiry)
        const intervalId = setInterval(async () => {
          const currentUser = auth.currentUser;
          if (currentUser) {
            await refreshAndUpdateToken(currentUser);
            console.log("Token refreshed automatically");
          }
        }, 50 * 60 * 1000); // 50 minutes
        
        // Cleanup interval on unmount
        return () => clearInterval(intervalId);
      }
    });
    
    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Get fresh token
      const idToken = await user.getIdToken();

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/sync`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          provider: "google",
        }),
      });

      const data = await response.json();
      if (!data.success) throw new Error(data.message || "Failed to sync user");

      const userData = {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        subscription: "free_trial",
        token: idToken,
        tokenExpiry: Date.now() + 55 * 60 * 1000, // Store expiry time
        role: data.user?.role || "user",
      };

      localStorage.setItem("user", JSON.stringify(userData));

      toast.success(`Welcome, ${user.displayName || user.email}!`);
      
      const vps_response = await axios.post(
        "https://serv2.kidzet.com/user/sync-profile",
        {},
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );

      console.log("API Response:", vps_response.data);

      const redirectPath = '/dashboard';
      navigate(redirectPath);
      
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Google login failed");
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: FaVideoIcon, title: "Live Camera", description: "See your child's surroundings instantly" },
    { icon: FaLocationIcon, title: "Live Location", description: "Real-time GPS tracking" },
    { icon: FaClockIcon, title: "Screen Time", description: "Set daily usage limits" },
    { icon: FaBanIcon, title: "App Blocker", description: "Block distracting apps" }
  ];

  return (
    <div className="font-['Inter',system-ui,sans-serif] bg-white min-h-screen">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/98 backdrop-blur-md shadow-sm z-50">
        <nav className="max-w-6xl mx-auto flex justify-between items-center px-4 md:px-8 py-4">
          <Link to="/" className="text-2xl md:text-3xl font-black text-indigo-600 tracking-tight">
            Kid<span className="text-cyan-500">zet</span>.
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <Link to="/features" className="text-gray-700 font-medium hover:text-indigo-600 transition-colors">Features</Link>
            <Link to="/pricing" className="text-gray-700 font-medium hover:text-indigo-600 transition-colors">Pricing</Link>
            <Link to="/setup" className="text-gray-700 font-medium hover:text-indigo-600 transition-colors">Setup & Helps</Link>
            <Link to="/contact" className="text-gray-700 font-medium hover:text-indigo-600 transition-colors">Contact</Link>
          </div>
          
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-700 text-2xl"
          >
            <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </button>
        </nav>
        
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 shadow-lg py-4 px-6 flex flex-col gap-3 animate-slideDown">
            <Link to="/features" className="text-gray-700 font-semibold py-2 border-b border-gray-100" onClick={() => setMobileMenuOpen(false)}>Features</Link>
            <Link to="/pricing" className="text-gray-700 font-semibold py-2 border-b border-gray-100" onClick={() => setMobileMenuOpen(false)}>Pricing</Link>
            <Link to="/setup" className="text-gray-700 font-semibold py-2 border-b border-gray-100" onClick={() => setMobileMenuOpen(false)}>Setup & Helps</Link>
            <Link to="/contact" className="text-gray-700 font-semibold py-2 border-b border-gray-100" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 via-indigo-600 to-indigo-400 pt-32 pb-20 md:pt-36 md:pb-24 px-4 relative">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12 relative z-10">
          {/* Left Side - Content */}
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
              Welcome to <br /><span className="text-cyan-200">Kidzet</span>
            </h1>
            <p className="text-white/90 text-lg md:text-xl mt-6 max-w-lg mx-auto lg:mx-0">
              Secure and seamless authentication to protect what matters most.
            </p>
            
            {/* Feature List */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center text-white">
                    <feature.icon size={20} />
                  </div>
                  <div className="text-left">
                    <p className="text-white font-semibold text-sm">{feature.title}</p>
                    <p className="text-white/70 text-xs">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Login Card */}
          <div className="flex-1 max-w-md mx-auto lg:mx-0 w-full">
            <div className="bg-white rounded-2xl p-8 shadow-2xl">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Get Started</h2>
                <p className="text-gray-500">Sign in with your Google account</p>
              </div>

              <div className="space-y-6">
                <button
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full py-4 px-6 bg-white border-2 border-gray-200 hover:border-indigo-600 text-gray-800 rounded-xl font-semibold text-lg transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group"
                >
                  <FcGoogle size={24} />
                  <span>{loading ? "Signing in..." : "Continue with Google"}</span>
                </button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-400">Secure & Encrypted</span>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-500">
                    By continuing, you agree to our{" "}
                    <Link to="/terms-and-condition" className="text-indigo-600 hover:text-indigo-700 font-medium">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link to="/privacy-policy" className="text-indigo-600 hover:text-indigo-700 font-medium">
                      Privacy Policy
                    </Link>
                  </p>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="flex justify-center gap-6">
                  <div className="text-center">
                    <div className="text-indigo-600 font-bold text-xl">2M+</div>
                    <div className="text-gray-500 text-xs">Parents Trust Us</div>
                  </div>
                  <div className="text-center">
                    <div className="text-indigo-600 font-bold text-xl">4.8</div>
                    <div className="text-gray-500 text-xs">App Store Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="text-indigo-600 font-bold text-xl">24/7</div>
                    <div className="text-gray-500 text-xs">Support</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Curved bottom edge */}
        <div className="absolute bottom-0 left-0 w-full h-20 bg-white" style={{ clipPath: "ellipse(60% 100% at 50% 100%)" }}></div>
      </section>

      {/* Features Preview Section */}
      <section className="py-16 md:py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800">Why Families Love Kidzet</h2>
            <p className="text-gray-500 text-lg mt-4">Comprehensive protection for your child's digital life</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-indigo-600">
                <FaVideoIcon size={28} />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Live Camera</h3>
              <p className="text-gray-500 text-sm">See real-time surroundings</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-indigo-600">
                <FaLocationIcon size={28} />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">GPS Tracking</h3>
              <p className="text-gray-500 text-sm">Real-time location updates</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-indigo-600">
                <FaClockIcon size={28} />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Screen Time</h3>
              <p className="text-gray-500 text-sm">Set healthy limits</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-indigo-600">
                <FaBanIcon size={28} />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">App Blocker</h3>
              <p className="text-gray-500 text-sm">Block distracting apps</p>
            </div>
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section className="bg-gray-900 text-white py-16 md:py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 opacity-90"></div>
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold">Start Protecting Your Family</h2>
          <p className="text-gray-300 text-lg mt-4 mb-8">Download Kidzet and get 3 days free trial</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#" className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-6 py-3 flex items-center gap-3 hover:bg-white hover:text-gray-900 transition-all group">
              <FaGooglePlay size={28} />
              <div className="text-left">
                <span className="text-xs uppercase tracking-wide">GET IT ON</span>
                <strong className="block text-lg">Google Play</strong>
              </div>
            </a>
            <a href="#" className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-6 py-3 flex items-center gap-3 hover:bg-white hover:text-gray-900 transition-all group">
              <FaApple size={28} />
              <div className="text-left">
                <span className="text-xs uppercase tracking-wide">Download on the</span>
                <strong className="block text-lg">App Store</strong>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 md:py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            <div>
              <Link to="/" className="text-2xl font-black text-indigo-400 mb-4 inline-block">
                Kid<span className="text-cyan-400">zet</span>.
              </Link>
              <p className="text-gray-400 text-sm">Empowering parents with smart tools to foster healthy digital habits and ensure physical safety.</p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link to="/features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><a href="#download" className="hover:text-white transition-colors">Download</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link to="/setup" className="hover:text-white transition-colors">Setup Guide</Link></li>
                <li><Link to="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="text-center text-gray-500 text-sm pt-8 mt-8 border-t border-gray-800">
            <p>&copy; 2024 Kidzet Inc. All rights reserved.</p>
          </div>
        </div>
      </footer>

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
    </div>
  );
};

export default Login;