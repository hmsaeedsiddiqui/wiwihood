import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { 
  useRegisterMutation,
  useLoginMutation,
  useGetProfileQuery,
  useLogoutMutation,
  type RegisterRequest,
  type LoginRequest,
  type AuthResponse,
  type TwoFactorResponse,
  type UserProfile
} from '../store/api/authApi'
import { markProviderAsRegistered } from '../utils/providerAuth'

// Demo functions for development when backend is not available
const handleDemoLogin = async (
  credentials: LoginRequest, 
  expectedRole?: 'customer' | 'provider' | 'admin',
  router?: any
) => {
  const { email, password } = credentials
  
  if (!email || !password) {
    const error = 'Please enter email and password'
    toast.error(error)
    throw new Error(error)
  }

  // Parse name from email intelligently
  const emailLocalPart = email.split('@')[0]
  let firstName = 'Demo'
  let lastName = expectedRole === 'provider' ? 'Provider' : 'User'
  
  if (emailLocalPart.includes('.')) {
    const nameParts = emailLocalPart.split('.')
    firstName = nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1)
    lastName = nameParts[1] ? nameParts[1].charAt(0).toUpperCase() + nameParts[1].slice(1) : lastName
  } else if (emailLocalPart.includes('_')) {
    const nameParts = emailLocalPart.split('_')
    firstName = nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1)
    lastName = nameParts[1] ? nameParts[1].charAt(0).toUpperCase() + nameParts[1].slice(1) : lastName
  } else {
    firstName = emailLocalPart.charAt(0).toUpperCase() + emailLocalPart.slice(1)
  }
  
  const userRole = expectedRole || 'customer'
  const demoToken = `demo-${userRole}-token-${Date.now()}`
  const demoUser = {
    id: `demo-${userRole}-${Date.now()}`,
    email: email,
    firstName: firstName,
    lastName: lastName,
    role: userRole,
    status: 'active',
    profilePicture: null,
    phone: '+1234567890',
    isEmailVerified: true,
    isPhoneVerified: false
  }

  const authResponse = {
    accessToken: demoToken,
    refreshToken: `refresh-${demoToken}`,
    expiresIn: 3600,
    user: demoUser
  }

  // Store based on role
  if (userRole === 'provider') {
    localStorage.setItem('providerToken', demoToken)
    localStorage.setItem('provider', JSON.stringify(demoUser))
    markProviderAsRegistered()
  } else {
    localStorage.setItem('accessToken', demoToken)
    localStorage.setItem('user', JSON.stringify(demoUser))
  }

  toast.success(`Demo login successful! Welcome ${firstName} ${lastName}`)
  console.log('Demo login successful for:', firstName, lastName, `(${userRole})`)
  
  // Redirect based on role
  if (router) {
    if (userRole === 'provider') {
      router.push('/provider/dashboard')
    } else if (userRole === 'customer') {
      router.push('/dashboard')
    } else if (userRole === 'admin') {
      router.push('/admin')
    }
  }
  
  return authResponse
}

const handleDemoRegistration = async (
  userData: Omit<RegisterRequest, 'userRole'>,
  role: 'customer' | 'provider' | 'admin',
  router?: any
) => {
  const demoToken = `demo-${role}-token-${Date.now()}`
  const demoUser = {
    id: `demo-${role}-${Date.now()}`,
    email: userData.email,
    firstName: userData.firstName,
    lastName: userData.lastName,
    role: role,
    status: 'active',
    profilePicture: null,
    phone: userData.phone || '+1234567890',
    isEmailVerified: true,
    isPhoneVerified: false
  }

  const authResponse = {
    accessToken: demoToken,
    refreshToken: `refresh-${demoToken}`,
    expiresIn: 3600,
    user: demoUser
  }

  // Store based on role
  if (role === 'provider') {
    localStorage.setItem('providerToken', demoToken)
    localStorage.setItem('provider', JSON.stringify(demoUser))
    markProviderAsRegistered()
  } else {
    localStorage.setItem('accessToken', demoToken)
    localStorage.setItem('user', JSON.stringify(demoUser))
  }

  toast.success(`Demo registration successful! Welcome ${userData.firstName} ${userData.lastName}`)
  console.log('Demo registration successful for:', userData.firstName, userData.lastName, `(${role})`)
  
  // Redirect based on role
  if (router) {
    if (role === 'provider') {
      router.push('/provider/dashboard')
    } else if (role === 'customer') {
      router.push('/dashboard')
    } else if (role === 'admin') {
      router.push('/admin')
    }
  }
  
  return authResponse
}

// Custom hook for role-based registration
export const useRoleBasedRegister = () => {
  const [registerMutation, { isLoading, error }] = useRegisterMutation()
  const router = useRouter()

  const register = useCallback(async (
    userData: Omit<RegisterRequest, 'userRole'>, 
    role: 'customer' | 'provider' | 'admin' = 'customer'
  ) => {
    try {
      const registerData: RegisterRequest = {
        ...userData,
        userRole: role
      }

      const result = await registerMutation(registerData).unwrap() as AuthResponse
      
      // Handle successful registration based on role
      if (role === 'provider') {
        // Store provider-specific tokens and data
        localStorage.setItem('providerToken', result.accessToken)
        localStorage.setItem('provider', JSON.stringify(result.user))
        markProviderAsRegistered()
        toast.success(`Welcome ${result.user.firstName}! Provider account created successfully.`)
        // Redirect to onboarding if provider profile is missing
        router.push('/provider/onboarding')
      } else if (role === 'customer') {
        // Store customer-specific tokens and data
        localStorage.setItem('accessToken', result.accessToken)
        localStorage.setItem('user', JSON.stringify(result.user))
        
        toast.success(`Welcome ${result.user.firstName}! Account created successfully.`)
        router.push('/dashboard')
      } else {
        // Admin role
        localStorage.setItem('accessToken', result.accessToken)
        localStorage.setItem('user', JSON.stringify(result.user))
        
        toast.success(`Welcome ${result.user.firstName}! Admin account created successfully.`)
        router.push('/admin')
      }

      return result
    } catch (err: any) {
      // Check if this is a network/API error and try demo registration for development
      if (err?.status === 'FETCH_ERROR' || err?.code === 'ECONNREFUSED' || !err?.data) {
        console.log('Backend registration failed, trying demo registration for development...')
        return await handleDemoRegistration(userData, role, router)
      }

      // Handle specific error messages
      let errorMessage = 'Registration failed. Please try again.'
      
      if (err?.data?.message) {
        errorMessage = Array.isArray(err.data.message) ? err.data.message.join(', ') : err.data.message
      } else if (err?.message) {
        errorMessage = err.message
      }

      toast.error(errorMessage)
      throw err
    }
  }, [registerMutation, router])

  return {
    register,
    isLoading,
    error
  }
}

// Custom hook for role-based login
export const useRoleBasedLogin = () => {
  const [loginMutation, { isLoading, error }] = useLoginMutation()
  const router = useRouter()

  const login = useCallback(async (
    credentials: LoginRequest,
    expectedRole?: 'customer' | 'provider' | 'admin'
  ) => {
    try {
      const result = await loginMutation(credentials).unwrap()
      
      // Handle 2FA response
      if ('requiresTwoFactor' in result) {
        toast('Please enter your 2FA code to continue', { icon: 'ℹ️' })
        return result as TwoFactorResponse
      }

      const authResult = result as AuthResponse
      const userRole = authResult.user.role

      // Validate role if expected role is specified
      if (expectedRole && userRole !== expectedRole) {
        const roleMessages = {
          provider: 'This login page is for service providers only. Please use the customer login.',
          customer: 'This login page is for customers only. Please use the provider login.',
          admin: 'This login page is for administrators only.'
        }
        
        const message = roleMessages[expectedRole] || 'Invalid user role for this login page.'
        toast.error(message)
        throw new Error(message)
      }

      // Handle successful login based on role
      if (userRole === 'provider') {
        localStorage.setItem('providerToken', authResult.accessToken)
        localStorage.setItem('provider', JSON.stringify(authResult.user))
        markProviderAsRegistered()
        
        toast.success(`Welcome back, ${authResult.user.firstName}!`)
        router.push('/provider/dashboard')
      } else if (userRole === 'customer') {
        localStorage.setItem('accessToken', authResult.accessToken)
        localStorage.setItem('user', JSON.stringify(authResult.user))
        
        toast.success(`Welcome back, ${authResult.user.firstName}!`)
        router.push('/dashboard')
      } else if (userRole === 'admin') {
        localStorage.setItem('accessToken', authResult.accessToken)
        localStorage.setItem('user', JSON.stringify(authResult.user))
        
        toast.success(`Welcome back, ${authResult.user.firstName}!`)
        router.push('/admin')
      }

      return authResult
    } catch (err: any) {
      // Check if this is a network/API error and try demo login for development
      if (err?.status === 'FETCH_ERROR' || err?.code === 'ECONNREFUSED' || !err?.data) {
        console.log('Backend login failed, trying demo login for development...')
        return await handleDemoLogin(credentials, expectedRole, router)
      }

      // Handle specific error messages
      let errorMessage = 'Login failed. Please try again.'
      
      if (err?.data?.message) {
        errorMessage = Array.isArray(err.data.message) ? err.data.message.join(', ') : err.data.message
      } else if (err?.message) {
        errorMessage = err.message
      }

      toast.error(errorMessage)
      throw err
    }
  }, [loginMutation, router])

  return {
    login,
    isLoading,
    error
  }
}

// Custom hook for getting current user profile
export const useUserProfile = () => {
  const { 
    data: profile, 
    isLoading, 
    error, 
    refetch 
  } = useGetProfileQuery()

  return {
    profile,
    isLoading,
    error,
    refetch
  }
}

// Custom hook for logout with cleanup
export const useAuthLogout = () => {
  const [logoutMutation, { isLoading }] = useLogoutMutation()
  const router = useRouter()

  const logout = useCallback(async () => {
    try {
      // Call backend logout
      await logoutMutation().unwrap()
      toast.success('Logged out successfully')
    } catch (error) {
      console.warn('Logout API call failed, proceeding with local cleanup:', error)
      toast.success('Logged out successfully')
    } finally {
      // Always clean up local storage regardless of API call success
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('providerToken')
        localStorage.removeItem('auth-token')
        localStorage.removeItem('user')
        localStorage.removeItem('provider')
      }
      // Keep providerWasRegistered flag for future login redirects
      
      router.push('/')
    }
  }, [logoutMutation, router])

  return {
    logout,
    isLoading
  }
}

// Custom hook for checking authentication status
export const useAuthStatus = () => {
  // SSR-safe initial state; resolve on client after mount
  const [state, setState] = useState<{
    isAuthenticated: boolean
    isLoading: boolean
    user: any
    role: string | null
    token: string | null
  }>({ isAuthenticated: false, isLoading: true, user: null, role: null, token: null })

  const compute = useCallback(() => {
    if (typeof window === 'undefined') {
      return { isAuthenticated: false, isLoading: true, user: null, role: null, token: null }
    }
    const customerToken = localStorage.getItem('accessToken')
    const customerUser = localStorage.getItem('user')
    const providerToken = localStorage.getItem('providerToken')
    const providerUser = localStorage.getItem('provider')

    const isCustomerAuth = !!(customerToken && customerUser)
    const isProviderAuth = !!(providerToken && providerUser)
    const isAuthenticated = isCustomerAuth || isProviderAuth

    let user: any = null
    let role: string | null = null

    if (isProviderAuth) {
      try {
        user = providerUser ? JSON.parse(providerUser) : null
        role = 'provider'
      } catch (e) {
        console.error('Failed to parse provider user data')
      }
    } else if (isCustomerAuth) {
      try {
        user = customerUser ? JSON.parse(customerUser) : null
        role = user?.role || 'customer'
      } catch (e) {
        console.error('Failed to parse customer user data')
      }
    }

    return {
      isAuthenticated,
      isLoading: false,
      user,
      role,
      token: providerToken || customerToken
    }
  }, [])

  useEffect(() => {
    // Compute on mount
    setState(compute())
    // Listen for changes across tabs
    const onStorage = () => setState(compute())
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', onStorage)
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('storage', onStorage)
      }
    }
  }, [compute])

  return state
}

// Aliases for backward compatibility
export const useLogin = useRoleBasedLogin
export const useRegister = useRoleBasedRegister