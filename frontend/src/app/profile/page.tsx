'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';

export default function ProfilePage() {
  const { user, token, isAuthenticated, logout } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<any>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchProfile();
    } else {
      // Fallback to localStorage if auth store not initialized
      const storedToken = localStorage.getItem('auth-token') || localStorage.getItem('accessToken');
      if (storedToken) {
        fetchProfileWithToken(storedToken);
      } else {
        setError('No authentication token found. Please login.');
        setLoading(false);
      }
    }
  }, [isAuthenticated, token]);

  const fetchProfile = async () => {
    if (token) {
      await fetchProfileWithToken(token);
    }
  };

  const fetchProfileWithToken = async (authToken: string) => {
    try {
      if (!authToken) {
        setError('No authentication token found. Please login.');
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:8000/api/v1/auth/profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        }
      });
      
      if (response.ok) {
        const userData = await response.json();
        setProfileData(userData);
        setError('');
      } else {
        const errorText = await response.text();
        setError(`Failed to load profile: ${response.status} ${errorText}`);
      }
    } catch (error: any) {
      setError(`Error: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    // Also clear any legacy tokens
    localStorage.removeItem('accessToken');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-6 sm:p-8 md:p-10 rounded-xl shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h2>
          <p className="text-gray-600 mb-6 text-base sm:text-lg break-words">{error}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button 
          onClick={fetchProfile}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-full sm:w-auto"
        >
          Retry
        </button>
        <button 
          onClick={() => window.location.href = '/auth/login'}
          className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 w-full sm:w-auto"
        >
          Login Again
        </button>
          </div>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <p className="text-red-600">No profile data available</p>
          <button 
            onClick={fetchProfile}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
            </div>

            {/* Profile Information */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <p className="mt-1 text-lg text-gray-900">
                  {profileData.name || 
                   `${profileData.firstName || ''} ${profileData.lastName || ''}`.trim() || 
                   'Not provided'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 text-lg text-gray-900">{profileData.email || 'Not provided'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <p className="mt-1 text-lg text-gray-900">{profileData.phone || 'Not provided'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <p className="mt-1 text-lg text-gray-900 capitalize">{profileData.role || 'Not provided'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Member Since</label>
                <p className="mt-1 text-lg text-gray-900">
                  {profileData.createdAt ? new Date(profileData.createdAt).toLocaleDateString() : 'Not available'}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex space-x-4">
              <Link 
                href="/bookings" 
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                View Bookings
              </Link>
              <Link 
                href="/settings" 
                className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                Settings
              </Link>
              <button 
                onClick={handleLogout}
                className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}