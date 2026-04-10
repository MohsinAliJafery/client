import React, { useState, useEffect } from 'react';
import API from '../utils/api';
import toast from 'react-hot-toast';
import { 
  Ticket, 
  Plus, 
  Trash2, 
  Edit2, 
  Copy, 
  Calendar,
  Percent,
  DollarSign,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  Search,
  Filter,
  Download,
  Upload
} from 'lucide-react';

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: 0,
    minimumOrderAmount: 0,
    maxDiscountAmount: 0,
    usageLimit: 1,
    usedCount: 0,
    validFrom: '',
    validTo: '',
    applicablePlans: [],
    status: 'active',
    description: ''
  });

  const plans = [
    { key: 'trial_days', name: 'Free Trial' },
    { key: 'weekly_sub', name: 'Weekly' },
    { key: 'monthly_sub', name: 'Monthly' },
    { key: 'yearly_sub', name: 'Yearly' }
  ];

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const response = await API.get('/api/coupons');
      setCoupons(response.data.data);
    } catch (error) {
      console.error('Error fetching coupons:', error);
      toast.error('Failed to load coupons');
    } finally {
      setLoading(false);
    }
  };

  const generateCouponCode = () => {
    const prefix = 'KZ';
    const randomNum = Math.floor(Math.random() * 10000);
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const randomChars = Array(3).fill().map(() => chars[Math.floor(Math.random() * chars.length)]).join('');
    return `${prefix}${randomChars}${randomNum}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.discountValue <= 0) {
      toast.error('Discount value must be greater than 0');
      return;
    }

    if (formData.discountType === 'percentage' && formData.discountValue > 100) {
      toast.error('Percentage discount cannot exceed 100%');
      return;
    }

    if (new Date(formData.validFrom) >= new Date(formData.validTo)) {
      toast.error('Valid From date must be before Valid To date');
      return;
    }

    try {
      setLoading(true);
      if (editingCoupon) {
        await API.put(`/api/coupons/${editingCoupon._id}`, formData);
        toast.success('Coupon updated successfully');
      } else {
        await API.post('/api/coupons', formData);
        toast.success('Coupon created successfully');
      }
      fetchCoupons();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving coupon:', error);
      toast.error(error.response?.data?.message || 'Failed to save coupon');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      try {
        setLoading(true);
        await API.delete(`/api/coupons/${id}`);
        toast.success('Coupon deleted successfully');
        fetchCoupons();
      } catch (error) {
        console.error('Error deleting coupon:', error);
        toast.error('Failed to delete coupon');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEdit = (coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minimumOrderAmount: coupon.minimumOrderAmount || 0,
      maxDiscountAmount: coupon.maxDiscountAmount || 0,
      usageLimit: coupon.usageLimit,
      usedCount: coupon.usedCount || 0,
      validFrom: coupon.validFrom.split('T')[0],
      validTo: coupon.validTo.split('T')[0],
      applicablePlans: coupon.applicablePlans || [],
      status: coupon.status,
      description: coupon.description || ''
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCoupon(null);
    setFormData({
      code: '',
      discountType: 'percentage',
      discountValue: 0,
      minimumOrderAmount: 0,
      maxDiscountAmount: 0,
      usageLimit: 1,
      usedCount: 0,
      validFrom: '',
      validTo: '',
      applicablePlans: [],
      status: 'active',
      description: ''
    });
  };

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    toast.success('Coupon code copied');
  };

  const togglePlanSelection = (planKey) => {
    if (formData.applicablePlans.includes(planKey)) {
      setFormData({
        ...formData,
        applicablePlans: formData.applicablePlans.filter(p => p !== planKey)
      });
    } else {
      setFormData({
        ...formData,
        applicablePlans: [...formData.applicablePlans, planKey]
      });
    }
  };

  const getStatusBadge = (status, validFrom, validTo) => {
    const now = new Date();
    const start = new Date(validFrom);
    const end = new Date(validTo);
    
    if (status === 'expired' || end < now) {
      return { color: 'bg-red-100 text-red-700', icon: XCircle, text: 'Expired' };
    }
    if (status === 'inactive') {
      return { color: 'bg-gray-100 text-gray-600', icon: XCircle, text: 'Inactive' };
    }
    if (start > now) {
      return { color: 'bg-yellow-100 text-yellow-700', icon: Clock, text: 'Scheduled' };
    }
    return { color: 'bg-green-100 text-green-700', icon: CheckCircle, text: 'Active' };
  };

  const filteredCoupons = coupons.filter(coupon => {
    const matchesSearch = coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (coupon.description && coupon.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === 'all' || coupon.status === filterType;
    return matchesSearch && matchesType;
  });

  const exportCoupons = () => {
    const data = filteredCoupons.map(coupon => ({
      Code: coupon.code,
      'Discount Type': coupon.discountType,
      'Discount Value': coupon.discountValue,
      'Minimum Order': coupon.minimumOrderAmount,
      'Usage Limit': coupon.usageLimit,
      'Used Count': coupon.usedCount,
      'Valid From': coupon.validFrom,
      'Valid To': coupon.validTo,
      Status: coupon.status,
      Description: coupon.description
    }));
    
    const csv = data.map(row => Object.values(row).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `coupons_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Coupons exported');
  };

  return (
    <div className="">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center mb-2">
                <div className="p-2 bg-indigo-100 rounded-lg mr-3">
                  <Ticket className="w-5 h-5 text-indigo-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800">Coupons</h1>
              </div>
              <p className="text-gray-500 text-sm">Create and manage discount coupons</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={exportCoupons}
                className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
              <button
                onClick={() => {
                  setEditingCoupon(null);
                  setFormData({
                    code: generateCouponCode(),
                    discountType: 'percentage',
                    discountValue: 0,
                    minimumOrderAmount: 0,
                    maxDiscountAmount: 0,
                    usageLimit: 1,
                    usedCount: 0,
                    validFrom: '',
                    validTo: '',
                    applicablePlans: [],
                    status: 'active',
                    description: ''
                  });
                  setShowModal(true);
                }}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 text-sm"
              >
                <Plus className="w-4 h-4" />
                Create Coupon
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-100 p-4 mb-6 shadow-sm">
          <div className="flex flex-wrap gap-3">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search coupons..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="expired">Expired</option>
            </select>
            <button
              onClick={fetchCoupons}
              className="px-3 py-2 text-gray-500 hover:text-indigo-600 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Coupons Grid */}
        {loading && !showModal ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCoupons.map((coupon) => {
              const status = getStatusBadge(coupon.status, coupon.validFrom, coupon.validTo);
              const StatusIcon = status.icon;
              const isExpired = new Date(coupon.validTo) < new Date();
              const usagePercent = (coupon.usedCount / coupon.usageLimit) * 100;
              
              return (
                <div key={coupon._id} className="bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden">
                  <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-xl font-mono font-bold text-white tracking-wider">{coupon.code}</div>
                        <div className="text-indigo-100 text-sm mt-1">
                          {coupon.discountType === 'percentage' 
                            ? `${coupon.discountValue}% OFF` 
                            : `$${coupon.discountValue} OFF`}
                        </div>
                      </div>
                      <button
                        onClick={() => copyToClipboard(coupon.code)}
                        className="p-1.5 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                      >
                        <Copy className="w-3.5 h-3.5 text-white" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {status.text}
                      </span>
                      <span className="text-xs text-gray-400">
                        {coupon.usedCount}/{coupon.usageLimit} used
                      </span>
                    </div>
                    
                    {usagePercent > 0 && (
                      <div className="w-full bg-gray-100 rounded-full h-1.5 mb-3">
                        <div 
                          className="bg-indigo-500 h-1.5 rounded-full transition-all"
                          style={{ width: `${Math.min(usagePercent, 100)}%` }}
                        />
                      </div>
                    )}
                    
                    {coupon.description && (
                      <p className="text-xs text-gray-500 mb-3 line-clamp-2">{coupon.description}</p>
                    )}
                    
                    <div className="space-y-1.5 text-xs">
                      {coupon.minimumOrderAmount > 0 && (
                        <div className="flex items-center text-gray-500">
                          <DollarSign className="w-3 h-3 mr-1.5" />
                          Min: ${coupon.minimumOrderAmount}
                        </div>
                      )}
                      {coupon.maxDiscountAmount > 0 && coupon.discountType === 'percentage' && (
                        <div className="flex items-center text-gray-500">
                          <Percent className="w-3 h-3 mr-1.5" />
                          Max: ${coupon.maxDiscountAmount}
                        </div>
                      )}
                      <div className="flex items-center text-gray-500">
                        <Calendar className="w-3 h-3 mr-1.5" />
                        {new Date(coupon.validFrom).toLocaleDateString()} - {new Date(coupon.validTo).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
                      <button
                        onClick={() => handleEdit(coupon)}
                        disabled={isExpired}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1 ${
                          isExpired 
                            ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <Edit2 className="w-3 h-3" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(coupon._id)}
                        className="flex-1 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-xs font-medium flex items-center justify-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        {filteredCoupons.length === 0 && !loading && (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Ticket className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-medium text-gray-600 mb-1">No coupons found</h3>
            <p className="text-sm text-gray-400">Create your first coupon to start offering discounts</p>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">
                {editingCoupon ? 'Edit Coupon' : 'Create Coupon'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Coupon Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                    className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g., SAVE20"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, code: generateCouponCode()})}
                    className="px-3 py-2 bg-gray-100 text-gray-600 text-sm rounded-lg hover:bg-gray-200"
                  >
                    Generate
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-indigo-500"
                  rows="2"
                  placeholder="Brief description (optional)"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount Type
                  </label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({...formData, discountType: e.target.value})}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount ($)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount Value
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step={formData.discountType === 'percentage' ? '1' : '0.01'}
                    value={formData.discountValue}
                    onChange={(e) => setFormData({...formData, discountValue: parseFloat(e.target.value)})}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Min Order Amount
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.minimumOrderAmount}
                    onChange={(e) => setFormData({...formData, minimumOrderAmount: parseFloat(e.target.value)})}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Discount (Optional)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.maxDiscountAmount}
                    onChange={(e) => setFormData({...formData, maxDiscountAmount: parseFloat(e.target.value)})}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-indigo-500"
                  />
                  <p className="text-xs text-gray-400 mt-0.5">For percentage discounts only</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valid From
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.validFrom}
                    onChange={(e) => setFormData({...formData, validFrom: e.target.value})}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valid To
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.validTo}
                    onChange={(e) => setFormData({...formData, validTo: e.target.value})}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Usage Limit
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.usageLimit}
                  onChange={(e) => setFormData({...formData, usageLimit: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Applicable Plans (Leave empty for all)
                </label>
                <div className="flex flex-wrap gap-3">
                  {plans.map(plan => (
                    <label key={plan.key} className="flex items-center gap-1.5 text-sm text-gray-600">
                      <input
                        type="checkbox"
                        checked={formData.applicablePlans.includes(plan.key)}
                        onChange={() => togglePlanSelection(plan.key)}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      {plan.name}
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              
              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium disabled:opacity-50"
                >
                  {loading ? 'Saving...' : (editingCoupon ? 'Update' : 'Create')}
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCoupons;
