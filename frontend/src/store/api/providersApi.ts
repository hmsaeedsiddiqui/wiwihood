import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Base URL for API
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

// Provider types
export interface Provider {
  id: string
  businessName: string
  providerType: 'individual' | 'business'
  description?: string
  address: string
  city: string
  state?: string
  country: string
  postalCode?: string
  timezone?: string
  latitude?: number
  longitude?: number
  phone?: string
  website?: string
  licenseNumber?: string
  taxId?: string
  logo?: string
  logoPublicId?: string
  coverImage?: string
  coverImagePublicId?: string
  status: 'pending_verification' | 'active' | 'suspended' | 'rejected'
  isVerified: boolean
  acceptsOnlinePayments: boolean
  acceptsCashPayments: boolean
  requiresDeposit: boolean
  depositPercentage?: number
  cancellationPolicyHours: number
  commissionRate: number
  averageRating?: number
  totalReviews: number
  totalBookings: number
  verificationNotes?: string
  verifiedAt?: string
  createdAt: string
  updatedAt: string
  userId: string
  fullAddress?: string
}

export interface CreateProviderRequest {
  businessName: string
  providerType: 'individual' | 'business'
  description?: string
  address: string
  city: string
  state?: string
  country: string
  postalCode?: string
  timezone?: string
  phone?: string
  website?: string
  licenseNumber?: string
  taxId?: string
}

export interface UpdateProviderRequest {
  businessName?: string
  providerType?: 'individual' | 'business'
  description?: string
  address?: string
  city?: string
  state?: string
  country?: string
  postalCode?: string
  timezone?: string
  phone?: string
  website?: string
  licenseNumber?: string
  taxId?: string
  logo?: string
  logoPublicId?: string
  coverImage?: string
  coverImagePublicId?: string
}

export interface ImageUploadResponse {
  success: boolean
  message: string
  data: {
    url: string
    publicId: string
    format: string
    width: number
    height: number
  }
  provider: Provider
}

export const providersApi = createApi({
  reducerPath: 'providersApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/providers`,
    prepareHeaders: (headers) => {
      // Try to get token from either localStorage location
      const token = typeof window !== 'undefined' 
        ? localStorage.getItem('accessToken') || localStorage.getItem('providerToken')
        : null
      
      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }
      
      return headers
    },
  }),
  tagTypes: ['Provider'],
  endpoints: (builder) => ({
    // Get current provider profile
    getCurrentProvider: builder.query<Provider, void>({
      query: () => 'me',
      providesTags: ['Provider'],
    }),

    // Create provider profile
    createProvider: builder.mutation<Provider, CreateProviderRequest>({
      query: (data) => ({
        url: '',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Provider'],
    }),

    // Update provider profile
    updateProvider: builder.mutation<Provider, UpdateProviderRequest>({
      query: (data) => ({
        url: 'me',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Provider'],
    }),

    // Upload provider logo
    uploadProviderLogo: builder.mutation<ImageUploadResponse, File>({
      query: (file) => {
        const formData = new FormData()
        formData.append('file', file)
        
        return {
          url: 'me/upload-logo',
          method: 'POST',
          body: formData,
        }
      },
      invalidatesTags: ['Provider'],
    }),

    // Upload provider cover image
    uploadProviderCover: builder.mutation<ImageUploadResponse, File>({
      query: (file) => {
        const formData = new FormData()
        formData.append('file', file)
        
        return {
          url: 'me/upload-cover',
          method: 'POST',
          body: formData,
        }
      },
      invalidatesTags: ['Provider'],
    }),

    // Remove provider logo
    removeProviderLogo: builder.mutation<{ success: boolean; message: string; provider: Provider }, void>({
      query: () => ({
        url: 'me/logo',
        method: 'DELETE',
      }),
      invalidatesTags: ['Provider'],
    }),

    // Remove provider cover image
    removeProviderCover: builder.mutation<{ success: boolean; message: string; provider: Provider }, void>({
      query: () => ({
        url: 'me/cover',
        method: 'DELETE',
      }),
      invalidatesTags: ['Provider'],
    }),

    // Get provider availability
    getProviderAvailability: builder.query<any, void>({
      query: () => 'me/availability',
    }),

    // Update provider availability
    updateProviderAvailability: builder.mutation<any, any>({
      query: (data) => ({
        url: 'me/availability',
        method: 'POST',
        body: data,
      }),
    }),

    // Get provider dashboard stats
    getProviderDashboard: builder.query<any, void>({
      query: () => 'dashboard',
    }),
  }),
})

// Export hooks for usage in components
export const {
  useGetCurrentProviderQuery,
  useCreateProviderMutation,
  useUpdateProviderMutation,
  useUploadProviderLogoMutation,
  useUploadProviderCoverMutation,
  useRemoveProviderLogoMutation,
  useRemoveProviderCoverMutation,
  useGetProviderAvailabilityQuery,
  useUpdateProviderAvailabilityMutation,
  useGetProviderDashboardQuery,
} = providersApi