import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

// Define types locally for now
interface User {
  id: number
  email: string
  firstName: string
  lastName: string
  phoneNumber?: string
  role: string
}

interface Service {
  id: string
  name: string
  description?: string
  basePrice: number
  duration: number
  isActive: boolean
  categoryId: string
  providerId: string
  imageUrl?: string
  createdAt: string
  updatedAt: string
}

interface Provider {
  id: string
  businessName: string
  businessDescription?: string
  businessAddress?: string
  businessCity?: string
  businessCountry?: string
  businessPhoneNumber?: string
  businessEmail?: string
  websiteUrl?: string
  logoUrl?: string
  isVerified: boolean
  averageRating: number
  totalReviews: number
  createdAt: string
  updatedAt: string
}

interface Booking {
  id: string
  startTime: string
  endTime: string
  totalPrice: number
  status: string
  notes?: string
  customerId: string
  customer: User
  serviceId: string
  service: Service
  createdAt: string
  updatedAt: string
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

// Booking-specific interfaces
export interface BookingFormData {
  serviceId: string
  providerId: string
  startTime: string
  endTime: string
  totalPrice: number
  notes?: string
  customerPhone?: string
  customerEmail?: string
}

export interface TimeSlot {
  time: string
  available: boolean
}

// Booking state interface
interface BookingState {
  // Current booking flow
  selectedService: Service | null
  selectedProvider: Provider | null
  selectedDate: string
  selectedTimeSlot: string
  bookingNotes: string
  
  // User bookings
  myBookings: Booking[]
  upcomingBookings: Booking[]
  
  // Available time slots
  availableSlots: TimeSlot[]
  
  // Loading states
  isLoading: boolean
  isCreatingBooking: boolean
  
  // Error state
  error: string | null
}

// Initial state
const initialState: BookingState = {
  selectedService: null,
  selectedProvider: null,
  selectedDate: '',
  selectedTimeSlot: '',
  bookingNotes: '',
  myBookings: [],
  upcomingBookings: [],
  availableSlots: [],
  isLoading: false,
  isCreatingBooking: false,
  error: null,
}

// Async thunks
export const createBooking = createAsyncThunk(
  'booking/create',
  async ({ bookingData, token }: { bookingData: BookingFormData; token: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(bookingData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.message || 'Failed to create booking')
      }

      const booking = await response.json()
      return booking
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error')
    }
  }
)

export const fetchMyBookings = createAsyncThunk(
  'booking/fetchMyBookings',
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/my-bookings`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.message || 'Failed to fetch bookings')
      }

      const data = await response.json()
      return data.bookings || []
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error')
    }
  }
)

export const fetchUpcomingBookings = createAsyncThunk(
  'booking/fetchUpcomingBookings',
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/upcoming`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.message || 'Failed to fetch upcoming bookings')
      }

      const bookings = await response.json()
      return bookings
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error')
    }
  }
)

export const fetchAvailableSlots = createAsyncThunk(
  'booking/fetchAvailableSlots',
  async ({ providerId, serviceId, date, token }: { 
    providerId: string; 
    serviceId: string; 
    date: string; 
    token: string 
  }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/bookings/availability/${providerId}/${serviceId}?date=${date}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.message || 'Failed to fetch available slots')
      }

      const data = await response.json()
      const timeSlots = data.timeSlots.map((time: string) => ({
        time,
        available: true,
      }))
      
      return timeSlots
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error')
    }
  }
)

export const cancelBooking = createAsyncThunk(
  'booking/cancel',
  async ({ bookingId, token, reason }: { 
    bookingId: string; 
    token: string; 
    reason?: string 
  }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/cancel`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          reason: reason || 'Cancelled by customer',
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.message || 'Failed to cancel booking')
      }

      return bookingId
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error')
    }
  }
)

export const rescheduleBooking = createAsyncThunk(
  'booking/reschedule',
  async ({ 
    bookingId, 
    newStartTime, 
    newEndTime, 
    reason, 
    token 
  }: { 
    bookingId: string; 
    newStartTime: string; 
    newEndTime: string; 
    reason: string; 
    token: string 
  }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/reschedule`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          newStartTime,
          newEndTime,
          reason,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.message || 'Failed to reschedule booking')
      }

      const updatedBooking = await response.json()
      return updatedBooking
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error')
    }
  }
)

// Booking slice
const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setSelectedService: (state, action: PayloadAction<Service | null>) => {
      state.selectedService = action.payload
    },
    setSelectedProvider: (state, action: PayloadAction<Provider | null>) => {
      state.selectedProvider = action.payload
    },
    setSelectedDate: (state, action: PayloadAction<string>) => {
      state.selectedDate = action.payload
    },
    setSelectedTimeSlot: (state, action: PayloadAction<string>) => {
      state.selectedTimeSlot = action.payload
    },
    setBookingNotes: (state, action: PayloadAction<string>) => {
      state.bookingNotes = action.payload
    },
    clearBookingFlow: (state) => {
      state.selectedService = null
      state.selectedProvider = null
      state.selectedDate = ''
      state.selectedTimeSlot = ''
      state.bookingNotes = ''
      state.availableSlots = []
    },
    clearError: (state) => {
      state.error = null
    },
    setAvailableSlots: (state, action: PayloadAction<TimeSlot[]>) => {
      state.availableSlots = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      // Create booking cases
      .addCase(createBooking.pending, (state) => {
        state.isCreatingBooking = true
        state.error = null
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.isCreatingBooking = false
        state.myBookings.unshift(action.payload)
        state.upcomingBookings.unshift(action.payload)
        state.error = null
        // Clear booking flow on successful creation
        state.selectedService = null
        state.selectedProvider = null
        state.selectedDate = ''
        state.selectedTimeSlot = ''
        state.bookingNotes = ''
        state.availableSlots = []
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.isCreatingBooking = false
        state.error = action.payload as string
      })
      
      // Fetch my bookings cases
      .addCase(fetchMyBookings.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchMyBookings.fulfilled, (state, action) => {
        state.isLoading = false
        state.myBookings = action.payload
        state.error = null
      })
      .addCase(fetchMyBookings.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      
      // Fetch upcoming bookings cases
      .addCase(fetchUpcomingBookings.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchUpcomingBookings.fulfilled, (state, action) => {
        state.isLoading = false
        state.upcomingBookings = action.payload
        state.error = null
      })
      .addCase(fetchUpcomingBookings.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      
      // Fetch available slots cases
      .addCase(fetchAvailableSlots.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchAvailableSlots.fulfilled, (state, action) => {
        state.isLoading = false
        state.availableSlots = action.payload
        state.error = null
      })
      .addCase(fetchAvailableSlots.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
        state.availableSlots = []
      })
      
      // Cancel booking cases
      .addCase(cancelBooking.fulfilled, (state, action) => {
        const bookingId = action.payload
        state.myBookings = state.myBookings.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: BookingStatus.CANCELLED }
            : booking
        )
        state.upcomingBookings = state.upcomingBookings.filter(
          booking => booking.id !== bookingId
        )
      })
      .addCase(cancelBooking.rejected, (state, action) => {
        state.error = action.payload as string
      })
      
      // Reschedule booking cases
      .addCase(rescheduleBooking.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(rescheduleBooking.fulfilled, (state, action) => {
        state.isLoading = false
        const updatedBooking = action.payload
        // Update booking in both arrays
        state.myBookings = state.myBookings.map(booking => 
          booking.id === updatedBooking.id ? updatedBooking : booking
        )
        state.upcomingBookings = state.upcomingBookings.map(booking => 
          booking.id === updatedBooking.id ? updatedBooking : booking
        )
        state.error = null
      })
      .addCase(rescheduleBooking.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

// Import BookingStatus enum (we need to add it to the types)
enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export const {
  setSelectedService,
  setSelectedProvider,
  setSelectedDate,
  setSelectedTimeSlot,
  setBookingNotes,
  clearBookingFlow,
  clearError,
  setAvailableSlots,
} = bookingSlice.actions

export default bookingSlice.reducer