import { create } from 'zustand'
import { User, AuthState, LoginCredentials, RegisterData } from '@/types'

interface AuthStore extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  updateUser: (user: Partial<User>) => void
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (credentials: LoginCredentials) => {
    set({ isLoading: true })
    try {
  const response = await fetch('http://localhost:8000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      })

      if (!response.ok) {
        throw new Error('Login failed')
      }

      const data = await response.json()
      
      // Store in localStorage
      localStorage.setItem('auth-token', data.access_token)
      localStorage.setItem('auth-user', JSON.stringify(data.user))
      
      set({
        user: data.user,
        token: data.access_token,
        isAuthenticated: true,
        isLoading: false,
      })
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },

  register: async (data: RegisterData) => {
    set({ isLoading: true })
    try {
  const response = await fetch('http://localhost:8000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Registration failed')
      }

      const result = await response.json()
      
      // Store in localStorage
      localStorage.setItem('auth-token', result.access_token)
      localStorage.setItem('auth-user', JSON.stringify(result.user))
      
      set({
        user: result.user,
        token: result.access_token,
        isAuthenticated: true,
        isLoading: false,
      })
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },

  logout: () => {
    localStorage.removeItem('auth-token')
    localStorage.removeItem('auth-user')
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    })
  },

  updateUser: (userData: Partial<User>) => {
    const { user } = get()
    if (user) {
      const updatedUser = { ...user, ...userData }
      localStorage.setItem('auth-user', JSON.stringify(updatedUser))
      set({ user: updatedUser })
    }
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading })
  },
}))

// Initialize from localStorage on app start
if (typeof window !== 'undefined') {
  const token = localStorage.getItem('auth-token')
  const userStr = localStorage.getItem('auth-user')
  
  if (token && userStr) {
    try {
      const user = JSON.parse(userStr)
      useAuthStore.setState({
        user,
        token,
        isAuthenticated: true,
      })
    } catch (error) {
      localStorage.removeItem('auth-token')
      localStorage.removeItem('auth-user')
    }
  }
}
