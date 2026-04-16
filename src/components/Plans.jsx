// components/Plans.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle, 
  Crown, 
  Clock, 
  Smartphone, 
  Star, 
  Trophy,
  Calendar,
  Gift,
  Wifi,
  MapPin,
  Video,
  Headphones
} from 'lucide-react';
import API from '../utils/api';

// Icon mapping (same as your original)
const iconComponents = {
  Crown: <Crown className="w-8 h-8" />,
  Trophy: <Trophy className="w-8 h-8" />,
  Calendar: <Calendar className="w-8 h-8" />,
  Star: <Star className="w-8 h-8" />,
  Gift: <Gift className="w-8 h-8" />,
  Smartphone: <Smartphone className="w-8 h-8" />,
  Wifi: <Wifi className="w-8 h-8" />,
  MapPin: <MapPin className="w-8 h-8" />,
  Video: <Video className="w-8 h-8" />,
  Headphones: <Headphones className="w-8 h-8" />
};

const getIcon = (iconName) => {
  return iconComponents[iconName] || <Crown className="w-8 h-8" />;
};

const getIconColor = (index) => {
  const colors = [
    "text-indigo-500",
    "text-indigo-600",
    "text-indigo-700",
    "text-purple-500",
    "text-blue-500",
    "text-cyan-500"
  ];
  return colors[index % colors.length];
};

const Plans = ({ 
  onSelectPlan, 
  selectedPlanId = null,
  showSelectButton = true,
  className = "",
  currency = "USD",
  columns = 3 // 1, 2, 3, or 4
}) => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredPlan, setHoveredPlan] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const response = await API.get('/api/packages/public');
      if (response.data.success) {
        setPackages(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching packages:", error);
    } finally {
      setLoading(false);
    }
  };

  // Build plans array from packages
  const plans = packages.map((pkg, index) => ({
    key: pkg._id,
    id: pkg._id,
    title: pkg.name,
    description: pkg.description,
    icon: getIcon(pkg.icon),
    iconColor: getIconColor(index),
    features: pkg.features || [],
    price: pkg.price,
    days: pkg.days,
    devices: pkg.devices,
    popular: pkg.popular,
    order: pkg.order
  })).sort((a, b) => a.order - b.order);

  const handleSelectPlan = (plan) => {
  // Check if user is logged in by checking localStorage
  const userStr = localStorage.getItem('user');
  let user = null;
  let token = null;
  
  try {
    if (userStr) {
      user = JSON.parse(userStr);
      token = user?.token;
    }
  } catch (e) {
    console.error("Error parsing user data:", e);
  }
  
  if (!user || !token) {
    // User is not logged in, redirect to login with return URL parameter
    navigate(`/login?redirect=plans&planId=${plan.key}&planName=${encodeURIComponent(plan.title)}`);
    return;
  }else {
    navigate(`/payment`);
  }
  
  // User is logged in, proceed with plan selection
  if (onSelectPlan) {
    onSelectPlan(plan);
  }
};

  // Determine grid columns based on prop
  const getGridCols = () => {
    const cols = {
      1: 'grid-cols-1',
      2: 'grid-cols-1 md:grid-cols-2',
      3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
    };
    return cols[columns] || cols[3];
  };

  if (loading) {
    return (
      <div className={`flex justify-center items-center py-12 ${className}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <div className={`text-center py-12 bg-gray-50 rounded-xl ${className}`}>
        <Crown className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-gray-600">No packages available</h3>
        <p className="text-sm text-gray-400 mt-1">Please check back later</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className={`grid ${getGridCols()} gap-6`}>
        {plans.map((plan, index) => (
          <div
            key={plan.key}
            onMouseEnter={() => setHoveredPlan(plan.key)}
            onMouseLeave={() => setHoveredPlan(null)}
            onClick={() => handleSelectPlan(plan)}
            className={`
              relative bg-white rounded-xl shadow-sm border-2 cursor-pointer transition-all duration-300
              ${selectedPlanId === plan.key 
                ? 'border-indigo-600 shadow-md ring-2 ring-indigo-200' 
                : 'border-gray-100 hover:border-gray-200 hover:shadow-md'
              }
              ${hoveredPlan === plan.key ? 'transform scale-[1.02]' : ''}
            `}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                <div className="bg-gradient-to-r from-indigo-600 to-cyan-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md flex items-center gap-1 whitespace-nowrap">
                  <Star className="w-3 h-3" />
                  MOST POPULAR
                </div>
              </div>
            )}

            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg ${plan.iconColor}/10`}>
                  {plan.icon}
                </div>
                {selectedPlanId === plan.key && (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
              </div>

              <h3 className="text-xl font-bold text-gray-800 mb-1">{plan.title}</h3>
              {plan.description && (
                <p className="text-xs text-gray-400 mb-3 line-clamp-2">{plan.description}</p>
              )}
              
              <div className="mb-4">
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-gray-800">
                    {plan.price === 0 ? 'Free' : `${currency} ${plan.price}`}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-gray-400 text-sm ml-1">/ {plan.days} days</span>
                  )}
                </div>
                <div className="flex items-center text-gray-400 text-xs mt-2">
                  <Clock className="w-3 h-3 mr-1" />
                  <span>{plan.days} days access</span>
                </div>
                {plan.devices > 0 && (
                  <div className="flex items-center text-gray-400 text-xs mt-1">
                    <Smartphone className="w-3 h-3 mr-1" />
                    <span>Up to {plan.devices} {plan.devices === 1 ? 'device' : 'devices'}</span>
                  </div>
                )}
              </div>

              <ul className="space-y-2 mb-6">
                {plan.features.slice(0, 4).map((feature, idx) => (
                  <li key={idx} className="flex items-start text-sm">
                    <CheckCircle className="w-3 h-3 text-indigo-500 mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-gray-600 line-clamp-1">{feature}</span>
                  </li>
                ))}
                {plan.features.length > 4 && (
                  <li className="text-xs text-gray-400 pl-5">
                    +{plan.features.length - 4} more features
                  </li>
                )}
              </ul>

              {showSelectButton && (
                <button
                  className={`
                    w-full py-2.5 rounded-lg font-semibold transition-all duration-300 text-sm
                    ${selectedPlanId === plan.key
                      ? 'bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }
                  `}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectPlan(plan);
                  }}
                >
                  {selectedPlanId === plan.key ? 'Selected' : 'Choose Plan'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Plans;