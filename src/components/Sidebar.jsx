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
  ChevronRight
} from 'lucide-react';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));

  const menuItems = [
    {
      title: 'Dashboard',
      icon: <Home size={20} />,
      path: '/dashboard',
    },
    {
      title: 'Make Payment',
      icon: <CreditCard size={20} />,
      path: '/payment',
    },
    ...(user?.role === 'admin' ? [{
      title: 'Admin Panel',
      icon: <Users size={20} />,
      path: '/admin',
    }] : []),
  ];

  return (
    <div className={`bg-gray-900 text-white transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'} flex flex-col`}>
      {/* Logo */}
      <div className="p-6 border-b border-gray-800 flex items-center justify-between">
        {!collapsed && (
          <Link to="/dashboard" className="flex items-center space-x-2">
            <img src="/kidzet-sm.png" alt="Kidzet Logo" className="h-8 w-8" />
            <span className="text-xl font-bold">Kidzet Portal</span>
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-lg hover:bg-gray-800 transition-colors"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? 'bg-orange-500 text-white'
                    : 'hover:bg-gray-800 text-gray-300'
                }`}
              >
                {item.icon}
                {!collapsed && <span>{item.title}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={() => {
            localStorage.removeItem('user');
            window.location.href = '/login';
          }}
          className={`flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-800 text-gray-300 w-full transition-colors ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          <LogOut size={20} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;