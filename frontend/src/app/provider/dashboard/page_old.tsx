"use client";
import React from "react";

export default function ProviderDashboard() {
  return (
    <div className="min-h-screen bg-white">
      {/* Top Navigation Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Left - Logo */}
          <div className="flex items-center">
            <h1 className="text-lg font-semibold text-gray-900">Reservista</h1>
          </div>

          {/* Center - Search Bar */}
          <div className="flex-1 max-w-lg mx-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
          </div>

          {/* Right - User Profile */}
          <div className="flex items-center space-x-4">
            {/* Notification Bell */}
            <button className="p-1 rounded-full text-gray-400 hover:text-gray-500">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-3-3V9a6 6 0 10-12 0v5l-3 3h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>

            {/* User Avatar and Dropdown */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">SJ</span>
              </div>
              <button className="flex items-center space-x-1 text-sm font-medium text-gray-700 hover:text-gray-900">
                <span>Sarah J.</span>
                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>
        <div className="flex items-center justify-between">
          {/* Left - Logo and Navigation */}
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">R</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">Reservista</span>
              <span className="text-sm text-blue-600">Provider</span>
            </div>
            
            <div className="flex items-center space-x-6">
              <a href="#" className="flex items-center space-x-2 text-blue-600 bg-blue-50 px-3 py-2 rounded-md">
                <span>🏠</span>
                <span className="text-sm font-medium">Dashboard</span>
              </a>
              <a href="#" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                <span>�</span>
                <span className="text-sm">Bookings</span>
              </a>
              <a href="#" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                <span>�️</span>
                <span className="text-sm">Services</span>
              </a>
              <a href="#" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                <span>�</span>
                <span className="text-sm">Calendar</span>
              </a>
              <a href="#" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                <span>�</span>
                <span className="text-sm">Analytics</span>
              </a>
              <a href="#" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                <span>👤</span>
                <span className="text-sm">Profile</span>
              </a>
            </div>
          </div>

          {/* Right - User Profile */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <span className="text-gray-600">🔔</span>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">SJ</span>
              </div>
              <span className="text-sm font-medium text-gray-900">Sarah J.</span>
              <span className="text-gray-400">▼</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-64 bg-white min-h-screen border-r border-gray-200">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Dashboard</h2>
            
            <nav className="space-y-2">
              <a href="#" className="flex items-center space-x-3 text-white bg-green-600 px-3 py-2 rounded-md">
                <span>📊</span>
                <span className="text-sm font-medium">Dashboard</span>
              </a>
              <a href="#" className="flex items-center space-x-3 text-gray-600 hover:text-gray-900 px-3 py-2">
                <span>👥</span>
                <span className="text-sm">My Peoples</span>
              </a>
              <a href="#" className="flex items-center space-x-3 text-gray-600 hover:text-gray-900 px-3 py-2">
                <span>📋</span>
                <span className="text-sm">Orders</span>
              </a>
              <a href="#" className="flex items-center space-x-3 text-gray-600 hover:text-gray-900 px-3 py-2">
                <span>�</span>
                <span className="text-sm">Bills</span>
              </a>
              <a href="#" className="flex items-center space-x-3 text-gray-600 hover:text-gray-900 px-3 py-2">
                <span>💬</span>
                <span className="text-sm">Messages</span>
              </a>
              <a href="#" className="flex items-center space-x-3 text-gray-600 hover:text-gray-900 px-3 py-2">
                <span>🔔</span>
                <span className="text-sm">Notifications</span>
              </a>
              <a href="#" className="flex items-center space-x-3 text-gray-600 hover:text-gray-900 px-3 py-2">
                <span>💰</span>
                <span className="text-sm">Transactions</span>
              </a>
              <a href="#" className="flex items-center space-x-3 text-gray-600 hover:text-gray-900 px-3 py-2">
                <span>📊</span>
                <span className="text-sm">Reports</span>
              </a>
              <a href="#" className="flex items-center space-x-3 text-gray-600 hover:text-gray-900 px-3 py-2">
                <span>⚙️</span>
                <span className="text-sm">Settings</span>
              </a>
            </nav>
          </div>
        </div>

        {/* Main Dashboard Content */}
        <div className="flex-1 p-6 bg-gray-50">
          {/* Stats Cards - Top Row */}
          <div className="grid grid-cols-4 gap-6 mb-6">
            {/* Orders Active */}
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Orders Active</p>
                  <p className="text-xl font-bold text-gray-900">950</p>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-lg">✓</span>
                </div>
              </div>
            </div>

            {/* Pending */}
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Pending</p>
                  <p className="text-xl font-bold text-gray-900">150</p>
                </div>
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 text-lg">⏳</span>
                </div>
              </div>
            </div>

            {/* Completed */}
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Completed</p>
                  <p className="text-xl font-bold text-gray-900">9550</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-lg">✓</span>
                </div>
              </div>
            </div>

            {/* Cancelled */}
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Cancelled</p>
                  <p className="text-xl font-bold text-gray-900">15</p>
                </div>
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-600 text-lg">✗</span>
                </div>
              </div>
            </div>
          </div>

          {/* Revenue Cards - Second Row */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* Total Gross */}
            <div className="bg-green-50 rounded-lg p-6 border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Total Gross</p>
                <span className="text-green-600">▲</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-1">$12,254.47</p>
              <p className="text-sm text-green-600">+10% from last week</p>
            </div>

            {/* Net Volume */}
            <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Net Volume</p>
                <span className="text-purple-600">▲</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-1">$4,254.47</p>
              <p className="text-sm text-purple-600">-5% from last week</p>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-12 gap-6">
            {/* Sales Statistics Chart */}
            <div className="col-span-8 bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Sales Statistics</h3>
                <div className="flex items-center space-x-4">
                  <select className="text-sm border border-gray-300 rounded px-2 py-1">
                    <option>2022</option>
                  </select>
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
                      <span className="text-xs">Revenue</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-gray-400 rounded-full mr-1"></div>
                      <span className="text-xs">Net Volume</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between text-sm mb-4">
                <span className="text-gray-600">Revenue</span>
                <span className="text-gray-600">Net Volume</span>
              </div>
              <div className="flex justify-between text-sm font-medium mb-6">
                <span>$9,564.30</span>
                <span>$9,564.30</span>
              </div>

              {/* Chart Bars */}
              <div className="h-48 flex items-end justify-between">
                {[
                  { month: 'Jan', revenue: 60, volume: 45 },
                  { month: 'Feb', revenue: 35, volume: 25 },
                  { month: 'Mar', revenue: 25, volume: 20 },
                  { month: 'Apr', revenue: 80, volume: 60 },
                  { month: 'May', revenue: 90, volume: 70 },
                  { month: 'Jun', revenue: 65, volume: 50 },
                  { month: 'Jul', revenue: 75, volume: 55 },
                  { month: 'Aug', revenue: 70, volume: 50 },
                  { month: 'Sep', revenue: 85, volume: 65 },
                  { month: 'Oct', revenue: 95, volume: 75 },
                  { month: 'Nov', revenue: 80, volume: 60 },
                  { month: 'Dec', revenue: 90, volume: 70 }
                ].map((bar, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div className="flex items-end space-x-1 mb-2">
                      <div 
                        className="w-3 bg-green-500 rounded-t" 
                        style={{ height: `${bar.revenue * 2}px` }}
                      ></div>
                      <div 
                        className="w-3 bg-gray-400 rounded-t" 
                        style={{ height: `${bar.volume * 2}px` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500">{bar.month}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column */}
            <div className="col-span-4 space-y-6">
              {/* Recent Orders */}
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900">Recent Orders</h3>
                    <button className="text-blue-600 text-sm">View All</button>
                  </div>
                </div>
                <div className="divide-y divide-gray-200">
                  {[1,2,3,4].map((item) => (
                    <div key={item} className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-xs text-gray-900 mb-1">Full oil changing and servicing clien...</p>
                          <p className="text-xs text-gray-500 mb-2">Complete Order • 13 Dec 2020 • Direct Order</p>
                          <span className="inline-flex px-2 py-1 rounded text-xs bg-orange-100 text-orange-800">
                            New
                          </span>
                        </div>
                        <span className="text-xs font-medium">$5,800</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Notifications */}
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900">Recent Notifications</h3>
                    <button className="text-blue-600 text-sm">View All</button>
                  </div>
                </div>
                <div className="divide-y divide-gray-200">
                  {[
                    'Your Password Changed',
                    'Payment Settings Updated', 
                    'Your Password Changed',
                    'Payment Settings Updated'
                  ].map((notification, index) => (
                    <div key={index} className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{notification}</p>
                          <p className="text-xs text-gray-500">{index === 0 ? '2 min ago' : '1 day ago'}</p>
                        </div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}