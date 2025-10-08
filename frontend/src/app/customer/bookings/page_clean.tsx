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
  const [summary, setSummary] = useState<BookingSummary>({ 
    total: 0, 
    upcoming: 0, 
    completed: 0, 
    cancelled: 0, 
    spent: 0 
  });
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
      setSummary(data.summary || { 
        total: 0, 
        upcoming: 0, 
        completed: 0, 
        cancelled: 0, 
        spent: 0 
      });
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError("Failed to load bookings. Please try again.");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className=" min-h-screen flex items-center justify-center bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-extrabold mb-2 text-gray-900">
        My Bookings
      </h2>
      <div className="text-gray-500 text-base mb-6">
        Manage your appointments and view booking history
      </div>
      
      {/* Summary Cards */}
      <div className="flex flex-col  flex-wrap gap-4 mb-8">
        <div className="bg-slate-50 rounded-xl p-4 flex items-center gap-3 min-w-[200px]">
          <span className="text-2xl">📋</span>
          <div>
        <div className="font-bold text-lg">{summary.total}</div>
        <div className="text-gray-500 text-sm">Total Bookings</div>
          </div>
        </div>
        <div className="bg-slate-50 rounded-xl p-4 flex items-center gap-3 min-w-[200px]">
          <span className="text-2xl">⏰</span>
          <div>
        <div className="font-bold text-lg">{summary.upcoming}</div>
        <div className="text-gray-500 text-sm">Upcoming</div>
          </div>
        </div>
        <div className="bg-slate-50 rounded-xl p-4 flex items-center gap-3 min-w-[200px]">
          <span className="text-2xl">✅</span>
          <div>
        <div className="font-bold text-lg">{summary.completed}</div>
        <div className="text-gray-500 text-sm">Completed</div>
          </div>
        </div>
        <div className="bg-slate-50 rounded-xl p-4 flex items-center gap-3 min-w-[200px]">
          <span className="text-2xl">💰</span>
          <div>
        <div className="font-bold text-lg">
          ${summary.spent.toFixed(2)}
        </div>
        <div className="text-gray-500 text-sm">Total Spent</div>
          </div>
        </div>
      </div>

      {/* Booking Cards */}
      {loading ? (
        <div className="text-center py-10 text-gray-500">
          Loading bookings...
        </div>
      ) : error ? (
        <div className="text-center py-10 text-red-500">
          {error}
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          No bookings found.
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {bookings.map((booking) => (
            <div 
              key={booking.id} 
              className="flex bg-gray-50 rounded-2xl shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="min-w-[110px] max-w-[110px] h-[110px] bg-gray-200 flex items-center justify-center">
                <img 
                  src={booking.imageUrl || "https://via.placeholder.com/90x90?text=Service"} 
                  alt="Service" 
                  className="w-[90px] h-[90px] rounded-lg object-cover" 
                />
              </div>
              <div className="flex-1 p-4 flex flex-col gap-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-bold text-lg">
                    {booking.serviceName}
                  </span>
                  <span className={`text-xs font-semibold rounded-md px-2 py-1 ${
                    booking.status === 'confirmed' 
                      ? 'text-emerald-600 bg-emerald-100' 
                      : booking.status === 'pending' 
                      ? 'text-amber-600 bg-amber-100' 
                      : 'text-red-600 bg-red-100'
                  }`}>
                    {booking.status}
                  </span>
                  <span className={`text-xs font-semibold rounded-md px-2 py-1 ${
                    booking.paymentStatus === 'paid' 
                      ? 'text-emerald-600 bg-emerald-100' 
                      : 'text-amber-600 bg-amber-100'  
                  }`}>
                    {booking.paymentStatus}
                  </span>
                </div>
                <div className="font-medium text-gray-700 text-sm">
                  {booking.providerName}
                </div>
                <div className="text-gray-500 text-sm">
                  {booking.address}
                </div>
                <div className="flex items-center gap-4 my-2 flex-wrap text-sm">
                  <span>
                    📅 {booking.date} 🕐 {booking.time}
                  </span>
                  <span>
                    ⏱️ {booking.duration}
                  </span>
                  <span>
                    💵 {booking.price}
                  </span>
                </div>
                <div className="text-gray-500 text-sm mb-1">
                  <strong>Notes:</strong> {booking.notes || "No notes"}
                </div>
                <div className="flex gap-2 mt-1 flex-wrap">
                  <button className="bg-indigo-500 hover:bg-indigo-600 text-white border-none rounded-md px-4 py-2 font-semibold text-sm cursor-pointer transition-colors">
                    View Details
                  </button>
                  <button className="bg-emerald-500 hover:bg-emerald-600 text-white border-none rounded-md px-4 py-2 font-semibold text-sm cursor-pointer transition-colors">
                    Reschedule
                  </button>
                  <button className="bg-red-500 hover:bg-red-600 text-white border-none rounded-md px-4 py-2 font-semibold text-sm cursor-pointer transition-colors">
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