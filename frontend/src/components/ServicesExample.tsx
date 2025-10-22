import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  useServices, 
  useCreateService, 
  useSearchServices,
  usePopularServices,
  useProviderServices 
} from '../hooks/useServices'
import type { CreateServiceRequest, ServiceFilterRequest } from '../store/api/servicesApi'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query/react'
import type { SerializedError } from '@reduxjs/toolkit'

// Utility function to safely extract error messages from RTK Query errors
const getErrorMessage = (error: FetchBaseQueryError | SerializedError | any): string => {
  if ('message' in error && error.message) {
    return error.message
  }
  if ('data' in error && error.data) {
    if (typeof error.data === 'string') {
      return error.data
    }
    if (typeof error.data === 'object' && error.data !== null && 'message' in error.data) {
      return (error.data as any).message
    }
  }
  if ('status' in error) {
    return `Error ${error.status}: Failed to load services`
  }
  return 'An unexpected error occurred'
}

export default function ServicesExample() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<ServiceFilterRequest>({})
  const [showCreateForm, setShowCreateForm] = useState(false)
  
  // Use the custom hooks
  const { services, isLoading, error, refetch } = useServices(filters)
  const { services: searchResults, isLoading: searching } = useSearchServices(searchQuery, filters)
  const { services: popularServices } = usePopularServices(5)
  const { createService, isLoading: creating } = useCreateService()

  // Sample provider ID - you would get this from your auth state or props
  const providerId = "your-provider-id" // Replace with actual provider ID

  const handleCreateService = async (serviceData: CreateServiceRequest) => {
    try {
      await createService(providerId, serviceData)
      setShowCreateForm(false)
      refetch() // Refresh the services list
    } catch (error) {
      console.error('Failed to create service:', error)
    }
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleFilterChange = (newFilters: Partial<ServiceFilterRequest>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <h3 className="text-red-800 font-medium">Error loading services</h3>
        <p className="text-red-600">{getErrorMessage(error)}</p>
        <button
          onClick={refetch}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Services Dashboard</h1>
        
        {/* Search and Filters */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search Services
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search services..."
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={filters.categoryId || ''}
                onChange={(e) => handleFilterChange({ categoryId: e.target.value || undefined })}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Categories</option>
                <option value="cat1">Hair Services</option>
                <option value="cat2">Beauty Services</option>
                <option value="cat3">Wellness</option>
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Price
              </label>
              <input
                type="number"
                value={filters.maxPrice || ''}
                onChange={(e) => handleFilterChange({ maxPrice: e.target.value ? Number(e.target.value) : undefined })}
                placeholder="Max price"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="mt-4 flex space-x-2">
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Add New Service
            </button>
            
            <button
              onClick={() => {
                setFilters({})
                setSearchQuery('')
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Popular Services */}
        {popularServices.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Popular Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {popularServices.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          </div>
        )}

        {/* Search Results or All Services */}
        <div>
          <h2 className="text-xl font-semibold mb-3">
            {searchQuery ? `Search Results (${searching ? 'Searching...' : searchResults.length})` : `All Services (${services.length})`}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(searchQuery ? searchResults : services).map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>

          {(searchQuery ? searchResults : services).length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">
                {searchQuery ? 'No services found matching your search.' : 'No services available.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Create Service Modal */}
      {showCreateForm && (
        <CreateServiceModal
          onSubmit={handleCreateService}
          onClose={() => setShowCreateForm(false)}
          isLoading={creating}
        />
      )}
    </div>
  )
}

// Service Card Component
function ServiceCard({ service }: { service: any }) {
  const router = useRouter()
  
  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-105"
      onClick={() => router.push(`/services/${service.id}`)}
    >
      {service.images && service.images.length > 0 && (
        <img
          src={service.images[0]}
          alt={service.name}
          className="w-full h-48 object-cover transition-transform duration-300 hover:scale-110"
        />
      )}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 hover:text-blue-600 transition-colors">{service.name}</h3>
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{service.shortDescription}</p>
        
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-blue-600">${service.price}</span>
          <span className="text-sm text-gray-500">{service.duration} min</span>
        </div>
        
        <div className="mt-2 flex items-center justify-between">
          <span className={`px-2 py-1 text-xs rounded-full ${
            service.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {service.isActive ? 'Active' : 'Inactive'}
          </span>
          
          {service.averageRating && (
            <span className="text-sm text-gray-600">
              ⭐ {service.averageRating.toFixed(1)} ({service.totalReviews})
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

// Create Service Modal Component
function CreateServiceModal({ 
  onSubmit, 
  onClose, 
  isLoading 
}: { 
  onSubmit: (data: CreateServiceRequest) => void
  onClose: () => void
  isLoading: boolean 
}) {
  const [formData, setFormData] = useState<CreateServiceRequest>({
    name: '',
    description: '',
    shortDescription: '',
    categoryId: '',
    serviceType: 'appointment',
    price: 0,
    duration: 60,
    isActive: true,
    isOnlineBookingEnabled: true
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-96 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Create New Service</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Service Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Short Description</label>
            <input
              type="text"
              value={formData.shortDescription}
              onChange={(e) => setFormData({...formData, shortDescription: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Price ($)</label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
              className="w-full p-2 border rounded"
              required
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Duration (minutes)</label>
            <input
              type="number"
              value={formData.duration}
              onChange={(e) => setFormData({...formData, duration: Number(e.target.value)})}
              className="w-full p-2 border rounded"
              required
              min="1"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Creating...' : 'Create Service'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}