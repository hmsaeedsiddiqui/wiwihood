"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import axios from 'axios';
import QRTIntegration from "@/utils/qrtIntegration";
import { 
  Calendar, 
  Settings, 
  User, 
  Package, 
  DollarSign, 
  Star, 
  Bell, 
  Menu, 
  X,
  Home,
  MessageSquare,
  HelpCircle,
  LogOut,
  LayoutDashboard,
  Scissors,
  Wallet,
  Clock,
  ChevronDown,
  Heart,
  FileText,
  ShoppingBag,
  Users
} from 'lucide-react';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  profilePicture?: string;
}

export default function ProviderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const router = useRouter();
  const pathname = usePathname();

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        console.log('🔔 Layout: Fetching notifications...');
        
        // Use QRT Integration for notifications
        const notificationsData = await QRTIntegration.getNotifications();
        
        // Add defensive programming to handle different data structures
        let notificationsArray = [];
        if (Array.isArray(notificationsData)) {
          notificationsArray = notificationsData;
        } else if (notificationsData && Array.isArray(notificationsData.data)) {
          notificationsArray = notificationsData.data;
        } else {
          console.warn('QRT: notificationsData is not an array, using fallback');
          notificationsArray = [];
        }
        
        setNotifications(notificationsArray);
        setUnreadCount(notificationsArray.filter((n: any) => !n.isRead).length);
        
        console.log('✅ Layout: Notifications loaded:', notificationsArray.length, 'total,', notificationsArray.filter((n: any) => !n.isRead).length, 'unread');
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };
    
    fetchNotifications();
    
    // Set up periodic refresh for notifications (every 30 seconds)
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // Close notification dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationOpen) {
        const target = event.target as Element;
        if (!target.closest('.notification-dropdown')) {
          setNotificationOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [notificationOpen]);

  useEffect(() => {
    const checkAuth = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('providerToken') : null;
      
      if (!token) {
        router.push('/auth/provider/login');
        return;
      }

      try {
        console.log('🚀 QRT: Checking auth...');
        console.log('🔑 Token available:', !!token);
        
        // Manual API test first
        if (token) {
          try {
            console.log('🔍 Testing direct API call...');
            const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/auth/profile`;
            console.log('🌐 API URL:', apiUrl);
            
            const directResponse = await axios.get(apiUrl, {
              headers: { Authorization: `Bearer ${token}` },
              withCredentials: true
            });
            console.log('✅ Direct API SUCCESS:', directResponse.data);
          } catch (directError: any) {
            console.log('❌ Direct API FAILED:', directError?.response?.status, directError?.response?.data, directError?.message);
          }
        }
        
        // Use QRT Integration for auth check
        const userData = await QRTIntegration.getAuthProfile();

        if (userData && userData.role === 'provider') {
          console.log('👤 Layout: Setting user data:', userData.firstName, userData.lastName, userData.email);
          setUser(userData);
          // Cache user data
          localStorage.setItem('provider', JSON.stringify(userData));
          console.log('✅ QRT: Auth check successful for user:', userData.firstName, userData.lastName);
        } else {
          // User is not a provider, redirect to provider login
          localStorage.removeItem('providerToken');
          localStorage.removeItem('provider');
          router.push('/auth/provider/login');
        }
      } catch (error: any) {
        console.error('Provider auth check failed:', error);
        
        // For any error, try to use cached user data
        const cachedProvider = localStorage.getItem('provider');
        if (cachedProvider) {
          try {
            const cachedUserData = JSON.parse(cachedProvider);
            setUser(cachedUserData);
            console.log('📋 QRT: Using cached provider data');
          } catch (e) {
            console.error('Failed to parse cached provider data');
            // If cached data is corrupted, redirect to login
            localStorage.removeItem('providerToken');
            localStorage.removeItem('provider');
            router.push('/auth/provider/login');
          }
        } else {
          // No cached data available, redirect to login
          localStorage.removeItem('providerToken');
          localStorage.removeItem('provider');
          router.push('/auth/provider/login');
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const navigationItems = [
    { name: 'Dashboard', href: '/provider/dashboard', icon: LayoutDashboard, current: pathname === '/provider/dashboard' },
    { name: 'Appointments', href: '/provider/appointments', icon: Calendar, current: pathname === '/provider/appointments' },
    { name: 'Services', href: '/provider/services', icon: Scissors, current: pathname === '/provider/services' },
    { name: 'Availability', href: '/provider/availability', icon: Clock, current: pathname === '/provider/availability' },
    { name: 'Staff', href: '/provider/staff', icon: Users, current: pathname === '/provider/staff' || pathname.startsWith('/provider/staff/') },
    { name: 'Wallet', href: '/provider/wallet', icon: Wallet, current: pathname === '/provider/wallet' },
    { name: 'Favorites', href: '/provider/favorites', icon: Heart, current: pathname === '/provider/favorites' },
    { name: 'Forms', href: '/provider/forms', icon: FileText, current: pathname === '/provider/forms' },
    { name: 'Product orders', href: '/provider/orders', icon: ShoppingBag, current: pathname === '/provider/orders' },
    { name: 'Settings', href: '/provider/settings', icon: Settings, current: pathname === '/provider/settings' },
  ];

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('providerToken');
      if (token) {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"}/auth/logout`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('providerToken');
      localStorage.removeItem('provider');
      // Keep providerWasRegistered flag so user sees login page next time
      router.push('/auth/provider/login');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-orange-500 to-pink-600 shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:relative lg:flex lg:flex-col ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        
        {/* Logo/Brand */}
        <div className="flex items-center justify-between h-16 px-6 bg-white/10 backdrop-blur-sm border-b border-white/20">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-sm">V</span>
            </div>
            <span className="ml-3 text-xl font-bold text-white">vivi<span className="text-yellow-300">hood</span></span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User Profile Section */}
        <div className="p-6 bg-white/10 backdrop-blur-sm border-b border-white/20">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center shadow-md">
              <User className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-semibold text-white">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-white/70 truncate max-w-[140px]">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-hidden">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  item.current
                    ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className={`mr-3 h-5 w-5 transition-colors ${
                  item.current ? 'text-white' : 'text-white/70 group-hover:text-white'
                }`} />
                <span className="truncate">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="p-4 border-t border-white/20 bg-white/5 backdrop-blur-sm">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 text-sm font-medium text-white/80 hover:bg-red-500/20 hover:text-white rounded-xl transition-all duration-200"
          >
            <LogOut className="mr-3 h-5 w-5 text-white/70 group-hover:text-white" />
            <span>Sign out</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Unified Header - Works for both mobile and desktop */}
        <div className="bg-gradient-to-r from-orange-500 to-pink-600 shadow-sm sticky top-0 z-30">
          <div className="flex items-center justify-between h-16 px-4 lg:px-6">
            {/* Left: Menu button (mobile) + Logo */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <Menu className="h-6 w-6" />
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center shadow-sm">
                  <span className="text-white font-bold text-sm">V</span>
                </div>
                <span className="text-lg lg:text-xl font-bold text-white">
                  vivi<span className="text-yellow-300">hood</span>
                </span>
              </div>
            </div>

            {/* Right: Notifications + Account */}
            <div className="flex items-center space-x-3 lg:space-x-4">
              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => setNotificationOpen(!notificationOpen)}
                  className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors relative"
                >
                  <Bell className="h-5 w-5 lg:h-6 lg:w-6" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>
                
                {/* Notification Dropdown */}
                {notificationOpen && (
                  <div className="notification-dropdown absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border z-50 max-h-96 overflow-y-auto">
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                      <p className="text-sm text-gray-500">{unreadCount} unread</p>
                    </div>
                    
                    <div className="divide-y divide-gray-200">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                          <Bell className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                          <p>No notifications yet</p>
                        </div>
                      ) : (
                        notifications.slice(0, 5).map((notification, index) => (
                          <div key={`unified-${index}`} className={`p-4 hover:bg-gray-50 cursor-pointer ${
                            !notification.isRead ? 'bg-orange-50 border-l-4 border-orange-500' : ''
                          }`}>
                            <div className="flex items-start space-x-3">
                              <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                                  <Bell className="h-4 w-4 text-orange-600" />
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900">
                                  {notification.title}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                  {new Date(notification.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    
                    <div className="p-4 border-t border-gray-200">
                      <Link
                        href="/provider/notifications"
                        className="w-full block text-center text-sm text-orange-600 hover:text-orange-700 font-medium"
                        onClick={() => setNotificationOpen(false)}
                      >
                        View all notifications
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Account Info */}
              <div className="flex items-center space-x-2 lg:space-x-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-white">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-white/70">{user.email}</p>
                </div>
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-white/20 rounded-full flex items-center justify-center shadow-md">
                  <User className="h-4 w-4 lg:h-5 lg:w-5 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {children}
        </main>
      </div>
    </div>
  );
}