"use client";
import React, { useState, useEffect } from 'react';

interface Transaction {
  id: string;
  type: 'earning' | 'withdrawal' | 'refund' | 'bonus' | 'penalty';
  amount: number;
  fee: number;
  netAmount: number;
  description: string;
  client?: string;
  orderId?: string;
  date: string;
  time: string;
  status: 'completed' | 'processing' | 'pending' | 'failed';
  paymentMethod: string;
  category: string;
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [payouts, setPayouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [dateFilter, setDateFilter] = useState('all-time');
  const [searchTerm, setSearchTerm] = useState('');

  // --- Data Fetching Logic (Kept as is) ---
  useEffect(() => {
    fetchTransactionData();
  }, []);

  const fetchTransactionData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('providerToken');
      
      if (!token) {
        setError('Authentication token not found');
        setLoading(false);
        return;
      }

      // Fetch bookings (for earnings and refunds)
      const bookingsResponse = await fetch('http://localhost:8000/api/v1/bookings/my-bookings?limit=1000', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      // Fetch payouts (for withdrawals)
      const payoutsResponse = await fetch('http://localhost:8000/api/v1/payouts', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const allTransactions: Transaction[] = [];

      // Process bookings data
      if (bookingsResponse.ok) {
        const bookingsData = await bookingsResponse.json();
        const bookings = bookingsData.bookings || [];

        bookings.forEach((booking: any) => {
          const amount = booking.totalPrice || 0;
          const fee = Math.round(amount * 0.1);
          const netAmount = amount - fee;
          const date = booking.scheduledAt || booking.createdAt || new Date().toISOString();

          // Create earning transaction for completed or confirmed bookings
          if (booking.status === 'completed' || booking.status === 'confirmed') {
            allTransactions.push({
              id: `TXN-${booking.id}`,
              type: 'earning',
              amount: amount,
              fee: fee,
              netAmount: netAmount,
              description: `Payment for ${booking.service?.name || booking.serviceName || 'Service'}`,
              client: booking.customer?.name || booking.customerName || 'Unknown Customer',
              orderId: `#${booking.id}`,
              date: new Date(date).toISOString().split('T')[0],
              time: new Date(date).toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                minute: '2-digit', 
                hour12: true 
              }),
              status: 'completed',
              paymentMethod: booking.paymentMethod || 'Credit Card',
              category: booking.service?.category || 'Service'
            });
          }

          // Create refund transaction for refunded bookings
          if (booking.status === 'cancelled' && booking.paymentStatus === 'refunded') {
            allTransactions.push({
              id: `REF-${booking.id}`,
              type: 'refund',
              amount: amount,
              fee: 0,
              netAmount: -amount,
              description: `Refund for cancelled ${booking.service?.name || booking.serviceName || 'Service'}`,
              client: booking.customer?.name || booking.customerName || 'Unknown Customer',
              orderId: `#${booking.id}`,
              date: new Date(booking.updatedAt || date).toISOString().split('T')[0],
              time: new Date(booking.updatedAt || date).toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                minute: '2-digit', 
                hour12: true 
              }),
              status: 'completed',
              paymentMethod: booking.paymentMethod || 'Credit Card',
              category: booking.service?.category || 'Service'
            });
          }
        });
      }

      // Process payouts data
      if (payoutsResponse.ok) {
        const payoutsData = await payoutsResponse.json();
        const payoutsList = Array.isArray(payoutsData) ? payoutsData : payoutsData.payouts || [];
        setPayouts(payoutsList);

        payoutsList.forEach((payout: any) => {
          const amount = payout.amount || 0;
          const fee = payout.fee || Math.round(amount * 0.02);
          const netAmount = amount - fee;

          allTransactions.push({
            id: `WTH-${payout.id}`,
            type: 'withdrawal',
            amount: amount,
            fee: fee,
            netAmount: netAmount,
            description: `Withdrawal to ${payout.bankAccount || payout.paymentMethod || 'Bank Account'}`,
            client: undefined,
            orderId: undefined,
            date: new Date(payout.createdAt || new Date()).toISOString().split('T')[0],
            time: new Date(payout.createdAt || new Date()).toLocaleTimeString('en-US', { 
              hour: 'numeric', 
              minute: '2-digit', 
              hour12: true 
            }),
            status: payout.status || 'processing',
            paymentMethod: 'Bank Transfer',
            category: 'Withdrawal'
          });
        });
      }

      // Sort transactions by date (newest first)
      allTransactions.sort((a, b) => {
        const dateA = new Date(`${a.date} ${a.time}`).getTime();
        const dateB = new Date(`${b.date} ${b.time}`).getTime();
        return dateB - dateA;
      });

      setTransactions(allTransactions);
      setError(null);
    } catch (error: any) {
      console.error('Error fetching transaction data:', error);
      setTransactions([]);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  // --- Filtering Logic (Kept as is) ---
  const filteredTransactions = transactions.filter(transaction => {
    const matchesTab = activeTab === 'all' || transaction.type === activeTab;
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (transaction.client && transaction.client.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          transaction.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Date filter logic (Kept as is)
    let matchesDate = true;
    if (dateFilter !== 'all-time') {
      const transactionDate = new Date(transaction.date);
      const now = new Date();
      
      switch (dateFilter) {
        case 'today':
          matchesDate = transactionDate.toDateString() === now.toDateString();
          break;
        case 'this-week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesDate = transactionDate >= weekAgo;
          break;
        case 'this-month':
          matchesDate = transactionDate.getMonth() === now.getMonth() && 
                        transactionDate.getFullYear() === now.getFullYear();
          break;
        case 'this-year':
          matchesDate = transactionDate.getFullYear() === now.getFullYear();
          break;
      }
    }
    
    return matchesTab && matchesSearch && matchesDate;
  });

  // --- Utility Functions (Kept as is) ---
  const getTransactionIcon = (type: string) => {
    switch(type) {
      case 'earning': return '💰';
      case 'withdrawal': return '🏦';
      case 'refund': return '↩️';
      case 'penalty': return '⚠️';
      case 'bonus': return '🎁';
      default: return '💱';
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed': return { bg: 'bg-green-100', text: 'text-green-600' }; // #dcfce7, #16a34a
      case 'processing': return { bg: 'bg-amber-100', text: 'text-amber-600' }; // #fef3c7, #d97706
      case 'pending': return { bg: 'bg-blue-100', text: 'text-blue-600' }; // #dbeafe, #2563eb
      case 'failed': return { bg: 'bg-red-100', text: 'text-red-600' }; // #fee2e2, #dc2626
      default: return { bg: 'bg-slate-100', text: 'text-slate-600' }; // #f1f5f9, #64748b
    }
  };

  const getAmountColor = (type: string) => {
    switch(type) {
      case 'earning':
      case 'bonus':
        return 'text-green-600'; // #16a34a
      case 'withdrawal':
      case 'refund':
      case 'penalty':
        return 'text-red-600'; // #dc2626
      default:
        return 'text-slate-600'; // #64748b
    }
  };

  // --- Stats Calculation (Kept as is) ---
  const stats = {
    totalEarnings: transactions
      .filter(t => t.type === 'earning')
      .reduce((sum, t) => sum + t.netAmount, 0),
    totalWithdrawals: transactions
      .filter(t => t.type === 'withdrawal')
      .reduce((sum, t) => sum + t.amount, 0),
    totalFees: transactions
      .reduce((sum, t) => t.type !== 'refund' ? sum + t.fee : sum, 0),
    netTotal: transactions
      .reduce((sum, t) => {
        if (t.type === 'earning' || t.type === 'bonus') return sum + t.netAmount;
        if (t.type === 'withdrawal' || t.type === 'refund' || t.type === 'penalty') return sum - t.amount;
        return sum;
      }, 0)
  };

  // --- Loading Screen ---
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 ">
        <div className="">
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin w-12 h-12 border-4 border-slate-200 border-t-blue-500 rounded-full"></div>
            <span className="ml-4 text-slate-500">Loading transactions...</span>
          </div>
        </div>
      </div>
    );
  }

  // --- Error Screen ---
  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 ">
        <div className="">
          <div className="bg-red-50 border border-red-300 rounded-lg p-4 mt-5">
            <h3 className="text-red-800 text-base font-semibold">
              Error loading transactions
            </h3>
            <p className="text-red-600 mt-2">{error}</p>
            <button
              onClick={fetchTransactionData}
              className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md border-none mt-3 cursor-pointer text-sm transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- Main Content with Tailwind CSS Classes ---
  return (
    <div className="min-h-screen bg-slate-50 ">
      <div className="">
        {/* Header */}
        <div className="mb-6 lg:mb-8">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 mb-1">
            Transactions
          </h1>
          <p className="text-sm sm:text-base text-slate-500">
            View and manage all your financial transactions
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 mb-6 lg:mb-8">
          {/* Total Earnings */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
            <div className="text-3xl font-bold text-green-600 mb-2">
              ${(Number(stats.totalEarnings) || 0).toFixed(2)}
            </div>
            <div className="text-sm text-slate-500">Total Earnings</div>
          </div>

          {/* Total Withdrawals */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              ${(Number(stats.totalWithdrawals) || 0).toFixed(2)}
            </div>
            <div className="text-sm text-slate-500">Total Withdrawals</div>
          </div>

          {/* Total Fees */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
            <div className="text-3xl font-bold text-amber-600 mb-2">
              ${(Number(stats.totalFees) || 0).toFixed(2)}
            </div>
            <div className="text-sm text-slate-500">Total Fees</div>
          </div>

          {/* Net Total */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
            <div className="text-3xl font-bold text-green-600 mb-2">
              ${(Number(stats.netTotal) || 0).toFixed(2)}
            </div>
            <div className="text-sm text-slate-500">Net Total</div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-6">
          <div className="p-4 sm:p-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center flex-wrap gap-4 mb-4">
              {/* Transaction Type Tabs */}
              <div className="flex flex-wrap gap-2">
                {[
                  { key: 'all', label: 'All' },
                  { key: 'earning', label: 'Earnings' },
                  { key: 'withdrawal', label: 'Withdrawals' },
                  { key: 'refund', label: 'Refunds' },
                  { key: 'bonus', label: 'Bonuses' }
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`py-2 px-4 rounded-lg text-sm cursor-pointer font-medium transition-all duration-200 flex-shrink-0 
                      ${activeTab === tab.key 
                        ? 'bg-blue-600 text-white shadow-md' 
                        : 'bg-slate-100 text-slate-500 hover:bg-blue-50 hover:text-blue-600'
                      }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Date Filter */}
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="py-2 px-3 border border-slate-300 rounded-lg text-sm bg-white cursor-pointer min-w-[120px] focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all-time">All Time</option>
                <option value="today">Today</option>
                <option value="this-week">This Week</option>
                <option value="this-month">This Month</option>
                <option value="this-year">This Year</option>
              </select>
            </div>

            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-2 pl-3 pr-10 border border-slate-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400">
                🔍
              </div>
            </div>
          </div>
        </div>

        {/* Transactions Table/List */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-16 px-5">
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">
                💳
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                No transactions found
              </h3>
              <p className="text-slate-500">
                {searchTerm 
                  ? `No transactions match "${searchTerm}"` 
                  : activeTab === 'all'
                  ? "You don't have any transactions yet."
                  : `No ${activeTab} transactions found.`
                }
              </p>
            </div>
          ) : (
            <div>
              {/* Table Header (Desktop/Tablet) */}
              <div className="hidden lg:grid lg:grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr] gap-4 p-4 lg:px-6 bg-slate-50 border-b border-slate-200 text-sm font-semibold text-slate-700">
                <div>TRANSACTION</div>
                <div>AMOUNT</div>
                <div>FEE</div>
                <div>NET AMOUNT</div>
                <div>DATE & TIME</div>
                <div>STATUS</div>
                <div>ACTIONS</div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-slate-100">
                {filteredTransactions.map((transaction, index) => {
                  const statusColor = getStatusColor(transaction.status);
                  const amountColor = getAmountColor(transaction.type);
                  
                  return (
                    <div 
                      key={transaction.id}
                      className="p-4 lg:px-6 lg:grid lg:grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr] lg:gap-4 items-center transition-colors hover:bg-slate-50"
                    >
                      {/* 1. Transaction Info (Mobile: Full Row / Desktop: 1st Column) */}
                      <div className="flex items-start gap-3 mb-3 lg:mb-0">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-lg flex-shrink-0">
                          {getTransactionIcon(transaction.type)}
                        </div>
                        <div className="flex-grow">
                          <div className="text-sm font-semibold text-slate-800 mb-0.5">
                            {transaction.description}
                          </div>
                          <div className="text-xs text-slate-500">
                            {transaction.id}
                            {transaction.client && ` • ${transaction.client}`}
                          </div>
                          {/* Status and Date on Mobile */}
                          <div className="flex items-center mt-2 lg:hidden">
                              <span className={`py-1 px-2.5 rounded-full text-xs font-medium ${statusColor.bg} ${statusColor.text}`}>
                                {transaction.status}
                              </span>
                              <div className="text-xs text-slate-500 ml-3">
                                {transaction.date} {transaction.time}
                              </div>
                          </div>
                        </div>
                      </div>

                      {/* 2. Amount */}
                      <div className="flex justify-between items-center text-sm lg:block lg:text-left py-1 lg:py-0">
                          <span className="text-xs text-slate-400 font-medium mr-2 lg:hidden">Amount:</span>
                          <span className={`text-sm font-semibold ${amountColor}`}>
                            {(transaction.type === 'withdrawal' || transaction.type === 'refund' || transaction.type === 'penalty') 
                              ? '-' : '+'}${(Number(transaction.amount) || 0).toFixed(2)}
                          </span>
                      </div>

                      {/* 3. Fee */}
                      <div className="flex justify-between items-center text-sm lg:block lg:text-left py-1 lg:py-0">
                        <span className="text-xs text-slate-400 font-medium mr-2 lg:hidden">Fee:</span>
                        <span className="text-sm text-slate-500">
                          ${(Number(transaction.fee) || 0).toFixed(2)}
                        </span>
                      </div>

                      {/* 4. Net Amount */}
                      <div className="flex justify-between items-center text-sm lg:block lg:text-left py-1 lg:py-0">
                        <span className="text-xs text-slate-400 font-medium mr-2 lg:hidden">Net:</span>
                        <span className={`text-sm font-semibold ${
                          (Number(transaction.netAmount) || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {(Number(transaction.netAmount) || 0) >= 0 ? '+' : ''}${(Number(transaction.netAmount) || 0).toFixed(2)}
                        </span>
                      </div>

                      {/* 5. Date & Time (Desktop Only) */}
                      <div className="hidden lg:block text-sm text-slate-500">
                        <div>{transaction.date}</div>
                        <div className="text-xs">{transaction.time}</div>
                      </div>

                      {/* 6. Status (Desktop Only) */}
                      <div className="hidden lg:block">
                        <span className={`py-1 px-2.5 rounded-full text-xs font-medium ${statusColor.bg} ${statusColor.text}`}>
                          {transaction.status}
                        </span>
                      </div>

                      {/* 7. Actions (Mobile: Below other details / Desktop: Last Column) */}
                      <div className="w-full lg:w-auto mt-3 lg:mt-0 flex lg:justify-start">
                        <button className="bg-white text-slate-500 hover:bg-slate-100 py-1.5 px-3 rounded-md border border-slate-300 text-xs cursor-pointer transition-colors">
                          View
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Export Options */}
        {filteredTransactions.length > 0 && (
          <div className="flex flex-wrap justify-end gap-3 mt-4">
            <button className="bg-white text-slate-500 hover:bg-slate-100 py-2 px-4 rounded-md border border-slate-300 text-sm cursor-pointer transition-colors flex items-center gap-2">
              📄 Export PDF
            </button>
            <button className="bg-white text-slate-500 hover:bg-slate-100 py-2 px-4 rounded-md border border-slate-300 text-sm cursor-pointer transition-colors flex items-center gap-2">
              📊 Export CSV
            </button>
          </div>
        )}
      </div>
    </div>
  );
}