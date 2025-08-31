'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthStore } from '@/store/authStore'
import { useBookingStore } from '@/store/bookingStore'
import { 
  Calendar, 
  Clock, 
  User, 
  MapPin,
  Star,
  CheckCircle,
  XCircle,
  AlertCircle,
  CalendarDays,
  Filter,
  Search,
  Plus,
  Edit,
  Trash2,
  RefreshCw
} from 'lucide-react'

interface BookingCardProps {
  booking: any
  onCancel: (id: string) => void
  onReschedule: (booking: any) => void
}

const BookingCard = ({ booking, onCancel, onReschedule }: BookingCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      case 'in_progress':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />
      case 'pending':
        return <AlertCircle className="w-4 h-4" />
      case 'completed':
        return <CheckCircle className="w-4 h-4" />
      case 'cancelled':
        return <XCircle className="w-4 h-4" />
      case 'in_progress':
        return <RefreshCw className="w-4 h-4" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const canCancel = ['pending', 'confirmed'].includes(booking.status.toLowerCase())
  const canReschedule = ['pending', 'confirmed'].includes(booking.status.toLowerCase()) && 
                        new Date(booking.startTime) > new Date()

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">
                {booking.service.name}
              </h3>
              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                {getStatusIcon(booking.status)}
                {booking.status.replace('_', ' ').charAt(0).toUpperCase() + booking.status.replace('_', ' ').slice(1)}
              </span>
            </div>
            
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{booking.provider.businessName}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(booking.startTime)}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{formatTime(booking.startTime)} - {formatTime(booking.endTime)}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="font-medium">€{booking.totalPrice}</span>
                <span className="text-gray-400">• {booking.service.duration} min</span>
              </div>
            </div>

            {booking.notes && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>Notes:</strong> {booking.notes}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2 pt-4 border-t">
          {canReschedule && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onReschedule(booking)}
            >
              <Edit className="w-4 h-4 mr-2" />
              Reschedule
            </Button>
          )}
          
          {canCancel && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onCancel(booking.id)}
              className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          )}
          
          {booking.status.toLowerCase() === 'completed' && (
            <Button variant="outline" size="sm">
              <Star className="w-4 h-4 mr-2" />
              Leave Review
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default function BookingsPage() {
  const { user, isAuthenticated, token } = useAuthStore()
  const { 
    myBookings, 
    upcomingBookings, 
    isLoading,
    fetchMyBookings, 
    fetchUpcomingBookings,
    cancelBooking 
  } = useBookingStore()
  
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedBooking, setSelectedBooking] = useState<any>(null)
  const [showRescheduleModal, setShowRescheduleModal] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login')
      return
    }

    if (token) {
      fetchMyBookings(token)
      fetchUpcomingBookings(token)
    }
  }, [isAuthenticated, token, router, fetchMyBookings, fetchUpcomingBookings])

  const handleCancelBooking = async (bookingId: string) => {
    if (!token) return
    
    if (confirm('Are you sure you want to cancel this booking?')) {
      try {
        await cancelBooking(bookingId, token)
        alert('Booking cancelled successfully')
      } catch (error: any) {
        alert(error.message || 'Failed to cancel booking')
      }
    }
  }

  const handleRescheduleBooking = (booking: any) => {
    setSelectedBooking(booking)
    setShowRescheduleModal(true)
  }

  const filterBookings = (bookings: any[]) => {
    return bookings.filter(booking => {
      const matchesSearch = booking.service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           booking.provider.businessName.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === 'all' || booking.status.toLowerCase() === statusFilter
      return matchesSearch && matchesStatus
    })
  }

  const getBookingsToShow = () => {
    switch (activeTab) {
      case 'upcoming':
        return filterBookings(upcomingBookings)
      case 'completed':
        return filterBookings(myBookings.filter(b => b.status.toLowerCase() === 'completed'))
      case 'cancelled':
        return filterBookings(myBookings.filter(b => b.status.toLowerCase() === 'cancelled'))
      default:
        return filterBookings(myBookings)
    }
  }

  const bookingsToShow = getBookingsToShow()

  const tabs = [
    { id: 'all', name: 'All Bookings', count: myBookings.length },
    { id: 'upcoming', name: 'Upcoming', count: upcomingBookings.length },
    { id: 'completed', name: 'Completed', count: myBookings.filter(b => b.status.toLowerCase() === 'completed').length },
    { id: 'cancelled', name: 'Cancelled', count: myBookings.filter(b => b.status.toLowerCase() === 'cancelled').length }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              My Bookings
            </h1>
            <p className="text-gray-600">
              Manage your appointments and service bookings
            </p>
          </div>
          
          <Button 
            onClick={() => router.push('/services')}
            className="bg-blue-600 hover:bg-blue-700 mt-4 sm:mt-0"
          >
            <Plus className="w-4 h-4 mr-2" />
            Book New Service
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Bookings</p>
                  <p className="text-2xl font-bold text-gray-900">{myBookings.length}</p>
                </div>
                <CalendarDays className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Upcoming</p>
                  <p className="text-2xl font-bold text-green-600">{upcomingBookings.length}</p>
                </div>
                <Clock className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {myBookings.filter(b => b.status.toLowerCase() === 'completed').length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">This Month</p>
                  <p className="text-2xl font-bold text-purple-600">
                    €{myBookings
                      .filter(b => new Date(b.createdAt).getMonth() === new Date().getMonth())
                      .reduce((sum, b) => sum + b.totalPrice, 0)
                      .toFixed(2)}
                  </p>
                </div>
                <Star className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            {/* Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {tab.name}
                  <span className="ml-2 px-2 py-0.5 bg-gray-200 text-gray-700 rounded-full text-xs">
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search bookings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bookings List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading bookings...</span>
          </div>
        ) : bookingsToShow.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <CalendarDays className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {searchQuery || statusFilter !== 'all' ? 'No bookings found' : 'No bookings yet'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchQuery || statusFilter !== 'all' 
                    ? 'Try adjusting your search or filters'
                    : 'Start by booking your first service'
                  }
                </p>
                {!searchQuery && statusFilter === 'all' && (
                  <Button 
                    onClick={() => router.push('/services')}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Book Your First Service
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {bookingsToShow.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onCancel={handleCancelBooking}
                onReschedule={handleRescheduleBooking}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
