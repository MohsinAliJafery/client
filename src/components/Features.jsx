import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaGooglePlay, FaApple, FaBars,
  FaVideo, FaMicrophoneLines, FaMapLocationDot, FaRoute, 
  FaChartPie, FaHourglassEnd, FaBan, FaImages, 
  FaCommentDots, FaPhoneVolume, FaShieldHalved, FaUserSecret
} from 'react-icons/fa6';
import WebNavbar from './WebNavbar';

const Features = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features = [
    {
      icon: FaVideo,
      title: "Live Camera View",
      description: "Remotely access the child's phone camera (front or rear) to see their physical surroundings in real-time. Essential for verifying their safety when they are out alone or on school trips."
    },
    {
      icon: FaMicrophoneLines,
      title: "Live Sound Listening",
      description: "Turn on the microphone remotely to hear ambient sounds and conversations happening around the device. Detect bullying, bad influences, or dangerous situations instantly."
    },
    {
      icon: FaMapLocationDot,
      title: "Real-Time Location",
      description: "Track your child's exact GPS location on a live map. Know exactly where they are at any moment with high-precision accuracy powered by Google Maps integration."
    },
    {
      icon: FaRoute,
      title: "Location History",
      description: "View a detailed timeline of places your child has visited over the last 30 days. See routes taken, stops made, and the exact time they arrived and left each location."
    },
    {
      icon: FaChartPie,
      title: "Screen Time Monitor",
      description: "Get daily and weekly reports on how much time your child spends on their device. View a breakdown of usage by specific apps to identify addictive behaviors."
    },
    {
      icon: FaHourglassEnd,
      title: "Set Time Limits",
      description: "Define strict daily usage limits (e.g., 2 hours per day). Once the time is up, the phone automatically locks, allowing only emergency calls and the SOS button."
    },
    {
      icon: FaBan,
      title: "App Blocking",
      description: "Block specific apps like games, social media, or browsers instantly. You can set schedules to block apps only during study time or bedtime."
    },
    {
      icon: FaImages,
      title: "Files & Gallery Check",
      description: "Browse the photos, videos, and downloaded files stored on the child's device. Ensure they are not sharing or receiving inappropriate content or images."
    },
    {
      icon: FaCommentDots,
      title: "Message Monitoring",
      description: "Kidzet captures incoming notifications from all apps, including WhatsApp, Messenger, and Instagram. Read messages even if the child deletes them immediately."
    },
    {
      icon: FaPhoneVolume,
      title: "Call Logs",
      description: "View a complete history of incoming, outgoing, and missed calls. See contact names, phone numbers, timestamps, and call duration."
    },
    {
      icon: FaShieldHalved,
      title: "Full Digital Safety",
      description: "A comprehensive dashboard that combines online digital safety (app blocking, messages) with offline real-life safety (camera, sound, GPS) for total peace of mind."
    },
    {
      icon: FaUserSecret,
      title: "Stealth Mode",
      description: "The app can operate in a 100% invisible mode on the child's device. The icon is hidden, and it runs silently in the background without disturbing the user."
    }
  ];

  return (
    <div className="font-['Inter',system-ui,sans-serif] text-gray-800 bg-white overflow-x-hidden">
      {/* Header / Navigation */}
      <WebNavbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 via-indigo-600 to-indigo-400 pt-32 pb-20 md:pt-36 md:pb-24 px-4 relative">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
            All The Tools You Need To<br /><span className="text-cyan-200">Keep Them Safe</span>
          </h1>
          <p className="text-white/90 text-lg md:text-xl mt-6 max-w-2xl mx-auto">
            From digital screen time to real-life surroundings, Kidzet provides a complete 360° safety net for your children.
          </p>
          <div className="mt-8">
            <a href="#all-features" className="bg-white text-indigo-600 font-bold px-8 py-3 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all inline-block">
              Explore All Features
            </a>
          </div>
        </div>
        {/* Curved bottom edge */}
        <div className="absolute bottom-0 left-0 w-full h-20 bg-white" style={{ clipPath: "ellipse(60% 100% at 50% 100%)" }}></div>
      </section>

      {/* Features Grid Section */}
      <section id="all-features" className="py-20 md:py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800">360° Monitoring & Protection</h2>
            <p className="text-gray-500 text-lg mt-4">Detailed breakdown of every feature available in the Premium Plan.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 md:p-8 text-left border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                <div className="w-14 h-14 bg-indigo-50 rounded-xl flex items-center justify-center mb-5 text-indigo-600 text-2xl">
                  <feature.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                <p className="text-gray-500 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="bg-gradient-to-b from-white to-indigo-50/50 py-16 md:py-20">
        <div className="text-center px-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800">Easy Management Dashboard</h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto mt-4">Control all these features from a simple, intuitive interface on your own phone.</p>
        </div>
        <div className="max-w-5xl mx-auto mt-12 px-4">
          <div className="rounded-2xl shadow-2xl border-8 border-white overflow-hidden bg-gray-100">
            <img 
              src="https://placehold.co/1000x550/f4f6ff/4e54c8?text=Feature+Control+Panel+UI" 
              alt="Kidzet Control Panel" 
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section className="bg-gray-900 text-white py-20 md:py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 opacity-90"></div>
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold">Ready to protect your child?</h2>
          <p className="text-gray-300 text-lg mt-4 mb-8">Get full access to Live Camera, Sound, and Location tracking today.</p>
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
                <li><a href="#" className="hover:text-white transition-colors">Reviews</a></li>
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
            <p>&copy; 2023 Kidzet Inc. All rights reserved.</p>
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

export default Features;