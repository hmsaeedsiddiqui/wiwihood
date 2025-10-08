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
import { getAuthHeaders, isAuthenticated } from '@/lib/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const API_URL = `${API_BASE_URL}/api/v1`;
import Footer from '@/components/Footer';
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
    // Check if user is authenticated before fetching conversations
    if (!isAuthenticated()) {
      console.log('User not authenticated, redirecting to login');
      router.push('/auth/customer/login');
      return;
    }
    
    fetchConversations();
    
    // Check for providerId in URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const providerId = urlParams.get('providerId');
    
    if (providerId) {
      // Start conversation with the specified provider
      startConversationWithProvider(providerId, 'Hello! I would like to inquire about your services.');
    }
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.id);
    }
  }, [selectedConversation]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      
      // Check authentication before making request
      if (!isAuthenticated()) {
        console.log('No auth token found, redirecting to login');
        router.push('/auth/customer/login');
        return;
      }
      
      const authHeaders = getAuthHeaders();
      console.log('Making request with headers:', authHeaders);
      
      const response = await fetch(`${API_BASE_URL}/messages/conversations`, {
        headers: authHeaders,
      });
      
      console.log('Response status:', response.status);
      
      if (response.status === 401) {
        console.log('Unauthorized - redirecting to login');
        router.push('/auth/customer/login');
        return;
      }
      
      if (response.ok) {
        const apiConversations = await response.json();
        console.log('Fetched conversations:', apiConversations);
        setConversations(apiConversations);
      } else {
        console.error('Failed to fetch conversations:', response.status, response.statusText);
        const errorText = await response.text();
        console.error('Error details:', errorText);
        setConversations([]);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
      setConversations([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/messages/conversations/${conversationId}/messages`, {
        headers: getAuthHeaders(),
      });
      
      if (response.ok) {
        const data = await response.json();
        const messages = data.messages || data || [];
        setMessages(messages);
      } else {
        console.error('Failed to fetch messages:', response.status, response.statusText);
        setMessages([]);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      setMessages([]);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || sendingMessage) return;

    try {
      setSendingMessage(true);

      // Send message via API
      const response = await fetch(`${API_BASE_URL}/messages/conversations/${selectedConversation.id}/messages`, {
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
        
        // Refresh messages and conversations
        await fetchMessages(selectedConversation.id);
        await fetchConversations();
        
        setNewMessage('');
      } else {
        console.error('Failed to send message:', response.status, response.statusText);
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
    router.push('/providers'); // Redirect to browse providers
  };

  // Function to start conversation with a specific provider
  const startConversationWithProvider = async (providerId: string, initialMessage?: string) => {
    try {
      // Check authentication before making request
      if (!isAuthenticated()) {
        console.log('Not authenticated for starting conversation, redirecting to login');
        router.push('/auth/customer/login');
        return;
      }
      
      const response = await fetch(`${API_BASE_URL}/messages/conversations`, {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          providerId,
          initialMessage
        }),
      });
      
      console.log('Start conversation response status:', response.status);
      
      if (response.status === 401) {
        console.log('Unauthorized when starting conversation - redirecting to login');
        router.push('/auth/customer/login');
        return;
      }
      
      if (response.ok) {
        const newConversation = await response.json();
        console.log('Started conversation:', newConversation);
        // Refresh conversations list
        await fetchConversations();
        
        // Auto-select the new conversation
        const updatedConversations = await fetch(`${API_BASE_URL}/messages/conversations`, {
          headers: getAuthHeaders(),
        }).then(res => res.json());
        
        const targetConversation = updatedConversations.find((conv: Conversation) => 
          conv.providerId === providerId
        );
        
        if (targetConversation) {
          setSelectedConversation(targetConversation);
        }
        
        return newConversation;
      } else {
        console.error('Failed to start conversation:', response.status, response.statusText);
        const errorText = await response.text();
        console.error('Error details:', errorText);
      }
    } catch (error) {
      console.error('Error starting conversation:', error);
    }
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
      <div className="w-[95%] max-w-[1400px] mx-auto py-8">
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
                  <div className="flex items-center justify-between flex-wrap gap-2">
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
      <Footer />
    </div>
  );
}