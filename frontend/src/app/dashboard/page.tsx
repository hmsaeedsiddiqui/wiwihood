'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { UserRole } from '@/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Calendar, 
  Users, 
  DollarSign, 
  Star, 
  Clock, 
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Plus,
  Eye,
  Edit,
  MoreHorizontal
} from 'lucide-react'

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuthStore()
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login')
      return
    }
    setLoading(false)
  }, [isAuthenticated, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Customer Dashboard
  if (user?.role === UserRole.CUSTOMER) {
    return <CustomerDashboard />
  }

  // Provider Dashboard
  if (user?.role === UserRole.PROVIDER) {
    return <ProviderDashboard />
  }

  // Admin Dashboard
  if (user?.role === UserRole.ADMIN) {
    return <AdminDashboard />
  }

  return null
}

function CustomerDashboard() {
  const { user } = useAuthStore()
  const router = useRouter()

  const stats = [
    { title: 'Total Bookings', value: '12', icon: Calendar, color: 'bg-blue-500' },
    { title: 'Upcoming', value: '3', icon: Clock, color: 'bg-green-500' },
    { title: 'Completed', value: '8', icon: CheckCircle, color: 'bg-purple-500' },
    { title: 'Total Spent', value: ',240', icon: DollarSign, color: 'bg-yellow-500' },
  ]

  const recentBookings = [
    {
      id: 1,
      service: 'Hair Cut & Styling',
      provider: 'Elite Hair Studio',
      date: '2025-08-28',
      time: '2:00 PM',
      status: 'confirmed',
      price: 45
    },
    {
      id: 2,
      service: 'Deep Cleaning',
      provider: 'Sparkling Clean Co',
      date: '2025-08-30',
      time: '9:00 AM',
      status: 'pending',
      price: 120
    },
    {
      id: 3,
      service: 'Massage Therapy',
      provider: 'Zen Wellness Spa',
      date: '2025-09-02',
      time: '4:00 PM',
      status: 'confirmed',
      price: 90
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your bookings and discover new services.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className={`${stat.color} p-3 rounded-lg mr-4`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Bookings */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Bookings</CardTitle>
                  <Button variant="outline" size="sm" onClick={() => router.push('/bookings')}>
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentBookings.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{booking.service}</h4>
                        <p className="text-sm text-gray-600">{booking.provider}</p>
                        <p className="text-sm text-gray-500">{booking.date} at {booking.time}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900"></p>
                        <span className="inline-block px-2 py-1 text-xs rounded-full">
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full" size="lg" onClick={() => router.push('/shop')}>
                  <Plus className="mr-2 h-4 w-4" />
                  Book New Service
                </Button>
                <Button variant="outline" className="w-full" onClick={() => router.push('/bookings')}>
                  <Calendar className="mr-2 h-4 w-4" />
                  View All Bookings
                </Button>
                <Button variant="outline" className="w-full" onClick={() => router.push('/favorites')}>
                  <Star className="mr-2 h-4 w-4" />
                  My Favorites
                </Button>
                <Button variant="outline" className="w-full" onClick={() => router.push('/notifications')}>
                  <AlertCircle className="mr-2 h-4 w-4" />
                  Notifications
                </Button>
              </CardContent>
            </Card>

            {/* Favorite Providers */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Favorite Providers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="font-medium text-blue-600">ES</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Elite Hair Studio</p>
                      <p className="text-sm text-gray-500">4.8 ★ (127 reviews)</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="font-medium text-green-600">SC</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Sparkling Clean Co</p>
                      <p className="text-sm text-gray-500">4.9 ★ (203 reviews)</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

function ProviderDashboard() {
  const { user } = useAuthStore()

  const stats = [
    { title: 'Total Bookings', value: '156', icon: Calendar, color: 'bg-blue-500' },
    { title: 'This Month', value: '23', icon: TrendingUp, color: 'bg-green-500' },
    { title: 'Revenue', value: ',240', icon: DollarSign, color: 'bg-purple-500' },
    { title: 'Rating', value: '4.8', icon: Star, color: 'bg-yellow-500' },
  ]

  const todayAppointments = [
    {
      id: 1,
      customer: 'Sarah Johnson',
      service: 'Premium Hair Cut',
      time: '10:00 AM',
      duration: 60,
      price: 45,
      status: 'confirmed'
    },
    {
      id: 2,
      customer: 'Mike Chen',
      service: 'Beard Trim',
      time: '2:00 PM',
      duration: 30,
      price: 25,
      status: 'pending'
    },
    {
      id: 3,
      customer: 'Emma Wilson',
      service: 'Hair Styling',
      time: '4:30 PM',
      duration: 45,
      price: 35,
      status: 'confirmed'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Provider Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your services, bookings, and business performance.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className={`${stat.color} p-3 rounded-lg mr-4`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Today's Appointments */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Today's Appointments</CardTitle>
                  <Button variant="outline" size="sm">
                    View Calendar
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {todayAppointments.map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{appointment.customer}</h4>
                        <p className="text-sm text-gray-600">{appointment.service}</p>
                        <p className="text-sm text-gray-500">{appointment.time} ({appointment.duration} min)</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900"></p>
                        <span className="inline-block px-2 py-1 text-xs rounded-full">
                          {appointment.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full" size="lg">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Service
                </Button>
                <Button variant="outline" className="w-full">
                  <Calendar className="mr-2 h-4 w-4" />
                  Manage Schedule
                </Button>
                <Button variant="outline" className="w-full">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              </CardContent>
            </Card>

            {/* Recent Reviews */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Recent Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-b border-gray-200 pb-3">
                    <div className="flex items-center space-x-1 mb-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600">"Excellent service and very professional!"</p>
                    <p className="text-xs text-gray-500 mt-1">- Sarah J.</p>
                  </div>
                  <div>
                    <div className="flex items-center space-x-1 mb-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600">"Great experience, will book again!"</p>
                    <p className="text-xs text-gray-500 mt-1">- Mike C.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

function AdminDashboard() {
  const stats = [
    { title: 'Total Users', value: '2,547', icon: Users, color: 'bg-blue-500' },
    { title: 'Active Providers', value: '342', icon: Users, color: 'bg-green-500' },
    { title: 'Total Bookings', value: '8,932', icon: Calendar, color: 'bg-purple-500' },
    { title: 'Platform Revenue', value: ',231', icon: DollarSign, color: 'bg-yellow-500' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Monitor platform performance and manage users.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className={`${stat.color} p-3 rounded-lg mr-4`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 mx-auto mb-4 text-blue-600" />
              <h3 className="font-semibold text-gray-900 mb-2">Manage Users</h3>
              <p className="text-sm text-gray-600">View and manage all platform users</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <CheckCircle className="h-8 w-8 mx-auto mb-4 text-green-600" />
              <h3 className="font-semibold text-gray-900 mb-2">Verify Providers</h3>
              <p className="text-sm text-gray-600">Review and verify new providers</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <AlertCircle className="h-8 w-8 mx-auto mb-4 text-yellow-600" />
              <h3 className="font-semibold text-gray-900 mb-2">Support Tickets</h3>
              <p className="text-sm text-gray-600">Handle customer support requests</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-8 w-8 mx-auto mb-4 text-purple-600" />
              <h3 className="font-semibold text-gray-900 mb-2">Analytics</h3>
              <p className="text-sm text-gray-600">View detailed platform analytics</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
