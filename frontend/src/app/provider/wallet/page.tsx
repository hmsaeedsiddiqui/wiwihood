'use client';

import React, { useState } from 'react';

const WalletPage = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const mockTransactions = [
    {
      id: 1,
      type: 'credit',
      amount: 250.00,
      description: 'Payment from Logo Design project',
      buyer: 'Sarah Johnson',
      date: '2024-08-27',
      status: 'completed',
      orderId: '#ORD-001'
    },
    {
      id: 2,
      type: 'debit',
      amount: 25.00,
      description: 'Platform fee',
      buyer: null,
      date: '2024-08-27',
      status: 'completed',
      orderId: '#ORD-001'
    },
    {
      id: 3,
      type: 'credit',
      amount: 150.00,
      description: 'Payment from Web Development project',
      buyer: 'Michael Chen',
      date: '2024-08-25',
      status: 'completed',
      orderId: '#ORD-002'
    },
    {
      id: 4,
      type: 'withdrawal',
      amount: 500.00,
      description: 'Withdrawal to Bank Account',
      buyer: null,
      date: '2024-08-23',
      status: 'processing',
      orderId: '#WTH-001'
    },
    {
      id: 5,
      type: 'credit',
      amount: 75.00,
      description: 'Payment from Content Writing project',
      buyer: 'Emma Williams',
      date: '2024-08-22',
      status: 'completed',
      orderId: '#ORD-003'
    }
  ];

  const walletStats = {
    availableBalance: 1292.50,
    pendingEarnings: 450.75,
    totalEarnings: 10292.50,
    totalWithdrawals: 8549.25,
    thisMonth: 2156.75,
    lastMonth: 1845.20
  };

  const getTransactionIcon = (type) => {
    switch(type) {
      case 'credit': return '💰';
      case 'debit': return '💳';
      case 'withdrawal': return '🏦';
      default: return '💱';
    }
  };

  const getTransactionColor = (type) => {
    switch(type) {
      case 'credit': return '#22c55e';
      case 'debit': return '#ef4444';
      case 'withdrawal': return '#3b82f6';
      default: return '#64748b';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return { bg: '#dcfce7', text: '#16a34a' };
      case 'processing': return { bg: '#fef3c7', text: '#d97706' };
      case 'pending': return { bg: '#fee2e2', text: '#dc2626' };
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
            Wallet
          </h1>
          <p style={{ 
            color: '#64748b', 
            fontSize: '16px'
          }}>
            Manage your earnings, withdrawals, and financial overview
          </p>
        </div>

        {/* Balance Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '20px',
          marginBottom: '30px'
        }}>
          {/* Available Balance */}
          <div style={{ 
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '28px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
            border: '1px solid #e2e8f0',
            background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
            color: '#ffffff'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'start',
              marginBottom: '16px'
            }}>
              <div>
                <h3 style={{ 
                  fontSize: '16px', 
                  fontWeight: '500', 
                  opacity: '0.9',
                  margin: '0 0 8px 0'
                }}>
                  Available Balance
                </h3>
                <div style={{ 
                  fontSize: '32px', 
                  fontWeight: '700',
                  margin: '0'
                }}>
                  ${walletStats.availableBalance.toLocaleString()}
                </div>
              </div>
              <div style={{ fontSize: '32px', opacity: '0.8' }}>💳</div>
            </div>
            <button style={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: '#ffffff',
              padding: '10px 20px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              width: '100%'
            }}>
              Withdraw Funds
            </button>
          </div>

          {/* Pending Earnings */}
          <div style={{ 
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '28px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'start',
              marginBottom: '16px'
            }}>
              <div>
                <h3 style={{ 
                  fontSize: '16px', 
                  fontWeight: '500', 
                  color: '#64748b',
                  margin: '0 0 8px 0'
                }}>
                  Pending Earnings
                </h3>
                <div style={{ 
                  fontSize: '32px', 
                  fontWeight: '700',
                  color: '#f59e0b',
                  margin: '0'
                }}>
                  ${walletStats.pendingEarnings.toLocaleString()}
                </div>
              </div>
              <div style={{ fontSize: '32px' }}>⏳</div>
            </div>
            <p style={{ 
              fontSize: '12px', 
              color: '#64748b',
              margin: '0'
            }}>
              Funds will be available after project completion
            </p>
          </div>

          {/* Total Earnings */}
          <div style={{ 
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '28px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'start',
              marginBottom: '16px'
            }}>
              <div>
                <h3 style={{ 
                  fontSize: '16px', 
                  fontWeight: '500', 
                  color: '#64748b',
                  margin: '0 0 8px 0'
                }}>
                  Total Earnings
                </h3>
                <div style={{ 
                  fontSize: '32px', 
                  fontWeight: '700',
                  color: '#3b82f6',
                  margin: '0'
                }}>
                  ${walletStats.totalEarnings.toLocaleString()}
                </div>
              </div>
              <div style={{ fontSize: '32px' }}>📈</div>
            </div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              fontSize: '12px',
              color: '#64748b'
            }}>
              <span>This month: ${walletStats.thisMonth.toLocaleString()}</span>
              <span style={{ color: '#22c55e' }}>+16.8%</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '30px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <h3 style={{ 
            fontSize: '18px', 
            fontWeight: '600', 
            color: '#1e293b',
            marginBottom: '16px'
          }}>
            Quick Actions
          </h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '16px'
          }}>
            <button style={{
              backgroundColor: '#22c55e',
              color: '#ffffff',
              padding: '16px 20px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              justifyContent: 'center'
            }}>
              <span>💰</span> Withdraw to Bank
            </button>
            
            <button style={{
              backgroundColor: '#3b82f6',
              color: '#ffffff',
              padding: '16px 20px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              justifyContent: 'center'
            }}>
              <span>💳</span> Add Payment Method
            </button>
            
            <button style={{
              backgroundColor: '#8b5cf6',
              color: '#ffffff',
              padding: '16px 20px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              justifyContent: 'center'
            }}>
              <span>📊</span> View Analytics
            </button>
            
            <button style={{
              backgroundColor: '#f59e0b',
              color: '#ffffff',
              padding: '16px 20px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              justifyContent: 'center'
            }}>
              <span>📄</span> Tax Documents
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ 
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e2e8f0'
        }}>
          {/* Tab Headers */}
          <div style={{ 
            display: 'flex', 
            borderBottom: '1px solid #e2e8f0'
          }}>
            {['overview', 'transactions', 'withdrawals'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '16px 24px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                  color: activeTab === tab ? '#22c55e' : '#64748b',
                  borderBottom: activeTab === tab ? '2px solid #22c55e' : '2px solid transparent',
                  transition: 'all 0.2s ease'
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div style={{ padding: '24px' }}>
            {activeTab === 'overview' && (
              <div>
                <h3 style={{ 
                  fontSize: '18px', 
                  fontWeight: '600', 
                  color: '#1e293b',
                  marginBottom: '20px'
                }}>
                  Financial Overview
                </h3>
                
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                  gap: '20px',
                  marginBottom: '24px'
                }}>
                  <div style={{
                    backgroundColor: '#f8fafc',
                    borderRadius: '8px',
                    padding: '20px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '24px', fontWeight: '700', color: '#1e293b' }}>
                      ${walletStats.totalWithdrawals.toLocaleString()}
                    </div>
                    <div style={{ fontSize: '14px', color: '#64748b' }}>Total Withdrawals</div>
                  </div>
                  
                  <div style={{
                    backgroundColor: '#f8fafc',
                    borderRadius: '8px',
                    padding: '20px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '24px', fontWeight: '700', color: '#1e293b' }}>
                      ${walletStats.lastMonth.toLocaleString()}
                    </div>
                    <div style={{ fontSize: '14px', color: '#64748b' }}>Last Month</div>
                  </div>
                </div>

                {/* Recent Activity */}
                <h4 style={{ 
                  fontSize: '16px', 
                  fontWeight: '600', 
                  color: '#1e293b',
                  marginBottom: '16px'
                }}>
                  Recent Activity
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {mockTransactions.slice(0, 5).map(transaction => (
                    <div key={transaction.id} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px 0',
                      borderBottom: '1px solid #f1f5f9'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '20px' }}>
                          {getTransactionIcon(transaction.type)}
                        </span>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: '500', color: '#1e293b' }}>
                            {transaction.description}
                          </div>
                          <div style={{ fontSize: '12px', color: '#64748b' }}>
                            {transaction.date}
                          </div>
                        </div>
                      </div>
                      <div style={{ 
                        fontSize: '14px', 
                        fontWeight: '600',
                        color: getTransactionColor(transaction.type)
                      }}>
                        {transaction.type === 'debit' || transaction.type === 'withdrawal' ? '-' : '+'}
                        ${transaction.amount.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'transactions' && (
              <div>
                <h3 style={{ 
                  fontSize: '18px', 
                  fontWeight: '600', 
                  color: '#1e293b',
                  marginBottom: '20px'
                }}>
                  Transaction History
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {mockTransactions.map(transaction => (
                    <div key={transaction.id} style={{
                      backgroundColor: '#f8fafc',
                      borderRadius: '8px',
                      padding: '20px',
                      border: '1px solid #e2e8f0'
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'start',
                        marginBottom: '12px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ fontSize: '24px' }}>
                            {getTransactionIcon(transaction.type)}
                          </span>
                          <div>
                            <h4 style={{ 
                              fontSize: '16px', 
                              fontWeight: '600', 
                              color: '#1e293b',
                              margin: '0 0 4px 0'
                            }}>
                              {transaction.description}
                            </h4>
                            {transaction.buyer && (
                              <p style={{ 
                                fontSize: '14px', 
                                color: '#64748b',
                                margin: '0'
                              }}>
                                From: {transaction.buyer}
                              </p>
                            )}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ 
                            fontSize: '18px', 
                            fontWeight: '700',
                            color: getTransactionColor(transaction.type),
                            marginBottom: '4px'
                          }}>
                            {transaction.type === 'debit' || transaction.type === 'withdrawal' ? '-' : '+'}
                            ${transaction.amount.toFixed(2)}
                          </div>
                          <span style={{
                            backgroundColor: getStatusColor(transaction.status).bg,
                            color: getStatusColor(transaction.status).text,
                            padding: '2px 8px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '500',
                            textTransform: 'capitalize'
                          }}>
                            {transaction.status}
                          </span>
                        </div>
                      </div>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        fontSize: '12px',
                        color: '#64748b'
                      }}>
                        <span>Order: {transaction.orderId}</span>
                        <span>{transaction.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'withdrawals' && (
              <div>
                <h3 style={{ 
                  fontSize: '18px', 
                  fontWeight: '600', 
                  color: '#1e293b',
                  marginBottom: '20px'
                }}>
                  Withdrawal History
                </h3>
                
                <div style={{
                  backgroundColor: '#f0f9ff',
                  border: '1px solid #bae6fd',
                  borderRadius: '8px',
                  padding: '16px',
                  marginBottom: '24px'
                }}>
                  <h4 style={{ 
                    fontSize: '14px', 
                    fontWeight: '600', 
                    color: '#0369a1',
                    margin: '0 0 8px 0'
                  }}>
                    💡 Withdrawal Information
                  </h4>
                  <p style={{ 
                    fontSize: '14px', 
                    color: '#0369a1',
                    margin: '0'
                  }}>
                    Withdrawals typically take 2-5 business days to process. Minimum withdrawal amount is $20.
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {mockTransactions.filter(t => t.type === 'withdrawal').map(withdrawal => (
                    <div key={withdrawal.id} style={{
                      backgroundColor: '#f8fafc',
                      borderRadius: '8px',
                      padding: '20px',
                      border: '1px solid #e2e8f0'
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ fontSize: '24px' }}>🏦</span>
                          <div>
                            <h4 style={{ 
                              fontSize: '16px', 
                              fontWeight: '600', 
                              color: '#1e293b',
                              margin: '0 0 4px 0'
                            }}>
                              Bank Transfer
                            </h4>
                            <p style={{ 
                              fontSize: '14px', 
                              color: '#64748b',
                              margin: '0'
                            }}>
                              To: ****1234 | {withdrawal.date}
                            </p>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ 
                            fontSize: '18px', 
                            fontWeight: '700',
                            color: '#3b82f6',
                            marginBottom: '4px'
                          }}>
                            ${withdrawal.amount.toFixed(2)}
                          </div>
                          <span style={{
                            backgroundColor: getStatusColor(withdrawal.status).bg,
                            color: getStatusColor(withdrawal.status).text,
                            padding: '2px 8px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '500',
                            textTransform: 'capitalize'
                          }}>
                            {withdrawal.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {mockTransactions.filter(t => t.type === 'withdrawal').length === 0 && (
                  <div style={{
                    textAlign: 'center',
                    padding: '40px 20px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '8px'
                  }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏦</div>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>
                      No withdrawals yet
                    </h3>
                    <p style={{ color: '#64748b', marginBottom: '24px' }}>
                      Start withdrawing your earnings to your bank account.
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
                      Make First Withdrawal
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletPage;
