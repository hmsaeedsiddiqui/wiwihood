'use client';

import React, { useState } from 'react';

const PayoutsPage = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestAmount, setRequestAmount] = useState('');

  const mockPayouts = [
    {
      id: 'PAY-001',
      amount: 500.00,
      fee: 5.00,
      netAmount: 495.00,
      requestDate: '2024-08-27',
      processedDate: null,
      expectedDate: '2024-08-30',
      status: 'pending',
      method: 'Bank Transfer',
      account: '****1234',
      reference: 'REF-001'
    },
    {
      id: 'PAY-002',
      amount: 750.00,
      fee: 7.50,
      netAmount: 742.50,
      requestDate: '2024-08-23',
      processedDate: '2024-08-25',
      expectedDate: '2024-08-26',
      status: 'completed',
      method: 'PayPal',
      account: 'user@example.com',
      reference: 'REF-002'
    },
    {
      id: 'PAY-003',
      amount: 300.00,
      fee: 3.00,
      netAmount: 297.00,
      requestDate: '2024-08-20',
      processedDate: '2024-08-22',
      expectedDate: '2024-08-23',
      status: 'completed',
      method: 'Bank Transfer',
      account: '****5678',
      reference: 'REF-003'
    },
    {
      id: 'PAY-004',
      amount: 1000.00,
      fee: 10.00,
      netAmount: 990.00,
      requestDate: '2024-08-18',
      processedDate: null,
      expectedDate: '2024-08-21',
      status: 'failed',
      method: 'Bank Transfer',
      account: '****9012',
      reference: 'REF-004',
      failureReason: 'Invalid account details'
    },
    {
      id: 'PAY-005',
      amount: 450.00,
      fee: 4.50,
      netAmount: 445.50,
      requestDate: '2024-08-15',
      processedDate: '2024-08-17',
      expectedDate: '2024-08-18',
      status: 'completed',
      method: 'Stripe',
      account: '****3456',
      reference: 'REF-005'
    }
  ];

  const paymentMethods = [
    {
      id: 1,
      type: 'Bank Account',
      account: '****1234',
      name: 'Chase Bank',
      isDefault: true,
      minAmount: 20,
      processingTime: '2-5 business days',
      fee: '1%'
    },
    {
      id: 2,
      type: 'PayPal',
      account: 'user@example.com',
      name: 'PayPal Account',
      isDefault: false,
      minAmount: 10,
      processingTime: '1-3 business days',
      fee: '1.5%'
    },
    {
      id: 3,
      type: 'Stripe',
      account: '****3456',
      name: 'Stripe Connect',
      isDefault: false,
      minAmount: 25,
      processingTime: '1-2 business days',
      fee: '1.2%'
    }
  ];

  const availableBalance = 1292.50;
  const pendingAmount = mockPayouts
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);

  const filteredPayouts = mockPayouts.filter(payout => {
    if (activeTab === 'all') return true;
    return payout.status === activeTab;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return { bg: '#dcfce7', text: '#16a34a' };
      case 'pending': return { bg: '#fef3c7', text: '#d97706' };
      case 'processing': return { bg: '#dbeafe', text: '#2563eb' };
      case 'failed': return { bg: '#fee2e2', text: '#dc2626' };
      default: return { bg: '#f1f5f9', text: '#64748b' };
    }
  };

  const getMethodIcon = (method) => {
    switch(method.toLowerCase()) {
      case 'bank transfer': return '🏦';
      case 'paypal': return '💙';
      case 'stripe': return '💳';
      default: return '💰';
    }
  };

  const handleRequestPayout = () => {
    if (requestAmount && parseFloat(requestAmount) >= 20 && parseFloat(requestAmount) <= availableBalance) {
      // Handle payout request
      setShowRequestModal(false);
      setRequestAmount('');
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
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '30px'
        }}>
          <div>
            <h1 style={{ 
              fontSize: '28px', 
              fontWeight: '700', 
              color: '#1e293b',
              marginBottom: '8px'
            }}>
              Payouts
            </h1>
            <p style={{ 
              color: '#64748b', 
              fontSize: '16px'
            }}>
              Manage your payout requests and payment methods
            </p>
          </div>
          
          <button
            onClick={() => setShowRequestModal(true)}
            style={{
              backgroundColor: '#22c55e',
              color: '#ffffff',
              padding: '12px 20px',
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
            💰 Request Payout
          </button>
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
                  ${availableBalance.toLocaleString()}
                </div>
              </div>
              <div style={{ fontSize: '32px', opacity: '0.8' }}>💰</div>
            </div>
            <p style={{ 
              fontSize: '12px', 
              opacity: '0.8',
              margin: '0'
            }}>
              Ready for withdrawal
            </p>
          </div>

          {/* Pending Payouts */}
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
                  Pending Payouts
                </h3>
                <div style={{ 
                  fontSize: '32px', 
                  fontWeight: '700',
                  color: '#f59e0b',
                  margin: '0'
                }}>
                  ${pendingAmount.toLocaleString()}
                </div>
              </div>
              <div style={{ fontSize: '32px' }}>⏳</div>
            </div>
            <p style={{ 
              fontSize: '12px', 
              color: '#64748b',
              margin: '0'
            }}>
              Processing payouts
            </p>
          </div>

          {/* This Month Total */}
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
                  This Month
                </h3>
                <div style={{ 
                  fontSize: '32px', 
                  fontWeight: '700',
                  color: '#3b82f6',
                  margin: '0'
                }}>
                  $2,250
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
              <span>Last month: $1,850</span>
              <span style={{ color: '#22c55e' }}>+21.6%</span>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '30px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: '600', 
              color: '#1e293b',
              margin: '0'
            }}>
              Payment Methods
            </h3>
            <button style={{
              backgroundColor: '#f1f5f9',
              color: '#64748b',
              padding: '8px 16px',
              borderRadius: '6px',
              border: '1px solid #e2e8f0',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer'
            }}>
              + Add Method
            </button>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '16px'
          }}>
            {paymentMethods.map(method => (
              <div key={method.id} style={{
                backgroundColor: '#f8fafc',
                borderRadius: '8px',
                padding: '20px',
                border: method.isDefault ? '2px solid #22c55e' : '1px solid #e2e8f0',
                position: 'relative'
              }}>
                {method.isDefault && (
                  <span style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    backgroundColor: '#22c55e',
                    color: '#ffffff',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '10px',
                    fontWeight: '600'
                  }}>
                    Default
                  </span>
                )}
                
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px',
                  marginBottom: '12px'
                }}>
                  <span style={{ fontSize: '24px' }}>
                    {getMethodIcon(method.type)}
                  </span>
                  <div>
                    <h4 style={{ 
                      fontSize: '16px', 
                      fontWeight: '600', 
                      color: '#1e293b',
                      margin: '0 0 4px 0'
                    }}>
                      {method.name}
                    </h4>
                    <p style={{ 
                      fontSize: '14px', 
                      color: '#64748b',
                      margin: '0'
                    }}>
                      {method.account}
                    </p>
                  </div>
                </div>

                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr', 
                  gap: '12px',
                  fontSize: '12px',
                  color: '#64748b'
                }}>
                  <div>
                    <strong>Min Amount:</strong> ${method.minAmount}
                  </div>
                  <div>
                    <strong>Fee:</strong> {method.fee}
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <strong>Processing:</strong> {method.processingTime}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payouts Table */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e2e8f0'
        }}>
          {/* Filter Tabs */}
          <div style={{ 
            padding: '20px 20px 0 20px',
            borderBottom: '1px solid #e2e8f0'
          }}>
            <div style={{ 
              display: 'flex', 
              gap: '4px',
              paddingBottom: '16px'
            }}>
              {[
                { key: 'pending', label: 'Pending' },
                { key: 'completed', label: 'Completed' },
                { key: 'failed', label: 'Failed' },
                { key: 'all', label: 'All' }
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
                    transition: 'all 0.2s ease'
                  }}
                >
                  {tab.label} ({mockPayouts.filter(p => tab.key === 'all' || p.status === tab.key).length})
                </button>
              ))}
            </div>
          </div>

          {/* Table Content */}
          <div style={{ padding: '24px' }}>
            {filteredPayouts.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {filteredPayouts.map(payout => (
                  <div key={payout.id} style={{
                    backgroundColor: '#f8fafc',
                    borderRadius: '8px',
                    padding: '20px',
                    border: '1px solid #e2e8f0'
                  }}>
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: '1fr auto auto', 
                      gap: '20px',
                      alignItems: 'start'
                    }}>
                      {/* Payout Details */}
                      <div>
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'start',
                          marginBottom: '12px'
                        }}>
                          <h4 style={{ 
                            fontSize: '16px', 
                            fontWeight: '600', 
                            color: '#1e293b',
                            margin: '0'
                          }}>
                            {payout.id}
                          </h4>
                          <span style={{
                            backgroundColor: getStatusColor(payout.status).bg,
                            color: getStatusColor(payout.status).text,
                            padding: '4px 8px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '500',
                            textTransform: 'capitalize'
                          }}>
                            {payout.status}
                          </span>
                        </div>

                        <div style={{ 
                          display: 'grid', 
                          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
                          gap: '16px',
                          marginBottom: '12px'
                        }}>
                          <div>
                            <div style={{ fontSize: '12px', color: '#64748b' }}>Requested</div>
                            <div style={{ fontSize: '14px', fontWeight: '500', color: '#1e293b' }}>
                              {payout.requestDate}
                            </div>
                          </div>
                          
                          {payout.processedDate && (
                            <div>
                              <div style={{ fontSize: '12px', color: '#64748b' }}>Processed</div>
                              <div style={{ fontSize: '14px', fontWeight: '500', color: '#1e293b' }}>
                                {payout.processedDate}
                              </div>
                            </div>
                          )}
                          
                          <div>
                            <div style={{ fontSize: '12px', color: '#64748b' }}>Method</div>
                            <div style={{ fontSize: '14px', fontWeight: '500', color: '#1e293b' }}>
                              {payout.method} • {payout.account}
                            </div>
                          </div>
                          
                          <div>
                            <div style={{ fontSize: '12px', color: '#64748b' }}>Reference</div>
                            <div style={{ fontSize: '14px', fontWeight: '500', color: '#1e293b' }}>
                              {payout.reference}
                            </div>
                          </div>
                        </div>

                        {payout.failureReason && (
                          <div style={{
                            backgroundColor: '#fee2e2',
                            color: '#dc2626',
                            padding: '8px 12px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            marginTop: '8px'
                          }}>
                            <strong>Failure reason:</strong> {payout.failureReason}
                          </div>
                        )}
                      </div>

                      {/* Amount Breakdown */}
                      <div style={{ textAlign: 'right', minWidth: '120px' }}>
                        <div style={{ marginBottom: '8px' }}>
                          <div style={{ fontSize: '12px', color: '#64748b' }}>Amount</div>
                          <div style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b' }}>
                            ${payout.amount.toFixed(2)}
                          </div>
                        </div>
                        <div style={{ marginBottom: '8px' }}>
                          <div style={{ fontSize: '12px', color: '#64748b' }}>Fee</div>
                          <div style={{ fontSize: '14px', color: '#ef4444' }}>
                            -${payout.fee.toFixed(2)}
                          </div>
                        </div>
                        <div style={{ 
                          paddingTop: '8px',
                          borderTop: '1px solid #e2e8f0'
                        }}>
                          <div style={{ fontSize: '12px', color: '#64748b' }}>Net Amount</div>
                          <div style={{ fontSize: '18px', fontWeight: '700', color: '#22c55e' }}>
                            ${payout.netAmount.toFixed(2)}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <button style={{
                          backgroundColor: '#f1f5f9',
                          color: '#64748b',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          border: '1px solid #e2e8f0',
                          fontSize: '12px',
                          cursor: 'pointer'
                        }}>
                          View Details
                        </button>
                        {payout.status === 'failed' && (
                          <button style={{
                            backgroundColor: '#22c55e',
                            color: '#ffffff',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            border: 'none',
                            fontSize: '12px',
                            cursor: 'pointer'
                          }}>
                            Retry
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '60px 20px'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>💰</div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>
                  No payouts found
                </h3>
                <p style={{ color: '#64748b', marginBottom: '24px' }}>
                  {activeTab === 'all' 
                    ? "You haven't requested any payouts yet." 
                    : `No ${activeTab} payouts found.`}
                </p>
                <button
                  onClick={() => setShowRequestModal(true)}
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
                  Request Your First Payout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Request Payout Modal */}
        {showRequestModal && (
          <div style={{
            position: 'fixed',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              padding: '24px',
              maxWidth: '500px',
              width: '90%'
            }}>
              <h3 style={{ 
                fontSize: '20px', 
                fontWeight: '600', 
                color: '#1e293b',
                marginBottom: '20px'
              }}>
                Request Payout
              </h3>

              <div style={{ marginBottom: '20px' }}>
                <div style={{ 
                  backgroundColor: '#f0f9ff',
                  border: '1px solid #bae6fd',
                  borderRadius: '8px',
                  padding: '16px',
                  marginBottom: '16px'
                }}>
                  <div style={{ fontSize: '14px', color: '#0369a1', marginBottom: '8px' }}>
                    Available Balance: <strong>${availableBalance.toFixed(2)}</strong>
                  </div>
                  <div style={{ fontSize: '12px', color: '#0369a1' }}>
                    Minimum withdrawal: $20.00 • Processing fee: 1%
                  </div>
                </div>

                <label style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '500', 
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Amount to withdraw
                </label>
                <input
                  type="number"
                  value={requestAmount}
                  onChange={(e) => setRequestAmount(e.target.value)}
                  placeholder="Enter amount"
                  min="20"
                  max={availableBalance}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    fontSize: '16px',
                    outline: 'none'
                  }}
                />
                {requestAmount && (
                  <div style={{ 
                    fontSize: '12px', 
                    color: '#64748b',
                    marginTop: '8px'
                  }}>
                    Fee: ${(parseFloat(requestAmount) * 0.01).toFixed(2)} • 
                    You'll receive: ${(parseFloat(requestAmount) * 0.99).toFixed(2)}
                  </div>
                )}
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '500', 
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Payment method
                </label>
                <select style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  fontSize: '14px',
                  backgroundColor: '#ffffff',
                  outline: 'none'
                }}>
                  {paymentMethods.map(method => (
                    <option key={method.id} value={method.id}>
                      {method.name} ({method.account}) - {method.processingTime}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ 
                display: 'flex', 
                gap: '12px',
                justifyContent: 'flex-end'
              }}>
                <button
                  onClick={() => {
                    setShowRequestModal(false);
                    setRequestAmount('');
                  }}
                  style={{
                    backgroundColor: '#f1f5f9',
                    color: '#64748b',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleRequestPayout}
                  disabled={!requestAmount || parseFloat(requestAmount) < 20 || parseFloat(requestAmount) > availableBalance}
                  style={{
                    backgroundColor: requestAmount && parseFloat(requestAmount) >= 20 && parseFloat(requestAmount) <= availableBalance ? '#22c55e' : '#e2e8f0',
                    color: requestAmount && parseFloat(requestAmount) >= 20 && parseFloat(requestAmount) <= availableBalance ? '#ffffff' : '#64748b',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: requestAmount && parseFloat(requestAmount) >= 20 && parseFloat(requestAmount) <= availableBalance ? 'pointer' : 'not-allowed'
                  }}
                >
                  Request Payout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PayoutsPage;
