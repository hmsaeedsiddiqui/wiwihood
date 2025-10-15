import { useCallback } from 'react'
import { toast } from 'react-hot-toast'
import { useGetCategoriesQuery, useGetFeaturedCategoriesQuery } from '../store/api/providersApi'
import type { Category } from '../store/api/providersApi'

// Custom hook for fetching all active categories
export const useCategories = (isActive: boolean = true) => {
  const { 
    data: categories = [], 
    isLoading, 
    error, 
    refetch 
  } = useGetCategoriesQuery({ isActive })

  return {
    categories,
    isLoading,
    error,
    refetch
  }
}

// Custom hook for fetching featured categories
export const useFeaturedCategories = () => {
  const { 
    data: featuredCategories = [], 
    isLoading, 
    error, 
    refetch 
  } = useGetFeaturedCategoriesQuery()

  return {
    featuredCategories,
    isLoading,
    error,
    refetch
  }
}

// Custom hook for category operations with error handling
export const useCategoryOperations = () => {
  const { categories, isLoading: categoriesLoading, error: categoriesError, refetch } = useCategories()
  const { featuredCategories, isLoading: featuredLoading, error: featuredError } = useFeaturedCategories()

  const getCategoryById = useCallback((id: string): Category | undefined => {
    return categories.find(category => category.id === id)
  }, [categories])

  const getCategoryBySlug = useCallback((slug: string): Category | undefined => {
    return categories.find(category => category.slug === slug)
  }, [categories])

  const getActiveCategoriesCount = useCallback((): number => {
    return categories.filter(category => category.isActive).length
  }, [categories])

  return {
    categories,
    featuredCategories,
    isLoading: categoriesLoading || featuredLoading,
    error: categoriesError || featuredError,
    refetch,
    getCategoryById,
    getCategoryBySlug,
    getActiveCategoriesCount,
  }
}

// Helper function to show error toast
export const useCategoryErrorHandler = () => {
  const showError = useCallback((error: any) => {
    let errorMessage = 'Failed to load categories'
    
    if (error?.data?.message) {
      errorMessage = Array.isArray(error.data.message) 
        ? error.data.message.join(', ') 
        : error.data.message
    } else if (error?.message) {
      errorMessage = error.message
    }

    toast.error(errorMessage)
  }, [])

  return { showError }
}