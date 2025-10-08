"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  totalBookings: number;
  totalSpent: number;
  averageRating: number | null; // Allow null when no reviews exist
  lastBooking: string;
  status: 'active' | 'inactive';
  completedBookings: number;
  cancelledBookings: number;
  favoriteServices: string[];
}

export default function MyBuyersPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [providerId, setProviderId] = useState<string | null>(null);

  useEffect(() => {
    fetchProviderInfo();
  }, []);

  useEffect(() => {
    if (providerId) {
      fetchCustomers();
    }
  }, [providerId]);

  const fetchProviderInfo = async () => {
    try {
      const token = localStorage.getItem('providerToken');
      
      if (!token) {
        setError('Authentication token not found');
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:8000/api/v1/auth/profile', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.provider && data.provider.id) {
          setProviderId(data.provider.id);
        } else {
          setProviderId(data.id);
        }
      } else {
        setError('Failed to fetch provider information');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching provider info:', error);
      setError('Failed to fetch provider information');
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    if (!providerId) {
      return; // Wait for provider ID to be fetched
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('providerToken');
      
      if (!token) {
        setError('Authentication token not found');
        setLoading(false);
        return;
      }

      // Fetch all bookings for this provider
      const response = await fetch('http://localhost:8000/api/v1/bookings/my-bookings?limit=1000', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const bookings = data.bookings || [];
        
        // Fetch reviews for better customer ratings
        let reviews = [];
        if (providerId) {
          try {
            const reviewsResponse = await fetch(`http://localhost:8000/api/v1/reviews/provider/${providerId}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
              },
            });
            if (reviewsResponse.ok) {
              const reviewsData = await reviewsResponse.json();
              reviews = reviewsData.reviews || [];
            }
          } catch (error) {
            console.log('Reviews API not available, using default ratings');
          }
        }
        
        // Aggregate customer data from bookings
        const customerMap = new Map<string, Customer>();
        
        bookings.forEach((booking: any) => {
          const customerId = booking.customer?.id || booking.customerId || 'unknown';
          const customerName = booking.customer?.firstName && booking.customer?.lastName 
            ? `${booking.customer.firstName} ${booking.customer.lastName}`.trim()
            : booking.customer?.name || booking.customerName || 'Unknown Customer';
          const customerEmail = booking.customer?.email || booking.customerEmail || '';
          const customerPhone = booking.customer?.phone || booking.customerPhone || '';
          const serviceName = booking.service?.name || booking.serviceName || 'Unknown Service';
          const amount = parseFloat(booking.totalPrice) || 0; // Fixed: use totalPrice from booking entity and parse as float
          const status = booking.status || 'pending';
          const scheduledAt = booking.startTime || booking.scheduledAt || booking.date || new Date().toISOString();

          if (!customerMap.has(customerId)) {
            // Calculate average rating from reviews for this customer
            const customerReviews = reviews.filter((review: any) => 
              review.customer?.id === customerId || review.customerId === customerId
            );
            const averageRating = customerReviews.length > 0 
              ? customerReviews.reduce((sum: number, review: any) => sum + (review.rating || 0), 0) / customerReviews.length
              : null; // Use null instead of default rating when no reviews exist

            customerMap.set(customerId, {
              id: customerId,
              name: customerName,
              email: customerEmail,
              phone: customerPhone,
              totalBookings: 0,
              totalSpent: 0,
              averageRating: averageRating,
              lastBooking: scheduledAt,
              status: 'active',
              completedBookings: 0,
              cancelledBookings: 0,
              favoriteServices: []
            });
          }

          const customer = customerMap.get(customerId)!;
          customer.totalBookings += 1;
          
          // Only count completed or confirmed bookings for total spent
          if (status === 'completed' || status === 'confirmed') {
            customer.totalSpent += amount;
          }

          if (status === 'completed') {
            customer.completedBookings += 1;
          } else if (status === 'cancelled') {
            customer.cancelledBookings += 1;
          }

          // Update last booking if this one is more recent
          if (new Date(scheduledAt) > new Date(customer.lastBooking)) {
            customer.lastBooking = scheduledAt;
          }

          // Add to favorite services (unique)
          if (serviceName && !customer.favoriteServices.includes(serviceName)) {
            customer.favoriteServices.push(serviceName);
          }

          // Determine status based on recent activity
          const daysSinceLastBooking = Math.floor(
            (new Date().getTime() - new Date(customer.lastBooking).getTime()) / (1000 * 60 * 60 * 24)
          );
          customer.status = daysSinceLastBooking <= 30 ? 'active' : 'inactive';
        });

        const customersArray = Array.from(customerMap.values());
        setCustomers(customersArray);
        setError(null);
      } else if (response.status === 401) {
        setError('Unauthorized access. Please login again.');
      } else {
        // For demo purposes, show empty state instead of error
        console.log('Bookings API not available, showing empty state');
        setCustomers([]);
        setError(null);
      }
    } catch (error: any) {
      console.error('Error fetching customers:', error);
      // For demo purposes, show empty state instead of error
      setCustomers([]);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' || customer.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const stats = {
    totalCustomers: customers.length,
    activeCustomers: customers.filter(c => c.status === 'active').length,
    premiumCustomers: customers.filter(c => c.totalSpent > 1000).length,
    totalRevenue: customers.reduce((sum, customer) => sum + customer.totalSpent, 0)
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return { bg: '#dcfce7', text: '#16a34a' };
      case 'inactive': return { bg: '#fee2e2', text: '#dc2626' };
      default: return { bg: '#f1f5f9', text: '#64748b' };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  // Handler functions for buttons
  const handleMessage = (customer: Customer) => {
    // Navigate to provider messages page and auto-start conversation with this customer
    router.push(`/provider/messages?customerId=${customer.id}&autoStart=true&customerName=${encodeURIComponent(customer.name)}&customerEmail=${encodeURIComponent(customer.email)}`);
  };

  const handleViewProfile = (customer: Customer) => {
    // Navigate to customer profile page or show customer details
    router.push(`/provider/customers/${customer.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-5">
        <div className="">
          <div className="flex items-center justify-center h-96">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin"></div>
            <span className="ml-4 text-slate-500">Loading customers...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 p-5">
        <div className="">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-5">
            <h3 className="text-red-800 text-base font-semibold">
              Error loading customers
            </h3>
            <p className="text-red-600 mt-2">{error}</p>
            <button
              onClick={fetchCustomers}
              className="bg-red-600 text-white px-4 py-2 rounded-md border-none mt-3 cursor-var-pointer"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 ">
      <div className="">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            My Buyers
          </h1>
          <p className="text-slate-600 text-base">
            Manage your client relationships and track buyer activity
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="text-3xl font-bold text-slate-800 mb-2">
              {stats.totalCustomers}
            </div>
            <div className="text-slate-600 text-sm">Total Buyers</div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {stats.activeCustomers}
            </div>
            <div className="text-slate-600 text-sm">Active Buyers</div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="text-3xl font-bold text-amber-600 mb-2">
              {stats.premiumCustomers}
            </div>
            <div className="text-slate-600 text-sm">Premium Buyers</div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              ${stats.totalRevenue.toLocaleString()}
            </div>
            <div className="text-slate-600 text-sm">Total Revenue</div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-6">
          <div className="p-6 border-b border-slate-200">
            <div className="flex justify-between items-center flex-wrap gap-4">
              {/* Tabs */}
              <div className="flex gap-2">
                {[
                  { key: 'all', label: `All (${stats.totalCustomers})` },
                  { key: 'active', label: `Active (${stats.activeCustomers})` },
                  { key: 'inactive', label: `Inactive (${customers.length - stats.activeCustomers})` }
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`px-4 py-2 rounded-lg border-none text-sm font-medium cursor-var-pointer transition-all duration-200 ${
                      activeTab === tab.key 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search buyers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="py-2.5 pr-10 pl-3 border border-gray-300 rounded-lg text-sm w-64 outline-none"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  🔍
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Customers List */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          {filteredCustomers.length === 0 ? (
            <div className="text-center py-16 px-5">
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">
                👥
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                No customers found
              </h3>
              <p className="text-slate-600">
                {searchTerm 
                  ? `No customers match "${searchTerm}"` 
                  : activeTab === 'all'
                  ? "You don't have any customers yet."
                  : `No ${activeTab} customers found.`
                }
              </p>
            </div>
          ) : (
            <div>
              {filteredCustomers.map((customer, index) => {
                const statusColor = getStatusColor(customer.status);
                return (
                  <div 
                    key={customer.id}
                    className={`p-6 transition-colors duration-200 hover:bg-gray-50 ${
                      index < filteredCustomers.length - 1 ? 'border-b border-slate-200' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div className="flex items-center gap-4">
                        {/* Avatar */}
                        <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-lg">
                          {customer.name.charAt(0).toUpperCase()}
                        </div>

                        {/* Customer Info */}
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-lg font-semibold text-slate-800 m-0">
                              {customer.name}
                            </h3>
                            <span 
                              className="px-2 py-1 rounded-xl text-xs font-medium"
                              style={{
                                backgroundColor: statusColor.bg,
                                color: statusColor.text
                              }}
                            >
                              {customer.status}
                            </span>
                          </div>
                          <p className="text-slate-600 text-sm m-0">
                            {customer.email}
                          </p>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
                        <div>
                          <div className="text-xl font-bold text-slate-800">
                            {customer.totalBookings}
                          </div>
                          <div className="text-xs text-slate-600">
                            Total Orders
                          </div>
                        </div>

                        <div>
                          <div className="text-xl font-bold text-green-600">
                            ${customer.totalSpent}
                          </div>
                          <div className="text-xs text-slate-600">
                            Total Spent
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-center gap-1">
                            <span className="text-xl font-bold text-amber-600">
                              {customer.averageRating ? customer.averageRating.toFixed(1) : 'N/A'}
                            </span>
                            <span className="text-yellow-400">
                              {customer.averageRating ? '⭐' : ''}
                            </span>
                          </div>
                          <div className="text-xs text-slate-600">
                            {customer.averageRating ? 'Average Rating' : 'No Reviews Yet'}
                          </div>
                        </div>

                        <div>
                          <div className="text-sm font-semibold text-slate-800">
                            {formatDate(customer.lastBooking)}
                          </div>
                          <div className="text-xs text-slate-600">
                            Last Order
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap  gap-2">
                        <button 
                          onClick={() => handleMessage(customer)}
                          className="bg-blue-500 text-white px-4 py-2 rounded-md border-none text-sm cursor-pointer hover:bg-blue-600 transition-colors"
                        >
                          Message
                        </button>
                        <button 
                          onClick={() => handleViewProfile(customer)}
                          className="bg-transparent text-slate-600 px-4 py-2 rounded-md border border-gray-300 text-sm cursor-pointer hover:bg-gray-50 transition-colors"
                        >
                          View Profile
                        </button>
                      </div>
                    </div>

                    {/* Additional Details */}
                    {customer.favoriteServices.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-slate-100">
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-slate-600 font-medium">
                            Favorite Services:
                          </span>
                          <div className="flex gap-2 flex-wrap">
                            {customer.favoriteServices.slice(0, 3).map((service, idx) => (
                              <span 
                                key={idx}
                                className="bg-blue-50 text-blue-600 px-2 py-1 rounded-xl text-xs"
                              >
                                {service}
                              </span>
                            ))}
                            {customer.favoriteServices.length > 3 && (
                              <span className="text-slate-600 text-xs">
                                +{customer.favoriteServices.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}