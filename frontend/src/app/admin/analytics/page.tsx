'use client';

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Calendar, 
  DollarSign, 
  Building2,
  BarChart3,
  PieChart,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react';
import { adminApi } from '../../../lib/adminApi';

// Mock analytics data
const mockAnalytics = {
  overview: {
    totalRevenue: 284650,
    totalBookings: 8932,
    activeUsers: 15847,
    averageBookingValue: 125.50,
    conversionRate: 3.2,
    customerRetentionRate: 68.5
  },
  trends: {
    revenue: [
      { month: 'Jan', value: 18500 },
      { month: 'Feb', value: 22300 },
      { month: 'Mar', value: 19800 },
      { month: 'Apr', value: 25600 },
      { month: 'May', value: 28900 },
      { month: 'Jun', value: 32100 },
      { month: 'Jul', value: 29800 },
      { month: 'Aug', value: 35200 },
      { month: 'Sep', value: 31400 }
    ],
    bookings: [
      { month: 'Jan', value: 245 },
      { month: 'Feb', value: 298 },
      { month: 'Mar', value: 267 },
      { month: 'Apr', value: 334 },
      { month: 'May', value: 412 },
      { month: 'Jun', value: 389 },
      { month: 'Jul', value: 445 },
      { month: 'Aug', value: 523 },
      { month: 'Sep', value: 498 }
    ]
  },
  categoryBreakdown: [
    { name: 'Hair Services', value: 35, color: '#3B82F6' },
    { name: 'Spa & Wellness', value: 28, color: '#10B981' },
    { name: 'Beauty Treatments', value: 22, color: '#F59E0B' },
    { name: 'Fitness', value: 10, color: '#EF4444' },
    { name: 'Others', value: 5, color: '#8B5CF6' }
  ],
  topProviders: [
    { name: 'Elite Beauty Salon', bookings: 145, revenue: 18250, rating: 4.9 },
    { name: 'Zen Wellness Spa', bookings: 132, revenue: 21600, rating: 4.8 },
    { name: 'Urban Barber Co.', bookings: 118, revenue: 8850, rating: 4.7 },
    { name: 'Serenity Massage', bookings: 96, revenue: 15360, rating: 4.9 },
    { name: 'Fitness Plus Studio', bookings: 89, revenue: 6675, rating: 4.6 }
  ],
  recentActivity: [
    { type: 'booking', user: 'Sarah J.', provider: 'Elite Salon', amount: 120, time: '2 min ago' },
    { type: 'registration', user: 'Mike R.', provider: 'New Provider', amount: null, time: '5 min ago' },
    { type: 'payment', user: 'Emma W.', provider: 'Zen Spa', amount: 180, time: '8 min ago' },
    { type: 'review', user: 'David L.', provider: 'Urban Barber', amount: null, time: '12 min ago' },
    { type: 'cancellation', user: 'Lisa M.', provider: 'Fitness Plus', amount: 75, time: '15 min ago' }
  ]
};

export default function AdminAnalytics() {
  const [analytics, setAnalytics] = useState(mockAnalytics);
  const [dateRange, setDateRange] = useState('30d');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAnalytics();
  }, [dateRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getAnalytics({ granularity: dateRange });
      
      // Normalize analytics data to ensure all required properties exist
      const normalizedAnalytics = {
        overview: {
          totalRevenue: response?.overview?.totalRevenue || 0,
          totalBookings: response?.overview?.totalBookings || 0,
          activeUsers: response?.overview?.activeUsers || 0,
          averageBookingValue: response?.overview?.averageBookingValue || 0,
          conversionRate: response?.overview?.conversionRate || 0,
          customerRetentionRate: response?.overview?.customerRetentionRate || 0,
        },
        trends: {
          revenue: response?.trends?.revenue || [],
          bookings: response?.trends?.bookings || [],
        },
        categoryBreakdown: response?.categoryBreakdown || [],
        topProviders: response?.topProviders || [],
        recentActivity: response?.recentActivity || [],
        ...response
      };
      
      setAnalytics(normalizedAnalytics);
    } catch (error) {
      console.error('Failed to load analytics:', error);
      // Keep using mock data as fallback
      setAnalytics(mockAnalytics);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, change, icon: Icon, prefix = '', suffix = '', isPercentage = false }: any) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">
            {prefix}{loading ? '...' : (typeof value === 'number' ? value.toLocaleString() : value)}{suffix}
          </p>
        </div>
        <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
          <Icon className="h-6 w-6 text-blue-600" />
        </div>
      </div>
      {change !== undefined && (
        <div className="flex items-center mt-4">
          {change > 0 ? (
            <ArrowUpRight className="h-4 w-4 text-green-500" />
          ) : (
            <ArrowDownRight className="h-4 w-4 text-red-500" />
          )}
          <span className={`text-sm font-medium ml-1 ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {Math.abs(change)}%
          </span>
          <span className="text-sm text-gray-500 ml-1">from last period</span>
        </div>
      )}
    </div>
  );

  const SimpleChart = ({ data, color = '#3B82F6', height = 200 }: any) => (
    <div className={`flex items-end space-x-1 h-${height} p-4`}>
      {data.map((item: any, index: number) => (
        <div key={index} className="flex-1 flex flex-col items-center">
          <div
            className="w-full rounded-t-sm transition-all duration-300 hover:opacity-80 cursor-pointer"
            style={{ 
              height: `${(item.value / Math.max(...data.map((d: any) => d.value))) * 100}%`,
              backgroundColor: color,
              minHeight: '4px'
            }}
          />
          <span className="text-xs text-gray-500 mt-2">{item.month}</span>
        </div>
      ))}
    </div>
  );

  const PieChartMockup = ({ data }: any) => (
    <div className="flex items-center justify-center h-64">
      <div className="relative w-48 h-48">
        {/* Pie chart mockup with CSS */}
        <div className="w-full h-full rounded-full bg-gradient-to-r from-blue-400 via-green-400 via-yellow-400 via-red-400 to-purple-400"></div>
        <div className="absolute inset-8 bg-white rounded-full flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">100%</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
        </div>
      </div>
    </div>
  );

  const refreshData = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="w-[95%] mx-auto ">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics & Reports</h1>
            <p className="text-gray-600 mt-1">Comprehensive insights into your platform performance</p>
          </div>
          <div className="flex items-center space-x-3 gap-4 flex-wrap">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 cursor-pointer border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            <button 
              onClick={refreshData}
              disabled={loading}
              className="flex items-center cursor-pointer px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button className="flex items-center cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Revenue"
          value={analytics?.overview?.totalRevenue}
          change={23.4}
          icon={DollarSign}
          prefix="$"
        />
        <StatCard
          title="Total Bookings"
          value={analytics?.overview?.totalBookings}
          change={15.2}
          icon={Calendar}
        />
        <StatCard
          title="Active Users"
          value={analytics?.overview?.activeUsers || 0}
          change={12.5}
          icon={Users}
        />
        <StatCard
          title="Avg. Booking Value"
          value={analytics?.overview?.averageBookingValue || 0}
          change={8.7}
          icon={TrendingUp}
          prefix="$"
        />
        <StatCard
          title="Conversion Rate"
          value={analytics?.overview?.conversionRate || 0}
          change={-2.1}
          icon={Activity}
          suffix="%"
        />
        <StatCard
          title="Customer Retention"
          value={analytics?.overview?.customerRetentionRate || 0}
          change={5.3}
          icon={Users}
          suffix="%"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Revenue Trend */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-600 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Revenue</span>
              </div>
            </div>
          </div>
          <SimpleChart data={analytics?.trends?.revenue || []} color="#3B82F6" />
        </div>

        {/* Bookings Trend */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Bookings Trend</h3>
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-600 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Bookings</span>
              </div>
            </div>
          </div>
          <SimpleChart data={analytics?.trends?.bookings || []} color="#10B981" />
        </div>
      </div>

      {/* Category Breakdown and Top Providers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Service Categories */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Service Categories</h3>
          <PieChartMockup data={analytics?.categoryBreakdown || []} />
          <div className="mt-6 space-y-3">
            {(analytics?.categoryBreakdown || []).map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-3" 
                    style={{ backgroundColor: category.color }}
                  ></div>
                  <span className="text-sm text-gray-700">{category.name}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{category.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Providers */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Performing Providers</h3>
          <div className="space-y-4">
            {(analytics?.topProviders || []).map((provider, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <Building2 className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{provider?.name}</p>
                    <p className="text-sm text-gray-600">{provider?.bookings} bookings • ⭐ {provider.rating}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">${provider?.revenue?.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Revenue</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Real-time Activity</h3>
          <button className="text-sm cursor-pointer font-medium text-blue-600 hover:text-blue-700">
            View All Activity
          </button>
        </div>
        
        <div className="space-y-4">
          {(analytics?.recentActivity || []).map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-3 border-l-4 border-blue-200 bg-blue-50 rounded-r-lg">
              <div className="flex items-center ">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  {activity.type === 'booking' && <Calendar className="h-4 w-4 text-blue-600" />}
                  {activity.type === 'registration' && <Users className="h-4 w-4 text-green-600" />}
                  {activity.type === 'payment' && <DollarSign className="h-4 w-4 text-green-600" />}
                  {activity.type === 'review' && <Activity className="h-4 w-4 text-yellow-600" />}
                  {activity.type === 'cancellation' && <TrendingDown className="h-4 w-4 text-red-600" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {activity.user} {activity.type === 'booking' ? 'booked a service' : 
                                    activity.type === 'registration' ? 'registered as provider' :
                                    activity.type === 'payment' ? 'completed payment' :
                                    activity.type === 'review' ? 'left a review' :
                                    'cancelled booking'} 
                    {activity.provider && ` at ${activity.provider}`}
                  </p>
                  <p className="text-xs text-gray-600">{activity.time}</p>
                </div>
              </div>
              {activity.amount && (
                <span className="text-sm font-medium text-gray-900">
                  ${activity.amount}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}