import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { signInWithPopup } from "firebase/auth";
import { ref, set } from "firebase/database";
import { auth, googleProvider, database } from "../firebase";
import { FcGoogle } from "react-icons/fc";
import { Shield, CreditCard, Users } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Get Firebase ID token
      const idToken = await user.getIdToken();

      // Save to Firebase Realtime DB
      await set(ref(database, "users/" + user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        provider: "google",
        lastLogin: new Date().toISOString(),
        subscription: "free_trial",
      });

      // Sync with MongoDB backend
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

      console.log("What comes in data", data);

      // Store user data
      const userData = {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        subscription: "free_trial",
        token: idToken,
        role: data.user?.role || "user",
      };

      localStorage.setItem("user", JSON.stringify(userData));

      toast.success(`Welcome, ${user.displayName || user.email}!`);
      
      const redirectPath = userData.role === 'admin' ? '/admin' : '/dashboard';
      navigate(redirectPath);
      
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Google login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                <CreditCard className="text-white" size={32} />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Welcome to <span className="text-orange-500">PaymentPro</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Secure payment portal with seamless Google authentication
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left Side - Features */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-6">Why Choose Us?</h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-orange-500/10 rounded-xl">
                    <Shield className="text-orange-500" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Secure Authentication</h3>
                    <p className="text-gray-400">One-click Google login with enterprise-grade security</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-orange-500/10 rounded-xl">
                    <CreditCard className="text-orange-500" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Fast Payments</h3>
                    <p className="text-gray-400">Instant payment processing with multiple gateways</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-orange-500/10 rounded-xl">
                    <Users className="text-orange-500" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Easy Management</h3>
                    <p className="text-gray-400">Simple dashboard to manage all your payments</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-700">
                <div className="flex items-center space-x-4">
                  <div className="flex-1 h-px bg-gray-700"></div>
                  <span className="text-gray-400 text-sm">Trusted by businesses worldwide</span>
                  <div className="flex-1 h-px bg-gray-700"></div>
                </div>
              </div>
            </div>

            {/* Right Side - Login Card */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Get Started</h2>
                <p className="text-gray-400">Sign in with your Google account</p>
              </div>

              <div className="space-y-6">
                {/* Google Login Button */}
                <button
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full py-4 px-6 bg-white hover:bg-gray-100 text-gray-900 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 shadow-lg"
                >
                  <FcGoogle size={24} />
                  <span>{loading ? "Signing in..." : "Continue with Google"}</span>
                </button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-700"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-gray-800 text-gray-400">Secure & Encrypted</span>
                  </div>
                </div>

                {/* Terms */}
                <div className="text-center">
                  <p className="text-sm text-gray-400">
                    By continuing, you agree to our{" "}
                    <a href="#" className="text-orange-500 hover:text-orange-400 underline">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-orange-500 hover:text-orange-400 underline">
                      Privacy Policy
                    </a>
                  </p>
                </div>
              </div>

              {/* Demo Credentials */}
              <div className="mt-8 pt-8 border-t border-gray-700">
                <div className="text-center">
                  <p className="text-sm text-gray-400 mb-2">Using for testing?</p>
                  <div className="inline-flex items-center space-x-2 text-xs text-gray-500 bg-gray-900/50 px-3 py-2 rounded-lg">
                    <span>Try any Google account</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 text-center">
            <p className="text-gray-500 text-sm">
              © 2024 PaymentPro. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;