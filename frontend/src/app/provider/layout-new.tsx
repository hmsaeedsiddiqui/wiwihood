"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import axios from 'axios';
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
  ChevronDown
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
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('providerToken') : null;
      
      if (!token) {
        router.push('/auth/provider/login');
        return;
      }

      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"}/auth/profile`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );

        if (response.data && response.data.role === 'provider') {
          setUser(response.data);
        } else {
          // User is not a provider, redirect to provider login
          localStorage.removeItem('providerToken');
          localStorage.removeItem('provider');
          router.push('/auth/provider/login');
        }
      } catch (error: any) {
        console.error('Provider auth check failed:', error);
        // Only redirect to login if it's an auth error (401/403), not server errors (500)
        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.removeItem('providerToken');
          localStorage.removeItem('provider');
          router.push('/auth/provider/login');
        } else {
          // For server errors, try to use cached user data
          const cachedProvider = localStorage.getItem('provider');
          if (cachedProvider) {
            try {
              setUser(JSON.parse(cachedProvider));
            } catch (e) {
              console.error('Failed to parse cached provider data');
            }
          }
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const navigationItems = [
    { name: 'Profile', href: '/provider/dashboard', icon: Home, current: pathname === '/provider/dashboard' },
    { name: 'Appointments', href: '/provider/appointments', icon: Calendar, current: pathname === '/provider/appointments' },
    { name: 'Wallet', href: '/provider/wallet', icon: DollarSign, current: pathname === '/provider/wallet' },
    { name: 'Favourites', href: '/provider/favorites', icon: Star, current: pathname === '/provider/favorites' },
    { name: 'Forms', href: '/provider/forms', icon: Package, current: pathname === '/provider/forms' },
    { name: 'Product orders', href: '/provider/orders', icon: Package, current: pathname === '/provider/orders' },
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
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:static lg:z-auto`}>
        
        {/* Logo/Brand */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <span className="ml-2 text-lg font-semibold text-gray-900">vivihood</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User Profile Section */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-orange-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-3 space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  item.current
                    ? 'bg-orange-50 text-orange-700 border-r-2 border-orange-500'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className={`mr-3 h-5 w-5 ${
                  item.current ? 'text-orange-500' : 'text-gray-400 group-hover:text-gray-500'
                }`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5 text-gray-400" />
            Sign out
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="bg-white shadow-sm border-b border-gray-200 lg:hidden">
          <div className="flex items-center justify-between h-16 px-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <span className="ml-2 text-lg font-semibold text-gray-900">vivihood</span>
            </div>
            <div className="w-10" /> {/* Spacer for alignment */}
          </div>
        </div>

        {/* Page content */}
        <main className="min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}