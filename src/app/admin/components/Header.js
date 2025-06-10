'use client';

import { useState } from 'react';
import { Bell, User, Search, Settings, MessageSquare, ChevronDown, LogOut } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';


export default function AdminHeader() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const getPageTitle = () => {
    const pageMap = {
      '/admin': 'Dashboard',
      '/admin/bookings': 'Bookings',
      '/admin/callbacks': 'Callbacks',
      '/admin/tests': 'Manage Tests',
      '/admin/customers': 'Customers',
      '/admin/reports': 'Reports',
      '/admin/settings': 'Settings'
    };
    return pageMap[pathname] || 'Dashboard';
  };

  const getPageDescription = () => {
    const descMap = {
      '/admin': 'Welcome back to Kriday Diagnostics Admin Panel',
      '/admin/bookings': 'Manage all customer bookings and appointments',
      '/admin/callbacks': 'Handle customer callback requests',
      '/admin/tests': 'Configure and manage diagnostic tests',
      '/admin/customers': 'Customer database and management',
      '/admin/reports': 'Analytics and business insights',
      '/admin/settings': 'System configuration and preferences'
    };
    return descMap[pathname] || 'Welcome back to Kriday Diagnostics Admin Panel';
  };

  const notifications = [
    { id: 1, title: 'New booking received', message: 'John Doe booked Complete Blood Count', time: '2 min ago', type: 'booking' },
    { id: 2, title: 'Callback request', message: 'Sarah Wilson requested callback', time: '5 min ago', type: 'callback' },
    { id: 3, title: 'Test completed', message: 'Mike Johnson\'s test completed', time: '10 min ago', type: 'completed' }
  ];

  const getNotificationColor = (type) => {
    switch(type) {
      case 'booking': return 'bg-cyan-500/20 text-cyan-400';
      case 'callback': return 'bg-purple-500/20 text-purple-400';
      case 'completed': return 'bg-green-500/20 text-green-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const handleLogout = async () => {
    setShowProfile(false);
    await logout();
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (user?.name) {
      return user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return 'AD';
  };

  // Get user status
  const getUserStatus = () => {
    return user ? 'Online' : 'Offline';
  };

  return (
    <header className="bg-white/5 backdrop-blur-2xl border-b border-white/10 p-6 sticky top-0 z-20">
      <div className="flex justify-between items-center">
        {/* Page Title */}
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold text-white mb-1">
            {getPageTitle()}
          </h1>
          <p className="text-white/60">{getPageDescription()}</p>
        </div>
        
        {/* Header Actions */}
        <div className="flex items-center gap-4 animate-fade-in">
          {/* Search Bar */}
          <div className="hidden md:flex relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
            <input
              type="text"
              placeholder="Quick search..."
              className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm transition-all duration-300 w-64"
            />
          </div>

          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300 hover:scale-110 group"
            >
              <Bell className="w-5 h-5 text-white group-hover:text-cyan-400 transition-colors duration-300" />
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-400 to-pink-500 rounded-full flex items-center justify-center animate-pulse">
                <span className="text-white text-xs font-bold">{notifications.length}</span>
              </div>
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white/10 backdrop-blur-2xl rounded-2xl border border-white/20 shadow-2xl animate-fade-in">
                <div className="p-4 border-b border-white/10">
                  <h3 className="text-white font-semibold">Notifications</h3>
                </div>
                <div className="p-2 max-h-64 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="p-3 hover:bg-white/5 rounded-xl transition-all duration-300 cursor-pointer group">
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${getNotificationColor(notification.type).split(' ')[0]}`}></div>
                        <div className="flex-1">
                          <div className="text-white font-medium text-sm group-hover:text-cyan-400 transition-colors duration-300">
                            {notification.title}
                          </div>
                          <div className="text-white/60 text-xs mt-1">{notification.message}</div>
                          <div className="text-white/40 text-xs mt-1">{notification.time}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-white/10">
                  <button className="w-full text-cyan-400 hover:text-cyan-300 transition-colors duration-300 text-sm font-medium">
                    View All Notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Messages */}
          <button className="p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300 hover:scale-110 group">
            <MessageSquare className="w-5 h-5 text-white group-hover:text-cyan-400 transition-colors duration-300" />
          </button>

          {/* User Profile */}
          <div className="relative">
            <button 
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-2 hover:bg-white/20 transition-all duration-300 group"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <span className="text-white text-sm font-bold">
                  {getUserInitials()}
                </span>
              </div>
              <div className="hidden md:block text-left">
                <div className="text-white text-sm font-medium group-hover:text-cyan-400 transition-colors duration-300">
                  {user?.name || 'Admin User'}
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${user ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
                  <span className="text-white/50 text-xs">{getUserStatus()}</span>
                </div>
              </div>
              <ChevronDown className={`w-4 h-4 text-white/50 transition-transform duration-300 ${showProfile ? 'rotate-180' : ''}`} />
            </button>

            {/* Profile Dropdown */}
            {showProfile && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white/10 backdrop-blur-2xl rounded-2xl border border-white/20 shadow-2xl animate-fade-in">
                {/* User Info Section */}
                <div className="p-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">
                        {getUserInitials()}
                      </span>
                    </div>
                    <div>
                      <div className="text-white font-semibold text-sm">
                        {user?.name || 'Admin User'}
                      </div>
                      <div className="text-white/60 text-xs">
                        {user?.email || 'admin@kriday.com'}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-white/50 text-xs">
                          {user?.role?.charAt(0)?.toUpperCase() + user?.role?.slice(1) || 'Administrator'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="p-2">
                  <button className="w-full flex items-center gap-3 p-3 hover:bg-white/10 rounded-xl transition-all duration-300 text-white hover:text-cyan-400 group">
                    <User className="w-4 h-4" />
                    <span className="text-sm font-medium">Profile Settings</span>
                  </button>
                  <button className="w-full flex items-center gap-3 p-3 hover:bg-white/10 rounded-xl transition-all duration-300 text-white hover:text-cyan-400 group">
                    <Settings className="w-4 h-4" />
                    <span className="text-sm font-medium">Account Settings</span>
                  </button>
                  
                  <div className="border-t border-white/10 mt-2 pt-2">
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 p-3 hover:bg-red-500/10 rounded-xl transition-all duration-300 text-red-400 hover:text-red-300 group"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm font-medium">Sign Out</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
          opacity: 0;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </header>
  );
}