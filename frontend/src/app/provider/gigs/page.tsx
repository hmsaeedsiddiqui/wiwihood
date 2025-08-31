'use client';

import React, { useState } from 'react';

const MyGigsPage = () => {
  const [activeTab, setActiveTab] = useState('active');

  const mockGigs = [
    {
      id: 1,
      title: "Professional Logo Design",
      category: "Graphic Design",
      price: 50,
      orders: 24,
      rating: 4.9,
      status: "active",
      image: "/api/placeholder/300/200",
      views: 1250,
      clicks: 87,
      impressions: 3400
    },
    {
      id: 2,
      title: "Website Development with React",
      category: "Web Development",
      price: 150,
      orders: 12,
      rating: 4.8,
      status: "active",
      image: "/api/placeholder/300/200",
      views: 890,
      clicks: 45,
      impressions: 2100
    },
    {
      id: 3,
      title: "Social Media Marketing Strategy",
      category: "Digital Marketing",
      price: 75,
      orders: 8,
      rating: 4.7,
      status: "paused",
      image: "/api/placeholder/300/200",
      views: 560,
      clicks: 23,
      impressions: 1800
    },
    {
      id: 4,
      title: "Content Writing & Copywriting",
      category: "Writing",
      price: 35,
      orders: 45,
      rating: 4.9,
      status: "active",
      image: "/api/placeholder/300/200",
      views: 2100,
      clicks: 156,
      impressions: 5200
    }
  ];

  const filteredGigs = mockGigs.filter(gig => 
    activeTab === 'all' || gig.status === activeTab
  );

  const stats = {
    totalGigs: mockGigs.length,
    activeGigs: mockGigs.filter(g => g.status === 'active').length,
    totalOrders: mockGigs.reduce((sum, gig) => sum + gig.orders, 0),
    totalEarnings: mockGigs.reduce((sum, gig) => sum + (gig.price * gig.orders), 0)
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
            My Gigs
          </h1>
          <p style={{ 
            color: '#64748b', 
            fontSize: '16px'
          }}>
            Manage your services and track performance
          </p>
        </div>

        {/* Stats Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '20px',
          marginBottom: '30px'
        }}>
          <div style={{ 
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ 
              fontSize: '32px', 
              fontWeight: '700', 
              color: '#22c55e',
              marginBottom: '8px'
            }}>
              {stats.totalGigs}
            </div>
            <div style={{ fontSize: '14px', color: '#64748b' }}>Total Gigs</div>
          </div>

          <div style={{ 
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ 
              fontSize: '32px', 
              fontWeight: '700', 
              color: '#3b82f6',
              marginBottom: '8px'
            }}>
              {stats.activeGigs}
            </div>
            <div style={{ fontSize: '14px', color: '#64748b' }}>Active Gigs</div>
          </div>

          <div style={{ 
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ 
              fontSize: '32px', 
              fontWeight: '700', 
              color: '#f59e0b',
              marginBottom: '8px'
            }}>
              {stats.totalOrders}
            </div>
            <div style={{ fontSize: '14px', color: '#64748b' }}>Total Orders</div>
          </div>

          <div style={{ 
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ 
              fontSize: '32px', 
              fontWeight: '700', 
              color: '#8b5cf6',
              marginBottom: '8px'
            }}>
              ${stats.totalEarnings.toLocaleString()}
            </div>
            <div style={{ fontSize: '14px', color: '#64748b' }}>Total Earnings</div>
          </div>
        </div>

        {/* Action Bar */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          {/* Filter Tabs */}
          <div style={{ display: 'flex', gap: '4px' }}>
            {['all', 'active', 'paused'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                  backgroundColor: activeTab === tab ? '#22c55e' : '#f1f5f9',
                  color: activeTab === tab ? '#ffffff' : '#64748b',
                  transition: 'all 0.2s ease'
                }}
              >
                {tab} ({tab === 'all' ? mockGigs.length : mockGigs.filter(g => g.status === tab).length})
              </button>
            ))}
          </div>

          {/* Create New Gig Button */}
          <button style={{
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
          }}>
            <span>+</span> Create New Gig
          </button>
        </div>

        {/* Gigs Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
          gap: '24px'
        }}>
          {filteredGigs.map(gig => (
            <div key={gig.id} style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: '1px solid #e2e8f0',
              transition: 'transform 0.2s ease',
              cursor: 'pointer'
            }}>
              {/* Gig Image */}
              <div style={{
                height: '180px',
                backgroundColor: '#f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                color: '#64748b'
              }}>
                Gig Image Placeholder
              </div>

              {/* Gig Content */}
              <div style={{ padding: '20px' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'start',
                  marginBottom: '12px'
                }}>
                  <h3 style={{ 
                    fontSize: '16px', 
                    fontWeight: '600', 
                    color: '#1e293b',
                    margin: '0',
                    lineHeight: '1.4'
                  }}>
                    {gig.title}
                  </h3>
                  <span style={{
                    backgroundColor: gig.status === 'active' ? '#dcfce7' : '#fef3c7',
                    color: gig.status === 'active' ? '#16a34a' : '#d97706',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '500',
                    textTransform: 'capitalize'
                  }}>
                    {gig.status}
                  </span>
                </div>

                <p style={{ 
                  color: '#64748b', 
                  fontSize: '14px',
                  marginBottom: '16px'
                }}>
                  {gig.category}
                </p>

                {/* Stats Row */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr', 
                  gap: '12px',
                  marginBottom: '16px'
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b' }}>
                      {gig.orders}
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>Orders</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b' }}>
                      {gig.rating}
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>Rating</div>
                  </div>
                </div>

                {/* Performance Stats */}
                <div style={{ 
                  backgroundColor: '#f8fafc',
                  borderRadius: '8px',
                  padding: '12px',
                  marginBottom: '16px'
                }}>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr 1fr', 
                    gap: '8px',
                    textAlign: 'center'
                  }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>
                        {gig.views}
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>Views</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>
                        {gig.clicks}
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>Clicks</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>
                        {gig.impressions}
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>Impressions</div>
                    </div>
                  </div>
                </div>

                {/* Price and Actions */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center'
                }}>
                  <div style={{ 
                    fontSize: '20px', 
                    fontWeight: '700', 
                    color: '#22c55e'
                  }}>
                    ${gig.price}
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      border: '1px solid #e2e8f0',
                      backgroundColor: '#ffffff',
                      color: '#64748b',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}>
                      Edit
                    </button>
                    <button style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: '#22c55e',
                      color: '#ffffff',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}>
                      View
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredGigs.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>
              No gigs found
            </h3>
            <p style={{ color: '#64748b', marginBottom: '24px' }}>
              {activeTab === 'all' 
                ? "You haven't created any gigs yet." 
                : `No ${activeTab} gigs found.`}
            </p>
            <button style={{
              backgroundColor: '#22c55e',
              color: '#ffffff',
              padding: '12px 24px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}>
              Create Your First Gig
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyGigsPage;
