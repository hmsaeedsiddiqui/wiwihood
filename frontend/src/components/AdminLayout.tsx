'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Building2, 
  Tags, 
  FileText, 
  CreditCard, 
  Star, 
  HeadphonesIcon, 
  BarChart3, 
  Settings, 
  FileCheck,
  Menu,
  X,
  Bell,
  Search,
  User,
  ChevronDown,
  LogOut,
  Shield,
  MessageSquare
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const adminNavItems = [
  {
    label: 'Overview',
    items: [
      { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
      { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    ]
  },
  {
    label: 'Management',
    items: [
      { name: 'Users', href: '/admin/users', icon: Users },
      { name: 'Providers', href: '/admin/providers', icon: Building2 },
      { name: 'Bookings', href: '/admin/bookings', icon: Calendar },
      { name: 'Categories', href: '/admin/categories', icon: Tags },
    ]
  },
  {
    label: 'Content',
    items: [
      { name: 'CMS', href: '/admin/cms', icon: FileText },
      { name: 'Reviews', href: '/admin/reviews', icon: Star },
    ]
  },
  {
    label: 'Financial',
    items: [
      { name: 'Payments', href: '/admin/payments', icon: CreditCard },
      { name: 'Payouts', href: '/admin/payouts', icon: CreditCard },
    ]
  },
  {
    label: 'Support',
    items: [
      { name: 'Support Tickets', href: '/admin/support', icon: HeadphonesIcon },
      { name: 'System Logs', href: '/admin/logs', icon: FileCheck },
    ]
  },
  {
    label: 'System',
    items: [
      { name: 'Settings', href: '/admin/settings', icon: Settings },
    ]
  }
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [user, setUser] = useState({ name: 'Admin User', email: 'admin@reservista.com', role: 'Super Admin' });

  useEffect(() => {
    // Check admin authentication
    const checkAdminAuth = async () => {
      const adminToken = localStorage.getItem('adminToken');
      if (!adminToken) {
        router.push('/auth/admin/login');
        return;
      }

      try {
        // Verify the token with the backend
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/auth/profile`, {
          headers: { 
            'Authorization': `Bearer ${adminToken}`,
            'Content-Type': 'application/json'
          },
        });

        if (!response.ok) {
          throw new Error('Token verification failed');
        }

        const userData = await response.json();
        if (userData.role !== 'admin') {
          localStorage.removeItem('adminToken');
          localStorage.removeItem('admin');
          router.push('/auth/admin/login');
          return;
        }

        // Update user state with real data
        setUser({
          name: userData.name || 'Admin User',
          email: userData.email || 'admin@reservista.com',
          role: 'Admin'
        });

      } catch (error) {
        console.error('Auth verification failed:', error);
        localStorage.removeItem('adminToken');
        localStorage.removeItem('admin');
        router.push('/auth/admin/login');
      }
    };

    checkAdminAuth();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/auth/admin/login');
  };

  const isActive = (href: string) => pathname === href;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Reservista</h1>
              <p className="text-xs text-gray-500">Admin Panel</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded-md text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-6 overflow-y-auto">
          {adminNavItems.map((section, index) => (
            <div key={index}>
              <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {section.label}
              </h3>
              <div className="mt-2 space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        isActive(item.href)
                          ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <Icon className={`mr-3 h-5 w-5 transition-colors ${
                        isActive(item.href) ? 'text-blue-700' : 'text-gray-400 group-hover:text-gray-500'
                      }`} />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <Menu className="h-5 w-5" />
              </button>
              
              {/* Search bar */}
              <div className="hidden md:block">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search users, bookings, providers..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-80"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* User menu */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.role}</p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <div className="px-4 py-3 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <Link
                      href="/admin/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Admin Profile
                    </Link>
                    <Link
                      href="/admin/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      System Settings
                    </Link>
                    <hr className="my-1" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto">
          <div className="py-6">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}