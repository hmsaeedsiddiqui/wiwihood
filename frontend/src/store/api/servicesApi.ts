import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// --- Admin Types (from adminServicesApi.ts) ---
export interface AdminServiceFilters {
  search?: string;
  status?: 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'ACTIVE' | 'INACTIVE' | 'ALL';
  categoryId?: string;
  providerId?: string;
  hasImages?: boolean;
  priceMin?: number;
  priceMax?: number;
  sortBy?: 'submittedForApproval' | 'approvalDate' | 'name' | 'price' | 'provider';
  sortOrder?: 'ASC' | 'DESC';
  page?: number;
  limit?: number;
}

export interface AdminApprovalData {
  approved: boolean;
  adminComments?: string;
  adminAssignedBadge?: string;
  adminQualityRating?: number;
}

export interface AdminBadgeData {
  badge: string;
  qualityRating?: number;
}

export interface AdminBulkAction {
  serviceIds: string[];
  action: 'approve' | 'reject' | 'activate' | 'deactivate' | 'delete';
  reason?: string;
}

export interface ServiceStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  active: number;
  inactive: number;
}

export interface AdminService {
  id: string;
  name: string;
  shortDescription: string;
  description: string;
  provider: {
    id: string;
    businessName: string;
    name: string;
  };
  category: {
    id: string;
    name: string;
  };
  basePrice: number;
  durationMinutes: number;
  serviceType: string;
  isActive: boolean;
  isApproved: boolean;
  approvalStatus: 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED';
  adminComments?: string;
  adminAssignedBadge?: string;
  adminQualityRating?: number;
  featuredImage?: string;
  images?: string[];
  createdAt: string;
  updatedAt: string;
  approvalDate?: string;
  approvedByAdminId?: string;
}

export interface AdminServicesResponse {
  services: AdminService[];
  total: number;
  stats: ServiceStats;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AvailableBadge {
  value: string;
  label: string;
  description: string;
}

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
  // Frontend display fields
  displayLocation?: string
  providerBusinessName?: string
  highlightBadge?: string
  featuredImage?: string
  availableSlots?: string[]
  promotionText?: string
  isFeatured?: boolean
  difficultyLevel?: 'beginner' | 'intermediate' | 'advanced'
  specialRequirements?: string
  includes?: string[]
  excludes?: string[]
  ageRestriction?: string
  genderPreference?: 'any' | 'male' | 'female'
  // Deals and promotions fields
  isPromotional?: boolean
  discountPercentage?: string
  promoCode?: string
  dealValidUntil?: string
  dealCategory?: string
  dealTitle?: string
  dealDescription?: string
  originalPrice?: number
  minBookingAmount?: number
  usageLimit?: number
  dealTerms?: string
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
  // Frontend display fields
  displayLocation?: string
  providerBusinessName?: string
  highlightBadge?: string
  featuredImage?: string
  availableSlots?: string[]
  promotionText?: string
  difficultyLevel?: 'beginner' | 'intermediate' | 'advanced'
  specialRequirements?: string
  includes?: string[]
  excludes?: string[]
  ageRestriction?: string
  genderPreference?: 'any' | 'male' | 'female'
  // Deals and promotions fields
  isPromotional?: boolean
  discountPercentage?: string
  promoCode?: string
  dealValidUntil?: string
  dealCategory?: string
  dealTitle?: string
  dealDescription?: string
  originalPrice?: number
  minBookingAmount?: number
  usageLimit?: number
  dealTerms?: string
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

// Ensure baseUrl does NOT include /api/v1 twice
const API_PREFIX = '/api/v1';
const baseUrlHasApiPrefix = BASE_URL.endsWith(API_PREFIX);

export const servicesApi = createApi({
  reducerPath: 'servicesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}`,
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
  tagTypes: ['Service', 'Services', 'AdminService', 'ServiceStats'],
  endpoints: (builder) => ({
    // --- ADMIN ENDPOINTS ---
    // Get all services (admin)
    getAllAdminServices: builder.query<AdminServicesResponse, AdminServiceFilters>({
      query: (filters) => {
        const params = new URLSearchParams();
        Object.entries(filters || {}).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            params.append(key, value.toString());
          }
        });
        const endpoint = baseUrlHasApiPrefix
          ? `/admin/services?${params.toString()}`
          : `/api/v1/admin/services?${params.toString()}`;
        return {
          url: endpoint,
          method: 'GET',
        };
      },
      providesTags: ['AdminService', 'ServiceStats'],
      transformErrorResponse: (response: any) => ({
        message: response?.data?.message || 'Failed to fetch admin services',
        statusCode: typeof response.status === 'number' ? response.status : 500,
        error: response?.data?.error
      } as ApiError)
    }),

    // Get admin service by ID
    getAdminServiceById: builder.query<AdminService, string>({
      query: (id) => ({
        url: baseUrlHasApiPrefix
          ? `/admin/services/${id}`
          : `/api/v1/admin/services/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'AdminService', id }],
      transformErrorResponse: (response: any) => ({
        message: response?.data?.message || 'Failed to fetch admin service',
        statusCode: typeof response.status === 'number' ? response.status : 500,
        error: response?.data?.error
      } as ApiError)
    }),

    // Approve/reject service
    approveAdminService: builder.mutation<{ success: boolean; message: string; service: AdminService }, { serviceId: string; approvalData: AdminApprovalData }>({
      query: ({ serviceId, approvalData }) => ({
        url: baseUrlHasApiPrefix
          ? `/admin/services/${serviceId}/approve`
          : `/api/v1/admin/services/${serviceId}/approve`,
        method: 'POST',
        body: approvalData,
      }),
      invalidatesTags: ['AdminService', 'ServiceStats'],
      transformErrorResponse: (response: any) => ({
        message: response?.data?.message || 'Failed to approve/reject service',
        statusCode: typeof response.status === 'number' ? response.status : 500,
        error: response?.data?.error
      } as ApiError)
    }),

    // Assign badge
    assignAdminBadge: builder.mutation<{ success: boolean; message: string; service: AdminService }, { serviceId: string; badgeData: AdminBadgeData }>({
      query: ({ serviceId, badgeData }) => ({
        url: baseUrlHasApiPrefix
          ? `/admin/services/${serviceId}/badge`
          : `/api/v1/admin/services/${serviceId}/badge`,
        method: 'PUT',
        body: badgeData,
      }),
      invalidatesTags: (result, error, { serviceId }) => [
        { type: 'AdminService', id: serviceId },
        'AdminService',
      ],
      transformErrorResponse: (response: any) => ({
        message: response?.data?.message || 'Failed to assign badge',
        statusCode: typeof response.status === 'number' ? response.status : 500,
        error: response?.data?.error
      } as ApiError)
    }),

    // Toggle service status (activate/deactivate)
    toggleAdminServiceStatus: builder.mutation<{ success: boolean; message: string; service: AdminService }, string>({
      query: (serviceId) => ({
        url: baseUrlHasApiPrefix
          ? `/admin/services/${serviceId}/toggle-status`
          : `/api/v1/admin/services/${serviceId}/toggle-status`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, serviceId) => [
        { type: 'AdminService', id: serviceId },
        'AdminService',
        'ServiceStats',
      ],
      transformErrorResponse: (response: any) => ({
        message: response?.data?.message || 'Failed to toggle service status',
        statusCode: typeof response.status === 'number' ? response.status : 500,
        error: response?.data?.error
      } as ApiError)
    }),

    // Delete service (admin)
    deleteAdminService: builder.mutation<{ success: boolean; message: string }, string>({
      query: (serviceId) => ({
        url: baseUrlHasApiPrefix
          ? `/admin/services/${serviceId}`
          : `/api/v1/admin/services/${serviceId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['AdminService', 'ServiceStats'],
      transformErrorResponse: (response: any) => ({
        message: response?.data?.message || 'Failed to delete service',
        statusCode: typeof response.status === 'number' ? response.status : 500,
        error: response?.data?.error
      } as ApiError)
    }),

    // Bulk admin actions
    bulkAdminServiceAction: builder.mutation<{ success: boolean; message: string }, AdminBulkAction>({
      query: (bulkData) => ({
        url: baseUrlHasApiPrefix
          ? `/admin/services/bulk-action`
          : `/api/v1/admin/services/bulk-action`,
        method: 'POST',
        body: bulkData,
      }),
      invalidatesTags: ['AdminService', 'ServiceStats'],
      transformErrorResponse: (response: any) => ({
        message: response?.data?.message || 'Failed to perform bulk action',
        statusCode: typeof response.status === 'number' ? response.status : 500,
        error: response?.data?.error
      } as ApiError)
    }),

    // Get admin service stats
    getAdminServiceStats: builder.query<ServiceStats, void>({
      query: () => ({
        url: baseUrlHasApiPrefix
          ? `/admin/services/stats`
          : `/api/v1/admin/services/stats`,
        method: 'GET',
      }),
      providesTags: ['ServiceStats'],
      transformErrorResponse: (response: any) => ({
        message: response?.data?.message || 'Failed to fetch service stats',
        statusCode: typeof response.status === 'number' ? response.status : 500,
        error: response?.data?.error
      } as ApiError)
    }),

    // Get available badges
    getAdminAvailableBadges: builder.query<{ badges: AvailableBadge[] }, void>({
      query: () => ({
        url: baseUrlHasApiPrefix
          ? `/admin/services/badges/available`
          : `/api/v1/admin/services/badges/available`,
        method: 'GET',
      }),
      transformErrorResponse: (response: any) => ({
        message: response?.data?.message || 'Failed to fetch badges',
        statusCode: typeof response.status === 'number' ? response.status : 500,
        error: response?.data?.error
      } as ApiError)
    }),

    // Get pending services count
    getAdminPendingCount: builder.query<{ pendingCount: number }, void>({
      query: () => ({
        url: baseUrlHasApiPrefix
          ? `/admin/services/pending/count`
          : `/api/v1/admin/services/pending/count`,
        method: 'GET',
      }),
      providesTags: ['ServiceStats'],
      transformErrorResponse: (response: any) => ({
        message: response?.data?.message || 'Failed to fetch pending count',
        statusCode: typeof response.status === 'number' ? response.status : 500,
        error: response?.data?.error
      } as ApiError)
    }),

    // Export services data
    exportAdminServicesData: builder.mutation<{
      success: boolean;
      data: any[];
      totalRecords: number;
      exportedAt: string;
    }, AdminServiceFilters>({
      query: (filters) => ({
        url: baseUrlHasApiPrefix
          ? `/admin/services/export`
          : `/api/v1/admin/services/export`,
        method: 'POST',
        body: filters,
      }),
      transformErrorResponse: (response: any) => ({
        message: response?.data?.message || 'Failed to export services',
        statusCode: typeof response.status === 'number' ? response.status : 500,
        error: response?.data?.error
      } as ApiError)
    }),
    // Get current provider info (authenticated user)
    getProviderInfo: builder.query<any, void>({
      // Use the correct base URL for provider info, not under /services
      query: () => ({
        url: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/providers/me`,
        method: 'GET',
      }),
      transformErrorResponse: (response: any) => ({
        message: response?.data?.message || 'Failed to fetch provider info',
        statusCode: typeof response.status === 'number' ? response.status : 500,
        error: response?.data?.error
      } as ApiError)
    }),
    // Create service (requires providerId)
    createService: builder.mutation<Service, { providerId: string; serviceData: CreateServiceRequest }>({
      query: ({ providerId, serviceData }) => ({
        url: `/api/v1/services/provider/${providerId}`,
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
          url: `/api/v1/services?${params.toString()}`,
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
          url: `/api/v1/services/search?${params.toString()}`,
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
        url: `/api/v1/services/popular?limit=${limit}`,
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
        url: `/api/v1/services/${id}`,
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
        url: `/api/v1/services/${id}`,
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
        url: `/api/v1/services/${id}`,
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
          url: `/api/v1/services/provider/${providerId}${queryString ? `?${queryString}` : ''}`,
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
          url: `/api/v1/services/category/${categoryId}${queryString ? `?${queryString}` : ''}`,
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
  useGetProviderInfoQuery,

  // Admin hooks
  useGetAllAdminServicesQuery,
  useGetAdminServiceByIdQuery,
  useApproveAdminServiceMutation,
  useAssignAdminBadgeMutation,
  useToggleAdminServiceStatusMutation,
  useDeleteAdminServiceMutation,
  useBulkAdminServiceActionMutation,
  useGetAdminServiceStatsQuery,
  useGetAdminAvailableBadgesQuery,
  useGetAdminPendingCountQuery,
  useExportAdminServicesDataMutation,
} = servicesApi

export default servicesApi