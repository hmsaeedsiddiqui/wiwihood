import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

// Notification interface
export interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  isRead: boolean
  userId: string
  relatedEntityType?: string
  relatedEntityId?: string
  createdAt: string
  updatedAt: string
}

// Toast notification interface
export interface ToastNotification {
  id: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

// Notification state interface
interface NotificationState {
  notifications: Notification[]
  unreadCount: number
  toasts: ToastNotification[]
  isLoading: boolean
  error: string | null
}

// Initial state
const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  toasts: [],
  isLoading: false,
  error: null,
}

// Helper function to get auth headers
const getAuthHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth-token') || 
                 localStorage.getItem('customerToken') || 
                 localStorage.getItem('providerToken') || 
                 localStorage.getItem('adminToken')
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
  }
  
  return headers
}

// Async thunks
export const fetchNotifications = createAsyncThunk(
  'notification/fetchNotifications',
  async (params: {
    page?: number
    limit?: number
    unreadOnly?: boolean
  } = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams()
      
      if (params?.page) queryParams.append('page', params.page.toString())
      if (params?.limit) queryParams.append('limit', params.limit.toString())
      if (params?.unreadOnly) queryParams.append('unreadOnly', 'true')

      const response = await fetch(`${API_BASE_URL}/notifications?${queryParams.toString()}`, {
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.message || 'Failed to fetch notifications')
      }

      const data = await response.json()
      return data.notifications || data
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error')
    }
  }
)

export const markAsRead = createAsyncThunk(
  'notification/markAsRead',
  async (notificationId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}/read`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.message || 'Failed to mark as read')
      }

      return notificationId
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error')
    }
  }
)

export const markAllAsRead = createAsyncThunk(
  'notification/markAllAsRead',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/mark-all-read`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.message || 'Failed to mark all as read')
      }

      return null
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error')
    }
  }
)

export const deleteNotification = createAsyncThunk(
  'notification/deleteNotification',
  async (notificationId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.message || 'Failed to delete notification')
      }

      return notificationId
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error')
    }
  }
)

// Notification slice
const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    // Toast management
    addToast: (state, action: PayloadAction<Omit<ToastNotification, 'id'>>) => {
      const toast: ToastNotification = {
        ...action.payload,
        id: Date.now().toString(),
      }
      state.toasts.push(toast)
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter(toast => toast.id !== action.payload)
    },
    clearAllToasts: (state) => {
      state.toasts = []
    },
    
    // Optimistic updates
    optimisticallyMarkAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload)
      if (notification && !notification.isRead) {
        notification.isRead = true
        state.unreadCount = Math.max(0, state.unreadCount - 1)
      }
    },
    optimisticallyDeleteNotification: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload)
      if (notification && !notification.isRead) {
        state.unreadCount = Math.max(0, state.unreadCount - 1)
      }
      state.notifications = state.notifications.filter(n => n.id !== action.payload)
    },
    
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch notifications cases
      .addCase(fetchNotifications.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.isLoading = false
        state.notifications = action.payload
        state.unreadCount = action.payload.filter((n: Notification) => !n.isRead).length
        state.error = null
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      
      // Mark as read cases
      .addCase(markAsRead.fulfilled, (state, action) => {
        // Already optimistically updated
        state.error = null
      })
      .addCase(markAsRead.rejected, (state, action) => {
        state.error = action.payload as string
        // Revert optimistic update
        const notification = state.notifications.find(n => n.id === action.meta.arg)
        if (notification) {
          notification.isRead = false
          state.unreadCount += 1
        }
      })
      
      // Mark all as read cases
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.notifications.forEach(notification => {
          notification.isRead = true
        })
        state.unreadCount = 0
        state.error = null
      })
      .addCase(markAllAsRead.rejected, (state, action) => {
        state.error = action.payload as string
      })
      
      // Delete notification cases
      .addCase(deleteNotification.fulfilled, (state, action) => {
        // Already optimistically updated
        state.error = null
      })
      .addCase(deleteNotification.rejected, (state, action) => {
        state.error = action.payload as string
        // Note: We could revert the optimistic delete here by refetching
      })
  },
})

export const {
  addToast,
  removeToast,
  clearAllToasts,
  optimisticallyMarkAsRead,
  optimisticallyDeleteNotification,
  clearError,
} = notificationSlice.actions

export default notificationSlice.reducer