'use client';

import { useState } from 'react';
import { 
  TestTube, Plus, Search, Filter, Edit, Trash2, Eye, Power, 
  DollarSign, Clock, Tag, CheckCircle, X, Save, Upload, Download,
  Star, TrendingUp, Activity, BarChart3
} from 'lucide-react';
import StatCard from '../components/StatCard';
import Modal, { ConfirmModal } from '../components/Modal';

export default function TestsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedTest, setSelectedTest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [actionType, setActionType] = useState('');
  const [editingTest, setEditingTest] = useState(null);

  // Mock tests data
  const [tests, setTests] = useState([
    {
      id: 1,
      name: "Complete Blood Count (CBC)",
      category: "Blood Tests",
      price: 299,
      originalPrice: 499,
      duration: "15 mins",
      description: "Comprehensive blood analysis including RBC, WBC, platelets, and hemoglobin levels",
      active: true,
      popularity: 95,
      bookings: 1234,
      revenue: 368766,
      lastUpdated: "2024-06-01",
      requirements: ["No fasting required"],
      includes: ["RBC Count", "WBC Count", "Platelet Count", "Hemoglobin", "Hematocrit"],
      reportTime: "Same day",
      preparationTime: "No preparation needed",
      sampleType: "Blood",
      testCode: "CBC001"
    },
    {
      id: 2,
      name: "Lipid Profile",
      category: "Blood Tests",
      price: 499,
      originalPrice: 799,
      duration: "20 mins",
      description: "Cholesterol and triglyceride levels assessment for heart health monitoring",
      active: true,
      popularity: 87,
      bookings: 856,
      revenue: 427144,
      lastUpdated: "2024-05-28",
      requirements: ["12-hour fasting required"],
      includes: ["Total Cholesterol", "HDL", "LDL", "Triglycerides", "VLDL"],
      reportTime: "Same day",
      preparationTime: "12 hours fasting",
      sampleType: "Blood",
      testCode: "LP001"
    },
    {
      id: 3,
      name: "Diabetes Panel",
      category: "Blood Tests",
      price: 599,
      originalPrice: 899,
      duration: "25 mins",
      description: "HbA1c, fasting glucose, and post-meal glucose testing",
      active: true,
      popularity: 92,
      bookings: 743,
      revenue: 445057,
      lastUpdated: "2024-06-03",
      requirements: ["8-hour fasting required"],
      includes: ["HbA1c", "Fasting Glucose", "Random Glucose", "Insulin Level"],
      reportTime: "Same day",
      preparationTime: "8 hours fasting",
      sampleType: "Blood",
      testCode: "DM001"
    },
    {
      id: 4,
      name: "Thyroid Function Test",
      category: "Hormone Tests",
      price: 699,
      originalPrice: 999,
      duration: "20 mins",
      description: "TSH, T3, T4 levels to assess thyroid gland function",
      active: true,
      popularity: 78,
      bookings: 567,
      revenue: 396333,
      lastUpdated: "2024-05-30",
      requirements: ["No special preparation"],
      includes: ["TSH", "T3", "T4", "Free T3", "Free T4"],
      reportTime: "Next day",
      preparationTime: "No preparation needed",
      sampleType: "Blood",
      testCode: "TFT001"
    },
    {
      id: 5,
      name: "Liver Function Test",
      category: "Organ Tests",
      price: 549,
      originalPrice: 799,
      duration: "20 mins",
      description: "ALT, AST, bilirubin levels to evaluate liver health",
      active: false,
      popularity: 65,
      bookings: 234,
      revenue: 128466,
      lastUpdated: "2024-05-25",
      requirements: ["No alcohol 24hrs prior"],
      includes: ["ALT", "AST", "Bilirubin", "ALP", "GGT"],
      reportTime: "Same day",
      preparationTime: "No alcohol 24hrs prior",
      sampleType: "Blood",
      testCode: "LFT001"
    },
    {
      id: 6,
      name: "Kidney Function Test",
      category: "Organ Tests",
      price: 449,
      originalPrice: 699,
      duration: "15 mins",
      description: "Creatinine, BUN, and eGFR to assess kidney health",
      active: true,
      popularity: 71,
      bookings: 445,
      revenue: 199805,
      lastUpdated: "2024-06-02",
      requirements: ["No special preparation"],
      includes: ["Creatinine", "BUN", "eGFR", "Uric Acid"],
      reportTime: "Same day",
      preparationTime: "No preparation needed",
      sampleType: "Blood",
      testCode: "KFT001"
    },
    {
      id: 7,
      name: "Vitamin D Test",
      category: "Vitamin Tests",
      price: 899,
      originalPrice: 1299,
      duration: "15 mins",
      description: "25-hydroxyvitamin D levels for bone health assessment",
      active: true,
      popularity: 83,
      bookings: 378,
      revenue: 339822,
      lastUpdated: "2024-06-01",
      requirements: ["No fasting required"],
      includes: ["25(OH) Vitamin D", "Vitamin D2", "Vitamin D3"],
      reportTime: "Next day",
      preparationTime: "No preparation needed",
      sampleType: "Blood",
      testCode: "VD001"
    },
    {
      id: 8,
      name: "Full Body Checkup",
      category: "Packages",
      price: 2999,
      originalPrice: 4999,
      duration: "60 mins",
      description: "Comprehensive health screening with 75+ parameters",
      active: true,
      popularity: 89,
      bookings: 289,
      revenue: 866711,
      lastUpdated: "2024-06-04",
      requirements: ["12-hour fasting required"],
      includes: ["CBC", "Lipid Profile", "LFT", "KFT", "TFT", "Diabetes Panel", "Urine Analysis", "ECG"],
      reportTime: "Next day",
      preparationTime: "12 hours fasting",
      sampleType: "Blood, Urine",
      testCode: "FBC001"
    }
  ]);

  const [newTest, setNewTest] = useState({
    name: '',
    category: '',
    price: '',
    originalPrice: '',
    duration: '',
    description: '',
    requirements: '',
    includes: '',
    reportTime: 'Same day',
    preparationTime: '',
    sampleType: '',
    testCode: ''
  });

  // Categories
  const categories = [
    'Blood Tests',
    'Hormone Tests',
    'Organ Tests',
    'Vitamin Tests',
    'Cardiac Tests',
    'Packages',
    'Allergy Tests',
    'Cancer Markers'
  ];

  // Stats
  const stats = [
    {
      title: "Total Tests",
      value: tests.length.toString(),
      change: "+2",
      trend: "up",
      icon: TestTube,
      color: "from-cyan-500 to-blue-600",
      description: "Available test types"
    },
    {
      title: "Active Tests",
      value: tests.filter(t => t.active).length.toString(),
      change: "+1",
      trend: "up",
      icon: CheckCircle,
      color: "from-green-500 to-emerald-600",
      description: "Currently active"
    },
    {
      title: "Total Revenue",
      value: `₹${(tests.reduce((sum, test) => sum + test.revenue, 0) / 100000).toFixed(1)}L`,
      change: "+15%",
      trend: "up",
      icon: DollarSign,
      color: "from-purple-500 to-pink-600",
      description: "From all tests"
    },
    {
      title: "Avg. Popularity",
      value: `${Math.round(tests.reduce((sum, test) => sum + test.popularity, 0) / tests.length)}%`,
      change: "+5%",
      trend: "up",
      icon: TrendingUp,
      color: "from-orange-500 to-red-600",
      description: "Average test popularity"
    }
  ];

  const filteredTests = tests.filter(test => {
    const matchesSearch = test.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         test.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         test.testCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || test.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && test.active) ||
                         (filterStatus === 'inactive' && !test.active);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const toggleTestStatus = (id) => {
    setTests(tests.map(test => 
      test.id === id ? { ...test, active: !test.active } : test
    ));
  };

  const deleteTest = (id) => {
    setTests(tests.filter(test => test.id !== id));
  };

  const addNewTest = () => {
    if (newTest.name && newTest.category && newTest.price && newTest.duration) {
      const test = {
        id: tests.length + 1,
        ...newTest,
        price: parseFloat(newTest.price),
        originalPrice: parseFloat(newTest.originalPrice || newTest.price),
        active: true,
        popularity: 0,
        bookings: 0,
        revenue: 0,
        lastUpdated: new Date().toISOString().split('T')[0],
        requirements: newTest.requirements.split(',').map(r => r.trim()).filter(r => r),
        includes: newTest.includes.split(',').map(i => i.trim()).filter(i => i)
      };
      setTests([...tests, test]);
      setNewTest({
        name: '', category: '', price: '', originalPrice: '', duration: '',
        description: '', requirements: '', includes: '', reportTime: 'Same day',
        preparationTime: '', sampleType: '', testCode: ''
      });
      setShowAddModal(false);
    }
  };

  const updateTest = () => {
    if (editingTest && editingTest.name && editingTest.category && editingTest.price && editingTest.duration) {
      setTests(tests.map(test => 
        test.id === editingTest.id 
          ? {
              ...editingTest,
              price: parseFloat(editingTest.price),
              originalPrice: parseFloat(editingTest.originalPrice || editingTest.price),
              lastUpdated: new Date().toISOString().split('T')[0],
              requirements: typeof editingTest.requirements === 'string' 
                ? editingTest.requirements.split(',').map(r => r.trim()).filter(r => r)
                : editingTest.requirements,
              includes: typeof editingTest.includes === 'string'
                ? editingTest.includes.split(',').map(i => i.trim()).filter(i => i)
                : editingTest.includes
            }
          : test
      ));
      setShowEditModal(false);
      setEditingTest(null);
    }
  };

  const handleAction = (test, action) => {
    setSelectedTest(test);
    setActionType(action);
    if (action === 'delete') {
      setShowConfirmModal(true);
    } else if (action === 'view') {
      setShowModal(true);
    } else if (action === 'edit') {
      setEditingTest({
        ...test,
        requirements: Array.isArray(test.requirements) ? test.requirements.join(', ') : test.requirements,
        includes: Array.isArray(test.includes) ? test.includes.join(', ') : test.includes
      });
      setShowEditModal(true);
    } else if (action === 'toggle') {
      toggleTestStatus(test.id);
    }
  };

  const confirmAction = () => {
    if (actionType === 'delete' && selectedTest) {
      deleteTest(selectedTest.id);
    }
    setShowConfirmModal(false);
    setSelectedTest(null);
    setActionType('');
  };

  const getPopularityColor = (popularity) => {
    if (popularity >= 90) return 'text-green-400';
    if (popularity >= 70) return 'text-yellow-400';
    if (popularity >= 50) return 'text-orange-400';
    return 'text-red-400';
  };

  const exportTests = () => {
    const dataStr = JSON.stringify(tests, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'kriday-tests.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Tests Management</h2>
          <p className="text-white/60">Configure and manage all diagnostic tests</p>
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
            onClick={exportTests}
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
            Add Test
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
              placeholder="Search tests by name, description, or test code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm transition-all duration-300"
            />
          </div>
          <div className="flex gap-4">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm min-w-[150px]"
            >
              <option value="all" className="bg-gray-800">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category} className="bg-gray-800">{category}</option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm min-w-[150px]"
            >
              <option value="all" className="bg-gray-800">All Status</option>
              <option value="active" className="bg-gray-800">Active</option>
              <option value="inactive" className="bg-gray-800">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTests.map((test, index) => (
          <div 
            key={test.id} 
            className="bg-white/5 backdrop-blur-2xl rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 animate-fade-in group"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <TestTube className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-cyan-400 text-xs font-medium bg-cyan-400/10 px-2 py-1 rounded-full">
                    {test.category}
                  </div>
                  <div className="text-white/60 text-xs mt-1">#{test.testCode}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  test.active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {test.active ? 'Active' : 'Inactive'}
                </div>
              </div>
            </div>

            {/* Test Info */}
            <div className="mb-4">
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors duration-300">
                {test.name}
              </h3>
              <p className="text-white/60 text-sm line-clamp-2 mb-3">{test.description}</p>
              
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-white">₹{test.price}</span>
                  {test.originalPrice > test.price && (
                    <span className="text-white/50 line-through text-sm">₹{test.originalPrice}</span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-white/60 text-sm">
                  <Clock className="w-4 h-4" />
                  {test.duration}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-white/60 mb-3">
                <span>Sample: {test.sampleType}</span>
                <span>Report: {test.reportTime}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-white/5 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-white">{test.bookings}</div>
                <div className="text-white/60 text-xs">Bookings</div>
              </div>
              <div className="bg-white/5 rounded-lg p-3 text-center">
                <div className={`text-lg font-bold ${getPopularityColor(test.popularity)}`}>
                  {test.popularity}%
                </div>
                <div className="text-white/60 text-xs">Popular</div>
              </div>
              <div className="bg-white/5 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-white">₹{(test.revenue / 1000).toFixed(0)}k</div>
                <div className="text-white/60 text-xs">Revenue</div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button 
                onClick={() => handleAction(test, 'view')}
                className="flex-1 bg-cyan-500/20 text-cyan-400 py-2 rounded-lg hover:bg-cyan-500/30 transition-all duration-300 text-sm font-medium hover:scale-105 flex items-center justify-center gap-1"
              >
                <Eye className="w-4 h-4" />
                View
              </button>
              <button 
                onClick={() => handleAction(test, 'edit')}
                className="flex-1 bg-purple-500/20 text-purple-400 py-2 rounded-lg hover:bg-purple-500/30 transition-all duration-300 text-sm font-medium hover:scale-105 flex items-center justify-center gap-1"
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
              <button 
                onClick={() => handleAction(test, 'toggle')}
                className={`flex-1 py-2 rounded-lg transition-all duration-300 text-sm font-medium hover:scale-105 flex items-center justify-center gap-1 ${
                  test.active 
                    ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                    : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                }`}
              >
                <Power className="w-4 h-4" />
                {test.active ? 'Disable' : 'Enable'}
              </button>
              <button 
                onClick={() => handleAction(test, 'delete')}
                className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all duration-300 hover:scale-110"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredTests.length === 0 && (
        <div className="bg-white/5 backdrop-blur-2xl rounded-2xl p-12 border border-white/10 text-center">
          <TestTube className="w-16 h-16 text-white/50 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No Tests Found</h3>
          <p className="text-white/60">No tests match your current filters.</p>
        </div>
      )}

      {/* Test Details Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Test Details"
        size="lg"
      >
        {selectedTest && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-white/60 text-sm mb-1">Test Name</div>
                  <div className="text-white font-medium text-lg">{selectedTest.name}</div>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-white/60 text-sm mb-1">Test Code</div>
                  <div className="text-white font-medium">{selectedTest.testCode}</div>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-white/60 text-sm mb-1">Category</div>
                  <div className="text-white font-medium">{selectedTest.category}</div>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-white/60 text-sm mb-1">Price</div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-bold text-xl">₹{selectedTest.price}</span>
                    {selectedTest.originalPrice > selectedTest.price && (
                      <span className="text-white/50 line-through">₹{selectedTest.originalPrice}</span>
                    )}
                  </div>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-white/60 text-sm mb-1">Duration & Sample</div>
                  <div className="text-white font-medium">{selectedTest.duration}</div>
                  <div className="text-white/80 text-sm">{selectedTest.sampleType}</div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-white/60 text-sm mb-1">Status</div>
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    selectedTest.active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {selectedTest.active ? 'Active' : 'Inactive'}
                  </div>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-white/60 text-sm mb-1">Popularity</div>
                  <div className={`text-white font-bold text-xl ${getPopularityColor(selectedTest.popularity)}`}>
                    {selectedTest.popularity}%
                  </div>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-white/60 text-sm mb-1">Total Bookings</div>
                  <div className="text-white font-bold text-xl">{selectedTest.bookings}</div>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-white/60 text-sm mb-1">Revenue Generated</div>
                  <div className="text-white font-bold text-xl">₹{selectedTest.revenue.toLocaleString()}</div>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-white/60 text-sm mb-1">Report Time</div>
                  <div className="text-white font-medium">{selectedTest.reportTime}</div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="text-white/60 text-sm mb-2">Description</div>
              <div className="text-white">{selectedTest.description}</div>
            </div>

            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="text-white/60 text-sm mb-2">Preparation Instructions</div>
              <div className="text-white">{selectedTest.preparationTime}</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="text-white/60 text-sm mb-2">Requirements</div>
                <ul className="text-white space-y-1">
                  {selectedTest.requirements.map((req, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="text-white/60 text-sm mb-2">Test Includes</div>
                <ul className="text-white space-y-1">
                  {selectedTest.includes.map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-cyan-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  toggleTestStatus(selectedTest.id);
                  setShowModal(false);
                }}
                className={`flex-1 py-3 rounded-xl font-medium transition-all duration-300 ${
                  selectedTest.active 
                    ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white' 
                    : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white'
                }`}
              >
                {selectedTest.active ? 'Disable Test' : 'Enable Test'}
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  handleAction(selectedTest, 'edit');
                }}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 text-white py-3 rounded-xl font-medium hover:from-purple-600 hover:to-pink-700 transition-all duration-300"
              >
                Edit Test
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

      {/* Add Test Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Test"
        size="lg"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white font-medium mb-2">Test Name</label>
              <input
                type="text"
                value={newTest.name}
                onChange={(e) => setNewTest({...newTest, name: e.target.value})}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm"
                placeholder="Enter test name"
              />
            </div>
            
            <div>
              <label className="block text-white font-medium mb-2">Test Code</label>
              <input
                type="text"
                value={newTest.testCode}
                onChange={(e) => setNewTest({...newTest, testCode: e.target.value})}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm"
                placeholder="e.g., CBC001"
              />
            </div>
            
            <div>
              <label className="block text-white font-medium mb-2">Category</label>
              <select
                value={newTest.category}
                onChange={(e) => setNewTest({...newTest, category: e.target.value})}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm"
              >
                <option value="" className="bg-gray-800">Select category</option>
                {categories.map(category => (
                  <option key={category} value={category} className="bg-gray-800">{category}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-white font-medium mb-2">Sample Type</label>
              <input
                type="text"
                value={newTest.sampleType}
                onChange={(e) => setNewTest({...newTest, sampleType: e.target.value})}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm"
                placeholder="e.g., Blood, Urine"
              />
            </div>
            
            <div>
              <label className="block text-white font-medium mb-2">Price (₹)</label>
              <input
                type="number"
                value={newTest.price}
                onChange={(e) => setNewTest({...newTest, price: e.target.value})}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm"
                placeholder="299"
              />
            </div>
            
            <div>
              <label className="block text-white font-medium mb-2">Original Price (₹)</label>
              <input
                type="number"
                value={newTest.originalPrice}
                onChange={(e) => setNewTest({...newTest, originalPrice: e.target.value})}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm"
                placeholder="499"
              />
            </div>
            
            <div>
              <label className="block text-white font-medium mb-2">Duration</label>
              <input
                type="text"
                value={newTest.duration}
                onChange={(e) => setNewTest({...newTest, duration: e.target.value})}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm"
                placeholder="15 mins"
              />
            </div>
            
            <div>
              <label className="block text-white font-medium mb-2">Report Time</label>
              <select
                value={newTest.reportTime}
                onChange={(e) => setNewTest({...newTest, reportTime: e.target.value})}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm"
              >
                <option value="Same day" className="bg-gray-800">Same day</option>
                <option value="Next day" className="bg-gray-800">Next day</option>
                <option value="2-3 days" className="bg-gray-800">2-3 days</option>
                <option value="1 week" className="bg-gray-800">1 week</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-white font-medium mb-2">Description</label>
            <textarea
              value={newTest.description}
              onChange={(e) => setNewTest({...newTest, description: e.target.value})}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm resize-none"
              rows="3"
              placeholder="Enter test description"
            />
          </div>
          
          <div>
            <label className="block text-white font-medium mb-2">Preparation Instructions</label>
            <input
              type="text"
              value={newTest.preparationTime}
              onChange={(e) => setNewTest({...newTest, preparationTime: e.target.value})}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm"
              placeholder="e.g., 12 hours fasting, No preparation needed"
            />
          </div>
          
          <div>
            <label className="block text-white font-medium mb-2">Requirements (comma separated)</label>
            <input
              type="text"
              value={newTest.requirements}
              onChange={(e) => setNewTest({...newTest, requirements: e.target.value})}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm"
              placeholder="No fasting required, Avoid alcohol 24hrs prior"
            />
          </div>
          
          <div>
            <label className="block text-white font-medium mb-2">Test Includes (comma separated)</label>
            <input
              type="text"
              value={newTest.includes}
              onChange={(e) => setNewTest({...newTest, includes: e.target.value})}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm"
              placeholder="RBC Count, WBC Count, Platelet Count"
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
              onClick={addNewTest}
              className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-600 text-white py-3 rounded-xl font-medium hover:from-cyan-600 hover:to-purple-700 transition-all duration-300 shadow-lg"
            >
              Add Test
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Test Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Test"
        size="lg"
      >
        {editingTest && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white font-medium mb-2">Test Name</label>
                <input
                  type="text"
                  value={editingTest.name}
                  onChange={(e) => setEditingTest({...editingTest, name: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm"
                />
              </div>
              
              <div>
                <label className="block text-white font-medium mb-2">Test Code</label>
                <input
                  type="text"
                  value={editingTest.testCode}
                  onChange={(e) => setEditingTest({...editingTest, testCode: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm"
                />
              </div>
              
              <div>
                <label className="block text-white font-medium mb-2">Category</label>
                <select
                  value={editingTest.category}
                  onChange={(e) => setEditingTest({...editingTest, category: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm"
                >
                  {categories.map(category => (
                    <option key={category} value={category} className="bg-gray-800">{category}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-white font-medium mb-2">Sample Type</label>
                <input
                  type="text"
                  value={editingTest.sampleType}
                  onChange={(e) => setEditingTest({...editingTest, sampleType: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm"
                />
              </div>
              
              <div>
                <label className="block text-white font-medium mb-2">Price (₹)</label>
                <input
                  type="number"
                  value={editingTest.price}
                  onChange={(e) => setEditingTest({...editingTest, price: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm"
                />
              </div>
              
              <div>
                <label className="block text-white font-medium mb-2">Original Price (₹)</label>
                <input
                  type="number"
                  value={editingTest.originalPrice}
                  onChange={(e) => setEditingTest({...editingTest, originalPrice: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm"
                />
              </div>
              
              <div>
                <label className="block text-white font-medium mb-2">Duration</label>
                <input
                  type="text"
                  value={editingTest.duration}
                  onChange={(e) => setEditingTest({...editingTest, duration: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm"
                />
              </div>
              
              <div>
                <label className="block text-white font-medium mb-2">Report Time</label>
                <select
                  value={editingTest.reportTime}
                  onChange={(e) => setEditingTest({...editingTest, reportTime: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm"
                >
                  <option value="Same day" className="bg-gray-800">Same day</option>
                  <option value="Next day" className="bg-gray-800">Next day</option>
                  <option value="2-3 days" className="bg-gray-800">2-3 days</option>
                  <option value="1 week" className="bg-gray-800">1 week</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-white font-medium mb-2">Description</label>
              <textarea
                value={editingTest.description}
                onChange={(e) => setEditingTest({...editingTest, description: e.target.value})}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm resize-none"
                rows="3"
              />
            </div>
            
            <div>
              <label className="block text-white font-medium mb-2">Preparation Instructions</label>
              <input
                type="text"
                value={editingTest.preparationTime}
                onChange={(e) => setEditingTest({...editingTest, preparationTime: e.target.value})}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm"
              />
            </div>
            
            <div>
              <label className="block text-white font-medium mb-2">Requirements (comma separated)</label>
              <input
                type="text"
                value={editingTest.requirements}
                onChange={(e) => setEditingTest({...editingTest, requirements: e.target.value})}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm"
              />
            </div>
            
            <div>
              <label className="block text-white font-medium mb-2">Test Includes (comma separated)</label>
              <input
                type="text"
                value={editingTest.includes}
                onChange={(e) => setEditingTest({...editingTest, includes: e.target.value})}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm"
              />
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-medium transition-all duration-300 border border-white/20"
              >
                Cancel
              </button>
              <button
                onClick={updateTest}
                className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-600 text-white py-3 rounded-xl font-medium hover:from-cyan-600 hover:to-purple-700 transition-all duration-300 shadow-lg"
              >
                Update Test
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
        title="Delete Test"
        message={`Are you sure you want to delete "${selectedTest?.name}"? This action cannot be undone and will affect all related bookings.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
}