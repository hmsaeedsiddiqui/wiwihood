'use client';

import React, { useState } from 'react';

const ShopSettingsPage = () => {
  const [activeSection, setActiveSection] = useState('business');
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);

  // Form states - using empty defaults instead of mock data
  const [businessInfo, setBusinessInfo] = useState({
    businessName: "",
    businessType: "",
    registrationNumber: "",
    taxId: "",
    primaryEmail: "",
    primaryPhone: "",
    website: "",
    description: "",
    logo: null,
    coverImage: null
  });

  const [businessSettings, setBusinessSettings] = useState({
    autoAcceptBookings: true,
    requireDeposit: false,
    depositAmount: 25,
    cancellationPolicy: "24_hours",
    reschedulePolicy: "12_hours",
    noShowPolicy: "charge_full",
    bufferTime: 15,
    maxAdvanceBooking: 60,
    timeSlotDuration: 30,
    workingDaysPerWeek: 6,
    holidayMode: false
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailBookingConfirmation: true,
    emailBookingReminder: true,
    emailCancellation: true,
    emailReviews: true,
    emailPayments: true,
    smsBookingConfirmation: false,
    smsBookingReminder: true,
    smsCancellation: false,
    pushNotifications: true,
    reminderTiming: "24_hours"
  });

  const sections = [
    { id: 'business', label: 'Business Information', icon: '🏢' },
    { id: 'operations', label: 'Operations & Policies', icon: '⚙️' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'payments', label: 'Payment Settings', icon: '💳' },
    { id: 'integrations', label: 'Integrations', icon: '🔗' }
  ];

  const handleSave = () => {
    setShowSaveConfirmation(true);
    setTimeout(() => setShowSaveConfirmation(false), 3000);
  };

  const renderBusinessInformation = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Basic Information */}
      <div style={{
        backgroundColor: '#ffffff',
        padding: '24px',
        borderRadius: '12px',
        border: '1px solid #e5e7eb'
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', marginBottom: '20px' }}>
          Basic Information
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', display: 'block', marginBottom: '8px' }}>
              Business Name *
            </label>
            <input
              type="text"
              value={businessInfo.businessName}
              onChange={(e) => setBusinessInfo({...businessInfo, businessName: e.target.value})}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', display: 'block', marginBottom: '8px' }}>
              Business Type *
            </label>
            <select
              value={businessInfo.businessType}
              onChange={(e) => setBusinessInfo({...businessInfo, businessType: e.target.value})}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
            >
              <option value="Beauty & Wellness">Beauty & Wellness</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Fitness">Fitness</option>
              <option value="Dining">Dining</option>
              <option value="Professional Services">Professional Services</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', display: 'block', marginBottom: '8px' }}>
              Registration Number
            </label>
            <input
              type="text"
              value={businessInfo.registrationNumber}
              onChange={(e) => setBusinessInfo({...businessInfo, registrationNumber: e.target.value})}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', display: 'block', marginBottom: '8px' }}>
              Tax ID
            </label>
            <input
              type="text"
              value={businessInfo.taxId}
              onChange={(e) => setBusinessInfo({...businessInfo, taxId: e.target.value})}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', display: 'block', marginBottom: '8px' }}>
              Primary Email *
            </label>
            <input
              type="email"
              value={businessInfo.primaryEmail}
              onChange={(e) => setBusinessInfo({...businessInfo, primaryEmail: e.target.value})}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', display: 'block', marginBottom: '8px' }}>
              Primary Phone *
            </label>
            <input
              type="tel"
              value={businessInfo.primaryPhone}
              onChange={(e) => setBusinessInfo({...businessInfo, primaryPhone: e.target.value})}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', display: 'block', marginBottom: '8px' }}>
              Website
            </label>
            <input
              type="url"
              value={businessInfo.website}
              onChange={(e) => setBusinessInfo({...businessInfo, website: e.target.value})}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', display: 'block', marginBottom: '8px' }}>
              Business Description
            </label>
            <textarea
              value={businessInfo.description}
              onChange={(e) => setBusinessInfo({...businessInfo, description: e.target.value})}
              rows={4}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '16px',
                boxSizing: 'border-box',
                resize: 'vertical'
              }}
            />
          </div>
        </div>
      </div>

      {/* Branding */}
      <div style={{
        backgroundColor: '#ffffff',
        padding: '24px',
        borderRadius: '12px',
        border: '1px solid #e5e7eb'
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', marginBottom: '20px' }}>
          Branding
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div>
            <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', display: 'block', marginBottom: '8px' }}>
              Business Logo
            </label>
            <div style={{
              border: '2px dashed #d1d5db',
              borderRadius: '8px',
              padding: '40px',
              textAlign: 'center',
              backgroundColor: '#f9fafb'
            }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>📷</div>
              <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '12px' }}>
                Upload your business logo
              </p>
              <button style={{
                backgroundColor: '#3b82f6',
                color: '#ffffff',
                padding: '8px 16px',
                borderRadius: '6px',
                border: 'none',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}>
                Choose File
              </button>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', display: 'block', marginBottom: '8px' }}>
              Cover Image
            </label>
            <div style={{
              border: '2px dashed #d1d5db',
              borderRadius: '8px',
              padding: '40px',
              textAlign: 'center',
              backgroundColor: '#f9fafb'
            }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>🖼️</div>
              <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '12px' }}>
                Upload cover image
              </p>
              <button style={{
                backgroundColor: '#3b82f6',
                color: '#ffffff',
                padding: '8px 16px',
                borderRadius: '6px',
                border: 'none',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}>
                Choose File
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderOperations = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Booking Settings */}
      <div style={{
        backgroundColor: '#ffffff',
        padding: '24px',
        borderRadius: '12px',
        border: '1px solid #e5e7eb'
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', marginBottom: '20px' }}>
          Booking Settings
        </h3>

        <div style={{ display: 'grid', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <label style={{ fontSize: '16px', fontWeight: '500', color: '#1e293b' }}>
                Auto-accept bookings
              </label>
              <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
                Automatically approve new booking requests
              </p>
            </div>
            <input
              type="checkbox"
              checked={businessSettings.autoAcceptBookings}
              onChange={(e) => setBusinessSettings({...businessSettings, autoAcceptBookings: e.target.checked})}
              style={{ width: '20px', height: '20px' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <label style={{ fontSize: '16px', fontWeight: '500', color: '#1e293b' }}>
                Require deposit
              </label>
              <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
                Require customers to pay a deposit when booking
              </p>
            </div>
            <input
              type="checkbox"
              checked={businessSettings.requireDeposit}
              onChange={(e) => setBusinessSettings({...businessSettings, requireDeposit: e.target.checked})}
              style={{ width: '20px', height: '20px' }}
            />
          </div>

          {businessSettings.requireDeposit && (
            <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '16px', alignItems: 'center' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                Deposit Amount ($)
              </label>
              <input
                type="number"
                value={businessSettings.depositAmount}
                onChange={(e) => setBusinessSettings({...businessSettings, depositAmount: parseInt(e.target.value)})}
                style={{
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px',
                  maxWidth: '200px'
                }}
              />
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '16px', alignItems: 'center' }}>
            <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
              Buffer Time (minutes)
            </label>
            <select
              value={businessSettings.bufferTime}
              onChange={(e) => setBusinessSettings({...businessSettings, bufferTime: parseInt(e.target.value)})}
              style={{
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '16px',
                maxWidth: '200px'
              }}
            >
              <option value={0}>No buffer</option>
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={45}>45 minutes</option>
              <option value={60}>1 hour</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '16px', alignItems: 'center' }}>
            <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
              Max Advance Booking (days)
            </label>
            <select
              value={businessSettings.maxAdvanceBooking}
              onChange={(e) => setBusinessSettings({...businessSettings, maxAdvanceBooking: parseInt(e.target.value)})}
              style={{
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '16px',
                maxWidth: '200px'
              }}
            >
              <option value={7}>1 week</option>
              <option value={14}>2 weeks</option>
              <option value={30}>1 month</option>
              <option value={60}>2 months</option>
              <option value={90}>3 months</option>
            </select>
          </div>
        </div>
      </div>

      {/* Policies */}
      <div style={{
        backgroundColor: '#ffffff',
        padding: '24px',
        borderRadius: '12px',
        border: '1px solid #e5e7eb'
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', marginBottom: '20px' }}>
          Policies
        </h3>

        <div style={{ display: 'grid', gap: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '16px', alignItems: 'center' }}>
            <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
              Cancellation Policy
            </label>
            <select
              value={businessSettings.cancellationPolicy}
              onChange={(e) => setBusinessSettings({...businessSettings, cancellationPolicy: e.target.value})}
              style={{
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '16px',
                maxWidth: '300px'
              }}
            >
              <option value="1_hour">1 hour before</option>
              <option value="24_hours">24 hours before</option>
              <option value="48_hours">48 hours before</option>
              <option value="72_hours">72 hours before</option>
              <option value="1_week">1 week before</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '16px', alignItems: 'center' }}>
            <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
              Reschedule Policy
            </label>
            <select
              value={businessSettings.reschedulePolicy}
              onChange={(e) => setBusinessSettings({...businessSettings, reschedulePolicy: e.target.value})}
              style={{
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '16px',
                maxWidth: '300px'
              }}
            >
              <option value="1_hour">1 hour before</option>
              <option value="12_hours">12 hours before</option>
              <option value="24_hours">24 hours before</option>
              <option value="48_hours">48 hours before</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '16px', alignItems: 'center' }}>
            <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
              No-show Policy
            </label>
            <select
              value={businessSettings.noShowPolicy}
              onChange={(e) => setBusinessSettings({...businessSettings, noShowPolicy: e.target.value})}
              style={{
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '16px',
                maxWidth: '300px'
              }}
            >
              <option value="no_charge">No charge</option>
              <option value="charge_deposit">Charge deposit only</option>
              <option value="charge_full">Charge full amount</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div style={{
      backgroundColor: '#ffffff',
      padding: '24px',
      borderRadius: '12px',
      border: '1px solid #e5e7eb'
    }}>
      <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', marginBottom: '20px' }}>
        Notification Preferences
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Email Notifications */}
        <div>
          <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b', marginBottom: '16px' }}>
            Email Notifications
          </h4>
          <div style={{ display: 'grid', gap: '16px' }}>
            {[
              { key: 'emailBookingConfirmation', label: 'Booking confirmations', desc: 'Send email when bookings are confirmed' },
              { key: 'emailBookingReminder', label: 'Booking reminders', desc: 'Send email reminders before appointments' },
              { key: 'emailCancellation', label: 'Cancellations', desc: 'Send email when bookings are cancelled' },
              { key: 'emailReviews', label: 'New reviews', desc: 'Send email when customers leave reviews' },
              { key: 'emailPayments', label: 'Payments', desc: 'Send email for payment confirmations and receipts' }
            ].map((item) => (
              <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <label style={{ fontSize: '16px', fontWeight: '500', color: '#1e293b' }}>
                    {item.label}
                  </label>
                  <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
                    {item.desc}
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={notificationSettings[item.key as keyof typeof notificationSettings] as boolean}
                  onChange={(e) => setNotificationSettings({...notificationSettings, [item.key]: e.target.checked})}
                  style={{ width: '20px', height: '20px' }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* SMS Notifications */}
        <div>
          <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b', marginBottom: '16px' }}>
            SMS Notifications
          </h4>
          <div style={{ display: 'grid', gap: '16px' }}>
            {[
              { key: 'smsBookingConfirmation', label: 'Booking confirmations', desc: 'Send SMS when bookings are confirmed' },
              { key: 'smsBookingReminder', label: 'Booking reminders', desc: 'Send SMS reminders before appointments' },
              { key: 'smsCancellation', label: 'Cancellations', desc: 'Send SMS when bookings are cancelled' }
            ].map((item) => (
              <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <label style={{ fontSize: '16px', fontWeight: '500', color: '#1e293b' }}>
                    {item.label}
                  </label>
                  <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
                    {item.desc}
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={notificationSettings[item.key as keyof typeof notificationSettings] as boolean}
                  onChange={(e) => setNotificationSettings({...notificationSettings, [item.key]: e.target.checked})}
                  style={{ width: '20px', height: '20px' }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderPayments = () => (
    <div style={{
      backgroundColor: '#ffffff',
      padding: '24px',
      borderRadius: '12px',
      border: '1px solid #e5e7eb'
    }}>
      <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', marginBottom: '20px' }}>
        Payment Settings
      </h3>

      <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>💳</div>
        <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>
          Payment Integration Coming Soon
        </h4>
        <p style={{ fontSize: '14px', margin: 0 }}>
          This section will allow you to configure payment processors, currencies, and payment policies.
        </p>
      </div>
    </div>
  );

  const renderIntegrations = () => (
    <div style={{
      backgroundColor: '#ffffff',
      padding: '24px',
      borderRadius: '12px',
      border: '1px solid #e5e7eb'
    }}>
      <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', marginBottom: '20px' }}>
        Third-party Integrations
      </h3>

      <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔗</div>
        <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>
          Integrations Coming Soon
        </h4>
        <p style={{ fontSize: '14px', margin: 0 }}>
          Connect with calendar apps, payment processors, marketing tools, and more.
        </p>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'business': return renderBusinessInformation();
      case 'operations': return renderOperations();
      case 'notifications': return renderNotifications();
      case 'payments': return renderPayments();
      case 'integrations': return renderIntegrations();
      default: return renderBusinessInformation();
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '24px' 
      }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1e293b', marginBottom: '8px' }}>
            Shop Settings
          </h1>
          <p style={{ fontSize: '16px', color: '#64748b', margin: 0 }}>
            Configure your business information, policies, and preferences
          </p>
        </div>
        
        <button
          onClick={handleSave}
          style={{
            backgroundColor: '#22c55e',
            color: '#ffffff',
            padding: '12px 24px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          💾 Save Changes
        </button>
      </div>

      {/* Save Confirmation */}
      {showSaveConfirmation && (
        <div style={{
          backgroundColor: '#dcfce7',
          border: '1px solid #16a34a',
          color: '#16a34a',
          padding: '12px 16px',
          borderRadius: '8px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          ✅ Settings saved successfully!
        </div>
      )}

      {/* Navigation */}
      <div style={{
        display: 'flex',
        gap: '4px',
        marginBottom: '24px',
        backgroundColor: '#f1f5f9',
        padding: '4px',
        borderRadius: '8px'
      }}>
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            style={{
              padding: '12px 16px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: activeSection === section.id ? '#ffffff' : 'transparent',
              color: activeSection === section.id ? '#1e293b' : '#64748b',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              flex: 1,
              justifyContent: 'center',
              boxShadow: activeSection === section.id ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            <span>{section.icon}</span>
            {section.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {renderContent()}
    </div>
  );
};

export default ShopSettingsPage;
