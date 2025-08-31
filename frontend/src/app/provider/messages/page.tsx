'use client';

import React, { useState } from 'react';

const MessagesPage = () => {
  const [activeChat, setActiveChat] = useState(1);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const mockConversations = [
    {
      id: 1,
      contact: {
        name: "Sarah Johnson",
        avatar: "/api/placeholder/50/50",
        status: "online",
        lastSeen: "now"
      },
      lastMessage: "Thank you for the amazing logo design! I love it!",
      lastMessageTime: "2 min ago",
      unreadCount: 0,
      orderId: "#ORD-001",
      projectTitle: "Professional Logo Design"
    },
    {
      id: 2,
      contact: {
        name: "Michael Chen",
        avatar: "/api/placeholder/50/50",
        status: "offline",
        lastSeen: "1 hour ago"
      },
      lastMessage: "Can we schedule a call to discuss the website requirements?",
      lastMessageTime: "1 hour ago",
      unreadCount: 2,
      orderId: "#ORD-002",
      projectTitle: "Website Development"
    },
    {
      id: 3,
      contact: {
        name: "Emma Williams",
        avatar: "/api/placeholder/50/50",
        status: "online",
        lastSeen: "now"
      },
      lastMessage: "I've sent the marketing materials for review",
      lastMessageTime: "3 hours ago",
      unreadCount: 1,
      orderId: "#ORD-003",
      projectTitle: "Social Media Marketing"
    },
    {
      id: 4,
      contact: {
        name: "David Rodriguez",
        avatar: "/api/placeholder/50/50",
        status: "away",
        lastSeen: "30 min ago"
      },
      lastMessage: "The content looks great! Ready for delivery",
      lastMessageTime: "1 day ago",
      unreadCount: 0,
      orderId: "#ORD-004",
      projectTitle: "Content Writing"
    }
  ];

  const mockMessages = {
    1: [
      {
        id: 1,
        sender: "Sarah Johnson",
        message: "Hi! I'm excited to work with you on my logo design project.",
        timestamp: "10:30 AM",
        type: "received",
        attachment: null
      },
      {
        id: 2,
        sender: "You",
        message: "Hello Sarah! Thank you for choosing my services. I'm excited to create an amazing logo for your brand. Could you please share your brand guidelines and any specific requirements?",
        timestamp: "10:32 AM",
        type: "sent",
        attachment: null
      },
      {
        id: 3,
        sender: "Sarah Johnson",
        message: "Sure! I've attached our brand guidelines document. We're looking for something modern and minimalist.",
        timestamp: "10:35 AM",
        type: "received",
        attachment: {
          name: "Brand_Guidelines.pdf",
          size: "2.4 MB",
          type: "pdf"
        }
      },
      {
        id: 4,
        sender: "You",
        message: "Perfect! I've reviewed your guidelines. I'll create 3 initial concepts and share them with you by tomorrow. Is that timeline okay?",
        timestamp: "10:45 AM",
        type: "sent",
        attachment: null
      },
      {
        id: 5,
        sender: "Sarah Johnson",
        message: "That sounds perfect! Looking forward to seeing the concepts.",
        timestamp: "10:46 AM",
        type: "received",
        attachment: null
      },
      {
        id: 6,
        sender: "Sarah Johnson",
        message: "Thank you for the amazing logo design! I love it!",
        timestamp: "2 min ago",
        type: "received",
        attachment: null
      }
    ]
  };

  const filteredConversations = mockConversations.filter(conv =>
    conv.contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.projectTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeConversation = mockConversations.find(conv => conv.id === activeChat);
  const messages = mockMessages[activeChat] || [];

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Add message logic here
      setNewMessage('');
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'online': return '#22c55e';
      case 'away': return '#f59e0b';
      case 'offline': return '#64748b';
      default: return '#64748b';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'online': return 'Online';
      case 'away': return 'Away';
      case 'offline': return 'Offline';
      default: return 'Unknown';
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8fafc',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ 
            fontSize: '28px', 
            fontWeight: '700', 
            color: '#1e293b',
            marginBottom: '8px'
          }}>
            Messages
          </h1>
          <p style={{ 
            color: '#64748b', 
            fontSize: '16px'
          }}>
            Communicate with your clients and manage project discussions
          </p>
        </div>

        {/* Messages Container */}
        <div style={{ 
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e2e8f0',
          height: '700px',
          display: 'grid',
          gridTemplateColumns: '350px 1fr'
        }}>
          {/* Conversations Sidebar */}
          <div style={{ 
            borderRight: '1px solid #e2e8f0',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Search */}
            <div style={{ 
              padding: '20px',
              borderBottom: '1px solid #e2e8f0'
            }}>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 36px',
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
                  color: '#64748b',
                  fontSize: '14px'
                }}>
                  🔍
                </span>
              </div>
            </div>

            {/* Conversations List */}
            <div style={{ 
              flex: '1',
              overflowY: 'auto'
            }}>
              {filteredConversations.map(conversation => (
                <div
                  key={conversation.id}
                  onClick={() => setActiveChat(conversation.id)}
                  style={{
                    padding: '16px 20px',
                    borderBottom: '1px solid #f1f5f9',
                    cursor: 'pointer',
                    backgroundColor: activeChat === conversation.id ? '#f0f9ff' : 'transparent',
                    transition: 'background-color 0.2s ease'
                  }}
                >
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px',
                    marginBottom: '8px'
                  }}>
                    <div style={{ position: 'relative' }}>
                      <div style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        backgroundColor: '#e2e8f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#64748b'
                      }}>
                        {conversation.contact.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div style={{
                        position: 'absolute',
                        bottom: '2px',
                        right: '2px',
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        backgroundColor: getStatusColor(conversation.contact.status),
                        border: '2px solid #ffffff'
                      }}></div>
                    </div>
                    <div style={{ flex: '1', minWidth: 0 }}>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        marginBottom: '4px'
                      }}>
                        <h4 style={{ 
                          fontSize: '16px', 
                          fontWeight: '600', 
                          color: '#1e293b',
                          margin: '0',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {conversation.contact.name}
                        </h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          {conversation.unreadCount > 0 && (
                            <span style={{
                              backgroundColor: '#22c55e',
                              color: '#ffffff',
                              borderRadius: '50%',
                              width: '20px',
                              height: '20px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '12px',
                              fontWeight: '600'
                            }}>
                              {conversation.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                      <p style={{ 
                        fontSize: '12px', 
                        color: '#64748b',
                        margin: '0 0 4px 0'
                      }}>
                        {conversation.projectTitle}
                      </p>
                      <p style={{ 
                        fontSize: '14px', 
                        color: '#374151',
                        margin: '0',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {conversation.lastMessage}
                      </p>
                      <div style={{ 
                        fontSize: '12px', 
                        color: '#64748b',
                        marginTop: '4px'
                      }}>
                        {conversation.lastMessageTime}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div style={{ 
            display: 'flex',
            flexDirection: 'column'
          }}>
            {activeConversation ? (
              <>
                {/* Chat Header */}
                <div style={{ 
                  padding: '20px',
                  borderBottom: '1px solid #e2e8f0',
                  backgroundColor: '#f8fafc'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ position: 'relative' }}>
                        <div style={{
                          width: '50px',
                          height: '50px',
                          borderRadius: '50%',
                          backgroundColor: '#e2e8f0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '18px',
                          fontWeight: '600',
                          color: '#64748b'
                        }}>
                          {activeConversation.contact.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div style={{
                          position: 'absolute',
                          bottom: '2px',
                          right: '2px',
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          backgroundColor: getStatusColor(activeConversation.contact.status),
                          border: '2px solid #ffffff'
                        }}></div>
                      </div>
                      <div>
                        <h3 style={{ 
                          fontSize: '18px', 
                          fontWeight: '600', 
                          color: '#1e293b',
                          margin: '0 0 4px 0'
                        }}>
                          {activeConversation.contact.name}
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ 
                            fontSize: '12px', 
                            color: getStatusColor(activeConversation.contact.status),
                            fontWeight: '500'
                          }}>
                            {getStatusText(activeConversation.contact.status)}
                          </span>
                          <span style={{ fontSize: '12px', color: '#64748b' }}>
                            • {activeConversation.projectTitle}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button style={{
                        backgroundColor: '#f1f5f9',
                        color: '#64748b',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: '1px solid #e2e8f0',
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}>
                        📞 Call
                      </button>
                      <button style={{
                        backgroundColor: '#f1f5f9',
                        color: '#64748b',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: '1px solid #e2e8f0',
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}>
                        📁 Files
                      </button>
                    </div>
                  </div>
                </div>

                {/* Messages Area */}
                <div style={{ 
                  flex: '1',
                  padding: '20px',
                  overflowY: 'auto',
                  backgroundColor: '#ffffff'
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {messages.map(message => (
                      <div
                        key={message.id}
                        style={{
                          display: 'flex',
                          justifyContent: message.type === 'sent' ? 'flex-end' : 'flex-start'
                        }}
                      >
                        <div style={{
                          maxWidth: '70%',
                          backgroundColor: message.type === 'sent' ? '#22c55e' : '#f1f5f9',
                          color: message.type === 'sent' ? '#ffffff' : '#1e293b',
                          padding: '12px 16px',
                          borderRadius: message.type === 'sent' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                          fontSize: '14px',
                          lineHeight: '1.5'
                        }}>
                          <div style={{ marginBottom: '4px' }}>
                            {message.message}
                          </div>
                          
                          {message.attachment && (
                            <div style={{
                              marginTop: '8px',
                              padding: '8px',
                              backgroundColor: message.type === 'sent' ? 'rgba(255,255,255,0.1)' : '#e2e8f0',
                              borderRadius: '6px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px'
                            }}>
                              <span style={{ fontSize: '16px' }}>📄</span>
                              <div>
                                <div style={{ fontSize: '12px', fontWeight: '500' }}>
                                  {message.attachment.name}
                                </div>
                                <div style={{ fontSize: '11px', opacity: '0.8' }}>
                                  {message.attachment.size}
                                </div>
                              </div>
                            </div>
                          )}
                          
                          <div style={{ 
                            fontSize: '11px', 
                            opacity: '0.8',
                            marginTop: '4px',
                            textAlign: 'right'
                          }}>
                            {message.timestamp}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Message Input */}
                <div style={{ 
                  padding: '20px',
                  borderTop: '1px solid #e2e8f0',
                  backgroundColor: '#f8fafc'
                }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'end' }}>
                    <button style={{
                      backgroundColor: '#f1f5f9',
                      color: '#64748b',
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      fontSize: '16px',
                      cursor: 'pointer'
                    }}>
                      📎
                    </button>
                    
                    <div style={{ flex: '1' }}>
                      <textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        style={{
                          width: '100%',
                          minHeight: '40px',
                          maxHeight: '120px',
                          padding: '10px 12px',
                          borderRadius: '8px',
                          border: '1px solid #e2e8f0',
                          fontSize: '14px',
                          resize: 'vertical',
                          outline: 'none',
                          fontFamily: 'inherit'
                        }}
                      />
                    </div>
                    
                    <button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      style={{
                        backgroundColor: newMessage.trim() ? '#22c55e' : '#e2e8f0',
                        color: newMessage.trim() ? '#ffffff' : '#64748b',
                        padding: '10px 16px',
                        borderRadius: '8px',
                        border: 'none',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: newMessage.trim() ? 'pointer' : 'not-allowed',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      Send
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                textAlign: 'center'
              }}>
                <div>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>💬</div>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>
                    Select a conversation
                  </h3>
                  <p style={{ color: '#64748b' }}>
                    Choose a conversation from the sidebar to start messaging
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
