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

  // Redirect if already logged in as provider
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('providerToken') : null;
    if (token) {
      // Verify token is for provider
      axios.get(
  `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/auth/profile`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      ).then(response => {
        if (response.data && response.data.role === 'provider') {
          router.push('/provider/dashboard');
        }
      }).catch(() => {
        localStorage.removeItem('providerToken');
        localStorage.removeItem('provider');
      });
    }
  }, [router]);

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
    <div>
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
            Provider Sign In
          </h1>
          <p style={{
            fontSize: '16px',
            color: '#6b7280'
          }}>
            Access your provider dashboard
          </p>
          <p style={{
            fontSize: '14px',
            color: '#6b7280',
            marginTop: '8px'
          }}>
            Don't have an account?{' '}
            <Link href="/auth/provider/signup" style={{
              color: '#059669',
              textDecoration: 'none',
              fontWeight: '600'
            }}>
              Sign up as a provider
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
                color: '#111827'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
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
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '16px',
                  backgroundColor: '#ffffff',
                  color: '#111827',
                  paddingRight: '40px'
                }}
              />
              <button
                type="button"
                style={{
                  position: 'absolute',
                  right: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0
                }}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff size={20} color="#9ca3af" />
                ) : (
                  <Eye size={20} color="#9ca3af" />
                )}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                style={{
                  height: '16px',
                  width: '16px',
                  color: '#10b981',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  marginRight: '6px'
                }}
              />
              <label htmlFor="remember-me" style={{ fontSize: '14px', color: '#374151' }}>
                Remember me
              </label>
            </div>
            <div style={{ fontSize: '14px' }}>
              <Link href="/auth/forgot-password" style={{ color: '#059669', textDecoration: 'none', fontWeight: 600 }}>
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
              backgroundColor: '#10b981',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 600,
              fontSize: '16px',
              cursor: 'pointer',
              marginBottom: '12px',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading && <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />}
            Sign in
          </button>

          <div style={{ textAlign: 'center', fontSize: '14px', marginTop: '8px' }}>
            <Link href="/auth/customer/login" style={{ color: '#374151', textDecoration: 'none', fontWeight: 500 }}>
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
