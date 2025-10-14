import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux'
import type { RootState, AppDispatch } from './index'

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

// Convenience hooks for common state selections
export const useAuth = () => useAppSelector((state) => state.auth)
export const useBooking = () => useAppSelector((state) => state.booking)
export const useService = () => useAppSelector((state) => state.service)
export const useProvider = () => useAppSelector((state) => state.provider)
export const useCart = () => useAppSelector((state) => state.cart)
export const useNotification = () => useAppSelector((state) => state.notification)
export const useUI = () => useAppSelector((state) => state.ui)

// Computed selectors
export const useIsAuthenticated = () => useAppSelector((state) => state.auth.isAuthenticated)
export const useCurrentUser = () => useAppSelector((state) => state.auth.user)
export const useCartItemCount = () => useAppSelector((state) => state.cart.totalItems)
export const useCartTotal = () => useAppSelector((state) => state.cart.totalPrice)
export const useUnreadNotificationCount = () => useAppSelector((state) => state.notification.unreadCount)
export const useIsLoading = () => useAppSelector((state) => 
  state.auth.isLoading || 
  state.booking.isLoading || 
  state.service.isLoading || 
  state.provider.isLoading ||
  state.cart.isLoading ||
  state.notification.isLoading
)

// Theme selector
export const useTheme = () => useAppSelector((state) => state.ui.theme)

// Modal selectors
export const useModals = () => useAppSelector((state) => state.ui.modals)

// Search and filters
export const useSearchFilters = () => useAppSelector((state) => ({
  searchQuery: state.service.searchQuery,
  selectedCategory: state.service.selectedCategory,
  priceRange: state.service.priceRange,
  sortBy: state.service.sortBy,
  sortOrder: state.service.sortOrder,
}))

// Booking flow selectors
export const useBookingFlow = () => useAppSelector((state) => ({
  selectedService: state.booking.selectedService,
  selectedProvider: state.booking.selectedProvider,
  selectedDate: state.booking.selectedDate,
  selectedTimeSlot: state.booking.selectedTimeSlot,
  bookingNotes: state.booking.bookingNotes,
  availableSlots: state.booking.availableSlots,
}))