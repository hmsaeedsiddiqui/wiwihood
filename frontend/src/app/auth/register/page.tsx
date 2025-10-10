"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../components/AuthProvider';
import SignupForm from '../../../components/auth/SignupForm';
import Footer from '@/components/Footer';

export default function RegisterPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleSignupSuccess = () => {
    // Redirect to home page after successful signup
    router.push('/');
    // Force page refresh to update header state
    window.location.href = '/';
  };

  // Show loading while checking auth status
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If already authenticated, don't show the form (will redirect)
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-20 flex items-center justify-center w-[95%] mx-auto max-w-[600px]">
        <div className="w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create your account</h1>
            <p className="text-gray-600">Join Wiwihood to book amazing services</p>
          </div>
          <SignupForm onSuccess={handleSignupSuccess} />
        </div>
      </div>
      <Footer />
    </div>
  );
}
