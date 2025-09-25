'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getAuthHeaders } from '@/lib/auth'

interface Booking {
  id: string
  status: string
  startTime: string
  endTime: string
  notes?: string
  hasReview?: boolean
  service?: {
    name: string
  }
  provider?: {
    businessName: string
  }
}

export default function MyAppointmentsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [summary, setSummary] = useState({ total: 0, upcoming: 0, completed: 0, cancelled: 0 })

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true)
      try {
        const response = await fetch('http://localhost:8000/api/v1/bookings/my-bookings?page=1&limit=20', {
          headers: getAuthHeaders()
        })
        const data = await response.json()
        const items = data.data || data.bookings || []
        setBookings(items)
        
        // Calculate summary
        const total = items.length
        const upcoming = items.filter((b: Booking) => b.status === 'pending' || b.status === 'confirmed').length
        const completed = items.filter((b: Booking) => b.status === 'completed').length
        const cancelled = items.filter((b: Booking) => b.status === 'cancelled').length
        setSummary({ total, upcoming, completed, cancelled })
      } catch (err) {
        console.error('Failed to fetch bookings:', err)
        setBookings([])
        setSummary({ total: 0, upcoming: 0, completed: 0, cancelled: 0 })
      }
      setLoading(false)
    }
    fetchBookings()
  }, [])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return { text: 'Confirmed', className: 'bg-teal-100 text-teal-600' }
      case 'pending':
        return { text: 'Pending', className: 'bg-orange-100 text-orange-600' }
      case 'cancelled':
        return { text: 'Cancelled', className: 'bg-red-100 text-red-600' }
      case 'completed':
        return { text: 'Completed', className: 'bg-green-100 text-green-600' }
      default:
        return { text: status, className: 'bg-gray-100 text-gray-600' }
    }
  }

  const getNoteColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-orange-600'
      case 'cancelled':
        return 'text-red-600'
      default:
        return 'text-gray-700'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-[95%] max-w-[1400px] mx-auto py-8">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap mb-8">
          <div>
            <h1 className="sm:text-4xl text-3xl font-bold text-purple-900 mb-2">My Appointments</h1>
            <p className="text-gray-600 text-lg">Track and manage all you beauty & wellness appointments</p>
          </div>
          <button className="flex items-center gap-2 mt-2 text-gray-600 hover:text-gray-800">
            <span className="text-xl">👤</span>
            <span className="font-medium">Customer View</span>
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          <div className="bg-purple-100 rounded-2xl p-6 text-center">
            <div className="w-12 h-12 bg-purple-200 rounded-xl flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">📅</span>
            </div>
            <h3 className="font-bold text-gray-800 mb-1">Total Bookings</h3>
            <p className="text-3xl font-bold text-purple-800">{summary.total}</p>
          </div>
          
          <div className="bg-pink-100 rounded-2xl p-6 text-center">
            <div className="w-12 h-12 bg-pink-200 rounded-xl flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">⏰</span>
            </div>
            <h3 className="font-bold text-gray-800 mb-1">Upcoming</h3>
            <p className="text-3xl font-bold text-pink-800">{summary.upcoming}</p>
          </div>
          
          <div className="bg-teal-100 rounded-2xl p-6 text-center">
            <div className="w-12 h-12 bg-teal-200 rounded-xl flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">🛎️</span>
            </div>
            <h3 className="font-bold text-gray-800 mb-1">Completed</h3>
            <p className="text-3xl font-bold text-teal-800">{summary.completed}</p>
          </div>
          
          <div className="bg-red-100 rounded-2xl p-6 text-center">
            <div className="w-12 h-12 bg-red-200 rounded-xl flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">🎩</span>
            </div>
            <h3 className="font-bold text-gray-800 mb-1">Cancelled</h3>
            <p className="text-3xl font-bold text-red-800">{summary.cancelled}</p>
          </div>
        </div>

        {/* Recent Appointments */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔮</span>
              <h2 className="text-xl font-bold text-gray-900">Recent Appointments</h2>
            </div>
            {summary.upcoming > 0 && (
              <span className="text-teal-500 font-semibold">Confirmed</span>
            )}
          </div>

          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading appointments...</div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No appointments found.</div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => {
                const statusBadge = getStatusBadge(booking.status)
                const noteColor = getNoteColor(booking.status)
                
                return (
                  <div key={booking.id} className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-lg">👤</span>
                        <h3 className="font-bold text-gray-900 text-lg">
                          {booking.service?.name || 'Service'}
                        </h3>
                      </div>
                      
                      <p className="text-gray-600 mb-2 ml-8">
                        {booking.provider?.businessName || 'Provider'}
                      </p>
                      
                      <div className="flex items-center gap-2 text-gray-700 mb-2 ml-8">
                        <span className="text-gray-500">📅</span>
                        <span>
                          {booking.startTime ? 
                            new Date(booking.startTime).toLocaleDateString('en-US', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            }) : 'Date TBD'}
                        </span>
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span className="font-medium">
                          {booking.startTime ? 
                            new Date(booking.startTime).toLocaleTimeString('en-US', { 
                              hour: '2-digit', 
                              minute: '2-digit',
                              hour12: false 
                            }) : 'Time TBD'}
                        </span>
                      </div>
                      
                      {booking.notes && (
                        <div className={`text-sm ml-8 ${noteColor} flex items-center gap-1`}>
                          <span>✓</span>
                          <span>Note: {booking.notes}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col items-end gap-3">
                      <span className={`px-4 py-1 rounded-full text-sm font-semibold ${statusBadge.className}`}>
                        {statusBadge.text}
                      </span>
                      <div className="flex flex-col gap-2">
                        <button 
                          onClick={() => router.push(`/booking/${booking.id}`)}
                          className="bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold text-sm hover:bg-purple-700 transition"
                        >
                          View Details
                        </button>
                        {booking.status === 'completed' && (
                          <button 
                            onClick={() => router.push(`/booking/${booking.id}/review`)}
                            className={`px-6 py-2 rounded-lg font-semibold text-sm transition ${
                              booking.hasReview 
                                ? 'bg-green-600 text-white hover:bg-green-700'
                                : 'bg-yellow-500 text-white hover:bg-yellow-600'
                            }`}
                          >
                            {booking.hasReview ? '👁️ View Review' : '⭐ Write Review'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={() => router.push('/browse')}
            className="bg-green-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg hover:bg-green-700 transition flex items-center justify-center gap-2"
          >
            <span className="text-xl">+</span>
            New Service
          </button>
          <button 
            onClick={() => router.push('/profile')}
            className="bg-white text-purple-700 px-8 py-4 rounded-2xl font-bold text-lg border-2 border-purple-200 shadow-lg hover:bg-purple-50 transition flex items-center justify-center gap-2"
          >
            <span className="text-xl">👤</span>
            View Profile
          </button>
        </div>
      </div>
    </div>
  )
}