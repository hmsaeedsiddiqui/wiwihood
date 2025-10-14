'use client'

import React, { useState } from 'react'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRoleBasedLogin } from '../../hooks/useAuth'

interface RoleBasedLoginFormProps {
  role?: 'customer' | 'provider' | 'admin'
  title?: string
  subtitle?: string
  signupLink?: string
  signupText?: string
  onSuccess?: () => void
}

export default function RoleBasedLoginForm({ 
  role,
  title, 
  subtitle, 
  signupLink,
  signupText,
  onSuccess 
}: RoleBasedLoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [twoFactorToken, setTwoFactorToken] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [show2FA, setShow2FA] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const { login, isLoading, error: apiError } = useRoleBasedLogin()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!email || !password) {
      setError('Please enter email and password')
      return
    }

    try {
      const result = await login(
        { email, password, twoFactorToken: twoFactorToken || undefined },
        role
      )
      
      // Handle 2FA requirement
      if (result && 'requiresTwoFactor' in result) {
        setShow2FA(true)
        setError('')  // Clear any previous errors
        setSuccess('2FA code sent. Please check your authenticator app.')
        return
      }

      // Clear error and show success on successful login
      setError('')
      setSuccess('Login successful! Redirecting...')
      
      // Small delay to show success message before redirect
      setTimeout(() => {
        if (onSuccess) {
          onSuccess()
        }
      }, 1500)
    } catch (err: any) {
      // Display error in form as well as toast
      let errorMessage = 'Login failed. Please try again.'
      
      if (err?.message) {
        errorMessage = err.message
      } else if (err?.data?.message) {
        errorMessage = Array.isArray(err.data.message) ? err.data.message.join(', ') : err.data.message
      }
      
      setError(errorMessage)
    }
  }

  const getRoleDisplayName = () => {
    switch (role) {
      case 'provider':
        return 'Service Provider'
      case 'customer':
        return 'Customer'
      case 'admin':
        return 'Administrator'
      default:
        return 'User'
    }
  }

  const getDefaultSignupLink = () => {
    switch (role) {
      case 'provider':
        return '/auth/provider/signup'
      case 'customer':
        return '/auth/register'
      case 'admin':
        return '/auth/admin/signup'
      default:
        return '/auth/register'
    }
  }

  const getDefaultSignupText = () => {
    switch (role) {
      case 'provider':
        return 'Sign up as a provider'
      case 'customer':
        return 'Sign up as a customer'
      case 'admin':
        return 'Request admin access'
      default:
        return 'Sign up'
    }
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-6">
          <div className="bg-gradient-to-br from-orange-500 to-pink-500 rounded-2xl p-3 mr-3">
            <span className="text-2xl font-bold text-white">W</span>
          </div>
          <span className="text-2xl font-bold bg-gradient-to-br from-orange-500 to-pink-500 bg-clip-text text-transparent">
            Wiwihood
          </span>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {title || (role ? `${getRoleDisplayName()} Sign In` : 'Sign In')}
        </h1>
        
        <p className="text-gray-600 mb-2">
          {subtitle || (role ? `Access your ${role} dashboard` : 'Welcome back to Wiwihood')}
        </p>
        
        {!show2FA && (
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link 
              href={signupLink || getDefaultSignupLink()} 
              className="text-orange-600 font-semibold hover:text-orange-500 transition-colors"
            >
              {signupText || getDefaultSignupText()}
            </Link>
          </p>
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Success Display */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
            {success}
          </div>
        )}

        {!show2FA ? (
          <>
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (error) setError('')
                  if (success) setSuccess('')
                }}
                placeholder="Enter your email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
                disabled={isLoading}
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (error) setError('')
                    if (success) setSuccess('')
                  }}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <Link 
                href="/auth/forgot-password" 
                className="text-sm text-orange-600 hover:text-orange-500 transition-colors"
              >
                Forgot your password?
              </Link>
            </div>
          </>
        ) : (
          /* 2FA Input */
          <div>
            <label htmlFor="twoFactorToken" className="block text-sm font-medium text-gray-700 mb-2">
              Two-Factor Authentication Code
            </label>
            <input
              id="twoFactorToken"
              type="text"
              value={twoFactorToken}
              onChange={(e) => {
                setTwoFactorToken(e.target.value)
                if (error) setError('')
              }}
              placeholder="Enter 6-digit code"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-center text-lg tracking-widest"
              maxLength={6}
              required
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500 mt-1 text-center">
              Enter the 6-digit code from your authenticator app
            </p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-br from-orange-500 to-pink-500 text-white py-3 px-4 rounded-lg font-semibold hover:from-orange-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
        >
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          <span>
            {isLoading ? 'Signing in...' : (show2FA ? 'Verify & Sign in' : 'Sign in')}
          </span>
        </button>

        {/* Back to Login Button for 2FA */}
        {show2FA && (
          <button
            type="button"
            onClick={() => {
              setShow2FA(false)
              setTwoFactorToken('')
              setError('')
            }}
            className="w-full text-gray-600 hover:text-gray-800 transition-colors text-sm"
          >
            ← Back to login
          </button>
        )}

        {/* Role-specific additional links */}
        {role === 'customer' && (
          <div className="text-center text-sm text-gray-600">
            <Link 
              href="/auth/provider/login" 
              className="hover:text-orange-600 transition-colors font-medium"
            >
              Looking for provider login?
            </Link>
          </div>
        )}

        {role === 'provider' && (
          <div className="text-center text-sm text-gray-600">
            <Link 
              href="/auth/login" 
              className="hover:text-orange-600 transition-colors font-medium"
            >
              Looking for customer login?
            </Link>
          </div>
        )}
      </form>
    </div>
  )
}