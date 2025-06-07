'use client';

import { useState, useEffect } from 'react';
import { 
  Phone, Clock, User, Search, Filter, Download, CheckCircle, 
  AlertCircle, Calendar, MessageSquare, X, Edit, Loader2, Plus
} from 'lucide-react';
import Modal, { ConfirmModal } from '../components/Modal';
import StatCard from '../components/StatCard';
import { callbacksApi, withErrorHandling } from '@/lib/api';

export default function CallbacksPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterTime, setFilterTime] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [selectedCallback, setSelectedCallback] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [actionType, setActionType] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [callbacks, setCallbacks] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0
  });

  const [newCallback, setNewCallback] = useState({
    customerName: '',
    customerPhone: '',
    preferredTime: 'morning',
    priority: 'normal',
    notes: ''
  });

  // Load initial data
  useEffect(() => {
    loadCallbacks();
  }, [pagination.page]);

  // Load callbacks from API
  const loadCallbacks = async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const queryParams = {
        ...filters,
        page: pagination.page,
        limit: pagination.limit
      };
      
      const result = await withErrorHandling(callbacksApi.getAll)(queryParams);
      
      if (result.success) {
        setCallbacks(Array.isArray(result.data.data) ? result.data.data : []);
        if (result.data.pagination) {
          setPagination(result.data.pagination);
        }
      } else {
        setError(result.error || 'Failed to load callbacks');
        console.error('Failed to load callbacks:', result.error);
        setCallbacks([]);
      }
    } catch (err) {
      setError('Failed to load callbacks');
      console.error('Error loading callbacks:', err);
      setCallbacks([]);
    } finally {
      setLoading(false);
    }
  };

  // Safe array check function
  const safeArray = (arr) => Array.isArray(arr) ? arr : [];

  // Stats for callbacks
  const stats = [
    {
      title: "Total Callbacks",
      value: pagination.total.toString(),
      change: "+8%",
      trend: "up",
      icon: Phone,
      color: "from-purple-500 to-pink-600",
      description: "All callback requests"
    },
    {
      title: "Pending",
      value: safeArray(callbacks).filter(c => c?.status === 'pending').length.toString(),
      change: "+5%",
      trend: "up",
      icon: Clock,
      color: "from-yellow-500 to-orange-600",
      description: "Awaiting callback"
    },
    {
      title: "Completed",
      value: safeArray(callbacks).filter(c => c?.status === 'completed').length.toString(),
      change: "+12%",
      trend: "up",
      icon: CheckCircle,
      color: "from-green-500 to-emerald-600",
      description: "Successfully completed"
    },
    {
      title: "Success Rate",
      value: `${safeArray(callbacks).length > 0 ? Math.round((safeArray(callbacks).filter(c => c?.status === 'completed').length / safeArray(callbacks).length) * 100) : 0}%`,
      change: "+3%",
      trend: "up",
      icon: AlertCircle,
      color: "from-cyan-500 to-blue-600",
      description: "Callback success rate"
    }
  ];

  // Filter callbacks
  const filteredCallbacks = safeArray(callbacks).filter(callback => {
    if (!callback) return false;
    
    const matchesSearch = (callback.customerName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (callback.customerPhone || '').includes(searchTerm) ||
                         (callback.notes?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || callback.status === filterStatus;
    const matchesTime = filterTime === 'all' || callback.preferredTime === filterTime;
    const matchesPriority = filterPriority === 'all' || callback.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesTime && matchesPriority;
  });

  // Update callback status
  const updateCallbackStatus = async (id, newStatus, completedBy = 'Admin User') => {
    try {
      setSubmitting(true);
      setError(null);
      
      console.log('Updating callback status:', id, newStatus); // Debug log
      
      const result = await withErrorHandling(callbacksApi.updateStatus)(id, newStatus, completedBy);
      
      if (result.success) {
        // Update local state
        setCallbacks(prevCallbacks => 
          safeArray(prevCallbacks).map(callback => 
            (callback?._id === id || callback?.id === id)
              ? { 
                  ...callback, 
                  status: newStatus,
                  lastAttempt: (newStatus === 'completed' || newStatus === 'in-progress') ? new Date().toISOString() : callback.lastAttempt,
                  attempts: newStatus === 'in-progress' ? (callback.attempts || 0) + 1 : callback.attempts,
                  completedBy: newStatus === 'completed' ? completedBy : callback.completedBy
                } 
              : callback
          )
        );
      } else {
        setError(result.error || 'Failed to update callback status');
      }
    } catch (err) {
      setError('Failed to update callback status');
      console.error('Error updating callback status:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // Delete callback
  const deleteCallback = async (id) => {
    try {
      setSubmitting(true);
      const result = await withErrorHandling(callbacksApi.delete)(id);
      
      if (result.success) {
        setCallbacks(prevCallbacks => 
          safeArray(prevCallbacks).filter(callback => 
            callback?._id !== id && callback?.id !== id
          )
        );
      } else {
        setError(result.error || 'Failed to delete callback');
      }
    } catch (err) {
      setError('Failed to delete callback');
      console.error('Error deleting callback:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // Add new callback
  const addNewCallback = async () => {
    if (!newCallback.customerName || !newCallback.customerPhone) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      
      const result = await withErrorHandling(callbacksApi.create)(newCallback);
      
      if (result.success) {
        // Reload callbacks to get the new callback with proper ID
        await loadCallbacks();
        
        // Reset form
        setNewCallback({
          customerName: '',
          customerPhone: '',
          preferredTime: 'morning',
          priority: 'normal',
          notes: ''
        });
        setShowAddModal(false);
      } else {
        setError(result.error || 'Failed to create callback');
      }
    } catch (err) {
      setError('Failed to create callback');
      console.error('Error creating callback:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // Utility functions
  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'in-progress': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'failed': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'bg-red-500/20 text-red-400';
      case 'normal': return 'bg-blue-500/20 text-blue-400';
      case 'low': return 'bg-gray-500/20 text-gray-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getPreferredTimeDisplay = (time) => {
    const timeMap = {
      'morning': 'Morning (9 AM - 12 PM)',
      'afternoon': 'Afternoon (12 PM - 5 PM)',
      'evening': 'Evening (5 PM - 8 PM)',
      'anytime': 'Anytime'
    };
    return timeMap[time] || time;
  };

  const handleAction = (callback, action) => {
    const callbackId = callback._id || callback.id;
    setSelectedCallback(callback);
    setActionType(action);
    
    if (action === 'delete') {
      setShowConfirmModal(true);
    } else if (action === 'view') {
      setShowModal(true);
    } else {
      updateCallbackStatus(callbackId, action);
    }
  };

  const confirmAction = async () => {
    if (actionType === 'delete' && selectedCallback) {
      const callbackId = selectedCallback._id || selectedCallback.id;
      await deleteCallback(callbackId);
    }
    setShowConfirmModal(false);
    setSelectedCallback(null);
    setActionType('');
  };

  const exportCallbacks = async () => {
    try {
      const dataStr = JSON.stringify(safeArray(callbacks), null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      const exportFileDefaultName = 'kriday-callbacks.json';
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    } catch (err) {
      console.error('Export failed:', err);
      setError('Failed to export callbacks');
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-purple-400 animate-spin mx-auto mb-4" />
          <p className="text-white/60">Loading callbacks...</p>
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
          <h2 className="text-2xl font-bold text-white mb-2">Callback Management</h2>
          <p className="text-white/60">Handle customer callback requests efficiently</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={exportCallbacks}
            className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl transition-all duration-300 flex items-center gap-2 border border-white/20 hover:border-white/30"
            disabled={submitting}
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-2 rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl"
            disabled={submitting}
          >
            <Plus className="w-4 h-4" />
            Add Callback
          </button>
          <button className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2 rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl">
            <Phone className="w-4 h-4" />
            Call Center
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
              placeholder="Search by name, phone, or notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm transition-all duration-300"
            />
          </div>
          <div className="flex gap-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm min-w-[150px]"
            >
              <option value="all" className="bg-gray-800">All Status</option>
              <option value="pending" className="bg-gray-800">Pending</option>
              <option value="in-progress" className="bg-gray-800">In Progress</option>
              <option value="completed" className="bg-gray-800">Completed</option>
              <option value="failed" className="bg-gray-800">Failed</option>
            </select>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm min-w-[150px]"
            >
              <option value="all" className="bg-gray-800">All Priority</option>
              <option value="high" className="bg-gray-800">High</option>
              <option value="normal" className="bg-gray-800">Normal</option>
              <option value="low" className="bg-gray-800">Low</option>
            </select>
            <select
              value={filterTime}
              onChange={(e) => setFilterTime(e.target.value)}
              className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm min-w-[150px]"
            >
              <option value="all" className="bg-gray-800">All Times</option>
              <option value="morning" className="bg-gray-800">Morning</option>
              <option value="afternoon" className="bg-gray-800">Afternoon</option>
              <option value="evening" className="bg-gray-800">Evening</option>
              <option value="anytime" className="bg-gray-800">Anytime</option>
            </select>
          </div>
        </div>
      </div>

      {/* Callbacks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCallbacks.map((callback, index) => {
          if (!callback) return null;
          
          const callbackId = callback._id || callback.id;
          
          return (
            <div 
              key={callbackId} 
              className="bg-white/5 backdrop-blur-2xl rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 animate-fade-in group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors duration-300">
                      {callback.customerName || 'Unknown Customer'}
                    </h3>
                    <p className="text-white/60 text-sm">{callback.customerPhone || 'No phone'}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(callback.status)}`}>
                    {callback.status || 'pending'}
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(callback.priority)}`}>
                    {callback.priority || 'normal'}
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-white/70 text-sm">
                  <Clock className="w-4 h-4 text-purple-400" />
                  {getPreferredTimeDisplay(callback.preferredTime)}
                </div>
                
                <div className="flex items-center gap-2 text-white/70 text-sm">
                  <Calendar className="w-4 h-4 text-purple-400" />
                  Requested: {callback.createdAt ? new Date(callback.createdAt).toLocaleString() : 'Unknown'}
                </div>

                {callback.lastAttempt && (
                  <div className="flex items-center gap-2 text-white/70 text-sm">
                    <Phone className="w-4 h-4 text-purple-400" />
                    Last attempt: {new Date(callback.lastAttempt).toLocaleString()}
                  </div>
                )}

                <div className="flex items-center gap-2 text-white/70 text-sm">
                  <AlertCircle className="w-4 h-4 text-purple-400" />
                  Attempts: {callback.attempts || 0}
                </div>

                {callback.notes && (
                  <div className="bg-white/5 rounded-lg p-3 mt-3">
                    <div className="flex items-start gap-2">
                      <MessageSquare className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                      <p className="text-white/80 text-sm">{callback.notes}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                {callback.status === 'pending' && (
                  <>
                    <button 
                      onClick={() => handleAction(callback, 'in-progress')}
                      className="flex-1 bg-blue-500/20 text-blue-400 py-2 rounded-lg hover:bg-blue-500/30 transition-all duration-300 text-sm font-medium hover:scale-105 flex items-center justify-center gap-1"
                      disabled={submitting}
                    >
                      {submitting ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Call Now'}
                    </button>
                    <button 
                      onClick={() => handleAction(callback, 'completed')}
                      className="flex-1 bg-green-500/20 text-green-400 py-2 rounded-lg hover:bg-green-500/30 transition-all duration-300 text-sm font-medium hover:scale-105 flex items-center justify-center gap-1"
                      disabled={submitting}
                    >
                      {submitting ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Mark Done'}
                    </button>
                  </>
                )}
                
                {callback.status === 'in-progress' && (
                  <>
                    <button 
                      onClick={() => handleAction(callback, 'completed')}
                      className="flex-1 bg-green-500/20 text-green-400 py-2 rounded-lg hover:bg-green-500/30 transition-all duration-300 text-sm font-medium hover:scale-105 flex items-center justify-center gap-1"
                      disabled={submitting}
                    >
                      {submitting ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Complete'}
                    </button>
                    <button 
                      onClick={() => handleAction(callback, 'failed')}
                      className="flex-1 bg-red-500/20 text-red-400 py-2 rounded-lg hover:bg-red-500/30 transition-all duration-300 text-sm font-medium hover:scale-105 flex items-center justify-center gap-1"
                      disabled={submitting}
                    >
                      {submitting ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Mark Failed'}
                    </button>
                  </>
                )}

                {callback.status === 'completed' && (
                  <div className="flex-1 bg-green-500/10 text-green-400 py-2 rounded-lg text-center text-sm font-medium">
                    ✓ Completed {callback.completedBy ? `by ${callback.completedBy}` : ''}
                  </div>
                )}

                {callback.status === 'failed' && (
                  <button 
                    onClick={() => handleAction(callback, 'pending')}
                    className="flex-1 bg-yellow-500/20 text-yellow-400 py-2 rounded-lg hover:bg-yellow-500/30 transition-all duration-300 text-sm font-medium hover:scale-105 flex items-center justify-center gap-1"
                    disabled={submitting}
                  >
                    {submitting ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Retry'}
                  </button>
                )}

                <button 
                  onClick={() => handleAction(callback, 'view')}
                  className="p-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-all duration-300 hover:scale-110"
                  title="View Details"
                  disabled={submitting}
                >
                  <Edit className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredCallbacks.length === 0 && !loading && (
        <div className="bg-white/5 backdrop-blur-2xl rounded-2xl p-12 border border-white/10 text-center">
          <Phone className="w-16 h-16 text-white/50 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No Callbacks Found</h3>
          <p className="text-white/60">No callback requests match your current filters.</p>
        </div>
      )}

      {/* Add Callback Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Callback"
        size="md"
      >
        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-white font-medium mb-2">Customer Name *</label>
              <input
                type="text"
                value={newCallback.customerName}
                onChange={(e) => setNewCallback({...newCallback, customerName: e.target.value})}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm"
                placeholder="Enter customer name"
                required
              />
            </div>
            
            <div>
              <label className="block text-white font-medium mb-2">Phone Number *</label>
              <input
                type="tel"
                value={newCallback.customerPhone}
                onChange={(e) => setNewCallback({...newCallback, customerPhone: e.target.value})}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm"
                placeholder="+91 98765 43210"
                required
              />
            </div>
            
            <div>
              <label className="block text-white font-medium mb-2">Preferred Time</label>
              <select
                value={newCallback.preferredTime}
                onChange={(e) => setNewCallback({...newCallback, preferredTime: e.target.value})}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm"
              >
                <option value="morning" className="bg-gray-800">Morning (9 AM - 12 PM)</option>
                <option value="afternoon" className="bg-gray-800">Afternoon (12 PM - 5 PM)</option>
                <option value="evening" className="bg-gray-800">Evening (5 PM - 8 PM)</option>
                <option value="anytime" className="bg-gray-800">Anytime</option>
              </select>
            </div>
            
            <div>
              <label className="block text-white font-medium mb-2">Priority</label>
              <select
                value={newCallback.priority}
                onChange={(e) => setNewCallback({...newCallback, priority: e.target.value})}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm"
              >
                <option value="low" className="bg-gray-800">Low</option>
                <option value="normal" className="bg-gray-800">Normal</option>
                <option value="high" className="bg-gray-800">High</option>
              </select>
            </div>
            
            <div>
              <label className="block text-white font-medium mb-2">Notes</label>
              <textarea
                value={newCallback.notes}
                onChange={(e) => setNewCallback({...newCallback, notes: e.target.value})}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm resize-none"
                rows="3"
                placeholder="Additional notes about the callback request"
              />
            </div>
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
              onClick={addNewCallback}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 text-white py-3 rounded-xl font-medium hover:from-purple-600 hover:to-pink-700 transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
              disabled={submitting}
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              {submitting ? 'Adding...' : 'Add Callback'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Callback Details Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Callback Details"
        size="md"
      >
        {selectedCallback && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-white/60 text-sm mb-1">Customer Name</div>
                  <div className="text-white font-medium text-lg">{selectedCallback.customerName || 'N/A'}</div>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-white/60 text-sm mb-1">Phone Number</div>
                  <div className="text-white font-medium">{selectedCallback.customerPhone || 'N/A'}</div>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-white/60 text-sm mb-1">Preferred Time</div>
                  <div className="text-white font-medium">{getPreferredTimeDisplay(selectedCallback.preferredTime)}</div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-white/60 text-sm mb-1">Status</div>
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedCallback.status)}`}>
                    {selectedCallback.status || 'pending'}
                  </div>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-white/60 text-sm mb-1">Priority</div>
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(selectedCallback.priority)}`}>
                    {selectedCallback.priority || 'normal'}
                  </div>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-white/60 text-sm mb-1">Attempts</div>
                  <div className="text-white font-medium">{selectedCallback.attempts || 0}</div>
                </div>
              </div>
            </div>

            {selectedCallback.notes && (
              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="text-white/60 text-sm mb-2">Notes</div>
                <div className="text-white">{selectedCallback.notes}</div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => {
                  const callbackId = selectedCallback._id || selectedCallback.id;
                  updateCallbackStatus(callbackId, 'completed');
                  setShowModal(false);
                }}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl font-medium hover:from-green-600 hover:to-emerald-700 transition-all duration-300 flex items-center justify-center gap-2"
                disabled={submitting}
              >
                {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'Mark Completed'
                )}
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-medium transition-all duration-300 border border-white/20"
              >
                Close
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
        title="Delete Callback"
        message={`Are you sure you want to delete the callback request from ${selectedCallback?.customerName}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
}