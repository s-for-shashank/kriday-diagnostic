'use client';

import { useState } from 'react';
import { 
  BarChart3, LineChart, PieChart, TrendingUp, Download, Calendar, 
  DollarSign, Users, Activity, TestTube, Eye, Filter, RefreshCw,
  ArrowUp, ArrowDown, Clock, CheckCircle, Star, Target
} from 'lucide-react';
import StatCard from '../components/StatCard';

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedReport, setSelectedReport] = useState('overview');

  // Mock data for reports
  const overviewStats = [
    {
      title: "Total Revenue",
      value: "₹12.4L",
      change: "+23.5%",
      trend: "up",
      icon: DollarSign,
      color: "from-green-500 to-emerald-600",
      description: "This month's earnings"
    },
    {
      title: "Total Bookings",
      value: "1,847",
      change: "+18.2%",
      trend: "up",
      icon: Calendar,
      color: "from-blue-500 to-indigo-600",
      description: "Appointments booked"
    },
    {
      title: "New Customers",
      value: "234",
      change: "+15.8%",
      trend: "up",
      icon: Users,
      color: "from-purple-500 to-pink-600",
      description: "First-time visitors"
    },
    {
      title: "Avg. Order Value",
      value: "₹672",
      change: "+7.3%",
      trend: "up",
      icon: TrendingUp,
      color: "from-orange-500 to-red-600",
      description: "Per booking average"
    }
  ];

  // Mock chart data
  const revenueData = [
    { month: 'Jan', revenue: 85000, bookings: 156 },
    { month: 'Feb', revenue: 92000, bookings: 178 },
    { month: 'Mar', revenue: 78000, bookings: 142 },
    { month: 'Apr', revenue: 105000, bookings: 201 },
    { month: 'May', revenue: 118000, bookings: 234 },
    { month: 'Jun', revenue: 124000, bookings: 267 }
  ];

  const testPopularity = [
    { name: 'Complete Blood Count', bookings: 456, revenue: 136800, percentage: 24.7 },
    { name: 'Lipid Profile', bookings: 389, revenue: 194111, percentage: 21.1 },
    { name: 'Diabetes Panel', bookings: 298, revenue: 178502, percentage: 16.1 },
    { name: 'Thyroid Function', bookings: 234, revenue: 163566, percentage: 12.7 },
    { name: 'Full Body Checkup', bookings: 189, revenue: 566811, percentage: 10.2 },
    { name: 'Others', bookings: 281, revenue: 158210, percentage: 15.2 }
  ];

  const dailyStats = [
    { day: 'Mon', bookings: 45, revenue: 28500 },
    { day: 'Tue', bookings: 52, revenue: 34200 },
    { day: 'Wed', bookings: 38, revenue: 24100 },
    { day: 'Thu', bookings: 61, revenue: 39800 },
    { day: 'Fri', bookings: 58, revenue: 37400 },
    { day: 'Sat', bookings: 73, revenue: 48900 },
    { day: 'Sun', bookings: 41, revenue: 26100 }
  ];

  const performanceMetrics = [
    { metric: 'Customer Retention Rate', value: '87.5%', trend: 'up', change: '+3.2%' },
    { metric: 'Average Response Time', value: '12 mins', trend: 'down', change: '-8.3%' },
    { metric: 'Booking Conversion Rate', value: '78.9%', trend: 'up', change: '+5.1%' },
    { metric: 'Customer Satisfaction', value: '4.8/5', trend: 'up', change: '+0.2' },
    { metric: 'Test Completion Rate', value: '96.3%', trend: 'up', change: '+1.7%' },
    { metric: 'Revenue per Customer', value: '₹1,847', trend: 'up', change: '+12.4%' }
  ];

  const getMaxValue = (data, key) => Math.max(...data.map(item => item[key]));

  const exportReport = () => {
    alert('Report export functionality would be implemented here');
  };

  const getTrendIcon = (trend) => {
    return trend === 'up' ? 
      <ArrowUp className="w-4 h-4 text-green-400" /> : 
      <ArrowDown className="w-4 h-4 text-red-400" />;
  };

  const getTrendColor = (trend) => {
    return trend === 'up' ? 'text-green-400' : 'text-red-400';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Analytics & Reports</h2>
          <p className="text-white/60">Comprehensive business insights and performance metrics</p>
        </div>
        <div className="flex gap-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
          >
            <option value="week" className="bg-gray-800">This Week</option>
            <option value="month" className="bg-gray-800">This Month</option>
            <option value="quarter" className="bg-gray-800">This Quarter</option>
            <option value="year" className="bg-gray-800">This Year</option>
          </select>
          <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl transition-all duration-300 flex items-center gap-2 border border-white/20 hover:border-white/30">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button 
            onClick={exportReport}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl"
          >
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {overviewStats.map((stat, index) => (
          <StatCard
            key={index}
            {...stat}
            delay={index * 0.1}
          />
        ))}
      </div>

      {/* Report Navigation */}
      <div className="bg-white/5 backdrop-blur-2xl rounded-2xl p-6 border border-white/10">
        <div className="flex flex-wrap gap-4">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'revenue', label: 'Revenue Analysis', icon: DollarSign },
            { id: 'tests', label: 'Test Performance', icon: TestTube },
            { id: 'customers', label: 'Customer Insights', icon: Users },
            { id: 'performance', label: 'KPI Metrics', icon: Target }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedReport(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                selectedReport === tab.id
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                  : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Revenue Analysis */}
      {selectedReport === 'revenue' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white/5 backdrop-blur-2xl rounded-2xl p-6 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-6">Monthly Revenue Trend</h3>
            <div className="space-y-4">
              {revenueData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                      {item.month.charAt(0)}
                    </div>
                    <span className="text-white font-medium">{item.month}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-bold">₹{(item.revenue / 1000).toFixed(0)}k</div>
                    <div className="text-white/60 text-sm">{item.bookings} bookings</div>
                  </div>
                  <div className="w-24 bg-white/10 rounded-full h-2 ml-4">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(item.revenue / getMaxValue(revenueData, 'revenue')) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-2xl rounded-2xl p-6 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-6">Daily Performance</h3>
            <div className="grid grid-cols-7 gap-2">
              {dailyStats.map((day, index) => (
                <div key={index} className="text-center">
                  <div className="text-white/60 text-xs mb-2">{day.day}</div>
                  <div 
                    className="bg-gradient-to-t from-blue-500 to-indigo-600 rounded-lg mb-2 transition-all duration-500 hover:scale-105"
                    style={{ height: `${(day.bookings / getMaxValue(dailyStats, 'bookings')) * 80 + 20}px` }}
                  />
                  <div className="text-white text-sm font-bold">{day.bookings}</div>
                  <div className="text-white/60 text-xs">₹{(day.revenue / 1000).toFixed(0)}k</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Test Performance */}
      {selectedReport === 'tests' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white/5 backdrop-blur-2xl rounded-2xl p-6 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-6">Test Popularity</h3>
            <div className="space-y-4">
              {testPopularity.map((test, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-medium">{test.name}</span>
                    <span className="text-white/60 text-sm">{test.percentage}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-700 ${
                        index % 4 === 0 ? 'bg-gradient-to-r from-blue-500 to-indigo-600' :
                        index % 4 === 1 ? 'bg-gradient-to-r from-purple-500 to-pink-600' :
                        index % 4 === 2 ? 'bg-gradient-to-r from-green-500 to-emerald-600' :
                        'bg-gradient-to-r from-orange-500 to-red-600'
                      }`}
                      style={{ width: `${test.percentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">{test.bookings} bookings</span>
                    <span className="text-green-400">₹{(test.revenue / 1000).toFixed(0)}k</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-2xl rounded-2xl p-6 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-6">Test Categories Revenue</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { category: 'Blood Tests', revenue: 523400, percentage: 42.2, color: 'from-red-500 to-pink-600' },
                { category: 'Hormone Tests', revenue: 298700, percentage: 24.1, color: 'from-purple-500 to-indigo-600' },
                { category: 'Organ Tests', revenue: 234500, percentage: 18.9, color: 'from-green-500 to-emerald-600' },
                { category: 'Packages', revenue: 183400, percentage: 14.8, color: 'from-orange-500 to-yellow-600' }
              ].map((category, index) => (
                <div key={index} className={`bg-gradient-to-r ${category.color} p-4 rounded-xl text-white hover:scale-105 transition-all duration-300`}>
                  <div className="text-lg font-bold">₹{(category.revenue / 1000).toFixed(0)}k</div>
                  <div className="text-white/90 text-sm">{category.category}</div>
                  <div className="text-white/80 text-xs mt-1">{category.percentage}% of total</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Customer Insights */}
      {selectedReport === 'customers' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white/5 backdrop-blur-2xl rounded-2xl p-6 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-6">Customer Demographics</h3>
            <div className="space-y-4">
              {[
                { label: 'Age 18-30', count: 234, percentage: 28.5 },
                { label: 'Age 31-45', count: 312, percentage: 38.1 },
                { label: 'Age 46-60', count: 198, percentage: 24.1 },
                { label: 'Age 60+', count: 76, percentage: 9.3 }
              ].map((demo, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-white font-medium">{demo.label}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-20 bg-white/10 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full"
                        style={{ width: `${demo.percentage}%` }}
                      />
                    </div>
                    <span className="text-white/60 text-sm w-12">{demo.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-2xl rounded-2xl p-6 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-6">Gender Distribution</h3>
            <div className="flex flex-col items-center">
              <div className="relative w-32 h-32 mb-4">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600" style={{ clipPath: 'polygon(50% 50%, 50% 0%, 100% 0%, 100% 45%)' }}></div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 to-red-600" style={{ clipPath: 'polygon(50% 50%, 100% 45%, 100% 100%, 50% 100%)' }}></div>
                <div className="absolute inset-4 rounded-full bg-slate-900/90 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-white font-bold text-lg">820</div>
                    <div className="text-white/60 text-xs">Total</div>
                  </div>
                </div>
              </div>
              <div className="space-y-2 w-full">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"></div>
                    <span className="text-white text-sm">Male</span>
                  </div>
                  <span className="text-white font-medium">465 (56.7%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-pink-500 to-red-600"></div>
                    <span className="text-white text-sm">Female</span>
                  </div>
                  <span className="text-white font-medium">355 (43.3%)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-2xl rounded-2xl p-6 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-6">Customer Lifetime Value</h3>
            <div className="space-y-4">
              {[
                { tier: 'VIP (₹10k+)', count: 45, color: 'from-purple-500 to-pink-600' },
                { tier: 'Premium (₹5k-10k)', count: 123, color: 'from-blue-500 to-indigo-600' },
                { tier: 'Standard (₹2k-5k)', count: 298, color: 'from-green-500 to-emerald-600' },
                { tier: 'Basic (<₹2k)', count: 354, color: 'from-gray-500 to-gray-600' }
              ].map((tier, index) => (
                <div key={index} className={`bg-gradient-to-r ${tier.color} p-3 rounded-lg text-white hover:scale-105 transition-all duration-300`}>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{tier.tier}</span>
                    <span className="font-bold">{tier.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Performance Metrics */}
      {selectedReport === 'performance' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {performanceMetrics.map((metric, index) => (
            <div key={index} className="bg-white/5 backdrop-blur-2xl rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="flex items-center justify-between mb-4">
                <div className="text-white/60 text-sm">{metric.metric}</div>
                <div className="flex items-center gap-1">
                  {getTrendIcon(metric.trend)}
                  <span className={`text-sm font-medium ${getTrendColor(metric.trend)}`}>
                    {metric.change}
                  </span>
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-2">{metric.value}</div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div className={`h-2 rounded-full transition-all duration-700 ${
                  metric.trend === 'up' ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-red-500 to-pink-600'
                }`} style={{ width: '75%' }}></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Overview Dashboard */}
      {selectedReport === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <div className="bg-white/5 backdrop-blur-2xl rounded-2xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-6">Recent Activity</h3>
              <div className="space-y-4">
                {[
                  { action: 'New booking created', user: 'John Doe', time: '2 mins ago', icon: Calendar, color: 'text-blue-400' },
                  { action: 'Test completed', user: 'Sarah Wilson', time: '5 mins ago', icon: CheckCircle, color: 'text-green-400' },
                  { action: 'Callback requested', user: 'Mike Johnson', time: '8 mins ago', icon: Clock, color: 'text-yellow-400' },
                  { action: 'Payment received', user: 'Emma Brown', time: '12 mins ago', icon: DollarSign, color: 'text-green-400' },
                  { action: 'New customer registered', user: 'David Lee', time: '15 mins ago', icon: Users, color: 'text-purple-400' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300">
                    <div className={`w-8 h-8 rounded-full bg-white/10 flex items-center justify-center ${activity.color}`}>
                      <activity.icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-medium text-sm">{activity.action}</div>
                      <div className="text-white/60 text-xs">{activity.user} • {activity.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Performing Tests */}
            <div className="bg-white/5 backdrop-blur-2xl rounded-2xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-6">Top Performing Tests</h3>
              <div className="space-y-4">
                {testPopularity.slice(0, 5).map((test, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <div className="text-white font-medium text-sm">{test.name}</div>
                        <div className="text-white/60 text-xs">{test.bookings} bookings</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-400 font-bold">₹{(test.revenue / 1000).toFixed(0)}k</div>
                      <div className="text-white/60 text-xs">{test.percentage}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Tests Completed Today', value: '47', icon: CheckCircle, color: 'from-green-500 to-emerald-600' },
              { title: 'Pending Reports', value: '12', icon: Clock, color: 'from-yellow-500 to-orange-600' },
              { title: 'Customer Rating', value: '4.8/5', icon: Star, color: 'from-purple-500 to-pink-600' },
              { title: 'Active Staff', value: '8/10', icon: Users, color: 'from-blue-500 to-indigo-600' }
            ].map((stat, index) => (
              <div key={index} className={`bg-gradient-to-r ${stat.color} p-6 rounded-2xl text-white hover:scale-105 transition-all duration-300 shadow-lg`}>
                <div className="flex items-center justify-between mb-4">
                  <stat.icon className="w-8 h-8 text-white/80" />
                  <div className="text-3xl font-bold">{stat.value}</div>
                </div>
                <div className="text-white/90 text-sm font-medium">{stat.title}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}