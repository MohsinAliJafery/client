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
  Apple,
  Heart,
  MessageCircle,
  Eye,
  Calendar,
  Lock,
  ShieldCheck,
  TrendingUp,
  X,
  Menu
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
    { icon: <Clock size={24} />, title: "Usage Limits", desc: "Control screen time" },
    { icon: <MapPin size={24} />, title: "Location Tracking", desc: "Know their location" },
  ];

  const controlFeatures = [
    { icon: <Shield size={20} />, title: "Instant Block", desc: "Block inappropriate content instantly" },
    { icon: <Calendar size={20} />, title: "Schedule Downtime", desc: "Set specific no-screen times" },
    { icon: <Smartphone size={20} />, title: "App Limits", desc: "Limit specific app usage" },
    { icon: <X size={20} />, title: "App Blocker", desc: "Block unwanted apps completely" },
    { icon: <Globe size={20} />, title: "Website Limits", desc: "Filter and block websites" },
  ];

  const compatibilityFeatures = [
    "Remote Camera",
    "Screen Mirroring",
    "One-Way Audio",
    "Schedule Downtime",
    "App Limits & Management",
    "Sync App Notifications",
    "Social Content Detection",
    "Inappropriate Image Detection",
    "Calls & SMS Monitoring",
    "Website Restrictions",
    "Live Location & Geofencing",
    "Activity Report",
    "Real-time Alerts",
    "Family Chats"
  ];

  const ageGroups = [
    {
      age: "3-8 Years Old",
      stage: "Early Childhood",
      desc: "Focus on basic screen time management and safe content filtering"
    },
    {
      age: "9-12 Years Old",
      stage: "Pre-teens",
      desc: "Balance independence with supervision, manage social media access"
    },
    {
      age: "13-18 Years Old",
      stage: "Teenagers",
      desc: "Empower responsible digital habits with balanced oversight"
    }
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
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
             <p className='text-3xl font-bold'>Kid<span className="text-3xl font-bold text-orange-500">zet</span></p>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-orange-500 transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-700 hover:text-orange-500 transition-colors">How It Works</a>
              <a href="#testimonials" className="text-gray-700 hover:text-orange-500 transition-colors">Reviews</a>
              <a href="#pricing" className="text-gray-700 hover:text-orange-500 transition-colors">Pricing</a>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <Link
                to="/login"
                className="px-6 py-2 text-orange-500 border border-orange-500 rounded-lg hover:bg-orange-50 transition-colors"
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
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu size={24} />
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4">
              <div className="flex flex-col space-y-4">
                <a href="#features" className="text-gray-700 hover:text-orange-500">Features</a>
                <a href="#how-it-works" className="text-gray-700 hover:text-orange-500">How It Works</a>
                <a href="#testimonials" className="text-gray-700 hover:text-orange-500">Reviews</a>
                <a href="#pricing" className="text-gray-700 hover:text-orange-500">Pricing</a>
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
      <section className="bg-gradient-to-br from-orange-50 to-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 bg-orange-100 text-orange-700 rounded-full mb-6">
              <Shield className="mr-2" size={16} />
              Parental Control
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Best Comprehensive Parental Control Tool
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Journey hand in hand, grow along with kids together!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button onClick={() => navigate('/dashboard')} className="px-8 py-3 bg-white text-orange-500 border border-orange-500 rounded-lg hover:bg-orange-50 transition-colors">
                Buy Now
              </button>
            </div>
            <div className="text-gray-600 mb-4">Available on:</div>
            <div className="flex justify-center space-x-6">
              <div className="flex items-center space-x-2">
                <Apple size={24} />
                <span>App Store</span>
              </div>
              <div className="flex items-center space-x-2">
                <img src="play-store.png" className='h-6 w-6' alt="" />
                <span>Google Play</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              All-in-1 Protection for Your Kids, Online & Real-Life
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="p-3 bg-orange-50 rounded-lg w-fit mb-4">
                  <div className="text-orange-500">{feature.icon}</div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Your Rules, Their Usage
            </h3>
            <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
              Easily manage every aspect of your kids' screen time throughout the day or week, 
              guiding their digital habits simply at your fingertips.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {controlFeatures.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                  <div className="text-orange-500 mt-1">{feature.icon}</div>
                  <div>
                    <h4 className="font-medium text-gray-900">{feature.title}</h4>
                    <p className="text-sm text-gray-600">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Compatibility Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Kidzet Parental Control Workable Compatibility
          </h2>
          <div className="flex justify-center gap-12">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
              <div className="flex items-center mb-6">
                <img src="play-store.png" className='h-6 w-6' alt="" />
                <div className="ml-4">
                  <h3 className="text-xl font-bold text-gray-900">For Kid's Android</h3>
                  <p className="text-gray-600">Android 7.0 and later</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {compatibilityFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle size={16} className="text-green-500 mr-2" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
              {/* <button className="mt-8 w-full py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                Try It Free
              </button> */}
            </div>
            {/* <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
              <div className="flex items-center mb-6">
                <Apple size={32} className="text-gray-800" />
                <div className="ml-4">
                  <h3 className="text-xl font-bold text-gray-900">For Kid's iOS</h3>
                  <p className="text-gray-600">iOS compatible features</p>
                </div>
              </div>
              <div className="space-y-4">
                {compatibilityFeatures.slice(0, 7).map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle size={16} className="text-green-500 mr-2" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
              <button className="mt-8 w-full py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors">
                Try It Free
              </button>
            </div> */}
          </div>
        </div>
      </section>

      {/* Age Groups Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Parental Controls Focus by Every Age Group
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {ageGroups.map((group, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="text-4xl font-bold text-orange-500 mb-2">{group.age}</div>
                <div className="text-lg font-semibold text-gray-900 mb-4">{group.stage}</div>
                <p className="text-gray-600">{group.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section id="how-it-works" className="py-16 bg-gradient-to-r from-orange-50 to-yellow-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Complete Family Protection in 3 Easy Steps
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                  <div className="text-6xl font-bold text-orange-100 mb-4">{step.step}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{step.title}</h3>
                  <p className="text-gray-600">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
          {/* <div className="text-center mt-12">
            <button className="inline-flex items-center px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
              View Detailed Guide
              <ChevronRight className="ml-2" size={20} />
            </button>
          </div> */}
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Your Trusted Digital Parenting Assistant
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} className="text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                <div className="font-semibold text-gray-900">{testimonial.name}</div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button className="inline-flex items-center px-6 py-3 border border-orange-500 text-orange-500 rounded-lg hover:bg-orange-50 transition-colors">
              <MessageCircle className="mr-2" size={20} />
              Real Parents Stories
              <ChevronRight className="ml-2" size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      {/* <section className="py-16 bg-gradient-to-br from-orange-500 to-orange-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Guide Kids' World: Fun, Smart & Safe
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button className="px-8 py-3 bg-white text-orange-500 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center">
              <Download className="mr-2" size={20} />
              Try It Free
            </button>
            <button className="px-8 py-3 bg-transparent text-white border-2 border-white rounded-lg hover:bg-white/10 transition-colors">
              Buy Now
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {trustFeatures.map((feature, index) => (
              <div key={index} className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                <div className="text-white mb-2">{feature.icon}</div>
                <div className="font-semibold text-white">{feature.title}</div>
                <div className="text-white/80 text-sm">{feature.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="flex items-center space-x-2 mb-6 md:mb-0">
             <p className='text-3xl font-bold'>Kid<span className="text-3xl font-bold text-orange-500">zet</span></p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-orange-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-orange-400 transition-colors">Terms of Service</a>
            </div>
          </div>
          <div className="text-center text-gray-400 text-sm">
            <p className="mb-4">
              Kidzet Parental Control helps parents better monitor and manage children's devices. 
              You can quickly locate your kids and family, check location history, review children's 
              device usage, and schedule screen time & application usage.
            </p>
            <div className="mt-8 pt-8 border-t border-gray-800">
              © {new Date().getFullYear()} Kidzet.com. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;