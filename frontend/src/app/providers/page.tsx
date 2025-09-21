'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Search, 
  MapPin, 
  Star, 
  Clock, 
  Verified,
  Filter,
  Grid,
  List,
  Phone,
  Mail,
  Globe,
  Heart,
  Share
} from 'lucide-react'
import { CloudinaryImage } from '@/components/CloudinaryImage'
import Link from 'next/link';

import type { Provider } from '@/lib/api';

export default function ProvidersPage() {
  const [providers, setProviders] = useState<Provider[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedLocation, setSelectedLocation] = useState<string>('')
  const [minRating, setMinRating] = useState<number>(0)
  const [sortBy, setSortBy] = useState<'rating' | 'reviews' | 'name'>('rating')

  // API integration
  useEffect(() => {
    async function fetchProviders() {
      setLoading(true);
      try {
        const { apiService } = await import('@/lib/api');
        const result = await apiService.getProviders();
        setProviders(result.data || []);
      } catch (e) {
        setProviders([]);
      } finally {
        setLoading(false);
      }
    }
    fetchProviders();
  }, []);

  const filteredProviders = providers.filter(provider => {
    const matchesSearch = provider.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         provider.businessDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         provider.services.some(service => 
                           service.name.toLowerCase().includes(searchQuery.toLowerCase())
                         )
    
    const matchesLocation = !selectedLocation || 
                           provider.businessCity.toLowerCase().includes(selectedLocation.toLowerCase())
    
    const matchesRating = provider.averageRating >= minRating
    
    return matchesSearch && matchesLocation && matchesRating
  }).sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.averageRating - a.averageRating
      case 'reviews':
        return b.totalReviews - a.totalReviews
      case 'name':
        return a.businessName.localeCompare(b.businessName)
      default:
        return 0
    }
  })

  const ProviderCard = ({ provider }: { provider: Provider }) => {
    return (
      <Link key={provider.id} href={`/providers/${provider.id}`} style={{ textDecoration: 'none' }}>
        <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-0 shadow-md">
          <div className="relative">
            {/* Cover Image */}
            <div className="h-48 overflow-hidden">
              {provider.coverImagePublicId ? (
                <CloudinaryImage
                  publicId={provider.coverImagePublicId}
                  alt={`${provider.businessName} cover`}
                  width={400}
                  height={192}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="h-full bg-gradient-to-br from-blue-50 to-indigo-100"></div>
              )}
              {/* Overlay with provider info */}
              <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-md overflow-hidden">
                    {provider.logoPublicId ? (
                      <CloudinaryImage
                        publicId={provider.logoPublicId}
                        alt={`${provider.businessName} logo`}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl font-bold text-blue-600">
                        {provider.businessName.charAt(0)}
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-white text-lg drop-shadow-md">{provider.businessName}</h3>
                </div>
              </div>
            </div>
            {provider.isVerified && (
              <div className="absolute top-4 right-4 bg-green-500 text-white rounded-full p-1">
                <Verified className="w-4 h-4" />
              </div>
            )}
          </div>
          <CardContent className="p-6">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center text-yellow-600">
                  <Star className="w-4 h-4 mr-1 fill-current" />
                  <span className="font-semibold">{provider.averageRating}</span>
                  <span className="text-gray-500 text-sm ml-1">({provider.totalReviews})</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Heart className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Share className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                {provider.businessDescription}
              </p>
              <div className="flex items-center text-gray-500 text-sm mb-3">
                <MapPin className="w-4 h-4 mr-1" />
                {provider.businessAddress}, {provider.businessCity}
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Services Offered:</h4>
                <div className="space-y-1">
                  {provider.services.slice(0, 3).map((service) => (
                    <div key={service.id} className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{service.name}</span>
                      <span className="font-medium text-gray-900"></span>
                    </div>
                  ))}
                  {provider.services.length > 3 && (
                    <p className="text-sm text-blue-600">+{provider.services.length - 3} more services</p>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <Button variant="outline" size="sm">
                  View Profile
                </Button>
                <Button 
                  size="sm" 
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (provider.services.length > 0) {
                      window.location.href = `/book-service?serviceId=${provider.services[0].id}&providerId=${provider.id}`;
                    } else {
                      window.location.href = `/shop/${provider.id}`;
                    }
                  }}
                >
                  Book Now
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  };

  const ProviderListItem = ({ provider }: { provider: Provider }) => (
    <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
      <CardContent className="p-6">
        <div className="flex items-start space-x-6">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-lg flex items-center justify-center flex-shrink-0 relative">
            <span className="text-2xl font-bold text-blue-600/60">
              {provider.businessName.charAt(0)}
            </span>
            {provider.isVerified && (
              <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1">
                <Verified className="w-3 h-3" />
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {provider.businessName}
                </h3>
                
                <div className="flex items-center mt-1 mb-3">
                  <div className="flex items-center text-yellow-600 mr-4">
                    <Star className="w-4 h-4 mr-1 fill-current" />
                    <span className="font-semibold">{provider.averageRating}</span>
                    <span className="text-gray-500 text-sm ml-1">({provider.totalReviews} reviews)</span>
                  </div>
                  <div className="flex items-center text-gray-500 text-sm">
                    <MapPin className="w-4 h-4 mr-1" />
                    {provider.businessCity}
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                  {provider.businessDescription}
                </p>
                
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  {provider.businessPhoneNumber && (
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-1" />
                      {provider.businessPhoneNumber}
                    </div>
                  )}
                  {provider.businessEmail && (
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-1" />
                      {provider.businessEmail}
                    </div>
                  )}
                  {provider.websiteUrl && (
                    <div className="flex items-center">
                      <Globe className="w-4 h-4 mr-1" />
                      Website
                    </div>
                  )}
                </div>
              </div>
              
              <div className="text-right ml-6">
                <div className="mb-3">
                  <p className="text-sm text-gray-500">Starting from</p>
                  <p className="text-2xl font-bold text-gray-900">
                    
                  </p>
                </div>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full">
                    View Profile
                  </Button>
                  <Button 
                    size="sm" 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (provider.services.length > 0) {
                        window.location.href = `/book-service?serviceId=${provider.services[0].id}&providerId=${provider.id}`;
                      } else {
                        window.location.href = `/shop/${provider.id}`;
                      }
                    }}
                  >
                    Book Now
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const locations = ['Downtown', 'Midtown', 'Uptown', 'Spa District', 'Industrial']
  const ratings = [0, 3, 4, 4.5]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Find Professional Service Providers
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Connect with verified professionals in your area. Browse portfolios, read reviews, and book services instantly.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search providers, services, or specialties..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 h-14 text-lg border-2 border-gray-200 focus:border-blue-500 rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">Location:</span>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Locations</option>
                  {locations.map((location) => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">Min Rating:</span>
                <select
                  value={minRating}
                  onChange={(e) => setMinRating(Number(e.target.value))}
                  className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {ratings.map((rating) => (
                    <option key={rating} value={rating}>
                      {rating === 0 ? 'Any Rating' : `${rating}+ Stars`}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="rating">Highest Rated</option>
                  <option value="reviews">Most Reviews</option>
                  <option value="name">Name A-Z</option>
                </select>
              </div>
              
              <div className="flex items-center border border-gray-300 rounded-md">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Providers Grid/List */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Loading providers...</p>
            </div>
          ) : filteredProviders.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No providers found</h3>
              <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-semibold text-gray-900">
                  {filteredProviders.length} Providers Available
                </h2>
                <p className="text-gray-600">
                  {searchQuery && `Results for "${searchQuery}"`}
                </p>
              </div>

              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredProviders.map((provider) => (
                    <ProviderCard key={provider.id} provider={provider} />
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredProviders.map((provider) => (
                    <ProviderListItem key={provider.id} provider={provider} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  )
}
