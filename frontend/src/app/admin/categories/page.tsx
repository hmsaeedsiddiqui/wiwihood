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
import { adminApi } from '../../../lib/adminApi';

// Mock categories data
const mockCategories = [
  {
    id: 'CAT-001',
    name: 'Hair & Beauty',
    slug: 'hair-beauty',
    description: 'Professional hair styling, cutting, coloring, and beauty treatments',
    isActive: true,
    icon: '💇‍♀️',
    parentCategory: null,
    subcategories: ['Hair Styling', 'Hair Coloring', 'Hair Treatment'],
    totalProviders: 145,
    totalBookings: 2847,
    createdDate: '2024-01-15',
    sortOrder: 1
  },
  {
    id: 'CAT-002',
    name: 'Spa & Wellness',
    slug: 'spa-wellness',
    description: 'Relaxation and wellness services including massages and spa treatments',
    isActive: true,
    icon: '🧘‍♀️',
    parentCategory: null,
    subcategories: ['Deep Tissue Massage', 'Aromatherapy', 'Hot Stone Therapy', 'Facial Treatment'],
    totalProviders: 89,
    totalBookings: 1923,
    createdDate: '2024-01-20',
    sortOrder: 2
  },
  {
    id: 'CAT-003',
    name: 'Fitness & Training',
    slug: 'fitness-training',
    description: 'Personal training, group fitness classes, and specialized workout programs',
    isActive: true,
    icon: '💪',
    parentCategory: null,
    subcategories: ['Personal Training', 'Group Classes', 'Nutrition Coaching', 'Yoga Classes'],
    totalProviders: 67,
    totalBookings: 1456,
    createdDate: '2024-02-01',
    sortOrder: 3
  },
  {
    id: 'CAT-004',
    name: 'Beauty Treatments',
    slug: 'beauty-treatments',
    description: 'Specialized beauty services including facials, skincare, and cosmetic treatments',
    isActive: true,
    icon: '✨',
    parentCategory: null,
    subcategories: ['Facial Treatment', 'Skincare', 'Eyebrow & Lash', 'Makeup Services'],
    totalProviders: 78,
    totalBookings: 1654,
    createdDate: '2024-02-10',
    sortOrder: 4
  },
  {
    id: 'CAT-005',
    name: 'Nail Services',
    slug: 'nail-services',
    description: 'Professional nail care including manicures, pedicures, and nail art',
    isActive: false,
    icon: '💅',
    parentCategory: null,
    subcategories: ['Manicure', 'Pedicure', 'Nail Art', 'Gel Nails'],
    totalProviders: 23,
    totalBookings: 456,
    createdDate: '2024-03-01',
    sortOrder: 5
  }
];

export default function AdminCategories() {
  const [categories, setCategories] = useState(mockCategories);
  const [filteredCategories, setFilteredCategories] = useState(mockCategories);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getCategories();
      setCategories(response.categories || mockCategories);
      setFilteredCategories(response.categories || mockCategories);
    } catch (error) {
      console.error('Failed to load categories:', error);
      // Keep using mock data as fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = categories;

    if (searchQuery) {
      filtered = filtered.filter(category =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.slug.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredCategories(filtered);
  }, [categories, searchQuery]);

  const toggleCategoryStatus = (categoryId: string) => {
    setCategories(prev => prev.map(category => 
      category.id === categoryId 
        ? { ...category, isActive: !category.isActive }
        : category
    ));
  };

  const deleteCategory = (categoryId: string) => {
    if (confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      setCategories(prev => prev.filter(category => category.id !== categoryId));
    }
  };

  const CategoryModal = ({ category, isEdit = false, onClose, onSave }: any) => {
    const [formData, setFormData] = useState(category || {
      name: '',
      slug: '',
      description: '',
      isActive: true,
      icon: '',
      parentCategory: null,
      subcategories: [],
      sortOrder: categories.length + 1
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      if (isEdit) {
        setCategories(prev => prev.map(cat => 
          cat.id === category.id ? { ...cat, ...formData } : cat
        ));
      } else {
        const newCategory = {
          ...formData,
          id: `CAT-${String(categories.length + 1).padStart(3, '0')}`,
          totalProviders: 0,
          totalBookings: 0,
          createdDate: new Date().toISOString().split('T')[0]
        };
        setCategories(prev => [...prev, newCategory]);
      }
      onClose();
    };

    const generateSlug = (name) => {
      return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    };

    return (
      <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                {isEdit ? 'Edit Category' : 'Add New Category'}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setFormData(prev => ({
                      ...prev, 
                      name,
                      slug: generateSlug(name)
                    }));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Hair & Beauty"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL Slug *
                </label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="hair-beauty"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Brief description of this category..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Icon Emoji
                </label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="💇‍♀️"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort Order
                </label>
                <input
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) => setFormData(prev => ({ ...prev, sortOrder: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subcategories (comma-separated)
              </label>
              <input
                type="text"
                value={Array.isArray(formData.subcategories) ? formData.subcategories.join(', ') : ''}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  subcategories: e.target.value.split(', ').filter(s => s.trim()) 
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Hair Styling, Hair Coloring, Hair Treatment"
              />
            </div>

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

            <div className="flex justify-end space-x-3 pt-4 gap-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {isEdit ? 'Update Category' : 'Create Category'}
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
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Name:</span>
                    <div className="flex items-center">
                      <span className="text-2xl mr-2">{category.icon}</span>
                      <span className="font-medium text-gray-900">{category.name}</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">URL Slug:</span>
                    <span className="font-medium text-gray-900">{category.slug}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      category.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {category.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Created:</span>
                    <span className="font-medium text-gray-900">{category.createdDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sort Order:</span>
                    <span className="font-medium text-gray-900">{category.sortOrder}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Description</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700">{category.description || 'No description provided.'}</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Statistics</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Providers:</span>
                    <span className="font-medium text-gray-900">{category.totalProviders}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Bookings:</span>
                    <span className="font-medium text-gray-900">{category.totalBookings}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Avg. Bookings/Provider:</span>
                    <span className="font-medium text-gray-900">
                      {category.totalProviders > 0 ? Math.round(category.totalBookings / category.totalProviders) : 0}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Subcategories</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  {category.subcategories && category.subcategories.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {category.subcategories.map((sub, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                          {sub}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No subcategories defined.</p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Actions</h3>
                <div className="space-y-2">
                  <button 
                    onClick={() => {
                      setEditingCategory(category);
                      onClose();
                    }}
                    className="w-full px-4 py-2 cursor-pointer mb-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Edit Category
                  </button>
                  <button 
                    onClick={() => toggleCategoryStatus(category.id)}
                    className={`w-full px-4 py-2 cursor-pointer mb-4 rounded-lg ${
                      category.isActive 
                        ? 'bg-red-600 text-white hover:bg-red-700' 
                        : 'bg-green-600 text-white hover:bg-green-700'
                }`}>
                    {category.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <button 
                    onClick={() => {
                      deleteCategory(category.id);
                      onClose();
                    }}
                    className="w-full px-4 py-2 cursor-pointer mb-4 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Delete Category
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-[95%] mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4 ">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Category Management</h1>
            <p className="text-gray-600 mt-1">Organize and manage service categories for your platform</p>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <Tag className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Categories</p>
              <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <ToggleRight className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Categories</p>
              <p className="text-2xl font-bold text-gray-900">
                {categories.filter(c => c.isActive).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <Tag className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Providers</p>
              <p className="text-2xl font-bold text-gray-900">
                {categories.reduce((sum, c) => sum + c.totalProviders, 0)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <Tag className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-900">
                {categories.reduce((sum, c) => sum + c.totalBookings, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search categories by name, description, or slug..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((category) => (
          <div key={category.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <span className="text-3xl mr-3">{category.icon}</span>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                  <p className="text-sm text-gray-500">{category.slug}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => toggleCategoryStatus(category.id)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {category.isActive ? (
                    <ToggleRight className="h-5 w-5 cursor-pointer text-green-600" />
                  ) : (
                    <ToggleLeft className="h-5 w-5 cursor-pointer text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {category.description}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{category.totalProviders}</p>
                <p className="text-xs text-gray-500">Providers</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{category.totalBookings}</p>
                <p className="text-xs text-gray-500">Bookings</p>
              </div>
            </div>

            {category.subcategories && category.subcategories.length > 0 && (
              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2">Subcategories:</p>
                <div className="flex flex-wrap gap-1">
                  {category.subcategories.slice(0, 3).map((sub, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      {sub}
                    </span>
                  ))}
                  {category.subcategories.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      +{category.subcategories.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                category.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {category.isActive ? 'Active' : 'Inactive'}
              </span>
              
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setSelectedCategory(category)}
                  className="text-blue-600 cursor-pointer hover:text-blue-700"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => setEditingCategory(category)}
                  className="text-gray-600 cursor-pointer hover:text-gray-700"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => deleteCategory(category.id)}
                  className="text-red-600 cursor-pointer hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      {showAddModal && (
        <CategoryModal 
          onClose={() => setShowAddModal(false)} 
        />
      )}

      {editingCategory && (
        <CategoryModal 
          category={editingCategory}
          isEdit={true}
          onClose={() => setEditingCategory(null)} 
        />
      )}

      {selectedCategory && (
        <CategoryDetailModal 
          category={selectedCategory} 
          onClose={() => setSelectedCategory(null)} 
        />
      )}
    </div>
  );
}