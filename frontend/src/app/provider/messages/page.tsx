'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MessageCircle, Search, Send, ArrowLeft, User } from 'lucide-react';

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
    // Mock data
    const mockConversations: Conversation[] = [
      {
        id: '1',
        customerId: 'customer-1',
        customerName: 'Sarah Johnson',
        unreadCount: 2,
        service: { name: 'Hair Cut & Style', status: 'confirmed' },
        lastMessage: {
          id: 'msg-1',
          content: 'Hi! I have a question about my appointment.',
          senderId: 'customer-1',
          senderType: 'customer',
          timestamp: new Date().toISOString(),
          read: false
        }
      }
    ];
    setConversations(mockConversations);
    setLoading(false);
  }, []);

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    const mockMessages: Message[] = [
      {
        id: '1',
        content: 'Hi! I have a question about my appointment.',
        senderId: 'customer-1',
        senderType: 'customer',
        timestamp: new Date().toISOString(),
        read: true
      }
    ];
    setMessages(mockMessages);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;
    
    const messageData: Message = {
      id: `msg-${Date.now()}`,
      content: newMessage.trim(),
      senderId: 'provider-1',
      senderType: 'provider',
      timestamp: new Date().toISOString(),
      read: true
    };

    setMessages(prev => [...prev, messageData]);
    setNewMessage('');
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
      <div className="max-w-6xl mx-auto px-4 py-8">
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
