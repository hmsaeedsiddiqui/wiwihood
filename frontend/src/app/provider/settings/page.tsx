'use client';

import React, { useState } from 'react';

const SettingsPage = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  // Mock settings data
  const settingsData = {
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

  const [selectedTab, setSelectedTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const settingSections = [
    { id: 'profile', label: 'Profile Settings', icon: '👤' },
    { id: 'account', label: 'Account & Security', icon: '🔒' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' }
  ];

  const handleSave = () => {
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 3000);
  };

  const toggleNotification = (category: string, setting: string) => {
    console.log(`Toggling ${category}.${setting}`);
  };

  const renderProfileSettings = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#1e293b', margin: '0' }}>
        Profile Settings
      </h2>

      {/* Profile Photo */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '24px',
        border: '1px solid #e2e8f0'
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', marginBottom: '16px' }}>
          Profile Photo
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: '#f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
            fontWeight: '600',
            color: '#64748b'
          }}>
            JS
          </div>
          <div>
            <button style={{
              backgroundColor: '#22c55e',
              color: '#ffffff',
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              marginRight: '12px'
            }}>
              Upload New Photo
            </button>
            <button style={{
              backgroundColor: 'transparent',
              color: '#64748b',
              padding: '8px 16px',
              borderRadius: '6px',
              border: '1px solid #e2e8f0',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer'
            }}>
              Remove
            </button>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '24px',
        border: '1px solid #e2e8f0'
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', marginBottom: '20px' }}>
          Personal Information
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
              First Name
            </label>
            <input
              type="text"
              defaultValue="John"
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '6px',
                border: '1px solid #e2e8f0',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
              Last Name
            </label>
            <input
              type="text"
              defaultValue="Smith"
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '6px',
                border: '1px solid #e2e8f0',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
              Professional Title
            </label>
            <input
              type="text"
              defaultValue="Freelance Designer & Developer"
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '6px',
                border: '1px solid #e2e8f0',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
              Bio
            </label>
            <textarea
              defaultValue="Experienced designer and developer with 5+ years in creating beautiful, functional digital experiences."
              rows={4}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '6px',
                border: '1px solid #e2e8f0',
                fontSize: '14px',
                resize: 'vertical',
                outline: 'none',
                fontFamily: 'inherit'
              }}
            />
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '24px',
        border: '1px solid #e2e8f0'
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', marginBottom: '20px' }}>
          Contact Information
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
              Email Address
            </label>
            <input
              type="email"
              defaultValue="john.smith@example.com"
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '6px',
                border: '1px solid #e2e8f0',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
              Phone Number
            </label>
            <input
              type="tel"
              defaultValue="+1 (555) 123-4567"
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '6px',
                border: '1px solid #e2e8f0',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
              Country
            </label>
            <select style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '6px',
              border: '1px solid #e2e8f0',
              fontSize: '14px',
              backgroundColor: '#ffffff',
              outline: 'none'
            }}>
              <option>United States</option>
              <option>Canada</option>
              <option>United Kingdom</option>
              <option>Australia</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
              Time Zone
            </label>
            <select style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '6px',
              border: '1px solid #e2e8f0',
              fontSize: '14px',
              backgroundColor: '#ffffff',
              outline: 'none'
            }}>
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

  const renderAccountSettings = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#1e293b', margin: '0' }}>
        Account & Security
      </h2>

      {/* Password */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '24px',
        border: '1px solid #e2e8f0'
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', marginBottom: '16px' }}>
          Password
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
              Current Password
            </label>
            <input
              type="password"
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '6px',
                border: '1px solid #e2e8f0',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
              New Password
            </label>
            <input
              type="password"
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '6px',
                border: '1px solid #e2e8f0',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
              Confirm New Password
            </label>
            <input
              type="password"
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '6px',
                border: '1px solid #e2e8f0',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>
          <button style={{
            backgroundColor: '#22c55e',
            color: '#ffffff',
            padding: '10px 20px',
            borderRadius: '6px',
            border: 'none',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            alignSelf: 'flex-start'
          }}>
            Update Password
          </button>
        </div>
      </div>

      {/* Two-Factor Authentication */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '24px',
        border: '1px solid #e2e8f0'
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', marginBottom: '16px' }}>
          Two-Factor Authentication
        </h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: '14px', color: '#374151', margin: '0 0 4px 0' }}>
              Add an extra layer of security to your account
            </p>
            <p style={{ fontSize: '12px', color: '#64748b', margin: '0' }}>
              Status: <span style={{ color: '#ef4444', fontWeight: '500' }}>Disabled</span>
            </p>
          </div>
          <button style={{
            backgroundColor: '#22c55e',
            color: '#ffffff',
            padding: '10px 20px',
            borderRadius: '6px',
            border: 'none',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer'
          }}>
            Enable 2FA
          </button>
        </div>
      </div>

      {/* Active Sessions */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '24px',
        border: '1px solid #e2e8f0'
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', marginBottom: '16px' }}>
          Active Sessions
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            padding: '12px',
            backgroundColor: '#f8fafc',
            borderRadius: '6px'
          }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '500', color: '#1e293b' }}>
                💻 Desktop - Chrome (Current)
              </div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                New York, USA • 2 minutes ago
              </div>
            </div>
            <span style={{
              backgroundColor: '#dcfce7',
              color: '#16a34a',
              padding: '2px 8px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: '500'
            }}>
              Current
            </span>
          </div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            padding: '12px',
            backgroundColor: '#f8fafc',
            borderRadius: '6px'
          }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '500', color: '#1e293b' }}>
                📱 Mobile - Safari
              </div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                New York, USA • 2 hours ago
              </div>
            </div>
            <button style={{
              backgroundColor: '#fee2e2',
              color: '#dc2626',
              padding: '4px 8px',
              borderRadius: '4px',
              border: 'none',
              fontSize: '12px',
              cursor: 'pointer'
            }}>
              End Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#1e293b', margin: '0' }}>
        Notification Preferences
      </h2>

      {/* Email Notifications */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '24px',
        border: '1px solid #e2e8f0'
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', marginBottom: '20px' }}>
          Email Notifications
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[
            { id: 'orders', label: 'New Orders', description: 'Get notified when you receive new orders' },
            { id: 'messages', label: 'Messages', description: 'Get notified when clients send you messages' },
            { id: 'reviews', label: 'Reviews', description: 'Get notified when you receive new reviews' },
            { id: 'payments', label: 'Payments', description: 'Get notified about payment confirmations' },
            { id: 'marketing', label: 'Marketing Updates', description: 'Receive tips and platform updates' }
          ].map(item => (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '500', color: '#1e293b' }}>
                  {item.label}
                </div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>
                  {item.description}
                </div>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked style={{ marginRight: '8px' }} />
                <div style={{
                  width: '40px',
                  height: '20px',
                  borderRadius: '10px',
                  backgroundColor: '#22c55e',
                  position: 'relative'
                }}>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    backgroundColor: '#ffffff',
                    position: 'absolute',
                    top: '2px',
                    right: '2px'
                  }}></div>
                </div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Push Notifications */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '24px',
        border: '1px solid #e2e8f0'
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', marginBottom: '20px' }}>
          Push Notifications
        </h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '14px', fontWeight: '500', color: '#1e293b' }}>
              Browser Push Notifications
            </div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>
              Receive real-time notifications in your browser
            </div>
          </div>
          <button style={{
            backgroundColor: '#22c55e',
            color: '#ffffff',
            padding: '8px 16px',
            borderRadius: '6px',
            border: 'none',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer'
          }}>
            Enable
          </button>
        </div>
      </div>
    </div>
  );

  const renderSection = () => {
    switch(activeSection) {
      case 'profile': return renderProfileSettings();
      case 'account': return renderAccountSettings();
      case 'notifications': return renderNotificationSettings();
      default: 
        return (
          <div style={{ 
            textAlign: 'center', 
            padding: '60px 20px',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚧</div>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>
              Coming Soon
            </h3>
            <p style={{ color: '#64748b' }}>
              This section is under development and will be available soon.
            </p>
          </div>
        );
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8fafc',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ 
            fontSize: '28px', 
            fontWeight: '700', 
            color: '#1e293b',
            marginBottom: '8px'
          }}>
            Settings
          </h1>
          <p style={{ 
            color: '#64748b', 
            fontSize: '16px'
          }}>
            Manage your account settings and preferences
          </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '280px 1fr', 
          gap: '30px'
        }}>
          {/* Settings Navigation */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #e2e8f0',
            height: 'fit-content'
          }}>
            <h3 style={{ 
              fontSize: '16px', 
              fontWeight: '600', 
              color: '#1e293b',
              marginBottom: '16px'
            }}>
              Settings
            </h3>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {settingSections.map(section => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    textAlign: 'left',
                    backgroundColor: activeSection === section.id ? '#f0f9ff' : 'transparent',
                    color: activeSection === section.id ? '#0369a1' : '#64748b',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span style={{ fontSize: '16px' }}>{section.icon}</span>
                  {section.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Settings Content */}
          <div style={{ position: 'relative' }}>
            {renderSection()}
            
            {/* Save Button */}
            {(activeSection === 'profile' || activeSection === 'account' || activeSection === 'notifications') && (
              <div style={{ 
                marginTop: '30px',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '12px'
              }}>
                <button style={{
                  backgroundColor: '#f1f5f9',
                  color: '#64748b',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}>
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  style={{
                    backgroundColor: '#22c55e',
                    color: '#ffffff',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Save Changes
                </button>
              </div>
            )}

            {/* Success Message */}
            {showSaveSuccess && (
              <div style={{
                position: 'fixed',
                top: '20px',
                right: '20px',
                backgroundColor: '#dcfce7',
                color: '#16a34a',
                padding: '12px 20px',
                borderRadius: '8px',
                border: '1px solid #bbf7d0',
                fontSize: '14px',
                fontWeight: '500',
                zIndex: 1000,
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}>
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
