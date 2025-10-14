import React, { useEffect } from 'react'
import { useAppDispatch } from '../store/hooks'
import { initializeAuth } from '../store/slices/authSlice'
import { useAuthStatus } from '../hooks/useAuth'

interface AuthWrapperProps {
  children: React.ReactNode
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const dispatch = useAppDispatch()
  const { isAuthenticated, isLoading } = useAuthStatus()

  useEffect(() => {
    // Initialize authentication state on app start
    dispatch(initializeAuth())
  }, [dispatch])

  // You can add global loading state here if needed
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return <>{children}</>
}

// Protected Route Component
interface ProtectedRouteProps {
  children: React.ReactNode
  requireAuth?: boolean
  redirectTo?: string
}

export function ProtectedRoute({ 
  children, 
  requireAuth = true, 
  redirectTo = '/auth/login' 
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuthStatus()

  useEffect(() => {
    if (!isLoading && requireAuth && !isAuthenticated) {
      // Redirect to login page
      if (typeof window !== 'undefined') {
        window.location.href = redirectTo
      }
    }
  }, [isAuthenticated, isLoading, requireAuth, redirectTo])

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // If authentication is required but user is not authenticated, show nothing
  // (redirect will happen in useEffect)
  if (requireAuth && !isAuthenticated) {
    return null
  }

  return <>{children}</>
}

// Role-based Access Component
interface RoleGuardProps {
  children: React.ReactNode
  allowedRoles: string[]
  fallback?: React.ReactNode
}

export function RoleGuard({ children, allowedRoles, fallback }: RoleGuardProps) {
  const { user, isAuthenticated } = useAuthStatus()

  if (!isAuthenticated || !user) {
    return fallback || <div>Access denied: Please login</div>
  }

  if (!allowedRoles.includes(user.role)) {
    return fallback || <div>Access denied: Insufficient permissions</div>
  }

  return <>{children}</>
}