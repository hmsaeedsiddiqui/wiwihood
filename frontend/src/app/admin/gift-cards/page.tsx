'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { 
  Gift, 
  TrendingUp, 
  Users, 
  DollarSign,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash,
  RefreshCw,
  BarChart3,
  Calendar,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  MoreHorizontal
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
  minAmount: string
  maxAmount: string
  search: string
}

export default function AdminGiftCardsPage() {
  const [filters, setFilters] = useState<GiftCardFilters>({
    status: 'all',
    dateRange: 'all',
    minAmount: '',
    maxAmount: '',
    search: ''
  })
  const [selectedCard, setSelectedCard] = useState<any>(null)
  const [extendExpiryDate, setExtendExpiryDate] = useState('')

  const { data: giftCards, isLoading: isLoadingCards, refetch } = useGetAllGiftCardsQuery({
    status: filters.status === 'all' ? undefined : filters.status,
    search: filters.search || undefined,
    minAmount: filters.minAmount ? parseFloat(filters.minAmount) : undefined,
    maxAmount: filters.maxAmount ? parseFloat(filters.maxAmount) : undefined
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
      case 'active': return 'bg-green-100 text-green-800'
      case 'redeemed': return 'bg-blue-100 text-blue-800'
      case 'partially_redeemed': return 'bg-yellow-100 text-yellow-800'
      case 'canceled': return 'bg-red-100 text-red-800'
      case 'expired': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
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
    // Implementation for exporting data
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

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="cards">All Gift Cards</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Gift Card Activity</CardTitle>
                  <CardDescription>Latest gift card transactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {giftCards?.slice(0, 5).map((card: any) => (
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
                          <Badge className={getStatusColor(card.status)}>
                            {card.status}
                          </Badge>
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
          </TabsContent>

          {/* All Cards Tab */}
          <TabsContent value="cards" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div>
                    <Label>Search</Label>
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
                    <Label>Status</Label>
                    <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="redeemed">Redeemed</SelectItem>
                        <SelectItem value="partially_redeemed">Partial</SelectItem>
                        <SelectItem value="canceled">Canceled</SelectItem>
                        <SelectItem value="expired">Expired</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Date Range</Label>
                    <Select value={filters.dateRange} onValueChange={(value) => setFilters({ ...filters, dateRange: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Time</SelectItem>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="week">This Week</SelectItem>
                        <SelectItem value="month">This Month</SelectItem>
                        <SelectItem value="year">This Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Min Amount</Label>
                    <Input
                      type="number"
                      placeholder="$0"
                      value={filters.minAmount}
                      onChange={(e) => setFilters({ ...filters, minAmount: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label>Max Amount</Label>
                    <Input
                      type="number"
                      placeholder="$1000"
                      value={filters.maxAmount}
                      onChange={(e) => setFilters({ ...filters, maxAmount: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Gift Cards List */}
            <Card>
              <CardHeader>
                <CardTitle>Gift Cards ({giftCards?.length || 0})</CardTitle>
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
                ) : giftCards && giftCards.length > 0 ? (
                  <div className="space-y-4">
                    {giftCards.map((card: any) => (
                      <div key={card.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                            <Gift className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium">#{card.code}</p>
                              <Badge className={getStatusColor(card.status)}>
                                {card.status}
                              </Badge>
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
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm" variant="outline" onClick={() => setSelectedCard(card)}>
                                  <Eye className="h-3 w-3" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Gift Card Details</DialogTitle>
                                  <DialogDescription>
                                    Complete information for gift card #{card.code}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label>Code</Label>
                                      <p className="font-mono bg-gray-100 p-2 rounded">{card.code}</p>
                                    </div>
                                    <div>
                                      <Label>Status</Label>
                                      <Badge className={getStatusColor(card.status)}>
                                        {card.status}
                                      </Badge>
                                    </div>
                                    <div>
                                      <Label>Amount</Label>
                                      <p>{formatCurrency(card.amount)}</p>
                                    </div>
                                    <div>
                                      <Label>Current Balance</Label>
                                      <p>{formatCurrency(card.currentBalance)}</p>
                                    </div>
                                    <div>
                                      <Label>Recipient Email</Label>
                                      <p>{card.recipientEmail}</p>
                                    </div>
                                    <div>
                                      <Label>Recipient Name</Label>
                                      <p>{card.recipientName || 'N/A'}</p>
                                    </div>
                                    <div>
                                      <Label>Purchase Date</Label>
                                      <p>{new Date(card.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                      <Label>Expiry Date</Label>
                                      <p>{new Date(card.expiryDate).toLocaleDateString()}</p>
                                    </div>
                                  </div>
                                  
                                  {card.personalMessage && (
                                    <div>
                                      <Label>Personal Message</Label>
                                      <p className="bg-gray-100 p-3 rounded italic">"{card.personalMessage}"</p>
                                    </div>
                                  )}
                                </div>
                                <DialogFooter>
                                  <div className="flex gap-2">
                                    {card.status === 'active' && (
                                      <>
                                        <Dialog>
                                          <DialogTrigger asChild>
                                            <Button variant="outline">
                                              <Calendar className="h-3 w-3 mr-1" />
                                              Extend Expiry
                                            </Button>
                                          </DialogTrigger>
                                          <DialogContent>
                                            <DialogHeader>
                                              <DialogTitle>Extend Expiry Date</DialogTitle>
                                              <DialogDescription>
                                                Set a new expiry date for this gift card
                                              </DialogDescription>
                                            </DialogHeader>
                                            <div>
                                              <Label>New Expiry Date</Label>
                                              <Input
                                                type="date"
                                                value={extendExpiryDate}
                                                onChange={(e) => setExtendExpiryDate(e.target.value)}
                                                min={new Date().toISOString().split('T')[0]}
                                              />
                                            </div>
                                            <DialogFooter>
                                              <Button
                                                onClick={handleExtendExpiry}
                                                disabled={isExtending || !extendExpiryDate}
                                              >
                                                {isExtending ? 'Extending...' : 'Extend'}
                                              </Button>
                                            </DialogFooter>
                                          </DialogContent>
                                        </Dialog>
                                        
                                        <Button
                                          variant="destructive"
                                          onClick={() => handleCancelCard(card.code)}
                                          disabled={isCanceling}
                                        >
                                          <XCircle className="h-3 w-3 mr-1" />
                                          Cancel Card
                                        </Button>
                                      </>
                                    )}
                                  </div>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
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
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Gift Card Analytics
                </CardTitle>
                <CardDescription>
                  Detailed analytics and insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics Dashboard</h3>
                  <p className="text-gray-500">Detailed analytics charts and insights will appear here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}