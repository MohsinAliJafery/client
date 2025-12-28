import React, { useState, useEffect } from 'react';
import API from '../utils/api';
import toast from 'react-hot-toast';
import {
  Users,
  CreditCard,
  CheckCircle,
  DollarSign,
  Settings,
  BarChart,
  TrendingUp,
  Download,
  Filter,
  Search,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  Calendar,
  UserCheck,
  Activity,
  Shield,
  RefreshCw,
  AlertCircle,
  ChevronDown
} from 'lucide-react';
import { ref, set } from "firebase/database";
import { database } from "../firebase";

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [settings, setSettings] = useState({});
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);

  const token = JSON.parse(localStorage.getItem('user'))?.token;

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
  try {
    setLoading(true);
    
    // Fetch data from MongoDB API
    const [statsRes, usersRes, transactionsRes, settingsRes] = await Promise.all([
      API.get('/api/admin/stats', { headers: { Authorization: `Bearer ${token}` } }),
      API.get('/api/admin/users', { headers: { Authorization: `Bearer ${token}` } }),
      API.get('/api/admin/transactions', { headers: { Authorization: `Bearer ${token}` } }),
      API.get('/api/admin/settings', { headers: { Authorization: `Bearer ${token}` } }),
    ]);

    // Fetch from Firebase for backup/verification
    let firebaseSettings = {};
    try {
      const settingsSnapshot = await get(ref(database, "app_settings"));
      if (settingsSnapshot.exists()) {
        firebaseSettings = settingsSnapshot.val();
      }
    } catch (firebaseError) {
      console.warn('Could not fetch from Firebase:', firebaseError);
    }

    setStats(statsRes.data.data || {});
    setUsers(usersRes.data.data || []);
    setTransactions(transactionsRes.data.data || []);
    
    // Use MongoDB settings as primary, fallback to Firebase
    setSettings(settingsRes.data.data || firebaseSettings || {});
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    toast.error('Failed to fetch dashboard data');
  } finally {
    setLoading(false);
  }
};

 const updateSettings = async (updatedSettings) => {
  try {
    setLoading(true);

    console.log("settings data:", updatedSettings);
    
    // Prepare data for both systems
    const settingsData = {
      ...updatedSettings,
      lastUpdated: new Date().toISOString(),
      updatedBy: JSON.parse(localStorage.getItem('user'))?.name || 'Admin'
    };

    // Save to Firebase (for Payment component)
    try {
      await set(ref(database, "app_settings"), settingsData);
      console.log('Saved to Firebase successfully');
    } catch (firebaseError) {
      console.error('Firebase save error:', firebaseError);
      toast.error('Failed to save to Firebase');
      throw firebaseError; // Re-throw to stop execution
    }

    // Save to MongoDB (for admin dashboard)
    try {
      const response = await API.put('/api/admin/settings', settingsData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Update local state with MongoDB response
      setSettings(response.data.data || settingsData);
      console.log('Saved to MongoDB successfully');
    } catch (mongoError) {
      console.error('MongoDB save error:', mongoError);
      // Don't throw here, Firebase was successful
      toast.warning('Saved to Firebase but MongoDB update failed');
    }

    toast.success('Settings updated successfully in both systems');
    
  } catch (error) {
    console.error('Error updating settings:', error);
    if (!error.message.includes('Firebase')) {
      toast.error('Failed to update settings');
    }
  } finally {
    setLoading(false);
  }
};

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTransactions = transactions.filter(transaction =>
    transaction.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.paymentMethod?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExportData = (type) => {
    // Export functionality
    toast.success(`${type} data exported successfully`);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers || 0}
          icon={<Users className="text-blue-500" size={24} />}
          change="+12%"
          color="blue"
        />
        <StatCard
          title="Total Revenue"
          value={`$${(stats.totalRevenue || 0).toLocaleString()}`}
          icon={<DollarSign className="text-green-500" size={24} />}
          change="+23%"
          color="green"
        />
        <StatCard
          title="Completed Transactions"
          value={stats.completedTransactions || 0}
          icon={<CheckCircle className="text-purple-500" size={24} />}
          change="+8%"
          color="purple"
        />
        <StatCard
          title="Active Subscriptions"
          value={stats.activeSubscriptions || 0}
          icon={<Activity className="text-orange-500" size={24} />}
          change="+5%"
          color="orange"
        />
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-wrap border-b border-gray-200">
          {[
            { id: 'dashboard', label: 'Overview', icon: <BarChart size={18} /> },
            { id: 'users', label: 'Users', icon: <Users size={18} /> },
            { id: 'transactions', label: 'Transactions', icon: <CreditCard size={18} /> },
            { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-3 font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-orange-500 text-orange-600 bg-orange-50'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Dashboard Overview */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Recent Activity */}
              <div className="">
                <RecentTransactions transactions={transactions.slice(0, 5)} />
              </div>
              
            </div>
          )}

          {/* Users Management */}
          {activeTab === 'users' && (
            <UsersTable
              users={filteredUsers}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              onUserClick={(user) => {
                setSelectedUser(user);
                setShowUserModal(true);
              }}
            />
          )}

          {/* Transactions */}
          {activeTab === 'transactions' && (
            <TransactionsTable
              transactions={filteredTransactions}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              dateRange={dateRange}
              setDateRange={setDateRange}
            />
          )}

          {/* Settings */}
          {activeTab === 'settings' && (
            <SettingsPanel settings={settings} onUpdate={updateSettings} />
          )}
        </div>
      </div>

      {/* User Detail Modal */}
      {showUserModal && selectedUser && (
        <UserDetailModal
          user={selectedUser}
          onClose={() => {
            setShowUserModal(false);
            setSelectedUser(null);
          }}
        />
      )}
    </div>
  );
};

// Sub-components
const StatCard = ({ title, value, icon, change, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-100',
    green: 'bg-green-50 border-green-100',
    purple: 'bg-purple-50 border-purple-100',
    orange: 'bg-orange-50 border-orange-100',
  };

  return (
    <div className={`p-6 rounded-xl border ${colorClasses[color] || 'bg-gray-50'} transition-transform hover:scale-[1.02]`}>
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-white rounded-lg shadow-sm">
          {icon}
        </div>
        {change && (
          <span className={`text-sm font-medium ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
            {change}
          </span>
        )}
      </div>
      <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      <p className="text-sm text-gray-600 mt-1">{title}</p>
    </div>
  );
};

const QuickStat = ({ title, value, icon }) => (
  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
    <div className="flex items-center space-x-3">
      <div className="p-2 bg-gray-100 rounded-lg">
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-600">{title}</p>
      </div>
    </div>
  </div>
);

const RecentTransactions = ({ transactions }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-6">
    <div className="flex justify-between items-center mb-4">
      <h3 className="font-semibold text-gray-900">Recent Transactions</h3>
      <button className="text-sm text-orange-600 hover:text-orange-700 font-medium">
        View All
      </button>
    </div>
    <div className="space-y-4">
      {transactions.slice(0, 5).map((tx) => (
        <div key={tx._id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              tx.status === 'completed' ? 'bg-green-100' :
              tx.status === 'pending' ? 'bg-yellow-100' : 'bg-red-100'
            }`}>
              <CreditCard size={18} className={
                tx.status === 'completed' ? 'text-green-600' :
                tx.status === 'pending' ? 'text-yellow-600' : 'text-red-600'
              } />
            </div>
            <div>
              <p className="font-medium text-gray-900">{tx.user?.name || 'Anonymous'}</p>
              <p className="text-sm text-gray-500">{tx.paymentMethod}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-semibold text-gray-900">${tx.amount}</p>
            <p className="text-sm text-gray-500">{new Date(tx.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const UsersTable = ({ users, searchTerm, setSearchTerm, onUserClick }) => (
  <div className="space-y-4">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>
    </div>

    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              User
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Role
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Subscription
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user._id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-semibold">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-500">
                      Joined {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {user.email}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  user.role === 'admin' 
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {user.role}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {user.subscription || 'None'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onUserClick(user)}
                    className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                    title="View Details"
                  >
                    <Eye size={18} />
                  </button>
                  <button className="text-gray-600 hover:text-gray-900 p-1 hover:bg-gray-50 rounded">
                    <Edit size={18} />
                  </button>
                  <button className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded">
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const TransactionsTable = ({ transactions, searchTerm, setSearchTerm, dateRange, setDateRange }) => (
  <div className="space-y-4">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search transactions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>
      <div className="flex items-center space-x-3">

      </div>
    </div>

    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Transaction ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              User
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Amount
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Method
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {transactions.map((tx) => (
            <tr key={tx._id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                #{tx._id.slice(-8)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{tx.user?.name || 'Anonymous'}</div>
                    <div className="text-sm text-gray-500">{tx.user?.email}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="font-semibold text-gray-900">${tx.amount}</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                  {tx.paymentMethod}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  tx.status === 'completed'
                    ? 'bg-green-100 text-green-800'
                    : tx.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {tx.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(tx.createdAt).toLocaleDateString()}
                <div className="text-xs text-gray-400">
                  {new Date(tx.createdAt).toLocaleTimeString()}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const SettingsPanel = ({ settings, onUpdate }) => {
  const [formData, setFormData] = useState({
    freeTrialDays: 0,
    weeklyPrice: 0,
    monthlyPrice: 0,
    yearlyPrice: 0,
    currency: "USD",
    paypalEnabled: false,
    paytmEnabled: false,
    
    plans: {
      trial_days: { days: 0, price: 0 },
      weekly_sub: { days: 7, price: 0 },
      monthly_sub: { days: 30, price: 0 },
      yearly_sub: { days: 365, price: 0 }
    },
    
    ...settings
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings) {
      // Convert MongoDB structure to form structure
      console.log("Settings in UseEffect", settings)
      const newFormData = {
        freeTrialDays: settings.freeTrialDays || 0,
        weeklyPrice: settings.weeklyPrice || 0,
        monthlyPrice: settings.monthlyPrice || 0,
        yearlyPrice: settings.yearlyPrice || 0,
        currency: settings.currency || "USD",
        paypalEnabled: settings.paypalEnabled || false,
        paytmEnabled: settings.paytmEnabled || false,
        plans: settings.plans || {
          trial_days: { days: settings.freeTrialDays || 0, price: 0 },
          weekly_sub: { days: 7, price: settings.weeklyPrice || 0 },
          monthly_sub: { days: 30, price: settings.monthlyPrice || 0 },
          yearly_sub: { days: 365, price: settings.yearlyPrice || 0 }
        }
      };
      setFormData(newFormData);
    }
  }, [settings]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : 
                     name.includes('Price') ? parseFloat(value) || 0 :
                     name === 'freeTrialDays' ? parseInt(value) || 0 : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
  };

  const handlePlanChange = (planKey, field, value) => {
    setFormData(prev => ({
      ...prev,
      plans: {
        ...prev.plans,
        [planKey]: {
          ...prev.plans[planKey],
          [field]: field === 'price' ? parseFloat(value) || 0 : parseInt(value) || 0
        }
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const dataToSave = {
        freeTrialDays: formData.plans.trial_days.days || formData.freeTrialDays,
        weeklyPrice: formData.plans.weekly_sub.price || formData.weeklyPrice,
        monthlyPrice: formData.plans.monthly_sub.price || formData.monthlyPrice,
        yearlyPrice: formData.plans.yearly_sub.price || formData.yearlyPrice,
        currency: formData.currency,
        paypalEnabled: formData.paypalEnabled,
        paytmEnabled: formData.paytmEnabled,
        
        // Firebase structure
        plans: {
          trial_days: {
            days: formData.plans.trial_days.days || formData.freeTrialDays,
            price: formData.plans.trial_days.price
          },
          weekly_sub: {
            days: formData.plans.weekly_sub.days,
            price: formData.plans.weekly_sub.price || formData.weeklyPrice
          },
          monthly_sub: {
            days: formData.plans.monthly_sub.days,
            price: formData.plans.monthly_sub.price || formData.monthlyPrice
          },
          yearly_sub: {
            days: formData.plans.yearly_sub.days,
            price: formData.plans.yearly_sub.price || formData.yearlyPrice
          }
        }
      };
      
      await onUpdate(dataToSave);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-full mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Pricing Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Currency */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Currency
                </label>
                <select
                  name="currency"
                  value={formData.currency || 'USD'}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="INR">INR (₹)</option>
                </select>
              </div>

              {/* Free Trial */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Free Trial (MongoDB: freeTrialDays)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <input
                      type="number"
                      placeholder="Days"
                      value={formData.plans.trial_days.days || formData.freeTrialDays}
                      onChange={(e) => handlePlanChange('trial_days', 'days', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Days</p>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Price"
                      value={formData.plans.trial_days.price}
                      onChange={(e) => handlePlanChange('trial_days', 'price', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg pl-8 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Price</p>
                  </div>
                </div>
              </div>

              {/* Weekly Plan */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Weekly Plan (MongoDB: weeklyPrice)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <input
                      type="number"
                      placeholder="Days"
                      value={formData.plans.weekly_sub.days}
                      onChange={(e) => handlePlanChange('weekly_sub', 'days', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Days</p>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Price"
                      value={formData.plans.weekly_sub.price || formData.weeklyPrice}
                      onChange={(e) => handlePlanChange('weekly_sub', 'price', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg pl-8 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Price</p>
                  </div>
                </div>
              </div>

              {/* Monthly Plan */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Monthly Plan (MongoDB: monthlyPrice)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <input
                      type="number"
                      placeholder="Days"
                      value={formData.plans.monthly_sub.days}
                      onChange={(e) => handlePlanChange('monthly_sub', 'days', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Days</p>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Price"
                      value={formData.plans.monthly_sub.price || formData.monthlyPrice}
                      onChange={(e) => handlePlanChange('monthly_sub', 'price', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg pl-8 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Price</p>
                  </div>
                </div>
              </div>

              {/* Yearly Plan */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Yearly Plan
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <input
                      type="number"
                      placeholder="Days"
                      value={formData.plans.yearly_sub.days}
                      onChange={(e) => handlePlanChange('yearly_sub', 'days', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Days</p>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Price"
                      value={formData.plans.yearly_sub.price}
                      onChange={(e) => handlePlanChange('yearly_sub', 'price', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg pl-8 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Price</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h3>
            <div className="space-y-4">
              <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-50 rounded">
                    <CreditCard className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">PayPal</p>
                    <p className="text-sm text-gray-500">Enable PayPal payments</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  name="paypalEnabled"
                  checked={formData.paypalEnabled || false}
                  onChange={handleChange}
                  className="h-5 w-5 text-orange-600 rounded focus:ring-orange-500"
                />
              </label>
              <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-50 rounded">
                    <CreditCard className="text-green-600" size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">PayTM</p>
                    <p className="text-sm text-gray-500">Enable PayTM payments</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  name="paytmEnabled"
                  checked={formData.paytmEnabled || false}
                  onChange={handleChange}
                  className="h-5 w-5 text-orange-600 rounded focus:ring-orange-500"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Save Panel */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Save Changes</h3>
            <p className="text-sm text-gray-600 mb-6">
              Settings will be saved to both MongoDB (admin) and Firebase (payments)
            </p>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={saving}
              className="w-full py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {saving ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                  Saving to both systems...
                </div>
              ) : 'Save All Settings'}
            </button>
          </div>

          {/* System Info */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Storage</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">MongoDB</span>
                <span className="text-sm font-medium text-green-600">Admin Data</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Firebase</span>
                <span className="text-sm font-medium text-blue-600">Payment Data</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Sync Status</span>
                <span className="text-sm font-medium text-green-600">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const UserDetailModal = ({ user, onClose }) => {
  if (!user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900">User Details</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              ✕
            </button>
          </div>
          
          <div className="space-y-6">
            {/* User Header */}
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 text-2xl font-bold">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h4 className="text-2xl font-bold text-gray-900">{user.name}</h4>
                <p className="text-gray-600">{user.email}</p>
                <span className={`mt-2 inline-block px-3 py-1 text-sm font-semibold rounded-full ${
                  user.role === 'admin' 
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {user.role}
                </span>
              </div>
            </div>

            {/* User Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Subscription Plan</p>
                <p className="font-semibold text-gray-900">{user.subscription || 'None'}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Member Since</p>
                <p className="font-semibold text-gray-900">
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-3 pt-6 border-t border-gray-200">
              <button className="flex-1 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                Edit User
              </button>
              <button className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                View Transactions
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};



export default AdminDashboard;