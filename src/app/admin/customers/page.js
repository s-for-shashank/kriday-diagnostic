'use client';

import { useState, useEffect } from 'react';
import { 
  Users, User, Search, Filter, Eye, Edit, Trash2, Phone, Mail, 
  Calendar, MapPin, Activity, Star, Plus, Download, Upload, 
  TrendingUp, Clock, CheckCircle, X, Loader2, Save
} from 'lucide-react';
import StatCard from '../components/StatCard';
import Modal, { ConfirmModal } from '../components/Modal';
import { customersApi, withErrorHandling } from '@/lib/api';

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGender, setFilterGender] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [actionType, setActionType] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0
  });

  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    gender: '',
    address: '',
    emergencyContact: '',
    medicalHistory: '',
    notes: ''
  });

  // Load initial data
  useEffect(() => {
    loadCustomers();
  }, [pagination.page]);

  // Load customers from API
  const loadCustomers = async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const queryParams = {
        ...filters,
        page: pagination.page,
        limit: pagination.limit,
        status: filterStatus !== 'all' ? filterStatus : undefined,
        gender: filterGender !== 'all' ? filterGender : undefined,
        search: searchTerm || undefined
      };
      
      // Remove undefined values
      Object.keys(queryParams).forEach(key => {
        if (queryParams[key] === undefined) {
          delete queryParams[key];
        }
      });
      
      const result = await withErrorHandling(customersApi.getAll)(queryParams);
      
      if (result.success) {
        setCustomers(Array.isArray(result.data.data) ? result.data.data : result.data || []);
        if (result.data.pagination) {
          setPagination(result.data.pagination);
        }
      } else {
        setError(result.error || 'Failed to load customers');
        console.error('Failed to load customers:', result.error);
        setCustomers([]);
      }
    } catch (err) {
      setError('Failed to load customers');
      console.error('Error loading customers:', err);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  // Safe array check function
  const safeArray = (arr) => Array.isArray(arr) ? arr : [];

  // Filter customers locally for instant results
  const filteredCustomers = safeArray(customers).filter(customer => {
    if (!customer) return false;
    
    const matchesSearch = (customer.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (customer.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (customer.phone || '').includes(searchTerm);
    
    const matchesGender = filterGender === 'all' || customer.gender?.toLowerCase() === filterGender;
    const matchesStatus = filterStatus === 'all' || customer.status === filterStatus;
    
    return matchesSearch && matchesGender && matchesStatus;
  });

  // Stats calculation
  const stats = [
    {
      title: "Total Customers",
      value: (pagination.total || safeArray(customers).length).toString(),
      change: "+23",
      trend: "up",
      icon: Users,
      color: "from-blue-500 to-indigo-600",
      description: "Registered customers"
    },
    {
      title: "Active Customers",
      value: safeArray(customers).filter(c => c?.status === 'active').length.toString(),
      change: "+12",
      trend: "up",
      icon: Activity,
      color: "from-green-500 to-emerald-600",
      description: "Active this month"
    },
    {
      title: "VIP Customers",
      value: safeArray(customers).filter(c => c?.status === 'vip').length.toString(),
      change: "+2",
      trend: "up",
      icon: Star,
      color: "from-purple-500 to-pink-600",
      description: "Premium members"
    },
    {
      title: "Avg. Rating",
      value: safeArray(customers).length > 0 ? 
        (safeArray(customers).reduce((sum, c) => sum + (c?.rating || 0), 0) / safeArray(customers).length).toFixed(1) : 
        "0.0",
      change: "+0.2",
      trend: "up",
      icon: TrendingUp,
      color: "from-orange-500 to-red-600",
      description: "Customer satisfaction"
    }
  ];

  // Delete customer
  const deleteCustomer = async (id) => {
    try {
      setSubmitting(true);
      const result = await withErrorHandling(customersApi.delete)(id);
      
      if (result.success) {
        setCustomers(prevCustomers => 
          safeArray(prevCustomers).filter(customer => 
            customer?._id !== id && customer?.id !== id
          )
        );
      } else {
        setError(result.error || 'Failed to delete customer');
      }
    } catch (err) {
      setError('Failed to delete customer');
      console.error('Error deleting customer:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // Add new customer
  const addNewCustomer = async () => {
    if (!newCustomer.name || !newCustomer.email || !newCustomer.phone) {
      setError('Please fill in all required fields (Name, Email, Phone)');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      
      const customerData = {
        ...newCustomer,
        age: newCustomer.age ? parseInt(newCustomer.age) : undefined,
        medicalHistory: newCustomer.medicalHistory ? 
          newCustomer.medicalHistory.split(',').map(h => h.trim()).filter(h => h) : []
      };
      
      const result = await withErrorHandling(customersApi.create)(customerData);
      
      if (result.success) {
        // Reload customers to get the new customer with proper ID
        await loadCustomers();
        
        // Reset form
        setNewCustomer({
          name: '',
          email: '',
          phone: '',
          age: '',
          gender: '',
          address: '',
          emergencyContact: '',
          medicalHistory: '',
          notes: ''
        });
        setShowAddModal(false);
      } else {
        setError(result.error || 'Failed to create customer');
      }
    } catch (err) {
      setError('Failed to create customer');
      console.error('Error creating customer:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // Update customer
  const updateCustomer = async () => {
    if (!editingCustomer || !editingCustomer.name || !editingCustomer.email || !editingCustomer.phone) {
      setError('Please fill in all required fields (Name, Email, Phone)');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      
      const customerData = {
        ...editingCustomer,
        age: editingCustomer.age ? parseInt(editingCustomer.age) : undefined,
        medicalHistory: typeof editingCustomer.medicalHistory === 'string' ?
          editingCustomer.medicalHistory.split(',').map(h => h.trim()).filter(h => h) :
          editingCustomer.medicalHistory
      };
      
      const customerId = editingCustomer._id || editingCustomer.id;
      const result = await withErrorHandling(customersApi.update)(customerId, customerData);
      
      if (result.success) {
        // Update local state
        setCustomers(prevCustomers => 
          safeArray(prevCustomers).map(customer => 
            (customer?._id === customerId || customer?.id === customerId)
              ? { ...customer, ...customerData, updatedAt: new Date().toISOString() }
              : customer
          )
        );
        setShowEditModal(false);
        setEditingCustomer(null);
      } else {
        setError(result.error || 'Failed to update customer');
      }
    } catch (err) {
      setError('Failed to update customer');
      console.error('Error updating customer:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // Update customer status
  const updateCustomerStatus = async (id, newStatus) => {
    try {
      setSubmitting(true);
      setError(null);
      
      const result = await withErrorHandling(customersApi.updateStatus)(id, newStatus);
      
      if (result.success) {
        // Update local state
        setCustomers(prevCustomers => 
          safeArray(prevCustomers).map(customer => 
            (customer?._id === id || customer?.id === id)
              ? { ...customer, status: newStatus, updatedAt: new Date().toISOString() }
              : customer
          )
        );
      } else {
        setError(result.error || 'Failed to update customer status');
      }
    } catch (err) {
      setError('Failed to update customer status');
      console.error('Error updating customer status:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle actions
  const handleAction = (customer, action) => {
    const customerId = customer._id || customer.id;
    setSelectedCustomer(customer);
    setActionType(action);
    
    if (action === 'delete') {
      setShowConfirmModal(true);
    } else if (action === 'view') {
      setShowModal(true);
    } else if (action === 'edit') {
      setEditingCustomer({
        ...customer,
        id: customerId,
        _id: customerId,
        medicalHistory: Array.isArray(customer.medicalHistory) ? 
          customer.medicalHistory.join(', ') : 
          (customer.medicalHistory || '')
      });
      setShowEditModal(true);
    } else if (action.startsWith('status-')) {
      const newStatus = action.replace('status-', '');
      updateCustomerStatus(customerId, newStatus);
    }
  };

  // Confirm action
  const confirmAction = async () => {
    if (actionType === 'delete' && selectedCustomer) {
      const customerId = selectedCustomer._id || selectedCustomer.id;
      await deleteCustomer(customerId);
    }
    setShowConfirmModal(false);
    setSelectedCustomer(null);
    setActionType('');
  };

  // Utility functions
  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'inactive': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'vip': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getRatingStars = (rating) => {
    const rate = rating || 0;
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < Math.floor(rate) ? 'text-yellow-400 fill-current' : 'text-gray-400'}`} />
    ));
  };

  const exportCustomers = async () => {
    try {
      const dataStr = JSON.stringify(safeArray(customers), null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      const exportFileDefaultName = 'kriday-customers.json';
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    } catch (err) {
      console.error('Export failed:', err);
      setError('Failed to export customers');
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-white/60">Loading customers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Display */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400" />
          <span className="text-red-400">{error}</span>
          <button 
            onClick={() => setError(null)}
            className="ml-auto text-red-400 hover:text-red-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Customer Management</h2>
          <p className="text-white/60">Manage customer database and relationships</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => alert('Import functionality - connect to file upload')}
            className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl transition-all duration-300 flex items-center gap-2 border border-white/20 hover:border-white/30"
            disabled={submitting}
          >
            <Upload className="w-4 h-4" />
            Import
          </button>
          <button 
            onClick={exportCustomers}
            className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl transition-all duration-300 flex items-center gap-2 border border-white/20 hover:border-white/30"
            disabled={submitting}
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl"
            disabled={submitting}
          >
            <Plus className="w-4 h-4" />
            Add Customer
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            {...stat}
            delay={index * 0.1}
          />
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white/5 backdrop-blur-2xl rounded-2xl p-6 border border-white/10">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm transition-all duration-300"
            />
          </div>
          <div className="flex gap-4">
            <select
              value={filterGender}
              onChange={(e) => {
                setFilterGender(e.target.value);
                loadCustomers({ gender: e.target.value !== 'all' ? e.target.value : undefined });
              }}
              className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm min-w-[150px]"
            >
              <option value="all" className="bg-gray-800">All Genders</option>
              <option value="male" className="bg-gray-800">Male</option>
              <option value="female" className="bg-gray-800">Female</option>
              <option value="other" className="bg-gray-800">Other</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                loadCustomers({ status: e.target.value !== 'all' ? e.target.value : undefined });
              }}
              className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm min-w-[150px]"
            >
              <option value="all" className="bg-gray-800">All Status</option>
              <option value="active" className="bg-gray-800">Active</option>
              <option value="inactive" className="bg-gray-800">Inactive</option>
              <option value="vip" className="bg-gray-800">VIP</option>
            </select>
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white/5 backdrop-blur-2xl rounded-2xl border border-white/10 overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <h3 className="text-lg font-bold text-white">All Customers ({filteredCustomers.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-4 text-left text-white font-medium">Customer</th>
                <th className="px-6 py-4 text-left text-white font-medium">Contact</th>
                <th className="px-6 py-4 text-left text-white font-medium">Demographics</th>
                <th className="px-6 py-4 text-left text-white font-medium">Activity</th>
                <th className="px-6 py-4 text-left text-white font-medium">Status</th>
                <th className="px-6 py-4 text-left text-white font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer, index) => {
                if (!customer) return null;
                
                const customerId = customer._id || customer.id;
                
                return (
                  <tr key={customerId} className="border-t border-white/10 hover:bg-white/5 transition-all duration-300 animate-fade-in group" style={{ animationDelay: `${index * 0.05}s` }}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                          {(customer.name || 'U').split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <div className="text-white font-medium group-hover:text-blue-400 transition-colors duration-300">
                            {customer.name || 'Unknown'}
                          </div>
                          <div className="text-white/60 text-sm">{customer.email || 'No email'}</div>
                          <div className="flex items-center gap-1 mt-1">
                            {getRatingStars(customer.rating)}
                            <span className="text-white/60 text-xs ml-1">({(customer.rating || 0).toFixed(1)})</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-white/70 text-sm">
                          <Phone className="w-4 h-4 text-blue-400" />
                          {customer.phone || 'No phone'}
                        </div>
                        <div className="flex items-center gap-2 text-white/70 text-sm">
                          <Mail className="w-4 h-4 text-blue-400" />
                          {(customer.email || 'No email').slice(0, 20)}...
                        </div>
                        <div className="flex items-center gap-2 text-white/70 text-sm">
                          <MapPin className="w-4 h-4 text-blue-400" />
                          {customer.address ? customer.address.split(',')[0] : 'No address'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-white font-medium">{customer.age || 'N/A'} years</div>
                      <div className="text-white/60 text-sm">{customer.gender || 'Not specified'}</div>
                      <div className="text-white/60 text-sm flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Joined {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : 'Unknown'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-white font-bold">{customer.totalBookings || 0} bookings</div>
                      <div className="text-green-400 font-medium">₹{(customer.totalSpent || 0).toLocaleString()}</div>
                      <div className="text-white/60 text-sm flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {customer.lastVisit ? `Last: ${new Date(customer.lastVisit).toLocaleDateString()}` : 'Never visited'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={customer.status || 'active'}
                        onChange={(e) => updateCustomerStatus(customerId, e.target.value)}
                        className={`px-3 py-2 rounded-lg text-xs font-medium border cursor-pointer transition-all duration-300 ${getStatusColor(customer.status)}`}
                        disabled={submitting}
                      >
                        <option value="active" className="bg-gray-800">Active</option>
                        <option value="inactive" className="bg-gray-800">Inactive</option>
                        <option value="vip" className="bg-gray-800">VIP</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleAction(customer, 'view')}
                          className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-all duration-300 hover:scale-110"
                          title="View Details"
                          disabled={submitting}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleAction(customer, 'edit')}
                          className="p-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-all duration-300 hover:scale-110"
                          title="Edit Customer"
                          disabled={submitting}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleAction(customer, 'delete')}
                          className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all duration-300 hover:scale-110"
                          title="Delete Customer"
                          disabled={submitting}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredCustomers.length === 0 && !loading && (
        <div className="bg-white/5 backdrop-blur-2xl rounded-2xl p-12 border border-white/10 text-center">
          <Users className="w-16 h-16 text-white/50 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No Customers Found</h3>
          <p className="text-white/60">No customers match your current filters.</p>
        </div>
      )}

      {/* Customer Details Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Customer Details"
        size="lg"
      >
        {selectedCustomer && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-white/60 text-sm mb-1">Full Name</div>
                  <div className="text-white font-medium text-lg">{selectedCustomer.name || 'N/A'}</div>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-white/60 text-sm mb-1">Contact Information</div>
                  <div className="text-white font-medium">{selectedCustomer.phone || 'N/A'}</div>
                  <div className="text-white/80 text-sm">{selectedCustomer.email || 'N/A'}</div>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-white/60 text-sm mb-1">Demographics</div>
                  <div className="text-white font-medium">
                    {selectedCustomer.age || 'N/A'} years, {selectedCustomer.gender || 'Not specified'}
                  </div>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-white/60 text-sm mb-1">Emergency Contact</div>
                  <div className="text-white font-medium">{selectedCustomer.emergencyContact || 'N/A'}</div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-white/60 text-sm mb-1">Customer Status</div>
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedCustomer.status)}`}>
                    {(selectedCustomer.status || 'active').charAt(0).toUpperCase() + (selectedCustomer.status || 'active').slice(1)}
                  </div>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-white/60 text-sm mb-1">Activity Stats</div>
                  <div className="text-white font-bold text-lg">{selectedCustomer.totalBookings || 0} Bookings</div>
                  <div className="text-green-400 font-medium">₹{(selectedCustomer.totalSpent || 0).toLocaleString()} Spent</div>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-white/60 text-sm mb-1">Customer Rating</div>
                  <div className="flex items-center gap-2">
                    {getRatingStars(selectedCustomer.rating)}
                    <span className="text-white font-medium ml-2">{(selectedCustomer.rating || 0).toFixed(1)}/5</span>
                  </div>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-white/60 text-sm mb-1">Member Since</div>
                  <div className="text-white font-medium">
                    {selectedCustomer.createdAt ? new Date(selectedCustomer.createdAt).toLocaleDateString() : 'Unknown'}
                  </div>
                  {selectedCustomer.lastVisit && (
                    <div className="text-white/60 text-sm mt-1">
                      Last visit: {new Date(selectedCustomer.lastVisit).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="text-white/60 text-sm mb-2">Address</div>
              <div className="text-white">{selectedCustomer.address || 'No address provided'}</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="text-white/60 text-sm mb-2">Favorite Tests</div>
                <div className="space-y-1">
                  {safeArray(selectedCustomer.favoriteTests).length > 0 ? (
                    safeArray(selectedCustomer.favoriteTests).map((test, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-400" />
                        <span className="text-white text-sm">{test}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-white/60 text-sm">No favorite tests yet</div>
                  )}
                </div>
              </div>
              
              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="text-white/60 text-sm mb-2">Medical History</div>
                <div className="space-y-1">
                  {safeArray(selectedCustomer.medicalHistory).length > 0 ? (
                    safeArray(selectedCustomer.medicalHistory).map((condition, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-red-400" />
                        <span className="text-white text-sm">{condition}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-white/60 text-sm">No medical history recorded</div>
                  )}
                </div>
              </div>
            </div>

            {selectedCustomer.notes && (
              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="text-white/60 text-sm mb-2">Notes</div>
                <div className="text-white">{selectedCustomer.notes}</div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-medium transition-all duration-300 border border-white/20"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  handleAction(selectedCustomer, 'edit');
                }}
                className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-xl font-medium hover:from-blue-600 hover:to-indigo-700 transition-all duration-300"
              >
                Edit Customer
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Add Customer Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Customer"
        size="lg"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white font-medium mb-2">Full Name *</label>
              <input
                type="text"
                value={newCustomer.name}
                onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
                placeholder="Enter full name"
                required
              />
            </div>
            
            <div>
              <label className="block text-white font-medium mb-2">Email *</label>
              <input
                type="email"
                value={newCustomer.email}
                onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
                placeholder="email@example.com"
                required
              />
            </div>
            
            <div>
              <label className="block text-white font-medium mb-2">Phone *</label>
              <input
                type="tel"
                value={newCustomer.phone}
                onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
                placeholder="+91 XXXXX XXXXX"
                required
              />
            </div>
            
            <div>
              <label className="block text-white font-medium mb-2">Age</label>
              <input
                type="number"
                value={newCustomer.age}
                onChange={(e) => setNewCustomer({...newCustomer, age: e.target.value})}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
                placeholder="35"
                min="1"
                max="120"
              />
            </div>
            
            <div>
              <label className="block text-white font-medium mb-2">Gender</label>
              <select
                value={newCustomer.gender}
                onChange={(e) => setNewCustomer({...newCustomer, gender: e.target.value})}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
              >
                <option value="" className="bg-gray-800">Select gender</option>
                <option value="Male" className="bg-gray-800">Male</option>
                <option value="Female" className="bg-gray-800">Female</option>
                <option value="Other" className="bg-gray-800">Other</option>
              </select>
            </div>
            
            <div>
              <label className="block text-white font-medium mb-2">Emergency Contact</label>
              <input
                type="tel"
                value={newCustomer.emergencyContact}
                onChange={(e) => setNewCustomer({...newCustomer, emergencyContact: e.target.value})}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
                placeholder="+91 XXXXX XXXXX"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-white font-medium mb-2">Address</label>
            <textarea
              value={newCustomer.address}
              onChange={(e) => setNewCustomer({...newCustomer, address: e.target.value})}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm resize-none"
              rows="3"
              placeholder="Enter complete address"
            />
          </div>
          
          <div>
            <label className="block text-white font-medium mb-2">Medical History (comma separated)</label>
            <input
              type="text"
              value={newCustomer.medicalHistory}
              onChange={(e) => setNewCustomer({...newCustomer, medicalHistory: e.target.value})}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
              placeholder="Diabetes, Hypertension, None"
            />
          </div>
          
          <div>
            <label className="block text-white font-medium mb-2">Notes</label>
            <textarea
              value={newCustomer.notes}
              onChange={(e) => setNewCustomer({...newCustomer, notes: e.target.value})}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm resize-none"
              rows="3"
              placeholder="Any additional notes about the customer"
            />
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => setShowAddModal(false)}
              className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-medium transition-all duration-300 border border-white/20"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              onClick={addNewCustomer}
              className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-xl font-medium hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
              disabled={submitting}
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              {submitting ? 'Adding...' : 'Add Customer'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Customer Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Customer"
        size="lg"
      >
        {editingCustomer && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white font-medium mb-2">Full Name *</label>
                <input
                  type="text"
                  value={editingCustomer.name || ''}
                  onChange={(e) => setEditingCustomer({...editingCustomer, name: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
                  required
                />
              </div>
              
              <div>
                <label className="block text-white font-medium mb-2">Email *</label>
                <input
                  type="email"
                  value={editingCustomer.email || ''}
                  onChange={(e) => setEditingCustomer({...editingCustomer, email: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
                  required
                />
              </div>
              
              <div>
                <label className="block text-white font-medium mb-2">Phone *</label>
                <input
                  type="tel"
                  value={editingCustomer.phone || ''}
                  onChange={(e) => setEditingCustomer({...editingCustomer, phone: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
                  required
                />
              </div>
              
              <div>
                <label className="block text-white font-medium mb-2">Age</label>
                <input
                  type="number"
                  value={editingCustomer.age || ''}
                  onChange={(e) => setEditingCustomer({...editingCustomer, age: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
                  min="1"
                  max="120"
                />
              </div>
              
              <div>
                <label className="block text-white font-medium mb-2">Gender</label>
                <select
                  value={editingCustomer.gender || ''}
                  onChange={(e) => setEditingCustomer({...editingCustomer, gender: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
                >
                  <option value="" className="bg-gray-800">Select gender</option>
                  <option value="Male" className="bg-gray-800">Male</option>
                  <option value="Female" className="bg-gray-800">Female</option>
                  <option value="Other" className="bg-gray-800">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-white font-medium mb-2">Emergency Contact</label>
                <input
                  type="tel"
                  value={editingCustomer.emergencyContact || ''}
                  onChange={(e) => setEditingCustomer({...editingCustomer, emergencyContact: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-white font-medium mb-2">Address</label>
              <textarea
                value={editingCustomer.address || ''}
                onChange={(e) => setEditingCustomer({...editingCustomer, address: e.target.value})}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm resize-none"
                rows="3"
              />
            </div>
            
            <div>
              <label className="block text-white font-medium mb-2">Medical History (comma separated)</label>
              <input
                type="text"
                value={editingCustomer.medicalHistory || ''}
                onChange={(e) => setEditingCustomer({...editingCustomer, medicalHistory: e.target.value})}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
              />
            </div>
            
            <div>
              <label className="block text-white font-medium mb-2">Notes</label>
              <textarea
                value={editingCustomer.notes || ''}
                onChange={(e) => setEditingCustomer({...editingCustomer, notes: e.target.value})}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm resize-none"
                rows="3"
              />
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-medium transition-all duration-300 border border-white/20"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                onClick={updateCustomer}
                className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-xl font-medium hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
                disabled={submitting}
              >
                {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {submitting ? 'Updating...' : 'Update Customer'}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={confirmAction}
        title="Delete Customer"
        message={`Are you sure you want to delete "${selectedCustomer?.name}"? This will permanently remove all customer data and booking history.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
}