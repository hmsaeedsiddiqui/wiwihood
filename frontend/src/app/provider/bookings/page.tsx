"use client";
import React, { useState } from "react";
import Link from "next/link";
import ProviderNav from "@/components/ProviderNav";

// Mock data for provider bookings
const bookingsData = [
  {
    id: 1,
    customerName: "Emma Wilson",
    customerEmail: "emma@email.com",
    customerPhone: "+1 (555) 987-6543",
    service: "Deep Tissue Massage",
    date: "2025-08-29",
    time: "2:00 PM",
    duration: 60,
    price: 120,
    status: "confirmed",
    notes: "First time client, prefers firm pressure",
    bookingDate: "2025-08-25",
    paymentStatus: "paid"
  },
  {
    id: 2,
    customerName: "Michael Brown",
    customerEmail: "michael@email.com",
    customerPhone: "+1 (555) 456-7890",
    service: "Facial Treatment",
    date: "2025-08-29",
    time: "4:30 PM",
    duration: 90,
    price: 150,
    status: "pending",
    notes: "Sensitive skin, please use organic products",
    bookingDate: "2025-08-28",
    paymentStatus: "pending"
  },
  {
    id: 3,
    customerName: "Lisa Chen",
    customerEmail: "lisa@email.com",
    customerPhone: "+1 (555) 234-5678",
    service: "Swedish Massage",
    date: "2025-08-30",
    time: "10:00 AM",
    duration: 60,
    price: 100,
    status: "confirmed",
    notes: "Regular client, prefers light music",
    bookingDate: "2025-08-26",
    paymentStatus: "paid"
  },
  {
    id: 4,
    customerName: "David Lee",
    customerEmail: "david@email.com",
    customerPhone: "+1 (555) 345-6789",
    service: "Aromatherapy Session",
    date: "2025-08-28",
    time: "2:30 PM",
    duration: 75,
    price: 135,
    status: "completed",
    notes: "Lavender essential oil preferred",
    bookingDate: "2025-08-24",
    paymentStatus: "paid"
  },
  {
    id: 5,
    customerName: "Anna Taylor",
    customerEmail: "anna@email.com",
    customerPhone: "+1 (555) 567-8901",
    service: "Hot Stone Massage",
    date: "2025-08-31",
    time: "11:00 AM",
    duration: 90,
    price: 180,
    status: "confirmed",
    notes: "Celebrating anniversary, special attention please",
    bookingDate: "2025-08-27",
    paymentStatus: "paid"
  },
  {
    id: 6,
    customerName: "James Wilson",
    customerEmail: "james@email.com",
    customerPhone: "+1 (555) 678-9012",
    service: "Reflexology",
    date: "2025-08-27",
    time: "3:00 PM",
    duration: 60,
    price: 110,
    status: "cancelled",
    notes: "Client cancelled due to emergency",
    bookingDate: "2025-08-25",
    paymentStatus: "refunded"
  }
];

export default function ProviderBookings() {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "text-green-600 bg-green-100";
      case "pending": return "text-yellow-600 bg-yellow-100";
      case "completed": return "text-blue-600 bg-blue-100";
      case "cancelled": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid": return "text-green-600 bg-green-100";
      case "pending": return "text-yellow-600 bg-yellow-100";
      case "refunded": return "text-blue-600 bg-blue-100";
      case "failed": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const filteredBookings = bookingsData.filter(booking => {
    if (selectedFilter === "all") return true;
    return booking.status === selectedFilter;
  });

  const handleStatusChange = (bookingId: number, newStatus: string) => {
    // Handle status change logic here
    console.log(`Changing booking ${bookingId} status to ${newStatus}`);
  };

  const openDetailsModal = (booking: any) => {
    setSelectedBooking(booking);
    setShowDetailsModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ProviderNav />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Bookings Management</h1>
            <p className="text-gray-600">Manage your appointments and client bookings</p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <Link
              href="/provider/bookings/new"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              + Add Manual Booking
            </Link>
            <Link
              href="/provider/calendar"
              className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition"
            >
              📅 Calendar View
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{bookingsData.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {bookingsData.filter(b => b.status === "pending").length}
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Confirmed</p>
                <p className="text-2xl font-bold text-green-600">
                  {bookingsData.filter(b => b.status === "confirmed").length}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${bookingsData
                    .filter(b => b.date === "2025-08-29" && b.status !== "cancelled")
                    .reduce((sum, b) => sum + b.price, 0)}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {["all", "pending", "confirmed", "completed", "cancelled"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                    selectedFilter === filter
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {filter} ({filter === "all" ? bookingsData.length : bookingsData.filter(b => b.status === filter).length})
                </button>
              ))}
            </nav>
          </div>

          {/* Bookings List */}
          <div className="p-6">
            <div className="space-y-4">
              {filteredBookings.map((booking) => (
                <div key={booking.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{booking.customerName}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(booking.paymentStatus)}`}>
                          Payment: {booking.paymentStatus}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                        <div>
                          <p className="text-sm text-gray-600">Service</p>
                          <p className="font-medium">{booking.service}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Date & Time</p>
                          <p className="font-medium">{booking.date} at {booking.time}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Duration & Price</p>
                          <p className="font-medium">{booking.duration} min • ${booking.price}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div>
                          <p className="text-sm text-gray-600">Contact</p>
                          <p className="text-sm">{booking.customerEmail}</p>
                          <p className="text-sm">{booking.customerPhone}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Special Notes</p>
                          <p className="text-sm">{booking.notes}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 ml-6">
                      <button
                        onClick={() => openDetailsModal(booking)}
                        className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition text-sm"
                      >
                        View Details
                      </button>
                      
                      {booking.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleStatusChange(booking.id, "confirmed")}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleStatusChange(booking.id, "cancelled")}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition text-sm"
                          >
                            Decline
                          </button>
                        </>
                      )}
                      
                      {booking.status === "confirmed" && (
                        <button
                          onClick={() => handleStatusChange(booking.id, "completed")}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm"
                        >
                          Mark Complete
                        </button>
                      )}

                      {(booking.status === "confirmed" || booking.status === "pending") && (
                        <button
                          className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition text-sm"
                        >
                          Reschedule
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredBookings.length === 0 && (
              <div className="text-center py-12">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No bookings found</h3>
                <p className="text-gray-500">No bookings match the selected filter.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Booking Details Modal */}
      {showDetailsModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Booking Details</h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600">Customer Name</label>
                    <p className="font-medium">{selectedBooking.customerName}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Booking ID</label>
                    <p className="font-medium">#{selectedBooking.id}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600">Email</label>
                    <p className="font-medium">{selectedBooking.customerEmail}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Phone</label>
                    <p className="font-medium">{selectedBooking.customerPhone}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600">Service</label>
                    <p className="font-medium">{selectedBooking.service}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Duration</label>
                    <p className="font-medium">{selectedBooking.duration} minutes</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600">Date</label>
                    <p className="font-medium">{selectedBooking.date}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Time</label>
                    <p className="font-medium">{selectedBooking.time}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600">Price</label>
                    <p className="font-medium text-lg">${selectedBooking.price}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Booking Date</label>
                    <p className="font-medium">{selectedBooking.bookingDate}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600">Status</label>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedBooking.status)}`}>
                      {selectedBooking.status}
                    </span>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Payment Status</label>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(selectedBooking.paymentStatus)}`}>
                      {selectedBooking.paymentStatus}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-600">Special Notes</label>
                  <p className="font-medium">{selectedBooking.notes}</p>
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition"
                  >
                    Close
                  </button>
                  <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                    Contact Customer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
