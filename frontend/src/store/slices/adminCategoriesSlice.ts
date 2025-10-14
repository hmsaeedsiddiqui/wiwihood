import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Category } from '../api/adminCategoriesApi'

export interface AdminCategoriesState {
  categories: Category[]
  selectedCategory: Category | null
  loading: boolean
  error: string | null
  filters: {
    page: number
    limit: number
    search: string
    active: boolean | null
    parentId: string | null
  }
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
  // UI states
  isCreating: boolean
  isUpdating: boolean
  isDeleting: boolean
  showCreateModal: boolean
  showEditModal: boolean
  showDeleteConfirm: boolean
}

const initialState: AdminCategoriesState = {
  categories: [],
  selectedCategory: null,
  loading: false,
  error: null,
  filters: {
    page: 1,
    limit: 10,
    search: '',
    active: null,
    parentId: null,
  },
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  },
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  showCreateModal: false,
  showEditModal: false,
  showDeleteConfirm: false,
}

const adminCategoriesSlice = createSlice({
  name: 'adminCategories',
  initialState,
  reducers: {
    // Loading states
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },

    // Categories data
    setCategories: (state, action: PayloadAction<Category[]>) => {
      state.categories = action.payload
    },
    addCategory: (state, action: PayloadAction<Category>) => {
      state.categories.unshift(action.payload)
    },
    updateCategory: (state, action: PayloadAction<Category>) => {
      const index = state.categories.findIndex(cat => cat.id === action.payload.id)
      if (index !== -1) {
        state.categories[index] = action.payload
      }
    },
    removeCategory: (state, action: PayloadAction<string>) => {
      state.categories = state.categories.filter(cat => cat.id !== action.payload)
    },

    // Selected category
    setSelectedCategory: (state, action: PayloadAction<Category | null>) => {
      state.selectedCategory = action.payload
    },

    // Filters
    setFilters: (state, action: PayloadAction<Partial<AdminCategoriesState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    resetFilters: (state) => {
      state.filters = initialState.filters
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.filters.search = action.payload
      state.filters.page = 1 // Reset to first page when searching
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.filters.page = action.payload
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.filters.limit = action.payload
      state.filters.page = 1 // Reset to first page when changing limit
    },
    setActiveFilter: (state, action: PayloadAction<boolean | null>) => {
      state.filters.active = action.payload
      state.filters.page = 1
    },

    // Pagination
    setPagination: (state, action: PayloadAction<AdminCategoriesState['pagination']>) => {
      state.pagination = action.payload
    },

    // Operation states
    setCreating: (state, action: PayloadAction<boolean>) => {
      state.isCreating = action.payload
    },
    setUpdating: (state, action: PayloadAction<boolean>) => {
      state.isUpdating = action.payload
    },
    setDeleting: (state, action: PayloadAction<boolean>) => {
      state.isDeleting = action.payload
    },

    // Modal states
    setShowCreateModal: (state, action: PayloadAction<boolean>) => {
      state.showCreateModal = action.payload
      if (!action.payload) {
        state.selectedCategory = null
      }
    },
    setShowEditModal: (state, action: PayloadAction<boolean>) => {
      state.showEditModal = action.payload
      if (!action.payload) {
        state.selectedCategory = null
      }
    },
    setShowDeleteConfirm: (state, action: PayloadAction<boolean>) => {
      state.showDeleteConfirm = action.payload
      if (!action.payload) {
        state.selectedCategory = null
      }
    },

    // Bulk operations
    toggleCategoryStatus: (state, action: PayloadAction<string>) => {
      const category = state.categories.find(cat => cat.id === action.payload)
      if (category) {
        category.isActive = !category.isActive
      }
    },

    // Reset state
    resetState: (state) => {
      return initialState
    },

    // Clear error
    clearError: (state) => {
      state.error = null
    },
  },
})

export const {
  setLoading,
  setError,
  setCategories,
  addCategory,
  updateCategory,
  removeCategory,
  setSelectedCategory,
  setFilters,
  resetFilters,
  setSearch,
  setPage,
  setLimit,
  setActiveFilter,
  setPagination,
  setCreating,
  setUpdating,
  setDeleting,
  setShowCreateModal,
  setShowEditModal,
  setShowDeleteConfirm,
  toggleCategoryStatus,
  resetState,
  clearError,
} = adminCategoriesSlice.actions

export default adminCategoriesSlice.reducer