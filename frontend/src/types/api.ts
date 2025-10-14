// API Types based on backend DTOs

export interface RegisterRequest {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
  userRole: 'customer' | 'provider' | 'admin'
  profilePicture?: string
}

export interface LoginRequest {
  email: string
  password: string
  twoFactorToken?: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  expiresIn: number
  user: User
}

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
  status: string
  profilePicture?: string
  phone?: string
  isEmailVerified: boolean
  isPhoneVerified: boolean
}

export interface UserProfile {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  role: string
  status: string
  profilePicture?: string
  isEmailVerified: boolean
  isPhoneVerified: boolean
  createdAt: string
  updatedAt: string
  provider?: any // Provider profile if user is a provider
}

export interface TwoFactorResponse {
  requiresTwoFactor: boolean
  userId: string
}

// Union type for login response
export type LoginResponse = AuthResponse | TwoFactorResponse

// API Error types
export interface ApiError {
  message: string
  statusCode: number
  error?: string
}

// Base API response wrapper
export interface ApiResponse<T = any> {
  data?: T
  error?: ApiError
  success: boolean
}