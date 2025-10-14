# RTK Query Auth Implementation Guide

## 🚀 Complete Redux + RTK Query Auth Setup

Your authentication system has been completely rebuilt using modern Redux Toolkit Query with TypeScript. Here's everything you need to know:

## 📁 File Structure Created

```
src/
├── types/
│   └── api.ts                     # TypeScript types for all API responses
├── store/
│   ├── index.ts                   # Updated Redux store with RTK Query
│   ├── api/
│   │   └── authApi.ts            # RTK Query auth endpoints
│   └── slices/
│       └── authSlice.ts          # Auth state management
├── hooks/
│   └── useAuth.ts                # Custom auth hooks
└── components/
    ├── AuthForm.tsx              # Complete auth form example
    ├── UserProfile.tsx           # User profile component
    └── AuthWrapper.tsx           # Auth initialization wrapper
```

## 🔧 What Was Implemented

### 1. Backend Integration
- ✅ **Register**: `/auth/register`
- ✅ **Login**: `/auth/login` (with 2FA support)
- ✅ **Profile**: `/auth/profile`
- ✅ **Refresh Token**: `/auth/refresh`
- ✅ **Logout**: `/auth/logout`

### 2. TypeScript Types
All backend DTOs converted to frontend types:
- `RegisterRequest`, `LoginRequest`, `AuthResponse`
- `User`, `UserProfile`, `TwoFactorResponse`
- Full type safety across the entire auth flow

### 3. RTK Query API Service
- Automatic caching and synchronization
- Error handling and transformations
- Bearer token automatic inclusion
- Request/response type safety

### 4. Custom Hooks
- `useRegister()` - User registration
- `useLogin()` - Login with 2FA support
- `useProfile()` - Get user profile
- `useLogout()` - Logout functionality
- `useAuthStatus()` - Check auth state
- `useRequireAuth()` - Protected route helper

## 🎯 How to Use in Your Components

### Replace Existing Auth Pages

#### Login Page (`src/app/auth/login/page.tsx`)
```tsx
'use client'
import { useState } from 'react'
import { useLogin } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const { login, isLoading } = useLogin()
  const router = useRouter()
  const [showTwoFactor, setShowTwoFactor] = useState(false)
  
  const handleLogin = async (formData: any) => {
    try {
      const result = await login(formData)
      
      if (result && 'requiresTwoFactor' in result) {
        setShowTwoFactor(true)
        return
      }
      
      // Successful login
      router.push('/dashboard')
    } catch (error) {
      console.error('Login failed:', error)
    }
  }

  return (
    <AuthForm 
      mode="login" 
      onSubmit={handleLogin}
      showTwoFactor={showTwoFactor}
      isLoading={isLoading}
    />
  )
}
```

#### Register Page (`src/app/auth/register/page.tsx`)
```tsx
'use client'
import { useRegister } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const { register, isLoading } = useRegister()
  const router = useRouter()
  
  const handleRegister = async (formData: any) => {
    try {
      await register(formData)
      router.push('/dashboard')
    } catch (error) {
      console.error('Registration failed:', error)
    }
  }

  return (
    <AuthForm 
      mode="register" 
      onSubmit={handleRegister}
      isLoading={isLoading}
    />
  )
}
```

### Update Your Layout

#### Root Layout (`src/app/layout.tsx`)
```tsx
import { ReduxProvider } from '@/store/ReduxProvider'
import AuthWrapper from '@/components/AuthWrapper'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          <AuthWrapper>
            {children}
          </AuthWrapper>
        </ReduxProvider>
      </body>
    </html>
  )
}
```

### Protected Routes

#### Dashboard Page (`src/app/dashboard/page.tsx`)
```tsx
'use client'
import { ProtectedRoute } from '@/components/AuthWrapper'
import { useProfile } from '@/hooks/useAuth'

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  )
}

function DashboardContent() {
  const { profile, isLoading } = useProfile()
  
  if (isLoading) return <div>Loading...</div>
  
  return (
    <div>
      <h1>Welcome, {profile?.firstName}!</h1>
      <UserProfile />
    </div>
  )
}
```

### Role-Based Access

#### Admin Panel (`src/app/admin/page.tsx`)
```tsx
'use client'
import { RoleGuard } from '@/components/AuthWrapper'

export default function AdminPanel() {
  return (
    <RoleGuard allowedRoles={['admin']}>
      <div>Admin only content</div>
    </RoleGuard>
  )
}
```

## 🔄 Migration Steps

### 1. Replace Existing Auth Calls
Find and replace old auth API calls:

```tsx
// OLD WAY ❌
const response = await fetch('/api/auth/login', {...})
const data = await response.json()

// NEW WAY ✅
const { login } = useLogin()
const result = await login({ email, password })
```

### 2. Update State Access
Replace direct state access:

```tsx
// OLD WAY ❌
const user = useAuth() // or context
const { user } = useAuthStore() // or zustand

// NEW WAY ✅
const { user, isAuthenticated } = useAuthStatus()
```

### 3. Update Navigation Guards
Replace auth checks:

```tsx
// OLD WAY ❌
if (!user) {
  router.push('/login')
  return null
}

// NEW WAY ✅
const { isAuthenticated } = useRequireAuth()
// Automatic redirect handled
```

## 🎨 Environment Setup

Add to your `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 🚨 Breaking Changes Fixed

1. **Import Paths**: Updated all relative imports
2. **Type Safety**: Added comprehensive TypeScript types
3. **Error Handling**: Standardized error responses
4. **Token Management**: Automatic localStorage handling
5. **Cache Invalidation**: RTK Query handles cache updates

## 📱 React Hot Toast Integration

The system includes automatic toast notifications:
- ✅ Success: Login/Register success
- ❌ Errors: API failures with descriptive messages
- ℹ️ Info: 2FA required notifications

## 🔒 Security Features

1. **Automatic Token Refresh**: Built-in token refresh mechanism
2. **Secure Storage**: localStorage with cleanup on logout
3. **Route Protection**: Component-level auth guards
4. **Role-Based Access**: Fine-grained permission control
5. **2FA Support**: Two-factor authentication handling

## 🚀 Next Steps

1. Update your existing auth components to use the new hooks
2. Replace old API calls with RTK Query endpoints
3. Remove old auth utilities and state management
4. Test the complete auth flow
5. Deploy and monitor error logs

## 🐛 Troubleshooting

- **Import Errors**: Make sure all paths are correct
- **Token Issues**: Check localStorage in browser dev tools
- **API Errors**: Verify backend URL in environment variables
- **Type Errors**: Ensure all TypeScript types are imported

Your auth system is now production-ready with modern best practices! 🎉