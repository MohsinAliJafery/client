import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import API from '../utils/api';
import { getValidToken } from '../utils/tokenRefresh';
import { 
  CreditCard, 
  DollarSign, 
  TrendingUp, 
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  Filter,
  Eye,
  MapPin,
  Video,
  Shield,
  Package
} from 'lucide-react';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSpent: 0,
    completedPayments: 0,
    pendingPayments: 0,
    averageAmount: 0
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchDashboardData(parsedUser);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchDashboardData = async (userData) => {
    try {
      setLoading(true);
      
      // Get valid token (auto-refreshes if expired)
      const token = await getValidToken();
      
      // Fetch transactions and subscription details in parallel
      const [transactionsRes, subscriptionRes] = await Promise.all([
        API.get('/api/payments/transactions', {
          headers: { Authorization: `Bearer ${token}` }
        }),
      ]);
      
      setTransactions(transactionsRes.data.data || []);
      calculateStats(transactionsRes.data.data || []);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        // Clear local storage and redirect to login
        localStorage.removeItem('user');
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else {
        toast.error(error.response?.data?.message || 'Failed to fetch dashboard data');
      }
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (transactions) => {
    const totalSpent = transactions
      .filter(t => t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const completed = transactions.filter(t => t.status === 'completed').length;
    const pending = transactions.filter(t => t.status === 'pending').length;
    const average = completed > 0 ? totalSpent / completed : 0;

    setStats({
      totalSpent,
      completedPayments: completed,
      pendingPayments: pending,
      averageAmount: average
    });
  };

  const getSubscriptionStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'expired': return 'bg-red-100 text-red-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getDaysRemaining = (endDate) => {
    if (!endDate) return 0;
    const now = new Date();
    const end = new Date(endDate);
    const diffTime = end - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-2xl p-6 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.name?.split(' ')[0] || 'Parent'}!</h1>
            <p className="text-white/80">Monitor your family's safety and manage your account from here.</p>
          </div>
          
          {/* Subscription Status Badge */}
          {subscription && (
            <div className={`px-3 py-1.5 rounded-lg ${getSubscriptionStatusColor(subscription.status)} bg-opacity-20 backdrop-blur-sm`}>
              <div className="flex items-center gap-2">
                <Package size={16} />
                <span className="text-sm font-semibold">
                  {subscription.planName || subscription.type?.toUpperCase()}
                </span>
              </div>
              {subscription.endDate && subscription.status === 'active' && (
                <div className="text-xs mt-1">
                  {getDaysRemaining(subscription.endDate)} days remaining
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Spent</p>
              <p className="text-2xl font-bold mt-1 text-gray-800">
                ${stats.totalSpent.toFixed(2)}
              </p>
            </div>
            <div className="p-3 bg-indigo-50 rounded-lg">
              <DollarSign className="text-indigo-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Completed Payments</p>
              <p className="text-2xl font-bold mt-1 text-gray-800">{stats.completedPayments}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <CheckCircle className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending Payments</p>
              <p className="text-2xl font-bold mt-1 text-gray-800">{stats.pendingPayments}</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <Clock className="text-yellow-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Average Amount</p>
              <p className="text-2xl font-bold mt-1 text-gray-800">
                ${stats.averageAmount.toFixed(2)}
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <TrendingUp className="text-blue-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Details Card (if active) */}
      {subscription && subscription.status === 'active' && subscription.packageDetails && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
          <h3 className="font-semibold text-gray-800 mb-3">Current Subscription</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">Plan</p>
              <p className="font-semibold text-gray-800">{subscription.planName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Devices</p>
              <p className="font-semibold text-gray-800">
                Up to {subscription.packageDetails.devices} devices
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Expires on</p>
              <p className="font-semibold text-gray-800">
                {new Date(subscription.endDate).toLocaleDateString()}
              </p>
            </div>
          </div>
          {subscription.packageDetails.features && (
            <div className="mt-4 pt-4 border-t border-green-200">
              <p className="text-sm text-gray-500 mb-2">Features included:</p>
              <div className="flex flex-wrap gap-2">
                {subscription.packageDetails.features.map((feature, idx) => (
                  <span key={idx} className="text-xs bg-white px-2 py-1 rounded-full text-gray-600">
                    ✓ {feature}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Recent Transactions</h2>

          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Package</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {transactions.slice(0, 5).map((transaction) => (
                <tr key={transaction._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-800">
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(transaction.createdAt).toLocaleTimeString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-800">
                      {transaction.packageName || 'N/A'}
                    </div>
                    <div className="text-xs text-gray-500 capitalize">
                      {transaction.paymentMethod}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-medium text-gray-800">
                      ${transaction.amount?.toFixed(2)}
                    </span>
                    {transaction.discountAmount > 0 && (
                      <div className="text-xs text-green-600">
                        Saved ${transaction.discountAmount.toFixed(2)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      transaction.status === 'completed' 
                        ? 'bg-green-100 text-green-700'
                        : transaction.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {transaction.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {transactions.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <CreditCard className="text-gray-400" size={24} />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">No transactions yet</h3>
            <p className="text-gray-500 mb-6">Make your first payment to get started</p>
            <Link
              to="/payment"
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-cyan-500 text-white rounded-lg hover:shadow-lg transition-all"
            >
              <CreditCard className="mr-2" size={18} />
              Subscribe Now
            </Link>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link 
          to="/payment" 
          className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all group flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 rounded-lg group-hover:bg-indigo-100 transition-colors">
              <CreditCard className="text-indigo-600" size={20} />
            </div>
            <div>
              <p className="font-medium text-gray-800">Manage Subscription</p>
              <p className="text-xs text-gray-500">Upgrade or renew plan</p>
            </div>
          </div>
          <TrendingUp size={16} className="text-gray-400" />
        </Link>

        <Link 
          to="/support" 
          className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all group flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
              <Shield className="text-blue-600" size={20} />
            </div>
            <div>
              <p className="font-medium text-gray-800">Support</p>
              <p className="text-xs text-gray-500">Get help 24/7</p>
            </div>
          </div>
          <AlertCircle size={16} className="text-gray-400" />
        </Link>

        <Link 
          to="/devices" 
          className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all group flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors">
              <Eye className="text-green-600" size={20} />
            </div>
            <div>
              <p className="font-medium text-gray-800">Manage Devices</p>
              <p className="text-xs text-gray-500">Add or remove devices</p>
            </div>
          </div>
          <Download size={16} className="text-gray-400" />
        </Link>
      </div> */}
    </div>
  );
};

export default Dashboard;