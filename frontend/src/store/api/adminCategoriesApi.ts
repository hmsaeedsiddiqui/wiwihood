import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Base URL for API - adjust according to your backend URL
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

// Category types based on your backend DTOs
export interface CreateCategoryRequest {
  name: string
  description?: string
  slug?: string
  icon?: string
  image?: string
  bannerImage?: string
  color?: string
  isActive?: boolean
  isFeatured?: boolean
  parentId?: string
  sortOrder?: number
  metaTitle?: string
  metaDescription?: string
  metaKeywords?: string
}

export interface UpdateCategoryRequest extends Partial<CreateCategoryRequest> {}

export interface CategoryFilterRequest {
  page?: number
  limit?: number
  search?: string
  active?: boolean
  parentId?: string
}

export interface Category {
  id: string
  name: string
  description?: string
  slug: string
  icon?: string
  image?: string
  bannerImage?: string  // Backend uses bannerImage instead of image
  color?: string
  isActive: boolean
  isFeatured?: boolean  // Backend has this field
  parentId?: string
  sortOrder: number
  metaTitle?: string
  metaDescription?: string
  metaKeywords?: string  // Backend has this field
  createdAt: string
  updatedAt: string
  // Relations
  parent?: Category
  children?: Category[]
  services?: any[]
  // Virtual properties
  servicesCount?: number
}

export interface CategoryResponse {
  data: Category[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ApiError {
  message: string
  statusCode: number
  error?: string
}

// Create RTK Query API slice for admin categories
export const adminCategoriesApi = createApi({
  reducerPath: 'adminCategoriesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/admin/categories`,
    prepareHeaders: (headers, { getState }) => {
      // Get token from localStorage - check admin token first for admin endpoints
      let token = null
      if (typeof window !== 'undefined') {
        token = localStorage.getItem('adminToken') ||        // Check admin token FIRST
                localStorage.getItem('accessToken') || 
                localStorage.getItem('providerToken') ||
                localStorage.getItem('auth-token')
      }
      
      if (token) {
        // Clean the token (remove any whitespace)
        token = token.trim()
        headers.set('authorization', `Bearer ${token}`)
      }
      
      headers.set('content-type', 'application/json')
      return headers
    },
  }),
  tagTypes: ['Category', 'Categories'],
  endpoints: (builder) => ({
    // Get all categories with filters and pagination
    getCategories: builder.query<CategoryResponse, CategoryFilterRequest>({
      query: (filters = {}) => {
        const params = new URLSearchParams()
        
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            params.append(key, value.toString())
          }
        })
        
        return {
          url: `?${params.toString()}`,
          method: 'GET',
        }
      },
      providesTags: ['Categories'],
      transformResponse: (response: any) => {
        // Transform backend response to expected format
        return {
          data: response.categories || [],
          total: response.total || 0,
          page: response.page || 1,
          limit: response.limit || 10,
          totalPages: response.totalPages || 1,
        }
      },
      transformErrorResponse: (response: any) => ({
        message: response?.data?.message || 'Failed to fetch categories',
        statusCode: typeof response.status === 'number' ? response.status : 500,
        error: response?.data?.error
      } as ApiError)
    }),

    // Get category by ID
    getCategoryById: builder.query<Category, string>({
      query: (id) => ({
        url: `/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Category', id }],
      transformErrorResponse: (response: any) => ({
        message: response?.data?.message || 'Failed to fetch category',
        statusCode: typeof response.status === 'number' ? response.status : 500,
        error: response?.data?.error
      } as ApiError)
    }),

    // Create new category
    createCategory: builder.mutation<Category, CreateCategoryRequest>({
      query: (categoryData) => ({
        url: '',
        method: 'POST',
        body: categoryData,
      }),
      invalidatesTags: ['Categories'],
      transformErrorResponse: (response: any) => ({
        message: response?.data?.message || 'Failed to create category',
        statusCode: typeof response.status === 'number' ? response.status : 500,
        error: response?.data?.error
      } as ApiError)
    }),

    // Update category
    updateCategory: builder.mutation<Category, { id: string; categoryData: UpdateCategoryRequest }>({
      query: ({ id, categoryData }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: categoryData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Category', id },
        'Categories'
      ],
      transformErrorResponse: (response: any) => ({
        message: response?.data?.message || 'Failed to update category',
        statusCode: typeof response.status === 'number' ? response.status : 500,
        error: response?.data?.error
      } as ApiError)
    }),

    // Delete category
    deleteCategory: builder.mutation<void, string>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Category', id },
        'Categories'
      ],
      transformErrorResponse: (response: any) => ({
        message: response?.data?.message || 'Failed to delete category',
        statusCode: typeof response.status === 'number' ? response.status : 500,
        error: response?.data?.error
      } as ApiError)
    }),

    // Update category status (activate/deactivate)
    updateCategoryStatus: builder.mutation<Category, { id: string; isActive: boolean }>({
      query: ({ id, isActive }) => ({
        url: `/${id}/status`,
        method: 'PATCH',
        body: { isActive },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Category', id },
        'Categories'
      ],
      transformErrorResponse: (response: any) => ({
        message: response?.data?.message || 'Failed to update category status',
        statusCode: typeof response.status === 'number' ? response.status : 500,
        error: response?.data?.error
      } as ApiError)
    }),

    // Search categories
    searchCategories: builder.query<CategoryResponse, { query: string; filters?: CategoryFilterRequest }>({
      query: ({ query, filters = {} }) => {
        const params = new URLSearchParams({ search: query })
        
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            params.append(key, value.toString())
          }
        })
        
        return {
          url: `?${params.toString()}`,
          method: 'GET',
        }
      },
      providesTags: ['Categories'],
      transformResponse: (response: any) => {
        // Transform backend response to expected format
        return {
          data: response.categories || [],
          total: response.total || 0,
          page: response.page || 1,
          limit: response.limit || 10,
          totalPages: response.totalPages || 1,
        }
      },
      transformErrorResponse: (response: any) => ({
        message: response?.data?.message || 'Search failed',
        statusCode: typeof response.status === 'number' ? response.status : 500,
        error: response?.data?.error
      } as ApiError)
    }),

    // Get active categories (for dropdown/select components)
    getActiveCategories: builder.query<Category[], void>({
      query: () => ({
        url: '?active=true&limit=1000',
        method: 'GET',
      }),
      providesTags: ['Categories'],
      transformResponse: (response: any) => response.categories || [],
      transformErrorResponse: (response: any) => ({
        message: response?.data?.message || 'Failed to fetch active categories',
        statusCode: typeof response.status === 'number' ? response.status : 500,
        error: response?.data?.error
      } as ApiError)
    }),
  }),
})

// Export hooks for usage in functional components
export const {
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useUpdateCategoryStatusMutation,
  useSearchCategoriesQuery,
  useGetActiveCategoriesQuery,
} = adminCategoriesApi

export default adminCategoriesApi