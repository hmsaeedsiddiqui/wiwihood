import React, { useState } from 'react'
import { useLogin, useRegister } from '../hooks/useAuth'
import type { LoginRequest, RegisterRequest } from '../types/api'

interface AuthFormProps {
  mode: 'login' | 'register'
  onModeChange: (mode: 'login' | 'register') => void
}

export default function AuthForm({ mode, onModeChange }: AuthFormProps) {
  const { login, isLoading: loginLoading } = useLogin()
  const { register, isLoading: registerLoading } = useRegister()
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    userRole: 'customer' as 'customer' | 'provider' | 'admin',
    twoFactorToken: ''
  })
  
  const [showTwoFactor, setShowTwoFactor] = useState(false)
  
  const isLoading = loginLoading || registerLoading

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (mode === 'login') {
        const loginData: LoginRequest = {
          email: formData.email,
          password: formData.password,
          ...(formData.twoFactorToken && { twoFactorToken: formData.twoFactorToken })
        }
        
        const result = await login(loginData)
        
        // Check if 2FA is required
        if (result && 'requiresTwoFactor' in result) {
          setShowTwoFactor(true)
          return
        }
        
        // Successful login - handle redirect
        console.log('Login successful:', result)
        
        // Check for stored redirect path
        const redirectPath = localStorage.getItem('redirectAfterLogin')
        if (redirectPath) {
          localStorage.removeItem('redirectAfterLogin')
          // Use setTimeout to let the success message show first
          setTimeout(() => {
            window.location.href = redirectPath
          }, 1500)
        } else {
          // Default redirect based on user role
          const userRole = ('user' in result && result.user?.role) || 'customer'
          const defaultPath = userRole === 'provider' ? '/provider/dashboard' : '/dashboard'
          setTimeout(() => {
            window.location.href = defaultPath
          }, 1500)
        }
        
      } else {
        const registerData: RegisterRequest = {
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone || undefined,
          userRole: formData.userRole,
        }
        
        const result = await register(registerData)
        console.log('Registration successful:', result)
      }
    } catch (error) {
      console.error('Auth error:', error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {mode === 'login' ? 'Login' : 'Register'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {mode === 'register' && (
          <>
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone (Optional)
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="userRole" className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <select
                id="userRole"
                name="userRole"
                value={formData.userRole}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="customer">Customer</option>
                <option value="provider">Provider</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </>
        )}

        {(mode === 'login' && showTwoFactor) && (
          <div>
            <label htmlFor="twoFactorToken" className="block text-sm font-medium text-gray-700">
              2FA Code
            </label>
            <input
              type="text"
              id="twoFactorToken"
              name="twoFactorToken"
              value={formData.twoFactorToken}
              onChange={handleInputChange}
              placeholder="Enter 6-digit code"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isLoading ? 'Loading...' : (mode === 'login' ? 'Login' : 'Register')}
        </button>
      </form>

      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={() => {
            onModeChange(mode === 'login' ? 'register' : 'login')
            setShowTwoFactor(false)
            setFormData({
              email: '',
              password: '',
              firstName: '',
              lastName: '',
              phone: '',
              userRole: 'customer',
              twoFactorToken: ''
            })
          }}
          className="text-blue-600 hover:text-blue-500"
        >
          {mode === 'login' ? 'Need an account? Register' : 'Already have an account? Login'}
        </button>
      </div>
    </div>
  )
}