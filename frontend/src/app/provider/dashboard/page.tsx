"use client";
import React, { useState, useEffect } from "react";

interface BookingStats {
  ordersActive: number;
  pending: number;
  completed: number;
  cancelled: number;
}

interface FinancialData {
  totalCredit: number;
  totalDebit: number;
  earnings: number;
  walletBalance: number;
}

interface ChartData {
  month: string;
  revenue: number;
  withdraw: number;
}

interface RecentBooking {
  id: string;
  customerName: string;
  serviceName: string;
  amount: number;
  status: string;
  createdAt: string;
}

export default function ProviderDashboard() {
  const [bookingStats, setBookingStats] = useState<BookingStats>({
    ordersActive: 0,
    pending: 0,
    completed: 0,
    cancelled: 0
  });
  
  const [financialData, setFinancialData] = useState<FinancialData>({
    totalCredit: 0,
    totalDebit: 0,
    earnings: 0,
    walletBalance: 0
  });
  
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('providerToken');
      console.log('Provider token:', token ? 'exists' : 'missing');
      if (!token) {
        setError('Authentication token not found');
        setLoading(false);
        return;
      }

      // Fetch bookings data with proper query parameters
      const bookingsResponse = await fetch('http://localhost:8000/api/v1/bookings/my-bookings?page=1&limit=100', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!bookingsResponse.ok) {
        const errorData = await bookingsResponse.text();
        console.error('Bookings API Error:', bookingsResponse.status, errorData);
        throw new Error(`Failed to fetch bookings data: ${bookingsResponse.status} - ${errorData}`);
      }

      const bookingsData = await bookingsResponse.json();
      console.log('Bookings API Response:', bookingsData);
      const bookings = Array.isArray(bookingsData) ? bookingsData : bookingsData.bookings || [];

      // Calculate booking statistics
      const stats = {
        ordersActive: bookings.filter((b: any) => b.status === 'confirmed' || b.status === 'in_progress').length,
        pending: bookings.filter((b: any) => b.status === 'pending').length,
        completed: bookings.filter((b: any) => b.status === 'completed').length,
        cancelled: bookings.filter((b: any) => b.status === 'cancelled').length
      };
      setBookingStats(stats);

      // Calculate financial data
      const earnedBookings = bookings.filter((b: any) => b.status === 'completed' || b.status === 'confirmed');
      const cancelledBookings = bookings.filter((b: any) => b.status === 'cancelled');
      
      const totalEarnings = earnedBookings.reduce((sum: number, booking: any) => {
        return sum + (parseFloat(booking.totalPrice) || 0);
      }, 0);

      const totalRefunds = cancelledBookings.reduce((sum: number, booking: any) => {
        return sum + (parseFloat(booking.totalPrice) || 0);
      }, 0);

      // Try to fetch payouts data for withdrawals
      let totalWithdrawals = 0;
      try {
        const payoutsResponse = await fetch('http://localhost:8000/api/v1/payouts?page=1&limit=100', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        if (payoutsResponse.ok) {
          const payoutsData = await payoutsResponse.json();
          const payouts = Array.isArray(payoutsData) ? payoutsData : payoutsData.payouts || [];
          totalWithdrawals = payouts.reduce((sum: number, payout: any) => {
            return sum + (parseFloat(payout.amount) || 0);
          }, 0);
        }
      } catch (payoutError) {
        console.log('Payouts data not available:', payoutError);
      }

      const financials = {
        totalCredit: totalEarnings,
        totalDebit: totalRefunds,
        earnings: totalEarnings,
        walletBalance: totalEarnings - totalWithdrawals
      };
      setFinancialData(financials);

      // Calculate monthly chart data
      const monthlyData = calculateMonthlyData(bookings);
      setChartData(monthlyData);

      // Get recent bookings (last 4)
      const recent = bookings
        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 4)
        .map((booking: any) => ({
          id: booking.id,
          customerName: booking.customer 
            ? `${booking.customer.firstName || ''} ${booking.customer.lastName || ''}`.trim()
            : booking.customerName || 'Unknown Customer',
          serviceName: booking.service?.name || booking.serviceName || 'Service',
          amount: parseFloat(booking.totalPrice) || 0,
          status: booking.status,
          createdAt: booking.createdAt
        }));
      setRecentBookings(recent);

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const calculateMonthlyData = (bookings: any[]): ChartData[] => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = new Date().getFullYear();
    
    return months.map((month, index) => {
      const monthBookings = bookings.filter((booking: any) => {
        const bookingDate = new Date(booking.createdAt);
        return bookingDate.getMonth() === index && bookingDate.getFullYear() === currentYear;
      });

      const revenue = monthBookings
        .filter((b: any) => b.status === 'completed' || b.status === 'confirmed')
        .reduce((sum: number, b: any) => sum + (parseFloat(b.totalPrice) || 0), 0);

      const withdraw = monthBookings
        .filter((b: any) => b.status === 'cancelled')
        .reduce((sum: number, b: any) => sum + (parseFloat(b.totalPrice) || 0), 0);

      return {
        month,
        revenue: Math.min(revenue / 100, 180), // Scale for chart display
        withdraw: Math.min(withdraw / 100, 110) // Scale for chart display
      };
    });
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'completed': return '#22c55e';
      case 'pending': return '#f59e0b';
      case 'confirmed': 
      case 'in_progress': return '#3b82f6';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status: string): React.ReactElement => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'confirmed':
        return (
          <svg style={{ width: '16px', height: '16px', color: '#ffffff' }} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
          </svg>
        );
      case 'pending':
        return (
          <svg style={{ width: '16px', height: '16px', color: '#ffffff' }} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
          </svg>
        );
      case 'cancelled':
        return (
          <svg style={{ width: '16px', height: '16px', color: '#ffffff' }} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
          </svg>
        );
      default:
        return (
          <svg style={{ width: '16px', height: '16px', color: '#ffffff' }} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
          </svg>
        );
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '400px',
        color: '#6b7280'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            border: '4px solid #f3f4f6', 
            borderTop: '4px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          Loading dashboard data...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        padding: '20px',
        backgroundColor: '#fef2f2',
        border: '1px solid #fecaca',
        borderRadius: '8px',
        color: '#dc2626'
      }}>
        <p style={{ fontWeight: '600', marginBottom: '8px' }}>Error loading dashboard</p>
        <p style={{ fontSize: '14px' }}>{error}</p>
        <button 
          onClick={fetchDashboardData}
          style={{
            marginTop: '12px',
            backgroundColor: '#dc2626',
            color: 'white',
            padding: '8px 16px',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      
      {/* Stats Cards - Top Row */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(4, 1fr)', 
        gap: '16px', 
        marginBottom: '20px'
      }}>
        {/* Orders Active */}
        <div style={{ 
          backgroundColor: '#ffffff', 
          borderRadius: '8px', 
          padding: '16px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ 
                fontSize: '11px', 
                color: '#000000', 
                fontWeight: '600', 
                marginBottom: '4px'
              }}>Orders Active</p>
              <p style={{ 
                fontSize: '24px', 
                fontWeight: '700', 
                color: '#111827',
                lineHeight: '1'
              }}>{bookingStats.ordersActive}</p>
            </div>
            <div style={{ 
              width: '32px', 
              height: '32px', 
              backgroundColor: '#22c55e', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center'
            }}>
              {getStatusIcon('confirmed')}
            </div>
          </div>
        </div>

        {/* Pending */}
        <div style={{ 
          backgroundColor: '#ffffff', 
          borderRadius: '8px', 
          padding: '16px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ 
                fontSize: '11px', 
                color: '#000000', 
                fontWeight: '600', 
                marginBottom: '4px'
              }}>Pending</p>
              <p style={{ 
                fontSize: '24px', 
                fontWeight: '700', 
                color: '#111827',
                lineHeight: '1'
              }}>{bookingStats.pending}</p>
            </div>
            <div style={{ 
              width: '32px', 
              height: '32px', 
              backgroundColor: '#f59e0b', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center'
            }}>
              {getStatusIcon('pending')}
            </div>
          </div>
        </div>

        {/* Completed */}
        <div style={{ 
          backgroundColor: '#ffffff', 
          borderRadius: '8px', 
          padding: '16px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ 
                fontSize: '11px', 
                color: '#000000', 
                fontWeight: '600', 
                marginBottom: '4px'
              }}>Completed</p>
              <p style={{ 
                fontSize: '24px', 
                fontWeight: '700', 
                color: '#111827',
                lineHeight: '1'
              }}>{bookingStats.completed}</p>
            </div>
            <div style={{ 
              width: '32px', 
              height: '32px', 
              backgroundColor: '#3b82f6', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center'
            }}>
              {getStatusIcon('completed')}
            </div>
          </div>
        </div>

        {/* Cancelled */}
        <div style={{ 
          backgroundColor: '#ffffff', 
          borderRadius: '8px', 
          padding: '16px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ 
                fontSize: '11px', 
                color: '#000000', 
                fontWeight: '600', 
                marginBottom: '4px'
              }}>Cancelled</p>
              <p style={{ 
                fontSize: '24px', 
                fontWeight: '700', 
                color: '#111827',
                lineHeight: '1'
              }}>{bookingStats.cancelled}</p>
            </div>
            <div style={{ 
              width: '32px', 
              height: '32px', 
              backgroundColor: '#ef4444', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center'
            }}>
              {getStatusIcon('cancelled')}
            </div>
          </div>
        </div>
      </div>

      {/* Financial Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '20px' }}>
        {/* Total Credit */}
        <div style={{ 
          backgroundColor: '#ffffff', 
          borderRadius: '12px', 
          padding: '20px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          border: '1px solid #f3f4f6'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              backgroundColor: '#dcfce7', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              flexShrink: '0'
            }}>
              <svg style={{ width: '20px', height: '20px', color: '#16a34a' }} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
              </svg>
            </div>
            <div style={{ flex: '1' }}>
              <p style={{ fontSize: '13px', color: '#6b7280', fontWeight: '500', marginBottom: '2px' }}>Total Credit</p>
              <p style={{ fontSize: '22px', fontWeight: '700', color: '#111827', lineHeight: '1.2' }}>{formatCurrency(financialData.totalCredit)}</p>
            </div>
          </div>
          <div style={{ 
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            backgroundColor: '#dcfce7',
            padding: '4px 8px',
            borderRadius: '6px'
          }}>
            <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: '600' }}>Total earnings</span>
          </div>
        </div>

        {/* Total Debit */}
        <div style={{ 
          backgroundColor: '#ffffff', 
          borderRadius: '12px', 
          padding: '20px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          border: '1px solid #f3f4f6'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              backgroundColor: '#ede9fe', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              flexShrink: '0'
            }}>
              <svg style={{ width: '20px', height: '20px', color: '#7c3aed' }} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
              </svg>
            </div>
            <div style={{ flex: '1' }}>
              <p style={{ fontSize: '13px', color: '#6b7280', fontWeight: '500', marginBottom: '2px' }}>Total Debit</p>
              <p style={{ fontSize: '22px', fontWeight: '700', color: '#111827', lineHeight: '1.2' }}>{formatCurrency(financialData.totalDebit)}</p>
            </div>
          </div>
          <div style={{ 
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            backgroundColor: '#ede9fe',
            padding: '4px 8px',
            borderRadius: '6px'
          }}>
            <span style={{ fontSize: '11px', color: '#7c3aed', fontWeight: '600' }}>Refunds</span>
          </div>
        </div>

        {/* Withdraw Funds Card */}
        <div style={{ 
          backgroundColor: '#374151', 
          borderRadius: '12px', 
          padding: '20px',
          color: '#ffffff',
          gridColumn: 'span 2'
        }}>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
            <button style={{ 
              backgroundColor: '#22c55e', 
              color: '#ffffff', 
              padding: '12px 16px', 
              borderRadius: '8px', 
              fontSize: '13px', 
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              flex: '1',
              textAlign: 'center',
              lineHeight: '1.2'
            }}>
              Earnings<br/>
              <span style={{ fontSize: '16px', fontWeight: '700' }}>{formatCurrency(financialData.earnings)}</span>
            </button>
            
            <button style={{ 
              backgroundColor: '#22c55e', 
              color: '#ffffff', 
              padding: '12px 16px', 
              borderRadius: '8px', 
              fontSize: '13px', 
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              flex: '1',
              textAlign: 'center',
              lineHeight: '1.2'
            }}>
              Wallet Balance<br/>
              <span style={{ fontSize: '16px', fontWeight: '700' }}>{formatCurrency(financialData.walletBalance)}</span>
            </button>
          </div>
          
          <button style={{ 
            backgroundColor: 'transparent', 
            color: '#ffffff', 
            padding: '10px 20px', 
            borderRadius: '8px', 
            fontSize: '13px', 
            fontWeight: '600',
            border: '1px solid #6b7280',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            width: '100%'
          }}>
            Withdraw Funds
          </button>
        </div>
      </div>

      {/* Chart and Data Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '20px' }}>
        {/* Sales Statistics Chart */}
        <div style={{ 
          backgroundColor: '#ffffff', 
          borderRadius: '8px',
          padding: '20px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h3 style={{ fontWeight: '600', color: '#111827', fontSize: '16px' }}>Sales Statistics</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '12px', height: '12px', backgroundColor: '#22c55e', borderRadius: '2px' }}></div>
                <span style={{ fontSize: '12px', color: '#6b7280' }}>Revenue</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '12px', height: '12px', backgroundColor: '#4b5563', borderRadius: '2px' }}></div>
                <span style={{ fontSize: '12px', color: '#6b7280' }}>Withdraw</span>
              </div>
              <select style={{ 
                border: '1px solid #d1d5db', 
                borderRadius: '6px', 
                padding: '4px 8px', 
                fontSize: '12px',
                backgroundColor: '#ffffff'
              }}>
                <option>2025</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '40px', marginBottom: '24px' }}>
            <div>
              <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Total Revenue</p>
              <p style={{ fontSize: '24px', fontWeight: '700', color: '#111827' }}>{formatCurrency(financialData.earnings)}</p>
            </div>
            <div>
              <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Total Withdraw</p>
              <p style={{ fontSize: '24px', fontWeight: '700', color: '#111827' }}>{formatCurrency(financialData.totalDebit)}</p>
            </div>
          </div>

          {/* Chart Bars */}
          <div style={{ 
            height: '200px', 
            display: 'flex', 
            alignItems: 'flex-end', 
            justifyContent: 'space-between', 
            paddingLeft: '28px',
            paddingRight: '8px',
            gap: '8px',
            marginBottom: '16px'
          }}>
            {chartData.map((bar, index) => (
              <div key={index} style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                flex: '1',
                maxWidth: '60px'
              }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'flex-end', 
                  gap: '4px', 
                  marginBottom: '12px',
                  width: '100%',
                  justifyContent: 'center'
                }}>
                  <div style={{ 
                    width: '16px', 
                    backgroundColor: '#22c55e', 
                    borderRadius: '2px 2px 0 0',
                    height: `${Math.max(bar.revenue, 20)}px`,
                    transition: 'all 0.3s ease'
                  }}></div>
                  <div style={{ 
                    width: '16px', 
                    backgroundColor: '#4b5563', 
                    borderRadius: '2px 2px 0 0',
                    height: `${Math.max(bar.withdraw, 10)}px`,
                    transition: 'all 0.3s ease'
                  }}></div>
                </div>
                <span style={{ 
                  fontSize: '11px', 
                  color: '#6b7280', 
                  fontWeight: '500'
                }}>{bar.month}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders and Notifications Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Recent Orders */}
        <div style={{ 
          backgroundColor: '#ffffff', 
          borderRadius: '8px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          overflow: 'hidden'
        }}>
          <div style={{ 
            padding: '12px 16px', 
            borderBottom: '1px solid #e5e7eb'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontWeight: '600', color: '#111827', fontSize: '14px' }}>Recent Orders</h3>
              <button style={{ 
                color: '#3b82f6', 
                fontSize: '11px', 
                background: 'none',
                border: 'none',
                cursor: 'pointer'
              }}>View All</button>
            </div>
          </div>
          <div>
            {recentBookings.length > 0 ? recentBookings.map((booking, index) => (
              <div key={booking.id} style={{ 
                padding: '12px 16px',
                borderBottom: index < recentBookings.length - 1 ? '1px solid #f3f4f6' : 'none'
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ 
                    width: '24px', 
                    height: '24px', 
                    backgroundColor: getStatusColor(booking.status), 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    flexShrink: '0',
                    marginTop: '2px'
                  }}>
                    <span style={{ fontSize: '10px', color: '#ffffff', fontWeight: '600' }}>
                      {booking.customerName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div style={{ flex: '1', minWidth: '0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                      <p style={{ 
                        fontSize: '13px', 
                        fontWeight: '600', 
                        color: '#111827',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        marginRight: '8px'
                      }}>{booking.customerName}</p>
                      <span style={{ 
                        fontSize: '12px', 
                        fontWeight: '600', 
                        color: '#111827',
                        flexShrink: '0'
                      }}>{formatCurrency(booking.amount)}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <p style={{ 
                        fontSize: '11px', 
                        color: '#6b7280',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        marginRight: '8px'
                      }}>{booking.serviceName}</p>
                      <span style={{ 
                        fontSize: '10px', 
                        color: '#6b7280',
                        flexShrink: '0'
                      }}>{formatDate(booking.createdAt)}</span>
                    </div>
                    <div style={{ marginTop: '4px' }}>
                      <span style={{ 
                        fontSize: '10px', 
                        fontWeight: '500',
                        color: getStatusColor(booking.status),
                        backgroundColor: `${getStatusColor(booking.status)}20`,
                        padding: '2px 6px',
                        borderRadius: '4px',
                        textTransform: 'capitalize'
                      }}>{booking.status.replace('_', ' ')}</span>
                    </div>
                  </div>
                </div>
              </div>
            )) : (
              <div style={{ padding: '32px 16px', textAlign: 'center', color: '#6b7280' }}>
                <p style={{ fontSize: '14px' }}>No recent orders found</p>
                <p style={{ fontSize: '12px', marginTop: '4px' }}>Your recent bookings will appear here</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Notifications */}
        <div style={{ 
          backgroundColor: '#ffffff', 
          borderRadius: '8px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          overflow: 'hidden'
        }}>
          <div style={{ 
            padding: '12px 16px', 
            borderBottom: '1px solid #e5e7eb'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontWeight: '600', color: '#111827', fontSize: '14px' }}>Recent Notifications</h3>
              <button style={{ 
                color: '#3b82f6', 
                fontSize: '11px', 
                background: 'none',
                border: 'none',
                cursor: 'pointer'
              }}>View All</button>
            </div>
          </div>
          <div style={{ padding: '32px 16px', textAlign: 'center', color: '#6b7280' }}>
            <p style={{ fontSize: '14px' }}>No notifications</p>
            <p style={{ fontSize: '12px', marginTop: '4px' }}>You're all caught up!</p>
          </div>
        </div>
      </div>
    </div>
  );
}