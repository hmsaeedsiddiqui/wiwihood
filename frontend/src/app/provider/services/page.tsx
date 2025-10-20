"use client";
import { useProviderServices, useCreateService, useUpdateService, useDeleteService } from "@/hooks/useServices";
import type { CreateServiceRequest } from "@/store/api/servicesApi";
import React, { useState, useEffect, useCallback } from "react";
import { useGetProviderInfoQuery, Service } from "@/store/api/servicesApi";
import { useAuthStatus } from "@/hooks/useAuth";
import { useCategories } from "@/hooks/useCategories";
import {
  Settings, Plus, Edit, Trash2, Building2, MapPin, Tag, DollarSign, Clock, FileText, Upload, XCircle, X, Star, Gift, Target, UserCheck, Users, CheckCircle, Lightbulb, Trophy, Calendar, Hash
} from "lucide-react";
import { ImageUpload } from "@/components/ImageUpload";
import { CloudinaryImage } from "@/components/CloudinaryImage";
import { Camera, Save } from "lucide-react";
import { cleanImageArray } from "@/utils/cloudinary";
// If clearAllCaches is a utility function, import it from its location
// import { clearAllCaches } from "@/utils/cacheUtils";

function ServicesPage() {
  // Auth hook
  const { user, isLoading: authLoading, isAuthenticated } = useAuthStatus();
  
  // Categories hook - fetches real-time categories from backend
  const { categories, isLoading: categoriesLoading, error: categoriesError, refetch: refetchCategories } = useCategories();
  
  // Get provider info using RTK Query
  const {
    data: providerInfo,
    isLoading: loadingProvider,
    error: providerInfoError,
    refetch: refetchProviderInfo
  } = useGetProviderInfoQuery();
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const MAX_RETRIES = 3;

  // Remove redundant safety timeout useEffect (handled in fetchProviderInfo)
  
  // Use provider ID from provider info
  const providerId = providerInfo?.id || '';
  
  // Check if user needs verification
  const needsVerification = user && !user.isEmailVerified;

  // Check if we have any form of authentication
  const hasAuth = isAuthenticated || !!localStorage.getItem('accessToken');
  
  // RTK Query hooks - provider-specific services (skip if no providerId)
  const {
    services,
    isLoading: servicesLoading,
    error: servicesError,
    refetch: refetchServices
  } = useProviderServices(providerId, undefined);
  
  const { createService, isLoading: isCreating, error: createError } = useCreateService();
  const { updateService, isLoading: isUpdating, error: updateError } = useUpdateService();
  const { deleteService, isLoading: isDeleting, error: deleteError } = useDeleteService();

  // Local state for UI
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [error, setError] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    shortDescription: "",
    categoryId: "",
    serviceType: "appointment",
    pricingType: "fixed", // Fixed: Changed from invalid "package" to valid "fixed"
    basePrice: "",
    durationMinutes: "",
    bufferTimeMinutes: "",
    maxAdvanceBookingDays: "",
    minAdvanceBookingHours: "",
    cancellationPolicyHours: "",
    requiresDeposit: false,
    depositAmount: "",
    preparationInstructions: "",
    isActive: false, // Provider can't control this - admin controls
    images: [] as string[],
    tags: [] as string[],
    // New frontend display fields
    displayLocation: "",
    providerBusinessName: "",
    highlightBadge: "",
    featuredImage: "",
    availableSlots: [] as string[],
  promotionText: "",
  isFeatured: false,
  difficultyLevel: "intermediate" as "beginner" | "intermediate" | "advanced",
  specialRequirements: "",
  includes: [] as string[],
  excludes: [] as string[],
  ageRestriction: "",
  genderPreference: "any" as "any" | "male" | "female",
    // Deals and promotions fields
    isPromotional: false,
    discountPercentage: "",
    promoCode: "",
    dealValidUntil: "",
    dealCategory: "",
    dealTitle: "",
    dealDescription: "",
    originalPrice: "",
    minBookingAmount: "",
    usageLimit: "",
    dealTerms: ""
  });

  useEffect(() => {
    // Clear any stored redirect path when successfully accessing this page
    if (isAuthenticated && typeof window !== 'undefined') {
      localStorage.removeItem('redirectAfterLogin');
    }
  }, [isAuthenticated]);

  // Development helper function
  const setupDevProvider = () => {
    if (process.env.NODE_ENV === 'development') {
      const devUser = {
        id: 'bf5eb227-6a77-499f-845e-4db8954f45a4', // Original provider ID
        email: 'dev@wiwihood.com',
        firstName: 'Test',
        lastName: 'Provider',
        isEmailVerified: true,
        role: 'provider'
      };
      
      // Store in localStorage for development
      localStorage.setItem('devUser', JSON.stringify(devUser));
      localStorage.setItem('accessToken', 'dev-token-123');
      localStorage.setItem('devProviderId', 'bf5eb227-6a77-499f-845e-4db8954f45a4');
      
      console.log('🧪 Development provider setup complete:', devUser);
      window.location.reload();
    }
  };

  // Helper function for login with redirect
  const handleLoginRedirect = () => {
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname + window.location.search;
      localStorage.setItem('redirectAfterLogin', currentPath);
      window.location.href = '/auth/login';
    }
  };

  // Development helper to add test service
  const addTestService = async () => {
    if (process.env.NODE_ENV === 'development' && providerId) {
      try {
        console.log('🧪 Testing service creation with:', { providerId });
        
        const testService: CreateServiceRequest = {
          name: 'Test Hair Cut',
          description: 'A professional hair cutting service',
          shortDescription: 'Hair Cut',
          categoryId: '618abaa0-b010-4f4b-859f-cddeb35296fb', // Hair Services category UUID
          serviceType: 'appointment',
          pricingType: 'fixed',
          basePrice: 50,
          durationMinutes: 60,
          bufferTimeMinutes: 0,
          maxAdvanceBookingDays: 30,
          minAdvanceBookingHours: 1,
          cancellationPolicyHours: 24,
          requiresDeposit: false,
          depositAmount: 0,
          preparationInstructions: '',
          isActive: true,
          images: [],
          tags: [],
          displayLocation: 'Dubai Marina',
          providerBusinessName: 'Elite Beauty Studio Dubai',
          highlightBadge: '',
          featuredImage: '',
          availableSlots: ['9:00 AM', '10:00 AM'],
          promotionText: '',
          isFeatured: false,
          difficultyLevel: 'intermediate',
          specialRequirements: '',
          includes: ['Deep cleansing', 'Exfoliation'],
          excludes: ['Hair coloring'],
          ageRestriction: '',
          genderPreference: 'any',
          isPromotional: false,
          discountPercentage: '',
          promoCode: '',
          dealValidUntil: '',
          dealCategory: '',
          dealTitle: '',
          dealDescription: '',
          originalPrice: undefined,
          minBookingAmount: undefined,
          usageLimit: undefined,
          dealTerms: ''
        };
        
        console.log('🧪 Test service data:', testService);
        console.log('🧪 CreateService function available:', typeof createService);
        
        const result = await createService(providerId, testService);
        console.log('✅ Test service added successfully:', result);
        
        // Refresh services list
        refetchServices();
      } catch (error) {
        console.error('❌ Failed to add test service:', error);
        console.error('❌ Test service error details:', JSON.stringify(error, null, 2));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!providerId) {
      setError('Provider ID missing. Please complete your provider profile.');
      return;
    }
    try {
      // Prepare payload
      const cleanedData: any = {
        ...formData,
        basePrice: Number(formData.basePrice) || 0,
        durationMinutes: Number(formData.durationMinutes) && !isNaN(Number(formData.durationMinutes))
          ? Math.max(1, Math.min(1440, Number(formData.durationMinutes)))
          : 60,
        bufferTimeMinutes: formData.bufferTimeMinutes ? Number(formData.bufferTimeMinutes) : undefined,
        maxAdvanceBookingDays: formData.maxAdvanceBookingDays ? Number(formData.maxAdvanceBookingDays) : undefined,
        minAdvanceBookingHours: formData.minAdvanceBookingHours ? Number(formData.minAdvanceBookingHours) : undefined,
        cancellationPolicyHours: formData.cancellationPolicyHours ? Number(formData.cancellationPolicyHours) : undefined,
        depositAmount: formData.depositAmount ? Number(formData.depositAmount) : undefined,
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
        minBookingAmount: formData.minBookingAmount ? Number(formData.minBookingAmount) : undefined,
        usageLimit: formData.usageLimit ? Number(formData.usageLimit) : undefined,
      };

      // Remove empty string fields and invalid numbers
      Object.keys(cleanedData).forEach((key) => {
        if (
          cleanedData[key] === '' ||
          cleanedData[key] === undefined ||
          cleanedData[key] === null ||
          (typeof cleanedData[key] === 'number' && isNaN(cleanedData[key]))
        ) {
          delete cleanedData[key];
        }
      });

      // Ensure durationMinutes is always present and valid
      if (!('durationMinutes' in cleanedData) || typeof cleanedData.durationMinutes !== 'number') {
        cleanedData.durationMinutes = 60;
      }

      // For featuredImage, ensure it's a valid Cloudinary URL if present
      if (cleanedData.featuredImage && typeof cleanedData.featuredImage === 'string' && !cleanedData.featuredImage.startsWith('http')) {
        cleanedData.featuredImage = `https://res.cloudinary.com/wiwihood/image/upload/${cleanedData.featuredImage}`;
      }

      if (editingService) {
        // Update existing service
        await updateService(editingService.id, cleanedData);
      } else {
        // Create new service
        await createService(providerId, cleanedData);
      }
      refetchServices();
      setShowCreateForm(false);
      setEditingService(null);
      setFormData({
        ...formData,
        name: '',
        description: '',
        shortDescription: '',
        categoryId: '',
        basePrice: '',
        durationMinutes: '',
        bufferTimeMinutes: '',
        maxAdvanceBookingDays: '',
        minAdvanceBookingHours: '',
        cancellationPolicyHours: '',
        depositAmount: '',
        preparationInstructions: '',
        images: [],
        tags: [],
        displayLocation: '',
        providerBusinessName: '',
        highlightBadge: '',
        featuredImage: '',
        availableSlots: [],
        promotionText: '',
        isFeatured: false,
        difficultyLevel: 'intermediate',
        specialRequirements: '',
        includes: [],
        excludes: [],
        ageRestriction: '',
        genderPreference: 'any',
        isPromotional: false,
        discountPercentage: '',
        promoCode: '',
        dealValidUntil: '',
        dealCategory: '',
        dealTitle: '',
        dealDescription: '',
        originalPrice: '',
        minBookingAmount: '',
        usageLimit: '',
        dealTerms: ''
      });
      setError('');
    } catch (err: any) {
  setError(err?.message || (editingService ? 'Failed to update service' : 'Failed to create service'));
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description,
      shortDescription: service.shortDescription,
      categoryId: service.categoryId,
      serviceType: service.serviceType || 'appointment',
      pricingType: service.pricingType || 'fixed',
      basePrice: service.basePrice?.toString() || '',
      durationMinutes: service.durationMinutes?.toString() || '',
      bufferTimeMinutes: service.bufferTimeMinutes?.toString() || '',
      maxAdvanceBookingDays: service.maxAdvanceBookingDays?.toString() || '',
      minAdvanceBookingHours: service.minAdvanceBookingHours?.toString() || '',
      cancellationPolicyHours: service.cancellationPolicyHours?.toString() || '',
      requiresDeposit: service.requiresDeposit || false,
      depositAmount: service.depositAmount?.toString() || '',
      preparationInstructions: service.preparationInstructions || '',
      isActive: service.isActive || false,
      images: service.images || [],
      tags: service.tags || [],
      displayLocation: service.displayLocation || '',
      providerBusinessName: service.providerBusinessName || '',
      highlightBadge: service.highlightBadge || '',
      featuredImage: service.featuredImage || '',
      availableSlots: service.availableSlots || [],
      promotionText: service.promotionText || '',
      isFeatured: service.isFeatured || false,
      difficultyLevel: service.difficultyLevel || 'intermediate',
      specialRequirements: service.specialRequirements || '',
      includes: service.includes || [],
      excludes: service.excludes || [],
      ageRestriction: service.ageRestriction || '',
      genderPreference: service.genderPreference || 'any',
      isPromotional: service.isPromotional || false,
      discountPercentage: service.discountPercentage || '',
      promoCode: service.promoCode || '',
      dealValidUntil: service.dealValidUntil || '',
      dealCategory: service.dealCategory || '',
      dealTitle: service.dealTitle || '',
      dealDescription: service.dealDescription || '',
      originalPrice: service.originalPrice?.toString() || '',
      minBookingAmount: service.minBookingAmount?.toString() || '',
      usageLimit: service.usageLimit?.toString() || '',
      dealTerms: service.dealTerms || ''
    });
    setShowCreateForm(true);
  };

  // Enhanced helper for input styles with wiwihood theme
  const inputClasses = "w-full p-4 border-2 border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#E89B8B] focus:border-[#E89B8B] transition-all duration-300 hover:border-gray-300 bg-white/70 backdrop-blur-sm";
  const labelClasses = "block text-sm font-bold text-gray-800 mb-2 flex items-center gap-2";
  const buttonBaseClasses = "px-6 py-3 text-sm font-semibold rounded-xl transition-all duration-300 transform hover:scale-105";

  // Combine all loading states
  const isLoading = servicesLoading || isCreating || isUpdating || isDeleting;

  // Helper function to extract error message
  const getErrorMessage = (error: any): string | null => {
    if (!error) return null;
    if (typeof error === 'string') return error;
    if ('message' in error) return error.message;
    if ('data' in error && error.data) {
      if (typeof error.data === 'string') return error.data;
      if (typeof error.data === 'object' && 'message' in error.data) return error.data.message;
    }
    return 'An error occurred';
  };

  // Combine all error states
  const combinedError = error || 
    getErrorMessage(servicesError) || 
    getErrorMessage(createError) || 
    getErrorMessage(updateError) || 
    getErrorMessage(deleteError);

  // Provider info loading/error UI via RTK Query
  if (loadingProvider) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E89B8B] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading provider info...</p>
        </div>
      </div>
    );
  }
  if (providerInfoError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Provider Info Error</h2>
          <p className="text-gray-600 mb-6">
            {typeof providerInfoError === 'object' && 'message' in providerInfoError
              ? providerInfoError.message
              : 'Unable to fetch provider info. Please check your connection or try again later.'}
          </p>
          <button
            onClick={() => refetchProviderInfo()}
            className="bg-[#E89B8B] text-white px-6 py-2 rounded-full hover:bg-[#d88b7b] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!authLoading && !hasAuth) {
    // Store current page for redirect after login
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/provider/services';
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F5F0EF] via-white to-[#E89B8B]/10 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gradient-to-r from-[#E89B8B] to-[#D4876F] rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-white text-2xl">🔒</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Authentication Required</h2>
            <p className="text-gray-600 mb-8">Please login to access your services dashboard.</p>
            
            <div className="flex gap-4 justify-center">
              <button 
                onClick={handleLoginRedirect}
                className="bg-gradient-to-r from-[#E89B8B] to-[#D4876F] text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              >
                Go to Login
              </button>
              
              {/* Development Mode Quick Login */}
              {process.env.NODE_ENV === 'development' && (
                <button 
                  onClick={setupDevProvider}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                >
                  🧪 Dev Login
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error if provider info not found
  if (!loadingProvider && hasAuth && !providerInfo && !isRetrying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F5F0EF] via-white to-[#E89B8B]/10 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-[#E89B8B] rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Provider Profile Not Found</h2>
            <p className="text-gray-600 mb-8">You need to complete your provider profile before managing services.</p>
            
            <button 
              onClick={() => window.location.href = '/provider/profile'}
              className="bg-gradient-to-r from-[#E89B8B] to-[#D4876F] text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            >
              Complete Provider Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F0EF] via-white to-[#E89B8B]/10">
      <div className="max-w-6xl mx-auto p-6 md:p-8">
        {/* Development Helper */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <h3 className="text-sm font-bold text-red-800 mb-2">🛠️ Development Tools</h3>
            <div className="flex gap-2">
              {/* Removed clearAllCaches button due to missing function */}
              <span className="text-xs text-red-600 self-center">
                Use this if you see old image URLs
              </span>
            </div>
          </div>
        )}
        

        {/* Enhanced Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-[#E89B8B] to-[#D4876F] rounded-xl flex items-center justify-center shadow-lg">
              <div className="bg-gradient-to-r from-[#E89B8B] to-[#D4876F] rounded-xl p-3 mr-3">
                <Settings className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Service Management
              </h1>
              <p className="text-gray-600 mt-2 text-lg">
                {providerInfo?.businessName ? `Manage services for ${providerInfo.businessName}` : 'Create and manage your professional services'}
              </p>
            </div>
          </div>
          
          <button
            onClick={() => {
              setShowCreateForm(true);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="group relative px-8 py-4 bg-gradient-to-r from-[#E89B8B] to-[#D4876F] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-3"
          >
            <span className="text-xl group-hover:rotate-90 transition-transform duration-300">+</span>
            <span>Create New Service</span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#D4876F] to-[#C47965] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>

        {/* Enhanced Create/Edit Form */}
        {showCreateForm && (
          <div className="bg-white/80 backdrop-blur-sm p-8 md:p-10 rounded-2xl shadow-2xl mb-10 border border-white/20 relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#E89B8B]/30 to-[#D4876F]/30 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-[#D4876F]/30 to-[#E89B8B]/30 rounded-full translate-y-12 -translate-x-12"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-gradient-to-r from-[#E89B8B] to-[#D4876F] rounded-lg flex items-center justify-center">
                  {editingService ? <Edit className="w-5 h-5 text-white" /> : <Plus className="w-5 h-5 text-white" />}
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  {editingService ? 'Edit Service' : 'Create New Service'}
                </h2>
              </div>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Business Display Name - Moved to top */}
              <div>
                <label className={labelClasses}>
                  <Building2 className="w-5 h-5 text-[#E89B8B]" />
                  Business Display Name
                </label>
                <input
                  type="text"
                  value={formData.providerBusinessName}
                  onChange={(e) => setFormData({...formData, providerBusinessName: e.target.value})}
                  className={inputClasses}
                  placeholder="e.g., Elite Beauty Studio Dubai"
                />
                <div className="text-xs text-gray-500 mt-1">Name shown on service cards</div>
              </div>

              {/* Display Location */}
              <div>
                <label className={labelClasses}>
                  <MapPin className="w-5 h-5 text-[#E89B8B]" />
                  Display Location
                </label>
                <select
                  value={formData.displayLocation}
                  onChange={(e) => setFormData({...formData, displayLocation: e.target.value})}
                  className={`${inputClasses} bg-white/70`}
                >
                  <option value="">Select Location</option>
                  <option value="Dubai Marina">Dubai Marina</option>
                  <option value="Downtown Dubai">Downtown Dubai</option>
                  <option value="JBR - Jumeirah Beach Residence">JBR - Jumeirah Beach Residence</option>
                  <option value="Business Bay">Business Bay</option>
                  <option value="DIFC - Dubai International Financial Centre">DIFC - Dubai International Financial Centre</option>
                  <option value="Palm Jumeirah">Palm Jumeirah</option>
                  <option value="Jumeirah">Jumeirah</option>
                  <option value="Deira">Deira</option>
                  <option value="Bur Dubai">Bur Dubai</option>
                  <option value="Al Barsha">Al Barsha</option>
                  <option value="Emirates Hills">Emirates Hills</option>
                  <option value="Mirdif">Mirdif</option>
                  <option value="International City">International City</option>
                  <option value="Dubai Silicon Oasis">Dubai Silicon Oasis</option>
                  <option value="Motor City">Motor City</option>
                </select>
                <div className="text-xs text-gray-500 mt-1">Choose your business location from popular Dubai areas</div>
              </div>
              
              {/* Service Name */}
              <div className="lg:col-span-2">
                <label className={labelClasses}>
                  <Tag className="w-5 h-5 text-[#E89B8B]" />
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
                  <Tag className="w-5 h-5 text-[#E89B8B]" />
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.categoryId}
                  onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                  className={`${inputClasses} bg-white/70`}
                  disabled={categoriesLoading}
                >
                  <option value="">
                    {categoriesLoading ? "Loading categories..." : "Select a category"}
                  </option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {categoriesError && (
                  <p className="text-red-500 text-sm mt-1">
                    Failed to load categories. Using fallback data.
                  </p>
                )}
              </div>

              {/* Service Type */}
              <div>
                <label className={labelClasses}>
                  <Settings className="w-5 h-5 text-[#E89B8B]" />
                  Service Type <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.serviceType}
                  onChange={(e) => setFormData({...formData, serviceType: e.target.value})}
                  className={`${inputClasses} bg-white/70`}
                >
                  <option value="appointment">Appointment</option>
                  <option value="package">Package</option>
                  <option value="consultation">Consultation</option>
                </select>
              </div>

              {/* Pricing Type */}
              <div>
                <label className={labelClasses}>
                  <DollarSign className="w-5 h-5 text-[#E89B8B]" />
                  Pricing Type <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.pricingType}
                  onChange={(e) => setFormData({...formData, pricingType: e.target.value})}
                  className={`${inputClasses} bg-white/70`}
                >
                  <option value="fixed">Fixed Price</option>
                  <option value="hourly">Hourly Rate</option>
                  <option value="variable">Variable Price</option>
                </select>
              </div>

              {/* Base Price */}
              <div>
                <label className={labelClasses}>
                  <DollarSign className="w-5 h-5 text-[#E89B8B]" />
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
                  <Clock className="w-5 h-5 text-[#E89B8B]" />
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

              {/* Active Status - Read Only for Provider */}
              <div className="flex flex-col pt-4">
                <label className="flex items-center text-sm font-bold text-gray-800 gap-3">
                  <div className="relative">
                    <div className="w-12 h-6 rounded-full bg-gray-300">
                      <div className="w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 mt-0.5 translate-x-0 ml-0.5"></div>
                    </div>
                  </div>
                  <span className="flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-orange-500" />
                    Pending Admin Approval
                  </span>
                </label>
                <div className="text-xs text-gray-500 mt-2 ml-15">Service will be activated by admin after approval</div>
              </div>
            </div>

            {/* Short Description */}
            <div>
              <label className={labelClasses}>
                <FileText className="w-5 h-5 text-[#E89B8B]" />
                Short Description <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.shortDescription}
                onChange={(e) => setFormData({...formData, shortDescription: e.target.value})}
                className={inputClasses}
                  placeholder="Describe your amazing service offering..."
                maxLength={100}
              />
              <div className="text-xs text-gray-500 mt-1">{formData.shortDescription.length}/100 characters</div>
            </div>

            {/* Frontend Display Fields Section */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
              
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Featured Image Upload */}
                <div className="lg:col-span-2">
                  <label className={labelClasses}>
                    <Upload className="w-5 h-5 text-[#E89B8B]" />
                    Main Service Image
                  </label>
                  <div className="mb-4">
                    <ImageUpload
                      uploadType="service-image"
                      onUploadSuccess={(result: any) => {
                        // Accept either publicId string or object with publicId property
                        let publicId = result;
                        if (result && typeof result === 'object' && result.publicId) {
                          publicId = result.publicId;
                        }
                        setFormData(prev => ({
                          ...prev,
                          featuredImage: publicId
                        }));
                      }}
                      className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-gray-400 transition-colors"
                    />
                    {formData.featuredImage && (
                      <div className="mt-4 flex items-center gap-4">
                        <CloudinaryImage
                          src={formData.featuredImage}
                          alt="Service featured image"
                          width={100}
                          height={100}
                          className="rounded-xl object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, featuredImage: '' }))}
                          className="px-3 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors flex items-center gap-2"
                        >
                          <X className="w-4 h-4" />
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Upload main image from your device - this will be the primary image displayed on service cards</div>
                </div>

                {/* Highlight Badge - Read Only for Provider */}
                <div>
                  <label className={labelClasses}>
                    <Star className="w-5 h-5 text-[#E89B8B]" />
                    Highlight Badge (Admin Assigned)
                  </label>
                  <input
                    type="text"
                    value={formData.highlightBadge}
                    readOnly
                    className={`${inputClasses} bg-gray-100 cursor-not-allowed`}
                    placeholder="Badge will be assigned by admin after approval"
                  />
                  <div className="text-xs text-gray-500 mt-1">Only admin can assign badges after service approval</div>
                </div>

                {/* Promotion Text */}
                <div>
                  <label className={labelClasses}>
                    <Gift className="w-5 h-5 text-[#E89B8B]" />
                    Promotion Text
                  </label>
                  <input
                    type="text"
                    value={formData.promotionText}
                    onChange={(e) => setFormData({...formData, promotionText: e.target.value})}
                    className={inputClasses}
                    placeholder="e.g., Professional manicure, pedicure & nail art"
                    maxLength={150}
                  />
                  <div className="text-xs text-gray-500 mt-1">Promotional message for the service</div>
                </div>

                {/* Difficulty Level */}
                <div>
                  <label className={labelClasses}>
                    <Target className="w-5 h-5 text-[#E89B8B]" />
                    Difficulty Level
                  </label>
                  <select
                    value={formData.difficultyLevel}
                    onChange={(e) => setFormData({...formData, difficultyLevel: e.target.value as 'beginner' | 'intermediate' | 'advanced'})}
                    className={`${inputClasses} bg-white/70`}
                  >
                    <option value="beginner">Beginner Friendly</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                  <div className="text-xs text-gray-500 mt-1">Complexity level of the service</div>
                </div>

                {/* Gender Preference */}
                <div>
                  <label className={labelClasses}>
                    <UserCheck className="w-5 h-5 text-[#E89B8B]" />
                    Gender Preference
                  </label>
                  <select
                    value={formData.genderPreference}
                    onChange={(e) => setFormData({...formData, genderPreference: e.target.value as 'any' | 'male' | 'female'})}
                    className={`${inputClasses} bg-white/70`}
                  >
                    <option value="any">Any Gender</option>
                    <option value="male">Male Only</option>
                    <option value="female">Female Only</option>
                  </select>
                  <div className="text-xs text-gray-500 mt-1">Target gender for this service</div>
                </div>

                {/* Age Restriction */}
                <div>
                  <label className={labelClasses}>
                    <Users className="w-5 h-5 text-[#E89B8B]" />
                    Age Restriction
                  </label>
                  <input
                    type="text"
                    value={formData.ageRestriction}
                    onChange={(e) => setFormData({...formData, ageRestriction: e.target.value})}
                    className={inputClasses}
                    placeholder="e.g., 18+, 16+, or leave empty"
                  />
                  <div className="text-xs text-gray-500 mt-1">Minimum age requirement</div>
                </div>

                {/* Featured Service Toggle */}
                <div className="flex items-center pt-4">
                  <label className="flex items-center text-sm font-bold text-gray-800 gap-3 cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={formData.isFeatured}
                        onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})}
                        className="sr-only"
                      />
                      <div className={`w-12 h-6 rounded-full transition-colors duration-300 ${formData.isFeatured ? 'bg-blue-500' : 'bg-gray-300'}`}>
                        <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 mt-0.5 ${formData.isFeatured ? 'translate-x-6 ml-1' : 'translate-x-0 ml-0.5'}`}></div>
                      </div>
                    </div>
                    <span className="flex items-center gap-2">
                      {formData.isFeatured ? <Star className="w-5 h-5 text-yellow-500 fill-current" /> : <Star className="w-5 h-5 text-gray-400" />}
                      Featured Service
                    </span>
                  </label>
                </div>
              </div>

              {/* Available Slots */}
              <div className="mt-6">
                <label className={labelClasses}>
                  <Clock className="w-5 h-5 text-[#E89B8B]" />
                  Available Time Slots
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                  {['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM'].map((slot) => (
                    <label key={slot} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.availableSlots.includes(slot)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({...formData, availableSlots: [...formData.availableSlots, slot]});
                          } else {
                            setFormData({...formData, availableSlots: formData.availableSlots.filter(s => s !== slot)});
                          }
                        }}
                        className="rounded text-blue-500 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{slot}</span>
                    </label>
                  ))}
                </div>
                <div className="text-xs text-gray-500">Select available time slots shown on service cards</div>
              </div>

              {/* Service Includes */}
              <div className="mt-6">
                <label className={labelClasses}>
                  <CheckCircle className="w-5 h-5 text-[#E89B8B]" />
                  What's Included
                </label>
                <div className="space-y-2">
                  {formData.includes.map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => {
                          const newIncludes = [...formData.includes];
                          newIncludes[index] = e.target.value;
                          setFormData({...formData, includes: newIncludes});
                        }}
                        className={inputClasses}
                        placeholder="e.g., Deep cleansing, exfoliation, moisturizing"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newIncludes = formData.includes.filter((_, i) => i !== index);
                          setFormData({...formData, includes: newIncludes});
                        }}
                        className="px-3 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors flex items-center justify-center"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, includes: [...formData.includes, '']})}
                    className="w-full py-2 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-gray-400 transition-colors"
                  >
                    + Add Included Item
                  </button>
                </div>
              </div>

              {/* Service Excludes */}
              <div className="mt-6">
                <label className={labelClasses}>
                  <XCircle className="w-5 h-5 text-[#E89B8B]" />
                  What's Not Included
                </label>
                <div className="space-y-2">
                  {formData.excludes.map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => {
                          const newExcludes = [...formData.excludes];
                          newExcludes[index] = e.target.value;
                          setFormData({...formData, excludes: newExcludes});
                        }}
                        className={inputClasses}
                        placeholder="e.g., Premium skincare products, aftercare kit"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newExcludes = formData.excludes.filter((_, i) => i !== index);
                          setFormData({...formData, excludes: newExcludes});
                        }}
                        className="px-3 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors flex items-center justify-center"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, excludes: [...formData.excludes, '']})}
                    className="w-full py-2 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-gray-400 transition-colors"
                  >
                    + Add Excluded Item
                  </button>
                </div>
              </div>

              {/* Special Requirements */}
              <div className="mt-6">
                <label className={labelClasses}>
                  <FileText className="w-5 h-5 text-[#E89B8B]" />
                  Special Requirements
                </label>
                <textarea
                  value={formData.specialRequirements}
                  onChange={(e) => setFormData({...formData, specialRequirements: e.target.value})}
                  rows={3}
                  className={`${inputClasses} resize-y`}
                  placeholder="Share any special requirements, preparations, or what clients should expect..."
                />
              </div>
            </div>

            {/* Full Description */}
            <div>
              <label className={labelClasses}>
                <FileText className="w-5 h-5 text-[#E89B8B]" />
                Full Description <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={5}
                className={`${inputClasses} resize-y`}
                placeholder="Provide a comprehensive description of your service, benefits, and what makes it special..."
              />
            </div>

            {/* Deals & Promotions Section */}
            <div className="bg-gradient-to-br from-[#F5F0EF] to-[#F5F0EF]/70 p-6 rounded-xl border border-[#E89B8B]/20">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Gift className="w-5 h-5 text-[#E89B8B]" />
                Deals & Promotions
              </h3>
              
              {/* Is Promotional Toggle */}
              <div className="flex items-center mb-6">
                <label className="flex items-center text-sm font-bold text-gray-800 gap-3 cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={formData.isPromotional}
                      onChange={(e) => setFormData({...formData, isPromotional: e.target.checked})}
                      className="sr-only"
                    />
                    <div className={`w-12 h-6 rounded-full transition-colors duration-300 ${formData.isPromotional ? 'bg-[#E89B8B]' : 'bg-gray-300'}`}>
                      <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 mt-0.5 ${formData.isPromotional ? 'translate-x-6 ml-1' : 'translate-x-0 ml-0.5'}`}></div>
                    </div>
                  </div>
                  <span className="flex items-center gap-2">
                    {formData.isPromotional ? <Gift className="w-5 h-5 text-[#E89B8B]" /> : <Lightbulb className="w-5 h-5 text-[#E89B8B]" />}
                    Enable Promotional Deal
                  </span>
                </label>
              </div>

              {/* Promotional Fields */}
              {formData.isPromotional && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Deal Title */}
                  <div>
                    <label className={labelClasses}>
                      <Trophy className="w-5 h-5 text-[#E89B8B]" />
                      Deal Title
                    </label>
                    <input
                      type="text"
                      value={formData.dealTitle}
                      onChange={(e) => setFormData({...formData, dealTitle: e.target.value})}
                      className={inputClasses}
                      placeholder="e.g., New Client Special Offer"
                    />
                  </div>

                  {/* Discount Percentage */}
                  <div>
                    <label className={labelClasses}>
                      <DollarSign className="w-5 h-5 text-[#E89B8B]" />
                      Discount
                    </label>
                    <input
                      type="text"
                      value={formData.discountPercentage}
                      onChange={(e) => setFormData({...formData, discountPercentage: e.target.value})}
                      className={inputClasses}
                      placeholder="e.g., 30% OFF"
                    />
                  </div>

                  {/* Promo Code */}
                  <div>
                    <label className={labelClasses}>
                      <Tag className="w-5 h-5 text-[#E89B8B]" />
                      Promo Code
                    </label>
                    <input
                      type="text"
                      value={formData.promoCode}
                      onChange={(e) => setFormData({...formData, promoCode: e.target.value.toUpperCase()})}
                      className={inputClasses}
                      placeholder="e.g., NEWCLIENT30"
                    />
                  </div>

                  {/* Deal Valid Until */}
                  <div>
                    <label className={labelClasses}>
                      <Calendar className="w-5 h-5 text-[#E89B8B]" />
                      Valid Until
                    </label>
                    <input
                      type="date"
                      value={formData.dealValidUntil}
                      onChange={(e) => setFormData({...formData, dealValidUntil: e.target.value})}
                      className={inputClasses}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  {/* Deal Category */}
                  <div>
                    <label className={labelClasses}>
                      <Tag className="w-5 h-5 text-[#E89B8B]" />
                      Deal Category
                    </label>
                    <select
                      value={formData.dealCategory}
                      onChange={(e) => setFormData({...formData, dealCategory: e.target.value})}
                      className={`${inputClasses} bg-white/70`}
                    >
                      <option value="">Select Deal Category</option>
                      <option value="New Customer">New Customer</option>
                      <option value="Weekend Deal">Weekend Deal</option>
                      <option value="Spa Combo">Spa Combo</option>
                      <option value="Seasonal">Seasonal</option>
                      <option value="Holiday Special">Holiday Special</option>
                      <option value="Limited Time">Limited Time</option>
                    </select>
                  </div>

                  {/* Original Price */}
                  <div>
                    <label className={labelClasses}>
                      <DollarSign className="w-5 h-5 text-[#E89B8B]" />
                      Original Price (AED)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.originalPrice}
                      onChange={(e) => setFormData({...formData, originalPrice: e.target.value})}
                      className={inputClasses}
                      placeholder="Price before discount"
                    />
                  </div>

                  {/* Deal Description */}
                  <div className="md:col-span-2">
                    <label className={labelClasses}>
                      <FileText className="w-5 h-5 text-[#E89B8B]" />
                      Deal Description
                    </label>
                    <textarea
                      value={formData.dealDescription}
                      onChange={(e) => setFormData({...formData, dealDescription: e.target.value})}
                      className={`${inputClasses} min-h-[100px]`}
                      placeholder="Describe your special promotional offer in detail..."
                    />
                  </div>

                  {/* Min Booking Amount */}
                  <div>
                    <label className={labelClasses}>
                      <DollarSign className="w-5 h-5 text-[#E89B8B]" />
                      Min Booking Amount (AED)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.minBookingAmount}
                      onChange={(e) => setFormData({...formData, minBookingAmount: e.target.value})}
                      className={inputClasses}
                      placeholder="Minimum amount for deal"
                    />
                  </div>

                  {/* Usage Limit */}
                  <div>
                    <label className={labelClasses}>
                      <Hash className="w-5 h-5 text-[#E89B8B]" />
                      Usage Limit per Customer
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.usageLimit}
                      onChange={(e) => setFormData({...formData, usageLimit: e.target.value})}
                      className={inputClasses}
                      placeholder="e.g., 1"
                    />
                  </div>

                  {/* Deal Terms */}
                  <div className="md:col-span-2">
                    <label className={labelClasses}>
                      <FileText className="w-5 h-5 text-[#E89B8B]" />
                      Deal Terms & Conditions
                    </label>
                    <textarea
                      value={formData.dealTerms}
                      onChange={(e) => setFormData({...formData, dealTerms: e.target.value})}
                      className={`${inputClasses} min-h-[80px]`}
                      placeholder="Terms and conditions, validity period, restrictions..."
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Service Images */}
            <div>
              <label className={labelClasses}>
                <Camera className="w-5 h-5 text-[#E89B8B]" />
                Service Images (Max 5)
              </label>
              <div className="mb-4">
                <ImageUpload
                  uploadType="service-image"
                  onUploadSuccess={(publicId: string) => {
                    setFormData(prev => ({
                      ...prev,
                      images: [...prev.images, publicId]
                    }));
                  }}
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
                      {/* Debug info in development */}
                      {process.env.NODE_ENV === 'development' && (
                        <div className="text-xs text-gray-500 mt-1 break-all">
                          ID: {publicId}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Enhanced Action Buttons */}
            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                  setEditingService(null);
                }}
                className="px-8 py-4 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300 transition-all duration-300 flex items-center gap-3"
              >
                <X className="w-5 h-5" />
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={isCreating || isUpdating}
                className="flex-1 bg-gradient-to-r from-[#E89B8B] to-[#D4876F] text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {(isCreating || isUpdating) ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    {editingService ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    {editingService ? <Save className="w-5 h-5 text-white" /> : <Plus className="w-5 h-5 text-white" />}
                    {editingService ? 'Update Service' : 'Create Service'}
                  </>
                )}
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
                        <span className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-full shadow-lg bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800">
                          <XCircle className="w-4 h-4" />
                          Pending Admin Approval
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
                        <div className="bg-gradient-to-br from-[#F5F0EF] to-[#F5F0EF]/80 p-4 rounded-xl">
                          <div className="flex items-center gap-2 mb-2">
                            <Tag className="w-5 h-5 text-[#E89B8B]" />
                            <strong className="text-gray-800">Category</strong>
                          </div>
                          <p className="text-gray-600 font-medium">{service.category?.name || 'N/A'}</p>
                        </div>
                        
                        <div className="bg-gradient-to-br from-[#F5F0EF] to-[#F5F0EF]/80 p-4 rounded-xl">
                          <div className="flex items-center gap-2 mb-2">
                            <DollarSign className="w-5 h-5 text-[#E89B8B]" />
                            <strong className="text-gray-800">Price</strong>
                          </div>
                          <p className="text-gray-600 font-medium">${service.basePrice}</p>
                        </div>
                        
                        <div className="bg-gradient-to-br from-[#F5F0EF] to-[#F5F0EF]/80 p-4 rounded-xl">
                          <div className="flex items-center gap-2 mb-2">
                            <Clock className="w-5 h-5 text-[#E89B8B]" />
                            <strong className="text-gray-800">Duration</strong>
                          </div>
                          <p className="text-gray-600 font-medium">{service.durationMinutes} min</p>
                        </div>
                        
                        <div className="bg-gradient-to-br from-[#F5F0EF] to-[#F5F0EF]/80 p-4 rounded-xl">
                          <div className="flex items-center gap-2 mb-2">
                            <Settings className="w-5 h-5 text-[#E89B8B]" />
                            <strong className="text-gray-800">Type</strong>
                          </div>
                          <p className="text-gray-600 font-medium capitalize">{service.serviceType}</p>
                        </div>
                      </div>
                      
                      {/* Enhanced Service Images Display */}
                      {service.images && service.images.length > 0 && (
                        <div className="mt-6">
                          <div className="flex items-center gap-2 mb-4">
                            <Camera className="w-5 h-5 text-[#E89B8B]" />
                            <strong className="text-gray-800 font-bold">Service Images</strong>
                          </div>
                          <div className="flex flex-wrap gap-3">
                            {cleanImageArray(service.images).map((publicId, index) => (
                              <div key={index} className="w-24 h-24 flex-shrink-0 group/image">
                                <CloudinaryImage
                                  src={publicId}
                                  alt={`${service.name} image ${index + 1}`}
                                  width={96}
                                  height={96}
                                  className="rounded-xl object-cover w-full h-full shadow-lg group-hover/image:shadow-xl transform group-hover/image:scale-110 transition-all duration-300"
                                />
                                {/* Debug info in development */}
                                {process.env.NODE_ENV === 'development' && (
                                  <div className="text-xs text-gray-500 mt-1 break-all">
                                    ID: {publicId}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                          {/* Show message if some images were filtered out */}
                          {process.env.NODE_ENV === 'development' && service.images.length !== cleanImageArray(service.images).length && (
                            <div className="text-xs text-orange-600 mt-2">
                              ⚠️ {service.images.length - cleanImageArray(service.images).length} invalid image(s) filtered out
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {/* Action Buttons - Only Edit and Delete for Provider */}
                    <div className="flex flex-row gap-2 w-full xl:w-auto xl:ml-6 flex-shrink-0">
                      <button
                        onClick={() => handleEdit(service)}
                        className="px-4 py-2 text-xs font-bold rounded-lg text-gray-700 border-2 border-gray-300 hover:border-[#E89B8B] hover:text-[#D4876F] hover:bg-[#F5F0EF] transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                      
                      <button
                        onClick={async () => {
                          if (window.confirm('Are you sure you want to delete this service?')) {
                            try {
                              await deleteService(service.id);
                              refetchServices();
                            } catch (err: any) {
                              // Error is handled by setError/toast elsewhere
                            }
                          }
                        }}
                        disabled={isDeleting}
                        className={`px-4 py-2 text-xs font-bold rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center gap-2 ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : !showCreateForm && (
            /* Enhanced Empty State */
            <div className="text-center p-16 bg-gradient-to-br from-white/80 to-[#F5F0EF]/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 relative overflow-hidden">
              {/* Decorative background */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-40 bg-gradient-to-br from-[#E89B8B]/30 to-[#D4876F]/30 rounded-full -translate-y-20"></div>
              
              <div className="relative z-10">
                <div className="w-20 h-20 bg-gradient-to-r from-[#E89B8B] to-[#D4876F] rounded-full flex items-center justify-center mb-6 mx-auto animate-bounce shadow-2xl">
                  <Settings className="w-10 h-10 text-white" />
                </div>
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
                  className="bg-gradient-to-r from-[#E89B8B] to-[#D4876F] text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 flex items-center gap-3 mx-auto hover:from-[#D4876F] hover:to-[#C7725C]"
                >
                  <Plus className="w-6 h-6 text-white" />
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

export default ServicesPage;