'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import axios from 'axios'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import Footer from '@/components/Footer'

export default function ProviderSignupPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState<string | string[]>('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Redirect if already logged in as provider - DISABLED for testing
  // useEffect(() => {
  //   const token = typeof window !== 'undefined' ? localStorage.getItem('providerToken') : null;
  //   if (token) {
  //     // Verify token is for provider
  //     axios.get(
  //       `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/auth/profile`,
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

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/auth/register`,
        {
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          userRole: 'provider'
        },
        { withCredentials: true }
      )

      if (response.data && response.data.accessToken) {
        localStorage.setItem("providerToken", response.data.accessToken);
        if (response.data.user) {
          localStorage.setItem("provider", JSON.stringify(response.data.user));
        }
        
        // Small delay to ensure localStorage is properly set
        setTimeout(() => {
          router.push('/provider/dashboard');
        }, 100);
      }
    } catch (err: any) {
      console.log('Backend signup failed, trying demo signup...');
      
      // Demo signup fallback - useful for development when backend is not running
      if (formData.firstName && formData.lastName && formData.email) {
        const demoToken = 'demo-provider-token-' + Date.now();
        const demoUser = {
          id: 'demo-provider-' + Date.now(),
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone || '+1234567890',
          role: 'provider',
          profilePicture: null,
          businessName: `${formData.firstName}'s Business`,
          businessAddress: 'Demo Location',
          isVerified: false
        };
        
        localStorage.setItem("providerToken", demoToken);
        localStorage.setItem("provider", JSON.stringify(demoUser));
        console.log('Demo signup successful for:', demoUser.firstName, demoUser.lastName);
        
        setTimeout(() => {
          router.push('/provider/dashboard');
        }, 100);
      } else {
        const msg = err.response?.data?.message;
        setError(Array.isArray(msg) ? msg : msg || "Registration failed. Please try again.");
      }
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-20 flex items-center justify-center w-[95%] mx-auto max-w-[600px]">
        <div className="w-full bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
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
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Join as a Service Provider</h2>
            <p className="text-gray-600 mb-2">Start offering your services on Wiwihood</p>
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/auth/provider/login" className="text-orange-600 font-semibold hover:text-orange-500 transition-colors">
                Sign in here
              </Link>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {Array.isArray(error) ? (
                  <ul className="list-disc list-inside space-y-1">
                    {error.map((msg, i) => <li key={i}>{msg}</li>)}
                  </ul>
                ) : error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                <input 
                  id="firstName" 
                  name="firstName" 
                  type="text" 
                  required 
                  value={formData.firstName} 
                  onChange={handleChange} 
                  placeholder="First name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                <input 
                  id="lastName" 
                  name="lastName" 
                  type="text" 
                  required 
                  value={formData.lastName} 
                  onChange={handleChange} 
                  placeholder="Last name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email address</label>
              <input 
                id="email" 
                name="email" 
                type="email" 
                autoComplete="email" 
                required 
                value={formData.email} 
                onChange={handleChange} 
                placeholder="Enter your email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Phone Number (optional)</label>
              <input 
                id="phone" 
                name="phone" 
                type="tel" 
                value={formData.phone} 
                onChange={handleChange} 
                placeholder="Enter your phone number"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <input 
                  id="password" 
                  name="password" 
                  type={showPassword ? 'text' : 'password'} 
                  autoComplete="new-password" 
                  required 
                  value={formData.password} 
                  onChange={handleChange} 
                  placeholder="Create a password"
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
              <p className="text-xs text-gray-500 mt-1">Must contain uppercase, lowercase, number or special character (min. 8 chars)</p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
              <div className="relative">
                <input 
                  id="confirmPassword" 
                  name="confirmPassword" 
                  type={showConfirmPassword ? 'text' : 'password'} 
                  autoComplete="new-password" 
                  required 
                  value={formData.confirmPassword} 
                  onChange={handleChange} 
                  placeholder="Confirm your password"
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <button 
                  type="button" 
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <button 
                type="submit" 
                disabled={loading} 
                className="w-full bg-gradient-to-br from-orange-500 to-pink-500 text-white py-3 px-4 rounded-lg font-semibold hover:from-orange-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                <span>Create Provider Account</span>
              </button>
            </div>

            <div className="text-center">
              <Link 
                href="/auth/register" 
                className="text-sm text-gray-600 hover:text-orange-600 transition-colors"
              >
                Looking to book services? Sign up as a customer
              </Link>
            </div>
            
            <div className="text-center text-xs text-gray-500">
              By creating an account, you agree to our{' '}
              <Link href="/terms" className="text-orange-600 hover:text-orange-500 transition-colors">Terms of Service</Link>
              {' '}and{' '}
              <Link href="/privacy" className="text-orange-600 hover:text-orange-500 transition-colors">Privacy Policy</Link>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  )
}
