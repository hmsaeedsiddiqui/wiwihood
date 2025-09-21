"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

interface Booking {
  id: string;
  serviceName: string;
  providerName: string;
  address: string;
  date: string;
  time: string;
  duration: string;
  price: string;
  status: string;
  paymentStatus: string;
  notes?: string;
  imageUrl?: string;
}

interface BookingSummary {
  total: number;
  upcoming: number;
  completed: number;
  cancelled: number;
  spent: number;
}

export default function CustomerBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [summary, setSummary] = useState<BookingSummary>({ total: 0, upcoming: 0, completed: 0, cancelled: 0, spent: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBookings();
  }, []);

  async function fetchBookings() {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get(`${API_BASE_URL}/bookings/customer`);
      const data = response.data.data || response.data;
      setBookings(data.bookings || []);
      setSummary(data.summary || { total: 0, upcoming: 0, completed: 0, cancelled: 0, spent: 0 });
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError("Failed to load bookings. Please try again.");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 950, margin: "40px auto", background: "#fff", borderRadius: 18, boxShadow: "0 8px 32px rgba(0,0,0,0.08)", padding: 32 }}>
      <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, color: "#111" }}>My Bookings</h2>
      <div style={{ color: '#6b7280', fontSize: 16, marginBottom: 24 }}>Manage your appointments and view booking history</div>
      
      {/* Summary Cards */}
      <div style={{ display: 'flex', gap: 18, marginBottom: 30 }}>
        <div style={{ flex: 1, background: '#f8fafc', borderRadius: 12, padding: 18, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 26 }}>📋</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 18 }}>{summary.total}</div>
            <div style={{ color: '#6b7280', fontSize: 14 }}>Total Bookings</div>
          </div>
        </div>
        <div style={{ flex: 1, background: '#f8fafc', borderRadius: 12, padding: 18, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 26 }}>⏰</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 18 }}>{summary.upcoming}</div>
            <div style={{ color: '#6b7280', fontSize: 14 }}>Upcoming</div>
          </div>
        </div>
        <div style={{ flex: 1, background: '#f8fafc', borderRadius: 12, padding: 18, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 26 }}>✅</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 18 }}>{summary.completed}</div>
            <div style={{ color: '#6b7280', fontSize: 14 }}>Completed</div>
          </div>
        </div>
        <div style={{ flex: 1, background: '#f8fafc', borderRadius: 12, padding: 18, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 26 }}>💰</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 18 }}>${summary.spent.toFixed(2)}</div>
            <div style={{ color: '#6b7280', fontSize: 14 }}>Total Spent</div>
          </div>
        </div>
      </div>

      {/* Booking Cards */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#6b7280' }}>Loading bookings...</div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#ef4444' }}>{error}</div>
      ) : bookings.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#6b7280' }}>No bookings found.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          {bookings.map((booking) => (
            <div key={booking.id} style={{ display: 'flex', background: '#f9fafb', borderRadius: 14, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
              <div style={{ minWidth: 110, maxWidth: 110, height: 110, background: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img 
                  src={booking.imageUrl || "https://via.placeholder.com/90x90?text=Service"} 
                  alt="Service" 
                  style={{ width: 90, height: 90, borderRadius: 10, objectFit: 'cover' }} 
                />
              </div>
              <div style={{ flex: 1, padding: 18, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontWeight: 700, fontSize: 18 }}>{booking.serviceName}</span>
                  <span style={{ 
                    fontSize: 13, 
                    fontWeight: 600, 
                    color: booking.status === 'confirmed' ? '#10b981' : booking.status === 'pending' ? '#f59e42' : '#ef4444',
                    background: booking.status === 'confirmed' ? '#d1fae5' : booking.status === 'pending' ? '#fef3c7' : '#fee2e2',
                    borderRadius: 6, 
                    padding: '2px 10px'
                  }}>
                    {booking.status}
                  </span>
                  <span style={{ 
                    fontSize: 13, 
                    fontWeight: 600, 
                    color: booking.paymentStatus === 'paid' ? '#10b981' : '#f59e42',
                    background: booking.paymentStatus === 'paid' ? '#d1fae5' : '#fef3c7',
                    borderRadius: 6, 
                    padding: '2px 10px'
                  }}>
                    {booking.paymentStatus}
                  </span>
                </div>
                <div style={{ fontWeight: 500, color: '#374151', fontSize: 15 }}>{booking.providerName}</div>
                <div style={{ color: '#6b7280', fontSize: 14 }}>{booking.address}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '6px 0' }}>
                  <span style={{ fontSize: 15 }}>📅 {booking.date} 🕐 {booking.time}</span>
                  <span style={{ fontSize: 15 }}>⏱️ {booking.duration}</span>
                  <span style={{ fontSize: 15 }}>💵 {booking.price}</span>
                </div>
                <div style={{ color: '#6b7280', fontSize: 14, marginBottom: 4 }}>
                  <strong>Notes:</strong> {booking.notes || "No notes"}
                </div>
                <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                  <button style={{ 
                    background: '#6366f1', 
                    color: '#fff', 
                    border: 'none', 
                    borderRadius: 6, 
                    padding: '7px 18px', 
                    fontWeight: 600, 
                    fontSize: 15, 
                    cursor: 'pointer' 
                  }}>
                    View Details
                  </button>
                  <button style={{ 
                    background: '#10b981', 
                    color: '#fff', 
                    border: 'none', 
                    borderRadius: 6, 
                    padding: '7px 18px', 
                    fontWeight: 600, 
                    fontSize: 15, 
                    cursor: 'pointer' 
                  }}>
                    Reschedule
                  </button>
                  <button style={{ 
                    background: '#ef4444', 
                    color: '#fff', 
                    border: 'none', 
                    borderRadius: 6, 
                    padding: '7px 18px', 
                    fontWeight: 600, 
                    fontSize: 15, 
                    cursor: 'pointer' 
                  }}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
