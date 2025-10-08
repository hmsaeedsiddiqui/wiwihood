"use client";
import React, { useState, useEffect } from "react";
import { ShoppingBag, Package, Truck, CheckCircle, Clock, AlertCircle, Search, Filter, Eye, Download } from "lucide-react";
import QRTIntegration from "@/utils/qrtIntegration";

interface ProductOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  orderDate: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount: number;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  items: OrderItem[];
  shippingAddress: string;
  trackingNumber?: string;
  notes?: string;
}

interface OrderItem {
  id: string;
  productName: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  sku?: string;
  image?: string;
}

export default function ProductOrdersPage() {
  const [orders, setOrders] = useState<ProductOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<ProductOrder | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      console.log('🛍️ QRT: Loading product orders...');
      
      // Mock data - replace with real API call
      const ordersData = [
        {
          id: 'ORD-001',
          orderNumber: 'WW-2024-001',
          customerName: 'Sarah Johnson',
          customerEmail: 'sarah.johnson@email.com',
          customerPhone: '+971 50 123 4567',
          orderDate: '2024-10-07T10:30:00Z',
          status: 'delivered' as const,
          totalAmount: 285.50,
          paymentStatus: 'paid' as const,
          shippingAddress: 'Apt 401, Marina Plaza, Dubai Marina, Dubai, UAE',
          trackingNumber: 'TRK123456789',
          items: [
            {
              id: 'ITEM-001',
              productName: 'Professional Hair Serum',
              productId: 'PROD-HS-001',
              quantity: 2,
              unitPrice: 75.00,
              totalPrice: 150.00,
              sku: 'HS-001',
              image: '/images/hair-serum.jpg'
            },
            {
              id: 'ITEM-002',
              productName: 'Nail Care Kit',
              productId: 'PROD-NC-002',
              quantity: 1,
              unitPrice: 135.50,
              totalPrice: 135.50,
              sku: 'NC-002',
              image: '/images/nail-kit.jpg'
            }
          ]
        },
        {
          id: 'ORD-002',
          orderNumber: 'WW-2024-002',
          customerName: 'Emma Wilson',
          customerEmail: 'emma.wilson@email.com',
          customerPhone: '+971 50 765 4321',
          orderDate: '2024-10-06T14:15:00Z',
          status: 'shipped' as const,
          totalAmount: 195.00,
          paymentStatus: 'paid' as const,
          shippingAddress: 'Villa 123, Jumeirah Beach Road, Dubai, UAE',
          trackingNumber: 'TRK987654321',
          items: [
            {
              id: 'ITEM-003',
              productName: 'Luxury Face Mask Set',
              productId: 'PROD-FM-003',
              quantity: 1,
              unitPrice: 195.00,
              totalPrice: 195.00,
              sku: 'FM-003'
            }
          ]
        },
        {
          id: 'ORD-003',
          orderNumber: 'WW-2024-003',
          customerName: 'Mike Chen',
          customerEmail: 'mike.chen@email.com',
          customerPhone: '+971 50 999 8888',
          orderDate: '2024-10-05T09:45:00Z',
          status: 'processing' as const,
          totalAmount: 89.99,
          paymentStatus: 'paid' as const,
          shippingAddress: 'Office 502, Business Bay Tower, Dubai, UAE',
          items: [
            {
              id: 'ITEM-004',
              productName: 'Beard Grooming Kit',
              productId: 'PROD-BG-004',
              quantity: 1,
              unitPrice: 89.99,
              totalPrice: 89.99,
              sku: 'BG-004'
            }
          ]
        },
        {
          id: 'ORD-004',
          orderNumber: 'WW-2024-004',
          customerName: 'Lisa Ahmed',
          customerEmail: 'lisa.ahmed@email.com',
          customerPhone: '+971 50 111 2222',
          orderDate: '2024-10-04T16:20:00Z',
          status: 'pending' as const,
          totalAmount: 320.00,
          paymentStatus: 'pending' as const,
          shippingAddress: 'Apartment 15B, Downtown Dubai, Dubai, UAE',
          items: [
            {
              id: 'ITEM-005',
              productName: 'Premium Skincare Bundle',
              productId: 'PROD-SC-005',
              quantity: 1,
              unitPrice: 320.00,
              totalPrice: 320.00,
              sku: 'SC-005'
            }
          ]
        }
      ];
      
      setOrders(ordersData);
      console.log('✅ QRT: Orders loaded successfully');
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'processing': return <Package className="h-4 w-4" />;
      case 'shipped': return <Truck className="h-4 w-4" />;
      case 'delivered': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-purple-100 text-purple-800';
      case 'shipped': return 'bg-orange-100 text-orange-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status: newStatus as any } : order
      ));
      console.log('✅ Order status updated');
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-2">
            <ShoppingBag className="h-8 w-8 text-purple-500 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Product Orders</h1>
          </div>
          <p className="text-gray-600">Manage customer product orders and shipments</p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by order number, customer name, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <div className="flex items-center gap-4">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="all">All Orders</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-full">
                <ShoppingBag className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="bg-yellow-100 p-3 rounded-full">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orders.filter(o => o.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="bg-orange-100 p-3 rounded-full">
                <Truck className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Shipped</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orders.filter(o => o.status === 'shipped').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Delivered</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orders.filter(o => o.status === 'delivered').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-full">
                <span className="text-purple-600 font-bold">AED</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orders.reduce((sum, order) => sum + order.totalAmount, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-500">
                {searchTerm ? 'Try adjusting your search criteria.' : 'Customer product orders will appear here.'}
              </p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 mr-4">
                        Order #{order.orderNumber}
                      </h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1">{order.status}</span>
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ml-2 ${getPaymentStatusColor(order.paymentStatus)}`}>
                        {order.paymentStatus}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="text-gray-600">
                        <span className="font-medium">Customer:</span> {order.customerName}
                      </div>
                      <div className="text-gray-600">
                        <span className="font-medium">Date:</span> {new Date(order.orderDate).toLocaleDateString()}
                      </div>
                      <div className="text-gray-600">
                        <span className="font-medium">Total:</span> AED {order.totalAmount.toFixed(2)}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="text-gray-600">
                        <span className="font-medium">Items:</span> {order.items.length} product(s)
                      </div>
                      {order.trackingNumber && (
                        <div className="text-gray-600">
                          <span className="font-medium">Tracking:</span> {order.trackingNumber}
                        </div>
                      )}
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">Items:</h4>
                      <div className="space-y-2">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex justify-between items-center text-sm">
                            <span className="text-gray-700">
                              {item.productName} x{item.quantity}
                            </span>
                            <span className="font-medium text-gray-900">
                              AED {item.totalPrice.toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 ml-6">
                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        setShowDetails(true);
                      }}
                      className="flex items-center px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </button>
                    <button className="flex items-center px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm">
                      <Download className="h-4 w-4 mr-1" />
                      Invoice
                    </button>
                    {order.status === 'pending' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'confirmed')}
                        className="px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm"
                      >
                        Confirm
                      </button>
                    )}
                    {order.status === 'confirmed' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'processing')}
                        className="px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm"
                      >
                        Process
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}