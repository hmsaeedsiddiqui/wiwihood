'use client';

import React, { useState } from 'react';

const ShopManagementPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddLocationModal, setShowAddLocationModal] = useState(false);

  // Mock shop data based on ERD
  const shopData = {
    businessName: "Sarah's Wellness Studio",
    businessType: "Beauty & Wellness",
    registrationNumber: "BW-2023-001",
    taxId: "TX-123456789",
    primaryEmail: "business@sarahwellness.com",
    primaryPhone: "+1 (555) 123-4567",
    website: "https://sarahwellness.com",
    description: "Premium wellness and beauty services with experienced professionals",
    locations: [
      {
        id: 1,
        name: "Main Studio",
        address: "123 Wellness Ave, Downtown",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        phone: "+1 (555) 123-4567",
        email: "main@sarahwellness.com",
        isPrimary: true,
        isActive: true,
        workingHours: {
          monday: { open: "09:00", close: "18:00", closed: false },
          tuesday: { open: "09:00", close: "18:00", closed: false },
          wednesday: { open: "09:00", close: "18:00", closed: false },
          thursday: { open: "09:00", close: "20:00", closed: false },
          friday: { open: "09:00", close: "20:00", closed: false },
          saturday: { open: "10:00", close: "16:00", closed: false },
          sunday: { open: "", close: "", closed: true }
        },
        services: ["Massage Therapy", "Facial Treatments", "Yoga Classes"],
        staff: 5,
        capacity: 3
      },
      {
        id: 2,
        name: "Express Location",
        address: "456 Quick St, Midtown",
        city: "New York",
        state: "NY",
        zipCode: "10002",
        phone: "+1 (555) 987-6543",
        email: "express@sarahwellness.com",
        isPrimary: false,
        isActive: true,
        workingHours: {
          monday: { open: "10:00", close: "19:00", closed: false },
          tuesday: { open: "10:00", close: "19:00", closed: false },
          wednesday: { open: "10:00", close: "19:00", closed: false },
          thursday: { open: "10:00", close: "19:00", closed: false },
          friday: { open: "10:00", close: "19:00", closed: false },
          saturday: { open: "09:00", close: "17:00", closed: false },
          sunday: { open: "", close: "", closed: true }
        },
        services: ["Quick Treatments", "Express Facials"],
        staff: 2,
        capacity: 2
      }
    ],
    analytics: {
      totalBookings: 1247,
      totalRevenue: 98450,
      averageRating: 4.8,
      totalReviews: 324,
      monthlyGrowth: 12.5
    }
  };

  const tabs = [
    { id: 'overview', label: 'Business Overview', icon: '🏢' },
    { id: 'locations', label: 'Locations', icon: '📍' },
    { id: 'hours', label: 'Business Hours', icon: '🕒' },
    { id: 'staff', label: 'Staff Management', icon: '👥' },
    { id: 'analytics', label: 'Analytics', icon: '📊' }
  ];

  const renderOverview = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Business Stats */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
        gap: '16px' 
      }}>
        {[
          { label: 'Total Bookings', value: shopData.analytics.totalBookings.toLocaleString(), color: '#22c55e', icon: '📅' },
          { label: 'Total Revenue', value: `$${shopData.analytics.totalRevenue.toLocaleString()}`, color: '#3b82f6', icon: '💰' },
          { label: 'Average Rating', value: shopData.analytics.averageRating, color: '#f59e0b', icon: '⭐' },
          { label: 'Monthly Growth', value: `+${shopData.analytics.monthlyGrowth}%`, color: '#10b981', icon: '📈' }
        ].map((stat, index) => (
          <div key={index} style={{
            backgroundColor: '#ffffff',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              fontSize: '24px',
              backgroundColor: `${stat.color}20`,
              padding: '12px',
              borderRadius: '8px'
            }}>
              {stat.icon}
            </div>
            <div>
              <p style={{ fontSize: '24px', fontWeight: '700', color: '#1e293b', margin: 0 }}>
                {stat.value}
              </p>
              <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Business Information */}
      <div style={{
        backgroundColor: '#ffffff',
        padding: '24px',
        borderRadius: '12px',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1e293b', margin: 0 }}>
            Business Information
          </h3>
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
            Edit Business Info
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', display: 'block', marginBottom: '4px' }}>
                Business Name
              </label>
              <p style={{ fontSize: '16px', color: '#1e293b', margin: 0 }}>{shopData.businessName}</p>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', display: 'block', marginBottom: '4px' }}>
                Business Type
              </label>
              <p style={{ fontSize: '16px', color: '#1e293b', margin: 0 }}>{shopData.businessType}</p>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', display: 'block', marginBottom: '4px' }}>
                Registration Number
              </label>
              <p style={{ fontSize: '16px', color: '#1e293b', margin: 0 }}>{shopData.registrationNumber}</p>
            </div>
          </div>
          <div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', display: 'block', marginBottom: '4px' }}>
                Primary Email
              </label>
              <p style={{ fontSize: '16px', color: '#1e293b', margin: 0 }}>{shopData.primaryEmail}</p>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', display: 'block', marginBottom: '4px' }}>
                Primary Phone
              </label>
              <p style={{ fontSize: '16px', color: '#1e293b', margin: 0 }}>{shopData.primaryPhone}</p>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', display: 'block', marginBottom: '4px' }}>
                Website
              </label>
              <a href={shopData.website} style={{ fontSize: '16px', color: '#3b82f6', textDecoration: 'none' }}>
                {shopData.website}
              </a>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '16px' }}>
          <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', display: 'block', marginBottom: '4px' }}>
            Description
          </label>
          <p style={{ fontSize: '16px', color: '#1e293b', margin: 0, lineHeight: '1.5' }}>
            {shopData.description}
          </p>
        </div>
      </div>
    </div>
  );

  const renderLocations = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1e293b', margin: 0 }}>
          Business Locations ({shopData.locations.length})
        </h3>
        <button
          onClick={() => setShowAddLocationModal(true)}
          style={{
            backgroundColor: '#22c55e',
            color: '#ffffff',
            padding: '10px 20px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <span>+</span> Add New Location
        </button>
      </div>

      {/* Locations Grid */}
      <div style={{ display: 'grid', gap: '16px' }}>
        {shopData.locations.map((location) => (
          <div key={location.id} style={{
            backgroundColor: '#ffffff',
            padding: '24px',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            position: 'relative'
          }}>
            {location.isPrimary && (
              <div style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                backgroundColor: '#3b82f6',
                color: '#ffffff',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: '500'
              }}>
                Primary
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', marginBottom: '12px' }}>
                  {location.name}
                </h4>
                
                <div style={{ marginBottom: '12px' }}>
                  <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '4px' }}>Address</p>
                  <p style={{ fontSize: '16px', color: '#1e293b', margin: 0 }}>
                    {location.address}<br />
                    {location.city}, {location.state} {location.zipCode}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '20px' }}>
                  <div>
                    <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '4px' }}>Phone</p>
                    <p style={{ fontSize: '16px', color: '#1e293b', margin: 0 }}>{location.phone}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '4px' }}>Email</p>
                    <p style={{ fontSize: '16px', color: '#1e293b', margin: 0 }}>{location.email}</p>
                  </div>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                  <div style={{
                    backgroundColor: '#f1f5f9',
                    padding: '12px',
                    borderRadius: '8px',
                    textAlign: 'center',
                    flex: 1
                  }}>
                    <p style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', margin: 0 }}>
                      {location.staff}
                    </p>
                    <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>Staff Members</p>
                  </div>
                  <div style={{
                    backgroundColor: '#f1f5f9',
                    padding: '12px',
                    borderRadius: '8px',
                    textAlign: 'center',
                    flex: 1
                  }}>
                    <p style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', margin: 0 }}>
                      {location.capacity}
                    </p>
                    <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>Max Capacity</p>
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '8px' }}>Services Available</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {location.services.map((service, idx) => (
                      <span key={idx} style={{
                        backgroundColor: '#dcfce7',
                        color: '#16a34a',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}>
                        {service}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button style={{
                    backgroundColor: '#3b82f6',
                    color: '#ffffff',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    flex: 1
                  }}>
                    Edit Location
                  </button>
                  <button style={{
                    backgroundColor: location.isActive ? '#f59e0b' : '#22c55e',
                    color: '#ffffff',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    flex: 1
                  }}>
                    {location.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderBusinessHours = () => (
    <div style={{
      backgroundColor: '#ffffff',
      padding: '24px',
      borderRadius: '12px',
      border: '1px solid #e5e7eb'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1e293b', margin: 0 }}>
          Business Hours Configuration
        </h3>
        <button style={{
          backgroundColor: '#3b82f6',
          color: '#ffffff',
          padding: '10px 20px',
          borderRadius: '8px',
          border: 'none',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer'
        }}>
          Update Hours
        </button>
      </div>

      {shopData.locations.map((location) => (
        <div key={location.id} style={{
          marginBottom: '24px',
          padding: '20px',
          backgroundColor: '#f8fafc',
          borderRadius: '8px'
        }}>
          <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b', marginBottom: '16px' }}>
            {location.name}
          </h4>
          
          <div style={{ display: 'grid', gap: '12px' }}>
            {Object.entries(location.workingHours).map(([day, hours]: [string, any]) => (
              <div key={day} style={{
                display: 'grid',
                gridTemplateColumns: '120px 1fr',
                alignItems: 'center',
                gap: '16px'
              }}>
                <span style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  textTransform: 'capitalize'
                }}>
                  {day}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {hours.closed ? (
                    <span style={{ fontSize: '14px', color: '#64748b', fontStyle: 'italic' }}>
                      Closed
                    </span>
                  ) : (
                    <span style={{ fontSize: '14px', color: '#1e293b' }}>
                      {hours.open} - {hours.close}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const renderStaffManagement = () => (
    <div style={{
      backgroundColor: '#ffffff',
      padding: '24px',
      borderRadius: '12px',
      border: '1px solid #e5e7eb'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1e293b', margin: 0 }}>
          Staff Management
        </h3>
        <button style={{
          backgroundColor: '#22c55e',
          color: '#ffffff',
          padding: '10px 20px',
          borderRadius: '8px',
          border: 'none',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer'
        }}>
          + Add Staff Member
        </button>
      </div>

      <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>👥</div>
        <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>
          Staff Management Coming Soon
        </h4>
        <p style={{ fontSize: '14px', margin: 0 }}>
          This section will allow you to manage staff members, their schedules, and permissions.
        </p>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div style={{
      backgroundColor: '#ffffff',
      padding: '24px',
      borderRadius: '12px',
      border: '1px solid #e5e7eb'
    }}>
      <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1e293b', marginBottom: '24px' }}>
        Business Analytics
      </h3>

      <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
        <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>
          Advanced Analytics Coming Soon
        </h4>
        <p style={{ fontSize: '14px', margin: 0 }}>
          Detailed analytics for bookings, revenue, customer patterns, and business performance.
        </p>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return renderOverview();
      case 'locations': return renderLocations();
      case 'hours': return renderBusinessHours();
      case 'staff': return renderStaffManagement();
      case 'analytics': return renderAnalytics();
      default: return renderOverview();
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1e293b', marginBottom: '8px' }}>
          Shop Management
        </h1>
        <p style={{ fontSize: '16px', color: '#64748b', margin: 0 }}>
          Manage your business locations, hours, staff, and operational settings
        </p>
      </div>

      {/* Navigation Tabs */}
      <div style={{
        display: 'flex',
        gap: '4px',
        marginBottom: '24px',
        backgroundColor: '#f1f5f9',
        padding: '4px',
        borderRadius: '8px'
      }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '12px 16px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: activeTab === tab.id ? '#ffffff' : 'transparent',
              color: activeTab === tab.id ? '#1e293b' : '#64748b',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              flex: 1,
              justifyContent: 'center',
              boxShadow: activeTab === tab.id ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {renderContent()}
    </div>
  );
};

export default ShopManagementPage;
