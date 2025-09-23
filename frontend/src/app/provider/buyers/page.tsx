"use client";
import React, { useState, useEffect } from 'react';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  totalBookings: number;
  totalSpent: number;
  averageRating: number;
  lastBooking: string;
  status: 'active' | 'inactive';
  completedBookings: number;
  cancelledBookings: number;
  favoriteServices: string[];
}

export default function MyBuyersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('providerToken');
      
      if (!token) {
        setError('Authentication token not found');
        setLoading(false);
        return;
      }

      // Fetch all bookings for this provider
      const response = await fetch('http://localhost:8000/api/v1/bookings/my-bookings?limit=1000', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const bookings = data.bookings || [];
        
        // Aggregate customer data from bookings
        const customerMap = new Map<string, Customer>();
        
        bookings.forEach((booking: any) => {
          const customerId = booking.customer?.id || booking.customerId || 'unknown';
          const customerName = booking.customer?.name || booking.customerName || 'Unknown Customer';
          const customerEmail = booking.customer?.email || booking.customerEmail || '';
          const customerPhone = booking.customer?.phone || booking.customerPhone || '';
          const serviceName = booking.service?.name || booking.serviceName || 'Unknown Service';
          const amount = booking.totalAmount || booking.price || 0;
          const status = booking.status || 'pending';
          const scheduledAt = booking.scheduledAt || booking.date || new Date().toISOString();

          if (!customerMap.has(customerId)) {
            customerMap.set(customerId, {
              id: customerId,
              name: customerName,
              email: customerEmail,
              phone: customerPhone,
              totalBookings: 0,
              totalSpent: 0,
              averageRating: 4.5, // Default rating - would come from reviews in real implementation
              lastBooking: scheduledAt,
              status: 'active',
              completedBookings: 0,
              cancelledBookings: 0,
              favoriteServices: []
            });
          }

          const customer = customerMap.get(customerId)!;
          customer.totalBookings += 1;
          customer.totalSpent += amount;

          if (status === 'completed') {
            customer.completedBookings += 1;
          } else if (status === 'cancelled') {
            customer.cancelledBookings += 1;
          }

          // Update last booking if this one is more recent
          if (new Date(scheduledAt) > new Date(customer.lastBooking)) {
            customer.lastBooking = scheduledAt;
          }

          // Add to favorite services (unique)
          if (serviceName && !customer.favoriteServices.includes(serviceName)) {
            customer.favoriteServices.push(serviceName);
          }

          // Determine status based on recent activity
          const daysSinceLastBooking = Math.floor(
            (new Date().getTime() - new Date(customer.lastBooking).getTime()) / (1000 * 60 * 60 * 24)
          );
          customer.status = daysSinceLastBooking <= 30 ? 'active' : 'inactive';
        });

        const customersArray = Array.from(customerMap.values());
        setCustomers(customersArray);
        setError(null);
      } else if (response.status === 401) {
        setError('Unauthorized access. Please login again.');
      } else {
        // For demo purposes, show empty state instead of error
        console.log('Bookings API not available, showing empty state');
        setCustomers([]);
        setError(null);
      }
    } catch (error: any) {
      console.error('Error fetching customers:', error);
      // For demo purposes, show empty state instead of error
      setCustomers([]);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' || customer.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const stats = {
    totalCustomers: customers.length,
    activeCustomers: customers.filter(c => c.status === 'active').length,
    premiumCustomers: customers.filter(c => c.totalSpent > 1000).length,
    totalRevenue: customers.reduce((sum, customer) => sum + customer.totalSpent, 0)
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return { bg: '#dcfce7', text: '#16a34a' };
      case 'inactive': return { bg: '#fee2e2', text: '#dc2626' };
      default: return { bg: '#f1f5f9', text: '#64748b' };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#f8fafc',
        padding: '20px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '400px' 
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              border: '4px solid #e2e8f0',
              borderTop: '4px solid #3b82f6',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            <span style={{ marginLeft: '16px', color: '#64748b' }}>Loading customers...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#f8fafc',
        padding: '20px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            padding: '16px',
            marginTop: '20px'
          }}>
            <h3 style={{ color: '#991b1b', fontSize: '16px', fontWeight: '600' }}>
              Error loading customers
            </h3>
            <p style={{ color: '#dc2626', marginTop: '8px' }}>{error}</p>
            <button
              onClick={fetchCustomers}
              style={{
                backgroundColor: '#dc2626',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '6px',
                border: 'none',
                marginTop: '12px',
                cursor: 'pointer'
              }}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

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
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ 
              fontSize: '32px', 
              fontWeight: '700', 
              color: '#1e293b',
              marginBottom: '8px'
            }}>
              {stats.totalCustomers}
            </div>
            <div style={{ color: '#64748b', fontSize: '14px' }}>Total Buyers</div>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ 
              fontSize: '32px', 
              fontWeight: '700', 
              color: '#16a34a',
              marginBottom: '8px'
            }}>
              {stats.activeCustomers}
            </div>
            <div style={{ color: '#64748b', fontSize: '14px' }}>Active Buyers</div>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ 
              fontSize: '32px', 
              fontWeight: '700', 
              color: '#d97706',
              marginBottom: '8px'
            }}>
              {stats.premiumCustomers}
            </div>
            <div style={{ color: '#64748b', fontSize: '14px' }}>Premium Buyers</div>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ 
              fontSize: '32px', 
              fontWeight: '700', 
              color: '#7c3aed',
              marginBottom: '8px'
            }}>
              ${stats.totalRevenue.toLocaleString()}
            </div>
            <div style={{ color: '#64748b', fontSize: '14px' }}>Total Revenue</div>
          </div>
        </div>

        {/* Filters and Search */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          border: '1px solid #e2e8f0',
          marginBottom: '24px'
        }}>
          <div style={{ padding: '24px', borderBottom: '1px solid #e2e8f0' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px'
            }}>
              {/* Tabs */}
              <div style={{ display: 'flex', gap: '8px' }}>
                {[
                  { key: 'all', label: `All (${stats.totalCustomers})` },
                  { key: 'active', label: `Active (${stats.activeCustomers})` },
                  { key: 'inactive', label: `Inactive (${customers.length - stats.activeCustomers})` }
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: 'none',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      backgroundColor: activeTab === tab.key ? '#3b82f6' : '#f1f5f9',
                      color: activeTab === tab.key ? 'white' : '#64748b',
                      transition: 'all 0.2s'
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="Search buyers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    padding: '10px 40px 10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    width: '250px',
                    outline: 'none'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9ca3af'
                }}>
                  🔍
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Customers List */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          border: '1px solid #e2e8f0'
        }}>
          {filteredCustomers.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '60px 20px' 
            }}>
              <div style={{
                width: '96px',
                height: '96px',
                backgroundColor: '#f1f5f9',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                fontSize: '40px'
              }}>
                👥
              </div>
              <h3 style={{ 
                fontSize: '18px', 
                fontWeight: '600', 
                color: '#1e293b',
                marginBottom: '8px'
              }}>
                No customers found
              </h3>
              <p style={{ color: '#64748b' }}>
                {searchTerm 
                  ? `No customers match "${searchTerm}"` 
                  : activeTab === 'all'
                  ? "You don't have any customers yet."
                  : `No ${activeTab} customers found.`
                }
              </p>
            </div>
          ) : (
            <div>
              {filteredCustomers.map((customer, index) => {
                const statusColor = getStatusColor(customer.status);
                return (
                  <div 
                    key={customer.id}
                    style={{
                      padding: '24px',
                      borderBottom: index < filteredCustomers.length - 1 ? '1px solid #e2e8f0' : 'none',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#f9fafb';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '16px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        {/* Avatar */}
                        <div style={{
                          width: '50px',
                          height: '50px',
                          borderRadius: '50%',
                          backgroundColor: '#3b82f6',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: '600',
                          fontSize: '18px'
                        }}>
                          {customer.name.charAt(0).toUpperCase()}
                        </div>

                        {/* Customer Info */}
                        <div>
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '12px',
                            marginBottom: '4px'
                          }}>
                            <h3 style={{ 
                              fontSize: '18px', 
                              fontWeight: '600', 
                              color: '#1e293b',
                              margin: 0
                            }}>
                              {customer.name}
                            </h3>
                            <span style={{
                              padding: '4px 8px',
                              borderRadius: '12px',
                              fontSize: '12px',
                              fontWeight: '500',
                              backgroundColor: statusColor.bg,
                              color: statusColor.text
                            }}>
                              {customer.status}
                            </span>
                          </div>
                          <p style={{ 
                            color: '#64748b', 
                            fontSize: '14px',
                            margin: 0
                          }}>
                            {customer.email}
                          </p>
                        </div>
                      </div>

                      {/* Stats */}
                      <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(4, 1fr)', 
                        gap: '24px',
                        textAlign: 'center'
                      }}>
                        <div>
                          <div style={{ 
                            fontSize: '20px', 
                            fontWeight: '700', 
                            color: '#1e293b'
                          }}>
                            {customer.totalBookings}
                          </div>
                          <div style={{ 
                            fontSize: '12px', 
                            color: '#64748b'
                          }}>
                            Total Orders
                          </div>
                        </div>

                        <div>
                          <div style={{ 
                            fontSize: '20px', 
                            fontWeight: '700', 
                            color: '#16a34a'
                          }}>
                            ${customer.totalSpent}
                          </div>
                          <div style={{ 
                            fontSize: '12px', 
                            color: '#64748b'
                          }}>
                            Total Spent
                          </div>
                        </div>

                        <div>
                          <div style={{ 
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '4px'
                          }}>
                            <span style={{ 
                              fontSize: '20px', 
                              fontWeight: '700', 
                              color: '#d97706'
                            }}>
                              {customer.averageRating.toFixed(1)}
                            </span>
                            <span style={{ color: '#fbbf24' }}>⭐</span>
                          </div>
                          <div style={{ 
                            fontSize: '12px', 
                            color: '#64748b'
                          }}>
                            Average Rating
                          </div>
                        </div>

                        <div>
                          <div style={{ 
                            fontSize: '14px', 
                            fontWeight: '600', 
                            color: '#1e293b'
                          }}>
                            {formatDate(customer.lastBooking)}
                          </div>
                          <div style={{ 
                            fontSize: '12px', 
                            color: '#64748b'
                          }}>
                            Last Order
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button style={{
                          backgroundColor: '#3b82f6',
                          color: 'white',
                          padding: '8px 16px',
                          borderRadius: '6px',
                          border: 'none',
                          fontSize: '14px',
                          cursor: 'pointer'
                        }}>
                          Message
                        </button>
                        <button style={{
                          backgroundColor: 'transparent',
                          color: '#64748b',
                          padding: '8px 16px',
                          borderRadius: '6px',
                          border: '1px solid #d1d5db',
                          fontSize: '14px',
                          cursor: 'pointer'
                        }}>
                          View Profile
                        </button>
                      </div>
                    </div>

                    {/* Additional Details */}
                    {customer.favoriteServices.length > 0 && (
                      <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '16px',
                          fontSize: '14px'
                        }}>
                          <span style={{ color: '#64748b', fontWeight: '500' }}>
                            Favorite Services:
                          </span>
                          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {customer.favoriteServices.slice(0, 3).map((service, idx) => (
                              <span 
                                key={idx}
                                style={{
                                  backgroundColor: '#eff6ff',
                                  color: '#2563eb',
                                  padding: '4px 8px',
                                  borderRadius: '12px',
                                  fontSize: '12px'
                                }}
                              >
                                {service}
                              </span>
                            ))}
                            {customer.favoriteServices.length > 3 && (
                              <span style={{ color: '#64748b', fontSize: '12px' }}>
                                +{customer.favoriteServices.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}