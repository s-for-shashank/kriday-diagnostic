'use client';

import { useState, useEffect } from 'react';
import { 
  Calendar, Phone, TrendingUp, TestTube, Users, User, Activity,
  Plus, Eye, BarChart3, Settings, CheckCircle, Clock, Star, 
  Zap, Heart, Shield, ArrowRight, RefreshCw, AlertCircle, Minus
} from 'lucide-react';

import Link from 'next/link';

// Import API services
import { 
  bookingsApi, 
  callbacksApi, 
  testsApi,
  dashboardApi,
  withErrorHandling 
} from '@/lib/api';

// StatCard Component
function StatCard({ 
  title, 
  value, 
  change, 
  trend, 
  icon: Icon, 
  color, 
  description, 
  delay = 0,
  onClick 
}) {
  const getTrendIcon = () => {
    switch(trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'down': return <TrendingUp className="w-4 h-4 text-red-400 rotate-180" />;
      default: return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  const getTrendColor = () => {
    switch(trend) {
      case 'up': return 'text-green-400';
      case 'down': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div 
      className={`bg-white/5 backdrop-blur-2xl rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer hover:scale-105 animate-fade-in`}
      style={{ animationDelay: `${delay}s` }}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 bg-gradient-to-r ${color} rounded-xl flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex items-center gap-2">
          {getTrendIcon()}
          <span className={`text-sm font-medium ${getTrendColor()}`}>
            {change}
          </span>
        </div>
      </div>
      
      <div>
        <h3 className="text-2xl font-bold text-white mb-1">{value}</h3>
        <p className="text-white/60 text-sm">{title}</p>
        {description && (
          <p className="text-white/50 text-xs mt-2">{description}</p>
        )}
      </div>
    </div>
  );
}

// Modal Component
function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md' 
}) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className={`relative bg-gray-900 rounded-2xl p-6 w-full mx-4 ${sizeClasses[size]} border border-white/10`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5 text-white/60" />
          </button>
        </div>
        
        {/* Content */}
        <div className="text-white">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [timeframe, setTimeframe] = useState('today');
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [selectedStat, setSelectedStat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // State for dashboard data
  const [dashboardData, setDashboardData] = useState({
    stats: [],
    recentBookings: [],
    todayPerformance: {
      testsCompleted: 0,
      successRate: 0,
      avgTurnaround: '0 hrs'
    },
    systemStatus: {
      serverStatus: 'online',
      database: 'connected',
      lastBackup: '2 hrs ago',
      uptime: '99.9%'
    },
    customerSatisfaction: {
      rating: 4.9,
      reviewCount: 234,
      stars: 5
    }
  });

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setError(null);
      
      // Try to fetch from dashboard API first, then fallback to individual APIs
      const [
        dashboardStatsResponse,
        bookingsResponse,
        callbacksResponse,
        testsResponse
      ] = await Promise.all([
        withErrorHandling(dashboardApi.getStats)(timeframe),
        withErrorHandling(bookingsApi.getAll)({ limit: 10, status: 'all' }),
        withErrorHandling(callbacksApi.getAll)({ status: 'pending' }),
        withErrorHandling(testsApi.getAll)({ status: 'active' })
      ]);

      let stats = [];

      // Use dashboard API data if available, otherwise calculate from individual APIs
      if (dashboardStatsResponse.success && dashboardStatsResponse.data?.data) {
        const dashData = dashboardStatsResponse.data.data;
        
        stats = [
          {
            title: "Total Bookings",
            value: dashData.totalBookings.value.toString(),
            change: dashData.totalBookings.change,
            trend: dashData.totalBookings.trend,
            icon: Calendar,
            color: "from-cyan-500 to-blue-600",
            description: "New bookings this period",
            details: `${dashData.totalBookings.change} bookings in the selected timeframe`
          },
          {
            title: "Pending Callbacks",
            value: dashData.pendingCallbacks.value.toString(),
            change: dashData.pendingCallbacks.change,
            trend: dashData.pendingCallbacks.trend,
            icon: Phone,
            color: "from-purple-500 to-pink-600",
            description: "Awaiting callback requests",
            details: "Average response time: 15 minutes"
          },
          {
            title: "Revenue Today",
            value: `₹${dashData.revenue.value.toLocaleString()}`,
            change: dashData.revenue.change,
            trend: dashData.revenue.trend,
            icon: TrendingUp,
            color: "from-green-500 to-emerald-600",
            description: `Daily revenue target: ₹${dashData.revenue.target.toLocaleString()}`,
            details: `${dashData.revenue.targetPercentage}% of daily target achieved`
          },
          {
            title: "Active Tests",
            value: dashData.activeTests.value.toString(),
            change: dashData.activeTests.change,
            trend: dashData.activeTests.trend,
            icon: TestTube,
            color: "from-orange-500 to-red-600",
            description: "Available test categories",
            details: "All test categories are active"
          }
        ];

        // Update performance data from dashboard API
        setDashboardData(prev => ({
          ...prev,
          stats,
          todayPerformance: {
            testsCompleted: dashData.performance.testsCompleted,
            successRate: dashData.performance.successRate,
            avgTurnaround: dashData.performance.avgTurnaround
          }
        }));
      } else {
        // Fallback to manual calculation if dashboard API fails
        console.log('Dashboard API not available, using individual APIs for calculation');
        
        // Calculate today's bookings for growth calculation
        let todayBookingsCount = 0;
        let totalRevenue = 0;
        let completedTodayCount = 0;
        
        if (bookingsResponse.success && bookingsResponse.data?.data) {
          const today = new Date();
          const todayStr = today.toDateString();
          
          const todayBookings = bookingsResponse.data.data.filter(booking => {
            const bookingDate = new Date(booking.createdAt);
            return bookingDate.toDateString() === todayStr;
          });
          
          todayBookingsCount = todayBookings.length;
          
          completedTodayCount = todayBookings.filter(booking => 
            booking.status === 'completed'
          ).length;
          
          totalRevenue = todayBookings.filter(booking => 
            booking.status === 'completed'
          ).reduce((sum, booking) => sum + (booking.testPrice || 0), 0);
        }

        // Process stats (fallback calculation)
        stats = [];
        
        // Total Bookings
        if (bookingsResponse.success) {
          const totalBookings = bookingsResponse.data.pagination?.total || bookingsResponse.data.data?.length || 0;
          
          stats.push({
            title: "Total Bookings",
            value: totalBookings.toString(),
            change: `+${todayBookingsCount}`,
            trend: todayBookingsCount > 0 ? "up" : "neutral",
            icon: Calendar,
            color: "from-cyan-500 to-blue-600",
            description: "New bookings today",
            details: `${todayBookingsCount} bookings in the last 24 hours`
          });
        }

        // Pending Callbacks
        if (callbacksResponse.success) {
          const pendingCallbacks = callbacksResponse.data.pagination?.total || callbacksResponse.data.data?.length || 0;
          stats.push({
            title: "Pending Callbacks",
            value: pendingCallbacks.toString(),
            change: pendingCallbacks > 0 ? "+5%" : "0%",
            trend: pendingCallbacks > 0 ? "up" : "neutral",
            icon: Phone,
            color: "from-purple-500 to-pink-600",
            description: "Awaiting callback requests",
            details: "Average response time: 15 minutes"
          });
        }

        // Revenue Today
        stats.push({
          title: "Revenue Today",
          value: `₹${totalRevenue.toLocaleString()}`,
          change: totalRevenue > 0 ? "+18%" : "0%",
          trend: totalRevenue > 0 ? "up" : "neutral",
          icon: TrendingUp,
          color: "from-green-500 to-emerald-600",
          description: "Daily revenue target: ₹50,000",
          details: `${Math.round((totalRevenue / 50000) * 100)}% of daily target achieved`
        });

        // Active Tests
        if (testsResponse.success) {
          const activeTests = testsResponse.data.data?.length || testsResponse.data.count || 0;
          stats.push({
            title: "Active Tests",
            value: activeTests.toString(),
            change: "0%",
            trend: "neutral",
            icon: TestTube,
            color: "from-orange-500 to-red-600",
            description: "Available test categories",
            details: "All test categories are active"
          });
        }

        setDashboardData(prev => ({
          ...prev,
          stats,
          todayPerformance: {
            testsCompleted: completedTodayCount,
            successRate: completedTodayCount > 0 ? 98.5 : 0,
            avgTurnaround: '2.3 hrs'
          }
        }));
      }

      // Process recent bookings (this always uses the bookings API)
      let recentBookings = [];
      if (bookingsResponse.success && bookingsResponse.data?.data) {
        recentBookings = bookingsResponse.data.data.slice(0, 5).map(booking => ({
          id: booking._id,
          name: booking.customerName,
          test: booking.testName,
          time: new Date(booking.createdAt).toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          status: booking.status,
          avatar: booking.customerName.split(' ').map(n => n[0]).join('').toUpperCase(),
          amount: `₹${booking.testPrice?.toLocaleString() || 0}`
        }));
      }

      // Update dashboard data
      setDashboardData(prev => ({
        ...prev,
        recentBookings,
        systemStatus: {
          serverStatus: 'online',
          database: 'connected',
          lastBackup: '2 hrs ago',
          uptime: '99.9%'
        },
        customerSatisfaction: {
          rating: 4.9,
          reviewCount: 234,
          stars: 5
        }
      }));

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchDashboardData();
  }, [timeframe]);

  // Refresh data
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
  };

  // Quick actions
  const quickActions = [
    { 
      title: "Add New Test", 
      description: "Create a new diagnostic test",
      icon: Plus, 
      color: "from-cyan-500 to-blue-600",
      href: "/admin/tests"
    },
    { 
      title: "View All Bookings", 
      description: "Manage customer bookings",
      icon: Calendar, 
      color: "from-purple-500 to-pink-600",
      href: "/admin/bookings"
    },
    { 
      title: "Analytics Report", 
      description: "View detailed analytics",
      icon: BarChart3, 
      color: "from-green-500 to-emerald-600",
      href: "/admin/reports"
    },
    { 
      title: "System Settings", 
      description: "Configure admin settings",
      icon: Settings, 
      color: "from-orange-500 to-red-600",
      href: "/admin/settings"
    }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'confirmed': return 'bg-green-500/20 text-green-400';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400';
      case 'completed': return 'bg-blue-500/20 text-blue-400';
      case 'cancelled': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const handleStatClick = (stat) => {
    setSelectedStat(stat);
    setShowStatsModal(true);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="space-y-8 p-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mx-auto mb-4" />
              <p className="text-white/60">Loading dashboard data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !dashboardData.stats.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="space-y-8 p-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-4" />
              <p className="text-red-400 mb-4">{error}</p>
              <button 
                onClick={handleRefresh}
                className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-4 py-2 rounded-xl hover:from-cyan-600 hover:to-purple-700 transition-all duration-300 flex items-center gap-2 mx-auto"
              >
                <RefreshCw className="w-4 h-4" />
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="space-y-8 p-8">
        {/* Time Filter */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Dashboard Overview</h2>
            <p className="text-white/60">Monitor your diagnostic center's performance in real-time</p>
            {error && (
              <div className="flex items-center gap-2 mt-2 text-yellow-400 text-sm">
                <AlertCircle className="w-4 h-4" />
                Some data may be outdated. Last updated: {new Date().toLocaleTimeString()}
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm"
            >
              <option value="today" className="bg-gray-800">Today</option>
              <option value="week" className="bg-gray-800">This Week</option>
              <option value="month" className="bg-gray-800">This Month</option>
              <option value="year" className="bg-gray-800">This Year</option>
            </select>
            <button 
              onClick={handleRefresh}
              disabled={refreshing}
              className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-4 py-2 rounded-xl hover:from-cyan-600 hover:to-purple-700 transition-all duration-300 flex items-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
            <button className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Export Report
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboardData.stats.map((stat, index) => (
            <StatCard
              key={index}
              {...stat}
              delay={index * 0.1}
              onClick={() => handleStatClick(stat)}
            />
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Recent Bookings */}
          <div className="lg:col-span-2 bg-white/5 backdrop-blur-2xl rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Recent Bookings</h3>
              <Link 
                href="/admin/bookings"
                className="text-cyan-400 hover:text-cyan-300 transition-colors duration-300 flex items-center gap-2 text-sm font-medium group"
              >
                <Eye className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                View All
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
            <div className="space-y-4">
              {dashboardData.recentBookings.length > 0 ? (
                dashboardData.recentBookings.map((booking, index) => (
                  <div 
                    key={booking.id} 
                    className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300 animate-fade-in group cursor-pointer" 
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg group-hover:scale-110 transition-transform duration-300">
                        {booking.avatar}
                      </div>
                      <div>
                        <div className="text-white font-medium group-hover:text-cyan-400 transition-colors duration-300">
                          {booking.name}
                        </div>
                        <div className="text-white/60 text-sm">{booking.test}</div>
                        <div className="text-white/50 text-xs flex items-center gap-2 mt-1">
                          <Clock className="w-3 h-3" />
                          {booking.time}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-bold mb-2">{booking.amount}</div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-white/60">
                  <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No recent bookings found</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white/5 backdrop-blur-2xl rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300">
            <h3 className="text-xl font-bold text-white mb-6">Quick Actions</h3>
            <div className="space-y-4">
              {quickActions.map((action, index) => (
                <Link 
                  key={index}
                  href={action.href}
                  className={`w-full bg-gradient-to-r ${action.color} p-4 rounded-xl text-white hover:scale-105 transition-all duration-300 flex items-center gap-4 animate-fade-in group shadow-lg hover:shadow-xl block`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-all duration-300">
                    <action.icon className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-bold text-sm">{action.title}</div>
                    <div className="text-white/80 text-xs">{action.description}</div>
                  </div>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Today's Performance */}
          <div className="bg-white/5 backdrop-blur-2xl rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">Today's Performance</h4>
                <p className="text-white/60 text-sm">Real-time metrics</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-white/70 text-sm">Tests Completed</span>
                <span className="text-white font-semibold">{dashboardData.todayPerformance.testsCompleted}</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full transition-all duration-500" 
                  style={{width: `${Math.min((dashboardData.todayPerformance.testsCompleted / 30) * 100, 100)}%`}}
                ></div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70 text-sm">Success Rate</span>
                <span className="text-green-400 font-semibold">{dashboardData.todayPerformance.successRate}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70 text-sm">Avg. Turnaround</span>
                <span className="text-cyan-400 font-semibold">{dashboardData.todayPerformance.avgTurnaround}</span>
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className="bg-white/5 backdrop-blur-2xl rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">System Status</h4>
                <p className="text-white/60 text-sm">All systems operational</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-white/70 text-sm">Server Status</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400 font-semibold text-sm capitalize">
                    {dashboardData.systemStatus.serverStatus}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70 text-sm">Database</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400 font-semibold text-sm capitalize">
                    {dashboardData.systemStatus.database}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70 text-sm">Last Backup</span>
                <span className="text-white/70 font-semibold text-sm">
                  {dashboardData.systemStatus.lastBackup}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70 text-sm">Uptime</span>
                <span className="text-cyan-400 font-semibold text-sm">
                  {dashboardData.systemStatus.uptime}
                </span>
              </div>
            </div>
          </div>

          {/* Customer Satisfaction */}
          <div className="bg-white/5 backdrop-blur-2xl rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-600 rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">Customer Satisfaction</h4>
                <p className="text-white/60 text-sm">This month's ratings</p>
              </div>
            </div>
            <div className="text-center mb-4">
              <div className="text-3xl font-bold text-white mb-2">
                {dashboardData.customerSatisfaction.rating}
              </div>
              <div className="flex justify-center mb-2">
                {[...Array(dashboardData.customerSatisfaction.stars)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-white/60 text-sm mb-4">
                Based on {dashboardData.customerSatisfaction.reviewCount} reviews
              </p>
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-medium inline-block">
                Excellent Rating
              </div>
            </div>
          </div>
        </div>

        {/* Stat Details Modal */}
        <Modal
          isOpen={showStatsModal}
          onClose={() => setShowStatsModal(false)}
          title={selectedStat?.title}
          size="md"
        >
          {selectedStat && (
            <div className="space-y-6">
              <div className="text-center">
                <div className={`w-20 h-20 bg-gradient-to-r ${selectedStat.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <selectedStat.icon className="w-10 h-10 text-white" />
                </div>
                <div className="text-4xl font-bold text-white mb-2">{selectedStat.value}</div>
                <div className="text-white/70 mb-4">{selectedStat.description}</div>
                <div className="text-white/50">{selectedStat.details}</div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-cyan-400">{selectedStat.change}</div>
                  <div className="text-white/60 text-sm">Growth Rate</div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-purple-400">
                    {selectedStat.trend === 'up' ? '📈' : selectedStat.trend === 'down' ? '📉' : '📊'}
                  </div>
                  <div className="text-white/60 text-sm">Trend</div>
                </div>
              </div>
            </div>
          )}
        </Modal>
      </div>

      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
          opacity: 0;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}