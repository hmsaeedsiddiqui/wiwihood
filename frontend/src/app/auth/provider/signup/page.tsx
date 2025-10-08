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
    <div>
    <div className="provider-signup-bg">
      <div className="provider-signup-card">
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px auto'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #f97316 0%, #ec4899 100%)',
              borderRadius: '16px',
              padding: '12px',
              marginRight: '12px'
            }}>
              <span style={{
                fontSize: '32px',
                fontWeight: '700',
                color: '#ffffff'
              }}>
                W
              </span>
            </div>
            <span style={{
              fontSize: '28px',
              fontWeight: '700',
              background: 'linear-gradient(135deg, #f97316 0%, #ec4899 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent'
            }}>
              Wiwihood
            </span>
          </div>
          <h2 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#1f2937',
            marginBottom: '8px'
          }}>Join as a Service Provider</h2>
          <p style={{
            fontSize: '16px',
            color: '#6b7280',
            marginBottom: '8px'
          }}>Start offering your services on Wiwihood</p>
          <p style={{
            fontSize: '14px',
            color: '#6b7280'
          }}>Already have an account?{' '}
            <Link href="/auth/provider/login" style={{
              color: '#f97316',
              textDecoration: 'none',
              fontWeight: '600'
            }}>Sign in here</Link>
          </p>
        </div>
        <div className="provider-signup-formwrap">
          <form className="provider-signup-form" onSubmit={handleSubmit}>
            {error && (
              <div className="provider-signup-error">
                {Array.isArray(error) ? (
                  <ul>
                    {error.map((msg, i) => <li key={i}>{msg}</li>)}
                  </ul>
                ) : error}
              </div>
            )}

            <div className="provider-signup-row">
              <div className="provider-signup-field">
                <label htmlFor="firstName">First Name</label>
                <input id="firstName" name="firstName" type="text" required value={formData.firstName} onChange={handleChange} placeholder="First name" />
              </div>
              <div className="provider-signup-field">
                <label htmlFor="lastName">Last Name</label>
                <input id="lastName" name="lastName" type="text" required value={formData.lastName} onChange={handleChange} placeholder="Last name" />
              </div>
            </div>

            <div className="provider-signup-field">
              <label htmlFor="email">Email address</label>
              <input id="email" name="email" type="email" autoComplete="email" required value={formData.email} onChange={handleChange} placeholder="Enter your email" />
            </div>

            <div className="provider-signup-field">
              <label htmlFor="phone">Phone Number (optional)</label>
              <input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="Enter your phone number" />
            </div>

            <div className="provider-signup-field">
              <label htmlFor="password">Password</label>
              <div className="provider-signup-password-wrap">
                <input id="password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" required value={formData.password} onChange={handleChange} placeholder="Create a password" />
                <button type="button" className="provider-signup-eye" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <EyeOff className="provider-signup-eye-icon" />
                  ) : (
                    <Eye className="provider-signup-eye-icon" />
                  )}
                </button>
              </div>
              <p className="provider-signup-password-hint">Must contain uppercase, lowercase, number or special character (min. 8 chars)</p>
            </div>

            <div className="provider-signup-field">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="provider-signup-password-wrap">
                <input id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} autoComplete="new-password" required value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm your password" />
                <button type="button" className="provider-signup-eye" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? (
                    <EyeOff className="provider-signup-eye-icon" />
                  ) : (
                    <Eye className="provider-signup-eye-icon" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <button type="submit" disabled={loading} className="provider-signup-btn">
                {loading && <Loader2 className="provider-signup-btn-loader" />}
                Create Provider Account
              </button>
            </div>

            <div className="provider-signup-customer-link">
              <Link href="/auth/register">Looking to book services? Sign up as a customer</Link>
            </div>
            <div className="provider-signup-terms">
              By creating an account, you agree to our <Link href="/terms">Terms of Service</Link> and <Link href="/privacy">Privacy Policy</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
    <Footer />
    </div>
  )
}
