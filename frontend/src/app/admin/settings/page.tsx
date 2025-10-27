'use client';

import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Save, 
  Globe, 
  Mail, 
  Shield, 
  CreditCard, 
  Bell, 
  Users, 
  Database,
  Smartphone,
  Eye,
  EyeOff,
  Check,
  AlertTriangle,
  Info
} from 'lucide-react';
import { adminApi } from '../../../lib/adminApi';

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    // General Settings
    siteName: 'Wiwihood',
    siteDescription: 'Professional booking platform for service providers',
    contactEmail: 'support@wiwihood.com',
    supportPhone: '+971 (50) 123-4567',
    timezone: 'Asia/Dubai',
    language: 'en',
    currency: 'AED',
    
    // Email Settings
    emailProvider: 'smtp',
    smtpHost: 'smtp.gmail.com',
    smtpPort: '587',
    smtpUsername: 'noreply@wiwihood.com',
    smtpPassword: '********',
    emailFromName: 'Wiwihood',
    emailFromAddress: 'noreply@wiwihood.com',
    
    // Payment Settings
    stripePublishableKey: 'pk_test_...',
    stripeSecretKey: '********',
    paypalClientId: '********',
    paypalClientSecret: '********',
    platformCommission: 10,
    paymentMethods: ['stripe', 'paypal'],
    
    // Security Settings
    sessionTimeout: 30,
    passwordMinLength: 8,
    requireTwoFactor: false,
    allowGoogleAuth: true,
    allowFacebookAuth: true,
    maxLoginAttempts: 5,
    
    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    adminNotifications: true,
    marketingEmails: false,
    
    // Booking Settings
    maxAdvanceBooking: 90,
    minAdvanceBooking: 1,
    defaultBookingDuration: 60,
    allowInstantBooking: true,
    requireBookingApproval: false,
    cancellationPolicy: '24-hours',
    
    // System Settings
    maintenanceMode: false,
    debugMode: false,
    cacheEnabled: true,
    analyticsEnabled: true,
    backupFrequency: 'daily'
  });

  const [showPasswords, setShowPasswords] = useState({
    smtpPassword: false,
    stripeSecretKey: false,
    paypalClientSecret: false
  });

  const [saveStatus, setSaveStatus] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getSettings();
      if (response.settings) {
        setSettings(prev => ({ ...prev, ...response.settings }));
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      await adminApi.updateSettings(settings);
      setSaveStatus('Settings saved successfully!');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (error) {
      console.error('Failed to save settings:', error);
      setSaveStatus('Failed to save settings');
      setTimeout(() => setSaveStatus(''), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    await saveSettings();
  };

  const tabs = [
    { id: 'general', name: 'General', icon: Settings },
    { id: 'email', name: 'Email', icon: Mail },
    { id: 'payment', name: 'Payment', icon: CreditCard },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'booking', name: 'Booking', icon: Users },
    { id: 'system', name: 'System', icon: Database }
  ];

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const SettingCard = ({ title, description, children, warning = false }: {
    title: string;
    description?: string;
    children: React.ReactNode;
    warning?: boolean;
  }) => (
    <div className={`bg-white rounded-lg shadow-md border-2 p-6 transition-all duration-200 hover:shadow-lg ${
      warning 
        ? 'border-orange-200 hover:border-orange-300' 
        : 'border-gray-200 hover:border-orange-200'
    }`}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          {warning && <AlertTriangle className="h-5 w-5 text-orange-500 mr-2" />}
          {title}
        </h3>
        {description && <p className="text-sm text-gray-600 mt-1">{description}</p>}
      </div>
      {children}
    </div>
  );

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <SettingCard title="Site Information" description="Basic information about your platform">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Site Name</label>
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) => handleSettingChange('siteName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
            <input
              type="email"
              value={settings.contactEmail}
              onChange={(e) => handleSettingChange('contactEmail', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Site Description</label>
            <textarea
              value={settings.siteDescription}
              onChange={(e) => handleSettingChange('siteDescription', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>
      </SettingCard>

      <SettingCard title="Localization" description="Configure language, timezone, and currency">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
            <select
              value={settings.timezone}
              onChange={(e) => handleSettingChange('timezone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            >
              <option value="Asia/Dubai">UAE Time (Dubai)</option>
              <option value="Asia/Riyadh">Saudi Arabia Time</option>
              <option value="Asia/Qatar">Qatar Time</option>
              <option value="Asia/Kuwait">Kuwait Time</option>
              <option value="Asia/Bahrain">Bahrain Time</option>
              <option value="Asia/Muscat">Oman Time</option>
              <option value="UTC">UTC</option>
              <option value="America/New_York">Eastern Time</option>
              <option value="Europe/London">London Time</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
            <select
              value={settings.language}
              onChange={(e) => handleSettingChange('language', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            >
              <option value="en">English</option>
              <option value="ar">Arabic (العربية)</option>
              <option value="ur">Urdu (اردو)</option>
              <option value="hi">Hindi (हिन्दी)</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
            <select
              value={settings.currency}
              onChange={(e) => handleSettingChange('currency', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            >
              <option value="AED">AED (د.إ)</option>
              <option value="SAR">SAR (ر.س)</option>
              <option value="QAR">QAR (ر.ق)</option>
              <option value="KWD">KWD (د.ك)</option>
              <option value="BHD">BHD (د.ب)</option>
              <option value="OMR">OMR (ر.ع)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="PKR">PKR (₨)</option>
              <option value="INR">INR (₹)</option>
            </select>
          </div>
        </div>
      </SettingCard>
    </div>
  );

  const renderEmailSettings = () => (
    <div className="space-y-6">
      <SettingCard title="SMTP Configuration" description="Configure email delivery settings">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Host</label>
            <input
              type="text"
              value={settings.smtpHost}
              onChange={(e) => handleSettingChange('smtpHost', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Port</label>
            <input
              type="number"
              value={settings.smtpPort}
              onChange={(e) => handleSettingChange('smtpPort', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
            <input
              type="text"
              value={settings.smtpUsername}
              onChange={(e) => handleSettingChange('smtpUsername', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPasswords.smtpPassword ? 'text' : 'password'}
                value={settings.smtpPassword}
                onChange={(e) => handleSettingChange('smtpPassword', e.target.value)}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('smtpPassword')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPasswords.smtpPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
          </div>
        </div>
      </SettingCard>

      <SettingCard title="Email Templates" description="Configure default email sender information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">From Name</label>
            <input
              type="text"
              value={settings.emailFromName}
              onChange={(e) => handleSettingChange('emailFromName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">From Email</label>
            <input
              type="email"
              value={settings.emailFromAddress}
              onChange={(e) => handleSettingChange('emailFromAddress', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>
      </SettingCard>
    </div>
  );

  const renderPaymentSettings = () => (
    <div className="space-y-6">
      <SettingCard title="Stripe Configuration" description="Configure Stripe payment processing">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Publishable Key</label>
            <input
              type="text"
              value={settings.stripePublishableKey}
              onChange={(e) => handleSettingChange('stripePublishableKey', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Secret Key</label>
            <div className="relative">
              <input
                type={showPasswords.stripeSecretKey ? 'text' : 'password'}
                value={settings.stripeSecretKey}
                onChange={(e) => handleSettingChange('stripeSecretKey', e.target.value)}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('stripeSecretKey')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPasswords.stripeSecretKey ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
          </div>
        </div>
      </SettingCard>

      <SettingCard title="Platform Commission" description="Set the commission rate for bookings">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Commission Rate (%)</label>
            <input
              type="number"
              min="0"
              max="50"
              value={settings.platformCommission}
              onChange={(e) => handleSettingChange('platformCommission', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            />
            <p className="text-sm text-gray-500 mt-1">
              Current rate: {settings.platformCommission}% per booking (AED {(settings.platformCommission * 0.5).toFixed(2)} on AED 50 booking)
            </p>
          </div>
        </div>
      </SettingCard>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <SettingCard title="Authentication Settings" description="Configure security and authentication options">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Require Two-Factor Authentication</p>
              <p className="text-sm text-gray-500">Force all users to enable 2FA</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.requireTwoFactor}
                onChange={(e) => handleSettingChange('requireTwoFactor', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-orange-500 peer-checked:to-pink-600"></div>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
              <input
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Login Attempts</label>
              <input
                type="number"
                value={settings.maxLoginAttempts}
                onChange={(e) => handleSettingChange('maxLoginAttempts', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
        </div>
      </SettingCard>

      <SettingCard title="System Security" description="Advanced security configurations" warning>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Maintenance Mode</p>
              <p className="text-sm text-gray-500">Temporarily disable public access</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={(e) => handleSettingChange('maintenanceMode', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>
        </div>
      </SettingCard>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <SettingCard title="Notification Preferences" description="Configure system notification settings">
        <div className="space-y-4">
          {[
            { key: 'emailNotifications', label: 'Email Notifications', desc: 'Send notifications via email' },
            { key: 'smsNotifications', label: 'SMS Notifications', desc: 'Send notifications via SMS' },
            { key: 'pushNotifications', label: 'Push Notifications', desc: 'Send browser push notifications' },
            { key: 'adminNotifications', label: 'Admin Notifications', desc: 'Receive admin system alerts' },
            { key: 'marketingEmails', label: 'Marketing Emails', desc: 'Send promotional emails to users' }
          ].map((notification) => (
            <div key={notification.key} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">{notification.label}</p>
                <p className="text-sm text-gray-500">{notification.desc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings[notification.key as keyof typeof settings] as boolean}
                  onChange={(e) => handleSettingChange(notification.key, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-orange-500 peer-checked:to-pink-600"></div>
              </label>
            </div>
          ))}
        </div>
      </SettingCard>
    </div>
  );

  const renderBookingSettings = () => (
    <div className="space-y-6">
      <SettingCard title="Booking Configuration" description="Configure booking rules and policies">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Max Advance Booking (days)</label>
            <input
              type="number"
              value={settings.maxAdvanceBooking}
              onChange={(e) => handleSettingChange('maxAdvanceBooking', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Min Advance Booking (hours)</label>
            <input
              type="number"
              value={settings.minAdvanceBooking}
              onChange={(e) => handleSettingChange('minAdvanceBooking', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Default Duration (minutes)</label>
            <input
              type="number"
              value={settings.defaultBookingDuration}
              onChange={(e) => handleSettingChange('defaultBookingDuration', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cancellation Policy</label>
            <select
              value={settings.cancellationPolicy}
              onChange={(e) => handleSettingChange('cancellationPolicy', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            >
              <option value="24-hours">24 Hours</option>
              <option value="48-hours">48 Hours</option>
              <option value="72-hours">72 Hours</option>
              <option value="1-week">1 Week</option>
            </select>
          </div>
        </div>
        
        <div className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Allow Instant Booking</p>
              <p className="text-sm text-gray-500">Let customers book without provider approval</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.allowInstantBooking}
                onChange={(e) => handleSettingChange('allowInstantBooking', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-orange-500 peer-checked:to-pink-600"></div>
            </label>
          </div>
        </div>
      </SettingCard>
    </div>
  );

  const renderSystemSettings = () => (
    <div className="space-y-6">
      <SettingCard title="System Configuration" description="Advanced system settings">
        <div className="space-y-4">
          {[
            { key: 'cacheEnabled', label: 'Enable Caching', desc: 'Improve performance with caching' },
            { key: 'analyticsEnabled', label: 'Analytics Tracking', desc: 'Track user behavior and performance' },
            { key: 'debugMode', label: 'Debug Mode', desc: 'Enable detailed error logging' }
          ].map((setting) => (
            <div key={setting.key} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">{setting.label}</p>
                <p className="text-sm text-gray-500">{setting.desc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings[setting.key as keyof typeof settings] as boolean}
                  onChange={(e) => handleSettingChange(setting.key, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-orange-500 peer-checked:to-pink-600"></div>
              </label>
            </div>
          ))}
        </div>
      </SettingCard>
      
      <SettingCard title="Backup Configuration" description="Configure automated backups">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Backup Frequency</label>
          <select
            value={settings.backupFrequency}
            onChange={(e) => handleSettingChange('backupFrequency', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          >
            <option value="hourly">Hourly</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
      </SettingCard>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general': return renderGeneralSettings();
      case 'email': return renderEmailSettings();
      case 'payment': return renderPaymentSettings();
      case 'security': return renderSecuritySettings();
      case 'notifications': return renderNotificationSettings();
      case 'booking': return renderBookingSettings();
      case 'system': return renderSystemSettings();
      default: return renderGeneralSettings();
    }
  };

  return (
    <div className="w-[95%] mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center mb-4">
              <div className="bg-gradient-to-r from-orange-500 to-pink-600 rounded-xl p-2 mr-3">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent">
                Wiwihood Settings
              </h1>
            </div>
            <p className="text-gray-600 mt-1">Configure your platform settings and preferences</p>
          </div>
          <div className="flex items-center space-x-3">
            {saveStatus && (
              <div className="flex items-center">
                {saveStatus === 'saving' && (
                  <div className="flex items-center text-orange-600">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-600 mr-2" />
                    Saving...
                  </div>
                )}
                {saveStatus === 'saved' && (
                  <div className="flex items-center text-green-600">
                    <Check className="h-4 w-4 mr-2" />
                    Settings saved!
                  </div>
                )}
              </div>
            )}
            <button 
              onClick={handleSave}
              disabled={saveStatus === 'saving'}
              className="flex cursor-pointer items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-600 text-white rounded-lg hover:from-orange-600 hover:to-pink-700 transition-all duration-200 disabled:opacity-50 shadow-md"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:w-64">
          <nav className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
            <ul className="space-y-2">
              {tabs.map((tab) => (
                <li key={tab.id}>
                  <button
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-all duration-200 ${
                      activeTab === tab.id 
                        ? 'bg-gradient-to-r from-orange-50 to-pink-50 text-orange-700 border-l-4 border-orange-500 shadow-sm' 
                        : 'text-gray-700 hover:bg-gradient-to-r hover:from-orange-50 hover:to-pink-50 hover:text-orange-600'
                    }`}
                  >
                    <tab.icon className="h-5 w-5 mr-3" />
                    <span className="font-medium">{tab.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}
