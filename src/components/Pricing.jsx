import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaGooglePlay, FaApple, FaChevronDown, FaBars, FaTimes,
  FaCheck, FaTimes as FaTimesIcon
} from 'react-icons/fa';
import Plans from './Plans';

const Pricing = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const pricingPlans = [
    {
      name: "Basic",
      price: "0",
      period: "mo",
      description: "Forever free for basic monitoring.",
      features: [
        { text: "1 Device Monitoring", included: true },
        { text: "Real-time Location", included: true },
        { text: "Screen Time Limits", included: true },
        { text: "App Blocking", included: true },
        { text: "Live Camera & Sound", included: false },
        { text: "Message History", included: false }
      ],
      popular: false,
      cta: "Download Free",
      ctaLink: "/download"
    },
    {
      name: "Premium",
      price: "9.99",
      period: "mo",
      description: "Full protection for the average family.",
      features: [
        { text: "5 Devices Monitoring", included: true, highlight: true },
        { text: "Live Camera Access", included: true, highlight: true },
        { text: "Live Ambient Sound", included: true, highlight: true },
        { text: "File & Gallery Check", included: true },
        { text: "Message & Call Logs", included: true },
        { text: "30-Day History", included: true }
      ],
      popular: true,
      cta: "Start Free Trial",
      ctaLink: "/signup"
    },
    {
      name: "Family",
      price: "19.99",
      period: "mo",
      description: "For large families with many devices.",
      features: [
        { text: "15 Devices Monitoring", included: true, highlight: true },
        { text: "Priority 24/7 Support", included: true, highlight: true },
        { text: "60-Day History Storage", included: true, highlight: true },
        { text: "All Premium Features", included: true },
        { text: "Dedicated Account Manager", included: true },
        { text: "Extended Cloud Storage", included: true }
      ],
      popular: false,
      cta: "Get Family Plan",
      ctaLink: "/signup"
    }
  ];

  const faqs = [
    {
      question: "Do I have to pay for the child's phone too?",
      answer: "No! You only pay for one subscription on the parent account. You can then add multiple child devices (up to your plan limit) at no extra cost."
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer: "Yes, there are no long-term contracts. You can cancel your subscription instantly from the 'Settings' menu in the app."
    },
    {
      question: "What happens after the free trial?",
      answer: "After the 3-day trial, your account will automatically upgrade to the plan you selected unless you cancel before the trial ends."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, MasterCard, Amex), PayPal, and direct payments via Google Play Store or Apple App Store."
    },
    {
      question: "Is there a refund policy?",
      answer: "Yes, we offer a 14-day money-back guarantee if the app does not work on your device as described, provided you have contacted support for assistance first."
    },
    {
      question: "Can I upgrade my plan later?",
      answer: "Absolutely. You can switch from Premium to Family plan at any time. The price difference will be adjusted automatically."
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
            <Link to="/pricing" className="text-indigo-600 font-semibold py-2 border-b border-gray-100" onClick={() => setMobileMenuOpen(false)}>Pricing</Link>
            <Link to="/setup" className="text-gray-700 font-semibold py-2 border-b border-gray-100" onClick={() => setMobileMenuOpen(false)}>Setup & Helps</Link>
            <Link to="/contact" className="text-gray-700 font-semibold py-2 border-b border-gray-100" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
            <Link to="/login" className="text-indigo-600 font-bold py-2">Log In</Link>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 via-indigo-600 to-indigo-400 pt-32 pb-20 md:pt-36 md:pb-24 px-4 relative">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
            Invest in Their Safety,<br /><span className="text-cyan-200">Not Just an App</span>
          </h1>
          <p className="text-white/90 text-lg md:text-xl mt-6 max-w-2xl mx-auto">
            Transparent pricing. No hidden fees. Cancel anytime. Start with a 3-day free trial on all premium plans.
          </p>
          <div className="mt-8">
            <a href="#plans" className="bg-white text-indigo-600 font-bold px-8 py-3 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all inline-block">
              View Plans
            </a>
          </div>
        </div>
        {/* Curved bottom edge */}
        <div className="absolute bottom-0 left-0 w-full h-20 bg-white" style={{ clipPath: "ellipse(60% 100% at 50% 100%)" }}></div>
      </section>

      {/* Pricing Plans Section */}
     <section id="plans" className="py-20 md:py-24 px-20">
      <Plans 
        showSelectButton={true}
        columns={3}
        navigateOnSelect={true}
      /> 
      </section> 

        

      {/* FAQ Section */}
      <section className="py-20 md:py-24 px-4 bg-indigo-50/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800">Billing & Subscription FAQ</h2>
            <p className="text-gray-500 text-lg mt-4">Common questions about payments and cancellations.</p>
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

      {/* Download Section */}
      <section className="bg-gray-900 text-white py-20 md:py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 opacity-90"></div>
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold">Start Your 3-Day Free Trial</h2>
          <p className="text-gray-300 text-lg mt-4 mb-8">Download Kidzet now and experience total peace of mind. No charges until the trial ends.</p>
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
        .md\:scale-102 {
          transform: scale(1.02);
        }
      `}</style>
    </div>
  );
};

export default Pricing;