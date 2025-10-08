"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';

const demoTickets = [
  {
    id: 1,
    subject: 'Booking cancellation issue',
    status: 'open',
    priority: 'high',
    category: 'booking',
    createdAt: '2025-08-27 10:30 AM',
    lastReply: '2025-08-27 02:15 PM',
    messages: [
      {
        id: 1,
        sender: 'customer',
        name: 'Sarah Johnson',
        message: 'I tried to cancel my booking but the system is showing an error. Can you help?',
        timestamp: '2025-08-27 10:30 AM'
      },
      {
        id: 2,
        sender: 'support',
        name: 'Mike Support',
        message: 'Hi Sarah, I can help you with that. Let me check your booking details. Can you provide the booking ID?',
        timestamp: '2025-08-27 02:15 PM'
      }
    ]
  },
  {
    id: 2,
    subject: 'Payment not processed',
    status: 'resolved',
    priority: 'medium',
    category: 'payment',
    createdAt: '2025-08-25 09:00 AM',
    lastReply: '2025-08-25 03:30 PM',
    messages: [
      {
        id: 1,
        sender: 'customer',
        name: 'Sarah Johnson',
        message: 'My payment was charged but the booking is still showing as unpaid.',
        timestamp: '2025-08-25 09:00 AM'
      },
      {
        id: 2,
        sender: 'support',
        name: 'Emma Support',
        message: 'Thank you for reporting this. I can see the payment went through successfully. I\'ve updated your booking status.',
        timestamp: '2025-08-25 03:30 PM'
      }
    ]
  },
  {
    id: 3,
    subject: 'Account verification',
    status: 'closed',
    priority: 'low',
    category: 'account',
    createdAt: '2025-08-20 11:15 AM',
    lastReply: '2025-08-20 04:45 PM',
    messages: [
      {
        id: 1,
        sender: 'customer',
        name: 'Sarah Johnson',
        message: 'How do I verify my email address?',
        timestamp: '2025-08-20 11:15 AM'
      },
      {
        id: 2,
        sender: 'support',
        name: 'John Support',
        message: 'I\'ve sent a new verification email to your address. Please check your inbox and spam folder.',
        timestamp: '2025-08-20 04:45 PM'
      }
    ]
  }
];

const statusColors = {
  open: 'bg-yellow-100 text-yellow-800',
  resolved: 'bg-green-100 text-green-800',
  closed: 'bg-gray-100 text-gray-800'
};

const priorityColors = {
  high: 'bg-red-100 text-red-800',
  medium: 'bg-orange-100 text-orange-800',
  low: 'bg-blue-100 text-blue-800'
};

export default function HelpPage() {
  const [tickets, setTickets] = useState(demoTickets);
  const [selectedTicket, setSelectedTicket] = useState<number | null>(null);
  const [newTicket, setNewTicket] = useState({
    subject: '',
    category: 'general',
    priority: 'medium',
    message: ''
  });
  const [showNewTicketForm, setShowNewTicketForm] = useState(false);
  const [newMessage, setNewMessage] = useState('');

  const handleCreateTicket = () => {
    const ticket = {
      id: tickets.length + 1,
      subject: newTicket.subject,
      status: 'open' as const,
      priority: newTicket.priority as 'low' | 'medium' | 'high',
      category: newTicket.category,
      createdAt: new Date().toLocaleString(),
      lastReply: new Date().toLocaleString(),
      messages: [
        {
          id: 1,
          sender: 'customer' as const,
          name: 'Sarah Johnson',
          message: newTicket.message,
          timestamp: new Date().toLocaleString()
        }
      ]
    };

    setTickets([ticket, ...tickets]);
    setNewTicket({ subject: '', category: 'general', priority: 'medium', message: '' });
    setShowNewTicketForm(false);
  };

  const handleSendMessage = (ticketId: number) => {
    if (!newMessage.trim()) return;

    setTickets(tickets.map(ticket => {
      if (ticket.id === ticketId) {
        return {
          ...ticket,
          messages: [...ticket.messages, {
            id: ticket.messages.length + 1,
            sender: 'customer' as const,
            name: 'Sarah Johnson',
            message: newMessage,
            timestamp: new Date().toLocaleString()
          }],
          lastReply: new Date().toLocaleString()
        };
      }
      return ticket;
    }));

    setNewMessage('');
  };

  const selectedTicketData = tickets.find(t => t.id === selectedTicket);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Help & Support</h1>
          <p className="text-gray-600 mt-2">Get help with your bookings and account</p>
        </div>

        {/* Quick Help Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl mb-3">📚</div>
            <h3 className="font-semibold text-gray-900 mb-2">FAQ</h3>
            <p className="text-gray-600 text-sm mb-4">Find answers to common questions</p>
            <Link href="/faq" className="text-blue-600 font-medium hover:text-blue-700">
              Browse FAQ →
            </Link>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl mb-3">💬</div>
            <h3 className="font-semibold text-gray-900 mb-2">Live Chat</h3>
            <p className="text-gray-600 text-sm mb-4">Chat with our support team</p>
            <button className="text-blue-600 font-medium hover:text-blue-700">
              Start Chat →
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl mb-3">📧</div>
            <h3 className="font-semibold text-gray-900 mb-2">Email Support</h3>
            <p className="text-gray-600 text-sm mb-4">Send us an email</p>
            <a href="mailto:support@reservista.com" className="text-blue-600 font-medium hover:text-blue-700">
              support@reservista.com →
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Support Tickets List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Support Tickets</h2>
                  <button
                    onClick={() => setShowNewTicketForm(true)}
                    className="px-3 cursor-pointer py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition"
                  >
                    New Ticket
                  </button>
                </div>
              </div>
              <div className="divide-y">
                {tickets.map(ticket => (
                  <div
                    key={ticket.id}
                    onClick={() => setSelectedTicket(ticket.id)}
                    className={`p-4 cursor-pointer hover:bg-gray-50 transition ${
                      selectedTicket === ticket.id ? 'bg-blue-50 border-r-4 border-r-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900 text-sm">{ticket.subject}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${statusColors[ticket.status]}`}>
                        {ticket.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>#{ticket.id}</span>
                      <span className={`px-2 py-1 rounded ${priorityColors[ticket.priority]}`}>
                        {ticket.priority}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Last reply: {ticket.lastReply}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Ticket Detail */}
          <div className="lg:col-span-2">
            {showNewTicketForm ? (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Create New Support Ticket</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                    <input
                      type="text"
                      value={newTicket.subject}
                      onChange={(e) => setNewTicket({...newTicket, subject: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                      placeholder="Brief description of your issue"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 ">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                      <select
                        value={newTicket.category}
                        onChange={(e) => setNewTicket({...newTicket, category: e.target.value})}
                        className="w-full mb-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="general">General</option>
                        <option value="booking">Booking</option>
                        <option value="payment">Payment</option>
                        <option value="account">Account</option>
                        <option value="technical">Technical</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                      <select
                        value={newTicket.priority}
                        onChange={(e) => setNewTicket({...newTicket, priority: e.target.value})}
                        className="w-full  mb-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                    <textarea
                      value={newTicket.message}
                      onChange={(e) => setNewTicket({...newTicket, message: e.target.value})}
                      rows={5}
                      className="w-full mb-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Describe your issue in detail..."
                    />
                  </div>
                  
                  <div className="flex space-x-4 gap-2">
                    <button
                      onClick={handleCreateTicket}
                      disabled={!newTicket.subject || !newTicket.message}
                      className="px-6 py-2 cursor-pointer bg-emerald-500 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 transition"
                    >
                      Create Ticket
                    </button>
                    <button
                      onClick={() => setShowNewTicketForm(false)}
                      className="px-6 cursor-pointer py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ) : selectedTicketData ? (
              <div className="bg-white rounded-lg shadow">
                {/* Ticket Header */}
                <div className="p-6 border-b">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">{selectedTicketData.subject}</h2>
                      <p className="text-sm text-gray-500">Ticket #{selectedTicketData.id} • Created {selectedTicketData.createdAt}</p>
                    </div>
                    <div className="flex space-x-2">
                      <span className={`px-3 py-1 text-sm rounded-full ${statusColors[selectedTicketData.status]}`}>
                        {selectedTicketData.status}
                      </span>
                      <span className={`px-3 py-1 text-sm rounded-full ${priorityColors[selectedTicketData.priority]}`}>
                        {selectedTicketData.priority} priority
                      </span>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
                  {selectedTicketData.messages.map(message => (
                    <div key={message.id} className={`flex ${message.sender === 'customer' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.sender === 'customer' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <p className="text-sm">{message.message}</p>
                        <p className={`text-xs mt-1 ${message.sender === 'customer' ? 'text-blue-100' : 'text-gray-500'}`}>
                          {message.name} • {message.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Reply Input */}
                {selectedTicketData.status === 'open' && (
                  <div className="p-6 border-t">
                    <div className="flex space-x-4">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(selectedTicketData.id)}
                      />
                      <button
                        onClick={() => handleSendMessage(selectedTicketData.id)}
                        disabled={!newMessage.trim()}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 transition"
                      >
                        Send
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <div className="text-6xl mb-4">💬</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a ticket</h3>
                <p className="text-gray-600">Choose a support ticket from the left to view conversation</p>
              </div>
            )}
          </div>
        </div>

        {/* Back to Dashboard */}
        <div className="mt-8 text-center">
          <Link href="/dashboard" className="inline-block bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
       <Footer />
    </div>
   
  );
}
