'use client';

import React, { useState } from 'react';

const NotificationsPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const mockNotifications = [
    {
      id: 1,
      type: 'order',
      title: 'New Order Received',
      message: 'Sarah Johnson placed an order for "Professional Logo Design"',
      timestamp: '2 minutes ago',
      isRead: false,
      avatar: 'SJ',
      priority: 'high',
      actionRequired: true,
      orderId: '#ORD-001'
    },
    {
      id: 2,
      type: 'payment',
      title: 'Payment Received',
      message: 'Payment of $250.00 received for order #ORD-002',
      timestamp: '1 hour ago',
      isRead: false,
      avatar: '💰',
      priority: 'normal',
      actionRequired: false,
      amount: 250.00
    },
    {
      id: 3,
      type: 'review',
      title: 'New 5-Star Review',
      message: 'Michael Chen left a 5-star review for your Web Development service',
      timestamp: '3 hours ago',
      isRead: true,
      avatar: '⭐',
      priority: 'normal',
      actionRequired: false,
      rating: 5
    },
    {
      id: 4,
      type: 'message',
      title: 'New Message',
      message: 'Emma Williams sent you a message about the marketing project',
      timestamp: '5 hours ago',
      isRead: true,
      avatar: 'EW',
      priority: 'normal',
      actionRequired: true
    },
    {
      id: 5,
      type: 'system',
      title: 'Profile Verification Required',
      message: 'Please complete your profile verification to unlock premium features',
      timestamp: '1 day ago',
      isRead: true,
      avatar: '🔒',
      priority: 'medium',
      actionRequired: true
    },
    {
      id: 6,
      type: 'promotion',
      title: 'Gig Performance Update',
      message: 'Your "Logo Design" gig received 50+ views this week!',
      timestamp: '2 days ago',
      isRead: true,
      avatar: '📈',
      priority: 'low',
      actionRequired: false
    },
    {
      id: 7,
      type: 'milestone',
      title: 'Milestone Achieved!',
      message: 'Congratulations! You\'ve completed 25 orders this month',
      timestamp: '3 days ago',
      isRead: true,
      avatar: '🏆',
      priority: 'normal',
      actionRequired: false
    },
    {
      id: 8,
      type: 'delivery',
      title: 'Delivery Reminder',
      message: 'Order #ORD-003 delivery is due in 2 hours',
      timestamp: '1 week ago',
      isRead: true,
      avatar: '📦',
      priority: 'high',
      actionRequired: true,
      orderId: '#ORD-003'
    }
  ];

  const notificationSettings = {
    orders: { email: true, push: true, sms: false },
    payments: { email: true, push: true, sms: true },
    messages: { email: true, push: true, sms: false },
    reviews: { email: true, push: false, sms: false },
    promotions: { email: false, push: false, sms: false },
    reminders: { email: true, push: true, sms: false }
  };

  const filteredNotifications = mockNotifications.filter(notification => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !notification.isRead;
    if (activeTab === 'important') return notification.priority === 'high' || notification.actionRequired;
    return notification.type === activeTab;
  });

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'order': return '🛒';
      case 'payment': return '💰';
      case 'review': return '⭐';
      case 'message': return '💬';
      case 'system': return '⚙️';
      case 'promotion': return '📢';
      case 'milestone': return '🏆';
      case 'delivery': return '📦';
      default: return '🔔';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#6b7280';
      default: return '#22c55e';
    }
  };

  const getTypeColor = (type) => {
    switch(type) {
      case 'order': return '#3b82f6';
      case 'payment': return '#22c55e';
      case 'review': return '#f59e0b';
      case 'message': return '#8b5cf6';
      case 'system': return '#6b7280';
      case 'promotion': return '#ec4899';
      case 'milestone': return '#10b981';
      case 'delivery': return '#f97316';
      default: return '#64748b';
    }
  };

  const unreadCount = mockNotifications.filter(n => !n.isRead).length;
  const importantCount = mockNotifications.filter(n => n.priority === 'high' || n.actionRequired).length;

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8fafc',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
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
              Notifications
            </h1>
            <p style={{ 
              color: '#64748b', 
              fontSize: '16px'
            }}>
              Stay updated with your business activities and important updates
            </p>
          </div>
          
          <button
            onClick={() => setShowSettingsModal(true)}
            style={{
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
            }}
          >
            ⚙️ Settings
          </button>
        </div>

        {/* Stats Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '20px',
          marginBottom: '30px'
        }}>
          <div style={{ 
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #e2e8f0',
            textAlign: 'center'
          }}>
            <div style={{ 
              fontSize: '28px', 
              fontWeight: '700', 
              color: '#ef4444',
              marginBottom: '4px'
            }}>
              {unreadCount}
            </div>
            <div style={{ fontSize: '14px', color: '#64748b' }}>Unread</div>
          </div>

          <div style={{ 
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #e2e8f0',
            textAlign: 'center'
          }}>
            <div style={{ 
              fontSize: '28px', 
              fontWeight: '700', 
              color: '#f59e0b',
              marginBottom: '4px'
            }}>
              {importantCount}
            </div>
            <div style={{ fontSize: '14px', color: '#64748b' }}>Important</div>
          </div>

          <div style={{ 
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #e2e8f0',
            textAlign: 'center'
          }}>
            <div style={{ 
              fontSize: '28px', 
              fontWeight: '700', 
              color: '#22c55e',
              marginBottom: '4px'
            }}>
              {mockNotifications.length}
            </div>
            <div style={{ fontSize: '14px', color: '#64748b' }}>Total</div>
          </div>

          <div style={{ 
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #e2e8f0',
            textAlign: 'center'
          }}>
            <div style={{ 
              fontSize: '28px', 
              fontWeight: '700', 
              color: '#3b82f6',
              marginBottom: '4px'
            }}>
              7
            </div>
            <div style={{ fontSize: '14px', color: '#64748b' }}>Today</div>
          </div>
        </div>

        {/* Notification Container */}
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
              overflowX: 'auto',
              paddingBottom: '16px'
            }}>
              {[
                { key: 'all', label: 'All', count: mockNotifications.length },
                { key: 'unread', label: 'Unread', count: unreadCount },
                { key: 'important', label: 'Important', count: importantCount },
                { key: 'order', label: 'Orders', count: mockNotifications.filter(n => n.type === 'order').length },
                { key: 'payment', label: 'Payments', count: mockNotifications.filter(n => n.type === 'payment').length },
                { key: 'message', label: 'Messages', count: mockNotifications.filter(n => n.type === 'message').length }
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
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>
          </div>

          {/* Notifications List */}
          <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map(notification => (
                <div key={notification.id} style={{
                  padding: '20px',
                  borderBottom: '1px solid #f1f5f9',
                  backgroundColor: notification.isRead ? '#ffffff' : '#f0f9ff',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease',
                  position: 'relative'
                }}>
                  {/* Priority Indicator */}
                  {notification.priority === 'high' && (
                    <div style={{
                      position: 'absolute',
                      left: '0',
                      top: '0',
                      bottom: '0',
                      width: '4px',
                      backgroundColor: getPriorityColor(notification.priority)
                    }}></div>
                  )}

                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'start', 
                    gap: '16px'
                  }}>
                    {/* Avatar/Icon */}
                    <div style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '50%',
                      backgroundColor: `${getTypeColor(notification.type)}20`,
                      color: getTypeColor(notification.type),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: notification.avatar.length <= 2 ? '16px' : '20px',
                      fontWeight: '600',
                      flexShrink: 0
                    }}>
                      {notification.avatar.length <= 2 ? notification.avatar : getNotificationIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div style={{ flex: '1', minWidth: 0 }}>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'start',
                        marginBottom: '8px'
                      }}>
                        <h4 style={{ 
                          fontSize: '16px', 
                          fontWeight: '600', 
                          color: '#1e293b',
                          margin: '0',
                          lineHeight: '1.4'
                        }}>
                          {notification.title}
                          {notification.actionRequired && (
                            <span style={{
                              marginLeft: '8px',
                              backgroundColor: '#fef3c7',
                              color: '#d97706',
                              padding: '2px 6px',
                              borderRadius: '10px',
                              fontSize: '10px',
                              fontWeight: '500'
                            }}>
                              Action Required
                            </span>
                          )}
                        </h4>
                        
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '8px'
                        }}>
                          {!notification.isRead && (
                            <div style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              backgroundColor: '#22c55e'
                            }}></div>
                          )}
                          <span style={{ 
                            fontSize: '12px', 
                            color: '#64748b',
                            whiteSpace: 'nowrap'
                          }}>
                            {notification.timestamp}
                          </span>
                        </div>
                      </div>

                      <p style={{ 
                        fontSize: '14px', 
                        color: '#374151',
                        margin: '0 0 12px 0',
                        lineHeight: '1.5'
                      }}>
                        {notification.message}
                      </p>

                      {/* Additional Info */}
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '12px',
                        flexWrap: 'wrap'
                      }}>
                        <span style={{
                          backgroundColor: `${getTypeColor(notification.type)}15`,
                          color: getTypeColor(notification.type),
                          padding: '2px 8px',
                          borderRadius: '12px',
                          fontSize: '11px',
                          fontWeight: '500',
                          textTransform: 'capitalize'
                        }}>
                          {notification.type}
                        </span>

                        {notification.orderId && (
                          <span style={{ fontSize: '12px', color: '#64748b' }}>
                            Order: {notification.orderId}
                          </span>
                        )}

                        {notification.amount && (
                          <span style={{ 
                            fontSize: '12px', 
                            color: '#22c55e',
                            fontWeight: '600'
                          }}>
                            ${notification.amount.toFixed(2)}
                          </span>
                        )}

                        {notification.rating && (
                          <span style={{ fontSize: '12px', color: '#f59e0b' }}>
                            {'⭐'.repeat(notification.rating)}
                          </span>
                        )}
                      </div>

                      {/* Action Buttons */}
                      {notification.actionRequired && (
                        <div style={{ 
                          marginTop: '12px',
                          display: 'flex',
                          gap: '8px'
                        }}>
                          <button style={{
                            backgroundColor: '#22c55e',
                            color: '#ffffff',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            border: 'none',
                            fontSize: '12px',
                            fontWeight: '500',
                            cursor: 'pointer'
                          }}>
                            {notification.type === 'order' ? 'View Order' : 
                             notification.type === 'message' ? 'Reply' : 
                             notification.type === 'delivery' ? 'Deliver Now' : 'Take Action'}
                          </button>
                          <button style={{
                            backgroundColor: 'transparent',
                            color: '#64748b',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            border: '1px solid #e2e8f0',
                            fontSize: '12px',
                            fontWeight: '500',
                            cursor: 'pointer'
                          }}>
                            Dismiss
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '60px 20px'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔔</div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>
                  No notifications found
                </h3>
                <p style={{ color: '#64748b' }}>
                  {activeTab === 'all' 
                    ? "You're all caught up!" 
                    : `No ${activeTab} notifications at the moment.`}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Settings Modal */}
        {showSettingsModal && (
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
              width: '90%',
              maxHeight: '80vh',
              overflowY: 'auto'
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '20px'
              }}>
                <h3 style={{ 
                  fontSize: '20px', 
                  fontWeight: '600', 
                  color: '#1e293b',
                  margin: '0'
                }}>
                  Notification Settings
                </h3>
                <button
                  onClick={() => setShowSettingsModal(false)}
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    fontSize: '20px',
                    cursor: 'pointer',
                    color: '#64748b'
                  }}
                >
                  ✕
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {Object.entries(notificationSettings).map(([category, settings]) => (
                  <div key={category} style={{
                    padding: '16px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0'
                  }}>
                    <h4 style={{ 
                      fontSize: '16px', 
                      fontWeight: '600', 
                      color: '#1e293b',
                      margin: '0 0 12px 0',
                      textTransform: 'capitalize'
                    }}>
                      {category}
                    </h4>
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(3, 1fr)', 
                      gap: '12px'
                    }}>
                      {Object.entries(settings).map(([method, enabled]) => (
                        <label key={method} style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          cursor: 'pointer'
                        }}>
                          <input
                            type="checkbox"
                            checked={enabled}
                            style={{ cursor: 'pointer' }}
                            readOnly
                          />
                          <span style={{ 
                            fontSize: '14px', 
                            color: '#374151',
                            textTransform: 'capitalize'
                          }}>
                            {method}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ 
                marginTop: '24px',
                display: 'flex',
                gap: '12px',
                justifyContent: 'flex-end'
              }}>
                <button
                  onClick={() => setShowSettingsModal(false)}
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
                  onClick={() => setShowSettingsModal(false)}
                  style={{
                    backgroundColor: '#22c55e',
                    color: '#ffffff',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
