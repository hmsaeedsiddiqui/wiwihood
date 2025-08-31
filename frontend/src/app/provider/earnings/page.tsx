"use client";
import React, { useState } from "react";
import ProviderNav from "@/components/ProviderNav";

// Mock earnings data
const earningsData = {
  overview: {
    totalEarnings: 89650,
    monthlyEarnings: 12400,
    pendingPayouts: 2450,
    availableBalance: 1875,
    platformFee: 8.5, // percentage
    lastPayout: "2025-08-15",
    nextPayoutDate: "2025-08-30"
  },
  payoutHistory: [
    {
      id: 1,
      date: "2025-08-15",
      amount: 8750,
      status: "completed",
      method: "Bank Transfer",
      reference: "PAY-2025-08-15-001",
      grossAmount: 9568,
      platformFee: 818,
      processingFee: 0
    },
    {
      id: 2,
      date: "2025-07-31",
      amount: 7920,
      status: "completed",
      method: "Bank Transfer",
      reference: "PAY-2025-07-31-001",
      grossAmount: 8660,
      platformFee: 740,
      processingFee: 0
    },
    {
      id: 3,
      date: "2025-07-15",
      amount: 9150,
      status: "completed",
      method: "PayPal",
      reference: "PAY-2025-07-15-001",
      grossAmount: 10000,
      platformFee: 850,
      processingFee: 0
    },
    {
      id: 4,
      date: "2025-06-30",
      amount: 6840,
      status: "completed",
      method: "Bank Transfer",
      reference: "PAY-2025-06-30-001",
      grossAmount: 7500,
      platformFee: 660,
      processingFee: 0
    }
  ],
  recentTransactions: [
    {
      id: 1,
      date: "2025-08-29",
      customer: "Emma Wilson",
      service: "Deep Tissue Massage",
      grossAmount: 120,
      platformFee: 10.20,
      netAmount: 109.80,
      status: "completed"
    },
    {
      id: 2,
      date: "2025-08-29",
      customer: "Michael Brown",
      service: "Facial Treatment",
      grossAmount: 150,
      platformFee: 12.75,
      netAmount: 137.25,
      status: "pending"
    },
    {
      id: 3,
      date: "2025-08-28",
      customer: "Lisa Chen",
      service: "Swedish Massage",
      grossAmount: 100,
      platformFee: 8.50,
      netAmount: 91.50,
      status: "completed"
    },
    {
      id: 4,
      date: "2025-08-28",
      customer: "David Lee",
      service: "Aromatherapy Session",
      grossAmount: 135,
      platformFee: 11.48,
      netAmount: 123.52,
      status: "completed"
    }
  ],
  monthlyBreakdown: [
    { month: "Jan", gross: 9568, net: 8750, fee: 818 },
    { month: "Feb", gross: 10240, net: 9370, fee: 870 },
    { month: "Mar", gross: 11200, net: 10248, fee: 952 },
    { month: "Apr", gross: 12450, net: 11392, fee: 1058 },
    { month: "May", gross: 12800, net: 11712, fee: 1088 },
    { month: "Jun", gross: 13500, net: 12352, fee: 1148 },
    { month: "Jul", gross: 14200, net: 12993, fee: 1207 },
    { month: "Aug", gross: 12400, net: 11346, fee: 1054 }
  ]
};

export default function ProviderEarnings() {
  const [selectedTab, setSelectedTab] = useState("overview");
  const [selectedPayout, setSelectedPayout] = useState<any>(null);
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  const { overview, payoutHistory, recentTransactions, monthlyBreakdown } = earningsData;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "text-green-600 bg-green-100";
      case "pending": return "text-yellow-600 bg-yellow-100";
      case "processing": return "text-blue-600 bg-blue-100";
      case "failed": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const openPayoutModal = (payout: any) => {
    setSelectedPayout(payout);
    setShowPayoutModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ProviderNav />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Earnings & Payouts</h1>
            <p className="text-gray-600">Track your income and manage payouts</p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <button
              onClick={() => setShowWithdrawModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              💰 Request Withdrawal
            </button>
            <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition">
              📊 Export Report
            </button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Total Earnings</h3>
              <div className="bg-green-100 p-2 rounded-full">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">{formatCurrency(overview.totalEarnings)}</div>
            <p className="text-sm text-green-600 mt-1">All time</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">This Month</h3>
              <div className="bg-blue-100 p-2 rounded-full">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">{formatCurrency(overview.monthlyEarnings)}</div>
            <p className="text-sm text-blue-600 mt-1">↗ +8.3% from last month</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Pending Payouts</h3>
              <div className="bg-yellow-100 p-2 rounded-full">
                <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">{formatCurrency(overview.pendingPayouts)}</div>
            <p className="text-sm text-gray-600 mt-1">Next payout: {overview.nextPayoutDate}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Available Balance</h3>
              <div className="bg-purple-100 p-2 rounded-full">
                <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">{formatCurrency(overview.availableBalance)}</div>
            <p className="text-sm text-purple-600 mt-1">Ready to withdraw</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {["overview", "transactions", "payouts", "analytics"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                    selectedTab === tab
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {selectedTab === "overview" && (
              <div className="space-y-8">
                {/* Earnings Chart */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Monthly Earnings</h3>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-end justify-between h-64 gap-2">
                      {monthlyBreakdown.map((data, index) => {
                        const maxEarnings = Math.max(...monthlyBreakdown.map(d => d.net));
                        const height = (data.net / maxEarnings) * 100;
                        
                        return (
                          <div key={index} className="flex flex-col items-center flex-1">
                            <div className="text-xs text-gray-600 mb-1">{formatCurrency(data.net)}</div>
                            <div 
                              className="bg-green-500 w-full rounded-t"
                              style={{ height: `${height}%` }}
                            ></div>
                            <div className="text-xs font-medium text-gray-700 mt-2">{data.month}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Platform Fee</h4>
                    <div className="text-2xl font-bold text-gray-600">{overview.platformFee}%</div>
                    <p className="text-sm text-gray-600">Per transaction</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Last Payout</h4>
                    <div className="text-lg font-bold text-green-600">{overview.lastPayout}</div>
                    <p className="text-sm text-gray-600">Bank Transfer</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Payout Schedule</h4>
                    <div className="text-lg font-bold text-blue-600">Bi-weekly</div>
                    <p className="text-sm text-gray-600">Every 15th & last day</p>
                  </div>
                </div>
              </div>
            )}

            {/* Transactions Tab */}
            {selectedTab === "transactions" && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Recent Transactions</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Date</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Customer</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Service</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Gross</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Fee</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Net</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentTransactions.map((transaction) => (
                        <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4">{transaction.date}</td>
                          <td className="py-3 px-4 font-medium">{transaction.customer}</td>
                          <td className="py-3 px-4">{transaction.service}</td>
                          <td className="py-3 px-4">{formatCurrency(transaction.grossAmount)}</td>
                          <td className="py-3 px-4 text-red-600">-{formatCurrency(transaction.platformFee)}</td>
                          <td className="py-3 px-4 font-medium text-green-600">{formatCurrency(transaction.netAmount)}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                              {transaction.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Payouts Tab */}
            {selectedTab === "payouts" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Payout History</h3>
                  <button
                    onClick={() => setShowWithdrawModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    Request Withdrawal
                  </button>
                </div>

                <div className="space-y-4">
                  {payoutHistory.map((payout) => (
                    <div key={payout.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold text-lg">{formatCurrency(payout.amount)}</h4>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(payout.status)}`}>
                              {payout.status}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Date:</span>
                              <span className="font-medium ml-1">{payout.date}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Method:</span>
                              <span className="font-medium ml-1">{payout.method}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Reference:</span>
                              <span className="font-medium ml-1">{payout.reference}</span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => openPayoutModal(payout)}
                          className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition text-sm"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Analytics Tab */}
            {selectedTab === "analytics" && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Earnings Breakdown</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <span className="font-medium text-green-800">Gross Earnings</span>
                        <span className="font-bold text-green-800">{formatCurrency(overview.totalEarnings + (overview.totalEarnings * overview.platformFee / 100))}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                        <span className="font-medium text-red-800">Platform Fees</span>
                        <span className="font-bold text-red-800">-{formatCurrency(overview.totalEarnings * overview.platformFee / 100)}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <span className="font-medium text-blue-800">Net Earnings</span>
                        <span className="font-bold text-blue-800">{formatCurrency(overview.totalEarnings)}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
                    <div className="space-y-3">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="font-semibold text-gray-800">Average per Booking</div>
                        <div className="text-lg text-blue-600">{formatCurrency(142)}</div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="font-semibold text-gray-800">Monthly Growth</div>
                        <div className="text-lg text-green-600">+8.3%</div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="font-semibold text-gray-800">Revenue per Hour</div>
                        <div className="text-lg text-purple-600">{formatCurrency(85)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Payout Details Modal */}
      {showPayoutModal && selectedPayout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Payout Details</h2>
                <button
                  onClick={() => setShowPayoutModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600">Date</label>
                    <p className="font-medium">{selectedPayout.date}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Status</label>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedPayout.status)}`}>
                      {selectedPayout.status}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-600">Reference</label>
                  <p className="font-medium">{selectedPayout.reference}</p>
                </div>

                <div>
                  <label className="text-sm text-gray-600">Payment Method</label>
                  <p className="font-medium">{selectedPayout.method}</p>
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Gross Amount:</span>
                    <span className="font-medium">{formatCurrency(selectedPayout.grossAmount)}</span>
                  </div>
                  <div className="flex justify-between text-red-600">
                    <span>Platform Fee:</span>
                    <span className="font-medium">-{formatCurrency(selectedPayout.platformFee)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>Net Amount:</span>
                    <span>{formatCurrency(selectedPayout.amount)}</span>
                  </div>
                </div>

                <button
                  onClick={() => setShowPayoutModal(false)}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition mt-6"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Request Withdrawal</h2>
                <button
                  onClick={() => setShowWithdrawModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Available Balance</label>
                  <div className="text-2xl font-bold text-green-600">{formatCurrency(overview.availableBalance)}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Withdrawal Amount</label>
                  <input
                    type="number"
                    max={overview.availableBalance}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter amount"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                  <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option>Bank Transfer (Primary)</option>
                    <option>PayPal</option>
                  </select>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> Withdrawals are processed within 2-3 business days. 
                    A {overview.platformFee}% platform fee will be deducted.
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowWithdrawModal(false)}
                    className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    Request Withdrawal
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
