import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import API from '../utils/api';
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
  Shield
} from 'lucide-react';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
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
      fetchTransactions(parsedUser.token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchTransactions = async (token) => {
    try {
      const response = await API.get('/api/payments/transactions', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTransactions(response.data.data);
      calculateStats(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch transactions');
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
        <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.name?.split(' ')[0] || 'Parent'}!</h1>
        <p className="text-white/80">Monitor your family's safety and manage your account from here.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Spent</p>
              <p className="text-2xl font-bold mt-1 text-gray-800">${stats.totalSpent.toFixed(2)}</p>
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
              <p className="text-2xl font-bold mt-1 text-gray-800">${stats.averageAmount.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <TrendingUp className="text-blue-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/live-camera" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all group">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-indigo-50 rounded-lg group-hover:bg-indigo-100 transition-colors">
              <Video className="text-indigo-600" size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Live Camera</h3>
              <p className="text-sm text-gray-500">View real-time camera feed</p>
            </div>
          </div>
        </Link>

        <Link to="/location" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all group">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-indigo-50 rounded-lg group-hover:bg-indigo-100 transition-colors">
              <MapPin className="text-indigo-600" size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Live Location</h3>
              <p className="text-sm text-gray-500">Track family members</p>
            </div>
          </div>
        </Link>

        <Link to="/payment" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all group">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-indigo-50 rounded-lg group-hover:bg-indigo-100 transition-colors">
              <CreditCard className="text-indigo-600" size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Manage Subscription</h3>
              <p className="text-sm text-gray-500">Upgrade or renew plan</p>
            </div>
          </div>
        </Link>
      </div> */}

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Recent Transactions</h2>
            <Link to="/payment" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
              View All
            </Link>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
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
                    <div className="text-sm font-medium text-gray-800">{transaction.subscriptionType}</div>
                    <div className="text-xs text-gray-500 capitalize">{transaction.paymentMethod}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-medium text-gray-800">${transaction.amount}</span>
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
              Make Payment
            </Link>
          </div>
        )}
      </div>

      {/* Protected Devices */}
      {/* <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Protected Devices</h2>
          <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">Add Device</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Shield className="text-indigo-600" size={18} />
            </div>
            <div>
              <p className="font-medium text-gray-800">Emma's iPhone</p>
              <p className="text-xs text-gray-500">Last active: 2 min ago</p>
            </div>
            <Eye size={16} className="text-gray-400 ml-auto" />
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Shield className="text-indigo-600" size={18} />
            </div>
            <div>
              <p className="font-medium text-gray-800">Noah's Samsung</p>
              <p className="text-xs text-gray-500">Last active: 15 min ago</p>
            </div>
            <Eye size={16} className="text-gray-400 ml-auto" />
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default Dashboard;