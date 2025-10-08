'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Building2, 
  Star, 
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  PieChart,
  Activity,
  Loader2
} from 'lucide-react';
import { adminApi } from '../../../lib/adminApi';

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [pendingApprovals, setPendingApprovals] = useState<any[]>([]);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [selectedTab, setSelectedTab] = useState(0);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [statsData, chartsData, recentActivity] = await Promise.all([
        adminApi.getDashboardStats(),
        adminApi.getDashboardCharts(),
        adminApi.getRecentActivity()
      ]);

      // Calculate growth percentages
      const userGrowth = statsData.totalUsers > 0 ? 
        ((statsData.newUsersThisMonth / statsData.totalUsers) * 100) : 0;
      const providerGrowth = statsData.totalProviders > 0 ? 
        ((statsData.newProvidersThisMonth / statsData.totalProviders) * 100) : 0;

      setStats({
        totalUsers: statsData.totalUsers || 0,
        totalProviders: statsData.totalProviders || 0,
        totalBookings: statsData.totalBookings || 0,
        totalRevenue: statsData.totalRevenue || 0,
        monthlyGrowth: {
          users: parseFloat(userGrowth.toFixed(1)),
          providers: parseFloat(providerGrowth.toFixed(1)),
          bookings: 15.2, // This would come from charts data analysis
          revenue: 23.4   // This would come from charts data analysis
        }
      });

      // Set recent bookings from API
      setRecentBookings(recentActivity.recentBookings || []);
      
      // Get pending approvals (providers needing verification)
      const providersData = await adminApi.getProviders({ 
        page: 1, 
        limit: 10, 
        verified: false 
      });
      setPendingApprovals(providersData.data || []);
      
      setDashboardData({ charts: chartsData, activity: recentActivity });
      
    } catch (error: any) {
      console.error('Failed to load dashboard data:', error);
      setError(error.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveProvider = async (providerId: string) => {
    try {
      await adminApi.verifyProvider(providerId, true);
      // Refresh data
      loadDashboardData();
    } catch (error) {
      console.error('Failed to approve provider:', error);
    }
  };

  const handleRejectProvider = async (providerId: string) => {
    try {
      await adminApi.updateProviderStatus(providerId, 'rejected');
      // Refresh data
      loadDashboardData();
    } catch (error) {
      console.error('Failed to reject provider:', error);
    }
  };

  // Quick Actions handlers
  const handleAddNewUser = () => {
    router.push('/admin/users');
  };

  const handleQuickApproveProvider = () => {
    router.push('/admin/providers');
  };

  const handleViewAnalytics = () => {
    router.push('/admin/analytics');
  };

  const handleSystemAlerts = () => {
    router.push('/admin/alerts');
  };

  const StatCard = ({ title, value, change, icon: Icon, prefix = '', suffix = '' }: {
    title: string;
    value: number;
    change: number;
    icon: any;
    prefix?: string;
    suffix?: string;
  }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">
            {prefix}{loading ? '...' : value.toLocaleString()}{suffix}
          </p>
        </div>
        <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
          <Icon className="h-6 w-6 text-blue-600" />
        </div>
      </div>
      <div className="flex items-center mt-4">
        {change > 0 ? (
          <ArrowUpRight className="h-4 w-4 text-green-500" />
        ) : (
          <ArrowDownRight className="h-4 w-4 text-red-500" />
        )}
        <span className={`text-sm font-medium ml-1 ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
          {Math.abs(change)}%
        </span>
        <span className="text-sm text-gray-500 ml-1">from last month</span>
      </div>
    </div>
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading dashboard data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load dashboard</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={loadDashboardData}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="w-[95%] mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your platform today.</p>
        </div>
        <button
          onClick={loadDashboardData}
          disabled={loading}
          className="flex items-center px-4 cursor-pointer py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Activity className="h-4 w-4 mr-2" />
          Refresh
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          change={stats.monthlyGrowth.users}
          icon={Users}
        />
        <StatCard
          title="Active Providers"
          value={stats.totalProviders}
          change={stats.monthlyGrowth.providers}
          icon={Building2}
        />
        <StatCard
          title="Total Bookings"
          value={stats.totalBookings}
          change={stats.monthlyGrowth.bookings}
          icon={Calendar}
        />
        <StatCard
          title="Total Revenue"
          value={stats.totalRevenue}
          change={stats.monthlyGrowth.revenue}
          icon={DollarSign}
          prefix="$"
        />
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <h3 className="text-lg font-semibold text-gray-900">Revenue Overview</h3>
            <div className="flex items-center space-x-2">
              {['30 Days', '90 Days', '1 Year'].map((label, idx) => (
              <button
                key={label}
                className={`px-3 py-1 text-sm cursor-pointer font-medium rounded-md ${
                idx === selectedTab
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:bg-gray-50'
                }`}
                onClick={() => setSelectedTab(idx)}
              >
                {label}
              </button>
              ))}
            </div>
          </div>
          
          {/* Simple Chart Mockup */}
          <div className="h-64 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg flex items-end justify-center p-4">
            <div className="flex items-end space-x-2 h-full w-full max-w-md gap-2">
              {[65, 85, 45, 75, 95, 55, 80, 90, 70, 100, 85, 75].map((height, index) => (
                <div
                  key={index}
                  className="flex-1 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-sm transition-all duration-300 hover:from-blue-700 hover:to-blue-500"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
          </div>
          
          <div className="mt-4 flex justify-center space-x-6 gap-2 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-600 rounded-full mr-2"></div>
              <span className="text-gray-600">Revenue</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-gray-600">Profit</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button 
              onClick={handleAddNewUser}
              className="w-full flex items-center justify-between mb-4 p-3 cursor-pointer bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <div className="flex items-center">
                <Users className="h-5 w-5 text-blue-600 mr-3" />
                <span className="font-medium text-blue-900">Add New User</span>
              </div>
              <ArrowUpRight className="h-4 w-4 text-blue-600" />
            </button>
            
            <button 
              onClick={handleQuickApproveProvider}
              className="w-full flex items-center justify-between mb-4 p-3 cursor-pointer bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
            >
              <div className="flex items-center">
                <Building2 className="h-5 w-5 text-green-600 mr-3" />
                <span className="font-medium text-green-900">Approve Provider</span>
              </div>
              <ArrowUpRight className="h-4 w-4 text-green-600" />
            </button>
            
            <button 
              onClick={handleViewAnalytics}
              className="w-full flex items-center justify-between mb-4 p-3 cursor-pointer bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
            >
              <div className="flex items-center">
                <BarChart3 className="h-5 w-5 text-purple-600 mr-3" />
                <span className="font-medium text-purple-900">View Analytics</span>
              </div>
              <ArrowUpRight className="h-4 w-4 text-purple-600" />
            </button>
            
            <button 
              onClick={handleSystemAlerts}
              className="w-full flex items-center justify-between mb-4 p-3 cursor-pointer bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
            >
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-orange-600 mr-3" />
                <span className="font-medium text-orange-900">System Alerts</span>
              </div>
              <span className="bg-orange-200 text-orange-800 text-xs px-2 py-1 rounded-full">3</span>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Bookings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Bookings</h3>
            <button className="text-sm cursor-pointer font-medium text-blue-600 hover:text-blue-700">
              View All
            </button>
          </div>
          
          <div className="space-y-4">
            {recentBookings.length > 0 ? (
              recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-900">
                        {booking.user?.firstName} {booking.user?.lastName}
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        ${booking.totalAmount || booking.amount || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        {booking.service?.name || booking.service} at {booking.provider?.businessName || booking.provider}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No recent bookings found</p>
              </div>
            )}
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Pending Approvals</h3>
            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
              {pendingApprovals.length}
            </span>
          </div>
          
          <div className="space-y-4">
            {pendingApprovals.length > 0 ? (
              pendingApprovals.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex-1">
                    <div className="flex items-center mb-1">
                      <AlertCircle className="h-4 w-4 text-yellow-600 mr-2" />
                      <span className="font-medium text-gray-900">{item.businessName || item.name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        {item.category || 'New Provider'} • {new Date(item.createdAt || item.date).toLocaleDateString()}
                      </span>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleApproveProvider(item.id)}
                          className="px-3 py-1 bg-green-600 text-white text-xs rounded-md hover:bg-green-700"
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => handleRejectProvider(item.id)}
                          className="px-3 py-1 bg-red-600 text-white text-xs rounded-md hover:bg-red-700"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No pending approvals</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}