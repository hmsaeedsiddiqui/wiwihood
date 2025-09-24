"use client";
import React, { useState, useEffect } from 'react';

interface Transaction {
  id: string;
  type: 'earning' | 'withdrawal' | 'refund' | 'bonus' | 'penalty';
  amount: number;
  fee: number;
  netAmount: number;
  description: string;
  client?: string;
  orderId?: string;
  date: string;
  time: string;
  status: 'completed' | 'processing' | 'pending' | 'failed';
  paymentMethod: string;
  category: string;
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [payouts, setPayouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [dateFilter, setDateFilter] = useState('all-time');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTransactionData();
  }, []);

  const fetchTransactionData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('providerToken');
      
      if (!token) {
        setError('Authentication token not found');
        setLoading(false);
        return;
      }

      // Fetch bookings (for earnings and refunds)
      const bookingsResponse = await fetch('http://localhost:8000/api/v1/bookings/my-bookings?limit=1000', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      // Fetch payouts (for withdrawals)
      const payoutsResponse = await fetch('http://localhost:8000/api/v1/payouts', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const allTransactions: Transaction[] = [];

      // Process bookings data
      if (bookingsResponse.ok) {
        const bookingsData = await bookingsResponse.json();
        const bookings = bookingsData.bookings || [];

        bookings.forEach((booking: any) => {
          const amount = booking.totalPrice || 0; // Fixed: use totalPrice from booking entity
          const fee = Math.round(amount * 0.1); // Assume 10% platform fee
          const netAmount = amount - fee;
          const date = booking.scheduledAt || booking.createdAt || new Date().toISOString();

          // Create earning transaction for completed or confirmed bookings
          if (booking.status === 'completed' || booking.status === 'confirmed') {
            allTransactions.push({
              id: `TXN-${booking.id}`,
              type: 'earning',
              amount: amount,
              fee: fee,
              netAmount: netAmount,
              description: `Payment for ${booking.service?.name || booking.serviceName || 'Service'}`,
              client: booking.customer?.name || booking.customerName || 'Unknown Customer',
              orderId: `#${booking.id}`,
              date: new Date(date).toISOString().split('T')[0],
              time: new Date(date).toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                minute: '2-digit', 
                hour12: true 
              }),
              status: 'completed',
              paymentMethod: booking.paymentMethod || 'Credit Card',
              category: booking.service?.category || 'Service'
            });
          }

          // Create refund transaction for refunded bookings
          if (booking.status === 'cancelled' && booking.paymentStatus === 'refunded') {
            allTransactions.push({
              id: `REF-${booking.id}`,
              type: 'refund',
              amount: amount,
              fee: 0,
              netAmount: -amount,
              description: `Refund for cancelled ${booking.service?.name || booking.serviceName || 'Service'}`,
              client: booking.customer?.name || booking.customerName || 'Unknown Customer',
              orderId: `#${booking.id}`,
              date: new Date(booking.updatedAt || date).toISOString().split('T')[0],
              time: new Date(booking.updatedAt || date).toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                minute: '2-digit', 
                hour12: true 
              }),
              status: 'completed',
              paymentMethod: booking.paymentMethod || 'Credit Card',
              category: booking.service?.category || 'Service'
            });
          }
        });
      }

      // Process payouts data
      if (payoutsResponse.ok) {
        const payoutsData = await payoutsResponse.json();
        const payoutsList = Array.isArray(payoutsData) ? payoutsData : payoutsData.payouts || [];
        setPayouts(payoutsList);

        payoutsList.forEach((payout: any) => {
          const amount = payout.amount || 0;
          const fee = payout.fee || Math.round(amount * 0.02); // Assume 2% withdrawal fee
          const netAmount = amount - fee;

          allTransactions.push({
            id: `WTH-${payout.id}`,
            type: 'withdrawal',
            amount: amount,
            fee: fee,
            netAmount: netAmount,
            description: `Withdrawal to ${payout.bankAccount || payout.paymentMethod || 'Bank Account'}`,
            client: undefined,
            orderId: undefined,
            date: new Date(payout.createdAt || new Date()).toISOString().split('T')[0],
            time: new Date(payout.createdAt || new Date()).toLocaleTimeString('en-US', { 
              hour: 'numeric', 
              minute: '2-digit', 
              hour12: true 
            }),
            status: payout.status || 'processing',
            paymentMethod: 'Bank Transfer',
            category: 'Withdrawal'
          });
        });
      }

      // Sort transactions by date (newest first)
      allTransactions.sort((a, b) => {
        const dateA = new Date(`${a.date} ${a.time}`).getTime();
        const dateB = new Date(`${b.date} ${b.time}`).getTime();
        return dateB - dateA;
      });

      setTransactions(allTransactions);
      setError(null);
    } catch (error: any) {
      console.error('Error fetching transaction data:', error);
      // For demo purposes, show empty state instead of error
      setTransactions([]);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesTab = activeTab === 'all' || transaction.type === activeTab;
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (transaction.client && transaction.client.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         transaction.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Date filter logic
    let matchesDate = true;
    if (dateFilter !== 'all-time') {
      const transactionDate = new Date(transaction.date);
      const now = new Date();
      
      switch (dateFilter) {
        case 'today':
          matchesDate = transactionDate.toDateString() === now.toDateString();
          break;
        case 'this-week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesDate = transactionDate >= weekAgo;
          break;
        case 'this-month':
          matchesDate = transactionDate.getMonth() === now.getMonth() && 
                       transactionDate.getFullYear() === now.getFullYear();
          break;
        case 'this-year':
          matchesDate = transactionDate.getFullYear() === now.getFullYear();
          break;
      }
    }
    
    return matchesTab && matchesSearch && matchesDate;
  });

  const getTransactionIcon = (type: string) => {
    switch(type) {
      case 'earning': return '💰';
      case 'withdrawal': return '🏦';
      case 'refund': return '↩️';
      case 'penalty': return '⚠️';
      case 'bonus': return '🎁';
      default: return '💱';
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed': return { bg: '#dcfce7', text: '#16a34a' };
      case 'processing': return { bg: '#fef3c7', text: '#d97706' };
      case 'pending': return { bg: '#dbeafe', text: '#2563eb' };
      case 'failed': return { bg: '#fee2e2', text: '#dc2626' };
      default: return { bg: '#f1f5f9', text: '#64748b' };
    }
  };

  const getAmountColor = (type: string) => {
    switch(type) {
      case 'earning':
      case 'bonus':
        return '#16a34a';
      case 'withdrawal':
      case 'refund':
      case 'penalty':
        return '#dc2626';
      default:
        return '#64748b';
    }
  };

  // Calculate stats
  const stats = {
    totalEarnings: transactions
      .filter(t => t.type === 'earning')
      .reduce((sum, t) => sum + t.netAmount, 0),
    totalWithdrawals: transactions
      .filter(t => t.type === 'withdrawal')
      .reduce((sum, t) => sum + t.amount, 0),
    totalFees: transactions
      .reduce((sum, t) => sum + t.fee, 0),
    netTotal: transactions
      .reduce((sum, t) => {
        if (t.type === 'earning' || t.type === 'bonus') return sum + t.netAmount;
        if (t.type === 'withdrawal' || t.type === 'refund' || t.type === 'penalty') return sum - t.amount;
        return sum;
      }, 0)
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
            <span style={{ marginLeft: '16px', color: '#64748b' }}>Loading transactions...</span>
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
              Error loading transactions
            </h3>
            <p style={{ color: '#dc2626', marginTop: '8px' }}>{error}</p>
            <button
              onClick={fetchTransactionData}
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
            Transactions
          </h1>
          <p style={{ 
            color: '#64748b', 
            fontSize: '16px'
          }}>
            View and manage all your financial transactions
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
              color: '#16a34a',
              marginBottom: '8px'
            }}>
              ${(Number(stats.totalEarnings) || 0).toFixed(2)}
            </div>
            <div style={{ color: '#64748b', fontSize: '14px' }}>Total Earnings</div>
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
              color: '#2563eb',
              marginBottom: '8px'
            }}>
              ${(Number(stats.totalWithdrawals) || 0).toFixed(2)}
            </div>
            <div style={{ color: '#64748b', fontSize: '14px' }}>Total Withdrawals</div>
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
              ${(Number(stats.totalFees) || 0).toFixed(2)}
            </div>
            <div style={{ color: '#64748b', fontSize: '14px' }}>Total Fees</div>
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
              ${(Number(stats.netTotal) || 0).toFixed(2)}
            </div>
            <div style={{ color: '#64748b', fontSize: '14px' }}>Net Total</div>
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
          <div style={{ padding: '24px' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px',
              marginBottom: '20px'
            }}>
              {/* Transaction Type Tabs */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {[
                  { key: 'all', label: 'All' },
                  { key: 'earning', label: 'Earnings' },
                  { key: 'withdrawal', label: 'Withdrawals' },
                  { key: 'refund', label: 'Refunds' },
                  { key: 'bonus', label: 'Bonuses' }
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

              {/* Date Filter */}
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  backgroundColor: 'white',
                  cursor: 'pointer'
                }}
              >
                <option value="all-time">All Time</option>
                <option value="today">Today</option>
                <option value="this-week">This Week</option>
                <option value="this-month">This Month</option>
                <option value="this-year">This Year</option>
              </select>
            </div>

            {/* Search */}
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  padding: '10px 40px 10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  width: '100%',
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

        {/* Transactions Table */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          border: '1px solid #e2e8f0',
          overflow: 'hidden'
        }}>
          {filteredTransactions.length === 0 ? (
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
                💳
              </div>
              <h3 style={{ 
                fontSize: '18px', 
                fontWeight: '600', 
                color: '#1e293b',
                marginBottom: '8px'
              }}>
                No transactions found
              </h3>
              <p style={{ color: '#64748b' }}>
                {searchTerm 
                  ? `No transactions match "${searchTerm}"` 
                  : activeTab === 'all'
                  ? "You don't have any transactions yet."
                  : `No ${activeTab} transactions found.`
                }
              </p>
            </div>
          ) : (
            <>
              {/* Table Header */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr 1fr',
                gap: '16px',
                padding: '16px 24px',
                backgroundColor: '#f8fafc',
                borderBottom: '1px solid #e2e8f0',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151'
              }}>
                <div>TRANSACTION</div>
                <div>AMOUNT</div>
                <div>FEE</div>
                <div>NET AMOUNT</div>
                <div>DATE & TIME</div>
                <div>STATUS</div>
                <div>ACTIONS</div>
              </div>

              {/* Table Body */}
              <div>
                {filteredTransactions.map((transaction, index) => {
                  const statusColor = getStatusColor(transaction.status);
                  const amountColor = getAmountColor(transaction.type);
                  
                  return (
                    <div 
                      key={transaction.id}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr 1fr',
                        gap: '16px',
                        padding: '20px 24px',
                        borderBottom: index < filteredTransactions.length - 1 ? '1px solid #f1f5f9' : 'none',
                        alignItems: 'center',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#f9fafb';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      {/* Transaction Info */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '8px',
                          backgroundColor: '#f1f5f9',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '18px'
                        }}>
                          {getTransactionIcon(transaction.type)}
                        </div>
                        <div>
                          <div style={{ 
                            fontSize: '14px', 
                            fontWeight: '600', 
                            color: '#1e293b',
                            marginBottom: '2px'
                          }}>
                            {transaction.description}
                          </div>
                          <div style={{ 
                            fontSize: '12px', 
                            color: '#64748b'
                          }}>
                            {transaction.id}
                            {transaction.client && ` • ${transaction.client}`}
                          </div>
                        </div>
                      </div>

                      {/* Amount */}
                      <div style={{ 
                        fontSize: '14px', 
                        fontWeight: '600', 
                        color: amountColor
                      }}>
                        {(transaction.type === 'withdrawal' || transaction.type === 'refund' || transaction.type === 'penalty') 
                          ? '-' : '+'}${(Number(transaction.amount) || 0).toFixed(2)}
                      </div>

                      {/* Fee */}
                      <div style={{ 
                        fontSize: '14px', 
                        color: '#64748b'
                      }}>
                        ${(Number(transaction.fee) || 0).toFixed(2)}
                      </div>

                      {/* Net Amount */}
                      <div style={{ 
                        fontSize: '14px', 
                        fontWeight: '600', 
                        color: (Number(transaction.netAmount) || 0) >= 0 ? '#16a34a' : '#dc2626'
                      }}>
                        {(Number(transaction.netAmount) || 0) >= 0 ? '+' : ''}${(Number(transaction.netAmount) || 0).toFixed(2)}
                      </div>

                      {/* Date & Time */}
                      <div style={{ fontSize: '14px', color: '#64748b' }}>
                        <div>{transaction.date}</div>
                        <div style={{ fontSize: '12px' }}>{transaction.time}</div>
                      </div>

                      {/* Status */}
                      <div>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '500',
                          backgroundColor: statusColor.bg,
                          color: statusColor.text
                        }}>
                          {transaction.status}
                        </span>
                      </div>

                      {/* Actions */}
                      <div>
                        <button style={{
                          backgroundColor: 'transparent',
                          color: '#64748b',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          border: '1px solid #d1d5db',
                          fontSize: '12px',
                          cursor: 'pointer'
                        }}>
                          View
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Export Options */}
        {filteredTransactions.length > 0 && (
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
            marginTop: '16px'
          }}>
            <button style={{
              backgroundColor: 'white',
              color: '#64748b',
              padding: '8px 16px',
              borderRadius: '6px',
              border: '1px solid #d1d5db',
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              📄 Export PDF
            </button>
            <button style={{
              backgroundColor: 'white',
              color: '#64748b',
              padding: '8px 16px',
              borderRadius: '6px',
              border: '1px solid #d1d5db',
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              📊 Export CSV
            </button>
          </div>
        )}
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