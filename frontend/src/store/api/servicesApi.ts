import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Base URL for API - adjust according to your backend URL
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

// Service types based on your backend DTOs
export interface CreateServiceRequest {
  name: string
  description: string
  shortDescription: string
  categoryId: string
  serviceType?: 'appointment' | 'package' | 'consultation'
  pricingType?: 'fixed' | 'hourly' | 'variable'
  basePrice: number
  currency?: string
  durationMinutes: number
  bufferTimeMinutes?: number
  maxAdvanceBookingDays?: number
  minAdvanceBookingHours?: number
  cancellationPolicyHours?: number
  requiresDeposit?: boolean
  depositAmount?: number
  images?: string[]
  tags?: string[]
  preparationInstructions?: string
  isActive?: boolean
  status?: 'active' | 'inactive' | 'draft'
}

export interface UpdateServiceRequest extends Partial<CreateServiceRequest> {}

export interface ServiceFilterRequest {
  search?: string
  categoryId?: string
  providerId?: string
  minPrice?: number
  maxPrice?: number
  isActive?: boolean
  status?: 'active' | 'inactive' | 'draft'
  page?: number
  limit?: number
}

export interface Service {
  id: string
  name: string
  description: string
  shortDescription: string
  categoryId: string
  providerId: string
  serviceType: 'appointment' | 'package' | 'consultation'
  pricingType: 'fixed' | 'hourly' | 'variable'
  basePrice: number
  currency: string
  durationMinutes: number
  bufferTimeMinutes: number
  maxAdvanceBookingDays: number
  minAdvanceBookingHours: number
  cancellationPolicyHours: number
  requiresDeposit: boolean
  depositAmount?: number
  images?: string[]
  imagesPublicIds?: string[]
  tags?: string[]
  preparationInstructions?: string
  aftercareInstructions?: string
  isOnline: boolean
  status: 'active' | 'inactive' | 'draft'
  isActive: boolean
  isFeatured: boolean
  sortOrder: number
  totalBookings: number
  averageRating?: number
  totalReviews: number
  metaTitle?: string
  metaDescription?: string
  createdAt: string
  updatedAt: string
  // Relations
  category?: any
  provider?: any
  bookings?: any[]
  // Virtual properties
  formattedPrice?: string
  formattedDuration?: string
}

export interface ApiError {
  message: string
  statusCode: number
  error?: string
}

// Create RTK Query API slice for services
export const servicesApi = createApi({
  reducerPath: 'servicesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/services`,
    prepareHeaders: (headers, { getState }) => {
      // Get token from localStorage
      const token = typeof window !== 'undefined' 
        ? localStorage.getItem('accessToken') 
        : null
      
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      
      headers.set('content-type', 'application/json')
      return headers
    },
  }),
  tagTypes: ['Service', 'Services'],
  endpoints: (builder) => ({
    // Create service (requires providerId)
    createService: builder.mutation<Service, { providerId: string; serviceData: CreateServiceRequest }>({
      query: ({ providerId, serviceData }) => ({
        url: `/provider/${providerId}`,
        method: 'POST',
        body: serviceData,
      }),
      invalidatesTags: ['Services'],
      transformErrorResponse: (response: any) => ({
        message: response?.data?.message || 'Failed to create service',
        statusCode: typeof response.status === 'number' ? response.status : 500,
        error: response?.data?.error
      } as ApiError)
    }),

    // Get all services with filters
    getServices: builder.query<Service[], ServiceFilterRequest>({
      query: (filters = {}) => {
        const params = new URLSearchParams()
        
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            params.append(key, value.toString())
          }
        })
        
        return {
          url: `?${params.toString()}`,
          method: 'GET',
        }
      },
      providesTags: ['Services'],
      transformErrorResponse: (response: any) => ({
        message: response?.data?.message || 'Failed to fetch services',
        statusCode: typeof response.status === 'number' ? response.status : 500,
        error: response?.data?.error
      } as ApiError)
    }),

    // Search services
    searchServices: builder.query<Service[], { query: string; filters?: ServiceFilterRequest }>({
      query: ({ query, filters = {} }) => {
        const params = new URLSearchParams({ q: query })
        
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            params.append(key, value.toString())
          }
        })
        
        return {
          url: `/search?${params.toString()}`,
          method: 'GET',
        }
      },
      providesTags: ['Services'],
      transformErrorResponse: (response: any) => ({
        message: response?.data?.message || 'Search failed',
        statusCode: typeof response.status === 'number' ? response.status : 500,
        error: response?.data?.error
      } as ApiError)
    }),

    // Get popular services
    getPopularServices: builder.query<Service[], { limit?: number }>({
      query: ({ limit = 10 } = {}) => ({
        url: `/popular?limit=${limit}`,
        method: 'GET',
      }),
      providesTags: ['Services'],
      transformErrorResponse: (response: any) => ({
        message: response?.data?.message || 'Failed to fetch popular services',
        statusCode: typeof response.status === 'number' ? response.status : 500,
        error: response?.data?.error
      } as ApiError)
    }),

    // Get service by ID
    getServiceById: builder.query<Service, string>({
      query: (id) => ({
        url: `/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Service', id }],
      transformErrorResponse: (response: any) => ({
        message: response?.data?.message || 'Failed to fetch service',
        statusCode: typeof response.status === 'number' ? response.status : 500,
        error: response?.data?.error
      } as ApiError)
    }),

    // Update service
    updateService: builder.mutation<Service, { id: string; serviceData: UpdateServiceRequest }>({
      query: ({ id, serviceData }) => ({
        url: `/${id}`,
        method: 'PATCH',
        body: serviceData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Service', id },
        'Services'
      ],
      transformErrorResponse: (response: any) => ({
        message: response?.data?.message || 'Failed to update service',
        statusCode: typeof response.status === 'number' ? response.status : 500,
        error: response?.data?.error
      } as ApiError)
    }),

    // Delete service
    deleteService: builder.mutation<void, string>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Service', id },
        'Services'
      ],
      transformErrorResponse: (response: any) => ({
        message: response?.data?.message || 'Failed to delete service',
        statusCode: typeof response.status === 'number' ? response.status : 500,
        error: response?.data?.error
      } as ApiError)
    }),

    // Get services by provider
    getServicesByProvider: builder.query<Service[], { providerId: string; filters?: ServiceFilterRequest }>({
      query: ({ providerId, filters = {} }) => {
        const params = new URLSearchParams()
        
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            params.append(key, value.toString())
          }
        })
        
        const queryString = params.toString()
        return {
          url: `/provider/${providerId}${queryString ? `?${queryString}` : ''}`,
          method: 'GET',
        }
      },
      providesTags: ['Services'],
      transformErrorResponse: (response: any) => ({
        message: response?.data?.message || 'Failed to fetch provider services',
        statusCode: typeof response.status === 'number' ? response.status : 500,
        error: response?.data?.error
      } as ApiError)
    }),

    // Get services by category
    getServicesByCategory: builder.query<Service[], { categoryId: string; filters?: ServiceFilterRequest }>({
      query: ({ categoryId, filters = {} }) => {
        const params = new URLSearchParams()
        
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            params.append(key, value.toString())
          }
        })
        
        const queryString = params.toString()
        return {
          url: `/category/${categoryId}${queryString ? `?${queryString}` : ''}`,
          method: 'GET',
        }
      },
      providesTags: ['Services'],
      transformErrorResponse: (response: any) => ({
        message: response?.data?.message || 'Failed to fetch category services',
        statusCode: typeof response.status === 'number' ? response.status : 500,
        error: response?.data?.error
      } as ApiError)
    }),
  }),
})

// Export hooks for usage in functional components
export const {
  useCreateServiceMutation,
  useGetServicesQuery,
  useSearchServicesQuery,
  useGetPopularServicesQuery,
  useGetServiceByIdQuery,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
  useGetServicesByProviderQuery,
  useGetServicesByCategoryQuery,
} = servicesApi

export default servicesApi