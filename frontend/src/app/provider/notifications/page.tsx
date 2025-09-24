'use client';

import React, { useState, useEffect } from 'react';

interface Message {
  id: string;
  from: string;
  to?: string;
  message: string;
  type: 'text' | 'booking' | 'reminder' | 'system';
  isRead: boolean;
  timestamp: string;
  avatar?: string;
  conversationId?: string;
  serviceType?: string;
  bookingId?: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  timestamp: string;
  actionUrl?: string;
}

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<'notifications' | 'messages'>('notifications');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  // Get authentication headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem('providerToken') || 
                  localStorage.getItem('adminToken') || 
                  localStorage.getItem('customerToken') || 
                  localStorage.getItem('auth-token');
    
    if (!token) return null;
    
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  };

  const fetchNotificationsAndMessages = async () => {
    try {
      setLoading(true);
      const headers = getAuthHeaders();
      
      if (!headers) {
        console.error('No authentication token found');
        setLoading(false);
        return;
      }

      // Fetch notifications
      const notificationsResponse = await fetch('http://localhost:8000/api/v1/notifications', {
        headers
      });

      if (notificationsResponse.ok) {
        const notificationsData = await notificationsResponse.json();
        let transformedNotifications: Notification[] = [];
        
        if (notificationsData.notifications && Array.isArray(notificationsData.notifications)) {
          transformedNotifications = notificationsData.notifications.map((item: any) => ({
            id: item.id,
            title: item.title,
            message: item.message,
            type: item.type,
            isRead: item.read || false,
            timestamp: item.createdAt,
            actionUrl: item.data?.actionUrl
          }));
        } else if (Array.isArray(notificationsData)) {
          transformedNotifications = notificationsData.map((item: any) => ({
            id: item.id,
            title: item.title,
            message: item.message,
            type: item.type,
            isRead: item.read || false,
            timestamp: item.createdAt,
            actionUrl: item.data?.actionUrl
          }));
        }
        
        setNotifications(transformedNotifications);
      }

      // Fetch messages/conversations
      const messagesResponse = await fetch('http://localhost:8000/api/v1/notifications/messages/conversations', {
        headers
      });

      if (messagesResponse.ok) {
        const conversationsData = await messagesResponse.json();
        const allMessages: Message[] = [];
        
        let conversations = [];
        if (conversationsData.conversations && Array.isArray(conversationsData.conversations)) {
          conversations = conversationsData.conversations;
        } else if (Array.isArray(conversationsData)) {
          conversations = conversationsData;
        }
        
        conversations.forEach((conversation: any) => {
          allMessages.push({
            id: conversation.id,
            from: conversation.customerName || 'Customer',
            to: 'You',
            message: conversation.lastMessage,
            type: 'text',
            isRead: conversation.unreadCount === 0,
            timestamp: conversation.lastMessageAt,
            avatar: conversation.customerAvatar || '👤',
            conversationId: conversation.id,
            serviceType: conversation.serviceType,
            bookingId: conversation.bookingId
          });
        });
        
        setMessages(allMessages);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotificationsAndMessages();
  }, []);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  // Group messages by conversation
  const groupedMessages = messages.reduce((acc, message) => {
    const otherPerson = message.from === 'provider' || message.from === 'You' ? message.to || 'Customer' : message.from;
    
    if (otherPerson && !acc[otherPerson]) {
      acc[otherPerson] = [];
    }
    if (otherPerson) {
      acc[otherPerson].push(message);
    }
    return acc;
  }, {} as Record<string, Message[]>);

  // Get conversation partners list
  const conversationPartners = Object.entries(groupedMessages).map(([partner, msgs]) => {
    const lastMessage = msgs[msgs.length - 1];
    const unreadMessages = msgs.filter(m => m.from !== 'provider' && m.from !== 'You' && !m.isRead).length;
    
    return {
      name: partner,
      lastMessage: lastMessage?.message || '',
      timestamp: lastMessage?.timestamp || '',
      unreadCount: unreadMessages,
      avatar: lastMessage?.avatar || '👤',
      serviceType: lastMessage?.serviceType,
      bookingId: lastMessage?.bookingId
    };
  }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm">
          {/* Header */}
          <div className="border-b border-gray-200 p-6">
            <h1 className="text-2xl font-bold text-gray-900">Notifications & Messages</h1>
            <p className="mt-2 text-gray-600">Stay updated with your business activities and customer communications</p>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('notifications')}
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'notifications'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Notifications ({notifications.filter(n => !n.isRead).length})
              </button>
              <button
                onClick={() => setActiveTab('messages')}
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'messages'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Customer Messages ({conversationPartners.reduce((sum, partner) => sum + partner.unreadCount, 0)})
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === 'notifications' ? (
              <div className="space-y-4">
                {notifications.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-6xl mb-4">🔔</div>
                    <p>No notifications yet</p>
                    <p className="text-sm mt-2">You'll receive notifications for new bookings, payments, and messages</p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-lg border ${
                        notification.isRead ? 'bg-gray-50 border-gray-200' : 'bg-blue-50 border-blue-200'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-lg">
                              {notification.type === 'booking' ? '📅' : 
                               notification.type === 'payment' ? '💳' : 
                               notification.type === 'message' ? '💬' : '🔔'}
                            </span>
                            <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                            {!notification.isRead && (
                              <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                            )}
                          </div>
                          <p className="text-gray-600 mb-2">{notification.message}</p>
                          <p className="text-sm text-gray-400">{formatTimestamp(notification.timestamp)}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-96">
                {/* Conversations List */}
                <div className="lg:col-span-1 border-r border-gray-200 pr-6">
                  <h3 className="font-semibold mb-4">Customer Conversations</h3>
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {conversationPartners.length === 0 ? (
                      <div className="text-center py-6 text-gray-500">
                        <div className="text-3xl mb-2">💬</div>
                        <p className="text-sm">No customer messages yet</p>
                        <p className="text-xs mt-1">Customers will be able to message you after booking services</p>
                      </div>
                    ) : (
                      conversationPartners.map((partner) => (
                        <div
                          key={partner.name}
                          onClick={() => setSelectedConversation(partner.name)}
                          className={`p-3 rounded-lg cursor-pointer transition-colors ${
                            selectedConversation === partner.name
                              ? 'bg-blue-50 border border-blue-200'
                              : 'hover:bg-gray-50 border border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="text-2xl">{partner.avatar}</div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className="font-medium text-gray-900 truncate">{partner.name}</p>
                                {partner.unreadCount > 0 && (
                                  <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1">
                                    {partner.unreadCount}
                                  </span>
                                )}
                              </div>
                              {partner.serviceType && (
                                <p className="text-xs text-blue-600 mb-1">📋 {partner.serviceType}</p>
                              )}
                              {partner.bookingId && (
                                <p className="text-xs text-green-600 mb-1">🎫 Booking #{partner.bookingId}</p>
                              )}
                              <p className="text-sm text-gray-500 truncate">{partner.lastMessage}</p>
                              <p className="text-xs text-gray-400">{formatTimestamp(partner.timestamp)}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Chat Area */}
                <div className="lg:col-span-2">
                  {selectedConversation ? (
                    <div className="flex flex-col h-full">
                      <div className="border-b border-gray-200 pb-3 mb-4">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">💬 Chat with {selectedConversation}</h3>
                          {conversationPartners.find(p => p.name === selectedConversation)?.serviceType && (
                            <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded">
                              {conversationPartners.find(p => p.name === selectedConversation)?.serviceType}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex-1 overflow-y-auto space-y-3 max-h-60">
                        {groupedMessages[selectedConversation]?.map((msg) => (
                          <div
                            key={msg.id}
                            className={`flex ${
                              msg.from === 'provider' || msg.from === 'You' ? 'justify-end' : 'justify-start'
                            }`}
                          >
                            <div className="flex items-end gap-2 max-w-xs lg:max-w-md">
                              {msg.from !== 'provider' && msg.from !== 'You' && (
                                <div className="text-lg">{msg.avatar}</div>
                              )}
                              <div
                                className={`px-4 py-2 rounded-lg ${
                                  msg.from === 'provider' || msg.from === 'You'
                                    ? 'bg-blue-500 text-white rounded-br-none'
                                    : 'bg-gray-200 text-gray-900 rounded-bl-none'
                                }`}
                              >
                                <p className="text-sm">{msg.message}</p>
                                <p className={`text-xs mt-1 ${
                                  msg.from === 'provider' || msg.from === 'You' ? 'text-blue-100' : 'text-gray-500'
                                }`}>
                                  {formatTimestamp(msg.timestamp)}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 flex gap-2">
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Type your message to the customer..."
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                          onClick={() => {}}
                          disabled={!newMessage.trim()}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                        >
                          Send
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      <div className="text-center">
                        <div className="text-4xl mb-4">💬</div>
                        <h3 className="font-medium mb-2">Customer Communication Center</h3>
                        <p>Select a conversation to chat with your customers</p>
                        <p className="text-sm mt-2">💡 Customers can message you after booking services</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}