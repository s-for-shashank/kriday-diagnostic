'use client';

import { useState } from 'react';
import { 
  LayoutDashboard, Users, Calendar, TestTube, Settings, LogOut, Menu, 
  User, Phone, BarChart3
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminSidebar({ sidebarOpen, setSidebarOpen }) {
  const pathname = usePathname();

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
    { id: 'bookings', label: 'Bookings', icon: Calendar, href: '/admin/bookings' },
    { id: 'callbacks', label: 'Callbacks', icon: Phone, href: '/admin/callbacks' },
    { id: 'tests', label: 'Manage Tests', icon: TestTube, href: '/admin/tests' },
    { id: 'customers', label: 'Customers', icon: Users, href: '/admin/customers' },
    { id: 'reports', label: 'Reports', icon: BarChart3, href: '/admin/reports' },
    { id: 'settings', label: 'Settings', icon: Settings, href: '/admin/settings' }
  ];

  const handleLogout = () => {
    // Implement logout logic here
    if (confirm('Are you sure you want to logout?')) {
      // Add your logout logic here (clear tokens, redirect, etc.)
      console.log('Logging out...');
    }
  };

  return (
    <div className={`fixed left-0 top-0 h-full bg-white/5 backdrop-blur-2xl border-r border-white/10 transition-all duration-300 z-30 ${sidebarOpen ? 'w-64' : 'w-16'}`}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          {sidebarOpen && (
            <div className="animate-fade-in">
              <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Kriday Admin
              </h1>
              <p className="text-white/50 text-xs mt-1">Diagnostics Panel</p>
            </div>
          )}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300 hover:scale-110 group"
            title={sidebarOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
          >
            <Menu className="w-5 h-5 text-white group-hover:text-cyan-400 transition-colors duration-300" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {sidebarItems.map((item, index) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 hover:bg-white/10 hover:scale-105 animate-fade-in group relative ${
                  isActive 
                    ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 text-white shadow-lg' 
                    : 'text-white/70 hover:text-white'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
                title={!sidebarOpen ? item.label : ''}
              >
                <item.icon className={`w-5 h-5 flex-shrink-0 transition-all duration-300 ${
                  isActive ? 'text-cyan-400' : 'group-hover:text-cyan-400'
                }`} />
                
                {sidebarOpen && (
                  <span className="font-medium transition-all duration-300">
                    {item.label}
                  </span>
                )}
                
                {isActive && sidebarOpen && (
                  <div className="ml-auto w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                )}
                
                {/* Active indicator for collapsed sidebar */}
                {isActive && !sidebarOpen && (
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-cyan-400 to-purple-400 rounded-l-full animate-pulse"></div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Profile & Logout */}
        {sidebarOpen && (
          <div className="absolute bottom-6 left-6 right-6 animate-fade-in">
            {/* User Profile */}
            <div className="border-t border-white/10 pt-4 mb-4">
              <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-white/5 transition-all duration-300 cursor-pointer group">
                <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-white text-sm font-medium group-hover:text-cyan-400 transition-colors duration-300">
                    Admin User
                  </div>
                  <div className="text-white/50 text-xs">admin@kriday.com</div>
                </div>
              </div>
            </div>
            
            {/* Logout Button */}
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:scale-105 transition-all duration-300 group border border-transparent hover:border-red-500/20"
            >
              <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        )}

        {/* Collapsed sidebar tooltip on hover */}
        {!sidebarOpen && (
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
            <button 
              onClick={handleLogout}
              className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 hover:scale-110 transition-all duration-300 group"
              title="Logout"
            >
              <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
            </button>
          </div>
        )}
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
    </div>
  );
}