import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

// Define types locally for now
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

interface Category {
  id: number
  name: string
  description?: string
  iconName?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

// Service state interface
interface ServiceState {
  services: Service[]
  categories: Category[]
  featuredServices: Service[]
  selectedService: Service | null
  isLoading: boolean
  error: string | null
  
  // Search and filters
  searchQuery: string
  selectedCategory: Category | null
  priceRange: [number, number]
  sortBy: 'price' | 'rating' | 'popularity' | 'distance'
  sortOrder: 'asc' | 'desc'
}

// Initial state
const initialState: ServiceState = {
  services: [],
  categories: [],
  featuredServices: [],
  selectedService: null,
  isLoading: false,
  error: null,
  searchQuery: '',
  selectedCategory: null,
  priceRange: [0, 1000],
  sortBy: 'popularity',
  sortOrder: 'desc',
}

// Async thunks
export const fetchServices = createAsyncThunk(
  'service/fetchServices',
  async (params: {
    page?: number
    limit?: number
    category?: string
    search?: string
    minPrice?: number
    maxPrice?: number
    sortBy?: string
    sortOrder?: string
  } = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams()
      
      if (params?.page) queryParams.append('page', params.page.toString())
      if (params?.limit) queryParams.append('limit', params.limit.toString())
      if (params?.category) queryParams.append('category', params.category)
      if (params?.search) queryParams.append('search', params.search)
      if (params?.minPrice) queryParams.append('minPrice', params.minPrice.toString())
      if (params?.maxPrice) queryParams.append('maxPrice', params.maxPrice.toString())
      if (params?.sortBy) queryParams.append('sortBy', params.sortBy)
      if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder)

      const response = await fetch(`${API_BASE_URL}/services?${queryParams.toString()}`)

      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.message || 'Failed to fetch services')
      }

      const data = await response.json()
      return data.services || data
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error')
    }
  }
)

export const fetchServiceById = createAsyncThunk(
  'service/fetchServiceById',
  async (serviceId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/services/${serviceId}`)

      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.message || 'Failed to fetch service')
      }

      const service = await response.json()
      return service
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error')
    }
  }
)

export const fetchCategories = createAsyncThunk(
  'service/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`)

      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.message || 'Failed to fetch categories')
      }

      const data = await response.json()
      return data.categories || data
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error')
    }
  }
)

export const fetchFeaturedServices = createAsyncThunk(
  'service/fetchFeaturedServices',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/services/featured`)

      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.message || 'Failed to fetch featured services')
      }

      const data = await response.json()
      return data.services || data
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error')
    }
  }
)

export const searchServices = createAsyncThunk(
  'service/searchServices',
  async (params: {
    query: string
    category?: string
    location?: string
    priceMin?: number
    priceMax?: number
    rating?: number
    sortBy?: string
    sortOrder?: string
    page?: number
    limit?: number
  }, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams()
      
      queryParams.append('search', params.query)
      if (params.category) queryParams.append('category', params.category)
      if (params.location) queryParams.append('location', params.location)
      if (params.priceMin) queryParams.append('priceMin', params.priceMin.toString())
      if (params.priceMax) queryParams.append('priceMax', params.priceMax.toString())
      if (params.rating) queryParams.append('rating', params.rating.toString())
      if (params.sortBy) queryParams.append('sortBy', params.sortBy)
      if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder)
      if (params.page) queryParams.append('page', params.page.toString())
      if (params.limit) queryParams.append('limit', params.limit.toString())

      const response = await fetch(`${API_BASE_URL}/services/search?${queryParams.toString()}`)

      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.message || 'Failed to search services')
      }

      const data = await response.json()
      return data.services || data
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error')
    }
  }
)

// Service slice
const serviceSlice = createSlice({
  name: 'service',
  initialState,
  reducers: {
    setSelectedService: (state, action: PayloadAction<Service | null>) => {
      state.selectedService = action.payload
    },
    clearSelectedService: (state) => {
      state.selectedService = null
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
    },
    setSelectedCategory: (state, action: PayloadAction<Category | null>) => {
      state.selectedCategory = action.payload
    },
    setPriceRange: (state, action: PayloadAction<[number, number]>) => {
      state.priceRange = action.payload
    },
    setSortBy: (state, action: PayloadAction<'price' | 'rating' | 'popularity' | 'distance'>) => {
      state.sortBy = action.payload
    },
    setSortOrder: (state, action: PayloadAction<'asc' | 'desc'>) => {
      state.sortOrder = action.payload
    },
    clearFilters: (state) => {
      state.searchQuery = ''
      state.selectedCategory = null
      state.priceRange = [0, 1000]
      state.sortBy = 'popularity'
      state.sortOrder = 'desc'
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch services cases
      .addCase(fetchServices.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.isLoading = false
        state.services = action.payload
        state.error = null
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      
      // Fetch service by ID cases
      .addCase(fetchServiceById.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchServiceById.fulfilled, (state, action) => {
        state.isLoading = false
        state.selectedService = action.payload
        state.error = null
      })
      .addCase(fetchServiceById.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      
      // Fetch categories cases
      .addCase(fetchCategories.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isLoading = false
        state.categories = action.payload
        state.error = null
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      
      // Fetch featured services cases
      .addCase(fetchFeaturedServices.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchFeaturedServices.fulfilled, (state, action) => {
        state.isLoading = false
        state.featuredServices = action.payload
        state.error = null
      })
      .addCase(fetchFeaturedServices.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      
      // Search services cases
      .addCase(searchServices.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(searchServices.fulfilled, (state, action) => {
        state.isLoading = false
        state.services = action.payload
        state.error = null
      })
      .addCase(searchServices.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const {
  setSelectedService,
  clearSelectedService,
  setSearchQuery,
  setSelectedCategory,
  setPriceRange,
  setSortBy,
  setSortOrder,
  clearFilters,
  clearError,
} = serviceSlice.actions

export default serviceSlice.reducer