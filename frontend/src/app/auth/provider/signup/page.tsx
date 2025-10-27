'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import Footer from '@/components/Footer'
import RoleBasedSignupForm from '@/components/auth/RoleBasedSignupForm'
import { checkProviderAuth, clearProviderData } from '@/utils/providerAuth'

export default function ProviderSignupPage() {
  const router = useRouter()
  const [showClearOption, setShowClearOption] = useState(false)

  // Redirect if already logged in as provider
  useEffect(() => {
    const { isProvider, token } = checkProviderAuth();
    
    if (isProvider && token) {
      setShowClearOption(true)
      
      // Verify token is still valid with backend
      axios.get(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/auth/profile`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      ).then(response => {
        if (response.data && response.data.role === 'provider') {
          // Don't auto-redirect, show option to logout first
          console.log('Already logged in as provider. Show logout option.');
        }
      }).catch(() => {
        // Token is invalid, clear storage
        localStorage.removeItem('providerToken');
        localStorage.removeItem('provider');
        setShowClearOption(false)
      });
    }
  }, [router]);

  const handleLogout = () => {
    clearProviderData()
    setShowClearOption(false)
    window.location.reload() // Refresh page to show signup form
  }

  if (showClearOption) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full mx-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Already Logged In</h2>
          <p className="text-gray-600 mb-6">
            You're already logged in as a provider. Would you like to:
          </p>
          <div className="space-y-3">
            <button
              onClick={() => router.push('/provider/dashboard')}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Go to Dashboard
            </button>
            <button
              onClick={handleLogout}
              className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
            >
              Logout & Create New Account
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-20 flex items-center justify-center w-[95%] mx-auto max-w-[600px]">
        <RoleBasedSignupForm
          role="provider"
          title="Join as a Service Provider"
          subtitle="Start offering your services on Wiwihood"
        />
      </div>
      <Footer />
    </div>
  )
}
