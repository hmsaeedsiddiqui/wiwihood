"use client";
import React, { useState, useEffect } from "react";
import { Heart, Star, Calendar, MapPin, Phone, Filter, Search } from "lucide-react";
import QRTIntegration from "@/utils/qrtIntegration";

interface FavoriteCustomer {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  lastBooking: string;
  totalBookings: number;
  totalSpent: number;
  favoriteService: string;
  rating: number;
  notes: string;
  addedDate: string;
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      console.log('🤝 QRT: Loading favorite customers...');
      
      // Mock data - replace with real API call
      const favoritesData = [
        {
          id: 'FAV-001',
          customerName: 'Sarah Johnson',
          customerEmail: 'sarah.johnson@email.com',
          customerPhone: '+971 50 123 4567',
          lastBooking: '2024-10-05',
          totalBookings: 12,
          totalSpent: 1240,
          favoriteService: 'Hair Cut & Style',
          rating: 5,
          notes: 'Prefers afternoon appointments, allergic to certain hair products',
          addedDate: '2024-08-15'
        },
        {
          id: 'FAV-002',
          customerName: 'Emma Wilson',
          customerEmail: 'emma.wilson@email.com',
          customerPhone: '+971 50 765 4321',
          lastBooking: '2024-10-07',
          totalBookings: 8,
          totalSpent: 890,
          favoriteService: 'Nail Art',
          rating: 5,
          notes: 'Regular customer, loves creative nail designs',
          addedDate: '2024-09-01'
        },
        {
          id: 'FAV-003',
          customerName: 'Mike Chen',
          customerEmail: 'mike.chen@email.com',
          customerPhone: '+971 50 999 8888',
          lastBooking: '2024-09-28',
          totalBookings: 6,
          totalSpent: 720,
          favoriteService: 'Deep Conditioning Treatment',
          rating: 4,
          notes: 'Business client, usually books during lunch hours',
          addedDate: '2024-07-20'
        }
      ];
      
      setFavorites(favoritesData);
      console.log('✅ QRT: Favorites loaded successfully');
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (customerId: string) => {
    try {
      if (confirm('Are you sure you want to remove this customer from favorites?')) {
        setFavorites(prev => prev.filter(fav => fav.id !== customerId));
        console.log('✅ Customer removed from favorites');
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  const filteredFavorites = favorites.filter(favorite => {
    const matchesSearch = favorite.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         favorite.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         favorite.favoriteService.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterBy === 'all' || 
                         (filterBy === 'recent' && new Date(favorite.lastBooking) > new Date(Date.now() - 30*24*60*60*1000)) ||
                         (filterBy === 'high-value' && favorite.totalSpent > 500) ||
                         (filterBy === 'frequent' && favorite.totalBookings > 5);
    
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading favorite customers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-2">
            <Heart className="h-8 w-8 text-red-500 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Favorite Customers</h1>
          </div>
          <p className="text-gray-600">Manage your VIP customers and loyal clients</p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search customers by name, email, or service..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <div className="flex items-center gap-4">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="all">All Favorites</option>
                <option value="recent">Recent Bookings</option>
                <option value="high-value">High Value</option>
                <option value="frequent">Frequent Visitors</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="bg-red-100 p-3 rounded-full">
                <Heart className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Favorites</p>
                <p className="text-2xl font-bold text-gray-900">{favorites.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">
                  {favorites.reduce((sum, fav) => sum + fav.totalBookings, 0)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-full">
                <Star className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(favorites.reduce((sum, fav) => sum + fav.rating, 0) / favorites.length).toFixed(1)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="bg-yellow-100 p-3 rounded-full">
                <span className="text-yellow-600 font-bold">AED</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  {favorites.reduce((sum, fav) => sum + fav.totalSpent, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Favorites List */}
        <div className="space-y-4">
          {filteredFavorites.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No favorite customers found</h3>
              <p className="text-gray-500">
                {searchTerm ? 'Try adjusting your search criteria.' : 'Start adding customers to your favorites list!'}
              </p>
            </div>
          ) : (
            filteredFavorites.map((favorite) => (
              <div key={favorite.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 mr-3">{favorite.customerName}</h3>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < favorite.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center text-gray-600">
                        <Phone className="h-4 w-4 mr-2" />
                        <span className="text-sm">{favorite.customerPhone}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span className="text-sm">Last: {new Date(favorite.lastBooking).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Star className="h-4 w-4 mr-2" />
                        <span className="text-sm">Favorite: {favorite.favoriteService}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 mb-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {favorite.totalBookings} bookings
                      </span>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        AED {favorite.totalSpent.toLocaleString()} spent
                      </span>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Added {new Date(favorite.addedDate).toLocaleDateString()}
                      </span>
                    </div>

                    {favorite.notes && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Notes:</span> {favorite.notes}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-2 ml-6">
                    <button
                      onClick={() => window.open(`tel:${favorite.customerPhone}`, '_self')}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                    >
                      Call
                    </button>
                    <button
                      onClick={() => window.open(`mailto:${favorite.customerEmail}`, '_self')}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                    >
                      Email
                    </button>
                    <button
                      onClick={() => removeFavorite(favorite.id)}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                    >
                      Remove
                    </button>
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