'use client';

"use client";
import { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Star,
  CheckCircle,

import { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Star,
  CheckCircle,
"use client";
    bookingId: string;
    service: { name: string };
    provider: { businessName: string };
    startTime: string;
    endTime: string;
    totalPrice: number;
    status: string;
    notes?: string;
    hasReview?: boolean;
  };

  export default function BookingsPage() {
    const [bookings, setBookings] = useState<DemoBooking[]>([]);
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);
    const [filter, setFilter] = useState<"all" | "pending" | "confirmed" | "completed" | "cancelled">("all");

    useEffect(() => {
      setMounted(true);
      // Demo data for now
      setBookings([
        {
          id: 1,
          bookingId: "B001",
          service: { name: "Haircut" },
          provider: { businessName: "SalonX" },
          startTime: "2025-09-18T10:00:00",
          endTime: "2025-09-18T11:00:00",
          totalPrice: 30,
          status: "completed",
          notes: "Great service!",
          hasReview: true,
        },
        {
          id: 2,
          bookingId: "B002",
          service: { name: "Massage" },
          provider: { businessName: "Relax Spa" },
          startTime: "2025-09-20T14:00:00",
          endTime: "2025-09-20T15:00:00",
          totalPrice: 50,
          status: "confirmed",
        },
      ]);
      setLoading(false);
    }, []);

    const formatDate = (dateString: string) =>
      new Date(dateString).toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    const formatTime = (dateString: string) =>
      new Date(dateString).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    const getStatusIcon = (status: string) => {
      switch (status) {
        case "completed":
          return <CheckCircle className="h-5 w-5 text-green-500" />;
        case "confirmed":
          return <CheckCircle className="h-5 w-5 text-blue-500" />;
        case "pending":
          return <AlertCircle className="h-5 w-5 text-yellow-500" />;
        case "cancelled":
          return <XCircle className="h-5 w-5 text-red-500" />;
        default:
          return <Clock className="h-5 w-5 text-gray-500" />;
      }
    };
    const getStatusColor = (status: string) => {
      switch (status) {
        case "completed":
          return "bg-green-100 text-green-800";
        case "confirmed":
          return "bg-blue-100 text-blue-800";
        case "pending":
          return "bg-yellow-100 text-yellow-800";
        case "cancelled":
          return "bg-red-100 text-red-800";
        default:
          return "bg-gray-100 text-gray-800";
      }
    };
    const canWriteReview = (booking: DemoBooking) =>
      booking.status === "completed" && !booking.hasReview;
    const stats = [
      { label: "Total Bookings", value: bookings.length, color: "blue" },
      { label: "Completed", value: bookings.filter((b) => b.status === "completed").length, color: "green" },
      { label: "Upcoming", value: bookings.filter((b) => ["confirmed", "pending"].includes(b.status)).length, color: "yellow" },
      { label: "Need Review", value: bookings.filter((b) => canWriteReview(b)).length, color: "purple" },
    ];
    const filterTabs = [
      { key: "all", label: "All Bookings" },
      { key: "pending", label: "Pending" },
      { key: "confirmed", label: "Confirmed" },
      { key: "completed", label: "Completed" },
      { key: "cancelled", label: "Cancelled" },
    ];
    const filteredBookings =
      filter === "all"
        ? bookings
        : bookings.filter((booking) => booking.status === filter);

    if (loading || !mounted) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
            <p className="text-gray-600 mt-2">Manage your bookings and share your experiences</p>
          </div>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, idx) => (
              <div key={idx} className={`rounded-xl p-6 bg-${stat.color}-50 text-${stat.color}-800 shadow-sm flex flex-col items-center`}>
                <span className="text-2xl font-bold">{stat.value}</span>
                <span className="text-sm mt-2">{stat.label}</span>
              </div>
            ))}
          </div>
          {/* Filter Tabs */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8 px-6">
                {filterTabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setFilter(tab.key as any)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm focus:outline-none ${
                      filter === tab.key
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {tab.label}
                    {tab.key === "all" && (
                      <span className="ml-2 bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">
                        {bookings.length}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </div>
          {/* Bookings List */}
          <div className="space-y-4">
            {filteredBookings.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {filter === "all" ? "No bookings yet" : `No ${filter} bookings`}
                </h3>
                <p className="text-gray-600 mb-6">
                  {filter === "all"
                    ? "You haven't made any bookings yet. Start exploring services!"
                    : `You don't have any ${filter} bookings at the moment.`}
                </p>
                {filter === "all" && (
                  <Link
                    href="/services"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Browse Services
                  </Link>
                )}
              </div>
            ) : (
              filteredBookings.map((booking) => (
                <div key={booking.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Booking Header */}
                      <div className="flex items-center space-x-3 mb-4">
                        {getStatusIcon(booking.status)}
                        <div>
                          <div className="flex items-center space-x-3">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {booking.service.name}
                            </h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                              {booking.status.replace("_", " ").toUpperCase()}
                            </span>
                          </div>
                          <p className="text-gray-600">Booking #{booking.bookingId}</p>
                        </div>
                      </div>
                      {/* Booking Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div>
                          <div className="text-sm text-gray-600">Provider</div>
                          <div className="font-medium text-gray-900">{booking.provider.businessName}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Date</div>
                          <div className="font-medium text-gray-900">{formatDate(booking.startTime)}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Time</div>
                          <div className="font-medium text-gray-900">{formatTime(booking.startTime)} - {formatTime(booking.endTime)}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Total</div>
                          <div className="font-medium text-gray-900">${booking.totalPrice}</div>
                        </div>
                      </div>
                      {/* Action Buttons */}
                      <div className="flex items-center space-x-3">
                        <Link
                          href={`/booking/${booking.id}`}
                          className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Link>
                        {canWriteReview(booking) && (
                          <button
                            className="inline-flex items-center text-purple-600 hover:text-purple-700 text-sm font-medium"
                          >
                            <MessageCircle className="h-4 w-4 mr-1" />
                            Write Review
                          </button>
                        )}
                        {booking.hasReview && (
                          <Link
                            href={`/booking/${booking.id}/review`}
                            className="inline-flex items-center text-green-600 hover:text-green-700 text-sm font-medium"
                          >
                            <Star className="h-4 w-4 mr-1" />
                            View Review
                          </Link>
                        )}
                        {booking.status === "confirmed" && (
                          <Link
                            href={`/booking/${booking.id}/reschedule`}
                            className="inline-flex items-center text-orange-600 hover:text-orange-700 text-sm font-medium"
                          >
                            <RefreshCw className="h-4 w-4 mr-1" />
                            Reschedule
                          </Link>
                        )}
                      </div>
                    </div>
                    {/* Booking Menu */}
                    <div className="ml-4">
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreVertical className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  {/* Notes */}
                  {booking.notes && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="text-sm text-gray-600">Notes</div>
                      <div className="text-gray-900">{booking.notes}</div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }
                      <div>
                        <div className="text-sm text-gray-600">Provider</div>
                        <div className="font-medium text-gray-900">
                          {booking.provider.businessName}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Date</div>
                        <div className="font-medium text-gray-900">
                          {formatDate(booking.startTime)}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Time</div>
                        <div className="font-medium text-gray-900">
                          {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Total</div>
                        <div className="font-medium text-gray-900">
                          ${booking.totalPrice}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-3">
                      <Link
                        href={`/booking/${booking.id}`}
                        className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Link>

                      {canWriteReview(booking) && (
                        <button
                          onClick={() => setShowReviewModal({ show: true, booking })}
                          className="inline-flex items-center text-purple-600 hover:text-purple-700 text-sm font-medium"
                        >
                          <MessageCircle className="h-4 w-4 mr-1" />
                          Write Review
                        </button>
                      )}

                      {booking.hasReview && (
                        <Link
                          href={`/booking/${booking.id}/review`}
                          className="inline-flex items-center text-green-600 hover:text-green-700 text-sm font-medium"
                        >
                          <Star className="h-4 w-4 mr-1" />
                          View Review
                        </Link>
                      )}

                      {booking.status === 'confirmed' && (
                        <Link
                          href={`/booking/${booking.id}/reschedule`}
                          className="inline-flex items-center text-orange-600 hover:text-orange-700 text-sm font-medium"
                        >
                          <RefreshCw className="h-4 w-4 mr-1" />
                          Reschedule
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Booking Menu */}
                  <div className="ml-4">
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Notes */}
                {booking.notes && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="text-sm text-gray-600">Notes</div>
                    <div className="text-gray-900">{booking.notes}</div>
                  </div>
                )}

                {/* Review Prompt for Completed Bookings */}
                {canWriteReview(booking) && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-purple-900">
                            Share Your Experience
                          </h4>
                          <p className="text-sm text-purple-700 mt-1">
                            Help other customers by sharing your experience with {booking.provider.businessName}.
                          </p>
                        </div>
                        <button
                          onClick={() => setShowReviewModal({ show: true, booking })}
                          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                        >
                          Write Review
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal.show && showReviewModal.booking && (
        <ReviewModal
          isOpen={showReviewModal.show}
          onClose={() => setShowReviewModal({ show: false, booking: null })}
          bookingId={showReviewModal.booking.id}
          providerName={showReviewModal.booking.provider.businessName}
          serviceName={showReviewModal.booking.service.name}
          onReviewSubmitted={(review) => {
            // Update the booking in the list
            setBookings(prev => prev.map(b => 
              b.id === showReviewModal.booking?.id 
                ? { ...b, hasReview: true, review }
                : b
            ));
            setShowReviewModal({ show: false, booking: null });
          }}
        />
      )}
    </div>
  );
"use client";
