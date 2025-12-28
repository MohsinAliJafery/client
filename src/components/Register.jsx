import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { signInWithPopup } from "firebase/auth";
import { ref, set } from "firebase/database";
import { auth, googleProvider, database } from "../firebase";
import { FcGoogle } from "react-icons/fc";
import { ArrowLeft, CheckCircle, Shield, Zap } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleGoogleRegister = async () => {
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
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        subscription: "free_trial",
        status: "active",
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

      // Store user data
      const userData = {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        subscription: "free_trial",
        token: idToken,
        role: data.data?.role || "user",
      };

      localStorage.setItem("user", JSON.stringify(userData));

      toast.success(`Welcome to Kidzet, ${user.displayName || user.email}!`);
      
      // Redirect based on role
      const redirectPath = userData.role === 'admin' ? '/admin' : '/dashboard';
      navigate(redirectPath);
      
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <div className="mb-8">
            <Link
              to="/login"
              className="inline-flex items-center text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={18} className="mr-2" />
              Back to Login
            </Link>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Left Side - Registration Info */}
            <div className="space-y-8">
              <div>
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg mb-6">
                  <Shield className="text-white" size={32} />
                </div>
                <h1 className="text-4xl font-bold text-white mb-4">
                  Join <span className="text-orange-500">Kidzet</span> Today
                </h1>
                <p className="text-xl text-gray-300">
                  Create your account in seconds with Google
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-green-500/10 rounded-lg mt-1">
                    <CheckCircle className="text-green-500" size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">No Passwords</h3>
                    <p className="text-gray-400">Forget passwords. Use your secure Google account</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-orange-500/10 rounded-lg mt-1">
                    <Zap className="text-orange-500" size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Instant Access</h3>
                    <p className="text-gray-400">Get started immediately after registration</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-blue-500/10 rounded-lg mt-1">
                    <Shield className="text-blue-500" size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Enterprise Security</h3>
                    <p className="text-gray-400">Bank-level encryption and security protocols</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Side - Registration Card */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 shadow-xl">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
                <p className="text-gray-400">One click with Google. No forms to fill.</p>
              </div>

              {/* Google Register Button */}
              <button
                onClick={handleGoogleRegister}
                disabled={loading}
                className="w-full py-4 px-6 bg-white hover:bg-gray-100 text-gray-900 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 shadow-lg mb-6"
              >
                <FcGoogle size={24} />
                <span>{loading ? "Creating Account..." : "Sign up with Google"}</span>
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-gray-800 text-gray-400">Quick & Secure</span>
                </div>
              </div>

              {/* Benefits */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-300">No credit card required for trial</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-300">Cancel anytime</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-300">Full access to all features</span>
                </div>
              </div>

              {/* Terms and Login Link */}
              <div className="space-y-4">
                <p className="text-sm text-center text-gray-400">
                  By registering, you agree to our{" "}
                  <a href="#" className="text-orange-500 hover:text-orange-400 underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-orange-500 hover:text-orange-400 underline">
                    Privacy Policy
                  </a>
                </p>

                <div className="text-center">
                  <p className="text-gray-400">
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      className="text-orange-500 hover:text-orange-400 font-semibold underline"
                    >
                      Sign in here
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-gray-800 text-center">
            <p className="text-gray-500 text-sm">
              © 2024 PaymentPro. All rights reserved.
            </p>
            <div className="flex justify-center space-x-6 mt-4">
              <a href="#" className="text-gray-400 hover:text-white text-sm">Support</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm">Contact</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm">API</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm">Status</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;