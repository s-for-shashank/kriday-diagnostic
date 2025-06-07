'use client';

import { useState, useEffect } from 'react';
import { 
  Search, Filter, Download, Eye, Edit, Trash2, X, Calendar,
  Clock, Phone, Mail, User, CheckCircle, AlertCircle, Plus,
  Loader2, Save
} from 'lucide-react';
import Modal, { ConfirmModal } from '../components/Modal';
import { bookingsApi, testsApi, withErrorHandling } from '@/lib/api';

export default function BookingsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDate, setFilterDate] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [editingBooking, setEditingBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [actionType, setActionType] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [tests, setTests] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0
  });

  const [newBooking, setNewBooking] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    testName: '',
    appointmentDate: '',
    appointmentTime: '',
    customerAge: '',
    customerGender: '',
    customerAddress: '',
    notes: ''
  });

  // Load initial data
  useEffect(() => {
    loadBookings();
    loadTests();
  }, [pagination.page]);

  // Load bookings from API
  const loadBookings = async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const queryParams = {
        ...filters,
        page: pagination.page,
        limit: pagination.limit,
        status: filterStatus !== 'all' ? filterStatus : undefined,
        date: filterDate || undefined,
        search: searchTerm || undefined
      };
      
      // Remove undefined values
      Object.keys(queryParams).forEach(key => {
        if (queryParams[key] === undefined) {
          delete queryParams[key];
        }
      });
      
      const result = await withErrorHandling(bookingsApi.getAll)(queryParams);
      
      if (result.success) {
        setBookings(Array.isArray(result.data.data) ? result.data.data : result.data || []);
        if (result.data.pagination) {
          setPagination(result.data.pagination);
        }
      } else {
        setError(result.error || 'Failed to load bookings');
        console.error('Failed to load bookings:', result.error);
        setBookings([]);
      }
    } catch (err) {
      setError('Failed to load bookings');
      console.error('Error loading bookings:', err);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  // Load tests for dropdown
  const loadTests = async () => {
    try {
      const result = await withErrorHandling(testsApi.getAll)({ status: 'active' });
      if (result.success) {
        setTests(Array.isArray(result.data) ? result.data : []);
      }
    } catch (err) {
      console.error('Error loading tests:', err);
    }
  };

  // Safe array check function
  const safeArray = (arr) => Array.isArray(arr) ? arr : [];

  // Filter bookings locally for instant results
  const filteredBookings = safeArray(bookings).filter(booking => {
    if (!booking) return false;
    
    const matchesSearch = (booking.customerName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (booking.customerEmail?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (booking.customerPhone || '').includes(searchTerm) ||
                         (booking.testName?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || booking.status === filterStatus;
    const matchesDate = !filterDate || booking.appointmentDate === filterDate;
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  // Update booking status
  const updateBookingStatus = async (id, newStatus) => {
    try {
      setSubmitting(true);
      setError(null);
      
      console.log('Updating booking status:', id, newStatus); // Debug log
      
      const result = await withErrorHandling(bookingsApi.updateStatus)(id, newStatus);
      
      if (result.success) {
        // Update local state
        setBookings(prevBookings => 
          safeArray(prevBookings).map(booking => 
            (booking?._id === id || booking?.id === id)
              ? { ...booking, status: newStatus, updatedAt: new Date().toISOString() }
              : booking
          )
        );
      } else {
        setError(result.error || 'Failed to update booking status');
      }
    } catch (err) {
      setError('Failed to update booking status');
      console.error('Error updating booking status:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // Delete booking
  const deleteBooking = async (id) => {
    try {
      setSubmitting(true);
      const result = await withErrorHandling(bookingsApi.delete)(id);
      
      if (result.success) {
        setBookings(prevBookings => 
          safeArray(prevBookings).filter(booking => 
            booking?._id !== id && booking?.id !== id
          )
        );
      } else {
        setError(result.error || 'Failed to delete booking');
      }
    } catch (err) {
      setError('Failed to delete booking');
      console.error('Error deleting booking:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // Add new booking
  const addNewBooking = async () => {
    if (!newBooking.customerName || !newBooking.customerEmail || !newBooking.customerPhone || !newBooking.testName || !newBooking.appointmentDate || !newBooking.appointmentTime) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      
      const result = await withErrorHandling(bookingsApi.create)(newBooking);
      
      if (result.success) {
        // Reload bookings to get the new booking with proper ID
        await loadBookings();
        
        // Reset form
        setNewBooking({
          customerName: '',
          customerEmail: '',
          customerPhone: '',
          testName: '',
          appointmentDate: '',
          appointmentTime: '',
          customerAge: '',
          customerGender: '',
          customerAddress: '',
          notes: ''
        });
        setShowAddModal(false);
      } else {
        setError(result.error || 'Failed to create booking');
      }
    } catch (err) {
      setError('Failed to create booking');
      console.error('Error creating booking:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // Update booking
  const updateBooking = async () => {
    if (!editingBooking || !editingBooking.customerName || !editingBooking.customerEmail || !editingBooking.testName) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      
      const bookingId = editingBooking._id || editingBooking.id;
      const result = await withErrorHandling(bookingsApi.update)(bookingId, editingBooking);
      
      if (result.success) {
        // Update local state
        setBookings(prevBookings => 
          safeArray(prevBookings).map(booking => 
            (booking?._id === bookingId || booking?.id === bookingId)
              ? { ...booking, ...editingBooking, updatedAt: new Date().toISOString() }
              : booking
          )
        );
        setShowEditModal(false);
        setEditingBooking(null);
      } else {
        setError(result.error || 'Failed to update booking');
      }
    } catch (err) {
      setError('Failed to update booking');
      console.error('Error updating booking:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle actions
  const handleAction = (booking, action) => {
    const bookingId = booking._id || booking.id;
    setSelectedBooking(booking);
    setActionType(action);
    
    if (action === 'delete') {
      setShowConfirmModal(true);
    } else if (action === 'view') {
      setShowModal(true);
    } else if (action === 'edit') {
      setEditingBooking({
        ...booking,
        id: bookingId,
        _id: bookingId
      });
      setShowEditModal(true);
    } else if (action.startsWith('status-')) {
      const newStatus = action.replace('status-', '');
      updateBookingStatus(bookingId, newStatus);
    }
  };

  // Confirm action
  const confirmAction = async () => {
    if (actionType === 'delete' && selectedBooking) {
      const bookingId = selectedBooking._id || selectedBooking.id;
      await deleteBooking(bookingId);
    }
    setShowConfirmModal(false);
    setSelectedBooking(null);
    setActionType('');
  };

  // Utility functions
  const getStatusColor = (status) => {
    switch(status) {
      case 'confirmed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'completed': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'confirmed': return <CheckCircle className="w-3 h-3" />;
      case 'completed': return <CheckCircle className="w-3 h-3" />;
      default: return <AlertCircle className="w-3 h-3" />;
    }
  };

  const exportBookings = async () => {
    try {
      const dataStr = JSON.stringify(safeArray(bookings), null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      const exportFileDefaultName = 'kriday-bookings.json';
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    } catch (err) {
      console.error('Export failed:', err);
      setError('Failed to export bookings');
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mx-auto mb-4" />
          <p className="text-white/60">Loading bookings...</p>
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

      {/* Header with Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Bookings Management</h2>
          <p className="text-white/60">Manage all customer bookings and appointments</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={exportBookings}
            className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl transition-all duration-300 flex items-center gap-2 border border-white/20 hover:border-white/30"
            disabled={submitting}
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-4 py-2 rounded-xl hover:from-cyan-600 hover:to-purple-700 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl"
            disabled={submitting}
          >
            <Plus className="w-4 h-4" />
            Add Booking
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white/5 backdrop-blur-2xl rounded-2xl p-6 border border-white/10">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name, test, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm transition-all duration-300"
            />
          </div>
          <div className="flex gap-4">
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                loadBookings({ status: e.target.value !== 'all' ? e.target.value : undefined });
              }}
              className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm min-w-[150px]"
            >
              <option value="all" className="bg-gray-800">All Status</option>
              <option value="pending" className="bg-gray-800">Pending</option>
              <option value="confirmed" className="bg-gray-800">Confirmed</option>
              <option value="completed" className="bg-gray-800">Completed</option>
              <option value="cancelled" className="bg-gray-800">Cancelled</option>
            </select>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => {
                setFilterDate(e.target.value);
                loadBookings({ date: e.target.value });
              }}
              className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm min-w-[150px]"
            />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Bookings", value: pagination.total || safeArray(bookings).length, color: "from-cyan-500 to-blue-600" },
          { label: "Confirmed", value: safeArray(bookings).filter(b => b?.status === 'confirmed').length, color: "from-green-500 to-emerald-600" },
          { label: "Pending", value: safeArray(bookings).filter(b => b?.status === 'pending').length, color: "from-yellow-500 to-orange-600" },
          { label: "Completed", value: safeArray(bookings).filter(b => b?.status === 'completed').length, color: "from-purple-500 to-pink-600" }
        ].map((stat, index) => (
          <div key={index} className={`bg-gradient-to-r ${stat.color} p-4 rounded-xl text-white shadow-lg hover:scale-105 transition-all duration-300 animate-fade-in`} style={{ animationDelay: `${index * 0.1}s` }}>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-white/90 text-sm">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Bookings Table */}
      <div className="bg-white/5 backdrop-blur-2xl rounded-2xl border border-white/10 overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <h3 className="text-lg font-bold text-white">All Bookings ({filteredBookings.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-4 text-left text-white font-medium">Customer</th>
                <th className="px-6 py-4 text-left text-white font-medium">Test Details</th>
                <th className="px-6 py-4 text-left text-white font-medium">Date & Time</th>
                <th className="px-6 py-4 text-left text-white font-medium">Status</th>
                <th className="px-6 py-4 text-left text-white font-medium">Amount</th>
                <th className="px-6 py-4 text-left text-white font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking, index) => {
                if (!booking) return null;
                
                const bookingId = booking._id || booking.id;
                
                return (
                  <tr key={bookingId} className="border-t border-white/10 hover:bg-white/5 transition-all duration-300 animate-fade-in group" style={{ animationDelay: `${index * 0.05}s` }}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {(booking.customerName || 'U').split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <div className="text-white font-medium group-hover:text-cyan-400 transition-colors duration-300">{booking.customerName || 'Unknown'}</div>
                          <div className="text-white/60 text-sm flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {booking.customerEmail || 'No email'}
                          </div>
                          <div className="text-white/60 text-sm flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {booking.customerPhone || 'No phone'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-white font-medium">{booking.testName || 'Unknown Test'}</div>
                      <div className="text-white/60 text-sm">
                        {booking.customerGender && booking.customerAge 
                          ? `${booking.customerGender}, ${booking.customerAge} years`
                          : 'No details'
                        }
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-white mb-1">
                        <Calendar className="w-4 h-4 text-cyan-400" />
                        {booking.appointmentDate || 'No date'}
                      </div>
                      <div className="flex items-center gap-2 text-white/60 text-sm">
                        <Clock className="w-3 h-3" />
                        {booking.appointmentTime || 'No time'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={booking.status || 'pending'}
                        onChange={(e) => updateBookingStatus(bookingId, e.target.value)}
                        className={`px-3 py-2 rounded-lg text-xs font-medium border cursor-pointer transition-all duration-300 ${getStatusColor(booking.status)}`}
                        disabled={submitting}
                      >
                        <option value="pending" className="bg-gray-800">Pending</option>
                        <option value="confirmed" className="bg-gray-800">Confirmed</option>
                        <option value="completed" className="bg-gray-800">Completed</option>
                        <option value="cancelled" className="bg-gray-800">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-white font-bold">₹{booking.testPrice || booking.amount || '0'}</div>
                      {booking.paymentStatus && (
                        <div className={`text-xs px-2 py-1 rounded mt-1 ${
                          booking.paymentStatus === 'paid' 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {booking.paymentStatus}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleAction(booking, 'view')}
                          className="p-2 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-all duration-300 hover:scale-110"
                          title="View Details"
                          disabled={submitting}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleAction(booking, 'edit')}
                          className="p-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-all duration-300 hover:scale-110"
                          title="Edit Booking"
                          disabled={submitting}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleAction(booking, 'delete')}
                          className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all duration-300 hover:scale-110"
                          title="Delete Booking"
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
      {filteredBookings.length === 0 && !loading && (
        <div className="bg-white/5 backdrop-blur-2xl rounded-2xl p-12 border border-white/10 text-center">
          <Calendar className="w-16 h-16 text-white/50 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No Bookings Found</h3>
          <p className="text-white/60">No bookings match your current filters.</p>
        </div>
      )}

      {/* Booking Details Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Booking Details"
        size="lg"
      >
        {selectedBooking && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-white/60 text-sm mb-1">Customer Name</div>
                  <div className="text-white font-medium text-lg">{selectedBooking.customerName || 'N/A'}</div>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-white/60 text-sm mb-1">Test</div>
                  <div className="text-white font-medium">{selectedBooking.testName || 'N/A'}</div>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-white/60 text-sm mb-1">Amount</div>
                  <div className="text-white font-bold text-xl">₹{selectedBooking.testPrice || selectedBooking.amount || '0'}</div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                    <div className="text-white/60 text-sm mb-1">Date</div>
                    <div className="text-white font-medium">{selectedBooking.appointmentDate || 'N/A'}</div>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                    <div className="text-white/60 text-sm mb-1">Time</div>
                    <div className="text-white font-medium">{selectedBooking.appointmentTime || 'N/A'}</div>
                  </div>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-white/60 text-sm mb-1">Contact</div>
                  <div className="text-white font-medium">{selectedBooking.customerPhone || 'N/A'}</div>
                  <div className="text-white/80 text-sm">{selectedBooking.customerEmail || 'N/A'}</div>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-white/60 text-sm mb-1">Address</div>
                  <div className="text-white font-medium text-sm">{selectedBooking.customerAddress || 'No address provided'}</div>
                </div>
              </div>
            </div>

            {selectedBooking.notes && (
              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="text-white/60 text-sm mb-2">Notes</div>
                <div className="text-white">{selectedBooking.notes}</div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => {
                  const bookingId = selectedBooking._id || selectedBooking.id;
                  updateBookingStatus(bookingId, 'completed');
                  setShowModal(false);
                }}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl font-medium hover:from-green-600 hover:to-emerald-700 transition-all duration-300 flex items-center justify-center gap-2"
                disabled={submitting}
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Mark Completed'}
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  handleAction(selectedBooking, 'edit');
                }}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 text-white py-3 rounded-xl font-medium hover:from-purple-600 hover:to-pink-700 transition-all duration-300"
              >
                Edit Booking
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

      {/* Add Booking Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Booking"
        size="lg"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white font-medium mb-2">Full Name *</label>
              <input
                type="text"
                value={newBooking.customerName}
                onChange={(e) => setNewBooking({...newBooking, customerName: e.target.value})}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm"
                placeholder="Enter full name"
                required
              />
            </div>
            
            <div>
              <label className="block text-white font-medium mb-2">Email *</label>
              <input
                type="email"
                value={newBooking.customerEmail}
                onChange={(e) => setNewBooking({...newBooking, customerEmail: e.target.value})}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm"
                placeholder="email@example.com"
                required
              />
            </div>
            
            <div>
              <label className="block text-white font-medium mb-2">Phone *</label>
              <input
                type="tel"
                value={newBooking.customerPhone}
                onChange={(e) => setNewBooking({...newBooking, customerPhone: e.target.value})}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm"
                placeholder="+91 XXXXX XXXXX"
                required
              />
            </div>
            
            <div>
              <label className="block text-white font-medium mb-2">Test *</label>
              <select
                value={newBooking.testName}
                onChange={(e) => setNewBooking({...newBooking, testName: e.target.value})}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm"
                required
              >
                <option value="" className="bg-gray-800">Select test</option>
                {safeArray(tests).map(test => (
                  <option key={test._id || test.id} value={test.name} className="bg-gray-800">
                    {test.name} - ₹{test.price}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-white font-medium mb-2">Date *</label>
              <input
                type="date"
                value={newBooking.appointmentDate}
                onChange={(e) => setNewBooking({...newBooking, appointmentDate: e.target.value})}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm"
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
            
            <div>
              <label className="block text-white font-medium mb-2">Time *</label>
              <input
                type="time"
                value={newBooking.appointmentTime}
                onChange={(e) => setNewBooking({...newBooking, appointmentTime: e.target.value})}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm"
                required
              />
            </div>
            
            <div>
              <label className="block text-white font-medium mb-2">Age</label>
              <input
                type="number"
                value={newBooking.customerAge}
                onChange={(e) => setNewBooking({...newBooking, customerAge: e.target.value})}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm"
                placeholder="Age"
                min="1"
                max="120"
              />
            </div>
            
            <div>
              <label className="block text-white font-medium mb-2">Gender</label>
              <select
                value={newBooking.customerGender}
                onChange={(e) => setNewBooking({...newBooking, customerGender: e.target.value})}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm"
              >
                <option value="" className="bg-gray-800">Select gender</option>
                <option value="Male" className="bg-gray-800">Male</option>
                <option value="Female" className="bg-gray-800">Female</option>
                <option value="Other" className="bg-gray-800">Other</option>
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-white font-medium mb-2">Address</label>
              <textarea
                value={newBooking.customerAddress}
                onChange={(e) => setNewBooking({...newBooking, customerAddress: e.target.value})}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm resize-none"
                rows="3"
                placeholder="Enter full address"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-white font-medium mb-2">Notes</label>
              <textarea
                value={newBooking.notes}
                onChange={(e) => setNewBooking({...newBooking, notes: e.target.value})}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm resize-none"
                rows="2"
                placeholder="Additional notes (optional)"
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
              onClick={addNewBooking}
              className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-600 text-white py-3 rounded-xl font-medium hover:from-cyan-600 hover:to-purple-700 transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
              disabled={submitting}
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              {submitting ? 'Adding...' : 'Add Booking'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Booking Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Booking"
        size="lg"
      >
        {editingBooking && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white font-medium mb-2">Full Name *</label>
                <input
                  type="text"
                  value={editingBooking.customerName || ''}
                  onChange={(e) => setEditingBooking({...editingBooking, customerName: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm"
                  required
                />
              </div>
              
              <div>
                <label className="block text-white font-medium mb-2">Email *</label>
                <input
                  type="email"
                  value={editingBooking.customerEmail || ''}
                  onChange={(e) => setEditingBooking({...editingBooking, customerEmail: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm"
                  required
                />
              </div>
              
              <div>
                <label className="block text-white font-medium mb-2">Phone *</label>
                <input
                  type="tel"
                  value={editingBooking.customerPhone || ''}
                  onChange={(e) => setEditingBooking({...editingBooking, customerPhone: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm"
                  required
                />
              </div>
              
              <div>
                <label className="block text-white font-medium mb-2">Test *</label>
                <select
                  value={editingBooking.testName || ''}
                  onChange={(e) => setEditingBooking({...editingBooking, testName: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm"
                  required
                >
                  <option value="" className="bg-gray-800">Select test</option>
                  {safeArray(tests).map(test => (
                    <option key={test._id || test.id} value={test.name} className="bg-gray-800">
                      {test.name} - ₹{test.price}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-white font-medium mb-2">Date *</label>
                <input
                  type="date"
                  value={editingBooking.appointmentDate || ''}
                  onChange={(e) => setEditingBooking({...editingBooking, appointmentDate: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm"
                  required
                />
              </div>
              
              <div>
                <label className="block text-white font-medium mb-2">Time *</label>
                <input
                  type="time"
                  value={editingBooking.appointmentTime || ''}
                  onChange={(e) => setEditingBooking({...editingBooking, appointmentTime: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm"
                  required
                />
              </div>
              
              <div>
                <label className="block text-white font-medium mb-2">Age</label>
                <input
                  type="number"
                  value={editingBooking.customerAge || ''}
                  onChange={(e) => setEditingBooking({...editingBooking, customerAge: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm"
                  min="1"
                  max="120"
                />
              </div>
              
              <div>
                <label className="block text-white font-medium mb-2">Gender</label>
                <select
                  value={editingBooking.customerGender || ''}
                  onChange={(e) => setEditingBooking({...editingBooking, customerGender: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm"
                >
                  <option value="" className="bg-gray-800">Select gender</option>
                  <option value="Male" className="bg-gray-800">Male</option>
                  <option value="Female" className="bg-gray-800">Female</option>
                  <option value="Other" className="bg-gray-800">Other</option>
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-white font-medium mb-2">Address</label>
                <textarea
                  value={editingBooking.customerAddress || ''}
                  onChange={(e) => setEditingBooking({...editingBooking, customerAddress: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm resize-none"
                  rows="3"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-white font-medium mb-2">Notes</label>
                <textarea
                  value={editingBooking.notes || ''}
                  onChange={(e) => setEditingBooking({...editingBooking, notes: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm resize-none"
                  rows="2"
                />
              </div>
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
                onClick={updateBooking}
                className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-600 text-white py-3 rounded-xl font-medium hover:from-cyan-600 hover:to-purple-700 transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
                disabled={submitting}
              >
                {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {submitting ? 'Updating...' : 'Update Booking'}
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
        title="Delete Booking"
        message={`Are you sure you want to delete the booking for ${selectedBooking?.customerName}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
}