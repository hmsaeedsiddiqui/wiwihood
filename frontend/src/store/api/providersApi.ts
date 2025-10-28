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

// Availability types
export interface WorkingHours {
  id: string
  dayOfWeek: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'
  isWorkingDay: boolean
  startTime?: string
  endTime?: string
  breakStartTime?: string
  breakEndTime?: string
  maxBookingsPerDay?: number
  isTemporarilyUnavailable?: boolean
  timezone?: string
  notes?: string
  providerId: string
  createdAt: string
  updatedAt: string
}

export interface BlockedTime {
  id: string
  blockDate: string
  startTime?: string
  endTime?: string
  isAllDay: boolean
  blockType: 'vacation' | 'personal' | 'maintenance' | 'holiday' | 'emergency' | 'other'
  reason: string
  isActive: boolean
  isRecurring: boolean
  recurringPattern?: string
  recurringEndDate?: string
  notes?: string
  providerId: string
  createdAt: string
  updatedAt: string
}

export interface TimeSlot {
  id: string
  slotDate: string
  startTime: string
  endTime: string
  durationMinutes: number
  status: 'available' | 'booked' | 'blocked' | 'break'
  maxBookings: number
  currentBookings: number
  bufferTimeMinutes: number
  isManuallyCreated: boolean
  isBreakSlot: boolean
  customPrice?: number
  notes?: string
  providerId: string
  serviceId?: string
  createdAt: string
  updatedAt: string
}

export interface ProviderAvailabilityResponse {
  date: string
  isAvailable: boolean
  workingHours?: WorkingHours
  availableSlots: TimeSlot[]
  totalSlots: number
  bookedSlots: number
}

export interface AvailabilityAnalytics {
  period: 'week' | 'month' | 'year'
  dateRange: { from: string; to: string }
  slots: {
    total: number
    available: number
    booked: number
    blocked: number
    break: number
  }
  rates: {
    utilization: number
    availability: number
  }
  workingSchedule: {
    workingDays: number
    totalWorkingHours: number
    avgHoursPerDay: number
  }
  blockedTimes: {
    total: number
    active: number
    byType: { [key: string]: number }
  }
}

export interface AvailabilitySettings {
  defaultSlotDuration: number
  defaultBufferTime: number
  maxAdvanceBookingDays: number
  minAdvanceBookingHours: number
  autoGenerateSlots: boolean
  timezone: string
  allowDoubleBooking: boolean
  requireConfirmation: boolean
}

// Service-specific availability interfaces
export interface ServiceAvailabilitySettings {
  id?: string;
  serviceId: string;
  providerId: string;
  customDurationMinutes?: number;
  customBufferTimeMinutes?: number;
  customMaxAdvanceBookingDays?: number;
  customMinAdvanceBookingHours?: number;
  availableDays?: string[];
  customTimeSlots?: string[];
  customWorkingHours?: {
    [day: string]: {
      startTime: string;
      endTime: string;
      breakStartTime?: string;
      breakEndTime?: string;
    };
  };
  requiresSpecialScheduling?: boolean;
  allowWeekends?: boolean;
  allowBackToBack?: boolean;
  maxBookingsPerDay?: number;
  preparationTimeMinutes?: number;
  cleanupTimeMinutes?: number;
  priority?: number;
  availabilityNotes?: string;
  isTemporarilyUnavailable?: boolean;
  unavailabilityReason?: string;
  availableAgainAt?: string;
  isActive?: boolean;
}

export interface ServiceWithAvailability {
  serviceId: string;
  serviceName: string;
  defaultSettings: {
    durationMinutes: number;
    bufferTimeMinutes: number;
    maxAdvanceBookingDays: number;
    minAdvanceBookingHours: number;
  };
  customSettings: ServiceAvailabilitySettings | null;
  effectiveSettings: {
    durationMinutes: number;
    bufferTimeMinutes: number;
    maxAdvanceBookingDays: number;
    minAdvanceBookingHours: number;
    availableDays: string[];
    requiresSpecialScheduling: boolean;
    allowWeekends: boolean;
    maxBookingsPerDay?: number;
  };
}

// Request types
export interface CreateBlockedTimeRequest {
  blockDate: string
  startTime?: string
  endTime?: string
  isAllDay?: boolean
  blockType: 'vacation' | 'personal' | 'maintenance' | 'holiday' | 'emergency' | 'other'
  reason: string
  isRecurring?: boolean
  recurringPattern?: string
  recurringEndDate?: string
  notes?: string
}

export interface GenerateTimeSlotsRequest {
  fromDate: string
  toDate: string
  slotDurationMinutes?: number
  bufferTimeMinutes?: number
  serviceId?: string
  maxBookings?: number
  daysOfWeek?: string[]
  overrideWorkingHours?: {
    startTime: string
    endTime: string
    breakStartTime?: string
    breakEndTime?: string
  }
  skipExistingSlots?: boolean
  customPrice?: number
}

export interface BulkUpdateSlotsRequest {
  slotIds: string[]
  status?: string
  customPrice?: number
  notes?: string
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

export interface Category {
  id: string
  name: string
  description?: string
  slug: string
  icon?: string
  image?: string
  bannerImage?: string
  color?: string
  isActive: boolean
  isFeatured?: boolean
  parentId?: string
  sortOrder: number
  metaTitle?: string
  metaDescription?: string
  metaKeywords?: string
  createdAt: string
  updatedAt: string
  parent?: Category
  children?: Category[]
  services?: any[]
  servicesCount?: number
}

export const providersApi = createApi({
  reducerPath: 'providersApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}`,
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
  tagTypes: ['Provider', 'Category', 'ServiceAvailability', 'TimeSlot'],
  endpoints: (builder) => ({
    // Get current provider profile
    getCurrentProvider: builder.query<Provider, void>({
      query: () => 'providers/me',
      providesTags: ['Provider'],
    }),

    // Create provider profile
    createProvider: builder.mutation<Provider, CreateProviderRequest>({
      query: (data) => ({
        url: 'providers',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Provider'],
    }),

    // Update provider profile
    updateProvider: builder.mutation<Provider, UpdateProviderRequest>({
      query: (data) => ({
        url: 'providers/me',
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
          url: 'providers/me/upload-logo',
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
          url: 'providers/me/upload-cover',
          method: 'POST',
          body: formData,
        }
      },
      invalidatesTags: ['Provider'],
    }),

    // Remove provider logo
    removeProviderLogo: builder.mutation<{ success: boolean; message: string; provider: Provider }, void>({
      query: () => ({
        url: 'providers/me/logo',
        method: 'DELETE',
      }),
      invalidatesTags: ['Provider'],
    }),

    // Remove provider cover image
    removeProviderCover: builder.mutation<{ success: boolean; message: string; provider: Provider }, void>({
      query: () => ({
        url: 'providers/me/cover',
        method: 'DELETE',
      }),
      invalidatesTags: ['Provider'],
    }),

    // =================== AVAILABILITY ENDPOINTS ===================

    // Get provider working hours
    getProviderWorkingHours: builder.query<WorkingHours[], void>({
      query: () => 'providers/me/availability/working-hours',
      providesTags: ['Provider'],
    }),

    // Create or update working hours
    createOrUpdateWorkingHours: builder.mutation<WorkingHours[], WorkingHours[]>({
      query: (data) => ({
        url: 'providers/me/availability/working-hours',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Provider'],
    }),

    // Update specific working hours
    updateWorkingHours: builder.mutation<WorkingHours, { id: string; data: Partial<WorkingHours> }>({
      query: ({ id, data }) => ({
        url: `providers/me/availability/working-hours/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Provider'],
    }),

    // Delete working hours
    deleteWorkingHours: builder.mutation<void, string>({
      query: (id) => ({
        url: `providers/me/availability/working-hours/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Provider'],
    }),

    // Get blocked times
    getProviderBlockedTimes: builder.query<BlockedTime[], { fromDate?: string; toDate?: string; isActive?: boolean }>({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.fromDate) queryParams.append('fromDate', params.fromDate);
        if (params.toDate) queryParams.append('toDate', params.toDate);
        if (params.isActive !== undefined) queryParams.append('isActive', params.isActive.toString());
        
        return `providers/me/availability/blocked-times${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      },
      providesTags: ['Provider'],
    }),

    // Create blocked time
    createBlockedTime: builder.mutation<BlockedTime, CreateBlockedTimeRequest>({
      query: (data) => ({
        url: 'providers/me/availability/blocked-times',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Provider'],
    }),

    // Update blocked time
    updateBlockedTime: builder.mutation<BlockedTime, { id: string; data: Partial<CreateBlockedTimeRequest> }>({
      query: ({ id, data }) => ({
        url: `providers/me/availability/blocked-times/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Provider'],
    }),

    // Delete blocked time
    deleteBlockedTime: builder.mutation<void, string>({
      query: (id) => ({
        url: `providers/me/availability/blocked-times/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Provider'],
    }),

    // Get time slots
    getProviderTimeSlots: builder.query<TimeSlot[], { fromDate: string; toDate: string; serviceId?: string; status?: string }>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        queryParams.append('fromDate', params.fromDate);
        queryParams.append('toDate', params.toDate);
        if (params.serviceId) queryParams.append('serviceId', params.serviceId);
        if (params.status) queryParams.append('status', params.status);
        
        return `providers/me/availability/time-slots?${queryParams.toString()}`;
      },
      providesTags: ['Provider'],
    }),

    // Generate time slots
    generateTimeSlots: builder.mutation<TimeSlot[], GenerateTimeSlotsRequest>({
      query: (data) => ({
        url: 'providers/me/availability/generate-slots',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Provider'],
    }),

    // Update time slot
    updateTimeSlot: builder.mutation<TimeSlot, { id: string; data: Partial<TimeSlot> }>({
      query: ({ id, data }) => ({
        url: `providers/me/availability/time-slots/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Provider'],
    }),

    // Delete time slot
    deleteTimeSlot: builder.mutation<void, string>({
      query: (id) => ({
        url: `providers/me/availability/time-slots/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Provider'],
    }),

    // Bulk update time slots
    bulkUpdateTimeSlots: builder.mutation<{ updated: number }, BulkUpdateSlotsRequest>({
      query: (data) => ({
        url: 'providers/me/availability/time-slots/bulk-update',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Provider'],
    }),

    // Copy working hours
    copyWorkingHours: builder.mutation<WorkingHours[], { fromDay: string; toDays: string[] }>({
      query: (data) => ({
        url: 'providers/me/availability/copy-working-hours',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Provider'],
    }),

    // Get provider availability for date (public)
    getProviderAvailabilityForDate: builder.query<ProviderAvailabilityResponse, { providerId: string; date: string; serviceId?: string }>({
      query: ({ providerId, date, serviceId }) => {
        const queryParams = new URLSearchParams();
        queryParams.append('date', date);
        if (serviceId) queryParams.append('serviceId', serviceId);
        
        return `providers/${providerId}/availability?${queryParams.toString()}`;
      },
    }),

    // Get provider availability for range (public)
    getProviderAvailabilityForRange: builder.query<ProviderAvailabilityResponse[], { providerId: string; fromDate: string; toDate: string; serviceId?: string }>({
      query: ({ providerId, fromDate, toDate, serviceId }) => {
        const queryParams = new URLSearchParams();
        queryParams.append('fromDate', fromDate);
        queryParams.append('toDate', toDate);
        if (serviceId) queryParams.append('serviceId', serviceId);
        
        return `providers/${providerId}/availability/range?${queryParams.toString()}`;
      },
    }),

    // Get availability analytics
    getAvailabilityAnalytics: builder.query<AvailabilityAnalytics, { period?: 'week' | 'month' | 'year' }>({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.period) queryParams.append('period', params.period);
        
        return `providers/me/availability/analytics${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      },
      providesTags: ['Provider'],
    }),

    // Get availability settings
    getAvailabilitySettings: builder.query<AvailabilitySettings, void>({
      query: () => 'providers/me/availability/settings',
      providesTags: ['Provider'],
    }),

    // Update availability settings
    updateAvailabilitySettings: builder.mutation<AvailabilitySettings, Partial<AvailabilitySettings>>({
      query: (data) => ({
        url: 'providers/me/availability/settings',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Provider'],
    }),

    // =================== SERVICE-SPECIFIC AVAILABILITY ENDPOINTS ===================

    // Get all services with their availability settings
    getServicesWithAvailability: builder.query<ServiceWithAvailability[], void>({
      query: () => 'providers/me/services-availability',
      providesTags: ['Provider', 'ServiceAvailability'],
    }),

    // Get service-specific availability settings
    getServiceAvailabilitySettings: builder.query<ServiceAvailabilitySettings | null, string>({
      query: (serviceId) => `providers/me/services/${serviceId}/availability`,
      providesTags: (result, error, serviceId) => [
        { type: 'ServiceAvailability', id: serviceId },
      ],
    }),

    // Create or update service-specific availability settings
    createOrUpdateServiceAvailabilitySettings: builder.mutation<
      ServiceAvailabilitySettings,
      { serviceId: string; settings: Partial<ServiceAvailabilitySettings> }
    >({
      query: ({ serviceId, settings }) => ({
        url: `providers/me/services/${serviceId}/availability`,
        method: 'POST',
        body: settings,
      }),
      invalidatesTags: (result, error, { serviceId }) => [
        { type: 'ServiceAvailability', id: serviceId },
        'Provider',
      ],
    }),

    // Generate time slots for a specific service
    generateServiceTimeSlots: builder.mutation<
      TimeSlot[],
      { serviceId: string; fromDate: string; toDate: string }
    >({
      query: ({ serviceId, fromDate, toDate }) => ({
        url: `providers/me/services/${serviceId}/generate-slots`,
        method: 'POST',
        body: { fromDate, toDate },
      }),
      invalidatesTags: (result, error, { serviceId }) => [
        { type: 'ServiceAvailability', id: serviceId },
        'TimeSlot',
      ],
    }),

    // Get available time slots for a specific service (public endpoint)
    getServiceTimeSlots: builder.query<
      {
        date: string;
        serviceId: string;
        serviceName: string;
        availableSlots: TimeSlot[];
        totalSlots: number;
        bookedSlots: number;
        customSettings: ServiceAvailabilitySettings | null;
      },
      { providerId: string; serviceId: string; date: string }
    >({
      query: ({ providerId, serviceId, date }) => 
        `providers/${providerId}/services/${serviceId}/slots/${date}`,
      providesTags: (result, error, { serviceId, date }) => [
        { type: 'ServiceAvailability', id: `${serviceId}-${date}` },
      ],
    }),

    // Delete service-specific availability settings
    deleteServiceAvailabilitySettings: builder.mutation<void, string>({
      query: (serviceId) => ({
        url: `providers/me/services/${serviceId}/availability`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, serviceId) => [
        { type: 'ServiceAvailability', id: serviceId },
        'Provider',
      ],
    }),

    // Get provider dashboard stats
    getProviderDashboard: builder.query<any, void>({
      query: () => 'dashboard',
    }),

    // Get all categories (public endpoint for providers to select from)
    getCategories: builder.query<Category[], { isActive?: boolean }>({
      query: (params = {}) => {
        const queryParams = new URLSearchParams()
        
        // Only add isActive if it's explicitly set
        if (params.isActive !== undefined) {
          queryParams.append('isActive', params.isActive.toString())
        }
        
        return {
          url: `categories${queryParams.toString() ? `?${queryParams.toString()}` : ''}`,
          method: 'GET',
        }
      },
      transformResponse: (response: Category[]) => {
        // Filter only active categories for provider use
        return response.filter(category => category.isActive)
      },
    }),

    // Get featured categories
    getFeaturedCategories: builder.query<Category[], void>({
      query: () => 'categories/featured',
      providesTags: ['Category'],
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
  useGetProviderDashboardQuery,
  useGetCategoriesQuery,
  useGetFeaturedCategoriesQuery,
  
  // Availability hooks
  useGetProviderWorkingHoursQuery,
  useCreateOrUpdateWorkingHoursMutation,
  useUpdateWorkingHoursMutation,
  useDeleteWorkingHoursMutation,
  useGetProviderBlockedTimesQuery,
  useCreateBlockedTimeMutation,
  useUpdateBlockedTimeMutation,
  useDeleteBlockedTimeMutation,
  useGetProviderTimeSlotsQuery,
  useGenerateTimeSlotsMutation,
  useUpdateTimeSlotMutation,
  useDeleteTimeSlotMutation,
  useBulkUpdateTimeSlotsMutation,
  useCopyWorkingHoursMutation,
  useGetProviderAvailabilityForDateQuery,
  useGetProviderAvailabilityForRangeQuery,
  useGetAvailabilityAnalyticsQuery,
  useGetAvailabilitySettingsQuery,
  useUpdateAvailabilitySettingsMutation,
  
  // Service-specific availability hooks
  useGetServicesWithAvailabilityQuery,
  useGetServiceAvailabilitySettingsQuery,
  useCreateOrUpdateServiceAvailabilitySettingsMutation,
  useGenerateServiceTimeSlotsMutation,
  useGetServiceTimeSlotsQuery,
  useDeleteServiceAvailabilitySettingsMutation,
} = providersApi