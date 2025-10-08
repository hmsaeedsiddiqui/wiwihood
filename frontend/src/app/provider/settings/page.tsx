'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { User, Shield, Bell, Save, Camera, Trash2, Settings, Mail, Phone, MapPin, Globe } from 'lucide-react';
import QRTIntegration from '@/utils/qrtIntegration';
import axios from 'axios';

// Custom Hook to track window width
const useWindowWidth = () => {
  const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return width;
};

const SettingsPage = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [userData, setUserData] = useState(null);
  
  // Form data states
  const [profileData, setProfileData] = useState({
    businessName: '',
    ownerName: '',
    email: '',
    phone: '',
    address: '',
    description: '',
    website: '',
    country: 'United Arab Emirates',
    timezone: 'GST (UTC+4)',
    profilePicture: ''
  });

  const [securityData, setSecurityData] = useState({
    twoFactorEnabled: false,
    lastPasswordChange: '',
    loginAlerts: true,
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notificationData, setNotificationData] = useState({
    emailNotifications: true,
    smsNotifications: false,
    bookingAlerts: true,
    marketingEmails: false,
    weeklyReports: true
  });
  
  const windowWidth = useWindowWidth();
  const isMobile = windowWidth < 768;

  // Fetch user data on component mount
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      console.log('🚀 Settings: Fetching user data...');
      
      // Use QRT Integration for auth profile
      const userData = await QRTIntegration.getAuthProfile();
      
      if (userData) {
        console.log('✅ Settings: User data loaded:', userData.firstName, userData.lastName);
        setUserData(userData);
        
        // Update profile data
        setProfileData({
          businessName: userData.businessName || `${userData.firstName} ${userData.lastName}`,
          ownerName: `${userData.firstName} ${userData.lastName}`,
          email: userData.email || '',
          phone: userData.phone || '',
          address: userData.address || '',
          description: userData.bio || '',
          website: userData.website || '',
          country: userData.country || 'United Arab Emirates',
          timezone: userData.timezone || 'GST (UTC+4)',
          profilePicture: userData.profilePicture || ''
        });
        
        setError('');
      } else {
        console.warn('⚠️ Settings: No user data available');
        setError('Failed to load user data');
      }
    } catch (error) {
      console.error('❌ Settings: Error fetching user data:', error);
      setError('Failed to load settings data');
    } finally {
      setLoading(false);
    }
  }; 

  const settingSections = [
    { id: 'profile', label: 'Profile Settings', icon: User },
    { id: 'account', label: 'Account & Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell }
  ];

  // Save functions
  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      console.log('💾 Settings: Saving profile data...');
      
      const token = localStorage.getItem('providerToken');
      if (!token) {
        setError('Authentication token not found');
        return;
      }

      // Update profile via API
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"}/auth/profile`,
        {
          firstName: profileData.ownerName.split(' ')[0],
          lastName: profileData.ownerName.split(' ').slice(1).join(' '),
          email: profileData.email,
          phone: profileData.phone,
          address: profileData.address,
          bio: profileData.description,
          website: profileData.website,
          country: profileData.country,
          timezone: profileData.timezone
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        }
      );

      if (response.data) {
        console.log('✅ Settings: Profile updated successfully');
        setShowSaveSuccess(true);
        setTimeout(() => setShowSaveSuccess(false), 3000);
        setError('');
      }
    } catch (error) {
      console.error('❌ Settings: Error saving profile:', error);
      setError('Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleSave = () => {
    switch (activeSection) {
      case 'profile':
        handleSaveProfile();
        break;
      default:
        setShowSaveSuccess(true);
        setTimeout(() => setShowSaveSuccess(false), 3000);
        break;
    }
  };

  // --- Render Profile Settings (Optimized for Mobile) ---
  const renderProfileSettings = () => (
    <div className="flex flex-col gap-6">
      <h2 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-semibold text-slate-800 m-0`}>
        Profile Settings
      </h2>

      {/* Profile Photo */}
      <div className={`bg-white rounded-xl border border-slate-200 ${isMobile ? 'p-4' : 'p-6'}`}>
        <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold text-slate-800 mb-4`}>
          Profile Photo
        </h3>
        <div className={`flex ${isMobile ? 'flex-col items-start gap-4' : 'flex-row items-center gap-5'}`}>
          <div className={`${isMobile ? 'w-15 h-15' : 'w-20 h-20'} rounded-full bg-slate-100 flex items-center justify-center ${isMobile ? 'text-2xl' : 'text-3xl'} font-semibold text-slate-500`}>
            JS
          </div>
          <div className="flex gap-3">
            <button className="bg-green-500 text-white px-4 py-2 rounded-md border-none text-sm font-medium cursor-var-pointer">
              Upload New Photo
            </button>
            <button className="bg-transparent text-slate-500 px-4 py-2 rounded-md border border-slate-200 text-sm font-medium cursor-var-pointer">
              Remove
            </button>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className={`bg-white rounded-xl border border-slate-200 ${isMobile ? 'p-4' : 'p-6'}`}>
        <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold text-slate-800 mb-5`}>
          Personal Information
        </h3>
        {/* Change grid to single column on mobile */}
        <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-5`}>
          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name
            </label>
            <input
              type="text"
              defaultValue="John"
              className={`w-full ${isMobile ? 'px-2.5 py-2' : 'px-3 py-2.5'} rounded-md border border-slate-200 text-sm outline-none`}
            />
          </div>
          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name
            </label>
            <input
              type="text"
              defaultValue="Smith"
              className={`w-full ${isMobile ? 'px-2.5 py-2' : 'px-3 py-2.5'} rounded-md border border-slate-200 text-sm outline-none`}
            />
          </div>
          {/* Professional Title - always span full width */}
          <div className={isMobile ? 'col-span-1' : 'col-span-2'}> 
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Professional Title
            </label>
            <input
              type="text"
              defaultValue="Freelance Designer & Developer"
              className={`w-full ${isMobile ? 'px-2.5 py-2' : 'px-3 py-2.5'} rounded-md border border-slate-200 text-sm outline-none`}
            />
          </div>
          {/* Bio - always span full width */}
          <div className={isMobile ? 'col-span-1' : 'col-span-2'}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio
            </label>
            <textarea
              defaultValue="Experienced designer and developer with 5+ years in creating beautiful, functional digital experiences."
              rows={4}
              className={`w-full ${isMobile ? 'px-2.5 py-2' : 'px-3 py-2.5'} rounded-md border border-slate-200 text-sm resize-y outline-none font-inherit`}
            />
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className={`bg-white rounded-xl border border-slate-200 ${isMobile ? 'p-4' : 'p-6'}`}>
        <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold text-slate-800 mb-5`}>
          Contact Information
        </h3>
        {/* Change grid to single column on mobile */}
        <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-5`}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              defaultValue="john.smith@example.com"
              className={`w-full ${isMobile ? 'px-2.5 py-2' : 'px-3 py-2.5'} rounded-md border border-slate-200 text-sm outline-none`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              defaultValue="+1 (555) 123-4567"
              className={`w-full ${isMobile ? 'px-2.5 py-2' : 'px-3 py-2.5'} rounded-md border border-slate-200 text-sm outline-none`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Country
            </label>
            <select className={`w-full ${isMobile ? 'px-2.5 py-2' : 'px-3 py-2.5'} rounded-md border border-slate-200 text-sm bg-white outline-none cursor-var-pointer`}>
              <option>United States</option>
              <option>Canada</option>
              <option>United Kingdom</option>
              <option>Australia</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time Zone
            </label>
            <select className={`w-full ${isMobile ? 'px-2.5 py-2' : 'px-3 py-2.5'} rounded-md border border-slate-200 text-sm bg-white outline-none cursor-var-pointer`}>
              <option>EST (UTC-5)</option>
              <option>PST (UTC-8)</option>
              <option>GMT (UTC+0)</option>
              <option>CET (UTC+1)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  // --- Render Account Settings (Optimized for Mobile) ---
  const renderAccountSettings = () => (
    <div className="flex flex-col gap-6">
      <h2 className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold text-slate-800 m-0`}>
        Account & Security
      </h2>

      {/* Password */}
      <div className={`bg-white rounded-xl border border-slate-200 ${isMobile ? 'p-4' : 'p-6'}`}>
        <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold text-slate-800 mb-4`}>
          Password
        </h3>
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Password
            </label>
            <input
              type="password"
              className={`w-full ${isMobile ? 'px-2.5 py-2' : 'px-3 py-2.5'} rounded-md border border-slate-200 text-sm outline-none`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <input
              type="password"
              className={`w-full ${isMobile ? 'px-2.5 py-2' : 'px-3 py-2.5'} rounded-md border border-slate-200 text-sm outline-none`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              className={`w-full ${isMobile ? 'px-2.5 py-2' : 'px-3 py-2.5'} rounded-md border border-slate-200 text-sm outline-none`}
            />
          </div>
          <button className="bg-green-500 text-white px-5 py-2.5 rounded-md border-0 text-sm font-semibold cursor-var-pointer self-start">
            Update Password
          </button>
        </div>
      </div>

      {/* Two-Factor Authentication */}
      <div className={`bg-white rounded-xl border border-slate-200 ${isMobile ? 'p-4' : 'p-6'}`}>
        <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold text-slate-800 mb-4`}>
          Two-Factor Authentication
        </h3>
        {/* Adjust layout for mobile */}
        <div className={`flex ${isMobile ? 'flex-col items-start gap-4' : 'flex-row justify-between items-center'}`}>
          <div>
            <p className="text-sm text-gray-700 m-0 mb-1">
              Add an extra layer of security to your account
            </p>
            <p className="text-xs text-slate-500 m-0">
              Status: <span className="text-red-500 font-medium">Disabled</span>
            </p>
          </div>
          <button className={`bg-green-500 text-white px-5 py-2.5 rounded-md border-0 text-sm font-semibold cursor-var-pointer ${isMobile ? 'w-full' : 'w-auto'}`}>
            Enable 2FA
          </button>
        </div>
      </div>

      {/* Active Sessions */}
      <div className={`bg-white rounded-xl border border-slate-200 ${isMobile ? 'p-4' : 'p-6'}`}>
        <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold text-slate-800 mb-4`}>
          Active Sessions
        </h3>
        <div className="flex flex-col gap-3">
          <div className={`flex ${isMobile ? 'flex-col items-start gap-2' : 'flex-row justify-between items-center'} p-3 bg-slate-50 rounded-md`}>
            <div>
              <div className="text-sm font-medium text-slate-800">
                💻 Desktop - Chrome (Current)
              </div>
              <div className="text-xs text-slate-500">
                New York, USA • 2 minutes ago
              </div>
            </div>
            <span className="bg-green-100 text-green-600 px-2 py-0.5 rounded-xl text-xs font-medium">
              Current
            </span>
          </div>
          <div className={`flex ${isMobile ? 'flex-col items-start gap-2' : 'flex-row justify-between items-center'} p-3 bg-slate-50 rounded-md`}>
            <div>
              <div className="text-sm font-medium text-slate-800">
                📱 Mobile - Safari
              </div>
              <div className="text-xs text-slate-500">
                New York, USA • 2 hours ago
              </div>
            </div>
            <button className="bg-red-100 text-red-600 px-2 py-1 rounded border-0 text-xs cursor-var-pointer">
              End Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // --- Render Notification Settings (Optimized for Mobile) ---
  const renderNotificationSettings = () => (
    <div className="flex flex-col gap-6">
      <h2 className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold text-slate-800 m-0`}>
        Notification Preferences
      </h2>

      {/* Email Notifications */}
      <div className={`bg-white rounded-xl border border-slate-200 ${isMobile ? 'p-4' : 'p-6'}`}>
        <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold text-slate-800 mb-5`}>
          Email Notifications
        </h3>
        <div className="flex flex-col gap-4">
          {[
            { id: 'orders', label: 'New Orders', description: 'Get notified when you receive new orders' },
            { id: 'messages', label: 'Messages', description: 'Get notified when clients send you messages' },
            { id: 'reviews', label: 'Reviews', description: 'Get notified when you receive new reviews' },
            { id: 'payments', label: 'Payments', description: 'Get notified about payment confirmations' },
            { id: 'marketing', label: 'Marketing Updates', description: 'Receive tips and platform updates' }
          ].map(item => (
            <div key={item.id} className={`flex ${isMobile ? 'flex-col items-start gap-2' : 'flex-row justify-between items-center'}`}>
              <div>
                <div className="text-sm font-medium text-slate-800">
                  {item.label}
                </div>
                <div className="text-xs text-slate-500">
                  {item.description}
                </div>
              </div>
              <label className="flex items-center cursor-var-pointer">
                <input type="checkbox" defaultChecked className="mr-2 hidden" />
                {/* Custom Toggle Switch for better mobile experience */}
                <div className="w-10 h-5 rounded-full bg-green-500 relative">
                  <div className="w-4 h-4 rounded-full bg-white absolute top-0.5 right-0.5 transition-all duration-200"></div>
                </div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Push Notifications */}
      <div className={`bg-white rounded-xl border border-slate-200 ${isMobile ? 'p-4' : 'p-6'}`}>
        <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold text-slate-800 mb-5`}>
          Push Notifications
        </h3>
        {/* Adjust layout for mobile */}
        <div className={`flex ${isMobile ? 'flex-col items-start gap-4' : 'flex-row justify-between items-center'}`}>
          <div>
            <div className="text-sm font-medium text-slate-800">
              Browser Push Notifications
            </div>
            <div className="text-xs text-slate-500">
              Receive real-time notifications in your browser
            </div>
          </div>
          <button className={`bg-green-500 text-white px-4 py-2 rounded-md border-0 text-sm font-medium cursor-var-pointer ${isMobile ? 'w-full' : 'w-auto'}`}>
            Enable
          </button>
        </div>
      </div>
    </div>
  );

  // --- Main Render Section logic ---
  const renderSection = () => {
    switch(activeSection) {
      case 'profile': return renderProfileSettings();
      case 'account': return renderAccountSettings();
      case 'notifications': return renderNotificationSettings();
      default: 
        return (
          <div className="text-center p-15 bg-white rounded-xl border border-slate-200">
            <div className="text-5xl mb-4">🚧</div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              Coming Soon
            </h3>
            <p className="text-slate-500">
              This section is under development and will be available soon.
            </p>
          </div>
        );
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Settings</h2>
          <p className="text-gray-600">Fetching your account data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-8">
          <div className="text-white">
            <h1 className="text-4xl font-bold mb-2 drop-shadow-lg flex items-center">
              <Settings className="mr-3 h-10 w-10" />
              Settings
            </h1>
            <p className="text-white/90 text-lg">Manage your account settings and preferences</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Enhanced Main Content Grid */}
        <div className={`grid ${isMobile ? 'grid-cols-1 gap-6' : 'grid-cols-[320px_1fr] gap-8'}`}>
          
          {/* Enhanced Settings Navigation */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 h-fit p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Settings Menu</h3>
            <nav className={`flex ${isMobile ? 'flex-row gap-2 overflow-x-auto pb-2' : 'flex-col gap-2'}`}>
              {settingSections.map(section => {
                const IconComponent = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all font-medium ${
                      activeSection === section.id
                        ? 'bg-gradient-to-r from-orange-500 to-pink-600 text-white shadow-lg'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-orange-600'
                    } ${isMobile ? 'min-w-max' : 'w-full'}`}
                  >
                    <IconComponent className="h-5 w-5" />
                    <span className={isMobile ? 'text-sm' : 'text-base'}>{section.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Enhanced Settings Content */}
          <div className="relative">
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center">
                  <div className="text-red-600 mr-3">⚠️</div>
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            )}

            {showSaveSuccess && (
              <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-center">
                  <div className="text-green-600 mr-3">✅</div>
                  <p className="text-green-700">Settings saved successfully!</p>
                </div>
              </div>
            )}

            {renderSection()}
            
            {/* Enhanced Save Button Bar */}
            <div className="mt-8 flex justify-end gap-4 bg-white rounded-xl border border-gray-100 p-6">
              <button 
                className="px-6 py-3 text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                onClick={() => fetchUserData()}
              >
                Reset
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-8 py-3 bg-gradient-to-r from-orange-500 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold flex items-center disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;