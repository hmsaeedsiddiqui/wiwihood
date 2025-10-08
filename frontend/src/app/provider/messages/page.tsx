'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MessageCircle, Search, Send, ArrowLeft, User } from 'lucide-react';
import { getAuthHeaders } from '@/lib/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

interface Message {
  id: string;
  content: string;
  senderId: string;
  senderType: 'customer' | 'provider';
  timestamp: string;
  read: boolean;
}

interface Conversation {
  id: string;
  customerId: string;
  customerName: string;
  lastMessage: Message;
  unreadCount: number;
  service?: { name: string; status: string; };
}

export default function ProviderMessagesPage() {
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConversations();
  }, []);

  // Handle auto-start conversation from URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const customerId = urlParams.get('customerId');
    const autoStart = urlParams.get('autoStart');
    const customerName = urlParams.get('customerName');
    const customerEmail = urlParams.get('customerEmail');
    
    if (customerId && autoStart === 'true') {
      // Start conversation with the specified customer
      startConversationWithCustomer(customerId, customerName || 'Unknown Customer', customerEmail || '');
    }
  }, [conversations]); // Depend on conversations so it runs after they're loaded

  const fetchConversations = async () => {
    try {
      setLoading(true);
      
      const response = await fetch(`${API_BASE_URL}/messages/conversations`, {
        headers: getAuthHeaders(),
      });
      
      if (response.ok) {
        const apiConversations = await response.json();
        setConversations(apiConversations);
      } else {
        console.error('Failed to fetch conversations:', response.status, response.statusText);
        setConversations([]);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
      setConversations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectConversation = async (conversation: Conversation) => {
    setSelectedConversation(conversation);
    
    try {
      const response = await fetch(`${API_BASE_URL}/messages/conversations/${conversation.id}/messages`, {
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

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/messages/conversations/${selectedConversation.id}/messages`, {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newMessage.trim(),
          messageType: 'text'
        }),
      });
      
      if (response.ok) {
        const sentMessage = await response.json();
        // Refresh messages to get the latest data
        await handleSelectConversation(selectedConversation);
        await fetchConversations();
        setNewMessage('');
      } else {
        console.error('Failed to send message:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Function to start conversation with a specific customer
  const startConversationWithCustomer = async (customerId: string, customerName: string, customerEmail: string) => {
    try {
      // Check if conversation already exists
      const existingConversation = conversations.find(conv => conv.customerId === customerId);
      
      if (existingConversation) {
        // If conversation exists, select it
        setSelectedConversation(existingConversation);
        await handleSelectConversation(existingConversation);
        return;
      }
      
      // If no existing conversation, create a new one
      const response = await fetch(`${API_BASE_URL}/messages/conversations`, {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId: customerId,
          initialMessage: `Hello ${customerName}! How can I help you today?`
        }),
      });
      
      if (response.ok) {
        const newConversation = await response.json();
        console.log('Started conversation with customer:', newConversation);
        
        // Refresh conversations list to get the new conversation
        await fetchConversations();
        
        // Find and select the new conversation
        setTimeout(() => {
          const updatedConversations = conversations.filter(conv => conv.customerId === customerId);
          if (updatedConversations.length > 0) {
            setSelectedConversation(updatedConversations[0]);
            handleSelectConversation(updatedConversations[0]);
          }
        }, 500); // Small delay to ensure conversations are updated
        
      } else {
        console.error('Failed to start conversation:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error starting conversation with customer:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="">
        <div className="bg-white rounded-lg shadow overflow-hidden" style={{ height: '70vh' }}>
          <div className="flex h-full">
            <div className={`w-full md:w-1/3 border-r ${selectedConversation ? 'hidden md:block' : ''}`}>
              <div className="p-4 border-b">
                <h1 className="text-lg font-semibold">Customer Messages</h1>
                <div className="mt-3 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    className="w-full pl-10 pr-4 py-2 border rounded-lg"
                  />
                </div>
              </div>
              <div className="overflow-y-auto">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => handleSelectConversation(conversation)}
                    className="p-4 border-b hover:bg-gray-50 cursor-pointer"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className="font-medium">{conversation.customerName}</h3>
                          {conversation.unreadCount > 0 && (
                            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                              {conversation.unreadCount}
                            </span>
                          )}
                        </div>
                        {conversation.service && (
                          <p className="text-sm text-blue-600">{conversation.service.name}</p>
                        )}
                        <p className="text-sm text-gray-600 truncate">
                          {conversation.lastMessage.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {selectedConversation ? (
              <div className="flex-1 flex flex-col">
                <div className="p-4 border-b bg-white">
                  <div className="flex items-center">
                    <button
                      onClick={() => setSelectedConversation(null)}
                      className="md:hidden mr-3 p-1"
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </button>
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-gray-600" />
                    </div>
                    <div className="ml-3">
                      <h2 className="font-medium">{selectedConversation.customerName}</h2>
                      {selectedConversation.service && (
                        <p className="text-sm text-gray-600">{selectedConversation.service.name}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.senderType === 'provider' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs px-3 py-2 rounded-lg ${
                          message.senderType === 'provider'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 border-t bg-white">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1 border rounded-lg px-3 py-2"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg disabled:bg-gray-300"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="hidden md:flex flex-1 items-center justify-center">
                <div className="text-center">
                  <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <h2 className="text-lg font-medium text-gray-900 mb-1">Select a conversation</h2>
                  <p className="text-gray-600">Choose a customer to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
