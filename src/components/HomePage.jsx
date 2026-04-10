import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Add this import
import { 
  FaVideo, FaVolumeUp, FaFolderOpen, FaMapMarkerAlt, 
  FaClock, FaBan, FaGooglePlay, FaApple, FaChevronDown,
  FaBars, FaTimes
} from 'react-icons/fa';

const HomePage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const features = [
    { icon: FaVideo, title: "Live Camera", description: "See your child's surroundings instantly through their phone camera remotely." },
    { icon: FaVolumeUp, title: "Live Sound", description: "Listen to the environment to ensure they are in safe company." },
    { icon: FaFolderOpen, title: "File Check", description: "Scan their gallery, downloads, and files for inappropriate content." },
    { icon: FaMapMarkerAlt, title: "Live Location", description: "Real-time GPS tracking and 30-day location history on a map." },
    { icon: FaClock, title: "Screen Time", description: "Set daily app usage limits and schedule bedtimes to lock the phone." },
    { icon: FaBan, title: "App Blocker", description: "Block distracting games and social media apps with one tap." }
  ];

  const pricingPlans = [
    { name: "Basic", price: "0", period: "mo", devices: "1 Device", features: ["Location Tracking", "Screen Time Limits"], popular: false, cta: "Download" },
    { name: "Premium", price: "9.99", period: "mo", devices: "5 Devices", features: ["Live Camera & Sound", "Message Monitoring", "File Explorer"], popular: true, cta: "Start Free Trial" },
    { name: "Family", price: "19.99", period: "mo", devices: "15 Devices", features: ["Priority Support", "60-Day History", "All Premium Features"], popular: false, cta: "Get Family" }
  ];

  const faqs = [
    { question: "How do I install Kidzet?", answer: "Download the app on parent's phone, create an account, then install on child's phone and scan the QR code to link." },
    { question: "Does it work on iPhone?", answer: "Yes, Kidzet is compatible with iOS devices for both parent and child, though some features differ from Android." },
    { question: "Is the app hidden?", answer: "You can choose 'Stealth Mode' during installation to hide the app icon on the child's device." },
    { question: "Is there a free trial?", answer: "Yes, we offer a full-feature 3-day free trial so you can test everything before subscribing." },
    { question: "Can I cancel anytime?", answer: "Absolutely. There are no long-term contracts and you can cancel from your dashboard settings." },
    { question: "Does Live Camera make a sound?", answer: "No, the camera activates silently in the background for discrete monitoring purposes." },
    { question: "Can I see WhatsApp messages?", answer: "Yes, Kidzet reads incoming notifications, allowing you to see messages from WhatsApp, Messenger, and others." },
    { question: "Is my data secure?", answer: "Yes, all data is encrypted with bank-level security. Only you have access to your dashboard." },
    { question: "What if the phone is offline?", answer: "The app continues to monitor and logs data locally. It uploads everything once the internet is restored." },
    { question: "How many devices can I monitor?", answer: "Depending on your plan, you can monitor anywhere from 1 to 15 devices simultaneously." }
  ];

  return (
    <div className="font-['Inter',system-ui,sans-serif] text-gray-800 bg-white overflow-x-hidden">
      {/* Header / Navigation */}
      <header className="fixed top-0 w-full bg-white/98 backdrop-blur-md shadow-sm z-50">
        <nav className="max-w-6xl mx-auto flex justify-between items-center px-4 md:px-8 py-4">
          <Link to="/" className="text-2xl md:text-3xl font-black text-indigo-600 tracking-tight">
            Kid<span className="text-cyan-500">zet</span>.
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/features" className="text-gray-700 font-medium hover:text-indigo-600 transition-colors">Features</Link>
            <Link to="/pricing" className="text-gray-700 font-medium hover:text-indigo-600 transition-colors">Pricing</Link>
            <Link to="/setup" className="text-gray-700 font-medium hover:text-indigo-600 transition-colors">Setup & Helps</Link>
            <Link to="/contact" className="text-gray-700 font-medium hover:text-indigo-600 transition-colors">Contact</Link>
          </div>

          <Link to="/login" className="bg-gradient-to-r from-indigo-600 to-cyan-500 text-white px-5 py-2 rounded-full font-semibold text-sm shadow-md hover:shadow-lg transition-all">Log In</Link>

          
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
            <Link to="/login" className="text-indigo-600 font-bold py-2">Log In</Link>
          </div>
        )}
      </header>

      {/* Hero Section - Keep the same, just update the "Explore Features" button */}
      <section className="bg-gradient-to-br from-indigo-600 via-indigo-600 to-indigo-400 pt-32 pb-20 md:pt-40 md:pb-28 px-4 relative">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12 relative z-10">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
              Complete Digital &<br /><span className="text-cyan-200">Real-Life Protection</span>
            </h1>
            <p className="text-white/90 text-lg md:text-xl mt-6 max-w-lg mx-auto md:mx-0">
              Monitor your child's world with Live Camera View, Ambient Sound listening, and real-time Location Tracking. The smartest way to parent in the digital age.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start mt-8">
              <a href="#download" className="bg-white text-indigo-600 font-bold px-6 py-3 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all inline-flex items-center justify-center gap-2">
                <FaGooglePlay /> Get App
              </a>
              <Link to="/features" className="border-2 border-white/50 text-white font-semibold px-6 py-3 rounded-full hover:bg-white/10 transition-all inline-flex items-center justify-center">
                Explore Features
              </Link>
            </div>
          </div>
          <div className="flex-1 w-full">
            <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20 bg-black">
              <div className="relative pb-[56.25%] h-0">
                <iframe 
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ?controls=0" 
                  title="Kidzet App Demo" 
                  className="absolute top-0 left-0 w-full h-full"
                  frameBorder="0" 
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-20 bg-white" style={{ clipPath: "ellipse(60% 100% at 50% 100%)" }}></div>
      </section>

      {/* Features Section - Keep as is, but you can remove the id if not needed for scrolling */}
      <section className="py-20 md:py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800">Powerful Monitoring Features</h2>
            <p className="text-gray-500 text-lg mt-4">Everything you need to keep your child safe online and offline.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 md:p-8 text-center border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-5 text-indigo-600 text-2xl">
                  <feature.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="bg-gradient-to-b from-white to-indigo-50/50 py-16 md:py-20">
        <div className="text-center px-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800">Your Command Center</h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto mt-4">Manage all devices, view logs, and change settings from one simple dashboard.</p>
        </div>
        <div className="max-w-5xl mx-auto mt-12 px-4">
          <div className="rounded-2xl shadow-2xl border-8 border-white overflow-hidden bg-gray-100">
            <img 
              src="https://placehold.co/1000x550/f4f6ff/4e54c8?text=Kidzet+Parent+Dashboard+UI" 
              alt="Kidzet Dashboard Interface" 
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* Download Section - Keep the same */}
      <section id="download" className="bg-gray-900 text-white py-20 md:py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 opacity-90"></div>
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold">Protect Your Child Today</h2>
          <p className="text-gray-300 text-lg mt-4 mb-8">Join over 2 million parents trusting Kidzet for their family's safety. Download now and start your 3-day free trial.</p>
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

      {/* Pricing Section - Keep as is */}
      <section className="py-20 md:py-24 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800">Simple Pricing</h2>
            <p className="text-gray-500 text-lg mt-4">Choose the plan that fits your family size.</p>
          </div>
          <div className="flex flex-col md:flex-row justify-center gap-6 md:gap-8">
            {pricingPlans.map((plan, index) => (
              <div key={index} className={`bg-white rounded-2xl p-6 md:p-8 w-full md:w-80 text-center border transition-all duration-300 hover:-translate-y-2 hover:shadow-xl relative ${plan.popular ? 'border-indigo-200 shadow-lg' : 'border-gray-100'}`}>
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-bold px-4 py-1 rounded-full">MOST POPULAR</span>
                )}
                <h3 className="text-xl font-bold text-gray-800">{plan.name}</h3>
                <div className="text-4xl font-extrabold text-indigo-600 mt-4">
                  ${plan.price}<span className="text-base font-medium text-gray-400">/{plan.period}</span>
                </div>
                <ul className="mt-6 space-y-3 text-left">
                  <li className="flex items-center gap-2 text-gray-600">
                    <span className="text-cyan-500">✓</span> {plan.devices}
                  </li>
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-gray-600">
                      <span className="text-cyan-500">✓</span> {feature}
                    </li>
                  ))}
                </ul>
                <Link to="/signup" className={`mt-8 inline-block w-full py-3 rounded-full font-semibold transition-all ${plan.popular ? 'bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-md hover:shadow-lg' : 'border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white'}`}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 md:py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800">Frequently Asked Questions</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-5 py-4 text-left font-semibold text-gray-800 flex justify-between items-center hover:bg-gray-50 transition-colors"
                >
                  {faq.question}
                  <FaChevronDown className={`text-gray-400 transition-transform duration-300 ${openFaqIndex === index ? 'rotate-180' : ''}`} />
                </button>
                <div className={`px-5 pb-4 text-gray-500 transition-all duration-300 ${openFaqIndex === index ? 'block' : 'hidden'}`}>
                  {faq.answer}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer - Update all links to use Link component */}
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
                <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link to="/refund" className="hover:text-white transition-colors">Refund Policy</Link></li>
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

export default HomePage;