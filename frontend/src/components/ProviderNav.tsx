"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import axios from "axios";

const ProviderNav = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const navigationItems = [
    { name: "Dashboard", href: "/provider/dashboard", icon: "🏠" },
    { name: "Bookings", href: "/provider/bookings", icon: "📅" },
    { name: "Services", href: "/provider/services", icon: "🛍️" },
    { name: "Availability", href: "/provider/availability", icon: "🕒" },
    { name: "Calendar", href: "/provider/calendar", icon: "📆" },
    { name: "Analytics", href: "/provider/analytics", icon: "📊" },
    { name: "Profile", href: "/provider/profile", icon: "👤" },
    { name: "Earnings", href: "/provider/earnings", icon: "💰" },
    { name: "Reviews", href: "/provider/reviews", icon: "⭐" },
    { name: "Settings", href: "/provider/settings", icon: "⚙️" }
  ];

  const isActivePath = (href: string) => {
    return pathname === href || pathname?.startsWith(href + "/");
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/auth/logout`,
        {},
        { withCredentials: true }
      );
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      router.push("/");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className=" mx-auto w-[95%]">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link href="/provider/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">R</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Reservista</span>
              <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                Provider
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden xl:flex items-center space-x-8">
            <div className="flex items-center space-x-4">
              {navigationItems.slice(0, 6).map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActivePath(item.href)
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <span className="mr-1">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="relative p-2 text-gray-400 hover:text-gray-500">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-6h10v6z" />
                </svg>
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400"></span>
              </button>

              {/* Profile Dropdown */}
              <div className="relative">
                <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100">
                  <img
                    className="w-8 h-8 rounded-full object-cover"
                    src="/blog1.jpg"
                    alt="Provider"
                  />
                  <span className="text-sm font-medium text-gray-700">Sarah J.</span>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="xl:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="xl:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActivePath(item.href)
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.name}
              </Link>
            ))}
            
            {/* Mobile Profile Section */}
            <div className="border-t border-gray-200 pt-4 mt-4">
              <div className="flex items-center px-3 py-2">
                <img
                  className="w-10 h-10 rounded-full object-cover"
                  src="/blog1.jpg"
                  alt="Provider"
                />
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">Sarah Johnson</div>
                  <div className="text-sm text-gray-500">Elite Beauty Spa</div>
                </div>
              </div>
              <Link
                href="/provider/profile"
                className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
              >
                👤 View Profile
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:text-red-900 hover:bg-red-50 rounded-md"
              >
                🚪 Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default ProviderNav;
