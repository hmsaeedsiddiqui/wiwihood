"use client";
import React, { useState } from 'react';
import Link from 'next/link';

const demoNotifications = [
  {
    id: 1,
    type: 'booking_confirmed',
    title: 'Booking Confirmed',
    message: 'Your appointment with Elite Hair Studio on Aug 28 at 2:00 PM has been confirmed.',
    timestamp: '2025-08-27 10:30 AM',
    read: false,
    icon: '✅'
  },
  {
    id: 2,
    type: 'reminder',
    title: 'Appointment Reminder',
    message: 'Reminder: You have an appointment with Zen Wellness Spa tomorrow at 4:00 PM.',
    timestamp: '2025-09-01 09:00 AM',
    read: false,
    icon: '⏰'
  },
  {
    id: 3,
    type: 'payment_success',
    title: 'Payment Processed',
    message: 'Payment of $90 for Massage Therapy has been successfully processed.',
    timestamp: '2025-08-25 03:15 PM',
    read: true,
    icon: '💳'
  },
  {
    id: 4,
    type: 'review_request',
    title: 'Leave a Review',
    message: 'How was your experience with Elite Hair Studio? Leave a review to help others.',
    timestamp: '2025-08-24 06:00 PM',
    read: true,
    icon: '⭐'
  },
  {
    id: 5,
    type: 'promotion',
    title: 'Special Offer',
    message: '20% off your next booking at Glow Studio. Valid until end of month!',
    timestamp: '2025-08-23 12:00 PM',
    read: true,
    icon: '🎉'
  },
  {
    id: 6,
    type: 'booking_cancelled',
    title: 'Booking Cancelled',
    message: 'Your appointment with Fresh Face Spa on Aug 26 has been cancelled by the provider.',
    timestamp: '2025-08-22 11:45 AM',
    read: true,
    icon: '❌'
  }
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(demoNotifications);
  const [filter, setFilter] = useState('all'); // all, unread, read

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread') return !notif.read;
    if (filter === 'read') return notif.read;
    return true;
  });

  const unreadCount = notifications.filter(notif => !notif.read).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
              <p className="text-gray-600 mt-2">
                Stay updated with your bookings and platform updates
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Mark All Read
              </button>
            )}
          </div>
          
          {/* Filter Tabs */}
          <div className="flex space-x-1 mt-6 bg-gray-200 rounded-lg p-1">
            {[
              { key: 'all', label: `All (${notifications.length})` },
              { key: 'unread', label: `Unread (${unreadCount})` },
              { key: 'read', label: `Read (${notifications.length - unreadCount})` }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                  filter === tab.key
                    ? 'bg-white text-blue-600 shadow'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No notifications found</p>
            </div>
          ) : (
            filteredNotifications.map(notification => (
              <div
                key={notification.id}
                className={`bg-white rounded-lg border p-6 transition hover:shadow-md ${
                  !notification.read ? 'border-l-4 border-l-blue-500' : ''
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className="text-2xl">{notification.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className={`font-semibold ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                        {notification.title}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">{notification.timestamp}</span>
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                          >
                            Mark Read
                          </button>
                        )}
                      </div>
                    </div>
                    <p className={`mt-1 ${!notification.read ? 'text-gray-700' : 'text-gray-600'}`}>
                      {notification.message}
                    </p>
                    
                    {/* Action buttons for specific notification types */}
                    {notification.type === 'review_request' && !notification.read && (
                      <div className="mt-3">
                        <Link href="/reviews" className="inline-block bg-yellow-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-600 transition">
                          Leave Review
                        </Link>
                      </div>
                    )}
                    
                    {notification.type === 'booking_confirmed' && (
                      <div className="mt-3">
                        <Link href="/bookings" className="inline-block bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition">
                          View Booking
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Back to Dashboard */}
        <div className="mt-8 text-center">
          <Link href="/dashboard" className="inline-block bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
