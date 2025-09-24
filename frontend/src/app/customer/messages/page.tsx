'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  MessageCircle, 
  Search, 
  Send, 
  ArrowLeft, 
  Calendar, 
  Clock,
  User,
  Star,
  Phone,
  Video,
  MoreVertical
} from 'lucide-react';
import { getAuthHeaders } from '@/lib/auth';

interface Message {
  id: string;
  content: string;
  senderId: string;
  senderType: 'customer' | 'provider';
  timestamp: string;
  read: boolean;
  messageType?: 'text' | 'image' | 'booking_update';
}

interface Conversation {
  id: string;
  providerId: string;
  providerName: string;
  providerLogo?: string;
  providerRating?: number;
  lastMessage: Message;
  unreadCount: number;
  lastActive: string;
  bookingId?: string;
  service?: {
    name: string;
    date: string;
  };
}

export default function CustomerMessagesPage() {
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.id);
    }
  }, [selectedConversation]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      
      // Try to fetch from API, fall back to mock data
      try {
        const response = await fetch('http://localhost:8000/api/v1/messages/conversations', {
          headers: getAuthHeaders(),
        });
        
        if (response.ok) {
          const apiConversations = await response.json();
          setConversations(apiConversations);
          return;
        }
      } catch (apiError) {
        console.log('API not available, using mock data:', apiError);
      }
      
      // Mock data for demonstration
      const mockConversations: Conversation[] = [
        {
          id: '1',
          providerId: 'prov-1',
          providerName: 'Elite Hair Studio',
          providerLogo: '/provider1.jpg',
          providerRating: 4.8,
          unreadCount: 2,
          lastActive: new Date(Date.now() - 5 * 60000).toISOString(), // 5 minutes ago
          bookingId: 'book-123',
          service: {
            name: 'Hair Cut & Style',
            date: '2024-01-25'
          },
          lastMessage: {
            id: 'msg-1',
            content: 'Your appointment is confirmed for tomorrow at 2 PM',
            senderId: 'prov-1',
            senderType: 'provider',
            timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
            read: false
          }
        },
        {
          id: '2',
          providerId: 'prov-2',
          providerName: 'Beauty Lounge',
          providerLogo: '/provider2.jpg',
          providerRating: 4.6,
          unreadCount: 0,
          lastActive: new Date(Date.now() - 2 * 3600000).toISOString(), // 2 hours ago
          bookingId: 'book-124',
          service: {
            name: 'Facial Treatment',
            date: '2024-01-28'
          },
          lastMessage: {
            id: 'msg-2',
            content: 'Thank you for choosing our service!',
            senderId: 'customer-1',
            senderType: 'customer',
            timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
            read: true
          }
        },
        {
          id: '3',
          providerId: 'prov-3',
          providerName: 'Wellness Spa',
          providerLogo: '/provider3.jpg',
          providerRating: 4.9,
          unreadCount: 1,
          lastActive: new Date(Date.now() - 24 * 3600000).toISOString(), // 1 day ago
          lastMessage: {
            id: 'msg-3',
            content: 'We have a special offer for returning customers!',
            senderId: 'prov-3',
            senderType: 'provider',
            timestamp: new Date(Date.now() - 24 * 3600000).toISOString(),
            read: false
          }
        }
      ];

      setConversations(mockConversations);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      // Try to fetch from API, fall back to mock data
      try {
        const response = await fetch(`http://localhost:8000/api/v1/messages/conversations/${conversationId}/messages`, {
          headers: getAuthHeaders(),
        });
        
        if (response.ok) {
          const { messages } = await response.json();
          setMessages(messages);
          return;
        }
      } catch (apiError) {
        console.log('API not available, using mock data:', apiError);
      }
      
      // Mock messages for demonstration
      const mockMessages: Message[] = [
        {
          id: '1',
          content: 'Hello! I have a question about my upcoming appointment.',
          senderId: 'customer-1',
          senderType: 'customer',
          timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
          read: true
        },
        {
          id: '2',
          content: 'Hi! Of course, I\'m happy to help. What would you like to know?',
          senderId: 'prov-1',
          senderType: 'provider',
          timestamp: new Date(Date.now() - 3000000).toISOString(), // 50 minutes ago
          read: true
        },
        {
          id: '3',
          content: 'Can I reschedule to 3 PM instead of 2 PM tomorrow?',
          senderId: 'customer-1',
          senderType: 'customer',
          timestamp: new Date(Date.now() - 2400000).toISOString(), // 40 minutes ago
          read: true
        },
        {
          id: '4',
          content: 'Let me check my schedule... Yes, 3 PM is available! I\'ll update your booking.',
          senderId: 'prov-1',
          senderType: 'provider',
          timestamp: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
          read: true
        },
        {
          id: '5',
          content: 'Your appointment is confirmed for tomorrow at 3 PM. See you then!',
          senderId: 'prov-1',
          senderType: 'provider',
          timestamp: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
          read: false
        }
      ];

      setMessages(mockMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || sendingMessage) return;

    try {
      setSendingMessage(true);

      const messageData: Message = {
        id: `msg-${Date.now()}`,
        content: newMessage.trim(),
        senderId: 'customer-1',
        senderType: 'customer',
        timestamp: new Date().toISOString(),
        read: true
      };

      // Add message to current messages
      setMessages(prev => [...prev, messageData]);
      
      // Update conversation's last message
      setConversations(prev => 
        prev.map(conv => 
          conv.id === selectedConversation.id 
            ? { ...conv, lastMessage: messageData }
            : conv
        )
      );

      setNewMessage('');

      // Try to send via API
      try {
        const response = await fetch(`http://localhost:8000/api/v1/messages/conversations/${selectedConversation.id}/messages`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json', 
            ...getAuthHeaders() 
          },
          body: JSON.stringify({
            content: newMessage.trim(),
            messageType: 'text'
          })
        });

        if (response.ok) {
          const sentMessage = await response.json();
          console.log('Message sent successfully:', sentMessage);
        }
      } catch (apiError) {
        console.log('API not available, message sent locally only:', apiError);
      }

    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSendingMessage(false);
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const filteredConversations = conversations.filter(conv =>
    conv.providerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.service?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const startNewConversation = () => {
    router.push('/browse'); // Redirect to browse providers
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden" style={{ height: '80vh' }}>
          <div className="flex h-full">
            
            {/* Conversations List */}
            <div className={`w-full md:w-1/3 border-r border-gray-200 flex flex-col ${selectedConversation ? 'hidden md:flex' : ''}`}>
              {/* Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-xl font-semibold text-gray-900">Messages</h1>
                  <button
                    onClick={startNewConversation}
                    className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                  >
                    New Chat
                  </button>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Conversations */}
              <div className="flex-1 overflow-y-auto">
                {filteredConversations.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No conversations yet</h3>
                    <p className="text-gray-600 mb-4">Start chatting with your service providers</p>
                    <button
                      onClick={startNewConversation}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Browse Providers
                    </button>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {filteredConversations.map((conversation) => (
                      <div
                        key={conversation.id}
                        onClick={() => setSelectedConversation(conversation)}
                        className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                          selectedConversation?.id === conversation.id ? 'bg-blue-50 border-r-2 border-blue-600' : ''
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="relative">
                            <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                              {conversation.providerLogo ? (
                                <img
                                  src={conversation.providerLogo}
                                  alt={conversation.providerName}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                                  <User className="h-6 w-6 text-gray-600" />
                                </div>
                              )}
                            </div>
                            {conversation.unreadCount > 0 && (
                              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                                <span className="text-xs text-white font-medium">
                                  {conversation.unreadCount > 9 ? '9+' : conversation.unreadCount}
                                </span>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="text-sm font-medium text-gray-900 truncate">
                                {conversation.providerName}
                              </h3>
                              <span className="text-xs text-gray-500">
                                {formatTime(conversation.lastMessage.timestamp)}
                              </span>
                            </div>
                            
                            {conversation.service && (
                              <p className="text-xs text-blue-600 mb-1">
                                {conversation.service.name}
                              </p>
                            )}
                            
                            <p className={`text-sm truncate ${
                              conversation.unreadCount > 0 ? 'text-gray-900 font-medium' : 'text-gray-600'
                            }`}>
                              {conversation.lastMessage.senderType === 'provider' ? '' : 'You: '}
                              {conversation.lastMessage.content}
                            </p>
                            
                            {conversation.providerRating && (
                              <div className="flex items-center mt-1">
                                <Star className="h-3 w-3 text-yellow-400 fill-current" />
                                <span className="text-xs text-gray-500 ml-1">
                                  {conversation.providerRating.toFixed(1)}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Chat Area */}
            {selectedConversation ? (
              <div className="flex-1 flex flex-col">
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 bg-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => setSelectedConversation(null)}
                        className="md:hidden p-1 hover:bg-gray-100 rounded-lg"
                      >
                        <ArrowLeft className="h-5 w-5 text-gray-600" />
                      </button>
                      
                      <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
                        {selectedConversation.providerLogo ? (
                          <img
                            src={selectedConversation.providerLogo}
                            alt={selectedConversation.providerName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                            <User className="h-5 w-5 text-gray-600" />
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <h2 className="font-medium text-gray-900">{selectedConversation.providerName}</h2>
                        {selectedConversation.service && (
                          <p className="text-sm text-gray-600">{selectedConversation.service.name}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg">
                        <Phone className="h-5 w-5 text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg">
                        <Video className="h-5 w-5 text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg">
                        <MoreVertical className="h-5 w-5 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.senderType === 'customer' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.senderType === 'customer'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.senderType === 'customer' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200 bg-white">
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!newMessage.trim() || sendingMessage}
                      className={`p-2 rounded-lg transition-colors ${
                        newMessage.trim() && !sendingMessage
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      <Send className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="hidden md:flex flex-1 items-center justify-center bg-gray-50">
                <div className="text-center">
                  <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h2 className="text-xl font-medium text-gray-900 mb-2">Select a conversation</h2>
                  <p className="text-gray-600">Choose a provider to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}