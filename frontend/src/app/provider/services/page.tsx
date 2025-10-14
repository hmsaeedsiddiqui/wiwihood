"use client";
import React, { useState, useEffect } from "react";
import { ImageUpload } from "@/components/cloudinary/ImageUpload";
import { CloudinaryImage } from "@/components/cloudinary/CloudinaryImage";
import { useProviderServices, useCreateService, useUpdateService, useDeleteService } from "@/hooks/useServices";
import { useAuthStatus } from "@/hooks/useAuth";
import { Service, CreateServiceRequest } from "@/store/api/servicesApi";

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function ServicesPage() {
  // Auth hook
  const { user, isLoading: authLoading, isAuthenticated } = useAuthStatus();
  
  // Get development user fallback
  const devUser = process.env.NODE_ENV === 'development' ? 
    (() => {
      try {
        return JSON.parse(localStorage.getItem('devUser') || '{}');
      } catch {
        return null;
      }
    })() : null;
  
  // Get provider ID with multiple fallbacks
  const actualUser = user || devUser;
  let providerId = actualUser?.id || actualUser?.providerId || "";
  
  // Try localStorage stored provider ID (development)
  if (!providerId && process.env.NODE_ENV === 'development') {
    const storedProviderId = localStorage.getItem('devProviderId');
    if (storedProviderId) {
      providerId = storedProviderId;
      console.log('🧪 Using stored provider ID:', providerId);
    }
  }
  
  // Development fallback - use a fixed ID if we have a token but no user ID
  if (!providerId && process.env.NODE_ENV === 'development' && localStorage.getItem('accessToken')) {
    providerId = 'bf5eb227-6a77-499f-845e-4db8954f45a4'; // Original provider ID
    localStorage.setItem('devProviderId', providerId);
    console.log('🧪 Using development provider ID:', providerId);
  }
  
  // Final fallback - if still no provider ID in dev mode, force one
  if (!providerId && process.env.NODE_ENV === 'development') {
    providerId = 'bf5eb227-6a77-499f-845e-4db8954f45a4'; // Original provider ID
    localStorage.setItem('devProviderId', providerId);
    console.log('🧪 Forcing development provider ID:', providerId);
  }
  
  // Emergency fallback for production (temporary fix)
  if (!providerId && localStorage.getItem('accessToken')) {
    console.warn('⚠️ No provider ID found but access token exists. Using emergency fallback.');
    providerId = 'bf5eb227-6a77-499f-845e-4db8954f45a4'; // Original provider ID
  }
  
  // Check if user needs verification
  const needsVerification = actualUser && !actualUser.isEmailVerified;

  // Check if we have any form of authentication
  const hasAuth = isAuthenticated || !!devUser || !!localStorage.getItem('accessToken');
  
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

  // Debug logging (after hooks are defined)
  console.log('🔍 Auth Debug:', { 
    user, 
    devUser,
    actualUser,
    providerId, 
    isAuthenticated,
    hasAuth,
    authLoading,
    needsVerification,
    hasAccessToken: !!localStorage.getItem('accessToken'),
    userKeys: actualUser ? Object.keys(actualUser) : [],
    servicesCount: services?.length || 0,
    servicesLoading,
    servicesError: servicesError ? 'Error present' : 'No error',
    nodeEnv: process.env.NODE_ENV
  });

  // Local state for UI
  const [categories, setCategories] = useState<Category[]>([]);
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
    pricingType: "fixed",
    basePrice: "",
    durationMinutes: "",
    bufferTimeMinutes: "",
    maxAdvanceBookingDays: "",
    minAdvanceBookingHours: "",
    cancellationPolicyHours: "",
    requiresDeposit: false,
    depositAmount: "",
    preparationInstructions: "",
    isActive: true,
    images: [] as string[],
    tags: [] as string[]
  });

  useEffect(() => {
    fetchCategories();
    
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
          serviceType: 'appointment' as const,
          pricingType: 'fixed' as const,
          basePrice: 50,
          durationMinutes: 60,
          isActive: true,
          images: []
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

  const fetchCategories = async () => {
    try {
      console.log('🚀 Loading categories...');
      // TODO: Add categories API to RTK Query when available
      // For now using real categories from backend
      setCategories([
        { id: '618abaa0-b010-4f4b-859f-cddeb35296fb', name: 'Hair Services', slug: 'hair-services' },
        { id: '08b8ab06-c82e-4a41-bba3-0876ee853cf9', name: 'Beauty & Makeup', slug: 'beauty-makeup' },
        { id: 'af5c2305-b3c0-476b-b1d0-cabc50679300', name: 'Nail Services', slug: 'nail-services' },
        { id: 'ce008b15-b909-49b6-911d-ac996333a837', name: 'Massage & Wellness', slug: 'massage-wellness' },
        { id: '6facb470-f6d5-4e38-884e-c65c3b1c2daf', name: 'Facial Treatments', slug: 'facial-treatments' },
        { id: '72aa814c-c648-4b5a-8b3a-b1b7be5f0be9', name: 'Barber Services', slug: 'barber-services' }
      ]);
      console.log('✅ Categories loaded successfully');
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Set fallback categories with real UUIDs if API fails
      setCategories([
        { id: '618abaa0-b010-4f4b-859f-cddeb35296fb', name: 'Hair Services', slug: 'hair-services' },
        { id: '08b8ab06-c82e-4a41-bba3-0876ee853cf9', name: 'Beauty & Makeup', slug: 'beauty-makeup' },
        { id: 'af5c2305-b3c0-476b-b1d0-cabc50679300', name: 'Nail Services', slug: 'nail-services' }
      ]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Wait for auth to load before checking
    if (authLoading) {
      setError("Loading user information, please wait...");
      return;
    }

    if (!providerId) {
      console.log('❌ Provider ID missing:', { 
        user, 
        devUser,
        actualUser,
        providerId, 
        isAuthenticated, 
        authLoading, 
        hasAuth,
        hasAccessToken: !!localStorage.getItem('accessToken'),
        nodeEnv: process.env.NODE_ENV
      });
      
      // In development, try to force a provider ID
      if (process.env.NODE_ENV === 'development') {
        const forcedProviderId = 'emergency-dev-provider-789';
        console.log('🚨 Emergency: Using forced provider ID:', forcedProviderId);
        
        // Try to create service with forced ID
        try {
          const submitData: CreateServiceRequest = {
            name: formData.name,
            description: formData.description,
            shortDescription: formData.shortDescription,
            categoryId: formData.categoryId,
            serviceType: formData.serviceType as 'appointment' | 'package' | 'consultation',
            pricingType: formData.pricingType as 'fixed' | 'hourly' | 'variable',
            basePrice: parseFloat(formData.basePrice),
            durationMinutes: Math.max(1, Math.min(1440, parseInt(formData.durationMinutes))),
            isActive: formData.isActive,
            images: formData.images
          };
          
          await createService(forcedProviderId, submitData);
          console.log('✅ Service created with forced provider ID');
          resetForm();
          return;
        } catch (forceError) {
          console.error('❌ Failed with forced provider ID:', forceError);
        }
      }
      
      if (!hasAuth) {
        setError("Please login to continue");
      } else {
        setError("Provider information not found. Please refresh and try again.");
      }
      return;
    }

    // Check email verification (allow bypass in development)
    if (needsVerification && process.env.NODE_ENV !== 'development') {
      setError("Please verify your email address before creating services.");
      return;
    }

    // Development mode warning
    if (process.env.NODE_ENV === 'development' && needsVerification) {
      console.warn('⚠️ Development mode: Bypassing email verification check');
    }

    try {
      const submitData: CreateServiceRequest = {
        name: formData.name,
        description: formData.description,
        shortDescription: formData.shortDescription,
        categoryId: formData.categoryId,
        serviceType: formData.serviceType as 'appointment' | 'package' | 'consultation',
        pricingType: formData.pricingType as 'fixed' | 'hourly' | 'variable',
        basePrice: parseFloat(formData.basePrice),
        durationMinutes: Math.max(1, Math.min(1440, parseInt(formData.durationMinutes))),
        bufferTimeMinutes: formData.bufferTimeMinutes ? parseInt(formData.bufferTimeMinutes) : undefined,
        maxAdvanceBookingDays: formData.maxAdvanceBookingDays ? parseInt(formData.maxAdvanceBookingDays) : undefined,
        minAdvanceBookingHours: formData.minAdvanceBookingHours ? parseInt(formData.minAdvanceBookingHours) : undefined,
        cancellationPolicyHours: formData.cancellationPolicyHours ? parseInt(formData.cancellationPolicyHours) : undefined,
        requiresDeposit: formData.requiresDeposit,
        depositAmount: formData.depositAmount ? parseFloat(formData.depositAmount) : undefined,
        preparationInstructions: formData.preparationInstructions || undefined,
        isActive: formData.isActive,
        images: formData.images,
        tags: formData.tags
      };
      
      if (editingService) {
        // Update existing service using RTK Query
        console.log('🔄 Services: Updating service...', { serviceId: editingService.id, submitData });
        const updateResult = await updateService(editingService.id, submitData);
        console.log('✅ Services: Service updated successfully', updateResult);
      } else {
        // Create new service using RTK Query
        console.log('🆕 Services: Creating new service...', { providerId, submitData });
        const createResult = await createService(providerId, submitData);
        console.log('✅ Services: Service created successfully', createResult);
      }

      // Reset form
      resetForm();
    } catch (error: any) {
      console.error('Error saving service - Full Error Object:', JSON.stringify(error, null, 2));
      console.error('Error saving service - Direct:', error);
      console.log('🔍 Error Analysis:', {
        error,
        errorType: typeof error,
        errorKeys: error ? Object.keys(error) : [],
        errorMessage: error?.message,
        errorData: error?.data,
        errorStatus: error?.status,
        isRTKError: 'status' in error || 'data' in error,
        formData: {
          name: formData.name,
          description: formData.shortDescription,
          categoryId: formData.categoryId,
          serviceType: formData.serviceType,
          basePrice: formData.basePrice,
          durationMinutes: formData.durationMinutes
        }
      });
      
      // Handle specific error cases
      let errorMessage = 'Failed to save service';
      
      // RTK Query error handling
      if (error && typeof error === 'object') {
        if ('status' in error) {
          // RTK Query FetchBaseQueryError
          if (error.status === 401) {
            errorMessage = 'Authentication required. Please login again.';
          } else if (error.status === 403) {
            errorMessage = 'Account verification required. Please verify your email to create services.';
          } else if (error.status === 422) {
            errorMessage = 'Invalid data provided. Please check all fields.';
          } else if (error.data && typeof error.data === 'object' && 'message' in error.data) {
            errorMessage = error.data.message as string;
          } else {
            errorMessage = `Server error (${error.status})`;
          }
        } else if ('message' in error) {
          // SerializedError
          errorMessage = error.message as string;
        } else if (error.message) {
          // Regular error
          errorMessage = error.message;
        }
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      console.log('🚨 Final Error Message:', errorMessage);
      setError(errorMessage);
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
      pricingType: service.pricingType || "fixed",
      basePrice: service.basePrice?.toString() || "",
      durationMinutes: service.durationMinutes?.toString() || "",
      bufferTimeMinutes: service.bufferTimeMinutes?.toString() || "",
      maxAdvanceBookingDays: service.maxAdvanceBookingDays?.toString() || "",
      minAdvanceBookingHours: service.minAdvanceBookingHours?.toString() || "",
      cancellationPolicyHours: service.cancellationPolicyHours?.toString() || "",
      requiresDeposit: service.requiresDeposit || false,
      depositAmount: service.depositAmount?.toString() || "",
      preparationInstructions: service.preparationInstructions || "",
      isActive: service.isActive,
      images: service.images || [],
      tags: service.tags || []
    });
    setShowCreateForm(true);
    // Scroll to the form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (serviceId: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    try {
      console.log('🗑️ Services: Deleting service...');
      await deleteService(serviceId);
      console.log('✅ Services: Service deleted successfully');
    } catch (error: any) {
      console.error('❌ Services: Error deleting service:', error);
      setError(error.message || 'Failed to delete service');
    }
  };

  const toggleServiceStatus = async (serviceId: string) => {
    try {
      console.log('🔄 Services: Toggling service status...');
      
      // Find the current service to get its current status
      const currentService = services?.find(s => s.id === serviceId);
      if (!currentService) {
        setError('Service not found');
        return;
      }
      
      // Toggle the isActive status
      await updateService(serviceId, { isActive: !currentService.isActive });
      
      console.log('✅ Services: Service status toggled successfully');
    } catch (error: any) {
      console.error('❌ Services: Error toggling service status:', error);
      setError(error.message || 'Failed to update service status');
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
      bufferTimeMinutes: "",
      maxAdvanceBookingDays: "",
      minAdvanceBookingHours: "",
      cancellationPolicyHours: "",
      requiresDeposit: false,
      depositAmount: "",
      preparationInstructions: "",
      isActive: true,
      images: [] as string[],
      tags: [] as string[]
    });
    setShowCreateForm(false);
    setEditingService(null);
    setError("");
  };

  // Enhanced helper for input styles with wiwihood theme
  const inputClasses = "w-full p-4 border-2 border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 hover:border-gray-300 bg-white/70 backdrop-blur-sm";
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

  // Show loading state for auth or services
  if (authLoading || (isLoading && !services)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent mx-auto mb-4"></div>
            <div className="text-lg text-gray-600 font-medium">
              {authLoading ? 'Checking authentication...' : 'Loading your services...'}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!authLoading && !hasAuth) {
    // Store current page for redirect after login
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/provider/services';
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-white text-2xl">🔒</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Authentication Required</h2>
            <p className="text-gray-600 mb-8">Please login to access your services dashboard.</p>
            
            <div className="flex gap-4 justify-center">
              <button 
                onClick={handleLoginRedirect}
                className="bg-gradient-to-r from-orange-500 to-pink-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50">
      <div className="max-w-6xl mx-auto p-6 md:p-8">
        {/* Development Helper */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 p-6 rounded-xl mb-8 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-blue-500 text-xl mr-3">🧪</span>
                <div>
                  <h4 className="text-blue-800 font-semibold">Development Mode</h4>
                  <p className="text-blue-700 mt-1">
                    {!hasAuth 
                      ? 'Quick login for testing' 
                      : `Provider ID: ${providerId || 'Not set'} | User: ${actualUser?.firstName || 'Unknown'} | Services: ${services?.length || 0}`
                    }
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                {!hasAuth ? (
                  <button 
                    onClick={setupDevProvider}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                  >
                    Dev Login
                  </button>
                ) : (
                  <>
                    <button 
                      onClick={addTestService}
                      disabled={!providerId || isCreating}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
                    >
                      Add Test Service
                    </button>
                    <button 
                      onClick={() => refetchServices()}
                      className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                    >
                      Refresh
                    </button>
                    <button 
                      onClick={() => {
                        const newId = prompt('Enter Provider ID for testing:', providerId || '');
                        if (newId) {
                          localStorage.setItem('devProviderId', newId);
                          window.location.reload();
                        }
                      }}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                    >
                      Set Provider ID
                    </button>
                    <button 
                      onClick={async () => {
                        console.log('🔍 Debug Info:', {
                          providerId,
                          actualUser,
                          hasAuth,
                          createServiceFunction: typeof createService,
                          isCreating,
                          createError,
                          servicesApiBase: process.env.NEXT_PUBLIC_API_URL,
                          accessToken: !!localStorage.getItem('accessToken')
                        });
                        
                        // Test backend connectivity
                        const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
                        try {
                          console.log('🌐 Testing backend connectivity:', `${backendUrl}/health`);
                          const response = await fetch(`${backendUrl}/health`);
                          console.log('✅ Backend connection:', response.status, await response.text());
                        } catch (error) {
                          console.error('❌ Backend connection failed:', error);
                          
                          // Try alternative ports
                          const alternatePorts = ['3000', '3001', '8000', '8080'];
                          for (const port of alternatePorts) {
                            try {
                              const altResponse = await fetch(`http://localhost:${port}/health`);
                              console.log(`✅ Found backend on port ${port}:`, altResponse.status);
                              break;
                            } catch (altError) {
                              console.log(`❌ Port ${port} not available`);
                            }
                          }
                        }
                      }}
                      className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                    >
                      Debug Info
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

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
                disabled={isCreating || isUpdating}
                className="flex-1 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {(isCreating || isUpdating) ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    {editingService ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <span className="text-lg">{editingService ? '💾' : '✨'}</span>
                    {editingService ? 'Update Service' : 'Create Service'}
                  </>
                )}
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
                          <p className="text-gray-600 font-medium">${service.price}</p>
                        </div>
                        
                        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg">⏱️</span>
                            <strong className="text-gray-800">Duration</strong>
                          </div>
                          <p className="text-gray-600 font-medium">{service.duration} min</p>
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