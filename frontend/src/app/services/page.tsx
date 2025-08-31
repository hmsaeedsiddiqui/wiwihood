'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Search, 
  Filter, 
  MapPin, 
  Star, 
  Clock, 
  DollarSign,
  Grid,
  List,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react'

import type { Service as ApiServiceType } from '@/lib/api';
type Service = ApiServiceType;

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 1000 })
  const [sortBy, setSortBy] = useState<'price' | 'rating' | 'popularity'>('popularity')

  // API integration
  useEffect(() => {
    async function fetchServices() {
      setLoading(true);
      try {
        // Fetch all services (optionally add filters)
        const result = await (await import('@/lib/api')).apiService.getServices();
        setServices(result.data || result);
      } catch (e) {
        setServices([]);
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, []);

  const categories = [
    { id: 1, name: 'Beauty & Wellness' },
    { id: 2, name: 'Cleaning Services' },
    { id: 3, name: 'Health & Fitness' },
    { id: 4, name: 'Home Services' },
    { id: 5, name: 'Professional Services' }
  ]

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.provider.businessName.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCategory = !selectedCategory || service.category.id === selectedCategory
    const matchesPrice = service.basePrice >= priceRange.min && service.basePrice <= priceRange.max
    
    return matchesSearch && matchesCategory && matchesPrice
  })

  const ServiceCard = ({ service }: { service: Service }) => (
    <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-0 shadow-md">
      <div className="relative overflow-hidden">
        <div className="h-48 bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center">
          <div className="text-6xl font-bold text-blue-600/20">
            {service.category.name.charAt(0)}
          </div>
        </div>
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 text-sm font-semibold text-green-700">
          
        </div>
      </div>
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              {service.name}
            </CardTitle>
            <CardDescription className="text-sm text-gray-600 mt-1">
              {service.provider.businessName}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {service.description}
        </p>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-gray-500">
              <Clock className="w-4 h-4 mr-1" />
              {service.duration} min
            </div>
            <div className="flex items-center text-yellow-600">
              <Star className="w-4 h-4 mr-1 fill-current" />
              {service.provider.averageRating} ({service.provider.totalReviews})
            </div>
          </div>
          
          {service.provider.businessAddress && (
            <div className="flex items-center text-gray-500 text-sm">
              <MapPin className="w-4 h-4 mr-1" />
              {service.provider.businessAddress}
            </div>
          )}
          
          <div className="flex items-center justify-between pt-2">
            <span className="text-sm text-gray-500">{service.category.name}</span>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              Book Now
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const ServiceListItem = ({ service }: { service: Service }) => (
    <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-lg flex items-center justify-center flex-shrink-0">
            <div className="text-2xl font-bold text-blue-600/40">
              {service.category.name.charAt(0)}
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {service.name}
                </h3>
                <p className="text-sm text-gray-600 mb-2">{service.provider.businessName}</p>
                <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                  {service.description}
                </p>
                
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {service.duration} min
                  </div>
                  <div className="flex items-center text-yellow-600">
                    <Star className="w-4 h-4 mr-1 fill-current" />
                    {service.provider.averageRating} ({service.provider.totalReviews})
                  </div>
                  {service.provider.businessAddress && (
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {service.provider.businessAddress}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900 mb-2">
                  
                </div>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  Book Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Find Professional Services
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Discover verified service providers in your area. Book instantly and manage everything in one place.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search for services, providers, or categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 h-14 text-lg border-2 border-gray-200 focus:border-blue-500 rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters and Controls */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Category Filter */}
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">Categories:</span>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedCategory === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(null)}
                >
                  All
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === String(category.id) ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(String(category.id))}
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* View Controls */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="popularity">Popularity</option>
                  <option value="price">Price</option>
                  <option value="rating">Rating</option>
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

      {/* Services Grid/List */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Loading services...</p>
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No services found</h3>
              <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-semibold text-gray-900">
                  {filteredServices.length} Services Available
                </h2>
                <p className="text-gray-600">
                  Showing results for "{searchQuery || 'all services'}"
                </p>
              </div>

              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredServices.map((service) => (
                    <ServiceCard key={service.id} service={service} />
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredServices.map((service) => (
                    <ServiceListItem key={service.id} service={service} />
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
