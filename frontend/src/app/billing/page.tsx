"use client";
import React, { useState } from 'react';
import Link from 'next/link';

const demoTransactions = [
  {
    id: 1,
    bookingId: 'BK-2025-001',
    service: 'Hair Cut & Styling',
    provider: 'Elite Hair Studio',
    date: '2025-08-28',
    amount: 45.00,
    status: 'completed',
    paymentMethod: 'Credit Card (**** 1234)',
    transactionId: 'TXN-001-2025'
  },
  {
    id: 2,
    bookingId: 'BK-2025-002',
    service: 'Massage Therapy',
    provider: 'Zen Wellness Spa',
    date: '2025-08-25',
    amount: 90.00,
    status: 'completed',
    paymentMethod: 'Credit Card (**** 1234)',
    transactionId: 'TXN-002-2025'
  },
  {
    id: 3,
    bookingId: 'BK-2025-003',
    service: 'Facial Treatment',
    provider: 'Glow Studio',
    date: '2025-08-20',
    amount: 75.00,
    status: 'refunded',
    paymentMethod: 'Credit Card (**** 1234)',
    transactionId: 'TXN-003-2025'
  },
  {
    id: 4,
    bookingId: 'BK-2025-004',
    service: 'Deep Cleaning',
    provider: 'Sparkling Clean Co',
    date: '2025-08-15',
    amount: 120.00,
    status: 'completed',
    paymentMethod: 'PayPal',
    transactionId: 'TXN-004-2025'
  },
  {
    id: 5,
    bookingId: 'BK-2025-005',
    service: 'Hair Styling',
    provider: 'Style Central',
    date: '2025-08-10',
    amount: 55.00,
    status: 'pending',
    paymentMethod: 'Credit Card (**** 1234)',
    transactionId: 'TXN-005-2025'
  }
];

const demoInvoices = [
  {
    id: 'INV-2025-001',
    date: '2025-08-28',
    amount: 45.00,
    status: 'paid',
    downloadUrl: '#'
  },
  {
    id: 'INV-2025-002',
    date: '2025-08-25',
    amount: 90.00,
    status: 'paid',
    downloadUrl: '#'
  },
  {
    id: 'INV-2025-003',
    date: '2025-08-20',
    amount: 75.00,
    status: 'refunded',
    downloadUrl: '#'
  }
];

const statusColors = {
  completed: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  refunded: 'bg-red-100 text-red-800',
  failed: 'bg-red-100 text-red-800'
};

const invoiceStatusColors = {
  paid: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  refunded: 'bg-red-100 text-red-800',
  overdue: 'bg-red-100 text-red-800'
};

export default function BillingPage() {
  const [activeTab, setActiveTab] = useState('transactions');
  const [selectedTransaction, setSelectedTransaction] = useState<number | null>(null);

  const totalSpent = demoTransactions
    .filter(t => t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const thisMonthSpent = demoTransactions
    .filter(t => t.status === 'completed' && new Date(t.date).getMonth() === new Date().getMonth())
    .reduce((sum, t) => sum + t.amount, 0);

  const selectedTransactionData = demoTransactions.find(t => t.id === selectedTransaction);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Billing & Payments</h1>
          <p className="text-gray-600 mt-2">View your payment history and manage billing</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <div className="text-2xl">💳</div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">${totalSpent.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <div className="text-2xl">📊</div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900">${thisMonthSpent.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-lg">
                <div className="text-2xl">🏆</div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{demoTransactions.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b">
            <nav className="flex space-x-8 px-6">
              {[
                { key: 'transactions', label: 'Transaction History' },
                { key: 'invoices', label: 'Invoices' },
                { key: 'payment-methods', label: 'Payment Methods' }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition ${
                    activeTab === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Transaction History Tab */}
          {activeTab === 'transactions' && (
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Service & Provider
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {demoTransactions.map(transaction => (
                      <tr key={transaction.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{transaction.service}</div>
                            <div className="text-sm text-gray-500">{transaction.provider}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(transaction.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          ${transaction.amount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[transaction.status]}`}>
                            {transaction.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => setSelectedTransaction(transaction.id)}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            View Details
                          </button>
                          {transaction.status === 'completed' && (
                            <button className="text-green-600 hover:text-green-900">
                              Download Receipt
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Invoices Tab */}
          {activeTab === 'invoices' && (
            <div className="p-6">
              <div className="space-y-4">
                {demoInvoices.map(invoice => (
                  <div key={invoice.id} className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="bg-blue-100 p-2 rounded">
                        <div className="text-xl">📄</div>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">Invoice {invoice.id}</h3>
                        <p className="text-sm text-gray-500">
                          Date: {new Date(invoice.date).toLocaleDateString()} • Amount: ${invoice.amount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${invoiceStatusColors[invoice.status]}`}>
                        {invoice.status}
                      </span>
                      <button className="text-blue-600 hover:text-blue-900 font-medium">
                        Download PDF
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Payment Methods Tab */}
          {activeTab === 'payment-methods' && (
            <div className="p-6">
              <div className="space-y-4">
                {/* Saved Payment Methods */}
                <div className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 p-2 rounded">
                      <div className="text-xl">💳</div>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Visa ending in 1234</h3>
                      <p className="text-sm text-gray-500">Expires 12/26 • Primary payment method</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-900 font-medium">Edit</button>
                    <button className="text-red-600 hover:text-red-900 font-medium">Remove</button>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-yellow-100 p-2 rounded">
                      <div className="text-xl">🎯</div>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">PayPal</h3>
                      <p className="text-sm text-gray-500">sarah.johnson@example.com</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-900 font-medium">Edit</button>
                    <button className="text-red-600 hover:text-red-900 font-medium">Remove</button>
                  </div>
                </div>

                {/* Add New Payment Method */}
                <button className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-gray-600 hover:border-gray-400 hover:text-gray-700 transition">
                  <div className="text-2xl mb-2">➕</div>
                  Add New Payment Method
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Transaction Detail Modal */}
        {selectedTransactionData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Transaction Details</h3>
                <button
                  onClick={() => setSelectedTransaction(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Transaction ID:</span>
                  <span className="font-medium">{selectedTransactionData.transactionId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Booking ID:</span>
                  <span className="font-medium">{selectedTransactionData.bookingId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Service:</span>
                  <span className="font-medium">{selectedTransactionData.service}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Provider:</span>
                  <span className="font-medium">{selectedTransactionData.provider}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">{new Date(selectedTransactionData.date).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-medium">${selectedTransactionData.amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="font-medium">{selectedTransactionData.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[selectedTransactionData.status]}`}>
                    {selectedTransactionData.status}
                  </span>
                </div>
              </div>
              
              <div className="mt-6 flex space-x-3">
                <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                  Download Receipt
                </button>
                <button
                  onClick={() => setSelectedTransaction(null)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Back to Dashboard */}
        <div className="mt-8 text-center">
          <Link href="/dashboard" className="inline-block bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
