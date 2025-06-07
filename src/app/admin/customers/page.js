'use client';

import { useState } from 'react';
import { 
  Users, User, Search, Filter, Eye, Edit, Trash2, Phone, Mail, 
  Calendar, MapPin, Activity, Star, Plus, Download, Upload, 
  TrendingUp, Clock, CheckCircle, X
} from 'lucide-react';
import StatCard from '../components/StatCard';
import Modal, { ConfirmModal } from '../components/Modal';

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGender, setFilterGender] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [actionType, setActionType] = useState('');

  // Mock customers data
  const [customers, setCustomers] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@email.com",
      phone: "+91 98765 43210",
      age: 35,
      gender: "Male",
      address: "123 Main Street, City, State 12345",
      joinDate: "2024-01-15",
      lastVisit: "2024-06-07",
      totalBookings: 8,
      totalSpent: 2567,
      status: "active",
      favoriteTests: ["Complete Blood Count", "Lipid Profile"],
      medicalHistory: ["Diabetes", "Hypertension"],
      emergencyContact: "+91 98765 43211",
      rating: 4.8,
      notes: "Regular customer, prefers morning appointments"
    },
    {
      id: 2,
      name: "Sarah Wilson",
      email: "sarah.wilson@email.com",
      phone: "+91 98765 43220",
      age: 42,
      gender: "Female",
      address: "456 Oak Avenue, Town, State 67890",
      joinDate: "2024-02-20",
      lastVisit: "2024-06-05",
      totalBookings: 12,
      totalSpent: 4235,
      status: "active",
      favoriteTests: ["Thyroid Function", "Vitamin D"],
      medicalHistory: ["Thyroid Issues"],
      emergencyContact: "+91 98765 43221",
      rating: 4.9,
      notes: "VIP customer, family package subscriber"
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike.johnson@email.com",
      phone: "+91 98765 43230",
      age: 28,
      gender: "Male",
      address: "789 Pine Road, Village, State 11111",
      joinDate: "2024-03-10",
      lastVisit: "2024-05-20",
      totalBookings: 5,
      totalSpent: 1450,
      status: "inactive",
      favoriteTests: ["Diabetes Panel"],
      medicalHistory: ["None"],
      emergencyContact: "+91 98765 43231",
      rating: 4.5,
      notes: "Young professional, weekend appointments preferred"
    },
    {
      id: 4,
      name: "Emma Brown",
      email: "emma.brown@email.com",
      phone: "+91 98765 43240",
      age: 38,
      gender: "Female",
      address: "321 Elm Street, Metro, State 22222",
      joinDate: "2024-04-05",
      lastVisit: "2024-06-08",
      totalBookings: 6,
      totalSpent: 1890,
      status: "active",
      favoriteTests: ["Full Body Checkup"],
      medicalHistory: ["Allergies"],
      emergencyContact: "+91 98765 43241",
      rating: 4.7,
      notes: "Requires detailed reports, health conscious"
    },
    {
      id: 5,
      name: "David Lee",
      email: "david.lee@email.com",
      phone: "+91 98765 43250",
      age: 55,
      gender: "Male",
      address: "654 Maple Drive, Suburb, State 33333",
      joinDate: "2023-12-01",
      lastVisit: "2024-06-06",
      totalBookings: 15,
      totalSpent: 6780,
      status: "vip",
      favoriteTests: ["Cardiac Tests", "Liver Function"],
      medicalHistory: ["Heart Disease", "High Cholesterol"],
      emergencyContact: "+91 98765 43251",
      rating: 5.0,
      notes: "Senior citizen, needs assistance with digital reports"
    }
  ]);

  const [newCustomer, setNewCustomer] = useState({
    name: '', email: '', phone: '', age: '', gender: '', address: '', 
    emergencyContact: '', medicalHistory: '', notes: ''
  });

  // Stats
  const stats = [
    {
      title: "Total Customers",
      value: customers.length.toString(),
      change: "+23",
      trend: "up",
      icon: Users,
      color: "from-blue-500 to-indigo-600",
      description: "Registered customers"
    },
    {
      title: "Active Customers",
      value: customers.filter(c => c.status === 'active').length.toString(),
      change: "+12",
      trend: "up",
      icon: Activity,
      color: "from-green-500 to-emerald-600",
      description: "Active this month"
    },
    {
      title: "VIP Customers",
      value: customers.filter(c => c.status === 'vip').length.toString(),
      change: "+2",
      trend: "up",
      icon: Star,
      color: "from-purple-500 to-pink-600",
      description: "Premium members"
    },
    {
      title: "Avg. Rating",
      value: (customers.reduce((sum, c) => sum + c.rating, 0) / customers.length).toFixed(1),
      change: "+0.2",
      trend: "up",
      icon: TrendingUp,
      color: "from-orange-500 to-red-600",
      description: "Customer satisfaction"
    }
  ];

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone.includes(searchTerm);
    const matchesGender = filterGender === 'all' || customer.gender.toLowerCase() === filterGender;
    const matchesStatus = filterStatus === 'all' || customer.status === filterStatus;
    return matchesSearch && matchesGender && matchesStatus;
  });

  const deleteCustomer = (id) => {
    setCustomers(customers.filter(customer => customer.id !== id));
  };

  const addNewCustomer = () => {
    if (newCustomer.name && newCustomer.email && newCustomer.phone) {
      const customer = {
        id: customers.length + 1,
        ...newCustomer,
        age: parseInt(newCustomer.age),
        joinDate: new Date().toISOString().split('T')[0],
        lastVisit: null,
        totalBookings: 0,
        totalSpent: 0,
        status: 'active',
        favoriteTests: [],
        medicalHistory: newCustomer.medicalHistory.split(',').map(h => h.trim()).filter(h => h),
        rating: 0
      };
      setCustomers([...customers, customer]);
      setNewCustomer({
        name: '', email: '', phone: '', age: '', gender: '', address: '', 
        emergencyContact: '', medicalHistory: '', notes: ''
      });
      setShowAddModal(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'inactive': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'vip': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getRatingStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-400'}`} />
    ));
  };

  const handleAction = (customer, action) => {
    setSelectedCustomer(customer);
    setActionType(action);
    if (action === 'delete') {
      setShowConfirmModal(true);
    } else if (action === 'view') {
      setShowModal(true);
    }
  };

  const confirmAction = () => {
    if (actionType === 'delete' && selectedCustomer) {
      deleteCustomer(selectedCustomer.id);
    }
    setShowConfirmModal(false);
    setSelectedCustomer(null);
    setActionType('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Customer Management</h2>
          <p className="text-white/60">Manage customer database and relationships</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => alert('Import functionality')}
            className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl transition-all duration-300 flex items-center gap-2 border border-white/20 hover:border-white/30"
          >
            <Upload className="w-4 h-4" />
            Import
          </button>
          <button 
            onClick={() => alert('Export functionality')}
            className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl transition-all duration-300 flex items-center gap-2 border border-white/20 hover:border-white/30"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl"
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
              onChange={(e) => setFilterGender(e.target.value)}
              className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm min-w-[150px]"
            >
              <option value="all" className="bg-gray-800">All Genders</option>
              <option value="male" className="bg-gray-800">Male</option>
              <option value="female" className="bg-gray-800">Female</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
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
              {filteredCustomers.map((customer, index) => (
                <tr key={customer.id} className="border-t border-white/10 hover:bg-white/5 transition-all duration-300 animate-fade-in group" style={{ animationDelay: `${index * 0.05}s` }}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                        {customer.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="text-white font-medium group-hover:text-blue-400 transition-colors duration-300">
                          {customer.name}
                        </div>
                        <div className="text-white/60 text-sm">{customer.email}</div>
                        <div className="flex items-center gap-1 mt-1">
                          {getRatingStars(customer.rating)}
                          <span className="text-white/60 text-xs ml-1">({customer.rating})</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-white/70 text-sm">
                        <Phone className="w-4 h-4 text-blue-400" />
                        {customer.phone}
                      </div>
                      <div className="flex items-center gap-2 text-white/70 text-sm">
                        <Mail className="w-4 h-4 text-blue-400" />
                        {customer.email}
                      </div>
                      <div className="flex items-center gap-2 text-white/70 text-sm">
                        <MapPin className="w-4 h-4 text-blue-400" />
                        {customer.address.split(',')[0]}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-white font-medium">{customer.age} years</div>
                    <div className="text-white/60 text-sm">{customer.gender}</div>
                    <div className="text-white/60 text-sm flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Joined {new Date(customer.joinDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-white font-bold">{customer.totalBookings} bookings</div>
                    <div className="text-green-400 font-medium">₹{customer.totalSpent.toLocaleString()}</div>
                    <div className="text-white/60 text-sm flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {customer.lastVisit ? `Last: ${new Date(customer.lastVisit).toLocaleDateString()}` : 'Never visited'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`px-3 py-2 rounded-lg text-xs font-medium border text-center ${getStatusColor(customer.status)}`}>
                      {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleAction(customer, 'view')}
                        className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-all duration-300 hover:scale-110"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-all duration-300 hover:scale-110"
                        title="Edit Customer"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleAction(customer, 'delete')}
                        className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all duration-300 hover:scale-110"
                        title="Delete Customer"
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
                  <div className="text-white font-medium text-lg">{selectedCustomer.name}</div>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-white/60 text-sm mb-1">Contact Information</div>
                  <div className="text-white font-medium">{selectedCustomer.phone}</div>
                  <div className="text-white/80 text-sm">{selectedCustomer.email}</div>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-white/60 text-sm mb-1">Demographics</div>
                  <div className="text-white font-medium">{selectedCustomer.age} years, {selectedCustomer.gender}</div>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-white/60 text-sm mb-1">Emergency Contact</div>
                  <div className="text-white font-medium">{selectedCustomer.emergencyContact}</div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-white/60 text-sm mb-1">Customer Status</div>
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedCustomer.status)}`}>
                    {selectedCustomer.status.charAt(0).toUpperCase() + selectedCustomer.status.slice(1)}
                  </div>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-white/60 text-sm mb-1">Activity Stats</div>
                  <div className="text-white font-bold text-lg">{selectedCustomer.totalBookings} Bookings</div>
                  <div className="text-green-400 font-medium">₹{selectedCustomer.totalSpent.toLocaleString()} Spent</div>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-white/60 text-sm mb-1">Customer Rating</div>
                  <div className="flex items-center gap-2">
                    {getRatingStars(selectedCustomer.rating)}
                    <span className="text-white font-medium ml-2">{selectedCustomer.rating}/5</span>
                  </div>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-white/60 text-sm mb-1">Member Since</div>
                  <div className="text-white font-medium">{new Date(selectedCustomer.joinDate).toLocaleDateString()}</div>
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
              <div className="text-white">{selectedCustomer.address}</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="text-white/60 text-sm mb-2">Favorite Tests</div>
                <div className="space-y-1">
                  {selectedCustomer.favoriteTests.map((test, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-400" />
                      <span className="text-white text-sm">{test}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="text-white/60 text-sm mb-2">Medical History</div>
                <div className="space-y-1">
                  {selectedCustomer.medicalHistory.map((condition, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-red-400" />
                      <span className="text-white text-sm">{condition}</span>
                    </div>
                  ))}
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
              <label className="block text-white font-medium mb-2">Full Name</label>
              <input
                type="text"
                value={newCustomer.name}
                onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
                placeholder="Enter full name"
              />
            </div>
            
            <div>
              <label className="block text-white font-medium mb-2">Email</label>
              <input
                type="email"
                value={newCustomer.email}
                onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
                placeholder="email@example.com"
              />
            </div>
            
            <div>
              <label className="block text-white font-medium mb-2">Phone</label>
              <input
                type="tel"
                value={newCustomer.phone}
                onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
                placeholder="+91 XXXXX XXXXX"
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
            >
              Cancel
            </button>
            <button
              onClick={addNewCustomer}
              className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-xl font-medium hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg"
            >
              Add Customer
            </button>
          </div>
        </div>
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