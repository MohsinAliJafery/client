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
  Banknote,
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
  ChevronDown,
  Mail,
  Smartphone,
  Globe,
  Clock,
  ShieldCheck,
  Key,
  Database,
  X
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [settings, setSettings] = useState({});
  const [activeTab, setActiveTab] = useState('users');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const token = JSON.parse(localStorage.getItem('user'))?.token;

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const [statsRes, usersRes, transactionsRes, settingsRes] = await Promise.all([
        API.get('/api/admin/stats', { headers: { Authorization: `Bearer ${token}` } }),
        API.get('/api/admin/users', { headers: { Authorization: `Bearer ${token}` } }),
        API.get('/api/admin/transactions', { headers: { Authorization: `Bearer ${token}` } }),
        API.get('/api/admin/settings', { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      setStats(statsRes.data.data || {});
      setUsers(usersRes.data.data || []);
      setTransactions(transactionsRes.data.data || []);
      setSettings(settingsRes.data.data || {});
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

      const settingsData = {
        ...updatedSettings,
        lastUpdated: new Date().toISOString(),
        updatedBy: JSON.parse(localStorage.getItem('user'))?.name || 'Admin'
      };

      const response = await API.put('/api/admin/settings', settingsData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setSettings(response.data.data || settingsData);
      toast.success('Settings updated successfully');
      
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (uid) => {
    try {
      const externalResponse = await API.delete(`https://serv2.kidzet.com/admin/users/${uid}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!externalResponse.data.success) {
        toast.error('Failed to delete user from external system');
        return;
      }
      
      const mongoResponse = await API.delete(`/api/admin/users/${uid}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (mongoResponse.data.success) {
        toast.success('User deleted successfully');
        
        const usersRes = await API.get('/api/admin/users', { 
          headers: { Authorization: `Bearer ${token}` } 
        });
        setUsers(usersRes.data.data || []);
        setDeleteConfirm(null);
        
        const statsRes = await API.get('/api/admin/stats', { 
          headers: { Authorization: `Bearer ${token}` } 
        });
        setStats(statsRes.data.data || {});
      } else {
        toast.error('Failed to delete user from database');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      
      if (error.response?.status === 404) {
        toast.error('User not found');
      } else if (error.response?.status === 401) {
        toast.error('Unauthorized');
      } else {
        toast.error(error.response?.data?.message || 'Failed to delete user');
      }
    }
  };

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.uid?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTransactions = transactions.filter(transaction =>
    transaction.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.paymentMethod?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSubscriptionStats = () => {
    const activeSubscriptions = users.filter(user => 
      user.subscriptionStatus === 'active' && 
      user.subscriptionEndDate && 
      new Date(user.subscriptionEndDate) > new Date()
    ).length;
    
    const weeklySubscriptions = users.filter(user => user.subscription === 'weekly').length;
    const monthlySubscriptions = users.filter(user => user.subscription === 'monthly').length;
    const yearlySubscriptions = users.filter(user => user.subscription === 'yearly').length;
    
    return { activeSubscriptions, weeklySubscriptions, monthlySubscriptions, yearlySubscriptions };
  };

  const subscriptionStats = getSubscriptionStats();

  if (loading) {
        return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Users"
          value={users.length || 0}
          icon={<Users size={22} />}
          change="+12%"
          color="indigo"
        />
        <StatCard
          title="Active Subscriptions"
          value={subscriptionStats.activeSubscriptions || 0}
          icon={<UserCheck size={22} />}
          change="+23%"
          color="green"
        />
        <StatCard
          title="Total Revenue"
          value={`$${(stats.totalRevenue || 0).toLocaleString()}`}
          icon={<DollarSign size={22} />}
          change="+18%"
          color="purple"
        />
        <StatCard
          title="Transactions"
          value={transactions.length || 0}
          icon={<Activity size={22} />}
          change="+5%"
          color="orange"
        />
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white rounded-lg border border-gray-100 shadow-sm">
        <div className="flex flex-wrap border-b border-gray-100">
          {[
            { id: 'users', label: 'Users', icon: <Users size={16} /> },
            { id: 'transactions', label: 'Transactions', icon: <Banknote size={16} /> },
            // { id: 'settings', label: 'Settings', icon: <Settings size={16} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-5">
          {activeTab === 'users' && (
            <UsersTable
              users={filteredUsers}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              onUserClick={(user) => {
                setSelectedUser(user);
                setShowUserModal(true);
              }}
              onDeleteUser={(user) => setDeleteConfirm(user)}
            />
          )}

          {activeTab === 'transactions' && (
            <TransactionsTable
              transactions={filteredTransactions}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              dateRange={dateRange}
              setDateRange={setDateRange}
            />
          )}

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

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <DeleteConfirmModal
          user={deleteConfirm}
          onConfirm={() => handleDeleteUser(deleteConfirm.uid)}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}
    </div>
  );
};

// StatCard Component
const StatCard = ({ title, value, icon, change, color }) => {
  const colorClasses = {
    indigo: 'bg-indigo-50',
    green: 'bg-green-50',
    purple: 'bg-purple-50',
    orange: 'bg-orange-50',
  };

  const textColors = {
    indigo: 'text-indigo-600',
    green: 'text-green-600',
    purple: 'text-purple-600',
    orange: 'text-orange-600',
  };

  return (
    <div className={`p-5 rounded-xl border border-gray-100 ${colorClasses[color]} transition-all hover:shadow-md`}>
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 bg-white rounded-lg shadow-sm ${textColors[color]}`}>
          {icon}
        </div>
        {change && (
          <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
            {change}
          </span>
        )}
      </div>
      <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
      <p className="text-sm text-gray-500 mt-1">{title}</p>
    </div>
  );
};

// UsersTable Component
const UsersTable = ({ users, searchTerm, setSearchTerm, onUserClick, onDeleteUser }) => {
  const getSubscriptionDisplay = (user) => {
    if (!user.subscription || user.subscription === 'free_trial') {
      return 'Free Trial';
    }
    return user.subscription.charAt(0).toUpperCase() + user.subscription.slice(1);
  };

  const getSubscriptionStatus = (user) => {
    if (user.subscriptionStatus === 'active') {
      if (user.subscriptionEndDate && new Date(user.subscriptionEndDate) < new Date()) {
        return 'expired';
      }
      return 'active';
    }
    return user.subscriptionStatus || 'inactive';
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'expired': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h3 className="text-base font-semibold text-gray-800">All Users</h3>
          <p className="text-xs text-gray-500">Manage registered users</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-100">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">UID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plan</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {users.map((user) => {
              const status = getSubscriptionStatus(user);
              const statusColor = getStatusColor(status);
              
              return (
                <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold text-sm">
                        {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-gray-800">{user.name || 'No Name'}</span>
                    </div>
                   </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs font-mono text-gray-500">
                    {user.uid?.substring(0, 12)}...
                   </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                    {user.email}
                   </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      user.role === 'admin' 
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {user.role || 'user'}
                    </span>
                   </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                    {getSubscriptionDisplay(user)}
                   </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColor}`}>
                      {status}
                    </span>
                   </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onUserClick(user)}
                        className="p-1 text-gray-400 hover:text-indigo-600 transition-colors"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => onDeleteUser(user)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete User"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                   </td>
                 </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {users.length === 0 && (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <Users className="mx-auto h-10 w-10 text-gray-300" />
          <h3 className="mt-2 text-sm font-medium text-gray-600">No users found</h3>
        </div>
      )}
    </div>
  );
};

// TransactionsTable Component
const TransactionsTable = ({ transactions, searchTerm, setSearchTerm, dateRange, setDateRange }) => {
  const getFilteredTransactions = () => {
    let filtered = transactions;
    
    if (dateRange !== 'all') {
      const now = new Date();
      const startDate = new Date();
      
      switch(dateRange) {
        case 'today':
          startDate.setHours(0, 0, 0, 0);
          filtered = filtered.filter(tx => new Date(tx.createdAt) >= startDate);
          break;
        case 'week':
          startDate.setDate(now.getDate() - 7);
          filtered = filtered.filter(tx => new Date(tx.createdAt) >= startDate);
          break;
        case 'month':
          startDate.setMonth(now.getMonth() - 1);
          filtered = filtered.filter(tx => new Date(tx.createdAt) >= startDate);
          break;
        default:
          break;
      }
    }
    
    return filtered;
  };

  const getUserDisplayName = (transaction) => {
    if (transaction.payerName && transaction.payerName !== 'Anonymous') {
      return transaction.payerName;
    }
    if (transaction.user?.name && transaction.user.name !== 'Anonymous') {
      return transaction.user.name;
    }
    if (transaction.payerEmail) {
      const emailName = transaction.payerEmail.split('@')[0];
      return emailName.replace(/[.-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
    if (transaction.user?.email) {
      const emailName = transaction.user.email.split('@')[0];
      return emailName.replace(/[.-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
    return 'Unknown';
  };

  const displayedTransactions = getFilteredTransactions();

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h3 className="text-base font-semibold text-gray-800">All Transactions</h3>
          <p className="text-xs text-gray-500">View payment history</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-48">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-100">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plan</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {displayedTransactions.map((tx) => (
              <tr key={tx._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 whitespace-nowrap text-xs font-mono text-gray-500">
                  #{tx._id?.slice(-8)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-800">
                      {getUserDisplayName(tx)}
                    </div>
                    <div className="text-xs text-gray-400">
                      {tx.payerEmail || tx.user?.email}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="font-semibold text-gray-800">${tx.amount?.toFixed(2)}</span>
                  {tx.discountAmount > 0 && (
                    <div className="text-xs text-green-600">-${tx.discountAmount.toFixed(2)}</div>
                  )}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full capitalize">
                    {tx.paymentMethod}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 capitalize">
                  {tx.subscriptionType?.replace('_sub', '') || 'N/A'}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    tx.status === 'completed'
                      ? 'bg-green-100 text-green-700'
                      : tx.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {tx.status}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  {new Date(tx.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {displayedTransactions.length === 0 && (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <CreditCard className="mx-auto h-10 w-10 text-gray-300" />
          <h3 className="mt-2 text-sm font-medium text-gray-600">No transactions found</h3>
        </div>
      )}
    </div>
  );
};

// SettingsPanel Component
const SettingsPanel = ({ settings, onUpdate }) => {
  const [formData, setFormData] = useState({
    freeTrialDays: 7,
    weeklyPrice: 9.99,
    monthlyPrice: 29.99,
    yearlyPrice: 299.99,
    currency: "USD",
    paypalEnabled: true,
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings) {
      setFormData({
        freeTrialDays: settings.freeTrialDays || 7,
        weeklyPrice: settings.weeklyPrice || 9.99,
        monthlyPrice: settings.monthlyPrice || 29.99,
        yearlyPrice: settings.yearlyPrice || 299.99,
        currency: settings.currency || "USD",
        paypalEnabled: settings.paypalEnabled !== false,
      });
    }
  }, [settings]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
              name.includes('Price') ? parseFloat(value) || 0 :
              name === 'freeTrialDays' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onUpdate(formData);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl">
      <h3 className="text-base font-semibold text-gray-800 mb-4">Pricing Settings</h3>
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Free Trial (Days)
            </label>
            <input
              type="number"
              name="freeTrialDays"
              value={formData.freeTrialDays}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Currency
            </label>
            <select
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-indigo-500"
            >
              <option value="USD">USD ($)</option>
              <option value="INR">INR (₹)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Weekly Price
            </label>
            <input
              type="number"
              step="0.01"
              name="weeklyPrice"
              value={formData.weeklyPrice}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Monthly Price
            </label>
            <input
              type="number"
              step="0.01"
              name="monthlyPrice"
              value={formData.monthlyPrice}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Yearly Price
            </label>
            <input
              type="number"
              step="0.01"
              name="yearlyPrice"
              value={formData.yearlyPrice}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="paypalEnabled"
              checked={formData.paypalEnabled}
              onChange={handleChange}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-sm text-gray-700">Enable PayPal Payments</span>
          </label>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </form>
  );
};

// UserDetailModal Component
const UserDetailModal = ({ user, onClose }) => {
  if (!user) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">User Details</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-5 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xl font-bold">
              {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-800">{user.name || 'No Name'}</h4>
              <p className="text-sm text-gray-500">{user.email}</p>
              <p className="text-xs font-mono text-gray-400 mt-1">{user.uid}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500">Role</p>
              <p className="text-sm font-medium text-gray-800 capitalize">{user.role || 'user'}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500">Status</p>
              <p className="text-sm font-medium text-gray-800 capitalize">{user.subscriptionStatus || 'inactive'}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500">Plan</p>
              <p className="text-sm font-medium text-gray-800 capitalize">{user.subscription || 'free_trial'}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500">Member Since</p>
              <p className="text-sm font-medium text-gray-800">{new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// DeleteConfirmModal Component
const DeleteConfirmModal = ({ user, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-sm w-full p-5">
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle className="text-red-600" size={24} />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 text-center mb-2">Delete User</h3>
        <p className="text-sm text-gray-500 text-center mb-5">
          Delete <span className="font-medium text-gray-700">{user.name || user.email}</span>? This cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
