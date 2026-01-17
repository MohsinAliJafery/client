import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Smartphone, 
  Clock, 
  MapPin, 
  Globe, 
  CheckCircle, 
  Award,
  Star,
  Users,
  Download,
  Play,
  ChevronRight,
  Heart,
  MessageCircle,
  Eye,
  Calendar,
  Lock,
  ShieldCheck,
  TrendingUp,
  X,
  Menu,
  File
} from 'lucide-react';

const HomePage = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const awards = [
    { title: "kidSAFE Seal Program", status: "Listed" },
    { title: "2022 National Parenting Product Awards", status: "Winner" },
    { title: "Educational App Store", status: "5-stars Certified" },
    { title: "Family Choice Awards", status: "Winner" },
    { title: "Mom's Choice Awards", status: "HONORING EXCELLENCE" },
    { title: "Lovedbyparents", status: "Best Buy Awards 2022" },
    { title: "The National Parenting Center", status: "SEAL OF APPROVAL" },
  ];

  const features = [
    { icon: <Eye size={24} />, title: "Remote Monitoring", desc: "Monitor from anywhere" },
    { icon: <Globe size={24} />, title: "Content Monitoring", desc: "Keep content safe" },
    { icon: <File size={24} />, title: "File Transfer", desc: "Transfer Files" },
    { icon: <MapPin size={24} />, title: "Location Tracking", desc: "Know their location" },
  ];

  const controlFeatures = [
    { icon: <Calendar size={20} />, title: "Gallery View", desc: "View gallery" },
    { icon: <Smartphone size={20} />, title: "App Limits", desc: "Limit specific app usage" },
    { icon: <X size={20} />, title: "App Blocker", desc: "Block unwanted apps completely" },
    { icon: <Globe size={20} />, title: "Website Limits", desc: "Filter and block websites" },
  ];

  const compatibilityFeatures = [
    "Remote Camera",
    "Screen Mirroring",
    "One-Way Audio",
    "App Limits & Management",
    "Sync App Notifications",
    "Calls & SMS Monitoring",
    "Live Location",
    "Real-time Alerts",
    "Image File Transfer",
    "Video File Transfer"
  ];


  const steps = [
    {
      step: "1",
      title: "Download and Install",
      desc: "Download Kidzet Parental Control on the parent's phone."
    },
    {
      step: "2",
      title: "Sign Up and Sign In",
      desc: "Register an account and sign in on the parent's device."
    },
    {
      step: "3",
      title: "Bind Child's Device",
      desc: "Install Kidzet Kids on kid's phone and connect both devices."
    }
  ];

  const testimonials = [
    {
      name: "Miguel Almond",
      text: "Kidzet Parental Control is much better than other parental monitoring apps I used previously. It's cost-efficient, has more features, and allows me to block games, apps, and websites that are not good for my child in one click.",
      rating: 5
    },
    {
      name: "Dude hygge",
      text: "I absolutely love this app… It helps me keep track of my kids anywhere with the added bonus of being able to see any notifications that come to their phones.",
      rating: 5
    },
    {
      name: "Michelle Morrice",
      text: "I am impressed by the Kidzet Parental Control. It is easy to use and budget-friendly. It took me a few minutes to set up the app, and I could set screen time limits, website schedule, and geofence for my kids.",
      rating: 5
    }
  ];

  const trustFeatures = [
    { icon: <Lock size={20} />, title: "Uninstall Protection", desc: "Prevent unauthorized removal" },
    { icon: <Users size={20} />, title: "Easy Co-Parenting", desc: "Share access with co-parents" },
    { icon: <Smartphone size={20} />, title: "1 Account Bind Multi-Devices", desc: "Monitor multiple devices" },
    { icon: <ShieldCheck size={20} />, title: "GDPR Compliance", desc: "Your data is protected" },
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navigation */}
      <nav className="bg-gray-800/90 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <p className='text-3xl font-bold text-white'>Kid<span className="text-3xl font-bold text-orange-500">zet</span></p>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-300 hover:text-orange-500 transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-300 hover:text-orange-500 transition-colors">How It Works</a>
              <a href="#testimonials" className="text-gray-300 hover:text-orange-500 transition-colors">Reviews</a>
              <a href="#pricing" className="text-gray-300 hover:text-orange-500 transition-colors">Pricing</a>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <Link
                to="/login"
                className="px-6 py-2 text-orange-500 border border-orange-500 rounded-lg hover:bg-orange-500/10 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                Sign Up Free
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-gray-300"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu size={24} />
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4">
              <div className="flex flex-col space-y-4">
                <a href="#features" className="text-gray-300 hover:text-orange-500">Features</a>
                <a href="#how-it-works" className="text-gray-300 hover:text-orange-500">How It Works</a>
                <a href="#testimonials" className="text-gray-300 hover:text-orange-500">Reviews</a>
                <a href="#pricing" className="text-gray-300 hover:text-orange-500">Pricing</a>
                <div className="pt-4 space-y-3">
                  <Link to="/login" className="block text-center py-2 text-orange-500 border border-orange-500 rounded-lg">
                    Login
                  </Link>
                  <Link to="/register" className="block text-center py-2 bg-orange-500 text-white rounded-lg">
                    Sign Up Free
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-700 to-gray-800 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Ultimate Digital Safety <br />For Your Children
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Advanced monitoring and protection tools to ensure your kids' online safety
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button onClick={() => navigate('/dashboard')} className="px-8 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                Get Started Now
              </button>
              <button className="px-8 py-3 bg-gray-800 text-white border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors">
                View Features
              </button>
            </div>
            <div className="text-gray-400 mb-4">Available on:</div>
            <div className="flex justify-center space-x-8">
              <div className="flex items-center space-x-2 text-gray-300">
                <img src="/play-store.png" className='h-8 w-8' alt="Google Play" />
                <span className='5xl'>Google Play Store</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-gray-800/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Comprehensive Digital Protection Suite
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Advanced tools designed to keep your children safe in the digital world
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-800/70 p-6 rounded-xl border border-gray-700 hover:border-orange-500/50 transition-all duration-300">
                <div className="p-3 bg-orange-500/10 rounded-lg w-fit mb-4 border border-orange-500/20">
                  <div className="text-orange-500">{feature.icon}</div>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-gray-800/70 rounded-2xl p-8 border border-gray-700">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">
              Complete Control Center
            </h3>
            <p className="text-gray-400 text-center mb-8 max-w-2xl mx-auto">
              Manage every aspect of your children's digital life with precision and ease
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {controlFeatures.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                  <div className="text-orange-500 mt-1">{feature.icon}</div>
                  <div>
                    <h4 className="font-medium text-white">{feature.title}</h4>
                    <p className="text-sm text-gray-400">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Compatibility Section */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Android Compatibility & Features
          </h2>
          <div className="flex justify-center">
            <div className="bg-gray-800/70 p-8 rounded-2xl border border-gray-700 max-w-2xl w-full">
              <div className="flex items-center mb-8">
                <img src="/play-store.png" className='h-10 w-10' alt="Google Play" />
                <div className="ml-4">
                  <h3 className="text-xl font-bold text-white">For Android Devices</h3>
                  <p className="text-gray-400">Android 7.0 and later versions supported</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {compatibilityFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center p-3 bg-gray-900/50 rounded-lg">
                    <CheckCircle size={18} className="text-green-500 mr-3" />
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 text-center">
                <p className="text-gray-400 mb-4">iOS version coming soon</p>
                <button className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                  Download for Android
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section id="how-it-works" className="py-16 bg-gradient-to-r from-orange-500/10 to-orange-600/10">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Get Started in 3 Simple Steps
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-gray-800/70 p-8 rounded-2xl border border-gray-700">
                  <div className="text-6xl font-bold text-orange-500/20 mb-4">{step.step}</div>
                  <h3 className="text-xl font-bold text-white mb-4">{step.title}</h3>
                  <p className="text-gray-400">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Trusted by Parents Worldwide
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              See what parents are saying about Kidzet Parental Control
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-800/70 p-6 rounded-xl border border-gray-700">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} className="text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-4 italic">"{testimonial.text}"</p>
                <div className="font-semibold text-white">{testimonial.name}</div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button className="inline-flex items-center px-6 py-3 border border-orange-500 text-orange-500 rounded-lg hover:bg-orange-500/10 transition-colors">
              <MessageCircle className="mr-2" size={20} />
              Read More Stories
              <ChevronRight className="ml-2" size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-gradient-to-br from-orange-500 to-orange-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Start Protecting Your Family Today
          </h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of parents who trust Kidzet for their children's digital safety
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate('/register')}
              className="px-8 py-3 bg-white text-orange-500 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center"
            >
              <Download className="mr-2" size={20} />
              Start Free Trial
            </button>
            <button 
              onClick={() => navigate('/login')}
              className="px-8 py-3 bg-transparent text-white border-2 border-white rounded-lg hover:bg-white/10 transition-colors"
            >
              Sign In to Account
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="flex items-center space-x-2 mb-6 md:mb-0">
              <p className='text-3xl font-bold text-white'>Kid<span className="text-3xl font-bold text-orange-500">zet</span></p>
            </div>
            <div className="flex space-x-8">
              {/* <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">Support</a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">Contact</a> */}
            </div>
          </div>
          <div className="text-center text-gray-500 text-sm">
            <p className="mb-4 max-w-3xl mx-auto">
              Kidzet Parental Control helps parents monitor and manage children's devices with advanced safety features. 
              Locate your family members, review device usage, and schedule screen time with professional-grade tools.
            </p>
            <div className="mt-8 pt-8 border-t border-gray-800">
              © {new Date().getFullYear()} Kidzet. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;