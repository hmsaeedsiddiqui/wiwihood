'use client';

import React, { useState, useEffect } from 'react';

interface Message {
  id: string;
  from: string;
  to: string;
  message: string;
  type: 'text' | 'booking' | 'reminder' | 'system';
  isRead: boolean;
  timestamp: string;
  avatar?: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'booking' | 'message' | 'reminder' | 'payment' | 'review' | 'system';
  isRead: boolean;
  timestamp: string;
  actionUrl?: string;
}

export default function CustomerNotificationsPage() {
  const [activeTab, setActiveTab] = useState<'notifications' | 'messages'>('notifications');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch real data from API
  useEffect(() => {
    fetchNotificationsAndMessages();
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('customerToken') || 
                  localStorage.getItem('providerToken') || 
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
        // Transform backend data to frontend format
        const transformedNotifications: Notification[] = notificationsData.map((item: any) => ({
          id: item.id,
          title: item.title,
          message: item.message,
          type: item.type,
          isRead: item.isRead,
          timestamp: item.createdAt,
          actionUrl: item.data?.actionUrl
        }));
        setNotifications(transformedNotifications);
      } else if (notificationsResponse.status === 401) {
        console.error('Authentication failed');
      } else {
        console.error('Failed to fetch notifications:', notificationsResponse.statusText);
      }

      // Fetch messages/conversations
      const messagesResponse = await fetch('http://localhost:8000/api/v1/notifications/messages/conversations', {
        headers
      });

      if (messagesResponse.ok) {
        const conversationsData = await messagesResponse.json();
        // Transform conversations to messages format
        const allMessages: Message[] = [];
        
        conversationsData.forEach((conversation: any) => {
          if (conversation.messages && Array.isArray(conversation.messages)) {
            conversation.messages.forEach((msg: any) => {
              allMessages.push({
                id: msg.id,
                from: msg.senderId === conversation.partner?.id ? conversation.partner?.firstName || 'Provider' : 'customer',
                to: msg.receiverId === conversation.partner?.id ? conversation.partner?.firstName || 'Provider' : 'customer',
                message: msg.message,
                type: msg.type,
                isRead: msg.isRead,
                timestamp: msg.createdAt,
                avatar: conversation.partner?.avatar || '�'
              });
            });
          }
        });
        
        setMessages(allMessages);
      } else {
        console.error('Failed to fetch messages:', messagesResponse.statusText);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const headers = getAuthHeaders();
      if (!headers) return;

      const response = await fetch(`http://localhost:8000/api/v1/notifications/${notificationId}/read`, {
        method: 'PATCH',
        headers
      });

      if (response.ok) {
        setNotifications(prev =>
          prev.map(notif =>
            notif.id === notificationId ? { ...notif, isRead: true } : notif
          )
        );
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markMessageAsRead = async (messageId: string) => {
    try {
      const headers = getAuthHeaders();
      if (!headers) return;

      const response = await fetch(`http://localhost:8000/api/v1/notifications/messages/${messageId}/read`, {
        method: 'PATCH',
        headers
      });

      if (response.ok) {
        setMessages(prev =>
          prev.map(msg =>
            msg.id === messageId ? { ...msg, isRead: true } : msg
          )
        );
      }
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const sendMessage = async (to: string) => {
    if (!newMessage.trim()) return;

    try {
      const headers = getAuthHeaders();
      if (!headers) return;

      // Find the receiver ID from the conversation
      const conversation = Object.entries(conversations).find(([provider]) => provider === to);
      if (!conversation) return;

      const receiverId = conversation[1][0]?.from === 'customer' ? 
        conversation[1][0]?.to : conversation[1][0]?.from;

      const response = await fetch('http://localhost:8000/api/v1/notifications/messages', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          receiverId: receiverId,
          message: newMessage,
          type: 'text'
        })
      });

      if (response.ok) {
        const newMsg = await response.json();
        const message: Message = {
          id: newMsg.id,
          from: 'customer',
          to: to,
          message: newMessage,
          type: 'text',
          isRead: true,
          timestamp: newMsg.createdAt || new Date().toISOString()
        };

        setMessages(prev => [...prev, message]);
        setNewMessage('');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'booking': return '📅';
      case 'message': return '💬';
      case 'reminder': return '⏰';
      case 'payment': return '💰';
      case 'review': return '⭐';
      case 'system': return '⚙️';
      default: return '🔔';
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  const conversations = messages.reduce((acc, message) => {
    const otherPerson = message.from === 'customer' ? message.to : message.from;
    if (!acc[otherPerson]) {
      acc[otherPerson] = [];
    }
    acc[otherPerson].push(message);
    return acc;
  }, {} as Record<string, Message[]>);

  const unreadNotifications = notifications.filter(n => !n.isRead).length;
  const unreadMessages = messages.filter(m => m.from !== 'customer' && !m.isRead).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Notifications & Messages</h1>
          <p className="text-gray-600">Stay updated with your bookings and communicate with providers</p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6 w-fit">
          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-6 py-2 rounded-md font-medium transition-colors ${
              activeTab === 'notifications'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Notifications {unreadNotifications > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {unreadNotifications}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`px-6 py-2 rounded-md font-medium transition-colors ${
              activeTab === 'messages'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Messages {unreadMessages > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {unreadMessages}
              </span>
            )}
          </button>
        </div>

        {/* Content */}
        {activeTab === 'notifications' ? (
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold">Notifications</h2>
              <p className="text-gray-600 text-sm mt-1">Recent updates about your bookings and services</p>
            </div>
            
            {notifications.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-6 hover:bg-gray-50 cursor-pointer transition-colors ${
                      !notification.isRead ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="text-2xl flex-shrink-0">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold text-gray-900">
                            {notification.title}
                          </h3>
                          <div className="flex items-center space-x-2 ml-4">
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                            )}
                            <span className="text-xs text-gray-500">
                              {formatTime(notification.timestamp)}
                            </span>
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm mt-1">
                          {notification.message}
                        </p>
                        {notification.actionUrl && (
                          <button className="text-blue-600 text-sm mt-2 hover:text-blue-800">
                            View Details →
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <span className="text-6xl mb-4 block">🔔</span>
                <h3 className="text-lg font-medium mb-2">No notifications</h3>
                <p className="text-gray-500">You're all caught up!</p>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Conversations List */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold">Providers</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {Object.entries(conversations).map(([provider, msgs]) => {
                  const lastMessage = msgs[msgs.length - 1];
                  const unreadCount = msgs.filter(m => m.from !== 'customer' && !m.isRead).length;
                  
                  return (
                    <div
                      key={provider}
                      onClick={() => setSelectedProvider(provider)}
                      className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedProvider === provider ? 'bg-blue-50 border-r-2 border-r-blue-500' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">
                          {lastMessage.avatar || '👤'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <h3 className="font-medium text-gray-900 truncate">
                              {provider}
                            </h3>
                            {unreadCount > 0 && (
                              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                {unreadCount}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 truncate">
                            {lastMessage.message}
                          </p>
                          <span className="text-xs text-gray-400">
                            {formatTime(lastMessage.timestamp)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Chat Area */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border flex flex-col">
              {selectedProvider ? (
                <>
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">
                        {conversations[selectedProvider]?.[0]?.avatar || '👤'}
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold">{selectedProvider}</h2>
                        <p className="text-sm text-gray-600">Service Provider</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 p-6 space-y-4 max-h-96 overflow-y-auto">
                    {conversations[selectedProvider]?.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.from === 'customer' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.from === 'customer'
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p className="text-sm">{message.message}</p>
                          <span className={`text-xs ${
                            message.from === 'customer' ? 'text-blue-100' : 'text-gray-500'
                          } block mt-1`}>
                            {formatTime(message.timestamp)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-6 border-t border-gray-200">
                    <div className="flex space-x-4">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage(selectedProvider)}
                      />
                      <button
                        onClick={() => sendMessage(selectedProvider)}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        disabled={!newMessage.trim()}
                      >
                        Send
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center p-12">
                  <div className="text-center">
                    <span className="text-6xl mb-4 block">💬</span>
                    <h3 className="text-lg font-medium mb-2">Select a provider</h3>
                    <p className="text-gray-500">Choose a provider to start messaging</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}