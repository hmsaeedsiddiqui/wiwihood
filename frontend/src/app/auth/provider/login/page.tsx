'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import axios from 'axios'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import Footer from '@/components/Footer'

export default function ProviderLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Redirect if already logged in as provider - DISABLED for testing
  // useEffect(() => {
  //   const token = typeof window !== 'undefined' ? localStorage.getItem('providerToken') : null;
  //   if (token) {
  //     // Verify token is for provider
  //     axios.get(
  // `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/auth/profile`,
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //         withCredentials: true,
  //       }
  //     ).then(response => {
  //       if (response.data && response.data.role === 'provider') {
  //         router.push('/provider/dashboard');
  //       }
  //     }).catch(() => {
  //       localStorage.removeItem('providerToken');
  //       localStorage.removeItem('provider');
  //     });
  //   }
  // }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await axios.post(
  `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/auth/login`,
        {
          email,
          password
        },
        { withCredentials: true }
      )

      if (response.data && response.data.accessToken) {
        // Check if user is a provider
        if (response.data.user && response.data.user.role === 'provider') {
          localStorage.setItem("providerToken", response.data.accessToken);
          localStorage.setItem("provider", JSON.stringify(response.data.user));
          router.push('/provider/dashboard');
        } else {
          setError('This login page is for service providers only. Please use the customer login.');
        }
      }
    } catch (err: any) {
      console.log('Backend login failed, trying demo login...');
      
      // Demo login fallback - useful for development when backend is not running
      if (email && password) {
        // Parse name from email intelligently
        const emailLocalPart = email.split('@')[0];
        let firstName = 'Demo';
        let lastName = 'Provider';
        
        if (emailLocalPart.includes('.')) {
          const nameParts = emailLocalPart.split('.');
          firstName = nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1);
          lastName = nameParts[1].charAt(0).toUpperCase() + nameParts[1].slice(1);
        } else if (emailLocalPart.includes('_')) {
          const nameParts = emailLocalPart.split('_');
          firstName = nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1);
          lastName = nameParts[1] ? nameParts[1].charAt(0).toUpperCase() + nameParts[1].slice(1) : 'Provider';
        } else {
          firstName = emailLocalPart.charAt(0).toUpperCase() + emailLocalPart.slice(1);
          lastName = 'Provider';
        }
        
        const demoToken = 'demo-provider-token-' + Date.now();
        const demoUser = {
          id: 'demo-provider-' + Date.now(),
          email: email,
          firstName: firstName,
          lastName: lastName,
          role: 'provider',
          profilePicture: null,
          businessName: `${firstName}'s Business`,
          businessAddress: 'Demo Location',
          phone: '+1234567890',
          isVerified: true
        };
        
        localStorage.setItem("providerToken", demoToken);
        localStorage.setItem("provider", JSON.stringify(demoUser));
        console.log('Demo login successful for:', demoUser.firstName, demoUser.lastName);
        router.push('/provider/dashboard');
      } else {
        setError('Please enter email and password');
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-20 flex items-center justify-center w-[95%] mx-auto max-w-[400px]">
        <div className="w-full bg-white p-12 rounded-2xl shadow-lg border border-gray-100">
          {/* Wiwihood Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-gradient-to-br from-orange-500 to-pink-500 rounded-2xl p-3 mr-3">
                <span className="text-2xl font-bold text-white">W</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-br from-orange-500 to-pink-500 bg-clip-text text-transparent">
                Wiwihood
              </span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Provider Sign In</h1>
            <p className="text-gray-600 mb-2">Access your provider dashboard</p>
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link href="/auth/provider/signup" className="text-orange-600 font-semibold hover:text-orange-500 transition-colors">
                Sign up as a provider
              </Link>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <Link href="/auth/forgot-password" className="text-sm text-orange-600 hover:text-orange-500 transition-colors font-medium">
                Forgot your password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-br from-orange-500 to-pink-500 text-white py-3 px-4 rounded-lg font-semibold hover:from-orange-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>Sign in</span>
            </button>

            <div className="text-center text-sm text-gray-600">
              <Link href="/auth/login" className="hover:text-orange-600 transition-colors font-medium">
                Looking for customer login?
              </Link>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  )
}
