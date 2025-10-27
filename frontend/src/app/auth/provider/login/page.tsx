'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import Footer from '@/components/Footer'
import RoleBasedLoginForm from '@/components/auth/RoleBasedLoginForm'
import { checkProviderAuth } from '@/utils/providerAuth'

export default function ProviderLoginPage() {
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
          // Check if onboarding is complete before redirecting to dashboard
          checkOnboardingStatus(token);
        }
      }).catch(() => {
        // Token is invalid, clear storage
        localStorage.removeItem('providerToken');
        localStorage.removeItem('provider');
      });
    }
  }, [router]);

  const checkOnboardingStatus = async (token: string) => {
    try {
      // Check if provider profile exists and is complete
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/providers/me`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        }
      );

      if (response.data) {
        const provider = response.data;
        const requiredFields = ['businessName', 'address', 'city', 'country'];
        const missingFields = requiredFields.filter(field => !provider[field]);

        if (missingFields.length === 0) {
          // Onboarding is complete, go to dashboard
          router.push('/provider/dashboard');
        } else {
          // Onboarding incomplete, go to onboarding
          router.push('/provider/onboarding');
        }
      } else {
        // No provider profile, go to onboarding
        router.push('/provider/onboarding');
      }
    } catch (error) {
      // Error checking profile, go to onboarding to be safe
      router.push('/provider/onboarding');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-20 flex items-center justify-center w-[95%] mx-auto max-w-[600px]">
        <RoleBasedLoginForm
          role="provider"
          title="Provider Sign In"
          subtitle="Access your provider dashboard"
        />
      </div>
      <Footer />
    </div>
  )
}
