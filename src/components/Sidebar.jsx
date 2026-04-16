
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  CreditCard, 
  Settings, 
  Users,
  BarChart,
  Bell,
  LogOut,
  ChevronLeft,
  ChevronRight,
  HandCoins,
  Banknote,
  LayoutDashboard,
  MapPin,
  Video,
  Clock,
  Shield,
  Package
} from 'lucide-react';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));

  const menuItems = [
    {
      title: 'Dashboard',
      icon: <LayoutDashboard size={20} />,
      path: '/dashboard',
    },
    // {
    //   title: 'Live Camera',
    //   icon: <Video size={20} />,
    //   path: '/live-camera',
    // },
    // {
    //   title: 'Location Tracking',
    //   icon: <MapPin size={20} />,
    //   path: '/location',
    // },
    // {
    //   title: 'Screen Time',
    //   icon: <Clock size={20} />,
    //   path: '/screen-time',
    // },
    {
      title: 'Plans & Payments',
      icon: <Banknote size={20} />,
      path: '/payment',
    },
    ...(user?.role === 'admin' ? [     {
      title: 'Packages',
      icon: <Package size={20} />,
      path: '/packages',
    },
    {
      title: 'Coupons',
      icon: <HandCoins size={20} />,
      path: '/adminCoupons',
    },
    {
      title: 'Admin Panel',
      icon: <Shield size={20} />,
      path: '/admin',
    }] : []),
  ];

  return (
    <div className={`bg-gradient-to-b from-gray-900 to-gray-800 text-white transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'} flex flex-col shadow-xl relative z-10`}>
      {/* Logo Section */}
      <div className="p-5 border-b border-gray-700/50 flex items-center justify-between">
        {!collapsed && (
          <Link to="/dashboard" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">KZ</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Kid<span className="text-cyan-400">zet</span>
            </span>
          </Link>
        )}
        {collapsed && (
          <Link to="/dashboard" className="mx-auto">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">KZ</span>
            </div>
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg hover:bg-gray-800/50 transition-all duration-200 hover:scale-105"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* User Profile Section */}
      {!collapsed && user && (
        <div className="p-4 border-b border-gray-700/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {user.name?.charAt(0) || user.email?.charAt(0) || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {user.name || user.email?.split('@')[0]}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {user.role === 'admin' ? 'Administrator' : 'Parent Account'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1.5">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-2.5 rounded-xl transition-all duration-200 group ${
                  location.pathname === item.path
                    ? 'bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-lg shadow-indigo-500/20'
                    : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
                }`}
              >
                <div className={`transition-transform duration-200 ${location.pathname === item.path ? 'scale-110' : 'group-hover:scale-105'}`}>
                  {item.icon}
                </div>
                {!collapsed && <span className="font-medium">{item.title}</span>}
                {collapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                    {item.title}
                  </div>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Subscription Status */}
      {/* {!collapsed && (
        <div className="mx-4 mb-4 p-3 bg-gradient-to-r from-indigo-600/20 to-cyan-500/20 rounded-xl border border-indigo-500/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-300">Current Plan</span>
            <span className="text-xs font-semibold text-cyan-400">Premium</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-1.5">
            <div className="bg-gradient-to-r from-indigo-500 to-cyan-500 h-1.5 rounded-full w-2/3"></div>
          </div>
          <p className="text-xs text-gray-400 mt-2">12 days remaining</p>
        </div>
      )} */}

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-700/50 mt-auto">
        <button
          onClick={() => {
            localStorage.removeItem('user');
            window.location.href = '/login';
          }}
          className={`flex items-center space-x-3 px-4 py-2.5 rounded-xl transition-all duration-200 text-gray-300 hover:bg-red-500/20 hover:text-red-400 w-full group ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          <LogOut size={20} className="transition-transform duration-200 group-hover:scale-105" />
          {!collapsed && <span className="font-medium">Logout</span>}
          {collapsed && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
              Logout
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;