'use client';

import { useState } from 'react';
import { 
  Settings, User, Bell, Shield, Database, Mail, Phone, Globe,
  Save, RefreshCw, Eye, EyeOff, Upload, Download, Trash2, Plus,
  CheckCircle, AlertCircle, Clock, Key, Palette, Monitor, Moon, Sun
} from 'lucide-react';
import StatCard from '../components/StatCard';
import Modal, { ConfirmModal } from '../components/Modal';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [actionType, setActionType] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Settings state
  const [generalSettings, setGeneralSettings] = useState({
    companyName: 'Kriday Diagnostics',
    companyEmail: 'info@kridaydiagnostics.com',
    companyPhone: '+91 98765 43210',
    address: '123 Healthcare Street, Medical District, City 123456',
    website: 'www.kridaydiagnostics.com',
    businessHours: '9:00 AM - 6:00 PM',
    timezone: 'Asia/Kolkata',
    currency: 'INR',
    language: 'English'
  });

  const [profileSettings, setProfileSettings] = useState({
    fullName: 'Admin User',
    email: 'admin@kridaydiagnostics.com',
    phone: '+91 98765 43200',
    role: 'Super Admin',
    lastLogin: '2024-06-08 10:30 AM',
    avatar: null
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    bookingAlerts: true,
    callbackAlerts: true,
    systemAlerts: true,
    marketingEmails: false,
    weeklyReports: true,
    monthlyReports: true
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    loginAlerts: true,
    sessionTimeout: '30',
    passwordExpiry: '90',
    maxLoginAttempts: '5',
    requireStrongPassword: true,
    allowMultipleSessions: false
  });

  const [systemSettings, setSystemSettings] = useState({
    maintenanceMode: false,
    debugMode: false,
    autoBackup: true,
    backupFrequency: 'daily',
    retentionPeriod: '30',
    logLevel: 'info',
    cacheEnabled: true,
    compressionEnabled: true
  });

  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: 'dark',
    primaryColor: '#3B82F6',
    fontSize: 'medium',
    compactMode: false,
    animations: true,
    sidebar: 'expanded'
  });

  // Stats for settings overview
  const systemStats = [
    {
      title: "System Uptime",
      value: "99.9%",
      change: "+0.1%",
      trend: "up",
      icon: Monitor,
      color: "from-green-500 to-emerald-600",
      description: "Last 30 days"
    },
    {
      title: "Active Sessions",
      value: "12",
      change: "+3",
      trend: "up",
      icon: User,
      color: "from-blue-500 to-indigo-600",
      description: "Current users"
    },
    {
      title: "Security Score",
      value: "95/100",
      change: "+5",
      trend: "up",
      icon: Shield,
      color: "from-purple-500 to-pink-600",
      description: "Security rating"
    },
    {
      title: "Last Backup",
      value: "2h ago",
      change: "Success",
      trend: "up",
      icon: Database,
      color: "from-orange-500 to-red-600",
      description: "Auto backup"
    }
  ];

  const settingsTabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'system', label: 'System', icon: Database },
    { id: 'appearance', label: 'Appearance', icon: Palette }
  ];

  const handleSaveSettings = (settingsType) => {
    // Simulate API call
    setTimeout(() => {
      alert(`${settingsType} settings saved successfully!`);
    }, 500);
  };

  const handlePasswordChange = () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      alert('Password must be at least 8 characters long!');
      return;
    }
    // Simulate password change
    alert('Password changed successfully!');
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setShowPasswordModal(false);
  };

  const handleBackupAction = (action) => {
    setActionType(action);
    setShowConfirmModal(true);
  };

  const confirmAction = () => {
    if (actionType === 'backup') {
      alert('Backup initiated successfully!');
    } else if (actionType === 'restore') {
      alert('System restore completed!');
    } else if (actionType === 'reset') {
      alert('Settings reset to default!');
    }
    setShowConfirmModal(false);
    setActionType('');
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-white font-medium mb-2">Company Name</label>
            <input
              type="text"
              value={generalSettings.companyName}
              onChange={(e) => setGeneralSettings({...generalSettings, companyName: e.target.value})}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
            />
          </div>
          <div>
            <label className="block text-white font-medium mb-2">Email Address</label>
            <input
              type="email"
              value={generalSettings.companyEmail}
              onChange={(e) => setGeneralSettings({...generalSettings, companyEmail: e.target.value})}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
            />
          </div>
          <div>
            <label className="block text-white font-medium mb-2">Phone Number</label>
            <input
              type="tel"
              value={generalSettings.companyPhone}
              onChange={(e) => setGeneralSettings({...generalSettings, companyPhone: e.target.value})}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
            />
          </div>
          <div>
            <label className="block text-white font-medium mb-2">Website</label>
            <input
              type="url"
              value={generalSettings.website}
              onChange={(e) => setGeneralSettings({...generalSettings, website: e.target.value})}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-white font-medium mb-2">Business Hours</label>
            <input
              type="text"
              value={generalSettings.businessHours}
              onChange={(e) => setGeneralSettings({...generalSettings, businessHours: e.target.value})}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
            />
          </div>
          <div>
            <label className="block text-white font-medium mb-2">Timezone</label>
            <select
              value={generalSettings.timezone}
              onChange={(e) => setGeneralSettings({...generalSettings, timezone: e.target.value})}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
            >
              <option value="Asia/Kolkata" className="bg-gray-800">Asia/Kolkata</option>
              <option value="UTC" className="bg-gray-800">UTC</option>
              <option value="America/New_York" className="bg-gray-800">America/New_York</option>
            </select>
          </div>
          <div>
            <label className="block text-white font-medium mb-2">Currency</label>
            <select
              value={generalSettings.currency}
              onChange={(e) => setGeneralSettings({...generalSettings, currency: e.target.value})}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
            >
              <option value="INR" className="bg-gray-800">INR (₹)</option>
              <option value="USD" className="bg-gray-800">USD ($)</option>
              <option value="EUR" className="bg-gray-800">EUR (€)</option>
            </select>
          </div>
          <div>
            <label className="block text-white font-medium mb-2">Language</label>
            <select
              value={generalSettings.language}
              onChange={(e) => setGeneralSettings({...generalSettings, language: e.target.value})}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
            >
              <option value="English" className="bg-gray-800">English</option>
              <option value="Hindi" className="bg-gray-800">Hindi</option>
              <option value="Spanish" className="bg-gray-800">Spanish</option>
            </select>
          </div>
        </div>
      </div>
      
      <div>
        <label className="block text-white font-medium mb-2">Address</label>
        <textarea
          value={generalSettings.address}
          onChange={(e) => setGeneralSettings({...generalSettings, address: e.target.value})}
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm resize-none"
          rows="3"
        />
      </div>
      
      <button
        onClick={() => handleSaveSettings('General')}
        className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 flex items-center gap-2 shadow-lg"
      >
        <Save className="w-4 h-4" />
        Save Changes
      </button>
    </div>
  );

  const renderProfileSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-6">
        <div className="w-24 h-24 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
          {profileSettings.fullName.split(' ').map(n => n[0]).join('')}
        </div>
        <div>
          <button className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-2 rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all duration-300 flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Upload Photo
          </button>
          <p className="text-white/60 text-sm mt-2">JPG, PNG up to 2MB</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-white font-medium mb-2">Full Name</label>
            <input
              type="text"
              value={profileSettings.fullName}
              onChange={(e) => setProfileSettings({...profileSettings, fullName: e.target.value})}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
            />
          </div>
          <div>
            <label className="block text-white font-medium mb-2">Email Address</label>
            <input
              type="email"
              value={profileSettings.email}
              onChange={(e) => setProfileSettings({...profileSettings, email: e.target.value})}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
            />
          </div>
          <div>
            <label className="block text-white font-medium mb-2">Phone Number</label>
            <input
              type="tel"
              value={profileSettings.phone}
              onChange={(e) => setProfileSettings({...profileSettings, phone: e.target.value})}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <div className="text-white/60 text-sm mb-1">Role</div>
            <div className="text-white font-medium">{profileSettings.role}</div>
          </div>
          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <div className="text-white/60 text-sm mb-1">Last Login</div>
            <div className="text-white font-medium">{profileSettings.lastLogin}</div>
          </div>
          <button
            onClick={() => setShowPasswordModal(true)}
            className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 rounded-xl hover:from-orange-600 hover:to-red-700 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Key className="w-4 h-4" />
            Change Password
          </button>
        </div>
      </div>
      
      <button
        onClick={() => handleSaveSettings('Profile')}
        className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 flex items-center gap-2 shadow-lg"
      >
        <Save className="w-4 h-4" />
        Save Profile
      </button>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-white">General Notifications</h4>
          {[
            { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive notifications via email' },
            { key: 'smsNotifications', label: 'SMS Notifications', desc: 'Receive text messages for important alerts' },
            { key: 'pushNotifications', label: 'Push Notifications', desc: 'Browser and app notifications' }
          ].map((setting) => (
            <div key={setting.key} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
              <div>
                <div className="text-white font-medium">{setting.label}</div>
                <div className="text-white/60 text-sm">{setting.desc}</div>
              </div>
              <button
                onClick={() => setNotificationSettings({...notificationSettings, [setting.key]: !notificationSettings[setting.key]})}
                className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                  notificationSettings[setting.key] ? 'bg-gradient-to-r from-blue-500 to-indigo-600' : 'bg-white/20'
                }`}
              >
                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${
                  notificationSettings[setting.key] ? 'translate-x-6' : 'translate-x-0'
                }`} />
              </button>
            </div>
          ))}
        </div>
        
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-white">Specific Alerts</h4>
          {[
            { key: 'bookingAlerts', label: 'Booking Alerts', desc: 'New appointment notifications' },
            { key: 'callbackAlerts', label: 'Callback Alerts', desc: 'Customer callback requests' },
            { key: 'systemAlerts', label: 'System Alerts', desc: 'System maintenance and updates' },
            { key: 'marketingEmails', label: 'Marketing Emails', desc: 'Promotional content and newsletters' }
          ].map((setting) => (
            <div key={setting.key} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
              <div>
                <div className="text-white font-medium">{setting.label}</div>
                <div className="text-white/60 text-sm">{setting.desc}</div>
              </div>
              <button
                onClick={() => setNotificationSettings({...notificationSettings, [setting.key]: !notificationSettings[setting.key]})}
                className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                  notificationSettings[setting.key] ? 'bg-gradient-to-r from-blue-500 to-indigo-600' : 'bg-white/20'
                }`}
              >
                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${
                  notificationSettings[setting.key] ? 'translate-x-6' : 'translate-x-0'
                }`} />
              </button>
            </div>
          ))}
        </div>
      </div>
      
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-white">Report Frequency</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { key: 'weeklyReports', label: 'Weekly Reports', desc: 'Business summary every week' },
            { key: 'monthlyReports', label: 'Monthly Reports', desc: 'Comprehensive monthly analytics' }
          ].map((setting) => (
            <div key={setting.key} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
              <div>
                <div className="text-white font-medium">{setting.label}</div>
                <div className="text-white/60 text-sm">{setting.desc}</div>
              </div>
              <button
                onClick={() => setNotificationSettings({...notificationSettings, [setting.key]: !notificationSettings[setting.key]})}
                className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                  notificationSettings[setting.key] ? 'bg-gradient-to-r from-blue-500 to-indigo-600' : 'bg-white/20'
                }`}
              >
                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${
                  notificationSettings[setting.key] ? 'translate-x-6' : 'translate-x-0'
                }`} />
              </button>
            </div>
          ))}
        </div>
      </div>
      
      <button
        onClick={() => handleSaveSettings('Notification')}
        className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 flex items-center gap-2 shadow-lg"
      >
        <Save className="w-4 h-4" />
        Save Preferences
      </button>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-white">Authentication</h4>
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
            <div>
              <div className="text-white font-medium">Two-Factor Authentication</div>
              <div className="text-white/60 text-sm">Add extra security to your account</div>
            </div>
            <button
              onClick={() => setSecuritySettings({...securitySettings, twoFactorAuth: !securitySettings.twoFactorAuth})}
              className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                securitySettings.twoFactorAuth ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-white/20'
              }`}
            >
              <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${
                securitySettings.twoFactorAuth ? 'translate-x-6' : 'translate-x-0'
              }`} />
            </button>
          </div>

          <div>
            <label className="block text-white font-medium mb-2">Session Timeout (minutes)</label>
            <select
              value={securitySettings.sessionTimeout}
              onChange={(e) => setSecuritySettings({...securitySettings, sessionTimeout: e.target.value})}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
            >
              <option value="15" className="bg-gray-800">15 minutes</option>
              <option value="30" className="bg-gray-800">30 minutes</option>
              <option value="60" className="bg-gray-800">1 hour</option>
              <option value="120" className="bg-gray-800">2 hours</option>
            </select>
          </div>

          <div>
            <label className="block text-white font-medium mb-2">Password Expiry (days)</label>
            <select
              value={securitySettings.passwordExpiry}
              onChange={(e) => setSecuritySettings({...securitySettings, passwordExpiry: e.target.value})}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
            >
              <option value="30" className="bg-gray-800">30 days</option>
              <option value="60" className="bg-gray-800">60 days</option>
              <option value="90" className="bg-gray-800">90 days</option>
              <option value="never" className="bg-gray-800">Never</option>
            </select>
          </div>
        </div>
        
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-white">Access Control</h4>
          <div>
            <label className="block text-white font-medium mb-2">Max Login Attempts</label>
            <select
              value={securitySettings.maxLoginAttempts}
              onChange={(e) => setSecuritySettings({...securitySettings, maxLoginAttempts: e.target.value})}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
            >
              <option value="3" className="bg-gray-800">3 attempts</option>
              <option value="5" className="bg-gray-800">5 attempts</option>
              <option value="10" className="bg-gray-800">10 attempts</option>
            </select>
          </div>

          {[
            { key: 'loginAlerts', label: 'Login Alerts', desc: 'Notify about new logins' },
            { key: 'requireStrongPassword', label: 'Require Strong Password', desc: 'Enforce complex passwords' },
            { key: 'allowMultipleSessions', label: 'Allow Multiple Sessions', desc: 'Login from multiple devices' }
          ].map((setting) => (
            <div key={setting.key} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
              <div>
                <div className="text-white font-medium">{setting.label}</div>
                <div className="text-white/60 text-sm">{setting.desc}</div>
              </div>
              <button
                onClick={() => setSecuritySettings({...securitySettings, [setting.key]: !securitySettings[setting.key]})}
                className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                  securitySettings[setting.key] ? 'bg-gradient-to-r from-blue-500 to-indigo-600' : 'bg-white/20'
                }`}
              >
                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${
                  securitySettings[setting.key] ? 'translate-x-6' : 'translate-x-0'
                }`} />
              </button>
            </div>
          ))}
        </div>
      </div>
      
      <button
        onClick={() => handleSaveSettings('Security')}
        className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 flex items-center gap-2 shadow-lg"
      >
        <Save className="w-4 h-4" />
        Save Security Settings
      </button>
    </div>
  );

  const renderSystemSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-white">System Control</h4>
          {[
            { key: 'maintenanceMode', label: 'Maintenance Mode', desc: 'Enable for system updates' },
            { key: 'debugMode', label: 'Debug Mode', desc: 'Enable detailed logging' },
            { key: 'autoBackup', label: 'Automatic Backup', desc: 'Schedule regular backups' },
            { key: 'cacheEnabled', label: 'Cache Enabled', desc: 'Improve system performance' }
          ].map((setting) => (
            <div key={setting.key} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
              <div>
                <div className="text-white font-medium">{setting.label}</div>
                <div className="text-white/60 text-sm">{setting.desc}</div>
              </div>
              <button
                onClick={() => setSystemSettings({...systemSettings, [setting.key]: !systemSettings[setting.key]})}
                className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                  systemSettings[setting.key] ? 'bg-gradient-to-r from-blue-500 to-indigo-600' : 'bg-white/20'
                }`}
              >
                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${
                  systemSettings[setting.key] ? 'translate-x-6' : 'translate-x-0'
                }`} />
              </button>
            </div>
          ))}
        </div>
        
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-white">Data Management</h4>
          <div>
            <label className="block text-white font-medium mb-2">Backup Frequency</label>
            <select
              value={systemSettings.backupFrequency}
              onChange={(e) => setSystemSettings({...systemSettings, backupFrequency: e.target.value})}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
            >
              <option value="hourly" className="bg-gray-800">Hourly</option>
              <option value="daily" className="bg-gray-800">Daily</option>
              <option value="weekly" className="bg-gray-800">Weekly</option>
            </select>
          </div>
          
          <div>
            <label className="block text-white font-medium mb-2">Data Retention (days)</label>
            <select
              value={systemSettings.retentionPeriod}
              onChange={(e) => setSystemSettings({...systemSettings, retentionPeriod: e.target.value})}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
            >
              <option value="30" className="bg-gray-800">30 days</option>
              <option value="60" className="bg-gray-800">60 days</option>
              <option value="90" className="bg-gray-800">90 days</option>
              <option value="365" className="bg-gray-800">1 year</option>
            </select>
          </div>
          
          <div>
            <label className="block text-white font-medium mb-2">Log Level</label>
            <select
              value={systemSettings.logLevel}
              onChange={(e) => setSystemSettings({...systemSettings, logLevel: e.target.value})}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
            >
              <option value="error" className="bg-gray-800">Error Only</option>
              <option value="warn" className="bg-gray-800">Warning</option>
              <option value="info" className="bg-gray-800">Info</option>
              <option value="debug" className="bg-gray-800">Debug</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => handleBackupAction('backup')}
          className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Create Backup
        </button>
        <button
          onClick={() => handleBackupAction('restore')}
          className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-3 rounded-xl hover:from-orange-600 hover:to-red-700 transition-all duration-300 flex items-center gap-2"
        >
          <Upload className="w-4 h-4" />
          Restore Backup
        </button>
        <button
          onClick={() => handleSaveSettings('System')}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 flex items-center gap-2 shadow-lg"
        >
          <Save className="w-4 h-4" />
          Save Settings
        </button>
      </div>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-white">Theme Settings</h4>
          <div>
            <label className="block text-white font-medium mb-2">Theme</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'dark', label: 'Dark', icon: Moon },
                { value: 'light', label: 'Light', icon: Sun },
                { value: 'auto', label: 'Auto', icon: Monitor }
              ].map((theme) => (
                <button
                  key={theme.value}
                  onClick={() => setAppearanceSettings({...appearanceSettings, theme: theme.value})}
                  className={`p-4 rounded-xl border transition-all duration-300 flex flex-col items-center gap-2 ${
                    appearanceSettings.theme === theme.value
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 border-blue-500 text-white'
                      : 'bg-white/5 border-white/20 text-white/70 hover:bg-white/10'
                  }`}
                >
                  <theme.icon className="w-6 h-6" />
                  <span className="text-sm font-medium">{theme.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-white font-medium mb-2">Primary Color</label>
            <div className="flex gap-3">
              {[
                '#3B82F6', '#8B5CF6', '#EF4444', '#10B981', '#F59E0B', '#EC4899'
              ].map((color) => (
                <button
                  key={color}
                  onClick={() => setAppearanceSettings({...appearanceSettings, primaryColor: color})}
                  className={`w-10 h-10 rounded-lg transition-all duration-300 ${
                    appearanceSettings.primaryColor === color ? 'ring-2 ring-white scale-110' : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-white font-medium mb-2">Font Size</label>
            <select
              value={appearanceSettings.fontSize}
              onChange={(e) => setAppearanceSettings({...appearanceSettings, fontSize: e.target.value})}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
            >
              <option value="small" className="bg-gray-800">Small</option>
              <option value="medium" className="bg-gray-800">Medium</option>
              <option value="large" className="bg-gray-800">Large</option>
            </select>
          </div>
        </div>
        
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-white">Layout Options</h4>
          {[
            { key: 'compactMode', label: 'Compact Mode', desc: 'Reduce spacing and padding' },
            { key: 'animations', label: 'Enable Animations', desc: 'Smooth transitions and effects' }
          ].map((setting) => (
            <div key={setting.key} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
              <div>
                <div className="text-white font-medium">{setting.label}</div>
                <div className="text-white/60 text-sm">{setting.desc}</div>
              </div>
              <button
                onClick={() => setAppearanceSettings({...appearanceSettings, [setting.key]: !appearanceSettings[setting.key]})}
                className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                  appearanceSettings[setting.key] ? 'bg-gradient-to-r from-blue-500 to-indigo-600' : 'bg-white/20'
                }`}
              >
                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${
                  appearanceSettings[setting.key] ? 'translate-x-6' : 'translate-x-0'
                }`} />
              </button>
            </div>
          ))}

          <div>
            <label className="block text-white font-medium mb-2">Sidebar Default</label>
            <select
              value={appearanceSettings.sidebar}
              onChange={(e) => setAppearanceSettings({...appearanceSettings, sidebar: e.target.value})}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
            >
              <option value="expanded" className="bg-gray-800">Expanded</option>
              <option value="collapsed" className="bg-gray-800">Collapsed</option>
              <option value="hidden" className="bg-gray-800">Hidden</option>
            </select>
          </div>
        </div>
      </div>
      
      <button
        onClick={() => handleSaveSettings('Appearance')}
        className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 flex items-center gap-2 shadow-lg"
      >
        <Save className="w-4 h-4" />
        Save Appearance
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">System Settings</h2>
          <p className="text-white/60">Configure system preferences and security options</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => handleBackupAction('reset')}
            className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl transition-all duration-300 flex items-center gap-2 border border-white/20 hover:border-white/30"
          >
            <RefreshCw className="w-4 h-4" />
            Reset to Default
          </button>
        </div>
      </div>

      {/* System Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {systemStats.map((stat, index) => (
          <StatCard
            key={index}
            {...stat}
            delay={index * 0.1}
          />
        ))}
      </div>

      {/* Settings Navigation */}
      <div className="bg-white/5 backdrop-blur-2xl rounded-2xl p-6 border border-white/10">
        <div className="flex flex-wrap gap-2">
          {settingsTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                activeTab === tab.id
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

      {/* Settings Content */}
      <div className="bg-white/5 backdrop-blur-2xl rounded-2xl p-8 border border-white/10">
        {activeTab === 'general' && renderGeneralSettings()}
        {activeTab === 'profile' && renderProfileSettings()}
        {activeTab === 'notifications' && renderNotificationSettings()}
        {activeTab === 'security' && renderSecuritySettings()}
        {activeTab === 'system' && renderSystemSettings()}
        {activeTab === 'appearance' && renderAppearanceSettings()}
      </div>

      {/* Password Change Modal */}
      <Modal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        title="Change Password"
        size="md"
      >
        <div className="space-y-6">
          <div>
            <label className="block text-white font-medium mb-2">Current Password</label>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                className="w-full px-4 py-3 pr-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white"
              >
                {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-white font-medium mb-2">New Password</label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                className="w-full px-4 py-3 pr-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white"
              >
                {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-white font-medium mb-2">Confirm New Password</label>
            <input
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
              placeholder="Confirm new password"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowPasswordModal(false)}
              className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-medium transition-all duration-300 border border-white/20"
            >
              Cancel
            </button>
            <button
              onClick={handlePasswordChange}
              className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 rounded-xl font-medium hover:from-orange-600 hover:to-red-700 transition-all duration-300"
            >
              Change Password
            </button>
          </div>
        </div>
      </Modal>

      {/* Confirm Action Modal */}
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={confirmAction}
        title={`Confirm ${actionType.charAt(0).toUpperCase() + actionType.slice(1)}`}
        message={
          actionType === 'backup' ? 'Are you sure you want to create a system backup?' :
          actionType === 'restore' ? 'Are you sure you want to restore from backup? This will overwrite current data.' :
          actionType === 'reset' ? 'Are you sure you want to reset all settings to default? This action cannot be undone.' :
          'Are you sure you want to proceed?'
        }
        confirmText={actionType === 'reset' ? 'Reset' : 'Confirm'}
        cancelText="Cancel"
        type={actionType === 'restore' || actionType === 'reset' ? 'danger' : 'default'}
      />
    </div>
  );
}