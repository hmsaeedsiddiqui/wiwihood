"use client";
import React, { useState } from "react";
import { 
  Wallet, 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  Gift, 
  CreditCard,
  Eye,
  Download,
  Filter,
  Search,
  MoreHorizontal,
  Plus,
  ArrowUpRight,
  Users,
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'react-hot-toast'
import { 
  useGetProviderGiftCardSalesQuery,
  useGetProviderGiftCardStatsQuery,
  useCreateGiftCardMutation
} from '@/store/api/giftCardsApi'

interface CreateGiftCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateGiftCardModal: React.FC<CreateGiftCardModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    amount: '',
    recipientEmail: '',
    recipientName: '',
    personalMessage: ''
  });

  const [createGiftCard, { isLoading: isCreating }] = useCreateGiftCardMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createGiftCard({
        amount: parseFloat(formData.amount),
        recipientEmail: formData.recipientEmail,
        recipientName: formData.recipientName,
        personalMessage: formData.personalMessage
      }).unwrap();
      
      toast.success('Gift card created successfully!');
      onSuccess();
      onClose();
      setFormData({
        amount: '',
        recipientEmail: '',
        recipientName: '',
        personalMessage: ''
      });
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to create gift card');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Create Gift Card</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XCircle className="h-6 w-6" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gift Card Amount *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="number"
                  min="10"
                  max="1000"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="pl-9"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Recipient Email *
              </label>
              <Input
                type="email"
                value={formData.recipientEmail}
                onChange={(e) => setFormData({ ...formData, recipientEmail: e.target.value })}
                placeholder="customer@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Recipient Name
              </label>
              <Input
                type="text"
                value={formData.recipientName}
                onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                placeholder="Customer Name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Personal Message
              </label>
              <textarea
                value={formData.personalMessage}
                onChange={(e) => setFormData({ ...formData, personalMessage: e.target.value })}
                placeholder="Thank you for your business! Enjoy your gift card."
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
              />
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                type="submit"
                disabled={isCreating || !formData.amount || !formData.recipientEmail}
                className="flex-1"
              >
                {isCreating ? 'Creating...' : 'Create Gift Card'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default function WalletPage() {
  const [dateRange, setDateRange] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showCreateModal, setShowCreateModal] = useState(false)

  const { data: giftCardStats, isLoading: isLoadingStats, refetch: refetchStats } = useGetProviderGiftCardStatsQuery({
    period: dateRange
  })
  
  const { data: giftCardSales, isLoading: isLoadingSales, refetch: refetchSales } = useGetProviderGiftCardSalesQuery({
    page: 1,
    limit: 100
  })

  const handleGiftCardSuccess = () => {
    refetchStats();
    refetchSales();
  };

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
      case 'expired': return <XCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent">
                Wallet & Earnings
              </h1>
              <p className="text-gray-600 mt-1">Manage your earnings, payouts, and gift card sales</p>
            </div>
            <div className="flex gap-3">
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-40">
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
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                  <p className="text-2xl font-bold text-gray-900">$15,420.50</p>
                  <p className="text-xs text-green-600 mt-1">+12.5% from last month</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">This Month</p>
                  <p className="text-2xl font-bold text-gray-900">$3,250.75</p>
                  <p className="text-xs text-blue-600 mt-1">42 appointments</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Gift Cards Sold</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {isLoadingStats ? '...' : formatCurrency(giftCardStats?.totalSales || 0)}
                  </p>
                  <p className="text-xs text-purple-600 mt-1">
                    {giftCardStats?.totalCount || 0} cards
                  </p>
                </div>
                <Gift className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Available Balance</p>
                  <p className="text-2xl font-bold text-gray-900">$2,840.25</p>
                  <p className="text-xs text-gray-600 mt-1">Ready for payout</p>
                </div>
                <Wallet className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="gift-cards">Gift Card Sales</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Earnings Chart Placeholder */}
              <Card>
                <CardHeader>
                  <CardTitle>Earnings Overview</CardTitle>
                  <CardDescription>Your earnings over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Earnings chart will appear here</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest earnings and transactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                        <div>
                          <p className="font-medium">Service Payment</p>
                          <p className="text-sm text-gray-600">Hair Cut & Styling</p>
                        </div>
                      </div>
                      <span className="font-bold text-green-600">+$85.00</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 bg-purple-500 rounded-full"></div>
                        <div>
                          <p className="font-medium">Gift Card Sale</p>
                          <p className="text-sm text-gray-600">$100 Gift Card</p>
                        </div>
                      </div>
                      <span className="font-bold text-purple-600">+$100.00</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                        <div>
                          <p className="font-medium">Gift Card Redemption</p>
                          <p className="text-sm text-gray-600">Redeemed for service</p>
                        </div>
                      </div>
                      <span className="font-bold text-blue-600">+$50.00</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Gift Cards Tab */}
          <TabsContent value="gift-cards" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Gift className="h-5 w-5" />
                      Gift Card Sales
                    </CardTitle>
                    <CardDescription>
                      Manage and track your gift card sales
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => setShowCreateModal(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Gift Card
                    </Button>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-32">
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
                </div>
              </CardHeader>
              <CardContent>
                {isLoadingSales ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                    <p className="text-gray-500 mt-2">Loading gift card sales...</p>
                  </div>
                ) : giftCardSales?.sales && giftCardSales.sales.length > 0 ? (
                  <div className="space-y-4">
                    {giftCardSales.sales.map((sale: any) => (
                      <div key={sale.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                            <Gift className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium">Gift Card #{sale.code}</p>
                              <Badge className={getStatusColor(sale.status)}>
                                {sale.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">
                              Purchased on {new Date(sale.createdAt).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-gray-600">
                              Recipient: {sale.recipientEmail}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">{formatCurrency(sale.amount)}</p>
                          {sale.currentBalance < sale.amount && (
                            <p className="text-sm text-gray-600">
                              Balance: {formatCurrency(sale.currentBalance)}
                            </p>
                          )}
                          <p className="text-xs text-gray-500">
                            Expires: {new Date(sale.expiryDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Gift className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No gift card sales yet</h3>
                    <p className="text-gray-500">Gift cards sold through your services will appear here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Transaction History
                </CardTitle>
                <CardDescription>
                  Complete history of all your earnings and payouts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Transaction History</h3>
                  <p className="text-gray-500">Your detailed transaction history will appear here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Create Gift Card Modal */}
      <CreateGiftCardModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleGiftCardSuccess}
      />
    </div>
  );
}
