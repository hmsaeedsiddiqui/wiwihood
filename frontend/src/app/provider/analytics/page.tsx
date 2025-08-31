"use client";
import React, { useState } from "react";
import ProviderNav from "@/components/ProviderNav";

// Mock analytics data
const analyticsData = {
  overview: {
    totalRevenue: 89650,
    monthlyRevenue: 12400,
    totalBookings: 1847,
    monthlyBookings: 156,
    averageRating: 4.8,
    completionRate: 95,
    responseRate: 98,
    repeatCustomers: 67
  },
  revenueChart: [
    { month: "Jan", revenue: 8500, bookings: 142 },
    { month: "Feb", revenue: 9200, bookings: 156 },
    { month: "Mar", revenue: 10100, bookings: 168 },
    { month: "Apr", revenue: 11200, bookings: 182 },
    { month: "May", revenue: 10800, bookings: 175 },
    { month: "Jun", revenue: 12100, bookings: 195 },
    { month: "Jul", revenue: 13200, bookings: 208 },
    { month: "Aug", revenue: 12400, bookings: 156 }
  ],
  topServices: [
    { name: "Deep Tissue Massage", bookings: 245, revenue: 29400, rating: 4.9 },
    { name: "Swedish Massage", bookings: 189, revenue: 18900, rating: 4.8 },
    { name: "Facial Treatment", bookings: 167, revenue: 25050, rating: 4.7 },
    { name: "Hot Stone Massage", bookings: 98, revenue: 17640, rating: 4.9 },
    { name: "Reflexology", bookings: 134, revenue: 14740, rating: 4.8 }
  ],
  customerInsights: {
    newCustomers: 45,
    returningCustomers: 111,
    averageSessionValue: 142,
    bookingTrends: {
      mostPopularDay: "Friday",
      mostPopularTime: "2:00 PM - 4:00 PM",
      averageAdvanceBooking: 7 // days
    }
  },
  recentReviews: [
    { id: 1, customer: "Emma Wilson", rating: 5, comment: "Amazing experience! Very professional and relaxing.", date: "2025-08-25", service: "Deep Tissue Massage" },
    { id: 2, customer: "Michael Brown", rating: 4, comment: "Good service, will definitely come back.", date: "2025-08-24", service: "Facial Treatment" },
    { id: 3, customer: "Lisa Chen", rating: 5, comment: "Best massage I've ever had. Highly recommend!", date: "2025-08-23", service: "Swedish Massage" }
  ]
};

export default function ProviderAnalytics() {
  const [selectedPeriod, setSelectedPeriod] = useState("30days");
  const [selectedTab, setSelectedTab] = useState("overview");

  const { overview, revenueChart, topServices, customerInsights, recentReviews } = analyticsData;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const getChangeColor = (change: number) => {
    return change >= 0 ? "text-green-600" : "text-red-600";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ProviderNav />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics & Insights</h1>
            <p className="text-gray-600">Track your business performance and growth</p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="7days">Last 7 days</option>
              <option value="30days">Last 30 days</option>
              <option value="90days">Last 90 days</option>
              <option value="year">This year</option>
            </select>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
              📊 Export Report
            </button>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Total Revenue</h3>
              <div className="bg-green-100 p-2 rounded-full">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">{formatCurrency(overview.totalRevenue)}</div>
            <p className="text-sm text-green-600 mt-1">↗ +12.5% from last month</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Total Bookings</h3>
              <div className="bg-blue-100 p-2 rounded-full">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">{overview.totalBookings}</div>
            <p className="text-sm text-blue-600 mt-1">↗ +8.3% from last month</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Average Rating</h3>
              <div className="bg-yellow-100 p-2 rounded-full">
                <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">{overview.averageRating}/5.0</div>
            <p className="text-sm text-green-600 mt-1">↗ +0.2 from last month</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Completion Rate</h3>
              <div className="bg-purple-100 p-2 rounded-full">
                <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">{overview.completionRate}%</div>
            <p className="text-sm text-green-600 mt-1">↗ +2.1% from last month</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {["overview", "revenue", "services", "customers", "reviews"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                    selectedTab === tab
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {selectedTab === "overview" && (
              <div className="space-y-8">
                {/* Revenue Chart */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Revenue Trend</h3>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-end justify-between h-64 gap-2">
                      {revenueChart.map((data, index) => {
                        const maxRevenue = Math.max(...revenueChart.map(d => d.revenue));
                        const height = (data.revenue / maxRevenue) * 100;
                        
                        return (
                          <div key={index} className="flex flex-col items-center flex-1">
                            <div className="text-xs text-gray-600 mb-1">{formatCurrency(data.revenue)}</div>
                            <div 
                              className="bg-blue-500 w-full rounded-t"
                              style={{ height: `${height}%` }}
                            ></div>
                            <div className="text-xs font-medium text-gray-700 mt-2">{data.month}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Response Rate</h4>
                    <div className="text-2xl font-bold text-green-600">{overview.responseRate}%</div>
                    <p className="text-sm text-gray-600">Average response time: 2.5 hours</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Repeat Customers</h4>
                    <div className="text-2xl font-bold text-blue-600">{overview.repeatCustomers}%</div>
                    <p className="text-sm text-gray-600">Customer retention is excellent</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Avg. Session Value</h4>
                    <div className="text-2xl font-bold text-purple-600">{formatCurrency(customerInsights.averageSessionValue)}</div>
                    <p className="text-sm text-gray-600">Per booking average</p>
                  </div>
                </div>
              </div>
            )}

            {/* Revenue Tab */}
            {selectedTab === "revenue" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Monthly Breakdown</h3>
                    <div className="space-y-3">
                      {revenueChart.slice(-6).map((data, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="font-medium">{data.month} 2025</span>
                          <div className="text-right">
                            <div className="font-bold text-gray-900">{formatCurrency(data.revenue)}</div>
                            <div className="text-sm text-gray-600">{data.bookings} bookings</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Revenue by Service</h3>
                    <div className="space-y-3">
                      {topServices.slice(0, 5).map((service, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="font-medium">{service.name}</span>
                          <div className="text-right">
                            <div className="font-bold text-gray-900">{formatCurrency(service.revenue)}</div>
                            <div className="text-sm text-gray-600">{service.bookings} bookings</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Services Tab */}
            {selectedTab === "services" && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Top Performing Services</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Service</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Bookings</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Revenue</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Rating</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Avg. Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topServices.map((service, index) => (
                        <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium">{service.name}</td>
                          <td className="py-3 px-4">{service.bookings}</td>
                          <td className="py-3 px-4 font-medium">{formatCurrency(service.revenue)}</td>
                          <td className="py-3 px-4">
                            <span className="text-yellow-500">⭐ {service.rating}</span>
                          </td>
                          <td className="py-3 px-4">{formatCurrency(service.revenue / service.bookings)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Customers Tab */}
            {selectedTab === "customers" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Customer Acquisition</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                        <div>
                          <div className="font-semibold text-green-800">New Customers</div>
                          <div className="text-sm text-green-600">This month</div>
                        </div>
                        <div className="text-2xl font-bold text-green-800">{customerInsights.newCustomers}</div>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                        <div>
                          <div className="font-semibold text-blue-800">Returning Customers</div>
                          <div className="text-sm text-blue-600">This month</div>
                        </div>
                        <div className="text-2xl font-bold text-blue-800">{customerInsights.returningCustomers}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Booking Insights</h3>
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="font-semibold text-gray-800">Most Popular Day</div>
                        <div className="text-lg text-blue-600">{customerInsights.bookingTrends.mostPopularDay}</div>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="font-semibold text-gray-800">Peak Hours</div>
                        <div className="text-lg text-blue-600">{customerInsights.bookingTrends.mostPopularTime}</div>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="font-semibold text-gray-800">Advance Booking</div>
                        <div className="text-lg text-blue-600">{customerInsights.bookingTrends.averageAdvanceBooking} days avg</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Reviews Tab */}
            {selectedTab === "reviews" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Recent Reviews</h3>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-yellow-600">{overview.averageRating}/5.0</div>
                    <div className="text-sm text-gray-600">Average rating</div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {recentReviews.map((review) => (
                    <div key={review.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="font-medium text-gray-900">{review.customer}</div>
                          <div className="text-sm text-gray-600">{review.service}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-yellow-500">{'★'.repeat(review.rating)}{'☆'.repeat(5-review.rating)}</div>
                          <div className="text-sm text-gray-500">{review.date}</div>
                        </div>
                      </div>
                      <p className="text-gray-700 italic">"{review.comment}"</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
