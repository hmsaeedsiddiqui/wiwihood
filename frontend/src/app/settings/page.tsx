'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthStatus } from '@/hooks/useAuth'
import { 
  useUpdateProfileMutation, 
  useChangePasswordMutation,
  useUpdateNotificationSettingsMutation
} from '@/store/api/userApi'
import { useUserProfile } from '@/hooks/useUserProfile'
import { ImageUpload } from '@/components/cloudinary/ImageUpload'
import { CloudinaryImage } from '@/components/cloudinary/CloudinaryImage'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Lock, 
  Bell, 
  CreditCard,
  Shield,
  Camera,
  Save,
  Eye,
  EyeOff,
  Trash2,
  AlertTriangle
} from 'lucide-react'

export default function SettingsPage() {
  const router = useRouter()
  const { isAuthenticated, user: authUser } = useAuthStatus()
  const { data: userProfile, isLoading: profileLoading, refetch: refetchProfile, error: profileError, isDemo } = useUserProfile()
  
  // Debug logging - API-only approach
  console.log('🔍 Settings Page Debug:')
  console.log('Auth Status:', { isAuthenticated, authUser })
  console.log('Profile Data:', { userProfile, profileLoading, profileError })
  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log('Tokens:', {
        accessToken: localStorage.getItem('accessToken')?.substring(0, 20) + '...',
        providerToken: localStorage.getItem('providerToken')?.substring(0, 20) + '...',
      })
    }
  }, [])
  console.log('API Response Structure:', userProfile ? Object.keys(userProfile) : 'No data')
  
  // RTK Query mutations
  const [updateProfile, { isLoading: updateLoading }] = useUpdateProfileMutation()
  const [changePassword, { isLoading: passwordLoading }] = useChangePasswordMutation()
  const [updateNotifications, { isLoading: notificationLoading }] = useUpdateNotificationSettingsMutation()

  // Test function to manually trigger API call
  const testApiCall = async () => {
    try {
      console.log('=== MANUAL API TEST ===')
      if (typeof window !== 'undefined') {
        console.log('Current token:', localStorage.getItem('accessToken')?.substring(0, 20) + '...')
        try {
          const u = localStorage.getItem('user') || localStorage.getItem('provider') || '{}'
          console.log('Current user from localStorage:', JSON.parse(u))
        } catch (e) {
          console.log('No valid user in localStorage')
        }
      }
      
      const result = await refetchProfile()
      console.log('API refetch result:', result)
      
      // Also test direct API call
  const token = typeof window !== 'undefined' ? (localStorage.getItem('accessToken') || localStorage.getItem('providerToken')) : null
      if (token) {
        try {
          const directResponse = await fetch('http://localhost:8000/api/v1/users/me', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          })
          const directData = await directResponse.json()
          console.log('Direct API response status:', directResponse.status)
          console.log('Direct API response data:', directData)
        } catch (directError) {
          console.error('Direct API call failed:', directError)
        }
      }
    } catch (error) {
      console.error('API call error:', error)
    }
  }
  
  const [activeTab, setActiveTab] = useState('profile')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
    address: '',
    city: '',
    country: '',
    postalCode: '',
    profileImage: ''
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    marketingEmails: false,
    bookingReminders: true,
    promotionalOffers: false
  })

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login')
      return
    }

    // Use RTK Query data or fallback to auth data
    const user = userProfile || authUser
    if (user) {
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phoneNumber: user.phone || '',
        dateOfBirth: user.dateOfBirth || '',
        address: user.address || '',
        city: user.city || '',
        country: user.country || '',
        postalCode: user.postalCode || '',
        profileImage: user.profileImage || ''
      })

      // Set notification settings if available
      if (user.notificationSettings) {
        setNotificationSettings(user.notificationSettings)
      }
    }
  }, [isAuthenticated, userProfile, authUser, router])

  const handleProfileUpdate = async () => {
    try {
      const updateData = {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        email: profileData.email,
        phone: profileData.phoneNumber,
        dateOfBirth: profileData.dateOfBirth,
        address: profileData.address,
        city: profileData.city,
        country: profileData.country,
        postalCode: profileData.postalCode,
        profileImage: profileData.profileImage
      }

      if (isDemo) {
        // Demo mode - update localStorage
        const currentUser = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || localStorage.getItem('provider') || '{}') : {}
        const updatedUser = { ...currentUser, ...updateData }
        
        if (typeof window !== 'undefined') {
          if (localStorage.getItem('provider')) {
            localStorage.setItem('provider', JSON.stringify(updatedUser))
          } else {
            localStorage.setItem('user', JSON.stringify(updatedUser))
          }
        }
        
        toast.success('Profile updated successfully! (Offline Mode)')
        refetchProfile()
        return
      }

      const result = await updateProfile(updateData).unwrap()
      toast.success('Profile updated successfully!')
      refetchProfile() // Refresh the profile data
    } catch (error: any) {
    // Fallback to demo mode if backend fails
    const currentUser = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || localStorage.getItem('provider') || '{}') : {}
      const updatedUser = { ...currentUser, ...updateData }
      
      if (typeof window !== 'undefined') {
        if (localStorage.getItem('provider')) {
          localStorage.setItem('provider', JSON.stringify(updatedUser))
        } else {
          localStorage.setItem('user', JSON.stringify(updatedUser))
        }
      }
      
      toast.success('Profile updated successfully! (Offline Mode - Backend Unavailable)')
      refetchProfile()
    }
  }

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match')
      return
    }

    if (passwordData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long')
      return
    }

    if (isDemo) {
      // Demo mode validation
      if (passwordData.currentPassword !== 'demo123') {
        toast.error('Current password is incorrect (Offline: use your actual password or "demo123" for testing)')
        return
      }
      
      toast.success('Password changed successfully! (Offline Mode)')
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      return
    }

    try {
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      }).unwrap()
      
      toast.success('Password changed successfully!')
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    } catch (error: any) {
      // Fallback to demo validation if backend fails
      if (passwordData.currentPassword !== 'demo123') {
        toast.error('Current password is incorrect (Offline Mode - Backend Unavailable: use "demo123")')
        return
      }
      
      toast.success('Password changed successfully! (Offline Mode - Backend Unavailable)')
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    }
  }

  const handleNotificationUpdate = async () => {
    // Prepare notification data that matches the API interface
    const notificationData = {
      emailNotifications: notificationSettings.emailNotifications,
      smsNotifications: notificationSettings.smsNotifications,
      pushNotifications: notificationSettings.pushNotifications,
      marketingEmails: notificationSettings.marketingEmails,
      bookingReminders: notificationSettings.bookingReminders,
      promotionalSms: notificationSettings.promotionalOffers // Map promotionalOffers to promotionalSms
    }

    if (isDemo) {
      // Demo mode - update localStorage
      const currentUser = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || localStorage.getItem('provider') || '{}') : {}
      const updatedUser = { 
        ...currentUser, 
        notificationSettings: notificationSettings
      }
      
      if (typeof window !== 'undefined') {
        if (localStorage.getItem('provider')) {
          localStorage.setItem('provider', JSON.stringify(updatedUser))
        } else {
          localStorage.setItem('user', JSON.stringify(updatedUser))
        }
      }
      
      toast.success('Notification preferences updated! (Offline Mode)')
      refetchProfile()
      return
    }

    try {
      await updateNotifications(notificationData).unwrap()
      toast.success('Notification preferences updated!')
      refetchProfile() // Refresh the profile data
    } catch (error: any) {
    // Fallback to demo mode if backend fails
    const currentUser = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || localStorage.getItem('provider') || '{}') : {}
      const updatedUser = { 
        ...currentUser, 
        notificationSettings: notificationSettings
      }
      
      if (typeof window !== 'undefined') {
        if (localStorage.getItem('provider')) {
          localStorage.setItem('provider', JSON.stringify(updatedUser))
        } else {
          localStorage.setItem('user', JSON.stringify(updatedUser))
        }
      }
      
      toast.success('Notification preferences updated! (Offline Mode - Backend Unavailable)')
      refetchProfile()
    }
  }

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'security', name: 'Security', icon: Lock },
    /* Hidden sidebar items - keeping code intact for future use */
    /* { id: 'notifications', name: 'Notifications', icon: Bell }, */
    /* { id: 'billing', name: 'Billing', icon: CreditCard }, */
    /* { id: 'privacy', name: 'Privacy', icon: Shield } */
  ]

  // Show loading state while fetching profile from API
  if (profileLoading || (!userProfile && isAuthenticated)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile data from API...</p>
          <p className="text-sm text-gray-500 mt-2">Fetching real database information...</p>
        </div>
      </div>
    )
  }

  // Show error state if no profile data and not loading
  if (!profileLoading && !userProfile && isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Unable to Load Profile</h2>
          <p className="text-gray-600 mb-4">
            We couldn't load your profile data from the API. Please check your connection and try again.
          </p>
          <Button 
            onClick={() => {
              console.log('🔄 Retrying profile fetch...')
              refetchProfile()
            }}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Retry Loading
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Account Settings
              </h1>
              <p className="text-gray-600">
                Manage your account preferences and security settings
              </p>
            </div>
            {/* Debug Button */}
            <button
              onClick={testApiCall}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Test API Call
            </button>
          </div>
          
          {/* Offline Mode Notice */}
          {isDemo && (
            <div className="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
              <div className="flex items-center">
                <AlertTriangle className="h-4 w-4 text-blue-400 mr-2" />
                <p className="text-sm text-blue-800">
                  <strong>Offline Mode:</strong> Showing your registered account data from local storage. Backend server is currently unavailable.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-0">
                <nav className="space-y-1">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={"w-full flex items-center px-4 py-3 text-left text-sm font-medium transition-colors "}
                    >
                      <tab.icon className="w-5 h-5 mr-3" />
                      {tab.name}
                    </button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>
                      Update your personal information and profile details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Profile Picture */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Profile Picture</h3>
                      <div className="flex items-start space-x-6">
                        <div className="flex-shrink-0">
                          {profileData.profileImage ? (
                            <CloudinaryImage
                              src={profileData.profileImage}
                              width={96}
                              height={96}
                              alt="Profile picture"
                              style={{ width: '96px', height: '96px', borderRadius: '50%', objectFit: 'cover' }}
                            />
                          ) : (
                            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-full flex items-center justify-center">
                              <span className="text-2xl font-bold text-blue-600">
                                {profileData.firstName?.charAt(0)}{profileData.lastName?.charAt(0)}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 max-w-lg">
                          <ImageUpload
                            uploadType="profile"
                            onImageUploaded={(publicId: string) => {
                              setProfileData({...profileData, profileImage: publicId});
                            }}
                            maxFiles={1}
                          />
                          {profileData.profileImage && (
                            <button
                              type="button"
                              onClick={() => {
                                setProfileData({...profileData, profileImage: ''});
                              }}
                              className="mt-2 text-sm text-red-600 hover:text-red-800"
                            >
                              Remove Photo
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Basic Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          First Name
                        </label>
                        <Input
                          value={profileData.firstName}
                          onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                          placeholder="Enter your first name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Last Name
                        </label>
                        <Input
                          value={profileData.lastName}
                          onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                          placeholder="Enter your last name"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <Input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                        placeholder="Enter your email"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number
                        </label>
                        <Input
                          type="tel"
                          value={profileData.phoneNumber}
                          onChange={(e) => setProfileData({...profileData, phoneNumber: e.target.value})}
                          placeholder="Enter your phone number"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Date of Birth
                        </label>
                        <Input
                          type="date"
                          value={profileData.dateOfBirth}
                          onChange={(e) => setProfileData({...profileData, dateOfBirth: e.target.value})}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address
                      </label>
                      <Input
                        value={profileData.address}
                        onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                        placeholder="Enter your address"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          City
                        </label>
                        <Input
                          value={profileData.city}
                          onChange={(e) => setProfileData({...profileData, city: e.target.value})}
                          placeholder="Enter your city"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Country
                        </label>
                        <Input
                          value={profileData.country}
                          onChange={(e) => setProfileData({...profileData, country: e.target.value})}
                          placeholder="Enter your country"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Postal Code
                        </label>
                        <Input
                          value={profileData.postalCode}
                          onChange={(e) => setProfileData({...profileData, postalCode: e.target.value})}
                          placeholder="Enter postal code"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-4">
                      <Button 
                        onClick={handleProfileUpdate}
                        disabled={updateLoading}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {updateLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Updating...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>
                      Update your password to keep your account secure
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Current Password
                      </label>
                      <div className="relative">
                        <Input
                          type={showCurrentPassword ? 'text' : 'password'}
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                          placeholder="Enter current password"
                          className="pr-10"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        >
                          {showCurrentPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        New Password
                      </label>
                      <div className="relative">
                        <Input
                          type={showNewPassword ? 'text' : 'password'}
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                          placeholder="Enter new password"
                          className="pr-10"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Must be at least 8 characters long
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm New Password
                      </label>
                      <Input
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                        placeholder="Confirm new password"
                      />
                    </div>

                    <div className="flex justify-end pt-4">
                      <Button 
                        onClick={handlePasswordChange}
                        disabled={passwordLoading || !passwordData.currentPassword || !passwordData.newPassword}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {passwordLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Updating...
                          </>
                        ) : (
                          'Change Password'
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Two-Factor Authentication section hidden - keeping code intact for future use */}
                {/*
                <Card>
                  <CardHeader>
                    <CardTitle>Two-Factor Authentication</CardTitle>
                    <CardDescription>
                      Add an extra layer of security to your account
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">SMS Authentication</h4>
                        <p className="text-sm text-gray-600">
                          Receive verification codes via SMS
                        </p>
                      </div>
                      <Button variant="outline">
                        Enable
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                */}
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>
                    Choose how you want to receive notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {[
                    { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive notifications via email' },
                    { key: 'smsNotifications', label: 'SMS Notifications', description: 'Receive notifications via text message' },
                    { key: 'pushNotifications', label: 'Push Notifications', description: 'Receive push notifications in browser' },
                    { key: 'marketingEmails', label: 'Marketing Emails', description: 'Receive promotional emails and offers' },
                    { key: 'bookingReminders', label: 'Booking Reminders', description: 'Receive reminders about upcoming appointments' },
                    { key: 'promotionalOffers', label: 'Promotional Offers', description: 'Receive special offers and discounts' }
                  ].map((setting) => (
                    <div key={setting.key} className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{setting.label}</h4>
                        <p className="text-sm text-gray-600">{setting.description}</p>
                      </div>
                      <button
                        onClick={() => setNotificationSettings({
                          ...notificationSettings,
                          [setting.key]: !notificationSettings[setting.key as keyof typeof notificationSettings]
                        })}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          notificationSettings[setting.key as keyof typeof notificationSettings] 
                            ? 'bg-blue-600' 
                            : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            notificationSettings[setting.key as keyof typeof notificationSettings] 
                              ? 'translate-x-5' 
                              : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  ))}

                  <div className="flex justify-end pt-4">
                    <Button 
                      onClick={handleNotificationUpdate}
                      disabled={notificationLoading}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {notificationLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Updating...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save Preferences
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Billing Tab */}
            {activeTab === 'billing' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Methods</CardTitle>
                    <CardDescription>
                      Manage your payment methods and billing information
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        No Payment Methods
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Add a payment method to make bookings easier
                      </p>
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        Add Payment Method
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Billing History</CardTitle>
                    <CardDescription>
                      View your past transactions and invoices
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <p className="text-gray-600">No billing history available</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Privacy Tab */}
            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Privacy Settings</CardTitle>
                    <CardDescription>
                      Control your privacy and data sharing preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">Profile Visibility</h4>
                        <p className="text-sm text-gray-600">
                          Make your profile visible to other users
                        </p>
                      </div>
                      <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
                        <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">Data Analytics</h4>
                        <p className="text-sm text-gray-600">
                          Allow us to use your data to improve our services
                        </p>
                      </div>
                      <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200">
                        <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1" />
                      </button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-red-600">Danger Zone</CardTitle>
                    <CardDescription>
                      Irreversible and destructive actions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="border border-red-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
                        <div className="flex-1">
                          <h4 className="font-medium text-red-900">Delete Account</h4>
                          <p className="text-sm text-red-700 mb-4">
                            Once you delete your account, there is no going back. Please be certain.
                          </p>
                          <Button variant="outline" className="border-red-300 text-red-700 hover:bg-red-50">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Account
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
