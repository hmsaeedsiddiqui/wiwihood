"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const customerNavItems = [
  { href: '/dashboard', label: 'Dashboard', icon: '🏠' },
  { href: '/bookings', label: 'Bookings', icon: '📅' },
  { href: '/favorites', label: 'Favorites', icon: '❤️' },
  { href: '/notifications', label: 'Notifications', icon: '🔔' },
  { href: '/profile', label: 'Profile', icon: '👤' },
  { href: '/billing', label: 'Billing', icon: '💳' },
  { href: '/help', label: 'Help', icon: '❓' },
  { href: '/settings', label: 'Settings', icon: '⚙️' },
];

interface CustomerNavProps {
  className?: string;
}

export default function CustomerNav({ className = '' }: CustomerNavProps) {
  const pathname = usePathname();

  return (
    <nav className={`bg-white border-b border-gray-200 sticky top-0 z-40 ${className}`}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <Link href="/" className="text-xl font-bold text-blue-600">
            Reservista
          </Link>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center space-x-1">
            {customerNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <span className="mr-1">{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <select
              value={pathname}
              onChange={(e) => window.location.href = e.target.value}
              className="text-sm border border-gray-300 rounded-md px-3 py-2"
            >
              {customerNavItems.map((item) => (
                <option key={item.href} value={item.href}>
                  {item.icon} {item.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </nav>
  );
}
