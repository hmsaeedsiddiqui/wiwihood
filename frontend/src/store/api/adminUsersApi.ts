import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Base URL for API
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

// Admin user management types based on backend DTOs
export interface AdminUser {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  role: string
  status: string
  profilePicture?: string
  dateOfBirth?: Date
  address?: string
  city?: string
  country?: string
  postalCode?: string
  timezone?: string
  isEmailVerified: boolean
  isPhoneVerified: boolean
  createdAt: Date
  updatedAt: Date
  // Additional computed fields
  fullName?: string
  lastLoginAt?: Date
  totalBookings?: number
  totalSpent?: number
  totalEarned?: number
}

export interface AdminUsersListResponse {
  users: AdminUser[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface AdminUsersQueryParams {
  page?: number
  limit?: number
  search?: string
  role?: string
  status?: string
}

export interface UpdateUserStatusRequest {
  status: string
}

export interface CreateUserRequest {
  email: string
  firstName: string
  lastName: string
  phone?: string
  role: string
  password: string
}

export interface UpdateUserRequest {
  firstName?: string
  lastName?: string
  phone?: string
  role?: string
  status?: string
  email?: string
  profilePicture?: string
  isEmailVerified?: boolean
  isPhoneVerified?: boolean
  address?: string
  city?: string
  country?: string
  postalCode?: string
}

// Create API slice for admin user management
export const adminUsersApi = createApi({
  reducerPath: 'adminUsersApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/users`,
    prepareHeaders: (headers) => {
      // Get admin token from localStorage
      const token = typeof window !== 'undefined' ? 
        localStorage.getItem('adminToken') || 
        localStorage.getItem('accessToken') ||
        localStorage.getItem('auth-token') : null
      
      console.log('Admin Users API Token:', token ? token.substring(0, 20) + '...' : 'No token found')
      
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      headers.set('Content-Type', 'application/json')
      return headers
    },
    timeout: 10000, // 10 second timeout
  }),
  tagTypes: ['AdminUser', 'AdminUsersList'],
  endpoints: (builder) => ({
    // Get all users with pagination and filters (Admin only)
    getAdminUsers: builder.query<AdminUsersListResponse, AdminUsersQueryParams>({
      query: (params = {}) => {
        const searchParams = new URLSearchParams()
        if (params.page) searchParams.append('page', params.page.toString())
        if (params.limit) searchParams.append('limit', params.limit.toString())
        if (params.search) searchParams.append('search', params.search)
        if (params.role) searchParams.append('role', params.role)
        if (params.status) searchParams.append('status', params.status)
        
        return `?${searchParams.toString()}`
      },
      providesTags: ['AdminUsersList'],
      transformResponse: (response: any) => {
        // Handle different response formats from backend
        if (response.users) {
          return response
        }
        // If response is just an array
        if (Array.isArray(response)) {
          return {
            users: response,
            total: response.length,
            page: 1,
            limit: response.length,
            totalPages: 1
          }
        }
        // Fallback
        return {
          users: [],
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0
        }
      }
    }),

    // Get user by ID (Admin only)
    getAdminUserById: builder.query<AdminUser, string>({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'AdminUser', id }],
    }),

    // Create new user (Admin only)
    createAdminUser: builder.mutation<AdminUser, CreateUserRequest>({
      query: (userData) => ({
        url: '',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['AdminUsersList'],
    }),

    // Update user (Admin only)
    updateAdminUser: builder.mutation<AdminUser, { id: string; userData: UpdateUserRequest }>({
      query: ({ id, userData }) => ({
        url: `/${id}`,
        method: 'PATCH',
        body: userData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'AdminUser', id },
        'AdminUsersList'
      ],
    }),

    // Update user status (Admin only)
    updateAdminUserStatus: builder.mutation<AdminUser, { id: string; status: string }>({
      query: ({ id, status }) => ({
        url: `/${id}`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'AdminUser', id },
        'AdminUsersList'
      ],
    }),

    // Delete user (Admin only)
    deleteAdminUser: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['AdminUsersList'],
      transformErrorResponse: (response: any) => {
        // Handle specific error cases
        if (response.status === 400) {
          return {
            status: response.status,
            message: response.data?.message || 'Cannot delete user due to existing relationships'
          };
        }
        if (response.status === 404) {
          return {
            status: response.status,
            message: 'User not found'
          };
        }
        return {
          status: response.status || 500,
          message: response.data?.message || 'Failed to delete user'
        };
      },
    }),
  }),
})

// Export hooks for usage in functional components
export const {
  useGetAdminUsersQuery,
  useGetAdminUserByIdQuery,
  useCreateAdminUserMutation,
  useUpdateAdminUserMutation,
  useUpdateAdminUserStatusMutation,
  useDeleteAdminUserMutation,
} = adminUsersApi