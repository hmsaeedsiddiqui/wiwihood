import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Base URL configuration
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

// Booking interfaces
export interface BookingFormData {
  serviceId: string;
  providerId: string;
  staffId?: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
  platformFee?: number;
  notes?: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  promotionCode?: string;
  status?: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
}

export interface Booking {
  id: string;
  serviceId: string;
  providerId: string;
  staffId?: string;
  customerId: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
  platformFee?: number;
  notes?: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  promotionCode?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  paymentStatus?: 'pending' | 'completed' | 'failed' | 'refunded';
  createdAt: string;
  updatedAt: string;
  service?: any;
  provider?: any;
  customer?: any;
}

export interface BookingsListResponse {
  bookings: Booking[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AvailabilityCheck {
  providerId: string;
  serviceId?: string;
  startTime?: string;
  endTime?: string;
  date?: string;
}

export interface AvailabilityResponse {
  available: boolean;
  message?: string;
  timeSlots?: string[];
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface RescheduleBookingData {
  startTime: string;
  endTime: string;
  reason?: string;
}

export interface CancelBookingData {
  reason?: string;
}

export interface BookingStats {
  totalBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  upcomingBookings: number;
  completionRate: number;
}

export interface CalendarView {
  date: string;
  dayOfWeek: string;
  bookings: Booking[];
  availableSlots: string[];
  totalBookings: number;
  bookedHours: number;
}

// Public endpoints that don't need auth
const PUBLIC_ENDPOINTS = new Set([
  'checkAvailability',
  'getAvailableTimeSlots',
]);

export const bookingsApi = createApi({
  reducerPath: 'bookingsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/bookings`,
    prepareHeaders: (headers, { endpoint }) => {
      // Only attach Authorization for non-public endpoints
      if (!PUBLIC_ENDPOINTS.has(endpoint || '')) {
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('accessToken') || 
                       localStorage.getItem('auth-token') || 
                       localStorage.getItem('adminToken') || 
                       localStorage.getItem('providerToken');
          
          if (token) {
            headers.set('authorization', `Bearer ${token}`);
          }
        }
      }
      
      headers.set('content-type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Booking', 'Bookings', 'Availability'],
  endpoints: (builder) => ({
    // Create a new booking
    createBooking: builder.mutation<Booking, BookingFormData>({
      query: (bookingData) => ({
        url: '',
        method: 'POST',
        body: bookingData,
      }),
      invalidatesTags: ['Bookings'],
      transformErrorResponse: (response: any) => ({
        message: response?.data?.message || 'Failed to create booking',
        statusCode: typeof response.status === 'number' ? response.status : 500,
        error: response?.data?.error
      })
    }),

    // Check availability for a time slot or date
    checkAvailability: builder.mutation<AvailabilityResponse, AvailabilityCheck>({
      query: (availabilityData) => ({
        url: '/check-availability',
        method: 'POST',
        body: availabilityData,
      }),
      invalidatesTags: ['Availability'],
      transformErrorResponse: (response: any) => ({
        message: response?.data?.message || 'Failed to check availability',
        statusCode: typeof response.status === 'number' ? response.status : 500,
        error: response?.data?.error
      })
    }),

    // Get available time slots for a specific provider, service, and date
    getAvailableTimeSlots: builder.query<AvailabilityResponse, { providerId: string; serviceId: string; date: string }>({
      query: ({ providerId, serviceId, date }) => ({
        url: `/availability/${providerId}/${serviceId}?date=${date}`,
        method: 'GET',
      }),
      providesTags: ['Availability'],
      transformErrorResponse: (response: any) => ({
        message: response?.data?.message || 'Failed to get available time slots',
        statusCode: typeof response.status === 'number' ? response.status : 500,
        error: response?.data?.error
      })
    }),

    // Get all bookings (with filters)
    getBookings: builder.query<BookingsListResponse, { 
      page?: number; 
      limit?: number; 
      status?: string; 
      providerId?: string; 
      customerId?: string; 
    }>({
      query: ({ page = 1, limit = 10, status, providerId, customerId }) => {
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('limit', limit.toString());
        if (status) params.append('status', status);
        if (providerId) params.append('providerId', providerId);
        if (customerId) params.append('customerId', customerId);
        
        return {
          url: `?${params.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['Bookings'],
      transformErrorResponse: (response: any) => ({
        message: response?.data?.message || 'Failed to get bookings',
        statusCode: typeof response.status === 'number' ? response.status : 500,
        error: response?.data?.error
      })
    }),

    // Get current user's bookings
    getMyBookings: builder.query<BookingsListResponse, { 
      page?: number; 
      limit?: number; 
      status?: string; 
    }>({
      query: ({ page = 1, limit = 10, status }) => {
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('limit', limit.toString());
        if (status) params.append('status', status);
        
        return {
          url: `/my-bookings?${params.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['Bookings'],
      transformErrorResponse: (response: any) => ({
        message: response?.data?.message || 'Failed to get my bookings',
        statusCode: typeof response.status === 'number' ? response.status : 500,
        error: response?.data?.error
      })
    }),

    // Get upcoming bookings
    getUpcomingBookings: builder.query<Booking[], void>({
      query: () => ({
        url: '/upcoming',
        method: 'GET',
      }),
      providesTags: ['Bookings'],
      transformErrorResponse: (response: any) => ({
        message: response?.data?.message || 'Failed to get upcoming bookings',
        statusCode: typeof response.status === 'number' ? response.status : 500,
        error: response?.data?.error
      })
    }),

    // Get booking by ID
    getBookingById: builder.query<Booking, string>({
      query: (id) => ({
        url: `/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Booking', id }],
      transformErrorResponse: (response: any) => ({
        message: response?.data?.message || 'Failed to get booking',
        statusCode: typeof response.status === 'number' ? response.status : 500,
        error: response?.data?.error
      })
    }),

    // Update booking
    updateBooking: builder.mutation<Booking, { id: string; data: Partial<BookingFormData> }>({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Booking', id },
        'Bookings',
      ],
      transformErrorResponse: (response: any) => ({
        message: response?.data?.message || 'Failed to update booking',
        statusCode: typeof response.status === 'number' ? response.status : 500,
        error: response?.data?.error
      })
    }),

    // Cancel booking
    cancelBooking: builder.mutation<Booking, { id: string; data?: CancelBookingData }>({
      query: ({ id, data }) => ({
        url: `/${id}/cancel`,
        method: 'PATCH',
        body: data || {},
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Booking', id },
        'Bookings',
      ],
      transformErrorResponse: (response: any) => ({
        message: response?.data?.message || 'Failed to cancel booking',
        statusCode: typeof response.status === 'number' ? response.status : 500,
        error: response?.data?.error
      })
    }),

    // Reschedule booking
    rescheduleBooking: builder.mutation<Booking, { id: string; data: RescheduleBookingData }>({
      query: ({ id, data }) => ({
        url: `/${id}/reschedule`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Booking', id },
        'Bookings',
        'Availability',
      ],
      transformErrorResponse: (response: any) => ({
        message: response?.data?.message || 'Failed to reschedule booking',
        statusCode: typeof response.status === 'number' ? response.status : 500,
        error: response?.data?.error
      })
    }),

    // Get booking statistics
    getBookingStats: builder.query<BookingStats, void>({
      query: () => ({
        url: '/stats',
        method: 'GET',
      }),
      providesTags: ['Bookings'],
      transformErrorResponse: (response: any) => ({
        message: response?.data?.message || 'Failed to get booking stats',
        statusCode: typeof response.status === 'number' ? response.status : 500,
        error: response?.data?.error
      })
    }),

    // Get calendar view for a specific date
    getCalendarView: builder.query<CalendarView, { date: string; providerId?: string }>({
      query: ({ date, providerId }) => {
        const params = providerId ? `?providerId=${providerId}` : '';
        return {
          url: `/calendar/${date}${params}`,
          method: 'GET',
        };
      },
      providesTags: ['Bookings', 'Availability'],
      transformErrorResponse: (response: any) => ({
        message: response?.data?.message || 'Failed to get calendar view',
        statusCode: typeof response.status === 'number' ? response.status : 500,
        error: response?.data?.error
      })
    }),

    // Delete booking (admin only)
    deleteBooking: builder.mutation<void, string>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Booking', id },
        'Bookings',
      ],
      transformErrorResponse: (response: any) => ({
        message: response?.data?.message || 'Failed to delete booking',
        statusCode: typeof response.status === 'number' ? response.status : 500,
        error: response?.data?.error
      })
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useCreateBookingMutation,
  useCheckAvailabilityMutation,
  useGetAvailableTimeSlotsQuery,
  useGetBookingsQuery,
  useGetMyBookingsQuery,
  useGetUpcomingBookingsQuery,
  useGetBookingByIdQuery,
  useUpdateBookingMutation,
  useCancelBookingMutation,
  useRescheduleBookingMutation,
  useGetBookingStatsQuery,
  useGetCalendarViewQuery,
  useDeleteBookingMutation,
} = bookingsApi;

export default bookingsApi;