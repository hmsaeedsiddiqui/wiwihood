"use client";
import React from "react";

// Dummy images for demonstration
const images = [
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&w=400&h=400&q=80",
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=400&h=400&q=80",
  "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=facearea&w=400&h=400&q=80"
];

const bookings = [
  {
    id: 1,
    service: "Hair Cut & Styling",
    provider: "Elite Hair Studio",
    address: "123 Beauty Street, Downtown",
    date: "28/08/2025",
    time: "2:00 PM",
    duration: "60 min",
    price: "$45.00",
    status: "confirmed",
    payment: "paid",
    notes: "Please use organic products if possible."
  },
  {
    id: 2,
    service: "Deep Cleaning",
    provider: "Sparkling Clean Co",
    address: "456 Service Ave, Uptown",
    date: "30/08/2025",
    time: "9:00 AM",
    duration: "120 min",
    price: "$120.00",
    status: "pending",
    payment: "pending",
    notes: "Please bring eco-friendly cleaning supplies."
  },
  {
    id: 3,
    service: "Massage Therapy",
    provider: "Wellness Spa",
    address: "789 Wellness Blvd, Spa District",
    date: "30/08/2025",
    time: "11:00 AM",
    duration: "90 min",
    price: "$45.00",
    status: "confirmed",
    payment: "paid",
    notes: "-"
  }
];

const summary = {
  total: 5,
  upcoming: 3,
  completed: 1,
  cancelled: 1,
  spent: 210
};

export default function CustomerBookingsPage() {
  return (
    <div style={{ maxWidth: 950, margin: "40px auto", background: "#fff", borderRadius: 18, boxShadow: "0 8px 32px rgba(0,0,0,0.08)", padding: 32 }}>
      <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, color: "#111" }}>My Bookings</h2>
      <div style={{ color: '#6b7280', fontSize: 16, marginBottom: 24 }}>Manage your appointments and view booking history</div>
      {/* Summary Row */}
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
        {bookings.map((b, i) => (
          <div key={b.id} style={{ display: 'flex', background: '#f9fafb', borderRadius: 14, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
            <div style={{ minWidth: 110, maxWidth: 110, height: 110, background: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src={images[i % images.length]} alt="Service" style={{ width: 90, height: 90, borderRadius: 10, objectFit: 'cover' }} />
            </div>
            <div style={{ flex: 1, padding: 18, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontWeight: 700, fontSize: 18 }}>{b.service}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: b.status === 'confirmed' ? '#10b981' : b.status === 'pending' ? '#f59e42' : '#ef4444', background: b.status === 'confirmed' ? '#d1fae5' : b.status === 'pending' ? '#fef3c7' : '#fee2e2', borderRadius: 6, padding: '2px 10px', marginLeft: 2 }}>{b.status}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: b.payment === 'paid' ? '#10b981' : '#f59e42', background: b.payment === 'paid' ? '#d1fae5' : '#fef3c7', borderRadius: 6, padding: '2px 10px', marginLeft: 2 }}>{b.payment}</span>
              </div>
              <div style={{ fontWeight: 500, color: '#374151', fontSize: 15 }}>{b.provider}</div>
              <div style={{ color: '#6b7280', fontSize: 14 }}>{b.address}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '6px 0' }}>
                <span style={{ fontSize: 15 }}><i className="fa-regular fa-calendar"></i> {b.date} <i className="fa-regular fa-clock" style={{ marginLeft: 6 }}></i> {b.time}</span>
                <span style={{ fontSize: 15 }}><i className="fa-regular fa-hourglass-half"></i> {b.duration}</span>
                <span style={{ fontSize: 15 }}><i className="fa-solid fa-coins"></i> {b.price}</span>
              </div>
              <div style={{ color: '#6b7280', fontSize: 14, marginBottom: 4 }}><b>Notes:</b> {b.notes}</div>
              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <button style={{ background: '#6366f1', color: '#fff', border: 'none', borderRadius: 6, padding: '7px 18px', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>View Details</button>
                <button style={{ background: '#10b981', color: '#fff', border: 'none', borderRadius: 6, padding: '7px 18px', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>Reschedule</button>
                <button style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: 6, padding: '7px 18px', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>Cancel</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
import React from "react";

// Mock data for demonstration
const bookings = [
  {
    id: 1,
    service: "Haircut",
    provider: "Salon Luxe",
    date: "2025-09-01 14:00",
    status: "Confirmed",
    canCancel: true,
    canReview: false
  },
  {
    id: 2,
    service: "Massage Therapy",
    provider: "Wellness Spa",
    date: "2025-08-25 10:30",
    status: "Completed",
    canCancel: false,
    canReview: true
  },
  {
    id: 3,
    service: "Facial",
    provider: "Glow Studio",
    date: "2025-08-20 16:00",
    status: "Cancelled",
    canCancel: false,
    canReview: false
  }
];

export default function CustomerBookingsPage() {
  return (
    <div style={{ maxWidth: 900, margin: "40px auto", background: "#fff", borderRadius: 16, boxShadow: "0 8px 32px rgba(0,0,0,0.08)", padding: 32 }}>
      <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 24, color: "#111" }}>My Bookings</h2>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 16 }}>
        <thead>
          <tr style={{ background: "#f3f4f6" }}>
            <th style={{ padding: "12px 8px", textAlign: "left", fontWeight: 700 }}>Service</th>
            <th style={{ padding: "12px 8px", textAlign: "left", fontWeight: 700 }}>Provider</th>
            <th style={{ padding: "12px 8px", textAlign: "left", fontWeight: 700 }}>Date/Time</th>
            <th style={{ padding: "12px 8px", textAlign: "left", fontWeight: 700 }}>Status</th>
            <th style={{ padding: "12px 8px", textAlign: "left", fontWeight: 700 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map(b => (
            <tr key={b.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
              <td style={{ padding: "10px 8px" }}>{b.service}</td>
              <td style={{ padding: "10px 8px" }}>{b.provider}</td>
              <td style={{ padding: "10px 8px" }}>{b.date}</td>
              <td style={{ padding: "10px 8px", color: b.status === "Cancelled" ? "#ef4444" : b.status === "Completed" ? "#10b981" : "#6366f1", fontWeight: 600 }}>{b.status}</td>
              <td style={{ padding: "10px 8px" }}>
                {b.canCancel && <button style={{ background: "#ef4444", color: "#fff", border: "none", borderRadius: 6, padding: "6px 14px", fontWeight: 600, marginRight: 8, cursor: "pointer" }}>Cancel</button>}
                {b.canReview && <button style={{ background: "#6366f1", color: "#fff", border: "none", borderRadius: 6, padding: "6px 14px", fontWeight: 600, marginRight: 8, cursor: "pointer" }}>Review</button>}
                <button style={{ background: "#10b981", color: "#fff", border: "none", borderRadius: 6, padding: "6px 14px", fontWeight: 600, cursor: "pointer" }}>Details</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
