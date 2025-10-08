import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Booking {
  id: string
  customer: {
    id: string
    firstName: string
    lastName: string
    email: string
    phone?: string
  }
  service: {
    id: string
    name: string
    duration: number
    price: number
  }
  provider: {
    id: string
    businessName: string
    user: {
      firstName: string
      lastName: string
    }
  }
  startTime: string
  endTime: string
  totalPrice: number
  platformFee: number
  status: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface BookingFormData {
  serviceId: string
  providerId: string
  startTime: string
  endTime: string
  totalPrice: number
  notes?: string
}

export interface TimeSlot {
  time: string
  available: boolean
}

interface BookingState {
  // Current booking flow
  selectedService: any
  selectedProvider: any
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
  
  // Actions
  setSelectedService: (service: any) => void
  setSelectedProvider: (provider: any) => void
  setSelectedDate: (date: string) => void
  setSelectedTimeSlot: (timeSlot: string) => void
  setBookingNotes: (notes: string) => void
  setMyBookings: (bookings: Booking[]) => void
  setUpcomingBookings: (bookings: Booking[]) => void
  setAvailableSlots: (slots: TimeSlot[]) => void
  setIsLoading: (loading: boolean) => void
  setIsCreatingBooking: (creating: boolean) => void
  clearBookingFlow: () => void
  
  // API actions
  createBooking: (bookingData: BookingFormData, token: string) => Promise<Booking>
  fetchMyBookings: (token: string) => Promise<void>
  fetchUpcomingBookings: (token: string) => Promise<void>
  fetchAvailableSlots: (providerId: string, serviceId: string, date: string, token: string) => Promise<void>
  cancelBooking: (bookingId: string, token: string) => Promise<void>
  rescheduleBooking: (bookingId: string, newStartTime: string, newEndTime: string, reason: string, token: string) => Promise<void>
}

const API_BASE_URL = 'http://localhost:3001/api/v1'

export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      // Initial state
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

      // Simple setters
      setSelectedService: (service) => set({ selectedService: service }),
      setSelectedProvider: (provider) => set({ selectedProvider: provider }),
      setSelectedDate: (date) => set({ selectedDate: date }),
      setSelectedTimeSlot: (timeSlot) => set({ selectedTimeSlot: timeSlot }),
      setBookingNotes: (notes) => set({ bookingNotes: notes }),
      setMyBookings: (bookings) => set({ myBookings: bookings }),
      setUpcomingBookings: (bookings) => set({ upcomingBookings: bookings }),
      setAvailableSlots: (slots) => set({ availableSlots: slots }),
      setIsLoading: (loading) => set({ isLoading: loading }),
      setIsCreatingBooking: (creating) => set({ isCreatingBooking: creating }),

      clearBookingFlow: () => set({
        selectedService: null,
        selectedProvider: null,
        selectedDate: '',
        selectedTimeSlot: '',
        bookingNotes: '',
        availableSlots: []
      }),

      // API actions
      createBooking: async (bookingData: BookingFormData, token: string) => {
        set({ isCreatingBooking: true })
        try {
          const response = await fetch(`${API_BASE_URL}/bookings`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(bookingData)
          })

          if (!response.ok) {
            const error = await response.json()
            throw new Error(error.message || 'Failed to create booking')
          }

          const booking = await response.json()
          
          // Refresh bookings
          get().fetchMyBookings(token)
          get().fetchUpcomingBookings(token)
          
          return booking
        } finally {
          set({ isCreatingBooking: false })
        }
      },

      fetchMyBookings: async (token: string) => {
        set({ isLoading: true })
        try {
          const response = await fetch(`${API_BASE_URL}/bookings/my-bookings`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })

          if (response.ok) {
            const data = await response.json()
            set({ myBookings: data.bookings || [] })
          }
        } catch (error) {
          console.error('Failed to fetch my bookings:', error)
        } finally {
          set({ isLoading: false })
        }
      },

      fetchUpcomingBookings: async (token: string) => {
        try {
          const response = await fetch(`${API_BASE_URL}/bookings/upcoming`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })

          if (response.ok) {
            const bookings = await response.json()
            set({ upcomingBookings: bookings })
          }
        } catch (error) {
          console.error('Failed to fetch upcoming bookings:', error)
        }
      },

      fetchAvailableSlots: async (providerId: string, serviceId: string, date: string, token: string) => {
        set({ isLoading: true })
        try {
          const response = await fetch(
            `${API_BASE_URL}/bookings/availability/${providerId}/${serviceId}?date=${date}`,
            {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }
          )

          if (response.ok) {
            const data = await response.json()
            const timeSlots = data.timeSlots.map((time: string) => ({
              time,
              available: true
            }))
            set({ availableSlots: timeSlots })
          }
        } catch (error) {
          console.error('Failed to fetch available slots:', error)
          set({ availableSlots: [] })
        } finally {
          set({ isLoading: false })
        }
      },

      cancelBooking: async (bookingId: string, token: string) => {
        try {
          const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/cancel`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              reason: 'Cancelled by customer'
            })
          })

          if (response.ok) {
            // Refresh bookings
            get().fetchMyBookings(token)
            get().fetchUpcomingBookings(token)
          } else {
            const error = await response.json()
            throw new Error(error.message || 'Failed to cancel booking')
          }
        } catch (error) {
          console.error('Failed to cancel booking:', error)
          throw error
        }
      },

      rescheduleBooking: async (
        bookingId: string, 
        newStartTime: string, 
        newEndTime: string, 
        reason: string, 
        token: string
      ) => {
        try {
          const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/reschedule`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              newStartTime,
              newEndTime,
              reason
            })
          })

          if (response.ok) {
            // Refresh bookings
            get().fetchMyBookings(token)
            get().fetchUpcomingBookings(token)
          } else {
            const error = await response.json()
            throw new Error(error.message || 'Failed to reschedule booking')
          }
        } catch (error) {
          console.error('Failed to reschedule booking:', error)
          throw error
        }
      }
    }),
    {
      name: 'booking-storage',
      partialize: (state) => ({
        selectedService: state.selectedService,
        selectedProvider: state.selectedProvider,
        selectedDate: state.selectedDate,
        selectedTimeSlot: state.selectedTimeSlot,
        bookingNotes: state.bookingNotes
      })
    }
  )
)
