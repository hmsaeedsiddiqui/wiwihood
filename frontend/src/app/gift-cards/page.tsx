'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
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
  CreditCard, 
  Heart, 
  Star, 
  Plus, 
  Copy, 
  Share2, 
  Download,
  Eye,
  Send,
  Clock,
  CheckCircle,
  XCircle,
  History,
  Wallet
} from 'lucide-react'
import { 
  usePurchaseGiftCardMutation,
  useGetMyGiftCardsQuery,
  useCheckGiftCardBalanceQuery,
  useRedeemGiftCardMutation,
  useTransferGiftCardMutation,
  useCancelGiftCardMutation
} from '@/store/api/giftCardsApi'

// Predefined amounts
const PREDEFINED_AMOUNTS = [25, 50, 100, 150, 200, 300, 500]

// Gift card design templates
const GIFT_CARD_DESIGNS = [
  { id: 'default', name: 'Classic', gradient: 'from-blue-500 to-purple-600' },
  { id: 'valentine', name: 'Valentine', gradient: 'from-pink-500 to-red-500' },
  { id: 'birthday', name: 'Birthday', gradient: 'from-yellow-400 to-orange-500' },
  { id: 'anniversary', name: 'Anniversary', gradient: 'from-purple-500 to-pink-500' },
  { id: 'holiday', name: 'Holiday', gradient: 'from-green-500 to-red-500' },
  { id: 'spa', name: 'Spa & Wellness', gradient: 'from-teal-400 to-blue-500' }
]

export default function GiftCardsPage() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
  const [customAmount, setCustomAmount] = useState('')
  const [selectedDesign, setSelectedDesign] = useState(GIFT_CARD_DESIGNS[0])
  const [recipientEmail, setRecipientEmail] = useState('')
  const [recipientName, setRecipientName] = useState('')
  const [personalMessage, setPersonalMessage] = useState('')
  const [deliveryDate, setDeliveryDate] = useState('')
  const [checkBalanceCode, setCheckBalanceCode] = useState('')
  const [redeemCode, setRedeemCode] = useState('')
  const [transferCode, setTransferCode] = useState('')
  const [transferEmail, setTransferEmail] = useState('')

  const [purchaseGiftCard, { isLoading: isPurchasing }] = usePurchaseGiftCardMutation()
  const [redeemGiftCard, { isLoading: isRedeeming }] = useRedeemGiftCardMutation()
  const [transferGiftCard, { isLoading: isTransferring }] = useTransferGiftCardMutation()
  const [cancelGiftCard, { isLoading: isCanceling }] = useCancelGiftCardMutation()

  const { data: myGiftCards, isLoading: isLoadingGiftCards } = useGetMyGiftCardsQuery()
  const { data: balanceData, isLoading: isCheckingBalance } = useCheckGiftCardBalanceQuery(
    checkBalanceCode,
    { skip: !checkBalanceCode }
  )

  const handlePurchase = async () => {
    try {
      const amount = selectedAmount || parseFloat(customAmount)
      if (!amount || amount < 5) {
        toast.error('Amount must be at least $5')
        return
      }

      if (!recipientEmail) {
        toast.error('Recipient email is required')
        return
      }

      const purchaseData = {
        amount,
        recipientEmail,
        recipientName: recipientName || undefined,
        personalMessage: personalMessage || undefined,
        deliveryDate: deliveryDate || undefined,
        design: selectedDesign.id
      }

      const result = await purchaseGiftCard(purchaseData).unwrap()
      toast.success('Gift card purchased successfully!')
      
      // Reset form
      setSelectedAmount(null)
      setCustomAmount('')
      setRecipientEmail('')
      setRecipientName('')
      setPersonalMessage('')
      setDeliveryDate('')
      setSelectedDesign(GIFT_CARD_DESIGNS[0])
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to purchase gift card')
    }
  }

  const handleRedeem = async () => {
    try {
      if (!redeemCode) {
        toast.error('Gift card code is required')
        return
      }

      await redeemGiftCard({ code: redeemCode }).unwrap()
      toast.success('Gift card redeemed successfully!')
      setRedeemCode('')
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to redeem gift card')
    }
  }

  const handleTransfer = async () => {
    try {
      if (!transferCode || !transferEmail) {
        toast.error('Gift card code and recipient email are required')
        return
      }

      await transferGiftCard({ code: transferCode, newRecipientEmail: transferEmail }).unwrap()
      toast.success('Gift card transferred successfully!')
      setTransferCode('')
      setTransferEmail('')
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to transfer gift card')
    }
  }

  const handleCancel = async (code: string) => {
    try {
      await cancelGiftCard({ code }).unwrap()
      toast.success('Gift card canceled successfully!')
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to cancel gift card')
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard!')
  }

  const getCurrentAmount = () => {
    return selectedAmount || parseFloat(customAmount) || 0
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
      case 'canceled': return 'bg-red-100 text-red-800'
      case 'expired': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Gift className="h-16 w-16 text-purple-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Wiwihood Gift Cards
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Give the gift of beauty and wellness. Perfect for any occasion.
          </p>
        </div>

        <Tabs defaultValue="purchase" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="purchase" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Purchase
            </TabsTrigger>
            <TabsTrigger value="my-cards" className="flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              My Cards
            </TabsTrigger>
            <TabsTrigger value="redeem" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Redeem
            </TabsTrigger>
            <TabsTrigger value="balance" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Check Balance
            </TabsTrigger>
          </TabsList>

          {/* Purchase Tab */}
          <TabsContent value="purchase" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Purchase Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Purchase Gift Card
                  </CardTitle>
                  <CardDescription>
                    Create a beautiful gift card for your loved ones
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Amount Selection */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">Select Amount</Label>
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      {PREDEFINED_AMOUNTS.map((amount) => (
                        <Button
                          key={amount}
                          variant={selectedAmount === amount ? "default" : "outline"}
                          onClick={() => {
                            setSelectedAmount(amount)
                            setCustomAmount('')
                          }}
                          className="h-12"
                        >
                          ${amount}
                        </Button>
                      ))}
                    </div>
                    <div className="relative">
                      <Label htmlFor="custom-amount" className="text-sm text-gray-600">
                        Or enter custom amount
                      </Label>
                      <div className="relative mt-1">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                        <Input
                          id="custom-amount"
                          type="number"
                          placeholder="0.00"
                          value={customAmount}
                          onChange={(e) => {
                            setCustomAmount(e.target.value)
                            setSelectedAmount(null)
                          }}
                          className="pl-8"
                          min="5"
                          step="0.01"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Design Selection */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">Choose Design</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {GIFT_CARD_DESIGNS.map((design) => (
                        <Button
                          key={design.id}
                          variant={selectedDesign.id === design.id ? "default" : "outline"}
                          onClick={() => setSelectedDesign(design)}
                          className="h-16 p-2"
                        >
                          <div className={`w-full h-full rounded bg-gradient-to-r ${design.gradient} flex items-center justify-center text-white text-xs font-medium`}>
                            {design.name}
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Recipient Information */}
                  <div className="space-y-4">
                    <Label className="text-sm font-medium">Recipient Information</Label>
                    <Input
                      placeholder="Recipient Email *"
                      value={recipientEmail}
                      onChange={(e) => setRecipientEmail(e.target.value)}
                      type="email"
                      required
                    />
                    <Input
                      placeholder="Recipient Name (Optional)"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                    />
                  </div>

                  {/* Personal Message */}
                  <div>
                    <Label htmlFor="message" className="text-sm font-medium">
                      Personal Message (Optional)
                    </Label>
                    <Textarea
                      id="message"
                      placeholder="Write a personal message..."
                      value={personalMessage}
                      onChange={(e) => setPersonalMessage(e.target.value)}
                      className="mt-1"
                      rows={3}
                      maxLength={500}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {personalMessage.length}/500 characters
                    </p>
                  </div>

                  {/* Delivery Date */}
                  <div>
                    <Label htmlFor="delivery-date" className="text-sm font-medium">
                      Delivery Date (Optional)
                    </Label>
                    <Input
                      id="delivery-date"
                      type="date"
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      className="mt-1"
                      min={new Date().toISOString().split('T')[0]}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Leave empty to send immediately
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={handlePurchase}
                    disabled={isPurchasing || !getCurrentAmount() || !recipientEmail}
                    className="w-full"
                    size="lg"
                  >
                    {isPurchasing ? 'Processing...' : `Purchase ${formatCurrency(getCurrentAmount())}`}
                  </Button>
                </CardFooter>
              </Card>

              {/* Preview Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Preview</CardTitle>
                  <CardDescription>
                    This is how your gift card will look
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className={`relative h-48 rounded-lg bg-gradient-to-r ${selectedDesign.gradient} p-6 text-white overflow-hidden`}>
                    <div className="absolute top-4 right-4">
                      <Gift className="h-8 w-8 opacity-80" />
                    </div>
                    <div className="flex flex-col justify-between h-full">
                      <div>
                        <h3 className="text-xl font-bold mb-2">Wiwihood Gift Card</h3>
                        <p className="text-sm opacity-90">{selectedDesign.name}</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold">
                          {formatCurrency(getCurrentAmount())}
                        </p>
                        <p className="text-sm opacity-90">
                          To: {recipientName || recipientEmail || 'Recipient'}
                        </p>
                      </div>
                    </div>
                  </div>
                  {personalMessage && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 italic">
                        "{personalMessage}"
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* My Cards Tab */}
          <TabsContent value="my-cards">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5" />
                  My Gift Cards
                </CardTitle>
                <CardDescription>
                  Manage your purchased and received gift cards
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingGiftCards ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                    <p className="text-gray-500 mt-2">Loading your gift cards...</p>
                  </div>
                ) : myGiftCards && myGiftCards.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myGiftCards.map((card: any) => (
                      <Card key={card.id} className="overflow-hidden">
                        <div className={`h-32 bg-gradient-to-r ${
                          GIFT_CARD_DESIGNS.find(d => d.id === card.design)?.gradient || 'from-blue-500 to-purple-600'
                        } p-4 text-white relative`}>
                          <Badge 
                            className={`absolute top-2 right-2 ${getStatusColor(card.status)}`}
                          >
                            {card.status}
                          </Badge>
                          <div className="flex flex-col justify-between h-full">
                            <h3 className="font-bold">Wiwihood</h3>
                            <div>
                              <p className="text-lg font-bold">{formatCurrency(card.currentBalance)}</p>
                              <p className="text-xs opacity-90">of {formatCurrency(card.amount)}</p>
                            </div>
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Code:</span>
                              <div className="flex items-center gap-2">
                                <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                                  {card.code}
                                </code>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => copyToClipboard(card.code)}
                                  className="h-6 w-6 p-0"
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                            {card.recipientEmail && (
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Recipient:</span>
                                <span className="text-sm">{card.recipientEmail}</span>
                              </div>
                            )}
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Expires:</span>
                              <span className="text-sm">
                                {new Date(card.expiryDate).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          
                          {card.status === 'active' && (
                            <div className="flex gap-2 mt-4">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button size="sm" variant="outline" className="flex-1">
                                    <Send className="h-3 w-3 mr-1" />
                                    Transfer
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Transfer Gift Card</DialogTitle>
                                    <DialogDescription>
                                      Transfer this gift card to another person
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <Input
                                      placeholder="New recipient email"
                                      value={transferEmail}
                                      onChange={(e) => setTransferEmail(e.target.value)}
                                      type="email"
                                    />
                                  </div>
                                  <DialogFooter>
                                    <Button
                                      onClick={() => {
                                        setTransferCode(card.code)
                                        handleTransfer()
                                      }}
                                      disabled={isTransferring || !transferEmail}
                                    >
                                      {isTransferring ? 'Transferring...' : 'Transfer'}
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                              
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleCancel(card.code)}
                                disabled={isCanceling}
                                className="flex-1"
                              >
                                <XCircle className="h-3 w-3 mr-1" />
                                Cancel
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Gift className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No gift cards yet</h3>
                    <p className="text-gray-500 mb-6">Purchase your first gift card to get started</p>
                    <Button onClick={() => window.location.hash = 'purchase'}>
                      Purchase Gift Card
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Redeem Tab */}
          <TabsContent value="redeem">
            <Card className="max-w-md mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Redeem Gift Card
                </CardTitle>
                <CardDescription>
                  Add a gift card to your account balance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="redeem-code">Gift Card Code</Label>
                  <Input
                    id="redeem-code"
                    placeholder="Enter gift card code"
                    value={redeemCode}
                    onChange={(e) => setRedeemCode(e.target.value.toUpperCase())}
                    className="mt-1"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleRedeem}
                  disabled={isRedeeming || !redeemCode}
                  className="w-full"
                >
                  {isRedeeming ? 'Redeeming...' : 'Redeem Gift Card'}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Check Balance Tab */}
          <TabsContent value="balance">
            <Card className="max-w-md mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Check Balance
                </CardTitle>
                <CardDescription>
                  Check the remaining balance on a gift card
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="balance-code">Gift Card Code</Label>
                  <Input
                    id="balance-code"
                    placeholder="Enter gift card code"
                    value={checkBalanceCode}
                    onChange={(e) => setCheckBalanceCode(e.target.value.toUpperCase())}
                    className="mt-1"
                  />
                </div>
                
                {isCheckingBalance && (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mx-auto"></div>
                    <p className="text-sm text-gray-500 mt-2">Checking balance...</p>
                  </div>
                )}
                
                {balanceData && (
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="font-medium text-green-800">Valid Gift Card</span>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Current Balance:</span>
                        <span className="font-bold">{formatCurrency(balanceData.currentBalance)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Original Amount:</span>
                        <span>{formatCurrency(balanceData.amount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Status:</span>
                        <Badge className={getStatusColor(balanceData.status)}>
                          {balanceData.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Expires:</span>
                        <span>{new Date(balanceData.expiryDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}