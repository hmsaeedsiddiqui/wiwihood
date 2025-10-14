'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Tag,
  Image,
  ToggleLeft,
  ToggleRight,
  Save,
  X
} from 'lucide-react';
import {
  useAdminCategories,
  useAdminCategoryOperations,
  useAdminCategoryFilters,
  useAdminCategoryModals,
  useAdminCategoryErrors,
  useActiveCategories,
} from '../../store/hooks/useAdminCategories';
import type {
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from '../../store/api/adminCategoriesApi';

export const AdminCategoriesManager: React.FC = () => {
  // Check authentication tokens
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasToken = localStorage.getItem('accessToken') || 
                      localStorage.getItem('providerToken') || 
                      localStorage.getItem('adminToken') || 
                      localStorage.getItem('auth-token')
      
      if (!hasToken) {
        setShowLoginModal(true)
      } else {
        setShowLoginModal(false)
      }
    }
  }, [])

  // Use the admin categories hooks
  const {
    categories,
    loading,
    pagination,
    isCreating,
    isUpdating,
    isDeleting,
  } = useAdminCategories()

  const {
    createCategory,
    updateCategory,
    deleteCategory,
    updateCategoryStatus,
  } = useAdminCategoryOperations()

  const {
    filters,
    updateSearch,
    updatePage,
    updateLimit,
    resetFilters,
  } = useAdminCategoryFilters()

  const {
    showCreateModal,
    showEditModal,
    selectedCategory,
    openCreateModal,
    closeCreateModal,
    openEditModal,
    closeEditModal,
  } = useAdminCategoryModals()

  const { error, clearError } = useAdminCategoryErrors()
  const { activeCategories: activeCategoriesList } = useActiveCategories()

  // Local state for UI
  const [searchQuery, setSearchQuery] = useState(filters.search)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [detailCategory, setDetailCategory] = useState<Category | null>(null)
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([])
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [loginCredentials, setLoginCredentials] = useState({ email: '', password: '' })
  const [loginLoading, setLoginLoading] = useState(false)

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      updateSearch(searchQuery)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchQuery, updateSearch])

  // Handle local filtering when backend is not available
  useEffect(() => {
    if (categories && Array.isArray(categories)) {
      let filtered = categories
      
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        filtered = categories.filter(category => 
          category.name.toLowerCase().includes(query) ||
          category.description?.toLowerCase().includes(query) ||
          category.slug.toLowerCase().includes(query)
        )
      }
      
      setFilteredCategories(filtered)
    }
  }, [categories, searchQuery])

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginLoading(true)
    
    try {
      // Admin login logic
      const response = await fetch('/api/auth/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginCredentials)
      })
      
      if (response.ok) {
        const data = await response.json()
        localStorage.setItem('adminToken', data.token)
        setShowLoginModal(false)
        // Refresh page or update state
        window.location.reload()
      } else {
        alert('Login failed')
      }
    } catch (error) {
      console.error('Login error:', error)
      alert('Login failed')
    } finally {
      setLoginLoading(false)
    }
  }

  const handleViewCategory = (category: Category) => {
    setDetailCategory(category)
    setShowDetailModal(true)
  }

  const handleEditCategory = (category: Category) => {
    openEditModal(category)
  }

  const handleDeleteCategory = async (categoryId: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      const result = await deleteCategory(categoryId)
      if (!result.success) {
        alert(`Failed to delete category: ${result.error}`)
      }
    }
  }

  const handleToggleStatus = async (category: Category) => {
    const result = await updateCategoryStatus(category.id, !category.isActive)
    if (!result.success) {
      alert(`Failed to update category status: ${result.error}`)
    }
  }

  const handlePreviousPage = () => {
    if (pagination.page > 1) {
      updatePage(pagination.page - 1)
    }
  }

  const handleNextPage = () => {
    if (pagination.page < pagination.totalPages) {
      updatePage(pagination.page + 1)
    }
  }

  const handleLimitChange = (newLimit: number) => {
    updateLimit(newLimit)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Category Modal Component
  const CategoryModal = ({ category, isEdit = false, onClose }: any) => {
    const [formData, setFormData] = useState<Partial<CreateCategoryRequest | UpdateCategoryRequest>>({
      name: category?.name || '',
      description: category?.description || '',
      slug: category?.slug || '',
      isActive: category?.isActive !== undefined ? category.isActive : true,
      isFeatured: category?.isFeatured !== undefined ? category.isFeatured : false,
      sortOrder: category?.sortOrder || 0,
      metaTitle: category?.metaTitle || '',
      metaDescription: category?.metaDescription || '',
      image: category?.image || '',
      color: category?.color || '#000000',
    })

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      
      if (isEdit && category) {
        const result = await updateCategory(category.id, formData as UpdateCategoryRequest)
        if (result.success) {
          onClose()
        } else {
          alert(`Failed to update category: ${result.error}`)
        }
      } else {
        const result = await createCategory(formData as CreateCategoryRequest)
        if (result.success) {
          onClose()
        } else {
          alert(`Failed to create category: ${result.error}`)
        }
      }
    }

    const generateSlug = (name: string) => {
      return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    }

    return (
      <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                {isEdit ? 'Edit Category' : 'Create Category'}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => {
                    const name = e.target.value
                    setFormData(prev => ({ 
                      ...prev, 
                      name,
                      slug: generateSlug(name)
                    }))
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter category name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slug *
                </label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="category-slug"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Category description"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort Order
                </label>
                <input
                  type="number"
                  value={formData.sortOrder || 0}
                  onChange={(e) => setFormData(prev => ({ ...prev, sortOrder: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color
                </label>
                <input
                  type="color"
                  value={formData.color || '#000000'}
                  onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meta Title
              </label>
              <input
                type="text"
                value={formData.metaTitle || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, metaTitle: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="SEO title for this category"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meta Description
              </label>
              <textarea
                value={formData.metaDescription || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, metaDescription: e.target.value }))}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="SEO description for this category"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image URL
              </label>
              <input
                type="url"
                value={formData.image || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                  Active (visible to users)
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isFeatured" className="ml-2 block text-sm text-gray-900">
                  Featured
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 gap-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                disabled={isCreating || isUpdating}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isCreating || isUpdating}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {(isCreating || isUpdating) ? 'Saving...' : (isEdit ? 'Update Category' : 'Create Category')}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const CategoryDetailModal = ({ category, onClose }: any) => (
    <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Category Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Basic Information</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-xs text-gray-500">Name:</span>
                  <p className="text-sm font-medium">{category.name}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500">Slug:</span>
                  <p className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{category.slug}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500">Description:</span>
                  <p className="text-sm">{category.description || 'No description'}</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Status & Settings</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    category.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {category.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">Featured:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    category.isFeatured 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {category.isFeatured ? 'Yes' : 'No'}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-gray-500">Sort Order:</span>
                  <p className="text-sm">{category.sortOrder}</p>
                </div>
                {category.color && (
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">Color:</span>
                    <div 
                      className="w-6 h-6 rounded border border-gray-300"
                      style={{ backgroundColor: category.color }}
                    ></div>
                    <span className="text-sm font-mono">{category.color}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {(category.metaTitle || category.metaDescription) && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">SEO Information</h3>
              <div className="space-y-3">
                {category.metaTitle && (
                  <div>
                    <span className="text-xs text-gray-500">Meta Title:</span>
                    <p className="text-sm">{category.metaTitle}</p>
                  </div>
                )}
                {category.metaDescription && (
                  <div>
                    <span className="text-xs text-gray-500">Meta Description:</span>
                    <p className="text-sm">{category.metaDescription}</p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {category.image && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Image</h3>
              <img 
                src={category.image} 
                alt={category.name}
                className="w-full max-w-md h-48 object-cover rounded-lg border border-gray-300"
              />
            </div>
          )}
          
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Timestamps</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-xs text-gray-500">Created:</span>
                <p>{formatDate(category.createdAt)}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500">Updated:</span>
                <p>{formatDate(category.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-6 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  // Login Modal Component
  const LoginModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Admin Login Required</h2>
          <p className="text-sm text-gray-600 mt-1">Please login to access the admin panel</p>
        </div>
        
        <form onSubmit={handleAdminLogin} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              required
              value={loginCredentials.email}
              onChange={(e) => setLoginCredentials(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="admin@example.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              required
              value={loginCredentials.password}
              onChange={(e) => setLoginCredentials(prev => ({ ...prev, password: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="••••••••"
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="submit"
              disabled={loginLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loginLoading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // Show login modal if not authenticated
  if (showLoginModal) {
    return <LoginModal />
  }

  const displayCategories = filteredCategories.length > 0 ? filteredCategories : categories || []

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Categories Management</h1>
              <p className="mt-2 text-gray-600">Manage your service categories</p>
            </div>
            <div className="mt-4 sm:mt-0">
              <button
                onClick={openCreateModal}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={20} className="mr-2" />
                Create Category
              </button>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <select
                value={pagination.limit}
                onChange={(e) => handleLimitChange(parseInt(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={10}>10 per page</option>
                <option value={25}>25 per page</option>
                <option value={50}>50 per page</option>
                <option value={100}>100 per page</option>
              </select>
              
              <button
                onClick={resetFilters}
                className="px-3 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <p className="text-red-800">{error}</p>
              <button
                onClick={clearError}
                className="text-red-600 hover:text-red-800"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        )}

        {/* Categories Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading categories...</p>
            </div>
          ) : displayCategories.length === 0 ? (
            <div className="p-8 text-center">
              <Tag size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
              <p className="text-gray-600 mb-4">
                {searchQuery ? 'No categories match your search criteria.' : 'Get started by creating your first category.'}
              </p>
              <button
                onClick={openCreateModal}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={20} className="mr-2" />
                Create Category
              </button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {displayCategories.map((category) => (
                      <tr key={category.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            {category.image && (
                              <img
                                src={category.image}
                                alt={category.name}
                                className="w-12 h-12 rounded-lg object-cover mr-4"
                              />
                            )}
                            <div>
                              <div className="flex items-center">
                                {category.color && (
                                  <div 
                                    className="w-4 h-4 rounded-full mr-2 border border-gray-300"
                                    style={{ backgroundColor: category.color }}
                                  ></div>
                                )}
                                <p className="text-sm font-medium text-gray-900">{category.name}</p>
                                {category.isFeatured && (
                                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                    Featured
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-500 font-mono">{category.slug}</p>
                              {category.description && (
                                <p className="text-sm text-gray-600 mt-1 max-w-xs truncate">{category.description}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleToggleStatus(category)}
                            className="flex items-center space-x-2 group"
                          >
                            {category.isActive ? (
                              <ToggleRight size={20} className="text-green-500 group-hover:text-green-600" />
                            ) : (
                              <ToggleLeft size={20} className="text-gray-400 group-hover:text-gray-500" />
                            )}
                            <span className={`text-sm font-medium ${
                              category.isActive ? 'text-green-600' : 'text-gray-400'
                            }`}>
                              {category.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            <div>Sort: {category.sortOrder}</div>
                            {category.metaTitle && (
                              <div className="text-gray-500">SEO: ✓</div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {formatDate(category.createdAt)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleViewCategory(category)}
                              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => handleEditCategory(category)}
                              className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Edit Category"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(category.id)}
                              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete Category"
                              disabled={isDeleting}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing page {pagination.page} of {pagination.totalPages} 
                    ({pagination.total} total categories)
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handlePreviousPage}
                      disabled={pagination.page <= 1}
                      className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <span className="px-3 py-2 text-sm bg-blue-50 text-blue-600 border border-blue-200 rounded-lg">
                      {pagination.page}
                    </span>
                    <button
                      onClick={handleNextPage}
                      disabled={pagination.page >= pagination.totalPages}
                      className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CategoryModal 
          onClose={closeCreateModal} 
        />
      )}

      {showEditModal && selectedCategory && (
        <CategoryModal 
          category={selectedCategory}
          isEdit={true}
          onClose={closeEditModal} 
        />
      )}

      {showDetailModal && detailCategory && (
        <CategoryDetailModal 
          category={detailCategory} 
          onClose={() => {
            setShowDetailModal(false)
            setDetailCategory(null)
          }} 
        />
      )}
    </div>
  );
};

export default AdminCategoriesManager;