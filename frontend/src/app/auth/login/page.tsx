"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import LoginForm from '../../../components/auth/LoginForm';
import Footer from '@/components/Footer';

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStore();

  // Redirect if already logged in
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleLoginSuccess = () => {
    // Redirect to home page after successful login
    router.push('/');
  };

  // Show loading while checking auth status
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
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
      <div className="py-20 flex items-center justify-center w-[95%] mx-auto max-w-[500px]">
        <div className="w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h1>
            <p className="text-gray-600">Sign in to your account to continue</p>
          </div>
          <LoginForm onSuccess={handleLoginSuccess} />
        </div>
      </div>
      <Footer />
    </div>
  );
}
