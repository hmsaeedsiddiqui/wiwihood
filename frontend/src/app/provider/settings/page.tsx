'use client';

import React, { useState, useEffect, useMemo } from 'react';

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
  
  const windowWidth = useWindowWidth();
  // Define mobile breakpoint
  const isMobile = windowWidth < 768; 

  // Mock settings data (kept for completeness, but state is not used for form inputs)
  const settingsData = {
    // ... (Your settingsData object remains the same)
    profile: {
      businessName: "John Smith Freelancer",
      ownerName: "John Smith", 
      email: "john.smith@example.com",
      phone: "+1 (555) 123-4567",
      address: "123 Main St, Downtown City",
      description: "Professional freelance designer and developer with 5+ years of experience in creating beautiful, functional digital experiences.",
      website: "https://johnsmith.dev",
      socialMedia: {
        instagram: "@johnsmith_dev",
        facebook: "John Smith Developer",
        twitter: "@johnsmith_dev"
      }
    },
    business: {
      category: "Design & Development",
      licenseNumber: "DEV-2023-001",
      taxId: "XX-XXXXXXX",
      businessHours: {
        monday: { open: "09:00", close: "18:00", closed: false },
        tuesday: { open: "09:00", close: "18:00", closed: false },
        wednesday: { open: "09:00", close: "18:00", closed: false },
        thursday: { open: "09:00", close: "18:00", closed: false },
        friday: { open: "09:00", close: "18:00", closed: false },
        saturday: { open: "10:00", close: "16:00", closed: false },
        sunday: { open: "", close: "", closed: true }
      }
    },
    notifications: {
      emailNotifications: {
        newBookings: true,
        cancellations: true,
        reviews: true,
        payments: true,
        marketing: false
      },
      smsNotifications: {
        newBookings: true,
        cancellations: true,
        reminders: true
      },
      pushNotifications: {
        newBookings: true,
        reviews: true,
        promotions: false
      }
    },
    payment: {
      bankAccount: {
        accountHolder: "John Smith",
        bankName: "Chase Bank",
        accountNumber: "****1234",
        routingNumber: "****5678",
        accountType: "Checking"
      },
      paypal: {
        email: "john.smith@example.com",
        connected: true
      },
      stripe: {
        accountId: "acct_xxxxxxxxx",
        connected: true
      }
    },
    booking: {
      advanceBooking: 30,
      cancellationPolicy: 24,
      bufferTime: 15,
      autoAcceptBookings: false,
      requireDeposit: true,
      depositPercentage: 25,
      maxBookingsPerDay: 10
    },
    security: {
      twoFactorEnabled: false,
      lastPasswordChange: "2025-06-15",
      loginAlerts: true
    }
  };

  const settingSections = [
    { id: 'profile', label: 'Profile Settings', icon: '👤' },
    { id: 'account', label: 'Account & Security', icon: '🔒' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' }
  ];

  const handleSave = () => {
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 3000);
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

  return (
    <div className={`min-h-screen bg-slate-50 `}>
      <div className="">
        {/* Header */}
        <div className={`${isMobile ? 'mb-5' : 'mb-8'}`}>
          <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-slate-800 mb-2`}>
            Settings
          </h1>
          <p className={`text-slate-500 ${isMobile ? 'text-sm' : 'text-base'}`}>
            Manage your account settings and preferences
          </p>
        </div>

        {/* Main Content Grid (Changed to stack on mobile) */}
        <div className={`grid ${isMobile ? 'grid-cols-1 gap-5' : 'grid-cols-[280px_1fr] gap-8'}`}>
          
          {/* Settings Navigation (Full width on mobile) */}
          <div className={`bg-white rounded-xl shadow-sm border border-slate-200 h-fit ${isMobile ? 'p-2.5' : 'p-5'}`}>
            <h3 className={`${isMobile ? 'text-sm' : 'text-base'} font-semibold text-slate-800 ${isMobile ? 'mb-2' : 'mb-4'}`}>
              Settings
            </h3>
            <nav className={`flex ${isMobile ? 'flex-row gap-1 overflow-x-auto pb-1' : 'flex-col gap-1'}`}>
              {settingSections.map(section => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center gap-3 ${isMobile ? 'flex-shrink-0 px-3 py-2.5' : 'w-full px-4 py-3'} rounded-lg border-0 text-sm font-medium cursor-var-pointer text-left transition-all duration-200 ${
                    activeSection === section.id 
                      ? 'bg-sky-50 text-sky-700' 
                      : 'bg-transparent text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-base">{section.icon}</span>
                  {section.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Settings Content */}
          <div className="relative">
            {renderSection()}
            
            {/* Save Button Bar */}
            {(activeSection === 'profile' || activeSection === 'account' || activeSection === 'notifications') && (
              <div className={`${isMobile ? 'mt-5 sticky bottom-0 left-0 right-0 p-2.5 bg-slate-50 border-t border-slate-200 z-10' : 'mt-8 static p-0 bg-transparent border-t-0 z-auto'} flex justify-end gap-3`}>
                <button className={`bg-slate-100 text-slate-500 px-6 py-3 rounded-lg border border-slate-200 text-sm font-medium cursor-var-pointer ${isMobile ? 'w-1/2' : 'w-auto'}`}>
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className={`bg-green-500 text-white px-6 py-3 rounded-lg border-0 text-sm font-semibold cursor-var-pointer ${isMobile ? 'w-1/2' : 'w-auto'}`}
                >
                  Save Changes
                </button>
              </div>
            )}

            {/* Success Message */}
            {showSaveSuccess && (
              <div className={`fixed ${isMobile ? 'top-20 right-1/2 transform -translate-x-1/2 w-[90%]' : 'top-5 right-5 w-auto'} bg-green-100 text-green-600 px-5 py-3 rounded-lg border border-green-200 text-sm font-medium z-[1000] shadow-lg`}>
                ✅ Settings saved successfully!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;