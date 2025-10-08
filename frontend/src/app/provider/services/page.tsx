"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { ImageUpload } from "@/components/cloudinary/ImageUpload";
import { CloudinaryImage } from "@/components/cloudinary/CloudinaryImage";
import QRTIntegration from "@/utils/qrtIntegration";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Service {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  categoryId: string;
  category?: Category;
  serviceType: string;
  pricingType: string;
  basePrice: number;
  durationMinutes: number;
  isActive: boolean;
  status: string;
  images?: string[];
  createdAt: string;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [error, setError] = useState("");
  const [providerId, setProviderId] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    shortDescription: "",
    categoryId: "",
    serviceType: "appointment",
    pricingType: "fixed",
    basePrice: "",
    durationMinutes: "",
    isActive: true,
    images: [] as string[]
  });

  useEffect(() => {
    fetchProviderInfo();
    fetchCategories();
    // fetchServices will run after providerId is set in the next useEffect
  }, []);

  const fetchProviderInfo = async () => {
    try {
      // Use QRT Integration for reliable auth profile
      const userData = await QRTIntegration.getAuthProfile();
      
      if (userData && userData.id) {
        console.log('✅ Services: Provider info loaded via QRT:', userData.firstName, userData.lastName);
        setProviderId(userData.id);
      } else {
        console.warn('⚠️ Services: No provider data from QRT, using fallback');
        setProviderId('mock-provider-123');
      }
    } catch (error) {
      console.error('❌ Services: Error fetching provider info:', error);
      // Fallback to mock provider ID if API fails
      console.log('🔄 Services: Using fallback provider ID');
      setProviderId('mock-provider-123');
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"}/categories`
      );
      setCategories(response.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Set fallback categories if API fails
      setCategories([
        { id: 'hair-services', name: 'Hair Services', slug: 'hair-services' },
        { id: 'beauty-services', name: 'Beauty Services', slug: 'beauty-services' },
        { id: 'wellness', name: 'Wellness', slug: 'wellness' }
      ]);
    }
  };

  const fetchServices = async () => {
    if (!providerId) return;
    
    setLoading(true);
    setError(''); // Clear any previous errors
    try {
      console.log('🚀 QRT: Loading services...');
      
      // Use QRT Integration for better error handling
      const servicesData = await QRTIntegration.getServices();
      setServices(servicesData || []);
      
      console.log('✅ QRT: Services loaded successfully', servicesData.length);
    } catch (error) {
      console.error('Error fetching services:', error);
      setError('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (providerId) {
      fetchServices();
    }
  }, [providerId]); // Re-run fetchServices when providerId is available/changes

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!providerId) {
      setError("Provider information not found");
      return;
    }

    try {
      const token = localStorage.getItem('providerToken');
      const submitData = {
        ...formData,
        basePrice: parseFloat(formData.basePrice),
        // Ensure duration is a safe integer (1 to 1440 minutes, e.g.)
        durationMinutes: Math.max(1, Math.min(1440, parseInt(formData.durationMinutes)))
      };
      
      if (editingService) {
        // Update existing service using QRT Integration
        console.log('🔄 Services: Updating service via QRT...');
        try {
          await QRTIntegration.updateService(editingService.id, submitData);
          console.log('✅ Services: Service updated successfully');
        } catch (qrtError) {
          console.warn('⚠️ Services: QRT update failed, trying direct API...');
          // Fallback to direct API call
          const token = localStorage.getItem('providerToken');
          await axios.patch(
            `${process.env.NEXT_PUBLIC_API_URL}/services/${editingService.id}`,
            submitData,
            {
              headers: { Authorization: `Bearer ${token}` },
              withCredentials: true,
            }
          );
        }
      } else {
        // Create new service using QRT Integration
        console.log('🆕 Services: Creating new service via QRT...');
        try {
          await QRTIntegration.createService(submitData);
          console.log('✅ Services: Service created successfully');
        } catch (qrtError) {
          console.warn('⚠️ Services: QRT create failed, trying direct API...');
          // Fallback to direct API call
          const token = localStorage.getItem('providerToken');
          await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/services/provider/${providerId}`,
            submitData,
            {
              headers: { Authorization: `Bearer ${token}` },
              withCredentials: true,
            }
          );
        }
      }

      // Reset form and refresh list
      resetForm();
      await fetchServices();
    } catch (error: any) {
      console.error('Error saving service:', error);
      setError(error.response?.data?.message || 'Failed to save service');
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description,
      shortDescription: service.shortDescription,
      categoryId: service.categoryId,
      serviceType: service.serviceType,
      pricingType: service.pricingType,
      basePrice: service.basePrice.toString(),
      durationMinutes: service.durationMinutes?.toString() || "",
      isActive: service.isActive,
      images: service.images || []
    });
    setShowCreateForm(true);
    // Scroll to the form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (serviceId: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    try {
      console.log('🗑️ Services: Deleting service via QRT...');
      try {
        await QRTIntegration.deleteService(serviceId);
        console.log('✅ Services: Service deleted successfully');
      } catch (qrtError) {
        console.warn('⚠️ Services: QRT delete failed, trying direct API...');
        // Fallback to direct API call
        const token = localStorage.getItem('providerToken');
        await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL}/services/${serviceId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
      }
      await fetchServices();
    } catch (error: any) {
      console.error('❌ Services: Error deleting service:', error);
      setError(error.response?.data?.message || 'Failed to delete service');
    }
  };

  const toggleServiceStatus = async (serviceId: string) => {
    try {
      console.log('🔄 Services: Toggling service status via QRT...');
      try {
        await QRTIntegration.toggleServiceStatus(serviceId);
        console.log('✅ Services: Service status toggled successfully');
      } catch (qrtError) {
        console.warn('⚠️ Services: QRT toggle failed, trying direct API...');
        // Fallback to direct API call
        const token = localStorage.getItem('providerToken');
        await axios.patch(
          `${process.env.NEXT_PUBLIC_API_URL}/services/${serviceId}/toggle-active`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
      }
      await fetchServices();
    } catch (error: any) {
      console.error('❌ Services: Error toggling service status:', error);
      setError(error.response?.data?.message || 'Failed to update service status');
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      shortDescription: "",
      categoryId: "",
      serviceType: "appointment",
      pricingType: "fixed",
      basePrice: "",
      durationMinutes: "",
      isActive: true,
      images: []
    });
    setShowCreateForm(false);
    setEditingService(null);
    setError("");
  };

  // Enhanced helper for input styles with wiwihood theme
  const inputClasses = "w-full p-4 border-2 border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 hover:border-gray-300 bg-white/70 backdrop-blur-sm";
  const labelClasses = "block text-sm font-bold text-gray-800 mb-2 flex items-center gap-2";
  const buttonBaseClasses = "px-6 py-3 text-sm font-semibold rounded-xl transition-all duration-300 transform hover:scale-105";

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent mx-auto mb-4"></div>
            <div className="text-lg text-gray-600 font-medium">Loading your services...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50">
      <div className="max-w-6xl mx-auto p-6 md:p-8">
        {/* Enhanced Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white text-xl font-bold">🛠️</span>
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Service Management
              </h1>
              <p className="text-gray-600 mt-2 text-lg">
                Create and manage your professional services
              </p>
            </div>
          </div>
          
          <button
            onClick={() => {
              resetForm();
              setShowCreateForm(true);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="group relative px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-3"
          >
            <span className="text-xl group-hover:rotate-90 transition-transform duration-300">+</span>
            <span>Create New Service</span>
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-pink-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>

        {/* Enhanced Error Alert */}
        {error && (
          <div className="bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500 p-6 rounded-xl mb-8 shadow-lg" role="alert">
            <div className="flex items-center">
              <span className="text-red-500 text-xl mr-3">⚠️</span>
              <div>
                <h4 className="text-red-800 font-semibold">Error</h4>
                <p className="text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Create/Edit Form */}
        {showCreateForm && (
          <div className="bg-white/80 backdrop-blur-sm p-8 md:p-10 rounded-2xl shadow-2xl mb-10 border border-white/20 relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-200/30 to-pink-200/30 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-pink-200/30 to-orange-200/30 rounded-full translate-y-12 -translate-x-12"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-pink-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-lg">{editingService ? '✏️' : '➕'}</span>
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  {editingService ? 'Edit Service' : 'Create New Service'}
                </h2>
              </div>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Service Name */}
              <div className="lg:col-span-2">
                <label className={labelClasses}>
                  <span className="text-lg">🏷️</span>
                  Service Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className={inputClasses}
                  placeholder="Enter a compelling service name"
                />
              </div>

              {/* Category */}
              <div>
                <label className={labelClasses}>
                  <span className="text-lg">📂</span>
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.categoryId}
                  onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                  className={`${inputClasses} bg-white/70`}
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Service Type */}
              <div>
                <label className={labelClasses}>
                  <span className="text-lg">⚙️</span>
                  Service Type <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.serviceType}
                  onChange={(e) => setFormData({...formData, serviceType: e.target.value})}
                  className={`${inputClasses} bg-white/70`}
                >
                  <option value="appointment">📅 Appointment</option>
                  <option value="package">📦 Package</option>
                  <option value="consultation">💬 Consultation</option>
                </select>
              </div>

              {/* Pricing Type */}
              <div>
                <label className={labelClasses}>
                  <span className="text-lg">💰</span>
                  Pricing Type <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.pricingType}
                  onChange={(e) => setFormData({...formData, pricingType: e.target.value})}
                  className={`${inputClasses} bg-white/70`}
                >
                  <option value="fixed">💵 Fixed Price</option>
                  <option value="hourly">⏰ Hourly Rate</option>
                  <option value="package">📋 Package Deal</option>
                </select>
              </div>

              {/* Base Price */}
              <div>
                <label className={labelClasses}>
                  <span className="text-lg">💲</span>
                  Base Price ($) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.basePrice}
                  onChange={(e) => setFormData({...formData, basePrice: e.target.value})}
                  className={inputClasses}
                  placeholder="0.00"
                />
              </div>

              {/* Duration */}
              <div>
                <label className={labelClasses}>
                  <span className="text-lg">⏱️</span>
                  Duration (minutes) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max="1440"
                  step="1"
                  value={formData.durationMinutes}
                  onChange={(e) => setFormData({...formData, durationMinutes: e.target.value})}
                  className={inputClasses}
                  placeholder="60"
                />
              </div>

              {/* Active Status */}
              <div className="flex items-center pt-4">
                <label className="flex items-center text-sm font-bold text-gray-800 gap-3 cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                      className="sr-only"
                    />
                    <div className={`w-12 h-6 rounded-full transition-colors duration-300 ${formData.isActive ? 'bg-orange-500' : 'bg-gray-300'}`}>
                      <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 mt-0.5 ${formData.isActive ? 'translate-x-6 ml-1' : 'translate-x-0 ml-0.5'}`}></div>
                    </div>
                  </div>
                  <span className="flex items-center gap-2">
                    <span className="text-lg">{formData.isActive ? '✅' : '❌'}</span>
                    Active Service
                  </span>
                </label>
              </div>
            </div>

            {/* Short Description */}
            <div>
              <label className={labelClasses}>
                <span className="text-lg">📝</span>
                Short Description <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.shortDescription}
                onChange={(e) => setFormData({...formData, shortDescription: e.target.value})}
                className={inputClasses}
                placeholder="Brief description for listings (max 100 chars)"
                maxLength={100}
              />
              <div className="text-xs text-gray-500 mt-1">{formData.shortDescription.length}/100 characters</div>
            </div>

            {/* Full Description */}
            <div>
              <label className={labelClasses}>
                <span className="text-lg">📄</span>
                Full Description <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={5}
                className={`${inputClasses} resize-y`}
                placeholder="Detailed description of your service..."
              />
            </div>

            {/* Service Images */}
            <div>
              <label className={labelClasses}>
                <span className="text-lg">🖼️</span>
                Service Images (Max 5)
              </label>
              <div className="mb-4">
                <ImageUpload
                  uploadType="service"
                  onImageUploaded={(publicId: string) => {
                    setFormData(prev => ({
                      ...prev,
                      images: [...prev.images, publicId]
                    }));
                  }}
                  maxFiles={5 - formData.images.length}
                />
              </div>
              
              {/* Display current images */}
              {formData.images.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 mt-4">
                  {formData.images.map((publicId, index) => (
                    <div key={index} className="relative w-full aspect-square group">
                      <CloudinaryImage
                        src={publicId}
                        alt={`Service image ${index + 1}`}
                        width={120}
                        height={120}
                        className="rounded-xl object-cover w-full h-full shadow-lg group-hover:shadow-xl transition-all duration-300"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            images: prev.images.filter((_, i) => i !== index)
                          }));
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold hover:bg-red-600 transform hover:scale-110 transition-all duration-300 shadow-lg"
                        title="Remove image"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Enhanced Action Buttons */}
            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3"
              >
                <span className="text-lg">{editingService ? '💾' : '✨'}</span>
                {editingService ? 'Update Service' : 'Create Service'}
              </button>
              
              <button
                type="button"
                onClick={resetForm}
                className="px-8 py-4 text-gray-700 border-2 border-gray-300 hover:border-gray-400 rounded-xl font-semibold hover:bg-gray-50 transform hover:scale-105 transition-all duration-300 flex items-center gap-3"
              >
                <span className="text-lg">❌</span>
                Cancel
              </button>
            </div>
          </form>
          </div>
        </div>
        )}

        {/* Enhanced Services List */}
        <div className="space-y-12">
          {services.length > 0 ? (
            services.map((service) => (
              <div
                key={service.id}
                className="group bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20 hover:shadow-2xl transform transition-all duration-500 relative overflow-hidden mt-2 hover:-translate-y-1"
              >
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-200/20 to-blue-200/20 rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-500"></div>
                
                <div className="relative z-10">
                  <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-4 mb-4 flex-wrap">
                        <h3 className="text-2xl font-bold text-gray-900 break-words">
                          {service.name}
                        </h3>
                        <span className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-full shadow-lg ${
                          service.isActive 
                            ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-800' 
                            : 'bg-gradient-to-r from-red-100 to-red-200 text-red-800'
                        }`}>
                          <span className="text-base">{service.isActive ? '✅' : '❌'}</span>
                          {service.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-4 text-base leading-relaxed bg-gray-50 p-4 rounded-xl">
                        {service.shortDescription}
                      </p>
                      
                      {service.description && (
                        <p className="text-gray-700 mb-6 text-sm leading-relaxed">
                          {service.description}
                        </p>
                      )}
                      
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
                        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg">📂</span>
                            <strong className="text-gray-800">Category</strong>
                          </div>
                          <p className="text-gray-600 font-medium">{service.category?.name || 'N/A'}</p>
                        </div>
                        
                        <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-4 rounded-xl">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg">💰</span>
                            <strong className="text-gray-800">Price</strong>
                          </div>
                          <p className="text-gray-600 font-medium">${service.basePrice}</p>
                          <p className="text-xs text-gray-500 capitalize">({service.pricingType})</p>
                        </div>
                        
                        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg">⏱️</span>
                            <strong className="text-gray-800">Duration</strong>
                          </div>
                          <p className="text-gray-600 font-medium">{service.durationMinutes} min</p>
                        </div>
                        
                        <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-4 rounded-xl">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg">⚙️</span>
                            <strong className="text-gray-800">Type</strong>
                          </div>
                          <p className="text-gray-600 font-medium capitalize">{service.serviceType}</p>
                        </div>
                      </div>
                      
                      {/* Enhanced Service Images Display */}
                      {service.images && service.images.length > 0 && (
                        <div className="mt-6">
                          <div className="flex items-center gap-2 mb-4">
                            <span className="text-lg">🖼️</span>
                            <strong className="text-gray-800 font-bold">Service Images</strong>
                          </div>
                          <div className="flex flex-wrap gap-3">
                            {service.images.map((publicId, index) => (
                              <div key={index} className="w-24 h-24 flex-shrink-0 group/image">
                                <CloudinaryImage
                                  src={publicId}
                                  alt={`${service.name} image ${index + 1}`}
                                  width={96}
                                  height={96}
                                  className="rounded-xl object-cover w-full h-full shadow-lg group-hover/image:shadow-xl transform group-hover/image:scale-110 transition-all duration-300"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Compact Action Buttons - Horizontal Layout */}
                    <div className="flex flex-row gap-2 w-full xl:w-auto xl:ml-6 flex-shrink-0">
                      <button
                        onClick={() => toggleServiceStatus(service.id)}
                        className={`px-3 py-2 text-xs font-bold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center gap-1 ${
                          service.isActive 
                            ? 'bg-gradient-to-r from-red-400 to-red-500 text-white hover:from-red-500 hover:to-red-600' 
                            : 'bg-gradient-to-r from-orange-400 to-pink-500 text-white hover:from-orange-500 hover:to-pink-600'
                        }`}
                      >
                        <span className="text-sm">{service.isActive ? '🔴' : '🟢'}</span>
                        <span className="hidden sm:inline">{service.isActive ? 'Deactivate' : 'Activate'}</span>
                        <span className="sm:hidden">{service.isActive ? 'Off' : 'On'}</span>
                      </button>
                      
                      <button
                        onClick={() => handleEdit(service)}
                        className="px-3 py-2 text-xs font-bold rounded-lg text-gray-700 border-2 border-gray-300 hover:border-orange-400 hover:text-orange-600 hover:bg-orange-50 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center gap-1"
                      >
                        <span className="text-sm">✏️</span>
                        <span className="hidden sm:inline">Edit</span>
                      </button>
                      
                      <button
                        onClick={() => handleDelete(service.id)}
                        className="px-3 py-2 text-xs font-bold rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center gap-1"
                      >
                        <span className="text-sm">🗑️</span>
                        <span className="hidden sm:inline">Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : !showCreateForm && (
            /* Enhanced Empty State */
            <div className="text-center p-16 bg-gradient-to-br from-white/80 to-orange-50/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 relative overflow-hidden">
              {/* Decorative background */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-40 bg-gradient-to-br from-orange-200/30 to-pink-200/30 rounded-full -translate-y-20"></div>
              
              <div className="relative z-10">
                <div className="text-8xl mb-6 animate-bounce">🛠️</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  No Services Found
                </h3>
                <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
                  Create your first service to start accepting bookings and grow your business.
                </p>
                <button
                  onClick={() => {
                    setShowCreateForm(true);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="bg-gradient-to-r from-orange-500 to-pink-600 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 flex items-center gap-3 mx-auto"
                >
                  <span className="text-xl">✨</span>
                  Create Your First Service
                </button>
              </div>
            </div>
          )}
      </div>
      </div>
    </div>
  );
}