'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'react-hot-toast'
import { 
  Gift, 
  TrendingUp, 
  Users, 
  DollarSign,
  Search,
  Filter,
  Download,
  Eye,
  RefreshCw,
  BarChart3,
  Calendar,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react'
import { 
  useGetAllGiftCardsQuery,
  useGetGiftCardStatsQuery,
  useCancelGiftCardMutation,
  useExtendGiftCardExpiryMutation
} from '@/store/api/giftCardsApi'

interface GiftCardFilters {
  status: string
  dateRange: string
  search: string
}

export default function AdminGiftCardsPage() {
  const [filters, setFilters] = useState<GiftCardFilters>({
    status: 'all',
    dateRange: 'all',
    search: ''
  })
  const [selectedCard, setSelectedCard] = useState<any>(null)
  const [extendExpiryDate, setExtendExpiryDate] = useState('')
  const [activeTab, setActiveTab] = useState('overview')
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showExtendModal, setShowExtendModal] = useState(false)

  const { data: giftCards, isLoading: isLoadingCards, refetch } = useGetAllGiftCardsQuery({
    status: filters.status === 'all' ? undefined : filters.status,
    search: filters.search || undefined,
  })

  const { data: stats, isLoading: isLoadingStats } = useGetGiftCardStatsQuery({
    period: filters.dateRange
  })

  const [cancelGiftCard, { isLoading: isCanceling }] = useCancelGiftCardMutation()
  const [extendExpiry, { isLoading: isExtending }] = useExtendGiftCardExpiryMutation()

  const handleCancelCard = async (code: string) => {
    try {
      await cancelGiftCard({ code }).unwrap()
      toast.success('Gift card canceled successfully')
      refetch()
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to cancel gift card')
    }
  }

  const handleExtendExpiry = async () => {
    try {
      if (!selectedCard || !extendExpiryDate) return

      await extendExpiry({ 
        code: selectedCard.code, 
        newExpiryDate: extendExpiryDate 
      }).unwrap()
      toast.success('Gift card expiry extended successfully')
      setSelectedCard(null)
      setExtendExpiryDate('')
      setShowExtendModal(false)
      refetch()
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to extend expiry')
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs'
      case 'redeemed': return 'bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs'
      case 'partially_redeemed': return 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs'
      case 'canceled': return 'bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs'
      case 'expired': return 'bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs'
      default: return 'bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4" />
      case 'redeemed': return <CheckCircle className="h-4 w-4" />
      case 'partially_redeemed': return <Clock className="h-4 w-4" />
      case 'canceled': return <XCircle className="h-4 w-4" />
      case 'expired': return <AlertCircle className="h-4 w-4" />
      default: return <AlertCircle className="h-4 w-4" />
    }
  }

  const exportData = () => {
    toast.success('Export feature coming soon!')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gift Cards Management</h1>
              <p className="text-gray-600 mt-1">Monitor and manage all gift cards in the system</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={exportData}>
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
              <Button onClick={() => refetch()}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Sales</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {isLoadingStats ? '...' : formatCurrency(stats?.totalSales || 0)}
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    {stats?.totalCount || 0} cards sold
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Cards</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats?.activeCount || 0}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    {formatCurrency(stats?.activeValue || 0)} value
                  </p>
                </div>
                <Gift className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Redeemed</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats?.redeemedCount || 0}
                  </p>
                  <p className="text-xs text-purple-600 mt-1">
                    {formatCurrency(stats?.redeemedValue || 0)} redeemed
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats?.conversionRate ? `${stats.conversionRate.toFixed(1)}%` : '0%'}
                  </p>
                  <p className="text-xs text-orange-600 mt-1">
                    Cards to services
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Simple Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('cards')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'cards'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                All Gift Cards
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Gift Card Activity</CardTitle>
                  <CardDescription>Latest gift card transactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {giftCards?.giftCards?.slice(0, 5).map((card: any) => (
                      <div key={card.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(card.status)}
                          <div>
                            <p className="font-medium">#{card.code}</p>
                            <p className="text-sm text-gray-600">
                              {new Date(card.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{formatCurrency(card.amount)}</p>
                          <span className={getStatusColor(card.status)}>
                            {card.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Status Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Status Distribution</CardTitle>
                  <CardDescription>Gift cards by status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                        <span>Active</span>
                      </div>
                      <span className="font-bold">{stats?.activeCount || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
                        <span>Redeemed</span>
                      </div>
                      <span className="font-bold">{stats?.redeemedCount || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 bg-yellow-500 rounded-full"></div>
                        <span>Partial</span>
                      </div>
                      <span className="font-bold">{stats?.partialCount || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 bg-red-500 rounded-full"></div>
                        <span>Canceled</span>
                      </div>
                      <span className="font-bold">{stats?.canceledCount || 0}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'cards' && (
          <div className="space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Code, email..."
                        value={filters.search}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                        className="pl-9"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select 
                      value={filters.status} 
                      onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="redeemed">Redeemed</option>
                      <option value="partially_redeemed">Partial</option>
                      <option value="canceled">Canceled</option>
                      <option value="expired">Expired</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                    <select 
                      value={filters.dateRange} 
                      onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="all">All Time</option>
                      <option value="today">Today</option>
                      <option value="week">This Week</option>
                      <option value="month">This Month</option>
                      <option value="year">This Year</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Gift Cards List */}
            <Card>
              <CardHeader>
                <CardTitle>Gift Cards ({giftCards?.giftCards?.length || 0})</CardTitle>
                <CardDescription>
                  All gift cards in the system
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingCards ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-gray-500 mt-2">Loading gift cards...</p>
                  </div>
                ) : giftCards?.giftCards && giftCards.giftCards.length > 0 ? (
                  <div className="space-y-4">
                    {giftCards.giftCards.map((card: any) => (
                      <div key={card.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                            <Gift className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium">#{card.code}</p>
                              <span className={getStatusColor(card.status)}>
                                {card.status}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">
                              Purchased: {new Date(card.createdAt).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-gray-600">
                              Recipient: {card.recipientEmail}
                            </p>
                            <p className="text-sm text-gray-600">
                              Expires: {new Date(card.expiryDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="font-bold text-lg">{formatCurrency(card.amount)}</p>
                            {card.currentBalance < card.amount && (
                              <p className="text-sm text-gray-600">
                                Balance: {formatCurrency(card.currentBalance)}
                              </p>
                            )}
                          </div>
                          
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => {
                                setSelectedCard(card)
                                setShowDetailsModal(true)
                              }}
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                            
                            {card.status === 'active' && (
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleCancelCard(card.code)}
                                disabled={isCanceling}
                              >
                                <XCircle className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Gift className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No gift cards found</h3>
                    <p className="text-gray-500">No gift cards match your current filters</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedCard && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Gift Card Details</h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Code</label>
                    <p className="font-mono bg-gray-100 p-2 rounded">{selectedCard.code}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <span className={getStatusColor(selectedCard.status)}>
                      {selectedCard.status}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Amount</label>
                    <p>{formatCurrency(selectedCard.amount)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Current Balance</label>
                    <p>{formatCurrency(selectedCard.currentBalance)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Recipient Email</label>
                    <p>{selectedCard.recipientEmail}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Recipient Name</label>
                    <p>{selectedCard.recipientName || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Purchase Date</label>
                    <p>{new Date(selectedCard.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                    <p>{new Date(selectedCard.expiryDate).toLocaleDateString()}</p>
                  </div>
                </div>
                
                {selectedCard.personalMessage && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Personal Message</label>
                    <p className="bg-gray-100 p-3 rounded italic">"{selectedCard.personalMessage}"</p>
                  </div>
                )}
              </div>
              
              <div className="flex gap-2 mt-6">
                {selectedCard.status === 'active' && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowExtendModal(true)
                        setShowDetailsModal(false)
                      }}
                    >
                      <Calendar className="h-3 w-3 mr-1" />
                      Extend Expiry
                    </Button>
                    
                    <Button
                      variant="destructive"
                      onClick={() => {
                        handleCancelCard(selectedCard.code)
                        setShowDetailsModal(false)
                      }}
                      disabled={isCanceling}
                    >
                      <XCircle className="h-3 w-3 mr-1" />
                      Cancel Card
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Extend Expiry Modal */}
      {showExtendModal && selectedCard && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Extend Expiry Date</h2>
                <button
                  onClick={() => setShowExtendModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">New Expiry Date</label>
                <Input
                  type="date"
                  value={extendExpiryDate}
                  onChange={(e) => setExtendExpiryDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={handleExtendExpiry}
                  disabled={isExtending || !extendExpiryDate}
                  className="flex-1"
                >
                  {isExtending ? 'Extending...' : 'Extend'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowExtendModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}