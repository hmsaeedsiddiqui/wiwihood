export interface User {
  id: number
  email: string
  firstName: string
  lastName: string
  phoneNumber?: string
  dateOfBirth?: string
  address?: string
  city?: string
  country?: string
  postalCode?: string
  profileImageUrl?: string
  isActive: boolean
  role: UserRole
  createdAt: string
  updatedAt: string
}

export interface Provider {
  id: number
  user: User
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
  services: Service[]
  workingHours: ProviderWorkingHours[]
  createdAt: string
  updatedAt: string
}

export interface Service {
  id: number
  name: string
  description?: string
  basePrice: number
  duration: number
  isActive: boolean
  categoryId: number
  category: Category
  providerId: number
  provider: Provider
  imageUrl?: string
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: number
  name: string
  description?: string
  iconName?: string
  isActive: boolean
  services: Service[]
  createdAt: string
  updatedAt: string
}

export interface Booking {
  id: number
  startTime: string
  endTime: string
  totalPrice: number
  status: BookingStatus
  notes?: string
  customerId: number
  customer: User
  serviceId: number
  service: Service
  createdAt: string
  updatedAt: string
}

export interface Review {
  id: number
  rating: number
  comment?: string
  customerId: number
  customer: User
  providerId: number
  provider: Provider
  bookingId?: number
  booking?: Booking
  createdAt: string
  updatedAt: string
}

export enum UserRole {
  CUSTOMER = 'customer',
  PROVIDER = 'provider',
  ADMIN = 'admin'
}

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export interface ProviderWorkingHours {
  id: number
  dayOfWeek: number
  startTime: string
  endTime: string
  providerId: number
  createdAt: string
  updatedAt: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
  phoneNumber?: string
  role: UserRole
}

export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface SearchFilters {
  query?: string
  categoryId?: number
  location?: string
  priceMin?: number
  priceMax?: number
  rating?: number
  sortBy?: 'price' | 'rating' | 'distance' | 'popularity'
  sortOrder?: 'asc' | 'desc'
}
