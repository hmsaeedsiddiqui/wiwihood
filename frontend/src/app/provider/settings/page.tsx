'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { User, Shield, Bell, Save, Camera, Trash2, Settings, Mail, Phone, MapPin, Globe, AlertTriangle, RefreshCw, Upload, X } from 'lucide-react';
import { useGetUserProfileQuery, useUpdateProfileMutation } from '@/store/api/userApi';
import { useGetCurrentProviderQuery, useUpdateProviderMutation, useCreateProviderMutation, useUploadProviderLogoMutation, useUploadProviderCoverMutation, useRemoveProviderLogoMutation, useRemoveProviderCoverMutation } from '@/store/api/providersApi';
import { useAuthStatus } from '@/hooks/useAuth';
import { toast } from 'react-hot-toast';

// Custom Hook to track window width
const useWindowWidth = () => {
  const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return width;
};

const SettingsPage = () => {
  const { isAuthenticated } = useAuthStatus();
  const { data: userProfile, isLoading: profileLoading, refetch: refetchProfile, error: profileError } = useGetUserProfileQuery();
  const { data: providerProfile, isLoading: providerLoading, refetch: refetchProvider, error: providerError } = useGetCurrentProviderQuery();
  const [updateProfile, { isLoading: updateLoading }] = useUpdateProfileMutation();
  const [updateProvider, { isLoading: updateProviderLoading }] = useUpdateProviderMutation();
  const [uploadLogo, { isLoading: uploadLogoLoading }] = useUploadProviderLogoMutation();
  const [uploadCover, { isLoading: uploadCoverLoading }] = useUploadProviderCoverMutation();
  const [removeLogo] = useRemoveProviderLogoMutation();
  const [removeCover] = useRemoveProviderCoverMutation();
  const [createProvider, { isLoading: createProviderLoading }] = useCreateProviderMutation();

  const [activeSection, setActiveSection] = useState('profile');
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  
  // File input refs
  const logoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  
  // Debug logging - API-only approach
  console.log('🔍 Provider Settings Debug:')
  console.log('Auth Status:', { isAuthenticated })
  console.log('User Profile Data:', { userProfile, profileLoading, profileError })
  console.log('Provider Profile Data:', { providerProfile, providerLoading, providerError })
  console.log('API Response Structure:', { 
    user: userProfile ? Object.keys(userProfile) : 'No user data',
    provider: providerProfile ? Object.keys(providerProfile) : 'No provider data'
  })

  // Form data states - initialized from API data only
  const [profileData, setProfileData] = useState({
    businessName: '',
    ownerName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    description: '',
    website: '',
    country: '',
    timezone: '',
    profilePicture: ''
  });

  const [securityData, setSecurityData] = useState({
    twoFactorEnabled: false,
    lastPasswordChange: '',
    loginAlerts: true,
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notificationData, setNotificationData] = useState({
    emailNotifications: false,
    smsNotifications: false,
    bookingAlerts: false,
    marketingEmails: false,
    weeklyReports: false
  });

  const [validationErrors, setValidationErrors] = useState({
    website: ''
  });
  
  const windowWidth = useWindowWidth();
  const isMobile = windowWidth < 768;

  // Validation functions
  const validateWebsite = (url: string) => {
    if (!url || url.trim() === '') {
      return ''; // Empty is valid (optional field)
    }
    try {
      new URL(url);
      return '';
    } catch {
      return 'Please enter a valid URL (e.g., https://example.com)';
    }
  };

  // Update form data when API data is available
  useEffect(() => {
    if (userProfile || providerProfile) {
      console.log('🔄 Provider Settings: Updating form data from API response');
      
      // Map API response to form data - prioritize provider data, fallback to user data
      setProfileData({
        businessName: providerProfile?.businessName || `${userProfile?.firstName || ''} ${userProfile?.lastName || ''}`.trim(),
        ownerName: `${userProfile?.firstName || ''} ${userProfile?.lastName || ''}`.trim(),
        email: userProfile?.email || '',
        phone: providerProfile?.phone || userProfile?.phone || '',
        address: providerProfile?.address || '',
        city: providerProfile?.city || '',
        postalCode: providerProfile?.postalCode || '',
        description: providerProfile?.description || '',
        website: providerProfile?.website || '',
        country: providerProfile?.country || '',
        timezone: providerProfile?.timezone || userProfile?.timezone || '',
        profilePicture: providerProfile?.logo || userProfile?.profileImage || ''
      });

      // Set notification preferences from API (default to false)
      setNotificationData({
        emailNotifications: false,
        smsNotifications: false,
        bookingAlerts: false,
        marketingEmails: false,
        weeklyReports: false
      });

      // Set security data from API (default values)
      setSecurityData(prev => ({
        ...prev,
        twoFactorEnabled: false,
        lastPasswordChange: '',
        loginAlerts: true
      }));
    }
  }, [userProfile, providerProfile]);

  // Image upload handlers
  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if provider profile exists
    if (!providerProfile) {
      toast.error('Please create your provider profile first by saving your information');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    try {
      const result = await uploadLogo(file).unwrap();
      toast.success('Logo uploaded successfully!');
      refetchProvider(); // Refresh provider data
    } catch (error: any) {
      console.error('Logo upload failed:', error);
      toast.error(error?.data?.message || 'Failed to upload logo');
    }
  };

  const handleCoverUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if provider profile exists
    if (!providerProfile) {
      toast.error('Please create your provider profile first by saving your information');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    try {
      const result = await uploadCover(file).unwrap();
      toast.success('Cover image uploaded successfully!');
      refetchProvider(); // Refresh provider data
    } catch (error: any) {
      console.error('Cover upload failed:', error);
      toast.error(error?.data?.message || 'Failed to upload cover image');
    }
  };

  const handleRemoveLogo = async () => {
    try {
      await removeLogo().unwrap();
      toast.success('Logo removed successfully!');
      refetchProvider();
    } catch (error: any) {
      console.error('Remove logo failed:', error);
      toast.error(error?.data?.message || 'Failed to remove logo');
    }
  };

  const handleRemoveCover = async () => {
    try {
      await removeCover().unwrap();
      toast.success('Cover image removed successfully!');
      refetchProvider();
    } catch (error: any) {
      console.error('Remove cover failed:', error);
      toast.error(error?.data?.message || 'Failed to remove cover image');
    }
  };

  // Test function to manually trigger API call
  const testApiCall = async () => {
    try {
      console.log('=== MANUAL API TEST ===')
      const userResult = await refetchProfile()
      const providerResult = await refetchProvider()
      console.log('User API refetch result:', userResult)
      console.log('Provider API refetch result:', providerResult)
    } catch (error) {
      console.error('Manual API test failed:', error)
    }
  }; 

  const settingSections = [
    { id: 'profile', label: 'Profile Settings', icon: User },
    { id: 'account', label: 'Account & Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell }
  ];

  // Create provider profile
  const handleCreateProvider = async () => {
    try {
      const createData: any = {
        businessName: profileData.businessName || `${userProfile?.firstName || ''} ${userProfile?.lastName || ''}`.trim(),
        providerType: 'individual' as const,
        description: profileData.description || '',
        address: profileData.address || 'Not specified',
        city: profileData.city || 'Not specified',
        country: profileData.country || 'United Arab Emirates',
        postalCode: profileData.postalCode || '00000',
        timezone: profileData.timezone || '',
        phone: profileData.phone || '',
      };

      // Only include website if it's a valid URL
      if (profileData.website && profileData.website.trim() !== '') {
        try {
          new URL(profileData.website);
          createData.website = profileData.website;
        } catch {
          // Invalid URL, don't include it
          console.log('Invalid website URL, excluding from provider creation');
        }
      }

      await createProvider(createData).unwrap();
      toast.success('Provider profile created successfully!');
      refetchProvider();
    } catch (error: any) {
      console.error('❌ Error creating provider:', error);
      toast.error(error?.data?.message || 'Failed to create provider profile');
    }
  };

  // Save functions using RTK Query
  const handleSaveProfile = async () => {
    try {
      console.log('💾 Provider Settings: Saving profile data...');
      
      // Validate form before submission
      const websiteError = validateWebsite(profileData.website);
      if (websiteError) {
        setValidationErrors(prev => ({ ...prev, website: websiteError }));
        toast.error('Please fix validation errors before saving');
        return;
      }
      
      // Update user profile (email is not allowed to be updated via this endpoint)
      const userUpdateData = {
        firstName: profileData.ownerName.split(' ')[0] || '',
        lastName: profileData.ownerName.split(' ').slice(1).join(' ') || '',
        phone: profileData.phone,
        timezone: profileData.timezone,
      };

      // Update user profile first
      await updateProfile(userUpdateData).unwrap();
      
      // Update or create provider profile
      if (providerProfile) {
        // Update existing provider
        const providerUpdateData: any = {
          businessName: profileData.businessName,
          description: profileData.description,
          address: profileData.address,
          city: profileData.city,
          postalCode: profileData.postalCode,
          timezone: profileData.timezone,
          phone: profileData.phone,
          country: profileData.country,
        };

        // Only include website if it's a valid URL
        if (profileData.website && profileData.website.trim() !== '') {
          try {
            new URL(profileData.website);
            providerUpdateData.website = profileData.website;
          } catch {
            // Invalid URL, don't include it
            console.log('Invalid website URL, excluding from provider update');
          }
        }
        await updateProvider(providerUpdateData).unwrap();
      } else {
        // Create new provider profile
        await handleCreateProvider();
      }
      
      console.log('✅ Provider Settings: Profile updated successfully');
      toast.success('Profile updated successfully!');
      setShowSaveSuccess(true);
      setTimeout(() => setShowSaveSuccess(false), 3000);
      
      // Refetch profile data to ensure UI is up to date
      refetchProfile();
      refetchProvider();
      
    } catch (error: any) {
      console.error('❌ Provider Settings: Error saving profile:', error);
      const errorMessage = error?.data?.message || 'Failed to save profile. Please try again.';
      toast.error(errorMessage);
    }
  };

  const handleSave = () => {
    switch (activeSection) {
      case 'profile':
        handleSaveProfile();
        break;
      default:
        toast.success('Settings saved successfully!');
        setShowSaveSuccess(true);
        setTimeout(() => setShowSaveSuccess(false), 3000);
        break;
    }
  };

  // --- Render Profile Settings (Optimized for Mobile) ---
  const renderProfileSettings = () => (
    <div className="space-y-6">
      {/* Business Logo */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Logo</h3>
        <div className={`flex ${isMobile ? 'flex-col items-start gap-4' : 'flex-row items-center gap-5'}`}>
          {providerProfile?.logo ? (
            <img 
              src={providerProfile.logo} 
              alt="Business Logo"
              className={`${isMobile ? 'w-16 h-16' : 'w-20 h-20'} rounded-lg object-cover border border-gray-200`}
            />
          ) : (
            <div className={`${isMobile ? 'w-16 h-16' : 'w-20 h-20'} rounded-lg bg-slate-100 flex items-center justify-center ${isMobile ? 'text-lg' : 'text-xl'} font-semibold text-slate-500 border border-gray-200`}>
              {providerProfile?.businessName?.charAt(0)?.toUpperCase() || userProfile?.firstName?.charAt(0)?.toUpperCase() || 'B'}
            </div>
          )}
          <div>
            <div className="flex gap-3 mb-2">
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
              <button 
                onClick={() => logoInputRef.current?.click()}
                disabled={uploadLogoLoading}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg border-none text-sm font-medium cursor-pointer disabled:opacity-50 flex items-center gap-2 hover:bg-blue-700 transition-colors"
              >
                {uploadLogoLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    Upload Logo
                  </>
                )}
              </button>
              {providerProfile?.logo && (
                <button 
                  onClick={handleRemoveLogo}
                  className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Remove
                </button>
              )}
            </div>
            <p className="text-xs text-gray-500">JPG, PNG up to 5MB</p>
          </div>
        </div>
      </div>

      {/* Cover Image */}
      <div className={`bg-white rounded-xl border border-slate-200 ${isMobile ? 'p-4' : 'p-6'}`}>
        <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold text-slate-800 mb-4`}>
          Cover Image
        </h3>
        <div className="space-y-4">
          {providerProfile?.coverImage ? (
            <div className="relative">
              <img 
                src={providerProfile.coverImage} 
                alt="Cover"
                className="w-full h-32 rounded-lg object-cover border border-gray-200"
              />
              <button 
                onClick={handleRemoveCover}
                className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="w-full h-32 rounded-lg bg-slate-100 flex items-center justify-center border border-gray-200 border-dashed">
              <div className="text-center text-slate-500">
                <Camera className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">No cover image uploaded</p>
              </div>
            </div>
          )}
          <div className="flex gap-3">
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              onChange={handleCoverUpload}
              className="hidden"
            />
            <button 
              onClick={() => coverInputRef.current?.click()}
              disabled={uploadCoverLoading}
              className="bg-green-500 text-white px-4 py-2 rounded-md border-none text-sm font-medium cursor-pointer disabled:opacity-50 flex items-center gap-2"
            >
              {uploadCoverLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Upload Cover
                </>
              )}
            </button>
          </div>
          <p className="text-xs text-gray-500">Recommended: 1200x400px, JPG or PNG up to 5MB</p>
        </div>
      </div>

      {/* Personal Information */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-5">
          Personal Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name *
            </label>
            <input
              type="text"
              value={userProfile?.firstName || ''}
              onChange={(e) => setProfileData(prev => ({ 
                ...prev, 
                ownerName: `${e.target.value} ${userProfile?.lastName || ''}`
              }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter first name"
            />
          </div>
          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name *
            </label>
            <input
              type="text"
              value={userProfile?.lastName || ''}
              onChange={(e) => setProfileData(prev => ({ 
                ...prev, 
                ownerName: `${userProfile?.firstName || ''} ${e.target.value}`
              }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter last name"
            />
          </div>
          {/* Business Name - always span full width */}
          <div className={isMobile ? 'col-span-1' : 'col-span-2'}> 
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Name
            </label>
            <input
              type="text"
              value={profileData.businessName}
              onChange={(e) => setProfileData(prev => ({ ...prev, businessName: e.target.value }))}
              className={`w-full ${isMobile ? 'px-2.5 py-2' : 'px-3 py-2.5'} rounded-md border border-slate-200 text-sm outline-none`}
              placeholder="Enter business name"
            />
          </div>
          {/* Bio - always span full width */}
          <div className={isMobile ? 'col-span-1' : 'col-span-2'}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio
            </label>
            <textarea
              value={profileData.description}
              onChange={(e) => setProfileData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              className={`w-full ${isMobile ? 'px-2.5 py-2' : 'px-3 py-2.5'} rounded-md border border-slate-200 text-sm resize-y outline-none font-inherit`}
              placeholder="Tell us about yourself and your business..."
            />
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className={`bg-white rounded-xl border border-slate-200 ${isMobile ? 'p-4' : 'p-6'}`}>
        <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold text-slate-800 mb-5`}>
          Contact Information
        </h3>
        {/* Change grid to single column on mobile */}
        <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-5`}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
              <span className="text-xs text-gray-500 ml-1">(Cannot be changed)</span>
            </label>
            <input
              type="email"
              value={profileData.email}
              readOnly
              className={`w-full ${isMobile ? 'px-2.5 py-2' : 'px-3 py-2.5'} rounded-md border border-slate-200 text-sm outline-none bg-gray-50 cursor-not-allowed`}
              placeholder="Enter email address"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={profileData.phone}
              onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
              className={`w-full ${isMobile ? 'px-2.5 py-2' : 'px-3 py-2.5'} rounded-md border border-slate-200 text-sm outline-none`}
              placeholder="Enter phone number"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Street Address
            </label>
            <input
              type="text"
              value={profileData.address}
              onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
              className={`w-full ${isMobile ? 'px-2.5 py-2' : 'px-3 py-2.5'} rounded-md border border-slate-200 text-sm outline-none`}
              placeholder="Enter street address"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City
            </label>
            <input
              type="text"
              value={profileData.city}
              onChange={(e) => setProfileData(prev => ({ ...prev, city: e.target.value }))}
              className={`w-full ${isMobile ? 'px-2.5 py-2' : 'px-3 py-2.5'} rounded-md border border-slate-200 text-sm outline-none`}
              placeholder="Enter city"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Postal Code
            </label>
            <input
              type="text"
              value={profileData.postalCode}
              onChange={(e) => setProfileData(prev => ({ ...prev, postalCode: e.target.value }))}
              className={`w-full ${isMobile ? 'px-2.5 py-2' : 'px-3 py-2.5'} rounded-md border border-slate-200 text-sm outline-none`}
              placeholder="Enter postal code"
              maxLength={20}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Country
            </label>
            <input
              type="text"
              value={profileData.country}
              onChange={(e) => setProfileData(prev => ({ ...prev, country: e.target.value }))}
              className={`w-full ${isMobile ? 'px-2.5 py-2' : 'px-3 py-2.5'} rounded-md border border-slate-200 text-sm outline-none`}
              placeholder="Enter country"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Website
              <span className="text-xs text-gray-500 ml-1">(Optional)</span>
            </label>
            <input
              type="url"
              value={profileData.website}
              onChange={(e) => {
                const newWebsite = e.target.value;
                setProfileData(prev => ({ ...prev, website: newWebsite }));
                setValidationErrors(prev => ({
                  ...prev,
                  website: validateWebsite(newWebsite)
                }));
              }}
              className={`w-full ${isMobile ? 'px-2.5 py-2' : 'px-3 py-2.5'} rounded-md border ${
                validationErrors.website ? 'border-red-300' : 'border-slate-200'
              } text-sm outline-none ${validationErrors.website ? 'focus:border-red-500' : ''}`}
              placeholder="https://example.com"
            />
            {validationErrors.website && (
              <p className="mt-1 text-xs text-red-600">{validationErrors.website}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time Zone
            </label>
            <select
              value={profileData.timezone}
              onChange={(e) => setProfileData(prev => ({ ...prev, timezone: e.target.value }))}
              className={`w-full ${isMobile ? 'px-2.5 py-2' : 'px-3 py-2.5'} rounded-md border border-slate-200 text-sm outline-none`}
            >
              <option value="">Select timezone...</option>
              <option value="America/New_York">Eastern Time (ET)</option>
              <option value="America/Chicago">Central Time (CT)</option>
              <option value="America/Denver">Mountain Time (MT)</option>
              <option value="America/Los_Angeles">Pacific Time (PT)</option>
              <option value="Europe/London">London (GMT)</option>
              <option value="Europe/Paris">Paris (CET)</option>
              <option value="Europe/Berlin">Berlin (CET)</option>
              <option value="Asia/Dubai">Dubai (GST)</option>
              <option value="Asia/Kolkata">India (IST)</option>
              <option value="Asia/Tokyo">Tokyo (JST)</option>
              <option value="Australia/Sydney">Sydney (AEST)</option>
              <option value="Pacific/Auckland">Auckland (NZST)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  // --- Render Account Settings (Optimized for Mobile) ---
  const renderAccountSettings = () => (
    <div className="flex flex-col gap-6">
      <h2 className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold text-slate-800 m-0`}>
        Account & Security
      </h2>

      {/* Password */}
      <div className={`bg-white rounded-xl border border-slate-200 ${isMobile ? 'p-4' : 'p-6'}`}>
        <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold text-slate-800 mb-4`}>
          Password
        </h3>
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Password
            </label>
            <input
              type="password"
              className={`w-full ${isMobile ? 'px-2.5 py-2' : 'px-3 py-2.5'} rounded-md border border-slate-200 text-sm outline-none`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <input
              type="password"
              className={`w-full ${isMobile ? 'px-2.5 py-2' : 'px-3 py-2.5'} rounded-md border border-slate-200 text-sm outline-none`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              className={`w-full ${isMobile ? 'px-2.5 py-2' : 'px-3 py-2.5'} rounded-md border border-slate-200 text-sm outline-none`}
            />
          </div>
          <button className="bg-green-500 text-white px-5 py-2.5 rounded-md border-0 text-sm font-semibold cursor-var-pointer self-start">
            Update Password
          </button>
        </div>
      </div>

      {/* Two-Factor Authentication */}
      <div className={`bg-white rounded-xl border border-slate-200 ${isMobile ? 'p-4' : 'p-6'}`}>
        <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold text-slate-800 mb-4`}>
          Two-Factor Authentication
        </h3>
        {/* Adjust layout for mobile */}
        <div className={`flex ${isMobile ? 'flex-col items-start gap-4' : 'flex-row justify-between items-center'}`}>
          <div>
            <p className="text-sm text-gray-700 m-0 mb-1">
              Add an extra layer of security to your account
            </p>
            <p className="text-xs text-slate-500 m-0">
              Status: <span className="text-red-500 font-medium">Disabled</span>
            </p>
          </div>
          <button className={`bg-green-500 text-white px-5 py-2.5 rounded-md border-0 text-sm font-semibold cursor-var-pointer ${isMobile ? 'w-full' : 'w-auto'}`}>
            Enable 2FA
          </button>
        </div>
      </div>

      {/* Active Sessions */}
      <div className={`bg-white rounded-xl border border-slate-200 ${isMobile ? 'p-4' : 'p-6'}`}>
        <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold text-slate-800 mb-4`}>
          Active Sessions
        </h3>
        <div className="flex flex-col gap-3">
          <div className={`flex ${isMobile ? 'flex-col items-start gap-2' : 'flex-row justify-between items-center'} p-3 bg-slate-50 rounded-md`}>
            <div>
              <div className="text-sm font-medium text-slate-800">
                💻 Desktop - Chrome (Current)
              </div>
              <div className="text-xs text-slate-500">
                New York, USA • 2 minutes ago
              </div>
            </div>
            <span className="bg-green-100 text-green-600 px-2 py-0.5 rounded-xl text-xs font-medium">
              Current
            </span>
          </div>
          <div className={`flex ${isMobile ? 'flex-col items-start gap-2' : 'flex-row justify-between items-center'} p-3 bg-slate-50 rounded-md`}>
            <div>
              <div className="text-sm font-medium text-slate-800">
                📱 Mobile - Safari
              </div>
              <div className="text-xs text-slate-500">
                New York, USA • 2 hours ago
              </div>
            </div>
            <button className="bg-red-100 text-red-600 px-2 py-1 rounded border-0 text-xs cursor-var-pointer">
              End Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // --- Render Notification Settings (Optimized for Mobile) ---
  const renderNotificationSettings = () => (
    <div className="flex flex-col gap-6">
      <h2 className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold text-slate-800 m-0`}>
        Notification Preferences
      </h2>

      {/* Email Notifications */}
      <div className={`bg-white rounded-xl border border-slate-200 ${isMobile ? 'p-4' : 'p-6'}`}>
        <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold text-slate-800 mb-5`}>
          Email Notifications
        </h3>
        <div className="flex flex-col gap-4">
          {[
            { id: 'orders', label: 'New Orders', description: 'Get notified when you receive new orders' },
            { id: 'messages', label: 'Messages', description: 'Get notified when clients send you messages' },
            { id: 'reviews', label: 'Reviews', description: 'Get notified when you receive new reviews' },
            { id: 'payments', label: 'Payments', description: 'Get notified about payment confirmations' },
            { id: 'marketing', label: 'Marketing Updates', description: 'Receive tips and platform updates' }
          ].map(item => (
            <div key={item.id} className={`flex ${isMobile ? 'flex-col items-start gap-2' : 'flex-row justify-between items-center'}`}>
              <div>
                <div className="text-sm font-medium text-slate-800">
                  {item.label}
                </div>
                <div className="text-xs text-slate-500">
                  {item.description}
                </div>
              </div>
              <label className="flex items-center cursor-var-pointer">
                <input type="checkbox" defaultChecked className="mr-2 hidden" />
                {/* Custom Toggle Switch for better mobile experience */}
                <div className="w-10 h-5 rounded-full bg-green-500 relative">
                  <div className="w-4 h-4 rounded-full bg-white absolute top-0.5 right-0.5 transition-all duration-200"></div>
                </div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Push Notifications */}
      <div className={`bg-white rounded-xl border border-slate-200 ${isMobile ? 'p-4' : 'p-6'}`}>
        <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold text-slate-800 mb-5`}>
          Push Notifications
        </h3>
        {/* Adjust layout for mobile */}
        <div className={`flex ${isMobile ? 'flex-col items-start gap-4' : 'flex-row justify-between items-center'}`}>
          <div>
            <div className="text-sm font-medium text-slate-800">
              Browser Push Notifications
            </div>
            <div className="text-xs text-slate-500">
              Receive real-time notifications in your browser
            </div>
          </div>
          <button className={`bg-green-500 text-white px-4 py-2 rounded-md border-0 text-sm font-medium cursor-var-pointer ${isMobile ? 'w-full' : 'w-auto'}`}>
            Enable
          </button>
        </div>
      </div>
    </div>
  );

  // --- Main Render Section logic ---
  const renderSection = () => {
    switch(activeSection) {
      case 'profile': return renderProfileSettings();
      case 'account': return renderAccountSettings();
      case 'notifications': return renderNotificationSettings();
      default: 
        return (
          <div className="text-center p-15 bg-white rounded-xl border border-slate-200">
            <div className="text-5xl mb-4">🚧</div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              Coming Soon
            </h3>
            <p className="text-slate-500">
              This section is under development and will be available soon.
            </p>
          </div>
        );
    }
  };

  // Loading state
  if (profileLoading || providerLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Settings</h2>
          <p className="text-gray-600">Fetching your profile data from API...</p>
        </div>
      </div>
    );
  }

  // Error state - only show if user profile fails (provider profile might not exist yet)
  if (profileError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Profile</h2>
          <p className="text-gray-600 mb-4">Failed to load your profile data from the API.</p>
          <button
            onClick={refetchProfile}
            className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            <RefreshCw className="h-4 w-4 inline mr-2" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header matching onboarding style */}
      <div className="py-8 px-4">
        <div className="max-w-4xl mx-auto text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Provider Settings</h1>
          <p className="text-gray-600">Manage your business profile and account settings</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4">

        {/* Navigation Tabs - Onboarding Style */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg shadow-lg p-2 flex space-x-2">
            {settingSections.map(section => {
              const IconComponent = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg text-sm font-medium transition-all ${
                    activeSection === section.id
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
                  }`}
                >
                  <IconComponent className="h-4 w-4" />
                  <span className={isMobile ? 'hidden' : 'inline'}>{section.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Settings Content - Onboarding Card Style */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">{
              activeSection === 'profile' ? 'Profile Settings' :
              activeSection === 'account' ? 'Account & Security' :
              activeSection === 'notifications' ? 'Notification Preferences' : 'Settings'
            }</h2>
            <div className="text-sm text-gray-500 mt-1">
              {activeSection === 'profile' ? 'Manage your business profile and contact information' :
               activeSection === 'account' ? 'Update your password and security settings' :
               activeSection === 'notifications' ? 'Configure your notification preferences' : 'Manage your settings'}
            </div>
          </div>

          {/* Provider Setup Notice */}
          {!providerProfile && !providerLoading && activeSection === 'profile' && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
              <p className="text-orange-800">
                🚀 <strong>Complete Your Provider Setup:</strong> Fill in your business information and click "Save Changes" to create your provider profile.
              </p>
            </div>
          )}

          {profileError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800">
                ❌ <strong>Profile Loading Error:</strong> Failed to load profile data. Please try again.
              </p>
            </div>
          )}

          {showSaveSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-green-800">✅ Settings saved successfully!</p>
            </div>
          )}

          {renderSection()}
        </div>

        {/* Navigation Buttons - Onboarding Style */}
        <div className="flex justify-between items-center">
          <button
            onClick={refetchProfile}
            className="flex items-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Data
          </button>

          <button
            onClick={handleSave}
            disabled={updateLoading || updateProviderLoading || createProviderLoading || validationErrors.website !== ''}
            className="flex items-center px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {(updateLoading || updateProviderLoading || createProviderLoading) ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;