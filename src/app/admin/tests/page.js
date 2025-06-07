'use client';

import { useState, useEffect } from 'react';
import { 
  TestTube, Plus, Search, Filter, Edit, Trash2, Eye, Power, 
  DollarSign, Clock, Tag, CheckCircle, X, Save, Upload, Download,
  Star, TrendingUp, Activity, BarChart3, Loader2, AlertCircle
} from 'lucide-react';
import StatCard from '../components/StatCard';
import Modal, { ConfirmModal } from '../components/Modal';
import { testsApi, withErrorHandling } from '@/lib/api';

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
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [tests, setTests] = useState([]);
  
  // Categories - keeping default set as fallback
  const [categories] = useState([
    'Blood Tests',
    'Hormone Tests',
    'Organ Tests',
    'Vitamin Tests',
    'Cardiac Tests',
    'Packages',
    'Allergy Tests',
    'Cancer Markers'
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

  // Load initial data
  useEffect(() => {
    loadTests();
  }, []);

  // Load tests from API
  const loadTests = async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await withErrorHandling(testsApi.getAll)(filters);

      console.log("all tests",result)
      
      if (result.success) {
        setTests(Array.isArray(result.data.data) ? result.data.data : []);
      } else {
        setError(result.error || 'Failed to load tests');
        console.error('Failed to load tests:', result.error);
        setTests([]); // Ensure tests is always an array
      }
    } catch (err) {
      setError('Failed to load tests');
      console.error('Error loading tests:', err);
      setTests([]); // Ensure tests is always an array
    } finally {
      setLoading(false);
    }
  };

  // Safe array check function
  const safeArray = (arr) => Array.isArray(arr) ? arr : [];

  // Computed stats for display
 // Computed stats for display
  const displayStats = [
    {
      title: "Total Tests",
      value: safeArray(tests).length.toString(),
      change: "+2",
      trend: "up",
      icon: TestTube,
      color: "from-cyan-500 to-blue-600",
      description: "Available test types"
    },
    {
      title: "Active Tests",
      value: safeArray(tests).filter(t => t?.active).length.toString(),
      change: "+1",
      trend: "up",
      icon: CheckCircle,
      color: "from-green-500 to-emerald-600",
      description: "Currently active"
    },
    {
      title: "Total Revenue",
      value: (() => {
        const totalRevenue = safeArray(tests).reduce((sum, test) => {
          // Use the revenue field if it exists, otherwise calculate from bookings * price
          const testRevenue = test?.revenue || ((test?.bookings || 0) * (test?.price || 0));
          return sum + testRevenue;
        }, 0);
        
        // Show in different formats based on amount
        if (totalRevenue >= 100000) {
          return `₹${(totalRevenue / 100000).toFixed(1)}L`; // Lakhs
        } else if (totalRevenue >= 1000) {
          return `₹${(totalRevenue / 1000).toFixed(1)}K`; // Thousands
        } else {
          return `₹${totalRevenue.toLocaleString()}`; // Regular amount
        }
      })(),
      change: "+15%",
      trend: "up",
      icon: DollarSign,
      color: "from-purple-500 to-pink-600",
      description: "From all tests"
    },
    {
      title: "Avg. Popularity",
      value: `${safeArray(tests).length > 0 ? Math.round(safeArray(tests).reduce((sum, test) => sum + (test?.popularity || 0), 0) / safeArray(tests).length) : 0}%`,
      change: "+5%",
      trend: "up",
      icon: TrendingUp,
      color: "from-orange-500 to-red-600",
      description: "Average test popularity"
    }
  ];

  // Filter tests
  const filteredTests = safeArray(tests).filter(test => {
    if (!test) return false;
    
    const matchesSearch = (test.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (test.description?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (test.testCode?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || test.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && test.active) ||
                         (filterStatus === 'inactive' && !test.active);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Toggle test status
  const toggleTestStatus = async (id) => {
    try {
      setSubmitting(true);
      const result = await withErrorHandling(testsApi.toggleStatus)(id);
      
      if (result.success) {
        // Update local state
        setTests(prevTests => 
          safeArray(prevTests).map(test => 
            test?._id === id || test?.id === id 
              ? { ...test, active: !test.active } 
              : test
          )
        );
      } else {
        setError(result.error || 'Failed to toggle test status');
      }
    } catch (err) {
      setError('Failed to toggle test status');
      console.error('Error toggling test status:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // Delete test
  const deleteTest = async (id) => {
    try {
      setSubmitting(true);
      const result = await withErrorHandling(testsApi.delete)(id);
      
      if (result.success) {
        setTests(prevTests => 
          safeArray(prevTests).filter(test => 
            test?._id !== id && test?.id !== id
          )
        );
      } else {
        setError(result.error || 'Failed to delete test');
      }
    } catch (err) {
      setError('Failed to delete test');
      console.error('Error deleting test:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // Add new test
  const addNewTest = async () => {
    if (!newTest.name || !newTest.category || !newTest.price || !newTest.duration) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      
      const testData = {
        ...newTest,
        price: parseFloat(newTest.price),
        originalPrice: parseFloat(newTest.originalPrice || newTest.price),
        requirements: newTest.requirements ? newTest.requirements.split(',').map(r => r.trim()).filter(r => r) : [],
        includes: newTest.includes ? newTest.includes.split(',').map(i => i.trim()).filter(i => i) : []
      };
      
      const result = await withErrorHandling(testsApi.create)(testData);
      
      if (result.success) {
        // Reload tests to get the new test with proper ID
        await loadTests();
        
        // Reset form
        setNewTest({
          name: '', category: '', price: '', originalPrice: '', duration: '',
          description: '', requirements: '', includes: '', reportTime: 'Same day',
          preparationTime: '', sampleType: '', testCode: ''
        });
        setShowAddModal(false);
      } else {
        setError(result.error || 'Failed to create test');
      }
    } catch (err) {
      setError('Failed to create test');
      console.error('Error creating test:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // Update test
  const updateTest = async () => {
    if (!editingTest || !editingTest.name || !editingTest.category || !editingTest.price || !editingTest.duration) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      
      const testData = {
        ...editingTest,
        price: parseFloat(editingTest.price),
        originalPrice: parseFloat(editingTest.originalPrice || editingTest.price),
        requirements: typeof editingTest.requirements === 'string' 
          ? editingTest.requirements.split(',').map(r => r.trim()).filter(r => r)
          : (editingTest.requirements || []),
        includes: typeof editingTest.includes === 'string'
          ? editingTest.includes.split(',').map(i => i.trim()).filter(i => i)
          : (editingTest.includes || [])
      };
      
      const testId = editingTest._id || editingTest.id;
      const result = await withErrorHandling(testsApi.update)(testId, testData);
      
      if (result.success) {
        // Update local state
        setTests(prevTests => 
          safeArray(prevTests).map(test => 
            (test?._id === testId || test?.id === testId) 
              ? { ...test, ...testData } 
              : test
          )
        );
        setShowEditModal(false);
        setEditingTest(null);
      } else {
        setError(result.error || 'Failed to update test');
      }
    } catch (err) {
      setError('Failed to update test');
      console.error('Error updating test:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle actions
  const handleAction = (test, action) => {
    setSelectedTest(test);
    setActionType(action);
    if (action === 'delete') {
      setShowConfirmModal(true);
    } else if (action === 'view') {
      setShowModal(true);
    } else if (action === 'edit') {
      const testId = test._id || test.id;
      setEditingTest({
        ...test,
        id: testId,
        _id: testId,
        requirements: Array.isArray(test.requirements) 
          ? test.requirements.join(', ') 
          : (test.requirements || ''),
        includes: Array.isArray(test.includes) 
          ? test.includes.join(', ') 
          : (test.includes || '')
      });
      setShowEditModal(true);
    } else if (action === 'toggle') {
      const testId = test._id || test.id;
      toggleTestStatus(testId);
    }
  };

  // Confirm action
  const confirmAction = async () => {
    if (actionType === 'delete' && selectedTest) {
      const testId = selectedTest._id || selectedTest.id;
      await deleteTest(testId);
    }
    setShowConfirmModal(false);
    setSelectedTest(null);
    setActionType('');
  };

  // Utility functions
  const getPopularityColor = (popularity) => {
    const pop = popularity || 0;
    if (pop >= 90) return 'text-green-400';
    if (pop >= 70) return 'text-yellow-400';
    if (pop >= 50) return 'text-orange-400';
    return 'text-red-400';
  };

  const exportTests = async () => {
    try {
      const dataStr = JSON.stringify(safeArray(tests), null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      const exportFileDefaultName = 'kriday-tests.json';
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    } catch (err) {
      console.error('Export failed:', err);
      setError('Failed to export tests');
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mx-auto mb-4" />
          <p className="text-white/60">Loading tests...</p>
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
          <h2 className="text-2xl font-bold text-white mb-2">Tests Management</h2>
          <p className="text-white/60">Configure and manage all diagnostic tests</p>
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
            onClick={exportTests}
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
            Add Test
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayStats.map((stat, index) => (
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
        {filteredTests.map((test, index) => {
          if (!test) return null;
          
          const testId = test._id || test.id;
          
          return (
            <div 
              key={testId} 
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
                      {test.category || 'Unknown'}
                    </div>
                    <div className="text-white/60 text-xs mt-1">#{test.testCode || 'N/A'}</div>
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
                  {test.name || 'Unnamed Test'}
                </h3>
                <p className="text-white/60 text-sm line-clamp-2 mb-3">{test.description || 'No description available'}</p>
                
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-white">₹{test.price || 0}</span>
                    {test.originalPrice && test.originalPrice > test.price && (
                      <span className="text-white/50 line-through text-sm">₹{test.originalPrice}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-white/60 text-sm">
                    <Clock className="w-4 h-4" />
                    {test.duration || 'N/A'}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-white/60 mb-3">
                  <span>Sample: {test.sampleType || 'N/A'}</span>
                  <span>Report: {test.reportTime || 'N/A'}</span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-white/5 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-white">{test.bookings || 0}</div>
                  <div className="text-white/60 text-xs">Bookings</div>
                </div>
                <div className="bg-white/5 rounded-lg p-3 text-center">
                  <div className={`text-lg font-bold ${getPopularityColor(test.popularity)}`}>
                    {test.popularity || 0}%
                  </div>
                  <div className="text-white/60 text-xs">Popular</div>
                </div>
                <div className="bg-white/5 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-white">₹{((test.revenue || 0) / 1000).toFixed(0)}k</div>
                  <div className="text-white/60 text-xs">Revenue</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button 
                  onClick={() => handleAction(test, 'view')}
                  className="flex-1 bg-cyan-500/20 text-cyan-400 py-2 rounded-lg hover:bg-cyan-500/30 transition-all duration-300 text-sm font-medium hover:scale-105 flex items-center justify-center gap-1"
                  disabled={submitting}
                >
                  <Eye className="w-4 h-4" />
                  View
                </button>
                <button 
                  onClick={() => handleAction(test, 'edit')}
                  className="flex-1 bg-purple-500/20 text-purple-400 py-2 rounded-lg hover:bg-purple-500/30 transition-all duration-300 text-sm font-medium hover:scale-105 flex items-center justify-center gap-1"
                  disabled={submitting}
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
                  disabled={submitting}
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Power className="w-4 h-4" />
                  )}
                  {test.active ? 'Disable' : 'Enable'}
                </button>
                <button 
                  onClick={() => handleAction(test, 'delete')}
                  className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all duration-300 hover:scale-110"
                  disabled={submitting}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredTests.length === 0 && !loading && (
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
                  <div className="text-white font-medium text-lg">{selectedTest.name || 'N/A'}</div>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-white/60 text-sm mb-1">Test Code</div>
                  <div className="text-white font-medium">{selectedTest.testCode || 'N/A'}</div>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-white/60 text-sm mb-1">Category</div>
                  <div className="text-white font-medium">{selectedTest.category || 'N/A'}</div>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-white/60 text-sm mb-1">Price</div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-bold text-xl">₹{selectedTest.price || 0}</span>
                    {selectedTest.originalPrice && selectedTest.originalPrice > selectedTest.price && (
                      <span className="text-white/50 line-through">₹{selectedTest.originalPrice}</span>
                    )}
                  </div>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-white/60 text-sm mb-1">Duration & Sample</div>
                  <div className="text-white font-medium">{selectedTest.duration || 'N/A'}</div>
                  <div className="text-white/80 text-sm">{selectedTest.sampleType || 'N/A'}</div>
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
                    {selectedTest.popularity || 0}%
                  </div>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-white/60 text-sm mb-1">Total Bookings</div>
                  <div className="text-white font-bold text-xl">{selectedTest.bookings || 0}</div>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-white/60 text-sm mb-1">Revenue Generated</div>
                  <div className="text-white font-bold text-xl">₹{(selectedTest.revenue || 0).toLocaleString()}</div>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-white/60 text-sm mb-1">Report Time</div>
                  <div className="text-white font-medium">{selectedTest.reportTime || 'N/A'}</div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="text-white/60 text-sm mb-2">Description</div>
              <div className="text-white">{selectedTest.description || 'No description available'}</div>
            </div>

            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="text-white/60 text-sm mb-2">Preparation Instructions</div>
              <div className="text-white">{selectedTest.preparationTime || 'No special preparation needed'}</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="text-white/60 text-sm mb-2">Requirements</div>
                <ul className="text-white space-y-1">
                  {safeArray(selectedTest.requirements).map((req, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      {req}
                    </li>
                  ))}
                  {safeArray(selectedTest.requirements).length === 0 && (
                    <li className="text-white/60 text-sm">No specific requirements</li>
                  )}
                </ul>
              </div>
              
              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="text-white/60 text-sm mb-2">Test Includes</div>
                <ul className="text-white space-y-1">
                  {safeArray(selectedTest.includes).map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-cyan-400" />
                      {item}
                    </li>
                  ))}
                  {safeArray(selectedTest.includes).length === 0 && (
                    <li className="text-white/60 text-sm">No specific inclusions listed</li>
                  )}
                </ul>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  const testId = selectedTest._id || selectedTest.id;
                  toggleTestStatus(testId);
                  setShowModal(false);
                }}
                className={`flex-1 py-3 rounded-xl font-medium transition-all duration-300 ${
                  selectedTest.active 
                    ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white' 
                    : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white'
                }`}
                disabled={submitting}
              >
                {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                ) : (
                  selectedTest.active ? 'Disable Test' : 'Enable Test'
                )}
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
              <label className="block text-white font-medium mb-2">Test Name *</label>
              <input
                type="text"
                value={newTest.name}
                onChange={(e) => setNewTest({...newTest, name: e.target.value})}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm"
                placeholder="Enter test name"
                required
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
              <label className="block text-white font-medium mb-2">Category *</label>
              <select
                value={newTest.category}
                onChange={(e) => setNewTest({...newTest, category: e.target.value})}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm"
                required
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
              <label className="block text-white font-medium mb-2">Price (₹) *</label>
              <input
                type="number"
                value={newTest.price}
                onChange={(e) => setNewTest({...newTest, price: e.target.value})}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm"
                placeholder="299"
                min="0"
                step="0.01"
                required
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
                min="0"
                step="0.01"
              />
            </div>
            
            <div>
              <label className="block text-white font-medium mb-2">Duration *</label>
              <input
                type="text"
                value={newTest.duration}
                onChange={(e) => setNewTest({...newTest, duration: e.target.value})}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm"
                placeholder="15 mins"
                required
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
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              onClick={addNewTest}
              className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-600 text-white py-3 rounded-xl font-medium hover:from-cyan-600 hover:to-purple-700 transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
              disabled={submitting}
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              {submitting ? 'Adding...' : 'Add Test'}
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
                <label className="block text-white font-medium mb-2">Test Name *</label>
                <input
                  type="text"
                  value={editingTest.name || ''}
                  onChange={(e) => setEditingTest({...editingTest, name: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm"
                  required
                />
              </div>
              
              <div>
                <label className="block text-white font-medium mb-2">Test Code</label>
                <input
                  type="text"
                  value={editingTest.testCode || ''}
                  onChange={(e) => setEditingTest({...editingTest, testCode: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm"
                />
              </div>
              
              <div>
                <label className="block text-white font-medium mb-2">Category *</label>
                <select
                  value={editingTest.category || ''}
                  onChange={(e) => setEditingTest({...editingTest, category: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm"
                  required
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
                  value={editingTest.sampleType || ''}
                  onChange={(e) => setEditingTest({...editingTest, sampleType: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm"
                />
              </div>
              
              <div>
                <label className="block text-white font-medium mb-2">Price (₹) *</label>
                <input
                  type="number"
                  value={editingTest.price || ''}
                  onChange={(e) => setEditingTest({...editingTest, price: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              
              <div>
                <label className="block text-white font-medium mb-2">Original Price (₹)</label>
                <input
                  type="number"
                  value={editingTest.originalPrice || ''}
                  onChange={(e) => setEditingTest({...editingTest, originalPrice: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm"
                  min="0"
                  step="0.01"
                />
              </div>
              
              <div>
                <label className="block text-white font-medium mb-2">Duration *</label>
                <input
                  type="text"
                  value={editingTest.duration || ''}
                  onChange={(e) => setEditingTest({...editingTest, duration: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm"
                  required
                />
              </div>
              
              <div>
                <label className="block text-white font-medium mb-2">Report Time</label>
                <select
                  value={editingTest.reportTime || 'Same day'}
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
                value={editingTest.description || ''}
                onChange={(e) => setEditingTest({...editingTest, description: e.target.value})}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm resize-none"
                rows="3"
              />
            </div>
            
            <div>
              <label className="block text-white font-medium mb-2">Preparation Instructions</label>
              <input
                type="text"
                value={editingTest.preparationTime || ''}
                onChange={(e) => setEditingTest({...editingTest, preparationTime: e.target.value})}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm"
              />
            </div>
            
            <div>
              <label className="block text-white font-medium mb-2">Requirements (comma separated)</label>
              <input
                type="text"
                value={editingTest.requirements || ''}
                onChange={(e) => setEditingTest({...editingTest, requirements: e.target.value})}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm"
              />
            </div>
            
            <div>
              <label className="block text-white font-medium mb-2">Test Includes (comma separated)</label>
              <input
                type="text"
                value={editingTest.includes || ''}
                onChange={(e) => setEditingTest({...editingTest, includes: e.target.value})}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm"
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
                onClick={updateTest}
                className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-600 text-white py-3 rounded-xl font-medium hover:from-cyan-600 hover:to-purple-700 transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
                disabled={submitting}
              >
                {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {submitting ? 'Updating...' : 'Update Test'}
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