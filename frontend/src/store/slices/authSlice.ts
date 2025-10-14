import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { authApi } from '../api/authApi'
import type { User, AuthResponse } from '../../types/api'

interface AuthState {
  user: User | null
  token: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

// Initial state
const initialState: AuthState = {
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null,
  refreshToken: typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
}

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Clear error
    clearError: (state) => {
      state.error = null
    },
    
    // Update user info
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload }
      }
    },
    
    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    
    // Logout action
    logout: (state) => {
      state.user = null
      state.token = null
      state.refreshToken = null
      state.isAuthenticated = false
      state.error = null
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
      }
    },
    
    // Set authentication state
    setAuth: (state, action: PayloadAction<{ user: User; token: string; refreshToken: string }>) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.refreshToken = action.payload.refreshToken
      state.isAuthenticated = true
      state.error = null
    },
    
    // Initialize auth from localStorage
    initializeAuth: (state) => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('accessToken')
        const refreshToken = localStorage.getItem('refreshToken')
        
        if (token && refreshToken) {
          state.token = token
          state.refreshToken = refreshToken
          // isAuthenticated will be set when profile is fetched
        }
      }
    },
  },
  extraReducers: (builder) => {
    // Handle RTK Query auth API responses
    builder
      // Register
      .addMatcher(authApi.endpoints.register.matchPending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addMatcher(authApi.endpoints.register.matchFulfilled, (state, action) => {
        state.isLoading = false
        const response = action.payload as AuthResponse
        state.user = response.user
        state.token = response.accessToken
        state.refreshToken = response.refreshToken
        state.isAuthenticated = true
        state.error = null
        
        // Update localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('accessToken', response.accessToken)
          localStorage.setItem('refreshToken', response.refreshToken)
        }
      })
      .addMatcher(authApi.endpoints.register.matchRejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Registration failed'
        state.user = null
        state.token = null
        state.refreshToken = null
        state.isAuthenticated = false
      })
      
      // Login
      .addMatcher(authApi.endpoints.login.matchPending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
        state.isLoading = false
        const response = action.payload
        
        // Check if it's an AuthResponse (successful login) or TwoFactorResponse
        if ('accessToken' in response) {
          const authResponse = response as AuthResponse
          state.user = authResponse.user
          state.token = authResponse.accessToken
          state.refreshToken = authResponse.refreshToken
          state.isAuthenticated = true
          state.error = null
          
          // Update localStorage
          if (typeof window !== 'undefined') {
            localStorage.setItem('accessToken', authResponse.accessToken)
            localStorage.setItem('refreshToken', authResponse.refreshToken)
          }
        }
        // For 2FA response, keep current state but clear loading
      })
      .addMatcher(authApi.endpoints.login.matchRejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Login failed'
        state.user = null
        state.token = null
        state.refreshToken = null
        state.isAuthenticated = false
      })
      
      // Get Profile
      .addMatcher(authApi.endpoints.getProfile.matchPending, (state) => {
        state.isLoading = true
      })
      .addMatcher(authApi.endpoints.getProfile.matchFulfilled, (state, action) => {
        state.isLoading = false
        // Update user data from profile
        if (action.payload) {
          state.user = {
            id: action.payload.id,
            email: action.payload.email,
            firstName: action.payload.firstName,
            lastName: action.payload.lastName,
            role: action.payload.role,
            status: action.payload.status,
            profilePicture: action.payload.profilePicture,
            phone: action.payload.phone,
            isEmailVerified: action.payload.isEmailVerified,
            isPhoneVerified: action.payload.isPhoneVerified,
          }
          state.isAuthenticated = true
        }
      })
      .addMatcher(authApi.endpoints.getProfile.matchRejected, (state) => {
        state.isLoading = false
        // Don't clear auth state on profile failure - token might still be valid
      })
      
      // Refresh Token
      .addMatcher(authApi.endpoints.refreshToken.matchFulfilled, (state, action) => {
        const response = action.payload as AuthResponse
        state.token = response.accessToken
        state.refreshToken = response.refreshToken
        state.user = response.user
        state.isAuthenticated = true
        
        // Update localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('accessToken', response.accessToken)
          localStorage.setItem('refreshToken', response.refreshToken)
        }
      })
      .addMatcher(authApi.endpoints.refreshToken.matchRejected, (state) => {
        // Clear auth state on refresh failure
        state.user = null
        state.token = null
        state.refreshToken = null
        state.isAuthenticated = false
      })
      
      // Logout
      .addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
        state.user = null
        state.token = null
        state.refreshToken = null
        state.isAuthenticated = false
        state.error = null
      })
  },
})

export const { clearError, updateUser, setLoading, logout, setAuth, initializeAuth } = authSlice.actions
export default authSlice.reducer