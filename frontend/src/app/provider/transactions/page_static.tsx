'use client';

import React, { useState } from 'react';

const TransactionsPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [dateFilter, setDateFilter] = useState('all-time');
  const [searchTerm, setSearchTerm] = useState('');

  const mockTransactions = [
    {
      id: 'TXN-001',
      type: 'earning',
      amount: 250.00,
      fee: 25.00,
      netAmount: 225.00,
      description: 'Payment for Logo Design Project',
      client: 'Sarah Johnson',
      orderId: '#ORD-001',
      date: '2024-08-27',
      time: '10:30 AM',
      status: 'completed',
      paymentMethod: 'Credit Card',
      category: 'Design Services'
    },
    {
      id: 'TXN-002',
      type: 'withdrawal',
      amount: 500.00,
      fee: 5.00,
      netAmount: 495.00,
      description: 'Withdrawal to Bank Account ****1234',
      client: null,
      orderId: null,
      date: '2024-08-25',
      time: '02:15 PM',
      status: 'processing',
      paymentMethod: 'Bank Transfer',
      category: 'Withdrawal'
    },
    {
      id: 'TXN-003',
      type: 'earning',
      amount: 150.00,
      fee: 15.00,
      netAmount: 135.00,
      description: 'Payment for Website Development',
      client: 'Michael Chen',
      orderId: '#ORD-002',
      date: '2024-08-24',
      time: '09:45 AM',
      status: 'completed',
      paymentMethod: 'PayPal',
      category: 'Development'
    },
    {
      id: 'TXN-004',
      type: 'refund',
      amount: 75.00,
      fee: 0.00,
      netAmount: -75.00,
      description: 'Refund for cancelled Content Writing project',
      client: 'David Rodriguez',
      orderId: '#ORD-005',
      date: '2024-08-23',
      time: '04:20 PM',
      status: 'completed',
      paymentMethod: 'Credit Card',
      category: 'Writing Services'
    },
    {
      id: 'TXN-005',
      type: 'earning',
      amount: 320.00,
      fee: 32.00,
      netAmount: 288.00,
      description: 'Payment for Social Media Marketing Strategy',
      client: 'Emma Williams',
      orderId: '#ORD-003',
      date: '2024-08-22',
      time: '11:10 AM',
      status: 'completed',
      paymentMethod: 'Stripe',
      category: 'Marketing'
    },
    {
      id: 'TXN-006',
      type: 'penalty',
      amount: 20.00,
      fee: 0.00,
      netAmount: -20.00,
      description: 'Late delivery penalty for order #ORD-007',
      client: 'Platform',
      orderId: '#ORD-007',
      date: '2024-08-20',
      time: '03:30 PM',
      status: 'completed',
      paymentMethod: 'Account Deduction',
      category: 'Penalty'
    },
    {
      id: 'TXN-007',
      type: 'earning',
      amount: 450.00,
      fee: 45.00,
      netAmount: 405.00,
      description: 'Payment for Mobile App UI/UX Design',
      client: 'Lisa Zhang',
      orderId: '#ORD-006',
      date: '2024-08-18',
      time: '01:45 PM',
      status: 'completed',
      paymentMethod: 'Credit Card',
      category: 'Design Services'
    },
    {
      id: 'TXN-008',
      type: 'bonus',
      amount: 50.00,
      fee: 0.00,
      netAmount: 50.00,
      description: 'Performance bonus for excellent reviews',
      client: 'Platform',
      orderId: null,
      date: '2024-08-15',
      time: '12:00 PM',
      status: 'completed',
      paymentMethod: 'Account Credit',
      category: 'Bonus'
    }
  ];

  const filteredTransactions = mockTransactions.filter(transaction => {
    const matchesTab = activeTab === 'all' || transaction.type === activeTab;
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (transaction.client && transaction.client.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         transaction.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getTransactionIcon = (type) => {
    switch(type) {
      case 'earning': return '💰';
      case 'withdrawal': return '🏦';
      case 'refund': return '↩️';
      case 'penalty': return '⚠️';
      case 'bonus': return '🎁';
      default: return '💱';
    }
  };

  const getTransactionColor = (type) => {
    switch(type) {
      case 'earning': return '#22c55e';
      case 'withdrawal': return '#3b82f6';
      case 'refund': return '#ef4444';
      case 'penalty': return '#dc2626';
      case 'bonus': return '#8b5cf6';
      default: return '#64748b';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return { bg: '#dcfce7', text: '#16a34a' };
      case 'processing': return { bg: '#fef3c7', text: '#d97706' };
      case 'pending': return { bg: '#fee2e2', text: '#dc2626' };
      case 'failed': return { bg: '#fee2e2', text: '#dc2626' };
      default: return { bg: '#f1f5f9', text: '#64748b' };
    }
  };

  const totalEarnings = filteredTransactions
    .filter(t => t.type === 'earning' || t.type === 'bonus')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalWithdrawals = filteredTransactions
    .filter(t => t.type === 'withdrawal')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalFees = filteredTransactions
    .reduce((sum, t) => sum + t.fee, 0);

  const netTotal = filteredTransactions
    .reduce((sum, t) => sum + t.netAmount, 0);

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

        {/* Summary Cards */}
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
              ${totalEarnings.toLocaleString()}
            </div>
            <div style={{ fontSize: '14px', color: '#64748b' }}>Total Earnings</div>
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
              ${totalWithdrawals.toLocaleString()}
            </div>
            <div style={{ fontSize: '14px', color: '#64748b' }}>Total Withdrawals</div>
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
              ${totalFees.toLocaleString()}
            </div>
            <div style={{ fontSize: '14px', color: '#64748b' }}>Total Fees</div>
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
              color: netTotal >= 0 ? '#22c55e' : '#ef4444',
              marginBottom: '8px'
            }}>
              ${netTotal.toLocaleString()}
            </div>
            <div style={{ fontSize: '14px', color: '#64748b' }}>Net Total</div>
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
            display: 'grid', 
            gridTemplateColumns: 'auto 1fr auto', 
            gap: '20px',
            alignItems: 'center'
          }}>
            {/* Transaction Type Tabs */}
            <div style={{ display: 'flex', gap: '4px' }}>
              {[
                { key: 'all', label: 'All' },
                { key: 'earning', label: 'Earnings' },
                { key: 'withdrawal', label: 'Withdrawals' },
                { key: 'refund', label: 'Refunds' },
                { key: 'bonus', label: 'Bonuses' }
              ].map(tab => (
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
                    backgroundColor: activeTab === tab.key ? '#22c55e' : '#f1f5f9',
                    color: activeTab === tab.key ? '#ffffff' : '#64748b',
                    transition: 'all 0.2s ease',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search Bar */}
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px 8px 36px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  fontSize: '14px',
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

            {/* Date Filter */}
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                fontSize: '14px',
                backgroundColor: '#ffffff',
                outline: 'none'
              }}
            >
              <option value="all-time">All Time</option>
              <option value="this-month">This Month</option>
              <option value="last-month">Last Month</option>
              <option value="this-year">This Year</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>
        </div>

        {/* Transactions Table */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e2e8f0'
        }}>
          {/* Table Header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 120px 120px 120px 150px 100px 80px',
            gap: '16px',
            padding: '16px 20px',
            backgroundColor: '#f8fafc',
            borderBottom: '1px solid #e2e8f0',
            fontSize: '12px',
            fontWeight: '600',
            color: '#64748b',
            textTransform: 'uppercase'
          }}>
            <div>Transaction</div>
            <div>Amount</div>
            <div>Fee</div>
            <div>Net Amount</div>
            <div>Date & Time</div>
            <div>Status</div>
            <div>Actions</div>
          </div>

          {/* Table Body */}
          <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map(transaction => (
                <div key={transaction.id} style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 120px 120px 120px 150px 100px 80px',
                  gap: '16px',
                  padding: '20px',
                  borderBottom: '1px solid #f1f5f9',
                  alignItems: 'center'
                }}>
                  {/* Transaction Details */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: `${getTransactionColor(transaction.type)}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '18px'
                    }}>
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div>
                      <h4 style={{ 
                        fontSize: '14px', 
                        fontWeight: '600', 
                        color: '#1e293b',
                        margin: '0 0 4px 0'
                      }}>
                        {transaction.description}
                      </h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '12px', color: '#64748b' }}>
                          {transaction.id}
                        </span>
                        {transaction.client && transaction.client !== 'Platform' && (
                          <>
                            <span style={{ fontSize: '12px', color: '#64748b' }}>•</span>
                            <span style={{ fontSize: '12px', color: '#64748b' }}>
                              {transaction.client}
                            </span>
                          </>
                        )}
                        {transaction.orderId && (
                          <>
                            <span style={{ fontSize: '12px', color: '#64748b' }}>•</span>
                            <span style={{ fontSize: '12px', color: '#64748b' }}>
                              {transaction.orderId}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Amount */}
                  <div style={{ 
                    fontSize: '14px', 
                    fontWeight: '600',
                    color: getTransactionColor(transaction.type)
                  }}>
                    ${transaction.amount.toFixed(2)}
                  </div>

                  {/* Fee */}
                  <div style={{ 
                    fontSize: '14px', 
                    color: transaction.fee > 0 ? '#ef4444' : '#64748b'
                  }}>
                    {transaction.fee > 0 ? `-$${transaction.fee.toFixed(2)}` : '$0.00'}
                  </div>

                  {/* Net Amount */}
                  <div style={{ 
                    fontSize: '14px', 
                    fontWeight: '600',
                    color: transaction.netAmount >= 0 ? '#22c55e' : '#ef4444'
                  }}>
                    {transaction.netAmount >= 0 ? '+' : ''}${transaction.netAmount.toFixed(2)}
                  </div>

                  {/* Date & Time */}
                  <div>
                    <div style={{ fontSize: '14px', color: '#1e293b', fontWeight: '500' }}>
                      {transaction.date}
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>
                      {transaction.time}
                    </div>
                  </div>

                  {/* Status */}
                  <div>
                    <span style={{
                      backgroundColor: getStatusColor(transaction.status).bg,
                      color: getStatusColor(transaction.status).text,
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500',
                      textTransform: 'capitalize'
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
                      borderRadius: '4px',
                      border: '1px solid #e2e8f0',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}>
                      View
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '60px 20px'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>💳</div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>
                  No transactions found
                </h3>
                <p style={{ color: '#64748b' }}>
                  {searchTerm 
                    ? `No transactions match "${searchTerm}"`
                    : activeTab === 'all'
                      ? "You don't have any transactions yet."
                      : `No ${activeTab} transactions found.`}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Export Options */}
        <div style={{
          marginTop: '24px',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '12px'
        }}>
          <button style={{
            backgroundColor: '#f1f5f9',
            color: '#64748b',
            padding: '10px 16px',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            📊 Export PDF
          </button>
          <button style={{
            backgroundColor: '#f1f5f9',
            color: '#64748b',
            padding: '10px 16px',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            📈 Export CSV
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionsPage;
