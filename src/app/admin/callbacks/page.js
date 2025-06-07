'use client';

import { useState } from 'react';
import { 
  Phone, Clock, User, Search, Filter, Download, CheckCircle, 
  AlertCircle, Calendar, MessageSquare, X, Edit
} from 'lucide-react';
import Modal, { ConfirmModal } from '../components/Modal';
import StatCard from '../components/StatCard';


export default function CallbacksPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterTime, setFilterTime] = useState('all');
  const [selectedCallback, setSelectedCallback] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [actionType, setActionType] = useState('');

  // Mock callbacks data
  const [callbacks, setCallbacks] = useState([
    { 
      id: 1, 
      name: "Alice Smith", 
      phone: "+91 98765 43215", 
      preferredTime: "morning", 
      status: "pending", 
      createdAt: "2024-06-07 14:30",
      priority: "normal",
      notes: "Interested in full body checkup package",
      attempts: 0,
      lastAttempt: null
    },
    { 
      id: 2, 
      name: "Bob Taylor", 
      phone: "+91 98765 43216", 
      preferredTime: "evening", 
      status: "completed", 
      createdAt: "2024-06-07 16:45",
      priority: "high",
      notes: "Urgent - diabetic patient needs consultation",
      attempts: 1,
      lastAttempt: "2024-06-07 17:00",
      completedBy: "Admin User"
    },
    { 
      id: 3, 
      name: "Carol White", 
      phone: "+91 98765 43217", 
      preferredTime: "afternoon", 
      status: "pending", 
      createdAt: "2024-06-08 10:15",
      priority: "normal",
      notes: "Follow-up on test results inquiry",
      attempts: 2,
      lastAttempt: "2024-06-08 11:00"
    },
    { 
      id: 4, 
      name: "David Brown", 
      phone: "+91 98765 43218", 
      preferredTime: "morning", 
      status: "in-progress", 
      createdAt: "2024-06-08 09:20",
      priority: "high",
      notes: "Callback regarding appointment rescheduling",
      attempts: 1,
      lastAttempt: "2024-06-08 10:30"
    },
    { 
      id: 5, 
      name: "Eve Wilson", 
      phone: "+91 98765 43219", 
      preferredTime: "anytime", 
      status: "failed", 
      createdAt: "2024-06-06 13:45",
      priority: "low",
      notes: "General inquiry about test prices",
      attempts: 3,
      lastAttempt: "2024-06-07 15:20"
    }
  ]);

  // Stats for callbacks
  const stats = [
    {
      title: "Total Callbacks",
      value: callbacks.length.toString(),
      change: "+8%",
      trend: "up",
      icon: Phone,
      color: "from-purple-500 to-pink-600",
      description: "All callback requests"
    },
    {
      title: "Pending",
      value: callbacks.filter(c => c.status === 'pending').length.toString(),
      change: "+5%",
      trend: "up",
      icon: Clock,
      color: "from-yellow-500 to-orange-600",
      description: "Awaiting callback"
    },
    {
      title: "Completed",
      value: callbacks.filter(c => c.status === 'completed').length.toString(),
      change: "+12%",
      trend: "up",
      icon: CheckCircle,
      color: "from-green-500 to-emerald-600",
      description: "Successfully completed"
    },
    {
      title: "Success Rate",
      value: "85%",
      change: "+3%",
      trend: "up",
      icon: AlertCircle,
      color: "from-cyan-500 to-blue-600",
      description: "Callback success rate"
    }
  ];

  const filteredCallbacks = callbacks.filter(callback => {
    const matchesSearch = callback.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         callback.phone.includes(searchTerm) ||
                         callback.notes.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || callback.status === filterStatus;
    const matchesTime = filterTime === 'all' || callback.preferredTime === filterTime;
    return matchesSearch && matchesStatus && matchesTime;
  });

  const updateCallbackStatus = (id, newStatus) => {
    setCallbacks(callbacks.map(callback => 
      callback.id === id 
        ? { 
            ...callback, 
            status: newStatus,
            lastAttempt: newStatus === 'completed' || newStatus === 'in-progress' ? new Date().toISOString() : callback.lastAttempt,
            attempts: newStatus === 'in-progress' ? callback.attempts + 1 : callback.attempts,
            completedBy: newStatus === 'completed' ? 'Admin User' : callback.completedBy
          } 
        : callback
    ));
  };

  const deleteCallback = (id) => {
    setCallbacks(callbacks.filter(callback => callback.id !== id));
  };

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
    setSelectedCallback(callback);
    setActionType(action);
    if (action === 'delete') {
      setShowConfirmModal(true);
    } else {
      updateCallbackStatus(callback.id, action);
    }
  };

  const confirmAction = () => {
    if (actionType === 'delete' && selectedCallback) {
      deleteCallback(selectedCallback.id);
    }
    setShowConfirmModal(false);
    setSelectedCallback(null);
    setActionType('');
  };

  const exportCallbacks = () => {
    alert('Export functionality would be implemented here');
  };

  return (
    <div className="space-y-6">
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
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <button className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-2 rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl">
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
        {filteredCallbacks.map((callback, index) => (
          <div 
            key={callback.id} 
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
                    {callback.name}
                  </h3>
                  <p className="text-white/60 text-sm">{callback.phone}</p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(callback.status)}`}>
                  {callback.status}
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(callback.priority)}`}>
                  {callback.priority}
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
                Requested: {new Date(callback.createdAt).toLocaleString()}
              </div>

              {callback.lastAttempt && (
                <div className="flex items-center gap-2 text-white/70 text-sm">
                  <Phone className="w-4 h-4 text-purple-400" />
                  Last attempt: {new Date(callback.lastAttempt).toLocaleString()}
                </div>
              )}

              <div className="flex items-center gap-2 text-white/70 text-sm">
                <AlertCircle className="w-4 h-4 text-purple-400" />
                Attempts: {callback.attempts}
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
                    className="flex-1 bg-blue-500/20 text-blue-400 py-2 rounded-lg hover:bg-blue-500/30 transition-all duration-300 text-sm font-medium hover:scale-105"
                  >
                    Call Now
                  </button>
                  <button 
                    onClick={() => handleAction(callback, 'completed')}
                    className="flex-1 bg-green-500/20 text-green-400 py-2 rounded-lg hover:bg-green-500/30 transition-all duration-300 text-sm font-medium hover:scale-105"
                  >
                    Mark Done
                  </button>
                </>
              )}
              
              {callback.status === 'in-progress' && (
                <>
                  <button 
                    onClick={() => handleAction(callback, 'completed')}
                    className="flex-1 bg-green-500/20 text-green-400 py-2 rounded-lg hover:bg-green-500/30 transition-all duration-300 text-sm font-medium hover:scale-105"
                  >
                    Complete
                  </button>
                  <button 
                    onClick={() => handleAction(callback, 'failed')}
                    className="flex-1 bg-red-500/20 text-red-400 py-2 rounded-lg hover:bg-red-500/30 transition-all duration-300 text-sm font-medium hover:scale-105"
                  >
                    Mark Failed
                  </button>
                </>
              )}

              {callback.status === 'completed' && (
                <div className="flex-1 bg-green-500/10 text-green-400 py-2 rounded-lg text-center text-sm font-medium">
                  ✓ Completed by {callback.completedBy}
                </div>
              )}

              {callback.status === 'failed' && (
                <button 
                  onClick={() => handleAction(callback, 'pending')}
                  className="flex-1 bg-yellow-500/20 text-yellow-400 py-2 rounded-lg hover:bg-yellow-500/30 transition-all duration-300 text-sm font-medium hover:scale-105"
                >
                  Retry
                </button>
              )}

              <button 
                onClick={() => { setSelectedCallback(callback); setShowModal(true); }}
                className="p-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-all duration-300 hover:scale-110"
                title="View Details"
              >
                <Edit className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredCallbacks.length === 0 && (
        <div className="bg-white/5 backdrop-blur-2xl rounded-2xl p-12 border border-white/10 text-center">
          <Phone className="w-16 h-16 text-white/50 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No Callbacks Found</h3>
          <p className="text-white/60">No callback requests match your current filters.</p>
        </div>
      )}

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
                  <div className="text-white font-medium text-lg">{selectedCallback.name}</div>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-white/60 text-sm mb-1">Phone Number</div>
                  <div className="text-white font-medium">{selectedCallback.phone}</div>
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
                    {selectedCallback.status}
                  </div>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-white/60 text-sm mb-1">Priority</div>
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(selectedCallback.priority)}`}>
                    {selectedCallback.priority}
                  </div>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-white/60 text-sm mb-1">Attempts</div>
                  <div className="text-white font-medium">{selectedCallback.attempts}</div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="text-white/60 text-sm mb-2">Notes</div>
              <div className="text-white">{selectedCallback.notes}</div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  updateCallbackStatus(selectedCallback.id, 'completed');
                  setShowModal(false);
                }}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl font-medium hover:from-green-600 hover:to-emerald-700 transition-all duration-300"
              >
                Mark Completed
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
        message={`Are you sure you want to delete the callback request from ${selectedCallback?.name}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
}