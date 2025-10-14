import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

// Define types locally for now
interface Provider {
  id: number
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
  createdAt: string
  updatedAt: string
}

interface Service {
  id: number
  name: string
  description?: string
  basePrice: number
  duration: number
  isActive: boolean
  categoryId: number
  providerId: number
  imageUrl?: string
  createdAt: string
  updatedAt: string
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

// Provider state interface
interface ProviderState {
  providers: Provider[]
  selectedProvider: Provider | null
  providerServices: Service[]
  isLoading: boolean
  error: string | null
  
  // Search and filters
  searchQuery: string
  location: string
  rating: number
  sortBy: 'rating' | 'distance' | 'popularity'
  sortOrder: 'asc' | 'desc'
}

// Initial state
const initialState: ProviderState = {
  providers: [],
  selectedProvider: null,
  providerServices: [],
  isLoading: false,
  error: null,
  searchQuery: '',
  location: '',
  rating: 0,
  sortBy: 'rating',
  sortOrder: 'desc',
}

// Async thunks
export const fetchProviders = createAsyncThunk(
  'provider/fetchProviders',
  async (params: {
    page?: number
    limit?: number
    search?: string
    location?: string
    category?: string
    rating?: number
    sortBy?: string
    sortOrder?: string
  } = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams()
      
      if (params?.page) queryParams.append('page', params.page.toString())
      if (params?.limit) queryParams.append('limit', params.limit.toString())
      if (params?.search) queryParams.append('search', params.search)
      if (params?.location) queryParams.append('location', params.location)
      if (params?.category) queryParams.append('category', params.category)
      if (params?.rating) queryParams.append('rating', params.rating.toString())
      if (params?.sortBy) queryParams.append('sortBy', params.sortBy)
      if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder)

      const response = await fetch(`${API_BASE_URL}/providers?${queryParams.toString()}`)

      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.message || 'Failed to fetch providers')
      }

      const data = await response.json()
      return data.providers || data
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error')
    }
  }
)

export const fetchProviderById = createAsyncThunk(
  'provider/fetchProviderById',
  async (providerId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/providers/${providerId}`)

      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.message || 'Failed to fetch provider')
      }

      const provider = await response.json()
      return provider
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error')
    }
  }
)

export const fetchProviderServices = createAsyncThunk(
  'provider/fetchProviderServices',
  async (providerId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/providers/${providerId}/services`)

      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.message || 'Failed to fetch provider services')
      }

      const data = await response.json()
      return data.services || data
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error')
    }
  }
)

export const searchProviders = createAsyncThunk(
  'provider/searchProviders',
  async (params: {
    query: string
    location?: string
    category?: string
    rating?: number
    sortBy?: string
    sortOrder?: string
    page?: number
    limit?: number
  }, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams()
      
      queryParams.append('search', params.query)
      if (params.location) queryParams.append('location', params.location)
      if (params.category) queryParams.append('category', params.category)
      if (params.rating) queryParams.append('rating', params.rating.toString())
      if (params.sortBy) queryParams.append('sortBy', params.sortBy)
      if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder)
      if (params.page) queryParams.append('page', params.page.toString())
      if (params.limit) queryParams.append('limit', params.limit.toString())

      const response = await fetch(`${API_BASE_URL}/providers/search?${queryParams.toString()}`)

      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.message || 'Failed to search providers')
      }

      const data = await response.json()
      return data.providers || data
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error')
    }
  }
)

export const fetchNearbyProviders = createAsyncThunk(
  'provider/fetchNearbyProviders',
  async (params: {
    latitude: number
    longitude: number
    radius?: number
    category?: string
    limit?: number
  }, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams()
      
      queryParams.append('latitude', params.latitude.toString())
      queryParams.append('longitude', params.longitude.toString())
      if (params.radius) queryParams.append('radius', params.radius.toString())
      if (params.category) queryParams.append('category', params.category)
      if (params.limit) queryParams.append('limit', params.limit.toString())

      const response = await fetch(`${API_BASE_URL}/providers/nearby?${queryParams.toString()}`)

      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.message || 'Failed to fetch nearby providers')
      }

      const data = await response.json()
      return data.providers || data
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error')
    }
  }
)

// Provider slice
const providerSlice = createSlice({
  name: 'provider',
  initialState,
  reducers: {
    setSelectedProvider: (state, action: PayloadAction<Provider | null>) => {
      state.selectedProvider = action.payload
    },
    clearSelectedProvider: (state) => {
      state.selectedProvider = null
      state.providerServices = []
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
    },
    setLocation: (state, action: PayloadAction<string>) => {
      state.location = action.payload
    },
    setRating: (state, action: PayloadAction<number>) => {
      state.rating = action.payload
    },
    setSortBy: (state, action: PayloadAction<'rating' | 'distance' | 'popularity'>) => {
      state.sortBy = action.payload
    },
    setSortOrder: (state, action: PayloadAction<'asc' | 'desc'>) => {
      state.sortOrder = action.payload
    },
    clearFilters: (state) => {
      state.searchQuery = ''
      state.location = ''
      state.rating = 0
      state.sortBy = 'rating'
      state.sortOrder = 'desc'
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch providers cases
      .addCase(fetchProviders.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchProviders.fulfilled, (state, action) => {
        state.isLoading = false
        state.providers = action.payload
        state.error = null
      })
      .addCase(fetchProviders.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      
      // Fetch provider by ID cases
      .addCase(fetchProviderById.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchProviderById.fulfilled, (state, action) => {
        state.isLoading = false
        state.selectedProvider = action.payload
        state.error = null
      })
      .addCase(fetchProviderById.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      
      // Fetch provider services cases
      .addCase(fetchProviderServices.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchProviderServices.fulfilled, (state, action) => {
        state.isLoading = false
        state.providerServices = action.payload
        state.error = null
      })
      .addCase(fetchProviderServices.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      
      // Search providers cases
      .addCase(searchProviders.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(searchProviders.fulfilled, (state, action) => {
        state.isLoading = false
        state.providers = action.payload
        state.error = null
      })
      .addCase(searchProviders.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      
      // Fetch nearby providers cases
      .addCase(fetchNearbyProviders.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchNearbyProviders.fulfilled, (state, action) => {
        state.isLoading = false
        state.providers = action.payload
        state.error = null
      })
      .addCase(fetchNearbyProviders.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const {
  setSelectedProvider,
  clearSelectedProvider,
  setSearchQuery,
  setLocation,
  setRating,
  setSortBy,
  setSortOrder,
  clearFilters,
  clearError,
} = providerSlice.actions

export default providerSlice.reducer