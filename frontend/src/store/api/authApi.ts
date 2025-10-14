import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Base URL for API
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

// Authentication Types based on backend DTOs
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
  user: {
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
}

export interface TwoFactorResponse {
  requiresTwoFactor: boolean
  userId: string
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
  provider?: {
    id: string
    businessName: string
  }
}

export interface ApiError {
  status: number
  data: {
    message: string | string[]
    statusCode: number
    error?: string
  }
  message?: string
}

// Create the authentication API slice
export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/auth`,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
      // Get token from localStorage for authenticated requests
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('accessToken') || 
                     localStorage.getItem('providerToken') ||
                     localStorage.getItem('auth-token')
        
        if (token) {
          headers.set('authorization', `Bearer ${token}`)
        }
      }
      
      headers.set('content-type', 'application/json')
      return headers
    },
  }),
  tagTypes: ['User', 'Profile'],
  endpoints: (builder) => ({
    // Register new user
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (credentials) => ({
        url: '/register',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User'],
      transformErrorResponse: (response: { status: number; data: any }) => ({
        status: response.status,
        data: response.data,
        message: Array.isArray(response.data?.message) 
          ? response.data.message.join(', ')
          : response.data?.message || 'Registration failed'
      }),
    }),

    // Login user
    login: builder.mutation<AuthResponse | TwoFactorResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User', 'Profile'],
      transformErrorResponse: (response: { status: number; data: any }) => ({
        status: response.status,
        data: response.data,
        message: response.data?.message || 'Login failed'
      }),
    }),

    // Get user profile
    getProfile: builder.query<UserProfile, void>({
      query: () => '/profile',
      providesTags: ['Profile'],
      transformErrorResponse: (response: { status: number; data: any }) => ({
        status: response.status,
        data: response.data,
        message: response.data?.message || 'Failed to fetch profile'
      }),
    }),

    // Refresh token
    refreshToken: builder.mutation<AuthResponse, void>({
      query: () => ({
        url: '/refresh',
        method: 'POST',
      }),
      invalidatesTags: ['User', 'Profile'],
    }),

    // Logout user
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/logout',
        method: 'POST',
      }),
      invalidatesTags: ['User', 'Profile'],
    }),
  }),
})

// Export hooks for usage in functional components
export const {
  useRegisterMutation,
  useLoginMutation,
  useGetProfileQuery,
  useRefreshTokenMutation,
  useLogoutMutation,
} = authApi

export default authApi