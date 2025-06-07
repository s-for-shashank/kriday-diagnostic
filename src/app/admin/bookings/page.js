'use client';

import { useState } from 'react';
import { 
  Search, Filter, Download, Eye, Edit, Trash2, X, Calendar,
  Clock, Phone, Mail, User, CheckCircle, AlertCircle, Plus
} from 'lucide-react';

export default function BookingsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Mock bookings data
  const [bookings, setBookings] = useState([
    { 
      id: 1, 
      name: "John Doe", 
      test: "Complete Blood Count", 
      date: "2024-06-08", 
      time: "09:00 AM", 
      status: "confirmed", 
      phone: "+91 98765 43210", 
      email: "john@example.com",
      age: 35,
      gender: "Male",
      address: "123 Main St, City",
      amount: "₹299"
    },
    { 
      id: 2, 
      name: "Sarah Wilson", 
      test: "Lipid Profile", 
      date: "2024-06-08", 
      time: "10:30 AM", 
      status: "pending", 
      phone: "+91 98765 43211", 
      email: "sarah@example.com",
      age: 42,
      gender: "Female",
      address: "456 Oak Ave, Town",
      amount: "₹499"
    },
    { 
      id: 3, 
      name: "Mike Johnson", 
      test: "Diabetes Panel", 
      date: "2024-06-09", 
      time: "11:00 AM", 
      status: "completed", 
      phone: "+91 98765 43212", 
      email: "mike@example.com",
      age: 28,
      gender: "Male",
      address: "789 Pine Rd, Village",
      amount: "₹599"
    },
    { 
      id: 4, 
      name: "Emma Brown", 
      test: "Thyroid Function", 
      date: "2024-06-09", 
      time: "02:00 PM", 
      status: "cancelled", 
      phone: "+91 98765 43213", 
      email: "emma@example.com",
      age: 38,
      gender: "Female",
      address: "321 Elm St, Metro",
      amount: "₹699"
    },
    { 
      id: 5, 
      name: "David Lee", 
      test: "Full Body Checkup", 
      date: "2024-06-10", 
      time: "09:30 AM", 
      status: "confirmed", 
      phone: "+91 98765 43214", 
      email: "david@example.com",
      age: 45,
      gender: "Male",
      address: "654 Maple Dr, Suburb",
      amount: "₹2999"
    }
  ]);

  const [newBooking, setNewBooking] = useState({
    name: '', email: '', phone: '', test: '', date: '', time: '', age: '', gender: '', address: ''
  });

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.test.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || booking.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const updateBookingStatus = (id, newStatus) => {
    setBookings(bookings.map(booking => 
      booking.id === id ? { ...booking, status: newStatus } : booking
    ));
  };

  const deleteBooking = (id) => {
    setBookings(bookings.filter(booking => booking.id !== id));
  };

  const addNewBooking = () => {
    if (newBooking.name && newBooking.email && newBooking.phone && newBooking.test) {
      const booking = {
        id: bookings.length + 1,
        ...newBooking,
        status: 'pending',
        amount: '₹299' // Default amount
      };
      setBookings([...bookings, booking]);
      setNewBooking({ name: '', email: '', phone: '', test: '', date: '', time: '', age: '', gender: '', address: '' });
      setShowAddModal(false);
    }
  };

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

  const exportBookings = () => {
    // Export functionality would go here
    alert('Export functionality would be implemented here');
  };

  return (
    <div className="space-y-6">
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
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-4 py-2 rounded-xl hover:from-cyan-600 hover:to-purple-700 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl"
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
              placeholder="Search by name, test, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm transition-all duration-300"
            />
          </div>
          <div className="flex gap-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm min-w-[150px]"
            >
              <option value="all" className="bg-gray-800">All Status</option>
              <option value="pending" className="bg-gray-800">Pending</option>
              <option value="confirmed" className="bg-gray-800">Confirmed</option>
              <option value="completed" className="bg-gray-800">Completed</option>
              <option value="cancelled" className="bg-gray-800">Cancelled</option>
            </select>
            <button className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all duration-300 flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Bookings", value: bookings.length, color: "from-cyan-500 to-blue-600" },
          { label: "Confirmed", value: bookings.filter(b => b.status === 'confirmed').length, color: "from-green-500 to-emerald-600" },
          { label: "Pending", value: bookings.filter(b => b.status === 'pending').length, color: "from-yellow-500 to-orange-600" },
          { label: "Completed", value: bookings.filter(b => b.status === 'completed').length, color: "from-purple-500 to-pink-600" }
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
              {filteredBookings.map((booking, index) => (
                <tr key={booking.id} className="border-t border-white/10 hover:bg-white/5 transition-all duration-300 animate-fade-in group" style={{ animationDelay: `${index * 0.05}s` }}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {booking.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="text-white font-medium group-hover:text-cyan-400 transition-colors duration-300">{booking.name}</div>
                        <div className="text-white/60 text-sm flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {booking.email}
                        </div>
                        <div className="text-white/60 text-sm flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {booking.phone}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-white font-medium">{booking.test}</div>
                    <div className="text-white/60 text-sm">{booking.gender}, {booking.age} years</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-white mb-1">
                      <Calendar className="w-4 h-4 text-cyan-400" />
                      {booking.date}
                    </div>
                    <div className="flex items-center gap-2 text-white/60 text-sm">
                      <Clock className="w-3 h-3" />
                      {booking.time}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={booking.status}
                      onChange={(e) => updateBookingStatus(booking.id, e.target.value)}
                      className={`px-3 py-2 rounded-lg text-xs font-medium border cursor-pointer transition-all duration-300 ${getStatusColor(booking.status)}`}
                    >
                      <option value="pending" className="bg-gray-800">Pending</option>
                      <option value="confirmed" className="bg-gray-800">Confirmed</option>
                      <option value="completed" className="bg-gray-800">Completed</option>
                      <option value="cancelled" className="bg-gray-800">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-white font-bold">{booking.amount}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => { setSelectedBooking(booking); setShowModal(true); }}
                        className="p-2 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-all duration-300 hover:scale-110"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-all duration-300 hover:scale-110"
                        title="Edit Booking"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => deleteBooking(booking.id)}
                        className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all duration-300 hover:scale-110"
                        title="Delete Booking"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking Details Modal */}
      {showModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/10 backdrop-blur-2xl rounded-2xl max-w-2xl w-full border border-white/20 shadow-2xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-white">Booking Details</h3>
                <button 
                  onClick={() => setShowModal(false)} 
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 hover:scale-110"
                >
                  <X size={20} className="text-white" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                    <div className="text-white/60 text-sm mb-1">Customer Name</div>
                    <div className="text-white font-medium text-lg">{selectedBooking.name}</div>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                    <div className="text-white/60 text-sm mb-1">Test</div>
                    <div className="text-white font-medium">{selectedBooking.test}</div>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                    <div className="text-white/60 text-sm mb-1">Amount</div>
                    <div className="text-white font-bold text-xl">{selectedBooking.amount}</div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <div className="text-white/60 text-sm mb-1">Date</div>
                      <div className="text-white font-medium">{selectedBooking.date}</div>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <div className="text-white/60 text-sm mb-1">Time</div>
                      <div className="text-white font-medium">{selectedBooking.time}</div>
                    </div>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                    <div className="text-white/60 text-sm mb-1">Contact</div>
                    <div className="text-white font-medium">{selectedBooking.phone}</div>
                    <div className="text-white/80 text-sm">{selectedBooking.email}</div>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                    <div className="text-white/60 text-sm mb-1">Address</div>
                    <div className="text-white font-medium text-sm">{selectedBooking.address}</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl font-medium hover:from-green-600 hover:to-emerald-700 transition-all duration-300">
                  Mark Completed
                </button>
                <button className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-600 text-white py-3 rounded-xl font-medium hover:from-cyan-600 hover:to-purple-700 transition-all duration-300">
                  Send Reminder
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Booking Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/10 backdrop-blur-2xl rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/20 shadow-2xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-white">Add New Booking</h3>
                <button 
                  onClick={() => setShowAddModal(false)} 
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300"
                >
                  <X size={20} className="text-white" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white font-medium mb-2">Full Name</label>
                  <input
                    type="text"
                    value={newBooking.name}
                    onChange={(e) => setNewBooking({...newBooking, name: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm"
                    placeholder="Enter full name"
                  />
                </div>
                
                <div>
                  <label className="block text-white font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={newBooking.email}
                    onChange={(e) => setNewBooking({...newBooking, email: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm"
                    placeholder="email@example.com"
                  />
                </div>
                
                <div>
                  <label className="block text-white font-medium mb-2">Phone</label>
                  <input
                    type="tel"
                    value={newBooking.phone}
                    onChange={(e) => setNewBooking({...newBooking, phone: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm"
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
                
                <div>
                  <label className="block text-white font-medium mb-2">Test</label>
                  <select
                    value={newBooking.test}
                    onChange={(e) => setNewBooking({...newBooking, test: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm"
                  >
                    <option value="" className="bg-gray-800">Select test</option>
                    <option value="Complete Blood Count" className="bg-gray-800">Complete Blood Count</option>
                    <option value="Lipid Profile" className="bg-gray-800">Lipid Profile</option>
                    <option value="Diabetes Panel" className="bg-gray-800">Diabetes Panel</option>
                    <option value="Thyroid Function" className="bg-gray-800">Thyroid Function</option>
                    <option value="Full Body Checkup" className="bg-gray-800">Full Body Checkup</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-white font-medium mb-2">Date</label>
                  <input
                    type="date"
                    value={newBooking.date}
                    onChange={(e) => setNewBooking({...newBooking, date: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-white font-medium mb-2">Time</label>
                  <input
                    type="time"
                    value={newBooking.time}
                    onChange={(e) => setNewBooking({...newBooking, time: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-white font-medium mb-2">Age</label>
                  <input
                    type="number"
                    value={newBooking.age}
                    onChange={(e) => setNewBooking({...newBooking, age: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm"
                    placeholder="Age"
                  />
                </div>
                
                <div>
                  <label className="block text-white font-medium mb-2">Gender</label>
                  <select
                    value={newBooking.gender}
                    onChange={(e) => setNewBooking({...newBooking, gender: e.target.value})}
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
                    value={newBooking.address}
                    onChange={(e) => setNewBooking({...newBooking, address: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm resize-none"
                    rows="3"
                    placeholder="Enter full address"
                  ></textarea>
                </div>
              </div>
              
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-medium transition-all duration-300 border border-white/20"
                >
                  Cancel
                </button>
                <button
                  onClick={addNewBooking}
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-600 text-white py-3 rounded-xl font-medium hover:from-cyan-600 hover:to-purple-700 transition-all duration-300 shadow-lg"
                >
                  Add Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}