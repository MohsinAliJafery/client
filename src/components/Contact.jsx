import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaGooglePlay, FaApple, FaBars, FaTimes,
  FaMapMarkerAlt, FaEnvelope, FaPhone, FaFacebookF, FaTwitter, FaInstagram
} from 'react-icons/fa';

const Contact = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We will get back to you within 24 hours.');
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  const contactInfo = [
    {
      icon: FaMapMarkerAlt,
      title: "Headquarters",
      details: "123 Innovation Drive, Tech Park\nSan Francisco, CA 94103, USA"
    },
    {
      icon: FaEnvelope,
      title: "Email Us",
      details: "support@kidzet.com\nsales@kidzet.com"
    },
    {
      icon: FaPhone,
      title: "Call Us",
      details: "+1 (800) 123-4567\nMon-Fri, 9am - 6pm EST"
    }
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
            <Link to="/" className="text-gray-700 font-medium hover:text-indigo-600 transition-colors">Setup & Helps</Link>
            <Link to="/contact" className="text-gray-700 font-medium hover:text-indigo-600 transition-colors">Contact</Link>
            <Link to="/login" className="bg-gradient-to-r from-indigo-600 to-cyan-500 text-white px-5 py-2 rounded-full font-semibold text-sm shadow-md hover:shadow-lg transition-all">Log In</Link>
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
            <Link to="/contact" className="text-indigo-600 font-semibold py-2 border-b border-gray-100" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
            <Link to="/login" className="text-indigo-600 font-bold py-2">Log In</Link>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 via-indigo-600 to-indigo-400 pt-32 pb-20 md:pt-36 md:pb-24 px-4 relative">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
            We're Here To Help
          </h1>
          <p className="text-white/90 text-lg md:text-xl mt-6 max-w-2xl mx-auto">
            Have questions about installation, pricing, or features? Our team is available 24/7 to assist you.
          </p>
        </div>
        {/* Curved bottom edge */}
        <div className="absolute bottom-0 left-0 w-full h-20 bg-white" style={{ clipPath: "ellipse(60% 100% at 50% 100%)" }}></div>
      </section>

      {/* Contact Section */}
      <section className="py-20 md:py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Left Column - Contact Info */}
            <div>
              <div className="mb-8">
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-4">Get in Touch</h2>
                <p className="text-gray-500 text-lg">Fill out the form and we will get back to you within 24 hours.</p>
              </div>

              {contactInfo.map((info, index) => (
                <div key={index} className="flex items-start mb-8">
                  <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 text-xl flex-shrink-0 mr-5">
                    <info.icon size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-1">{info.title}</h4>
                    <p className="text-gray-500 whitespace-pre-line">{info.details}</p>
                  </div>
                </div>
              ))}

              <div className="flex gap-4 mt-8">
                <a href="#" className="border-2 border-indigo-600 text-indigo-600 px-5 py-2 rounded-full hover:bg-indigo-600 hover:text-white transition-all inline-flex items-center gap-2">
                  <FaFacebookF /> Facebook
                </a>
                <a href="#" className="border-2 border-indigo-600 text-indigo-600 px-5 py-2 rounded-full hover:bg-indigo-600 hover:text-white transition-all inline-flex items-center gap-2">
                  <FaTwitter /> Twitter
                </a>
                <a href="#" className="border-2 border-indigo-600 text-indigo-600 px-5 py-2 rounded-full hover:bg-indigo-600 hover:text-white transition-all inline-flex items-center gap-2">
                  <FaInstagram /> Instagram
                </a>
              </div>
            </div>

            {/* Right Column - Contact Form */}
            <div>
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Send a Message</h3>
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all"
                    />
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all"
                    />
                  </div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all mb-4"
                  />
                  <input
                    type="text"
                    name="subject"
                    placeholder="Subject (e.g., Installation Help)"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all mb-4"
                  />
                  <textarea
                    name="message"
                    rows="5"
                    placeholder="How can we help you?"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all mb-4 resize-none"
                  ></textarea>
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-indigo-600 to-cyan-500 text-white py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="bg-indigo-50/30 pb-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="rounded-2xl overflow-hidden shadow-2xl border-8 border-white -mt-8">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.063688126046!2d-122.41941548468196!3d37.77492927975975!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085809c6c8f4459%3A0xb10ed6d9b5050fa5!2sTwitter+HQ!5e0!3m2!1sen!2sus!4v1533026779375"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              title="Kidzet Headquarters Location"
              className="w-full"
            ></iframe>
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section className="bg-gray-900 text-white py-20 md:py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 opacity-90"></div>
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold">Instant Support via App</h2>
          <p className="text-gray-300 text-lg mt-4 mb-8">Premium users get priority support directly through the Kidzet Parent Dashboard app.</p>
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

export default Contact;