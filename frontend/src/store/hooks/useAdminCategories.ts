import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { SerializedError } from '@reduxjs/toolkit'
import { RootState } from '../index'
import {
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useUpdateCategoryStatusMutation,
  useSearchCategoriesQuery,
  useGetActiveCategoriesQuery,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  CategoryFilterRequest,
  Category,
} from '../api/adminCategoriesApi'
import {
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
} from '../slices/adminCategoriesSlice'

// Hook for admin categories state
export const useAdminCategoriesState = () => {
  return useSelector((state: RootState) => state.adminCategories)
}

// Hook for admin categories with data fetching
export const useAdminCategories = () => {
  const dispatch = useDispatch()
  const state = useAdminCategoriesState()
  
  // RTK Query hooks
  const {
    data: categoriesResponse,
    isLoading,
    error,
    refetch,
  } = useGetCategoriesQuery({
    ...state.filters,
    active: state.filters.active ?? undefined,  // Convert null to undefined
    parentId: state.filters.parentId ?? undefined,  // Convert null to undefined
  }, {
    refetchOnMountOrArgChange: true,
  })

  // Update local state when data changes
  React.useEffect(() => {
    if (categoriesResponse) {
      dispatch(setCategories(categoriesResponse.data))
      dispatch(setPagination({
        total: categoriesResponse.total,
        page: categoriesResponse.page,
        limit: categoriesResponse.limit,
        totalPages: categoriesResponse.totalPages,
      }))
    }
  }, [categoriesResponse, dispatch])

  // Update loading state
  React.useEffect(() => {
    dispatch(setLoading(isLoading))
  }, [isLoading, dispatch])

  // Update error state
  React.useEffect(() => {
    if (error) {
      let errorMessage = 'An error occurred'
      
      // Handle FetchBaseQueryError
      if ('status' in error) {
        const fetchError = error as FetchBaseQueryError
        errorMessage = (fetchError.data as any)?.message || `Error ${fetchError.status}`
      } 
      // Handle SerializedError
      else if ('message' in error) {
        const serializedError = error as SerializedError
        errorMessage = serializedError.message || 'An error occurred'
      }
      
      dispatch(setError(errorMessage))
    } else {
      dispatch(setError(null))
    }
  }, [error, dispatch])

  return {
    ...state,
    refetch,
  }
}

// Hook for category operations
export const useAdminCategoryOperations = () => {
  const dispatch = useDispatch()
  
  // Mutations
  const [createCategoryMutation] = useCreateCategoryMutation()
  const [updateCategoryMutation] = useUpdateCategoryMutation()
  const [deleteCategoryMutation] = useDeleteCategoryMutation()
  const [updateStatusMutation] = useUpdateCategoryStatusMutation()

  // Create category
  const createCategory = useCallback(async (categoryData: CreateCategoryRequest) => {
    try {
      dispatch(setCreating(true))
      const result = await createCategoryMutation(categoryData).unwrap()
      dispatch(addCategory(result))
      dispatch(setShowCreateModal(false))
      return { success: true, data: result }
    } catch (error: any) {
      dispatch(setError(error.message || 'Failed to create category'))
      return { success: false, error: error.message }
    } finally {
      dispatch(setCreating(false))
    }
  }, [createCategoryMutation, dispatch])

  // Update category
  const updateCategoryById = useCallback(async (id: string, categoryData: UpdateCategoryRequest) => {
    try {
      dispatch(setUpdating(true))
      const result = await updateCategoryMutation({ id, categoryData }).unwrap()
      dispatch(updateCategory(result))
      dispatch(setShowEditModal(false))
      return { success: true, data: result }
    } catch (error: any) {
      dispatch(setError(error.message || 'Failed to update category'))
      return { success: false, error: error.message }
    } finally {
      dispatch(setUpdating(false))
    }
  }, [updateCategoryMutation, dispatch])

  // Delete category
  const deleteCategory = useCallback(async (id: string) => {
    try {
      dispatch(setDeleting(true))
      await deleteCategoryMutation(id).unwrap()
      dispatch(removeCategory(id))
      dispatch(setShowDeleteConfirm(false))
      return { success: true }
    } catch (error: any) {
      dispatch(setError(error.message || 'Failed to delete category'))
      return { success: false, error: error.message }
    } finally {
      dispatch(setDeleting(false))
    }
  }, [deleteCategoryMutation, dispatch])

  // Update category status
  const updateCategoryStatus = useCallback(async (id: string, isActive: boolean) => {
    try {
      const result = await updateStatusMutation({ id, isActive }).unwrap()
      dispatch(updateCategory(result))
      return { success: true, data: result }
    } catch (error: any) {
      dispatch(setError(error.message || 'Failed to update category status'))
      return { success: false, error: error.message }
    }
  }, [updateStatusMutation, dispatch])

  return {
    createCategory,
    updateCategory: updateCategoryById,
    deleteCategory,
    updateCategoryStatus,
  }
}

// Hook for category search
export const useAdminCategorySearch = (searchQuery: string, filters?: CategoryFilterRequest) => {
  const dispatch = useDispatch()
  
  const {
    data: searchResults,
    isLoading,
    error,
  } = useSearchCategoriesQuery(
    { query: searchQuery, filters },
    { skip: !searchQuery.trim() }
  )

  return {
    searchResults: searchResults?.data || [],
    isSearching: isLoading,
    searchError: error,
    pagination: searchResults ? {
      total: searchResults.total,
      page: searchResults.page,
      limit: searchResults.limit,
      totalPages: searchResults.totalPages,
    } : null,
  }
}

// Hook for getting single category
export const useAdminCategory = (id: string) => {
  const dispatch = useDispatch()
  
  const {
    data: category,
    isLoading,
    error,
    refetch,
  } = useGetCategoryByIdQuery(id, { skip: !id })

  React.useEffect(() => {
    if (category) {
      dispatch(setSelectedCategory(category))
    }
  }, [category, dispatch])

  return {
    category,
    isLoading,
    error,
    refetch,
  }
}

// Hook for active categories (for dropdowns)
export const useActiveCategories = () => {
  const {
    data: activeCategories,
    isLoading,
    error,
    refetch,
  } = useGetActiveCategoriesQuery()

  return {
    activeCategories: activeCategories || [],
    isLoading,
    error,
    refetch,
  }
}

// Hook for filters and pagination
export const useAdminCategoryFilters = () => {
  const dispatch = useDispatch()
  const state = useAdminCategoriesState()

  const updateFilters = useCallback((filters: Partial<CategoryFilterRequest>) => {
    dispatch(setFilters(filters))
  }, [dispatch])

  const updateSearch = useCallback((search: string) => {
    dispatch(setSearch(search))
  }, [dispatch])

  const updatePage = useCallback((page: number) => {
    dispatch(setPage(page))
  }, [dispatch])

  const updateLimit = useCallback((limit: number) => {
    dispatch(setLimit(limit))
  }, [dispatch])

  const updateActiveFilter = useCallback((active: boolean | null) => {
    dispatch(setActiveFilter(active))
  }, [dispatch])

  const resetAllFilters = useCallback(() => {
    dispatch(resetFilters())
  }, [dispatch])

  return {
    filters: state.filters,
    pagination: state.pagination,
    updateFilters,
    updateSearch,
    updatePage,
    updateLimit,
    updateActiveFilter,
    resetFilters: resetAllFilters,
  }
}

// Hook for modal management
export const useAdminCategoryModals = () => {
  const dispatch = useDispatch()
  const state = useAdminCategoriesState()

  const openCreateModal = useCallback(() => {
    dispatch(setShowCreateModal(true))
  }, [dispatch])

  const closeCreateModal = useCallback(() => {
    dispatch(setShowCreateModal(false))
  }, [dispatch])

  const openEditModal = useCallback((category: Category) => {
    dispatch(setSelectedCategory(category))
    dispatch(setShowEditModal(true))
  }, [dispatch])

  const closeEditModal = useCallback(() => {
    dispatch(setShowEditModal(false))
  }, [dispatch])

  const openDeleteConfirm = useCallback((category: Category) => {
    dispatch(setSelectedCategory(category))
    dispatch(setShowDeleteConfirm(true))
  }, [dispatch])

  const closeDeleteConfirm = useCallback(() => {
    dispatch(setShowDeleteConfirm(false))
  }, [dispatch])

  return {
    showCreateModal: state.showCreateModal,
    showEditModal: state.showEditModal,
    showDeleteConfirm: state.showDeleteConfirm,
    selectedCategory: state.selectedCategory,
    openCreateModal,
    closeCreateModal,
    openEditModal,
    closeEditModal,
    openDeleteConfirm,
    closeDeleteConfirm,
  }
}

// Hook for error handling
export const useAdminCategoryErrors = () => {
  const dispatch = useDispatch()
  const error = useSelector((state: RootState) => state.adminCategories.error)

  const clearErrorMessage = useCallback(() => {
    dispatch(clearError())
  }, [dispatch])

  return {
    error,
    clearError: clearErrorMessage,
  }
}