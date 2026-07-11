import React, { useState, useEffect } from 'react';
import API from '../utils/api';
import toast from 'react-hot-toast';
import {
  Users,
  CreditCard,
  DollarSign,
  Banknote,
  Search,
  Eye,
  Trash2,
  UserCheck,
  Activity,
  AlertCircle,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [activeTab, setActiveTab] = useState('users');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  
  // Pagination state for users
  const [userPage, setUserPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalUserPages, setTotalUserPages] = useState(1);
  const [isFetchingUsers, setIsFetchingUsers] = useState(false);
  
  // Pagination state for transactions
  const [transactionPage, setTransactionPage] = useState(1);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [totalTransactionPages, setTotalTransactionPages] = useState(1);
  const [isFetchingTransactions, setIsFetchingTransactions] = useState(false);
  const [allTransactions, setAllTransactions] = useState([]);
  
  // Stats state
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeSubscriptions: 0,
    totalRevenue: 0,
    totalTransactions: 0
  });
  
  const [pageSize] = useState(20);

  const token = JSON.parse(localStorage.getItem('user'))?.token;

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchUsers(1),
        fetchAllTransactions()
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async (page = 1) => {
    try {
      setIsFetchingUsers(true);

      const usersRes = await API.get(
        `https://serv2.kidzet.com/admin/users?page=${page}&limit=${pageSize}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const apiUsers = usersRes.data.users || [];
      const total = usersRes.data.total || 0;
      
      setUsers(apiUsers);
      setTotalUsers(total);
      setTotalUserPages(Math.ceil(total / pageSize));
      setUserPage(page);

    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    } finally {
      setIsFetchingUsers(false);
    }
  };

  // Helper function to check if user has a trial plan
  const isTrialPlan = (user) => {
    const planName = (user.plan_name || '').toLowerCase();
    const productId = (user.product_id || '').toLowerCase();
    
    // Check for trial in plan_name or product_id
    return planName.includes('trial') || productId.includes('trial');
  };

  // Helper function to check if user has valid active subscription (excluding trial)
  const hasValidActiveSubscription = (user) => {
    // Check if subscription is active (from API)
    const isActive = user.status === 'active';
    
    // Check if subscription expiry is in the future
    const hasValidExpiry = user.subscription_expiry && 
      Number(user.subscription_expiry) > Date.now();
    
    // Check if it's NOT a trial plan
    const notTrial = !isTrialPlan(user);
    
    // Return true only if active, has valid expiry, and not trial
    return isActive && hasValidExpiry && notTrial;
  };

  // Fetch all users to get all transactions and calculate stats
  const fetchAllTransactions = async () => {
    try {
      setIsFetchingTransactions(true);
      
      let allUsers = [];
      let page = 1;
      let hasMore = true;
      
      // Fetch all pages of users
      while (hasMore) {
        const response = await API.get(
          `https://serv2.kidzet.com/admin/users?page=${page}&limit=100`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        
        const users = response.data.users || [];
        allUsers = [...allUsers, ...users];
        
        // Check if we've fetched all users
        const total = response.data.total || 0;
        if (allUsers.length >= total) {
          hasMore = false;
        } else {
          page++;
        }
      }
      
      // Calculate accurate stats
      const now = Date.now();
      
      // Active subscriptions: users with active status, valid expiry, and NOT trial
      const activeSubs = allUsers.filter(user => 
        hasValidActiveSubscription(user)
      ).length;
      
      // Total revenue: sum of all last_payment_amount (only positive amounts, exclude trial)
      const totalRev = allUsers.reduce((sum, user) => {
        const amount = Number(user.last_payment_amount || 0);
        // Only include if not trial and amount is positive
        if (!isTrialPlan(user) && amount > 0) {
          return sum + amount;
        }
        return sum;
      }, 0);
      
      // Total transactions: users with payment amount > 0 and not trial
      const txCount = allUsers.filter(user => 
        Number(user.last_payment_amount || 0) > 0 && !isTrialPlan(user)
      ).length;
      
      // Update stats
      setStats({
        totalUsers: allUsers.length,
        activeSubscriptions: activeSubs,
        totalRevenue: totalRev,
        totalTransactions: txCount
      });
      
      // Process all transactions from all users (only those with payment, exclude trial)
      const txFromUsers = allUsers
        .filter(user => 
          Number(user.last_payment_amount || 0) > 0 && !isTrialPlan(user)
        )
        .map(user => ({
          id: user.uid,
          uid: user.uid,
          name: user.name,
          email: user.email,
          amount: Number(user.last_payment_amount || 0),
          currency: user.last_payment_currency || 'USD',
          platform: user.last_payment_platform || 'N/A',
          plan: user.plan_name || user.product_id || 'No Plan',
          // Check if subscription is active based on expiry and NOT trial
          status: user.status === 'active' && 
                  user.subscription_expiry && 
                  Number(user.subscription_expiry) > Date.now() &&
                  !isTrialPlan(user)
            ? 'active'
            : 'expired',
          date: user.created_at
        }));
      
      setAllTransactions(txFromUsers);
      setTotalTransactions(txCount);
      setTotalTransactionPages(Math.ceil(txCount / pageSize));
      
      // Set initial page of transactions
      updateTransactionPage(txFromUsers, 1);
      
    } catch (error) {
      console.error('Error fetching all transactions:', error);
      toast.error('Failed to fetch transactions');
    } finally {
      setIsFetchingTransactions(false);
    }
  };

  // Update transaction page based on current page
  const updateTransactionPage = (transactionsData, page) => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedTransactions = transactionsData.slice(start, end);
    setTransactions(paginatedTransactions);
    setTransactionPage(page);
  };

  const handleUserPageChange = (page) => {
    if (page < 1 || page > totalUserPages || page === userPage) return;
    fetchUsers(page);
    document.querySelector('.table-container')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleTransactionPageChange = (page) => {
    if (page < 1 || page > totalTransactionPages || page === transactionPage) return;
    updateTransactionPage(allTransactions, page);
    document.querySelector('.table-container')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDeleteUser = async (uid) => {
    try {
      const response = await API.delete(
        `https://serv2.kidzet.com/admin/users/${uid}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        toast.success('User deleted successfully');
        // Refresh all data after deletion
        await Promise.all([
          fetchUsers(userPage),
          fetchAllTransactions()
        ]);
        setDeleteConfirm(null);
      } else {
        toast.error('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error(error.response?.data?.message || 'Failed to delete user');
    }
  };

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.uid?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.plan_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTransactions = transactions.filter(tx =>
    tx.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.platform?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.plan?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={<Users size={22} />}
          color="indigo"
        />

        <StatCard
          title="Active Subscriptions"
          value={stats.activeSubscriptions}
          icon={<UserCheck size={22} />}
          color="green"
        />

        <StatCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          icon={<DollarSign size={22} />}
          color="purple"
        />

        <StatCard
          title="Transactions"
          value={stats.totalTransactions}
          icon={<Activity size={22} />}
          color="orange"
        />
      </div>

      <div className="bg-white rounded-lg border border-gray-100 shadow-sm">
        <div className="flex flex-wrap border-b border-gray-100">
          {[
            { id: 'users', label: 'Users', icon: <Users size={16} /> },
            { id: 'transactions', label: 'Transactions', icon: <Banknote size={16} /> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setSearchTerm('');
              }}
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
              currentPage={userPage}
              totalPages={totalUserPages}
              totalUsers={totalUsers}
              pageSize={pageSize}
              onPageChange={handleUserPageChange}
              isFetching={isFetchingUsers}
            />
          )}

          {activeTab === 'transactions' && (
            <TransactionsTable
              transactions={filteredTransactions}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              currentPage={transactionPage}
              totalPages={totalTransactionPages}
              totalTransactions={totalTransactions}
              pageSize={pageSize}
              onPageChange={handleTransactionPageChange}
              isFetching={isFetchingTransactions}
            />
          )}
        </div>
      </div>

      {showUserModal && selectedUser && (
        <UserDetailModal
          user={selectedUser}
          onClose={() => {
            setShowUserModal(false);
            setSelectedUser(null);
          }}
        />
      )}

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

const StatCard = ({ title, value, icon, color }) => {
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
      </div>
      <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
      <p className="text-sm text-gray-500 mt-1">{title}</p>
    </div>
  );
};

// Pagination Component
const Pagination = ({ 
  currentPage, 
  totalPages, 
  totalItems, 
  pageSize, 
  onPageChange, 
  isFetching,
  itemName = 'items'
}) => {
  if (totalPages <= 1 && totalItems <= pageSize) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);
      
      if (currentPage <= 3) {
        end = 4;
      } else if (currentPage >= totalPages - 2) {
        start = totalPages - 3;
      }
      
      if (start > 2) pages.push('...');
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (end < totalPages - 1) pages.push('...');
      pages.push(totalPages);
    }
    
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-200">
      <div className="text-sm text-gray-500">
        Showing {startItem} - {endItem} of {totalItems} {itemName}
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || isFetching}
          className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={18} />
        </button>
        
        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, index) => (
            <React.Fragment key={index}>
              {page === '...' ? (
                <span className="px-2 text-gray-400">...</span>
              ) : (
                <button
                  onClick={() => onPageChange(page)}
                  disabled={isFetching}
                  className={`min-w-[36px] h-9 px-3 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === page
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || isFetching}
          className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

const UsersTable = ({ 
  users, 
  searchTerm, 
  setSearchTerm, 
  onUserClick, 
  onDeleteUser,
  currentPage,
  totalPages,
  totalUsers,
  pageSize,
  onPageChange,
  isFetching
}) => {
  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(Number(timestamp)).toLocaleDateString();
  };

  const getPlan = (user) => {
    return user.plan_name || user.product_id || 'No Plan';
  };

  const isTrialPlan = (user) => {
    const planName = (user.plan_name || '').toLowerCase();
    const productId = (user.product_id || '').toLowerCase();
    return planName.includes('trial') || productId.includes('trial');
  };

  const getSubscriptionStatus = (user) => {
    // If status is not 'active' from API, show as inactive
    if (user.status !== 'active') {
      return 'inactive';
    }
    
    // Check if it's a trial plan
    if (isTrialPlan(user)) {
      return 'trial';
    }
    
    // Check if subscription expiry is valid
    if (!user.subscription_expiry) {
      return 'inactive';
    }
    
    const expiry = Number(user.subscription_expiry);
    const now = Date.now();
    
    // Check if expiry is in the future
    if (expiry > now) {
      return 'active';
    } else {
      return 'expired';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'expired':
        return 'bg-red-100 text-red-700';
      case 'trial':
        return 'bg-yellow-100 text-yellow-700';
      case 'inactive':
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h3 className="text-base font-semibold text-gray-800">All Users</h3>
          <p className="text-xs text-gray-500">
            Page {currentPage} of {totalPages} • {totalUsers} total users
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      <div className="table-container overflow-x-auto rounded-lg border border-gray-100 relative">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">UID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plan</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Platform</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expiry</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-100">
            {users.map(user => {
              const status = getSubscriptionStatus(user);

              return (
                <tr key={user.uid} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold text-sm">
                        {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-gray-800">
                        {user.name || 'No Name'}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-3 whitespace-nowrap text-xs font-mono text-gray-500">
                    {user.uid?.substring(0, 12)}...
                  </td>

                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                    {user.email}
                  </td>

                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                    {getPlan(user)}
                  </td>

                  <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-gray-800">
                    {user.last_payment_amount || 0} {user.last_payment_currency || 'USD'}
                  </td>

                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full capitalize">
                      {user.last_payment_platform || 'Web Portal'}
                    </span>
                  </td>

                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(user.subscription_expiry)}
                  </td>

                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getStatusColor(status)}`}>
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
        
        {isFetching && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600" />
          </div>
        )}
      </div>

      {users.length === 0 && !isFetching && (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <Users className="mx-auto h-10 w-10 text-gray-300" />
          <h3 className="mt-2 text-sm font-medium text-gray-600">No users found</h3>
        </div>
      )}

      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalUsers}
        pageSize={pageSize}
        onPageChange={onPageChange}
        isFetching={isFetching}
        itemName="users"
      />
    </div>
  );
};

const TransactionsTable = ({ 
  transactions, 
  searchTerm, 
  setSearchTerm,
  currentPage,
  totalPages,
  totalTransactions,
  pageSize,
  onPageChange,
  isFetching
}) => {
  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(Number(timestamp)).toLocaleDateString();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h3 className="text-base font-semibold text-gray-800">All Transactions</h3>
          <p className="text-xs text-gray-500">
            Page {currentPage} of {totalPages} • {totalTransactions} total transactions
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-100 relative">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">UID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Platform</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plan</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-100">
            {transactions.map(tx => (
              <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-800">
                      {tx.name || 'No Name'}
                    </div>
                    <div className="text-xs text-gray-400">
                      {tx.email}
                    </div>
                  </div>
                </td>

                <td className="px-4 py-3 whitespace-nowrap text-xs font-mono text-gray-500">
                  {tx.uid?.substring(0, 12)}...
                </td>

                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="font-semibold text-gray-800">
                    {tx.amount} {tx.currency}
                  </span>
                </td>

                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full capitalize">
                    {tx.platform}
                  </span>
                </td>

                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                  {tx.plan}
                </td>

                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    tx.status === 'active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {tx.status}
                  </span>
                </td>

                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(tx.date)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {isFetching && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600" />
          </div>
        )}
      </div>

      {transactions.length === 0 && !isFetching && (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <CreditCard className="mx-auto h-10 w-10 text-gray-300" />
          <h3 className="mt-2 text-sm font-medium text-gray-600">No transactions found</h3>
        </div>
      )}

      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalTransactions}
        pageSize={pageSize}
        onPageChange={onPageChange}
        isFetching={isFetching}
        itemName="transactions"
      />
    </div>
  );
};

const UserDetailModal = ({ user, onClose }) => {
  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(Number(timestamp)).toLocaleDateString();
  };

  const isTrialPlan = (user) => {
    const planName = (user.plan_name || '').toLowerCase();
    const productId = (user.product_id || '').toLowerCase();
    return planName.includes('trial') || productId.includes('trial');
  };

  const getSubscriptionStatus = (user) => {
    if (user.status !== 'active') {
      return 'inactive';
    }
    
    if (isTrialPlan(user)) {
      return 'trial';
    }
    
    if (!user.subscription_expiry) {
      return 'inactive';
    }
    
    const expiry = Number(user.subscription_expiry);
    const now = Date.now();
    
    if (expiry > now) {
      return 'active';
    } else {
      return 'expired';
    }
  };

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
              <h4 className="text-lg font-semibold text-gray-800">
                {user.name || 'No Name'}
              </h4>
              <p className="text-sm text-gray-500">{user.email}</p>
              <p className="text-xs font-mono text-gray-400 mt-1">{user.uid}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <InfoBox label="Role" value={user.role || 'user'} />
            <InfoBox label="Status" value={getSubscriptionStatus(user)} />
            <InfoBox label="Plan" value={user.plan_name || 'No Plan'} />
            <InfoBox label="Device Limit" value={user.device_limit || 1} />
            <InfoBox label="Product ID" value={user.product_id || 'N/A'} />
            <InfoBox label="Platform" value={user.last_payment_platform || 'N/A'} />
            <InfoBox
              label="Last Payment"
              value={`${user.last_payment_amount || 0} ${user.last_payment_currency || 'USD'}`}
            />
            <InfoBox label="Expiry" value={formatDate(user.subscription_expiry)} />
            <InfoBox label="Created At" value={formatDate(user.created_at)} />
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoBox = ({ label, value }) => (
  <div className="bg-gray-50 p-3 rounded-lg">
    <p className="text-xs text-gray-500">{label}</p>
    <p className="text-sm font-medium text-gray-800 capitalize">{value}</p>
  </div>
);

const DeleteConfirmModal = ({ user, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-sm w-full p-5">
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle className="text-red-600" size={24} />
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-800 text-center mb-2">
          Delete User
        </h3>

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