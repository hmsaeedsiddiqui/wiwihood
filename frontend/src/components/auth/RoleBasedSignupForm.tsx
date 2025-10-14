'use client'

import React, { useState } from 'react'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { useRoleBasedRegister } from '../../hooks/useAuth'

interface RoleBasedSignupFormProps {
  role: 'customer' | 'provider' | 'admin'
  title?: string
  subtitle?: string
  onSuccess?: () => void
}

export default function RoleBasedSignupForm({ 
  role, 
  title, 
  subtitle, 
  onSuccess 
}: RoleBasedSignupFormProps) {
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
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState<string>('')

  const { register, isLoading, error: apiError } = useRoleBasedRegister()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    // Clear error and success when user starts typing
    if (error) setError('')
    if (success) setSuccess('')
  }

  const validateForm = () => {
    if (!formData.email || !formData.password || !formData.firstName || !formData.lastName) {
      setError('Please fill in all required fields')
      return false
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return false
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long')
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!validateForm()) return

    try {
      await register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone || undefined,
        profilePicture: undefined
      }, role)

      // Clear error and show success on successful registration
      setError('')
      setSuccess('Account created successfully! Redirecting...')
      
      // Small delay to show success message before redirect
      setTimeout(() => {
        if (onSuccess) {
          onSuccess()
        }
      }, 1500)
    } catch (err: any) {
      // Display error in form as well as toast
      let errorMessage = 'Registration failed. Please try again.'
      
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
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {title || `Sign up as ${getRoleDisplayName()}`}
        </h2>
        
        <p className="text-gray-600">
          {subtitle || `Create your ${role} account on Wiwihood`}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
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

        {/* Name Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
              First Name *
            </label>
            <input 
              id="firstName" 
              name="firstName" 
              type="text" 
              required 
              value={formData.firstName} 
              onChange={handleChange} 
              placeholder="First name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              disabled={isLoading}
            />
          </div>
          
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
              Last Name *
            </label>
            <input 
              id="lastName" 
              name="lastName" 
              type="text" 
              required 
              value={formData.lastName} 
              onChange={handleChange} 
              placeholder="Last name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
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
            disabled={isLoading}
          />
        </div>

        {/* Phone (optional) */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number (optional)
          </label>
          <input 
            id="phone" 
            name="phone" 
            type="tel" 
            value={formData.phone} 
            onChange={handleChange} 
            placeholder="Enter your phone number"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            disabled={isLoading}
          />
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Password *
          </label>
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
          <p className="text-xs text-gray-500 mt-1">
            Must contain uppercase, lowercase, number or special character (min. 8 chars)
          </p>
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
            Confirm Password *
          </label>
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
              disabled={isLoading}
            />
            <button 
              type="button" 
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              disabled={isLoading}
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <div>
          <button 
            type="submit" 
            disabled={isLoading} 
            className="w-full bg-gradient-to-br from-orange-500 to-pink-500 text-white py-3 px-4 rounded-lg font-semibold hover:from-orange-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            <span>
              {isLoading ? 'Creating Account...' : `Create ${getRoleDisplayName()} Account`}
            </span>
          </button>
        </div>
      </form>
    </div>
  )
}