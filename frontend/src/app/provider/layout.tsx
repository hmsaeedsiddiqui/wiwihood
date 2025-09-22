"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import axios from 'axios';
import ProviderHeader from '../../components/ProviderHeader';
import ProviderSidebar from '../../components/ProviderSidebar';

export default function ProviderLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('providerToken') : null;
      
      if (!token) {
        router.push('/auth/provider/login');
        return;
      }

      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/auth/profile`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );

        if (response.data && response.data.role === 'provider') {
          setUser(response.data);
        } else {
          // User is not a provider, redirect to provider login
          localStorage.removeItem('providerToken');
          localStorage.removeItem('provider');
          router.push('/auth/provider/login');
        }
      } catch (error) {
        // Token is invalid, redirect to login
        localStorage.removeItem('providerToken');
        localStorage.removeItem('provider');
        router.push('/auth/provider/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Provider Dashboard...</p>
        </div>
      </div>
    );
  }

  // Don't render the layout if user is not authenticated
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Provider Header - COMPLETELY SEPARATE from customer header */}
      <ProviderHeader />

      {/* Provider Sidebar */}
      <ProviderSidebar />

      {/* Provider Dashboard Content with sidebar offset */}
      <main style={{ 
        marginLeft: '256px', // Same width as sidebar
        paddingTop: '64px', // Same height as header
        minHeight: '100vh',
        backgroundColor: '#f9fafb'
      }}>
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
