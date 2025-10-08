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
  Loader2,
  ShieldAlert,
  Percent,
  Eye,
  CreditCard,
  Settings,
  FileText,
  MessageSquare,
  UserCheck,
  Ban,
  AlertTriangle,
  Target,
  Zap
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
  const [earningsData, setEarningsData] = useState<any>(null);
  const [disputes, setDisputes] = useState<any[]>([]);
  const [systemAlerts, setSystemAlerts] = useState<any[]>([]);

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
        pendingDisputes: 8, // Mock data - would come from API
        totalCommissions: 15420, // Mock data - would come from API
        listingFees: 3200, // Mock data - would come from API
        adRevenue: 8900, // Mock data - would come from API
        monthlyGrowth: {
          users: parseFloat(userGrowth.toFixed(1)),
          providers: parseFloat(providerGrowth.toFixed(1)),
          bookings: 15.2, // This would come from charts data analysis
          revenue: 23.4,   // This would come from charts data analysis
          commissions: 18.7,
          disputes: -12.5
        }
      });

      // Mock earnings data
      setEarningsData({
        commission: { amount: 15420, percentage: 8.5, growth: 18.7 },
        listingFees: { amount: 3200, percentage: 12, growth: 22.1 },
        adRevenue: { amount: 8900, percentage: 15, growth: 31.2 },
        subscriptions: { amount: 2800, percentage: 25, growth: 45.8 }
      });

      // Mock disputes data
      setDisputes([
        { id: 1, type: 'Payment Issue', customer: 'John Smith', provider: 'Beauty Salon XYZ', amount: 85, status: 'open', priority: 'high', createdAt: '2025-10-08' },
        { id: 2, type: 'Service Quality', customer: 'Sarah Johnson', provider: 'Spa Wellness', amount: 120, status: 'investigating', priority: 'medium', createdAt: '2025-10-07' },
        { id: 3, type: 'Cancellation', customer: 'Mike Brown', provider: 'Hair Studio', amount: 65, status: 'resolved', priority: 'low', createdAt: '2025-10-06' }
      ]);

      // Mock system alerts
      setSystemAlerts([
        { id: 1, type: 'security', message: 'Unusual login activity detected from 3 accounts', severity: 'high', timestamp: '2025-10-08T10:30:00Z' },
        { id: 2, type: 'performance', message: 'Database response time increased by 15%', severity: 'medium', timestamp: '2025-10-08T09:15:00Z' },
        { id: 3, type: 'business', message: '5 new providers pending verification', severity: 'low', timestamp: '2025-10-08T08:00:00Z' }
      ]);

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
  const handleManageUsers = () => {
    router.push('/admin/users');
  };

  const handleApproveProviders = () => {
    router.push('/admin/providers');
  };

  const handleViewAnalytics = () => {
    router.push('/admin/analytics');
  };

  const handleResolveDisputes = () => {
    router.push('/admin/disputes');
  };

  const handleViewEarnings = () => {
    router.push('/admin/earnings');
  };

  const handleSystemSettings = () => {
    router.push('/admin/settings');
  };

  const handleViewReports = () => {
    router.push('/admin/reports');
  };

  const handleSystemAlerts = () => {
    router.push('/admin/alerts');
  };

  const handleAddNewUser = () => {
    router.push('/admin/users/create');
  };

  const handleApproveBusinesses = () => {
    router.push('/admin/approvals');
  };

  const handleQuickApproveProvider = () => {
    router.push('/admin/providers/pending');
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
        <div className="w-12 h-12 bg-gradient-to-br from-orange-50 to-pink-50 rounded-lg flex items-center justify-center">
          <Icon className="h-6 w-6 text-orange-600" />
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
      case 'confirmed': return 'bg-green-100 text-green-800';
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
            <Loader2 className="h-8 w-8 animate-spin text-orange-600 mx-auto mb-4" />
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
              className="px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-600 text-white rounded-lg hover:from-orange-600 hover:to-pink-700 transition-all"
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
          className="flex items-center px-4 cursor-pointer py-2 bg-gradient-to-r from-orange-500 to-pink-600 text-white rounded-lg hover:from-orange-600 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <Activity className="h-4 w-4 mr-2" />
          Refresh
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6 mb-8">
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
          title="Platform Revenue"
          value={stats.totalRevenue}
          change={stats.monthlyGrowth.revenue}
          icon={DollarSign}
          prefix="$"
        />
        <StatCard
          title="Commissions Earned"
          value={stats.totalCommissions}
          change={stats.monthlyGrowth.commissions}
          icon={Percent}
          prefix="$"
        />
        <StatCard
          title="Ad Revenue"
          value={stats.adRevenue}
          change={15.3}
          icon={Target}
          prefix="$"
        />
        <StatCard
          title="Pending Disputes"
          value={stats.pendingDisputes}
          change={stats.monthlyGrowth.disputes}
          icon={ShieldAlert}
        />
      </div>

      {/* Platform Revenue Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        {earningsData && Object.entries(earningsData).map(([key, data]: [string, any]) => (
          <div key={key} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-medium text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}</h4>
              <span className={`text-xs px-2 py-1 rounded-full ${data.growth > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {data.growth > 0 ? '+' : ''}{data.growth}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-gray-900">${data.amount.toLocaleString()}</span>
              <span className="text-sm text-gray-500">{data.percentage}% fee</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Platform Analytics Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <h3 className="text-lg font-semibold text-gray-900">Platform Analytics</h3>
            <div className="flex items-center space-x-2">
              {['Revenue', 'Commissions', 'Users', 'Bookings'].map((label, idx) => (
              <button
                key={label}
                className={`px-3 py-1 text-sm cursor-pointer font-medium rounded-md ${
                idx === selectedTab
                  ? 'text-orange-600 bg-orange-50'
                  : 'text-gray-600 hover:bg-gray-50'
                }`}
                onClick={() => setSelectedTab(idx)}
              >
                {label}
              </button>
              ))}
            </div>
          </div>
          
          {/* Enhanced Chart Mockup */}
          <div className="h-64 bg-gradient-to-r from-orange-50 to-pink-50 rounded-lg flex items-end justify-center p-4">
            <div className="flex items-end space-x-1 h-full w-full max-w-lg">
              {[
                { commission: 65, ads: 45, listing: 30 },
                { commission: 85, ads: 60, listing: 40 },
                { commission: 45, ads: 35, listing: 25 },
                { commission: 75, ads: 55, listing: 35 },
                { commission: 95, ads: 70, listing: 50 },
                { commission: 55, ads: 40, listing: 30 },
                { commission: 80, ads: 65, listing: 45 },
                { commission: 90, ads: 75, listing: 55 },
                { commission: 70, ads: 50, listing: 35 },
                { commission: 100, ads: 80, listing: 60 },
                { commission: 85, ads: 65, listing: 45 },
                { commission: 75, ads: 55, listing: 40 }
              ].map((data, index) => (
                <div key={index} className="flex-1 flex flex-col items-end gap-1">
                  <div
                    className="w-full bg-gradient-to-t from-orange-600 to-orange-400 rounded-t-sm"
                    style={{ height: `${data.commission}%` }}
                  />
                  <div
                    className="w-full bg-gradient-to-t from-green-600 to-green-400 rounded-t-sm"
                    style={{ height: `${data.ads}%` }}
                  />
                  <div
                    className="w-full bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-sm"
                    style={{ height: `${data.listing}%` }}
                  />
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-4 flex justify-center space-x-6 gap-2 text-sm flex-wrap">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-orange-600 rounded-full mr-2"></div>
              <span className="text-gray-600">Commissions</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-600 rounded-full mr-2"></div>
              <span className="text-gray-600">Ad Revenue</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-purple-600 rounded-full mr-2"></div>
              <span className="text-gray-600">Listing Fees</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button 
              onClick={handleAddNewUser}
              className="w-full flex items-center justify-between mb-4 p-3 cursor-pointer bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
            >
              <div className="flex items-center">
                <Users className="h-5 w-5 text-orange-600 mr-3" />
                <span className="font-medium text-orange-900">Add New User</span>
              </div>
              <ArrowUpRight className="h-4 w-4 text-orange-600" />
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

      {/* Dispute Management & System Monitoring */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Active Disputes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Active Disputes</h3>
            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
              {disputes.length} pending
            </span>
          </div>
          
          <div className="space-y-4">
            {disputes.slice(0, 5).map((dispute, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    dispute.priority === 'high' ? 'bg-red-500' :
                    dispute.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`}></div>
                  <div>
                    <span className="text-sm text-gray-900 block">{dispute.type}</span>
                    <span className="text-xs text-gray-500">#{dispute.id}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-500 block">{dispute.time}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    dispute.priority === 'high' ? 'bg-red-100 text-red-800' :
                    dispute.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-green-100 text-green-800'
                  }`}>
                    {dispute.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          <button 
            onClick={handleResolveDisputes}
            className="w-full mt-4 px-4 py-2 text-sm text-white bg-gradient-to-r from-orange-500 to-pink-600 rounded-lg hover:from-orange-600 hover:to-pink-700 transition-all"
          >
            Manage All Disputes
          </button>
        </div>

        {/* System Alerts */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">System Alerts</h3>
          
          <div className="space-y-4">
            {systemAlerts.map((alert, index) => (
              <div key={index} className={`p-4 rounded-lg border-l-4 ${
                alert.type === 'error' ? 'bg-red-50 border-red-400' :
                alert.type === 'warning' ? 'bg-yellow-50 border-yellow-400' :
                'bg-orange-50 border-orange-400'
              }`}>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    {alert.type === 'error' ? (
                      <AlertTriangle className="h-5 w-5 text-red-400" />
                    ) : alert.type === 'warning' ? (
                      <AlertTriangle className="h-5 w-5 text-yellow-400" />
                    ) : (
                      <ShieldAlert className="h-5 w-5 text-orange-400" />
                    )}
                  </div>
                  <div className="ml-3">
                    <h4 className={`text-sm font-medium ${
                      alert.type === 'error' ? 'text-red-800' :
                      alert.type === 'warning' ? 'text-yellow-800' :
                      'text-orange-800'
                    }`}>
                      {alert.title}
                    </h4>
                    <p className={`mt-1 text-sm ${
                      alert.type === 'error' ? 'text-red-700' :
                      alert.type === 'warning' ? 'text-yellow-700' :
                      'text-orange-700'
                    }`}>
                      {alert.message}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Business Approvals */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Business Approvals</h3>
            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
              {pendingApprovals.length} pending
            </span>
          </div>
          
          <div className="space-y-4">
            {pendingApprovals.length > 0 ? (
              pendingApprovals.slice(0, 4).map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex-1">
                    <div className="flex items-center mb-1">
                      <UserCheck className="h-4 w-4 text-yellow-600 mr-2" />
                      <span className="font-medium text-gray-900 text-sm">{item.businessName || item.name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">
                        {item.category || 'New Provider'}
                      </span>
                      <div className="flex space-x-1">
                        <button 
                          onClick={() => handleApproveProvider(item.id)}
                          className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                        >
                          ✓
                        </button>
                        <button 
                          onClick={() => handleRejectProvider(item.id)}
                          className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                        >
                          ✗
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-sm">No pending approvals</p>
              </div>
            )}
          </div>
          
          <button 
            onClick={handleApproveBusinesses}
            className="w-full mt-4 px-4 py-2 text-sm text-orange-600 border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors"
          >
            View All Applications
          </button>
        </div>
      </div>
    </div>
  );
}