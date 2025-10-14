import React from 'react'
import  { useAuthLogout, useUserProfile } from '../hooks/useAuth'
import { useAppSelector } from '../store/hooks'

export default function UserProfile() {
  const { profile, isLoading, error, refetch } = useUserProfile()
  const { logout, isLoading: logoutLoading } = useAuthLogout()
  const authState = useAppSelector(state => state.auth)

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <h3 className="text-red-800 font-medium">Error loading profile</h3>
        {/* <p className="text-red-600">{error.message}</p> */}
        <button
          onClick={refetch}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500">No profile data available</p>
      </div>
    )
  }

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b">
        <h2 className="text-2xl font-bold text-gray-800">User Profile</h2>
      </div>
      
      <div className="p-6">
        {/* Profile Picture */}
        <div className="flex items-center mb-6">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
            {profile.profilePicture ? (
              <img
                src={profile.profilePicture}
                alt={`${profile.firstName} ${profile.lastName}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-2xl text-gray-500">
                {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
              </span>
            )}
          </div>
          <div className="ml-4">
            <h3 className="text-xl font-semibold text-gray-800">
              {profile.firstName} {profile.lastName}
            </h3>
            <p className="text-gray-600">{profile.role}</p>
            <div className="flex items-center mt-1">
              <span className={`px-2 py-1 text-xs rounded-full ${
                profile.status === 'active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {profile.status}
              </span>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <p className="mt-1 text-gray-900">{profile.email}</p>
            <div className="flex items-center mt-1">
              {profile.isEmailVerified ? (
                <span className="text-green-600 text-sm">✓ Verified</span>
              ) : (
                <span className="text-red-600 text-sm">✗ Not Verified</span>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <p className="mt-1 text-gray-900">{profile.phone || 'Not provided'}</p>
            {profile.phone && (
              <div className="flex items-center mt-1">
                {profile.isPhoneVerified ? (
                  <span className="text-green-600 text-sm">✓ Verified</span>
                ) : (
                  <span className="text-red-600 text-sm">✗ Not Verified</span>
                )}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">User ID</label>
            <p className="mt-1 text-gray-900 font-mono text-sm">{profile.id}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <p className="mt-1 text-gray-900 capitalize">{profile.role}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Member Since</label>
            <p className="mt-1 text-gray-900">
              {new Date(profile.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Last Updated</label>
            <p className="mt-1 text-gray-900">
              {new Date(profile.updatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Provider Information */}
        {profile.provider && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="text-lg font-semibold text-blue-800 mb-2">Provider Profile</h4>
            <p className="text-blue-700">
              This user has an associated provider profile with additional business information.
            </p>
          </div>
        )}

        {/* Auth State Debug Info (only in development) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Auth State (Debug)</h4>
            <div className="text-xs text-gray-600 space-y-1">
              <p>Authenticated: {authState.isAuthenticated ? 'Yes' : 'No'}</p>
              <p>Token: {authState.token ? `${authState.token.substring(0, 20)}...` : 'None'}</p>
              <p>Loading: {authState.isLoading ? 'Yes' : 'No'}</p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-8 flex space-x-4">
          <button
            onClick={refetch}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            Refresh Profile
          </button>
          
          <button
            onClick={handleLogout}
            disabled={logoutLoading}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
          >
            {logoutLoading ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      </div>
    </div>
  )
}