'use client';

import React, { useState } from 'react';

const MyBuyersPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const mockBuyers = [
    {
      id: 1,
      name: "Sarah Johnson",
      avatar: "/api/placeholder/50/50",
      email: "sarah.j@email.com",
      totalOrders: 12,
      totalSpent: 1250,
      averageRating: 4.9,
      lastOrder: "2 days ago",
      status: "active",
      location: "New York, USA",
      joinDate: "Jan 2024",
      completedProjects: 11,
      cancelledOrders: 1,
      responseTime: "< 1 hour",
      favoriteServices: ["Logo Design", "Web Development"]
    },
    {
      id: 2,
      name: "Michael Chen",
      avatar: "/api/placeholder/50/50",
      email: "m.chen@email.com",
      totalOrders: 8,
      totalSpent: 890,
      averageRating: 4.7,
      lastOrder: "1 week ago",
      status: "active",
      location: "California, USA",
      joinDate: "Mar 2024",
      completedProjects: 7,
      cancelledOrders: 1,
      responseTime: "< 2 hours",
      favoriteServices: ["Content Writing", "SEO"]
    },
    {
      id: 3,
      name: "Emma Williams",
      avatar: "/api/placeholder/50/50",
      email: "emma.w@email.com",
      totalOrders: 15,
      totalSpent: 2100,
      averageRating: 5.0,
      lastOrder: "3 days ago",
      status: "premium",
      location: "London, UK",
      joinDate: "Dec 2023",
      completedProjects: 15,
      cancelledOrders: 0,
      responseTime: "< 30 min",
      favoriteServices: ["Marketing Strategy", "Social Media"]
    },
    {
      id: 4,
      name: "David Rodriguez",
      avatar: "/api/placeholder/50/50",
      email: "d.rodriguez@email.com",
      totalOrders: 5,
      totalSpent: 425,
      averageRating: 4.6,
      lastOrder: "2 weeks ago",
      status: "inactive",
      location: "Madrid, Spain",
      joinDate: "Apr 2024",
      completedProjects: 4,
      cancelledOrders: 1,
      responseTime: "< 4 hours",
      favoriteServices: ["Translation", "Writing"]
    },
    {
      id: 5,
      name: "Lisa Zhang",
      avatar: "/api/placeholder/50/50",
      email: "lisa.z@email.com",
      totalOrders: 22,
      totalSpent: 3200,
      averageRating: 4.8,
      lastOrder: "1 day ago",
      status: "premium",
      location: "Singapore",
      joinDate: "Oct 2023",
      completedProjects: 21,
      cancelledOrders: 1,
      responseTime: "< 15 min",
      favoriteServices: ["Web Development", "Mobile Apps"]
    }
  ];

  const filteredBuyers = mockBuyers.filter(buyer => {
    const matchesSearch = buyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         buyer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' || buyer.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const stats = {
    totalBuyers: mockBuyers.length,
    activeBuyers: mockBuyers.filter(b => b.status === 'active').length,
    premiumBuyers: mockBuyers.filter(b => b.status === 'premium').length,
    totalRevenue: mockBuyers.reduce((sum, buyer) => sum + buyer.totalSpent, 0)
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return { bg: '#dcfce7', text: '#16a34a' };
      case 'premium': return { bg: '#fef3c7', text: '#d97706' };
      case 'inactive': return { bg: '#fee2e2', text: '#dc2626' };
      default: return { bg: '#f1f5f9', text: '#64748b' };
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
            My Buyers
          </h1>
          <p style={{ 
            color: '#64748b', 
            fontSize: '16px'
          }}>
            Manage your client relationships and track buyer activity
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
              color: '#3b82f6',
              marginBottom: '8px'
            }}>
              {stats.totalBuyers}
            </div>
            <div style={{ fontSize: '14px', color: '#64748b' }}>Total Buyers</div>
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
              color: '#22c55e',
              marginBottom: '8px'
            }}>
              {stats.activeBuyers}
            </div>
            <div style={{ fontSize: '14px', color: '#64748b' }}>Active Buyers</div>
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
              {stats.premiumBuyers}
            </div>
            <div style={{ fontSize: '14px', color: '#64748b' }}>Premium Buyers</div>
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
              ${stats.totalRevenue.toLocaleString()}
            </div>
            <div style={{ fontSize: '14px', color: '#64748b' }}>Total Revenue</div>
          </div>
        </div>

        {/* Filters and Search */}
        <div style={{ 
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            {/* Filter Tabs */}
            <div style={{ display: 'flex', gap: '4px' }}>
              {['all', 'active', 'premium', 'inactive'].map(tab => (
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
                  {tab} ({tab === 'all' ? mockBuyers.length : mockBuyers.filter(b => b.status === tab).length})
                </button>
              ))}
            </div>

            {/* Search Bar */}
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Search buyers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  padding: '8px 12px 8px 36px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  fontSize: '14px',
                  width: '250px',
                  outline: 'none'
                }}
              />
              <span style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#64748b'
              }}>
                🔍
              </span>
            </div>
          </div>
        </div>

        {/* Buyers List */}
        <div style={{ 
          display: 'grid', 
          gap: '16px'
        }}>
          {filteredBuyers.map(buyer => (
            <div key={buyer.id} style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: '1px solid #e2e8f0',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              cursor: 'pointer'
            }}>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'auto 1fr auto', 
                gap: '20px',
                alignItems: 'start'
              }}>
                {/* Avatar and Basic Info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: '#f1f5f9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    fontWeight: '600',
                    color: '#64748b'
                  }}>
                    {buyer.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 style={{ 
                      fontSize: '18px', 
                      fontWeight: '600', 
                      color: '#1e293b',
                      margin: '0 0 4px 0'
                    }}>
                      {buyer.name}
                    </h3>
                    <p style={{ 
                      color: '#64748b', 
                      fontSize: '14px',
                      margin: '0 0 4px 0'
                    }}>
                      {buyer.email}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        backgroundColor: getStatusColor(buyer.status).bg,
                        color: getStatusColor(buyer.status).text,
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '500',
                        textTransform: 'capitalize'
                      }}>
                        {buyer.status}
                      </span>
                      <span style={{ fontSize: '12px', color: '#64748b' }}>
                        📍 {buyer.location}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(3, 1fr)', 
                  gap: '20px',
                  textAlign: 'center'
                }}>
                  <div>
                    <div style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b' }}>
                      {buyer.totalOrders}
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>Total Orders</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '20px', fontWeight: '700', color: '#22c55e' }}>
                      ${buyer.totalSpent.toLocaleString()}
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>Total Spent</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '20px', fontWeight: '700', color: '#f59e0b' }}>
                      ⭐ {buyer.averageRating}
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>Average Rating</div>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <button style={{
                    backgroundColor: '#22c55e',
                    color: '#ffffff',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '13px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}>
                    Message
                  </button>
                  <button style={{
                    backgroundColor: '#f8fafc',
                    color: '#64748b',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: '1px solid #e2e8f0',
                    fontSize: '13px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}>
                    View Profile
                  </button>
                </div>
              </div>

              {/* Additional Details */}
              <div style={{ 
                marginTop: '20px',
                paddingTop: '20px',
                borderTop: '1px solid #f1f5f9'
              }}>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                  gap: '16px'
                }}>
                  <div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>
                      Last Order
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: '500', color: '#1e293b' }}>
                      {buyer.lastOrder}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>
                      Member Since
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: '500', color: '#1e293b' }}>
                      {buyer.joinDate}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>
                      Response Time
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: '500', color: '#1e293b' }}>
                      {buyer.responseTime}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>
                      Success Rate
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: '500', color: '#1e293b' }}>
                      {Math.round((buyer.completedProjects / buyer.totalOrders) * 100)}%
                    </div>
                  </div>
                </div>

                {/* Favorite Services */}
                <div style={{ marginTop: '16px' }}>
                  <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>
                    Favorite Services
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {buyer.favoriteServices.map((service, index) => (
                      <span key={index} style={{
                        backgroundColor: '#f0f9ff',
                        color: '#0369a1',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}>
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredBuyers.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>👥</div>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>
              No buyers found
            </h3>
            <p style={{ color: '#64748b', marginBottom: '24px' }}>
              {searchTerm 
                ? `No buyers match "${searchTerm}"` 
                : activeTab === 'all' 
                  ? "You don't have any buyers yet." 
                  : `No ${activeTab} buyers found.`}
            </p>
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
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
                Clear Search
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBuyersPage;
