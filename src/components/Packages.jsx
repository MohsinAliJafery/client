import React, { useState, useEffect } from 'react';
import API from '../utils/api';
import toast from 'react-hot-toast';
import { 
  Package, 
  Edit, 
  Trash2, 
  X, 
  Crown, 
  Trophy, 
  Calendar, 
  Star, 
  Gift, 
  Smartphone, 
  Wifi, 
  MapPin, 
  Video, 
  Headphones,
  CheckCircle,
  Plus
} from 'lucide-react';

// Icon mapping for display
const iconComponents = {
  Crown: <Crown className="w-5 h-5" />,
  Trophy: <Trophy className="w-5 h-5" />,
  Calendar: <Calendar className="w-5 h-5" />,
  Star: <Star className="w-5 h-5" />,
  Gift: <Gift className="w-5 h-5" />,
  Smartphone: <Smartphone className="w-5 h-5" />,
  Wifi: <Wifi className="w-5 h-5" />,
  MapPin: <MapPin className="w-5 h-5" />,
  Video: <Video className="w-5 h-5" />,
  Headphones: <Headphones className="w-5 h-5" />
};

const getIcon = (iconName) => {
  return iconComponents[iconName] || <Crown className="w-5 h-5" />;
};

const Packages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    days: 30,
    devices: 1,
    features: [''],
    icon: 'Crown',
    isActive: true,
    order: 0,
    popular: false
  });

  const token = JSON.parse(localStorage.getItem('user'))?.token;

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const response = await API.get('/api/admin/packages', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setPackages(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching packages:', error);
      toast.error('Failed to fetch packages');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const features = formData.features.filter(f => f.trim() !== '');
      const data = { ...formData, features };
      
      let response;
      if (editingPackage) {
        response = await API.put(`/api/admin/packages/${editingPackage._id}`, data, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        response = await API.post('/api/admin/packages', data, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      
      if (response.data.success) {
        toast.success(editingPackage ? 'Package updated' : 'Package created');
        fetchPackages();
        setShowModal(false);
        resetForm();
      }
    } catch (error) {
      console.error('Error saving package:', error);
      toast.error(error.response?.data?.message || 'Failed to save package');
    }
  };

  const handleDelete = async (pkg) => {
    if (!confirm(`Delete "${pkg.name}"? This cannot be undone.`)) return;
    
    try {
      const response = await API.delete(`/api/admin/packages/${pkg._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        toast.success('Package deleted');
        fetchPackages();
      }
    } catch (error) {
      console.error('Error deleting package:', error);
      toast.error('Failed to delete package');
    }
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const removeFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const updateFeature = (index, value) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.map((f, i) => i === index ? value : f)
    }));
  };

  const resetForm = () => {
    setEditingPackage(null);
    setFormData({
      name: '',
      description: '',
      price: 0,
      days: 30,
      devices: 1,
      features: [''],
      icon: 'Crown',
      isActive: true,
      order: 0,
      popular: false
    });
  };

  const editPackage = (pkg) => {
    setEditingPackage(pkg);
    setFormData({
      name: pkg.name,
      description: pkg.description || '',
      price: pkg.price,
      days: pkg.days,
      devices: pkg.devices || 1,
      features: pkg.features.length ? pkg.features : [''],
      icon: pkg.icon || 'Crown',
      isActive: pkg.isActive,
      order: pkg.order || 0,
      popular: pkg.popular || false
    });
    setShowModal(true);
  };

  const iconOptions = ['Crown', 'Trophy', 'Calendar', 'Star', 'Gift', 'Smartphone', 'Wifi', 'MapPin', 'Video', 'Headphones'];

  if (loading) {
      return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-base font-semibold text-gray-800">Subscription Packages</h3>
          <p className="text-xs text-gray-500">Create and manage custom subscription plans</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700"
        >
          + Add Package
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-100">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Order</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Price</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Days</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Devices</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Features</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {packages.map((pkg) => (
              <tr key={pkg._id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-600">{pkg.order}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {getIcon(pkg.icon)}
                    <span className="font-medium text-gray-800">{pkg.name}</span>
                    {pkg.popular && (
                      <span className="text-xs bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded">Popular</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm font-semibold">${pkg.price}</td>
                <td className="px-4 py-3 text-sm">{pkg.days} days</td>
                <td className="px-4 py-3 text-sm">{pkg.devices}</td>
                <td className="px-4 py-3 text-sm">
                  <div className="max-w-xs">
                    {pkg.features.slice(0, 2).map((f, i) => (
                      <div key={i} className="text-xs text-gray-500 truncate">• {f}</div>
                    ))}
                    {pkg.features.length > 2 && (
                      <div className="text-xs text-gray-400">+{pkg.features.length - 2} more</div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${pkg.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {pkg.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => editPackage(pkg)} className="text-indigo-600 hover:text-indigo-800">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleDelete(pkg)} className="text-red-600 hover:text-red-800">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {packages.length === 0 && (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <Package className="mx-auto h-10 w-10 text-gray-300" />
          <h3 className="mt-2 text-sm font-medium text-gray-600">No packages created</h3>
          <button onClick={() => setShowModal(true)} className="mt-2 text-indigo-600 text-sm">
            Create your first package
          </button>
        </div>
      )}

      {/* Package Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white">
              <h3 className="text-lg font-semibold text-gray-800">
                {editingPackage ? 'Edit Package' : 'Create Package'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Package Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={2}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                    required
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Days *</label>
                  <input
                    type="number"
                    value={formData.days}
                    onChange={(e) => setFormData({...formData, days: parseInt(e.target.value)})}
                    required
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Devices</label>
                  <input
                    type="number"
                    value={formData.devices}
                    onChange={(e) => setFormData({...formData, devices: parseInt(e.target.value)})}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                <select
                  value={formData.icon}
                  onChange={(e) => setFormData({...formData, icon: e.target.value})}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                >
                  {iconOptions.map(icon => (
                    <option key={icon} value={icon}>{icon}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Features</label>
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => updateFeature(index, e.target.value)}
                      placeholder="e.g., 7 days full access"
                      className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="p-2 text-red-500 hover:text-red-700"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addFeature}
                  className="text-indigo-600 text-sm hover:text-indigo-700"
                >
                  + Add Feature
                </button>
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">Active</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.popular}
                    onChange={(e) => setFormData({...formData, popular: e.target.checked})}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">Mark as Popular</span>
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
                >
                  {editingPackage ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50"
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

export default Packages;