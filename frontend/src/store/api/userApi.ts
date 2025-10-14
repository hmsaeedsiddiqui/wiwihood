import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Base URL for API
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

// User management types
export interface UpdateProfileRequest {
  firstName?: string
  lastName?: string
  phone?: string
  dateOfBirth?: string
  address?: string
  city?: string
  country?: string
  postalCode?: string
  profileImage?: string
  timezone?: string
  // Note: email is not updatable via profile endpoint for security reasons
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
}

export interface UpdateNotificationSettingsRequest {
  emailNotifications: boolean
  smsNotifications: boolean
  pushNotifications: boolean
  marketingEmails: boolean
  bookingReminders: boolean
  promotionalSms: boolean
}

export interface UserProfile {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  dateOfBirth?: string
  address?: string
  city?: string
  country?: string
  postalCode?: string
  profileImage?: string | null
  timezone?: string
  role: 'customer' | 'provider' | 'admin'
  status: string
  isEmailVerified: boolean
  isPhoneVerified: boolean
  createdAt: string
  updatedAt: string
  notificationSettings?: {
    emailNotifications: boolean
    smsNotifications: boolean
    pushNotifications: boolean
    marketingEmails: boolean
    bookingReminders: boolean
    promotionalSms: boolean
  }
}

// Get actual user profile from localStorage (your registered account data)
export const getDemoUserProfile = (): UserProfile => {
  const storedUser = localStorage.getItem('user') || localStorage.getItem('provider')
  if (storedUser) {
    const parsedUser = JSON.parse(storedUser)
    return {
      id: parsedUser.id || parsedUser.userId || '1',
      firstName: parsedUser.firstName || parsedUser.name?.split(' ')[0] || 'User',
      lastName: parsedUser.lastName || parsedUser.name?.split(' ')[1] || 'Name',
      email: parsedUser.email || 'user@example.com',
      phone: parsedUser.phone || parsedUser.phoneNumber || '',
      dateOfBirth: parsedUser.dateOfBirth || '',
      address: parsedUser.address || '',
      city: parsedUser.city || '',
      country: parsedUser.country || '',
      postalCode: parsedUser.postalCode || '',
      profileImage: parsedUser.profileImage || parsedUser.avatar || '',
      role: parsedUser.role || 'customer',
      status: parsedUser.status || 'active',
      isEmailVerified: parsedUser.isEmailVerified ?? true,
      isPhoneVerified: parsedUser.isPhoneVerified ?? true,
      createdAt: parsedUser.createdAt || new Date().toISOString(),
      updatedAt: parsedUser.updatedAt || new Date().toISOString(),
      notificationSettings: {
        emailNotifications: parsedUser.notificationSettings?.emailNotifications ?? true,
        smsNotifications: parsedUser.notificationSettings?.smsNotifications ?? false,
        pushNotifications: parsedUser.notificationSettings?.pushNotifications ?? true,
        marketingEmails: parsedUser.notificationSettings?.marketingEmails ?? false,
        bookingReminders: parsedUser.notificationSettings?.bookingReminders ?? true,
        promotionalSms: parsedUser.notificationSettings?.promotionalSms ?? false,
      }
    }
  }
  
  // Fallback only if no user data is found
  return {
    id: '1',
    firstName: 'User',
    lastName: 'Name',
    email: 'user@example.com',
    phone: '',
    dateOfBirth: '',
    address: '',
    city: '',
    country: '',
    postalCode: '',
    profileImage: null,
    role: 'customer',
    status: 'active',
    isEmailVerified: true,
    isPhoneVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    notificationSettings: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      marketingEmails: false,
      bookingReminders: true,
      promotionalSms: false,
    }
  }
}

// Create API slice for user management
export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/users`,
    prepareHeaders: (headers, { getState }) => {
      // Check all possible token keys that are used in the app
      const token = typeof window !== 'undefined' ? 
        localStorage.getItem('accessToken') || 
        localStorage.getItem('providerToken') ||
        localStorage.getItem('auth-token') ||
        localStorage.getItem('authToken') || 
        localStorage.getItem('token') : null
      
      console.log('Token for API call:', token ? token.substring(0, 20) + '...' : 'No token found')
      
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      headers.set('Content-Type', 'application/json')
      return headers
    },
    timeout: 5000, // 5 second timeout to quickly detect if backend is unavailable
  }),
  tagTypes: ['UserProfile', 'NotificationSettings'],
  endpoints: (builder) => ({
    // Get user profile
    getUserProfile: builder.query<UserProfile, void>({
      query: () => '/me',
      providesTags: ['UserProfile'],
    }),

    // Update user profile
    updateProfile: builder.mutation<UserProfile, UpdateProfileRequest>({
      query: (profileData) => ({
        url: '/me/profile',
        method: 'PUT',
        body: profileData,
      }),
      invalidatesTags: ['UserProfile'],
      transformErrorResponse: (response) => ({
        status: response.status || 500,
        message: 'Failed to update profile'
      }),
    }),

    // Change password
    changePassword: builder.mutation<{ message: string }, ChangePasswordRequest>({
      query: (passwordData) => ({
        url: '/me/password',
        method: 'PUT',
        body: passwordData,
      }),
      transformErrorResponse: (response) => ({
        status: response.status || 500,
        message: 'Failed to change password'
      }),
    }),

    // Update notification settings
    updateNotificationSettings: builder.mutation<UserProfile, UpdateNotificationSettingsRequest>({
      query: (settings) => ({
        url: '/me/notifications',
        method: 'PUT',
        body: settings,
      }),
      invalidatesTags: ['NotificationSettings', 'UserProfile'],
      transformErrorResponse: (response) => ({
        status: response.status || 500,
        message: 'Failed to update notification settings'
      }),
    }),

    // Upload profile picture
    uploadProfilePicture: builder.mutation<{ profileImage: string }, FormData>({
      query: (formData) => ({
        url: '/upload-avatar',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['UserProfile'],
    }),

    // Delete account
    deleteAccount: builder.mutation<{ message: string }, { password: string }>({
      query: (data) => ({
        url: '/delete-account',
        method: 'DELETE',
        body: data,
      }),
    }),
  }),
})

// Export hooks for usage in functional components
export const {
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useUpdateNotificationSettingsMutation,
  useGetUserProfileQuery,
  useUploadProfilePictureMutation,
  useDeleteAccountMutation,
} = userApi