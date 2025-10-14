'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import Footer from '@/components/Footer'
import RoleBasedSignupForm from '@/components/auth/RoleBasedSignupForm'
import { checkProviderAuth } from '@/utils/providerAuth'

export default function ProviderSignupPage() {
  const router = useRouter()

  // Redirect if already logged in as provider
  useEffect(() => {
    const { isProvider, token } = checkProviderAuth();
    
    if (isProvider && token) {
      // Verify token is still valid with backend
      axios.get(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/auth/profile`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      ).then(response => {
        if (response.data && response.data.role === 'provider') {
          router.push('/provider/dashboard');
        }
      }).catch(() => {
        // Token is invalid, clear storage
        localStorage.removeItem('providerToken');
        localStorage.removeItem('provider');
      });
    }
  }, [router]);

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
