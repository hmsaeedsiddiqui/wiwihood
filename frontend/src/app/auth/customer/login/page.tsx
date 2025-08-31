'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import axios from 'axios'
import { Eye, EyeOff, Loader2 } from 'lucide-react'

export default function CustomerLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Redirect if already logged in as customer
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('customerToken') : null;
    if (token) {
      // Verify token is for customer
      axios.get(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1/auth/profile`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      ).then(response => {
        if (response.data && response.data.role === 'customer') {
          router.push('/');
        }
      }).catch(() => {
        localStorage.removeItem('customerToken');
        localStorage.removeItem('customer');
      });
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1/auth/login`,
        { email, password },
        { withCredentials: true }
      )

      if (response.data && response.data.accessToken) {
        // Check if user is a customer
        if (response.data.user && response.data.user.role === 'customer') {
          localStorage.setItem("customerToken", response.data.accessToken);
          localStorage.setItem("customer", JSON.stringify(response.data.user));
          router.push('/');
        } else {
          setError('This login page is for customers only. Please use the provider login.');
        }
      }
    } catch (err: any) {
      console.error('Login error:', err)
      if (err.response?.status === 401) {
        setError('Invalid email or password')
      } else if (err.response?.data?.message) {
        setError(err.response.data.message)
      } else {
        setError('Login failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: 'calc(100vh - 80px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f9fafb',
      padding: '48px 24px'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        padding: '48px',
        borderRadius: '12px',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            backgroundColor: '#059669',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto'
          }}>
            <span style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#ffffff'
            }}>
              R
            </span>
          </div>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#1f2937',
            marginBottom: '8px'
          }}>
            Customer Sign In
          </h1>
          <p style={{
            fontSize: '16px',
            color: '#6b7280'
          }}>
            Access your customer account
          </p>
          <p style={{
            fontSize: '14px',
            color: '#6b7280',
            marginTop: '8px'
          }}>
            Don't have an account?{' '}
            <Link href="/auth/customer/register" style={{
              color: '#059669',
              textDecoration: 'none',
              fontWeight: '600'
            }}>
              Sign up as a customer
            </Link>
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          {error && (
            <div style={{
              backgroundColor: '#fee2e2',
              border: '1px solid #fca5a5',
              color: '#dc2626',
              padding: '12px',
              borderRadius: '6px',
              marginBottom: '16px',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '6px'
            }}>
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '16px',
                backgroundColor: '#ffffff',
                outline: 'none',
                transition: 'border-color 0.2s ease-in-out'
              }}
              onFocus={(e) => (e.target as HTMLInputElement).style.borderColor = '#059669'}
              onBlur={(e) => (e.target as HTMLInputElement).style.borderColor = '#d1d5db'}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '6px'
            }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                style={{
                  width: '100%',
                  padding: '12px',
                  paddingRight: '48px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '16px',
                  backgroundColor: '#ffffff',
                  outline: 'none',
                  transition: 'border-color 0.2s ease-in-out'
                }}
                onFocus={(e) => (e.target as HTMLInputElement).style.borderColor = '#059669'}
                onBlur={(e) => (e.target as HTMLInputElement).style.borderColor = '#d1d5db'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#6b7280',
                  padding: '4px'
                }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '8px'
            }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                fontSize: '14px',
                color: '#6b7280',
                cursor: 'pointer'
              }}>
                <input
                  type="checkbox"
                  style={{
                    marginRight: '8px',
                    accentColor: '#059669'
                  }}
                />
                Remember me
              </label>
              <Link href="/auth/customer/forgot-password" style={{
                fontSize: '14px',
                color: '#059669',
                textDecoration: 'none',
                fontWeight: '500'
              }}>
                Forgot your password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: loading ? '#9ca3af' : '#059669',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'background-color 0.2s ease-in-out'
            }}
          >
            {loading && <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />}
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        {/* Provider Login Link */}
        <div style={{
          marginTop: '32px',
          padding: '16px',
          backgroundColor: '#f3f4f6',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <p style={{
            fontSize: '14px',
            color: '#6b7280',
            margin: '0 0 8px 0'
          }}>
            Are you a service provider?
          </p>
          <Link href="/auth/provider/login" style={{
            fontSize: '14px',
            color: '#059669',
            textDecoration: 'none',
            fontWeight: '600'
          }}>
            Sign in to Provider Dashboard →
          </Link>
        </div>
      </div>
    </div>
  )
}
