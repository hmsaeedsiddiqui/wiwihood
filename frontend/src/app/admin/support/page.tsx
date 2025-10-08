'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  XCircle,
  User,
  Calendar,
  Tag,
  Send,
  Eye,
  Filter,
  RefreshCw
} from 'lucide-react';
import { adminApi } from '../../../lib/adminApi';

// Mock support tickets data
const mockTickets = [
  {
    id: 'TK-2024-001',
    subject: 'Payment Processing Issue',
    description: 'Unable to process payment for booking #BK-2024-001234. Error code: PAYMENT_FAILED',
    status: 'open',
    priority: 'high',
    category: 'payment',
    submittedBy: {
      id: 'USR-001',
      name: 'John Doe',
      email: 'john.doe@email.com',
      type: 'customer'
    },
    assignedTo: {
      id: 'ADM-001',
      name: 'Sarah Wilson',
      email: 'sarah@reservista.com'
    },
    createdDate: '2024-01-15T10:30:00Z',
    lastUpdate: '2024-01-15T14:22:00Z',
    messages: [
      {
        id: 'MSG-001',
        author: 'John Doe',
        authorType: 'customer',
        message: 'Unable to process payment for my booking. Getting error message after entering card details.',
        timestamp: '2024-01-15T10:30:00Z'
      },
      {
        id: 'MSG-002',
        author: 'Sarah Wilson',
        authorType: 'admin',
        message: 'Hi John, I can see the issue. It appears to be a temporary gateway problem. Please try again in a few minutes.',
        timestamp: '2024-01-15T14:22:00Z'
      }
    ],
    tags: ['payment', 'urgent', 'booking-related']
  },
  {
    id: 'TK-2024-002',
    subject: 'Provider Profile Not Showing',
    description: 'My salon profile is not appearing in search results for customers',
    status: 'in-progress',
    priority: 'medium',
    category: 'profile',
    submittedBy: {
      id: 'PRV-001',
      name: 'Beauty Salon Co.',
      email: 'info@beautysalon.com',
      type: 'provider'
    },
    assignedTo: {
      id: 'ADM-002',
      name: 'Mike Johnson',
      email: 'mike@reservista.com'
    },
    createdDate: '2024-01-14T09:15:00Z',
    lastUpdate: '2024-01-15T11:45:00Z',
    messages: [
      {
        id: 'MSG-003',
        author: 'Beauty Salon Co.',
        authorType: 'provider',
        message: 'Our salon profile disappeared from search results yesterday. Customers cannot find us.',
        timestamp: '2024-01-14T09:15:00Z'
      },
      {
        id: 'MSG-004',
        author: 'Mike Johnson',
        authorType: 'admin',
        message: 'I found the issue - your profile was accidentally set to inactive during our maintenance. Reactivating now.',
        timestamp: '2024-01-15T11:45:00Z'
      }
    ],
    tags: ['profile', 'search', 'visibility']
  },
  {
    id: 'TK-2024-003',
    subject: 'Booking Cancellation Refund',
    description: 'Requesting refund for cancelled booking due to provider unavailability',
    status: 'resolved',
    priority: 'low',
    category: 'refund',
    submittedBy: {
      id: 'USR-002',
      name: 'Emma Smith',
      email: 'emma.smith@email.com',
      type: 'customer'
    },
    assignedTo: {
      id: 'ADM-001',
      name: 'Sarah Wilson',
      email: 'sarah@reservista.com'
    },
    createdDate: '2024-01-12T16:20:00Z',
    lastUpdate: '2024-01-13T10:30:00Z',
    messages: [
      {
        id: 'MSG-005',
        author: 'Emma Smith',
        authorType: 'customer',
        message: 'Provider cancelled my appointment last minute due to emergency. Need refund processed.',
        timestamp: '2024-01-12T16:20:00Z'
      },
      {
        id: 'MSG-006',
        author: 'Sarah Wilson',
        authorType: 'admin',
        message: 'Refund has been processed. You should see it in your account within 3-5 business days.',
        timestamp: '2024-01-13T10:30:00Z'
      }
    ],
    tags: ['refund', 'cancellation', 'processed']
  },
  {
    id: 'TK-2024-004',
    subject: 'Feature Request: Bulk Booking Management',
    description: 'Would like ability to manage multiple bookings at once for large events',
    status: 'open',
    priority: 'low',
    category: 'feature-request',
    submittedBy: {
      id: 'PRV-002',
      name: 'EventPro Services',
      email: 'contact@eventpro.com',
      type: 'provider'
    },
    assignedTo: null,
    createdDate: '2024-01-10T14:45:00Z',
    lastUpdate: '2024-01-10T14:45:00Z',
    messages: [
      {
        id: 'MSG-007',
        author: 'EventPro Services',
        authorType: 'provider',
        message: 'We handle large corporate events and need to manage 20+ bookings at once. Current system is too manual.',
        timestamp: '2024-01-10T14:45:00Z'
      }
    ],
    tags: ['feature-request', 'bulk-operations', 'events']
  },
  {
    id: 'TK-2024-005',
    subject: 'Account Verification Stuck',
    description: 'Submitted documents for verification 5 days ago but still pending',
    status: 'open',
    priority: 'high',
    category: 'verification',
    submittedBy: {
      id: 'PRV-003',
      name: 'Wellness Center',
      email: 'admin@wellnesscenter.com',
      type: 'provider'
    },
    assignedTo: {
      id: 'ADM-003',
      name: 'Lisa Chen',
      email: 'lisa@reservista.com'
    },
    createdDate: '2024-01-08T11:30:00Z',
    lastUpdate: '2024-01-15T09:15:00Z',
    messages: [
      {
        id: 'MSG-008',
        author: 'Wellness Center',
        authorType: 'provider',
        message: 'Uploaded all required documents 5 days ago but verification status is still pending. When will this be reviewed?',
        timestamp: '2024-01-08T11:30:00Z'
      },
      {
        id: 'MSG-009',
        author: 'Lisa Chen',
        authorType: 'admin',
        message: 'Reviewing your documents now. Will update you within 24 hours.',
        timestamp: '2024-01-15T09:15:00Z'
      }
    ],
    tags: ['verification', 'documents', 'pending']
  }
];

const statusColors = {
  open: 'bg-blue-100 text-blue-800',
  'in-progress': 'bg-yellow-100 text-yellow-800',
  resolved: 'bg-green-100 text-green-800',
  closed: 'bg-gray-100 text-gray-800'
};

const priorityColors = {
  low: 'bg-gray-100 text-gray-800',
  medium: 'bg-orange-100 text-orange-800',
  high: 'bg-red-100 text-red-800'
};

const categoryIcons = {
  payment: '💳',
  profile: '👤',
  refund: '💰',
  'feature-request': '💡',
  verification: '✅',
  technical: '🔧',
  booking: '📅',
  other: '❓'
};

export default function AdminSupport() {
  const [tickets, setTickets] = useState(mockTickets);
  const [filteredTickets, setFilteredTickets] = useState(mockTickets);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadSupportTickets();
  }, [currentPage]);

  const loadSupportTickets = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getSupportTickets({
        page: currentPage,
        limit: 10,
        search: searchQuery || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        priority: priorityFilter !== 'all' ? priorityFilter : undefined,
      });
      
      setTickets(response.tickets || mockTickets);
      setFilteredTickets(response.tickets || mockTickets);
      setTotalPages(response.totalPages || 1);
    } catch (error) {
      console.error('Failed to load support tickets:', error);
      // Keep using mock data as fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = tickets;

    if (searchQuery) {
      filtered = filtered.filter(ticket =>
        ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.submittedBy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(ticket => ticket.status === statusFilter);
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter(ticket => ticket.priority === priorityFilter);
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(ticket => ticket.category === categoryFilter);
    }

    setFilteredTickets(filtered);
  }, [tickets, searchQuery, statusFilter, priorityFilter, categoryFilter]);

  const updateTicketStatus = async (ticketId: string, newStatus: string) => {
    try {
      await adminApi.updateTicketStatus(ticketId, newStatus);
      setTickets(prev => prev.map(ticket =>
        ticket.id === ticketId
          ? { ...ticket, status: newStatus, lastUpdate: new Date().toISOString() }
          : ticket
      ));
    } catch (error) {
      console.error('Failed to update ticket status:', error);
      alert('Failed to update ticket status');
    }
  };

  const assignTicket = (ticketId, adminId, adminName, adminEmail) => {
    setTickets(prev => prev.map(ticket =>
      ticket.id === ticketId
        ? { 
            ...ticket, 
            assignedTo: { id: adminId, name: adminName, email: adminEmail },
            lastUpdate: new Date().toISOString()
          }
        : ticket
    ));
  };

  const addMessage = (ticketId, message) => {
    const newMsg = {
      id: `MSG-${Date.now()}`,
      author: 'Admin',
      authorType: 'admin',
      message,
      timestamp: new Date().toISOString()
    };

    setTickets(prev => prev.map(ticket =>
      ticket.id === ticketId
        ? { 
            ...ticket, 
            messages: [...ticket.messages, newMsg],
            lastUpdate: new Date().toISOString()
          }
        : ticket
    ));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const TicketDetailModal = ({ ticket, onClose }) => {
    const [messageText, setMessageText] = useState('');

    const handleSendMessage = (e) => {
      e.preventDefault();
      if (messageText.trim()) {
        addMessage(ticket.id, messageText);
        setMessageText('');
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{ticket.subject}</h2>
                <p className="text-sm text-gray-500 mt-1">Ticket ID: {ticket.id}</p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              {/* Ticket Info */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="lg:col-span-2">
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <h3 className="font-medium text-gray-900 mb-2">Description</h3>
                    <p className="text-gray-700">{ticket.description}</p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900">Conversation</h3>
                    {ticket.messages.map((message) => (
                      <div key={message.id} className={`flex ${message.authorType === 'admin' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.authorType === 'admin' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-100 text-gray-900'
                        }`}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium">
                              {message.author}
                            </span>
                            <span className={`text-xs ${
                              message.authorType === 'admin' ? 'text-blue-200' : 'text-gray-500'
                            }`}>
                              {formatDate(message.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm">{message.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-3">Ticket Details</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm text-gray-600">Status</label>
                        <select
                          value={ticket.status}
                          onChange={(e) => updateTicketStatus(ticket.id, e.target.value)}
                          className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="open">Open</option>
                          <option value="in-progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                          <option value="closed">Closed</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="text-sm text-gray-600">Priority</label>
                        <span className={`mt-1 inline-block px-2 py-1 text-xs font-medium rounded-full ${priorityColors[ticket.priority]}`}>
                          {ticket.priority}
                        </span>
                      </div>
                      
                      <div>
                        <label className="text-sm text-gray-600">Category</label>
                        <div className="mt-1 flex items-center">
                          <span className="mr-2">{categoryIcons[ticket.category] || '❓'}</span>
                          <span className="text-sm text-gray-900 capitalize">{ticket.category.replace('-', ' ')}</span>
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm text-gray-600">Submitted By</label>
                        <div className="mt-1">
                          <p className="text-sm font-medium text-gray-900">{ticket.submittedBy.name}</p>
                          <p className="text-xs text-gray-500">{ticket.submittedBy.email}</p>
                          <span className="inline-block mt-1 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                            {ticket.submittedBy.type}
                          </span>
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm text-gray-600">Assigned To</label>
                        {ticket.assignedTo ? (
                          <div className="mt-1">
                            <p className="text-sm font-medium text-gray-900">{ticket.assignedTo.name}</p>
                            <p className="text-xs text-gray-500">{ticket.assignedTo.email}</p>
                          </div>
                        ) : (
                          <button 
                            onClick={() => assignTicket(ticket.id, 'ADM-001', 'Current Admin', 'admin@reservista.com')}
                            className="mt-1 text-sm text-blue-600 hover:text-blue-700"
                          >
                            Assign to me
                          </button>
                        )}
                      </div>
                      
                      <div>
                        <label className="text-sm text-gray-600">Created</label>
                        <p className="text-sm text-gray-900 mt-1">{formatDate(ticket.createdDate)}</p>
                      </div>
                      
                      <div>
                        <label className="text-sm text-gray-600">Last Update</label>
                        <p className="text-sm text-gray-900 mt-1">{formatDate(ticket.lastUpdate)}</p>
                      </div>
                    </div>
                  </div>

                  {ticket.tags && ticket.tags.length > 0 && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-3">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {ticket.tags.map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Message Input */}
          <div className="p-6 border-t border-gray-200">
            <form onSubmit={handleSendMessage} className="flex space-x-3">
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Type your response..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="submit"
                disabled={!messageText.trim()}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4 mr-2" />
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-[95%]  mx-auto ">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Support Tickets</h1>
            <p className="text-gray-600 mt-1">Manage customer and provider support requests</p>
          </div>
          <div className="flex items-center gap-4 space-x-3">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex cursor-pointer items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="flex cursor-pointer items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <MessageSquare className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Tickets</p>
              <p className="text-2xl font-bold text-gray-900">{tickets.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Open Tickets</p>
              <p className="text-2xl font-bold text-gray-900">
                {tickets.filter(t => t.status === 'open').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <AlertCircle className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">High Priority</p>
              <p className="text-2xl font-bold text-gray-900">
                {tickets.filter(t => t.priority === 'high').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Resolved Today</p>
              <p className="text-2xl font-bold text-gray-900">
                {tickets.filter(t => t.status === 'resolved').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search tickets by subject, description, or submitter..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          {showFilters && (
            <div className="flex flex-wrap gap-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
              
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                <option value="payment">Payment</option>
                <option value="profile">Profile</option>
                <option value="refund">Refund</option>
                <option value="feature-request">Feature Request</option>
                <option value="verification">Verification</option>
                <option value="technical">Technical</option>
                <option value="booking">Booking</option>
                <option value="other">Other</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Tickets List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Support Tickets ({filteredTickets.length})
          </h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {filteredTickets.map((ticket) => (
            <div
              key={ticket.id}
              className="p-4 sm:p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 sm:space-x-3 mb-2">
                    <h4 className="text-base sm:text-lg font-medium text-gray-900">{ticket.subject}</h4>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[ticket.status]}`}> 
                      {ticket.status.replace('-', ' ')}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${priorityColors[ticket.priority]}`}> 
                      {ticket.priority}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-2 sm:mb-3 line-clamp-2">{ticket.description}</p>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:space-x-6 text-sm text-gray-500">
                    <div className="flex items-center">
                      <span className="mr-2">{categoryIcons[ticket.category] || '❓'}</span>
                      <span className="capitalize">{ticket.category.replace('-', ' ')}</span>
                    </div>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      <span>{ticket.submittedBy.name}</span>
                      <span className="ml-1 px-1 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                        {ticket.submittedBy.type}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{formatDate(ticket.createdDate)}</span>
                    </div>
                    {ticket.assignedTo && (
                      <div className="flex items-center">
                        <span className="text-blue-600">Assigned to {ticket.assignedTo.name}</span>
                      </div>
                    )}
                  </div>
                  {ticket.tags && ticket.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2 sm:mt-3">
                      {ticket.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 sm:space-x-2 sm:ml-4">
                  <button
                    onClick={() => setSelectedTicket(ticket)}
                    className="flex items-center px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ticket Detail Modal */}
      {selectedTicket && (
        <TicketDetailModal 
          ticket={selectedTicket} 
          onClose={() => setSelectedTicket(null)} 
        />
      )}
    </div>
  );
}