"use client";
import React from "react";

export default function ProviderDashboard() {
  return (
    <div>
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
              }}>950</p>
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
              <svg style={{ width: '16px', height: '16px', color: '#ffffff' }} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
              </svg>
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
              }}>150</p>
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
              <svg style={{ width: '16px', height: '16px', color: '#ffffff' }} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
              </svg>
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
              }}>9550</p>
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
              <svg style={{ width: '16px', height: '16px', color: '#ffffff' }} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
              </svg>
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
              }}>15</p>
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
              <svg style={{ width: '16px', height: '16px', color: '#ffffff' }} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Section */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr 1.8fr', 
        gap: '16px', 
        marginBottom: '20px'
      }}>
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
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
            </div>
            <div style={{ flex: '1' }}>
              <p style={{ fontSize: '13px', color: '#6b7280', fontWeight: '500', marginBottom: '2px' }}>Total Credit</p>
              <p style={{ fontSize: '22px', fontWeight: '700', color: '#111827', lineHeight: '1.2' }}>$12,254.47</p>
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
            <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: '600' }}>+10%</span>
            <span style={{ fontSize: '11px', color: '#6b7280' }}>from last week</span>
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
              <p style={{ fontSize: '22px', fontWeight: '700', color: '#111827', lineHeight: '1.2' }}>$4,254.47</p>
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
            <span style={{ fontSize: '11px', color: '#7c3aed', fontWeight: '600' }}>-5%</span>
            <span style={{ fontSize: '11px', color: '#6b7280' }}>from last week</span>
          </div>
        </div>

        {/* Withdraw Funds Card */}
        <div style={{ 
          backgroundColor: '#374151', 
          borderRadius: '12px', 
          padding: '20px',
          color: '#ffffff'
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
              <span style={{ fontSize: '16px', fontWeight: '700' }}>$10,292.50</span>
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
              <span style={{ fontSize: '16px', fontWeight: '700' }}>$1,292.50</span>
            </button>
          </div>
          
          <p style={{ 
            fontSize: '12px', 
            color: '#d1d5db', 
            textDecoration: 'underline', 
            cursor: 'pointer',
            margin: '0'
          }}>
            Withdraw Funds
          </p>
        </div>
      </div>

      {/* Chart Section - Full Width */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ 
          backgroundColor: '#ffffff', 
          borderRadius: '8px', 
          padding: '24px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}>
          {/* Chart Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827' }}>Sales Statistics</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {/* Legend */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '8px', height: '8px', backgroundColor: '#22c55e', borderRadius: '50%' }}></div>
                  <span style={{ color: '#6b7280' }}>Revenue</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '8px', height: '8px', backgroundColor: '#4b5563', borderRadius: '50%' }}></div>
                  <span style={{ color: '#6b7280' }}>Withdraw</span>
                </div>
              </div>
              {/* Year Selector */}
              <select style={{ 
                fontSize: '12px', 
                border: '1px solid #d1d5db', 
                borderRadius: '6px', 
                padding: '6px 12px', 
                backgroundColor: '#ffffff',
                color: '#374151',
                cursor: 'pointer'
              }}>
                <option>2023</option>
                <option>2022</option>
                <option>2021</option>
              </select>
            </div>
          </div>
          
          {/* Revenue and Withdraw Values */}
          <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '48px', marginBottom: '32px' }}>
            <div>
              <p style={{ color: '#6b7280', marginBottom: '4px', fontSize: '12px', fontWeight: '500' }}>Revenue</p>
              <p style={{ fontSize: '24px', fontWeight: '700', color: '#111827' }}>$9,564.30</p>
            </div>
            <div>
              <p style={{ color: '#6b7280', marginBottom: '4px', fontSize: '12px', fontWeight: '500' }}>Withdraw</p>
              <p style={{ fontSize: '24px', fontWeight: '700', color: '#111827' }}>$9,564.30</p>
            </div>
          </div>

          {/* Chart Container with Grid Lines */}
          <div style={{ position: 'relative' }}>
            {/* Y-axis Labels and Grid Lines */}
            <div style={{ 
              position: 'absolute', 
              left: '0', 
              top: '0', 
              height: '200px', 
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              {[800, 600, 400, 200, 0].map((value, index) => (
                <div key={value} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  width: '100%',
                  height: '1px'
                }}>
                  <span style={{ 
                    fontSize: '10px', 
                    color: '#9ca3af', 
                    marginRight: '8px',
                    minWidth: '20px',
                    textAlign: 'right'
                  }}>{value}</span>
                  <div style={{ 
                    flex: '1', 
                    height: '1px', 
                    backgroundColor: index === 4 ? '#e5e7eb' : '#f3f4f6'
                  }}></div>
                </div>
              ))}
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
              {[
                { month: 'Jan', revenue: 120, withdraw: 80 },
                { month: 'Feb', revenue: 80, withdraw: 60 },
                { month: 'Mar', revenue: 50, withdraw: 40 },
                { month: 'Apr', revenue: 140, withdraw: 70 },
                { month: 'May', revenue: 160, withdraw: 90 },
                { month: 'Jun', revenue: 100, withdraw: 65 },
                { month: 'Jul', revenue: 180, withdraw: 110 },
                { month: 'Aug', revenue: 70, withdraw: 50 },
                { month: 'Sep', revenue: 130, withdraw: 75 },
                { month: 'Oct', revenue: 110, withdraw: 85 },
                { month: 'Nov', revenue: 150, withdraw: 95 },
                { month: 'Dec', revenue: 140, withdraw: 80 }
              ].map((bar, index) => (
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
                      height: `${bar.revenue}px`,
                      transition: 'all 0.3s ease'
                    }}></div>
                    <div style={{ 
                      width: '16px', 
                      backgroundColor: '#4b5563', 
                      borderRadius: '2px 2px 0 0',
                      height: `${bar.withdraw}px`,
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
            {[1,2,3,4].map((item) => (
              <div key={item} style={{ 
                padding: '12px 16px',
                borderBottom: item < 4 ? '1px solid #f3f4f6' : 'none'
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ 
                    width: '24px', 
                    height: '24px', 
                    backgroundColor: '#f59e0b', 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    flexShrink: '0'
                  }}>
                    <span style={{ fontSize: '10px', color: '#ffffff', fontWeight: '600' }}>#{item}</span>
                  </div>
                  <div style={{ flex: '1', minWidth: '0' }}>
                    <p style={{ fontSize: '11px', color: '#111827', marginBottom: '2px', fontWeight: '500' }}>Full oil changing and servicing clien...</p>
                    <p style={{ fontSize: '10px', color: '#6b7280', marginBottom: '4px' }}>Complete Order • 13 Dec 2020 • Direct Order</p>
                    <span style={{ 
                      display: 'inline-flex', 
                      padding: '2px 6px', 
                      borderRadius: '8px', 
                      fontSize: '9px', 
                      backgroundColor: '#fed7aa', 
                      color: '#ea580c', 
                      fontWeight: '500'
                    }}>
                      New
                    </span>
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: '600', color: '#111827' }}>$5,800</span>
                </div>
              </div>
            ))}
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
          <div>
            {[
              { title: 'Your Password Changed', time: '2 min ago', isNew: true },
              { title: 'Payment Settings Updated', time: '1 day ago', isNew: true },
              { title: 'Your Password Changed', time: '1 day ago', isNew: true },
              { title: 'Payment Settings Updated', time: '1 day ago', isNew: true }
            ].map((notification, index) => (
              <div key={index} style={{ 
                padding: '12px 16px',
                borderBottom: index < 3 ? '1px solid #f3f4f6' : 'none'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ flex: '1' }}>
                    <p style={{ fontSize: '11px', fontWeight: '500', color: '#111827', marginBottom: '2px' }}>{notification.title}</p>
                    <p style={{ fontSize: '10px', color: '#6b7280' }}>{notification.time}</p>
                  </div>
                  {notification.isNew && (
                    <div style={{ 
                      width: '6px', 
                      height: '6px', 
                      backgroundColor: '#3b82f6', 
                      borderRadius: '50%',
                      flexShrink: '0',
                      marginLeft: '8px'
                    }}></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
