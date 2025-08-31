'use client'

import Link from 'next/link'
import { 
  Search, 
  Calendar, 
  Shield, 
  Star, 
  Clock, 
  Users, 
  CheckCircle,
  ArrowRight,
  Scissors,
  Wrench,
  Heart,
  Briefcase,
  Home,
  Car,
  ChevronLeft,
  ChevronRight,
  User,
  MapPin,
  ChevronDown
} from 'lucide-react'

export default function HomePage() {
  const features = [
    {
      icon: Search,
      title: 'Find Services',
      description: 'Browse trusted professionals in your area'
    },
    {
      icon: Calendar,
      title: 'Book Online',
      description: 'Schedule appointments with ease'
    },
    {
      icon: Shield,
      title: 'Secure Payment',
      description: 'Safe and protected transactions'
    }
  ]

  const categories = [
    {
      icon: Scissors,
      name: 'Beauty & Wellness',
      count: '1,200+ services',
      color: 'from-pink-400 to-pink-600'
    },
    {
      icon: Wrench,
      name: 'Home Services',
      count: '800+ professionals',
      color: 'from-blue-400 to-blue-600'
    },
    {
      icon: Heart,
      name: 'Health & Fitness',
      count: '600+ providers',
      color: 'from-green-400 to-green-600'
    }
  ]

  const howItWorks = [
    {
      step: '01',
      title: 'Search & Discover',
      description: 'Find the perfect service provider near you',
      icon: Search
    },
    {
      step: '02',
      title: 'Compare & Choose',
      description: 'Review profiles, ratings, and pricing options',
      icon: Star
    },
    {
      step: '03',
      title: 'Book & Confirm',
      description: 'Schedule your appointment and receive instant confirmation',
      icon: Calendar
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Browse Services Section - Exact Design Match */}
    

      {/* Become a Provider Section - Exact Design Match */}
      <section style={{
        padding: '100px 0',
        backgroundColor: '#ffffff'
      }}>
        <div className="container" style={{ 
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 20px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0',
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.1)',
            backgroundColor: '#ffffff'
          }}>
            {/* Left Side - Image */}
            <div style={{
              flex: '1',
              backgroundColor: '#f8f9fa',
              height: '500px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              background: 'url("https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2") center center / cover no-repeat'
            }}>
              {/* Play button overlay */}
              <div style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                width: '60px',
                height: '60px',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
              }}>
                <i className="fa-solid fa-play" style={{
                  color: '#10b981',
                  fontSize: '20px',
                  transform: 'translateX(2px)'
                }}></i>
              </div>
            </div>

            {/* Right Side - Content */}
            <div style={{
              flex: '1',
              backgroundColor: '#d4f4dd',
              padding: '60px 50px',
              height: '500px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}>
              {/* Small title */}
              <p style={{
                fontSize: '14px',
                color: '#10b981',
                fontWeight: '600',
                marginBottom: '12px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontFamily: 'Manrope, sans-serif'
              }}>
                Become a Provider
              </p>

              {/* Main title */}
              <h2 style={{
                fontSize: '36px',
                fontWeight: '800',
                color: '#1f2937',
                lineHeight: '1.2',
                marginBottom: '16px',
                fontFamily: 'Manrope, sans-serif'
              }}>
                List Your Services on Reservista
              </h2>

              {/* Subtitle */}
              <p style={{
                fontSize: '16px',
                color: '#6b7280',
                lineHeight: '1.5',
                marginBottom: '32px',
                fontFamily: 'Manrope, sans-serif'
              }}>
                Reach more clients, manage your appointments, and get paid securely.
              </p>

              {/* Features list */}
              <div style={{ marginBottom: '40px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '12px'
                }}>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    backgroundColor: '#10b981',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '12px',
                    flexShrink: 0
                  }}>
                    <i className="fa-solid fa-check" style={{
                      color: '#ffffff',
                      fontSize: '10px'
                    }}></i>
                  </div>
                  <span style={{
                    fontSize: '14px',
                    color: '#1f2937',
                    fontWeight: '500',
                    fontFamily: 'Manrope, sans-serif'
                  }}>
                    Hassle-booking & Scheduling Management
                  </span>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '12px'
                }}>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    backgroundColor: '#10b981',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '12px',
                    flexShrink: 0
                  }}>
                    <i className="fa-solid fa-check" style={{
                      color: '#ffffff',
                      fontSize: '10px'
                    }}></i>
                  </div>
                  <span style={{
                    fontSize: '14px',
                    color: '#1f2937',
                    fontWeight: '500',
                    fontFamily: 'Manrope, sans-serif'
                  }}>
                    Secure Payment via Stripe
                  </span>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '12px'
                }}>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    backgroundColor: '#10b981',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '12px',
                    flexShrink: 0
                  }}>
                    <i className="fa-solid fa-check" style={{
                      color: '#ffffff',
                      fontSize: '10px'
                    }}></i>
                  </div>
                  <span style={{
                    fontSize: '14px',
                    color: '#1f2937',
                    fontWeight: '500',
                    fontFamily: 'Manrope, sans-serif'
                  }}>
                    24/7 Customer Support
                  </span>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '12px'
                }}>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    backgroundColor: '#10b981',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '12px',
                    flexShrink: 0
                  }}>
                    <i className="fa-solid fa-check" style={{
                      color: '#ffffff',
                      fontSize: '10px'
                    }}></i>
                  </div>
                  <span style={{
                    fontSize: '14px',
                    color: '#1f2937',
                    fontWeight: '500',
                    fontFamily: 'Manrope, sans-serif'
                  }}>
                    Top-Rated & Verified Professionals
                  </span>
                </div>
              </div>

              {/* CTA Button */}
              <button style={{
                backgroundColor: '#10b981',
                color: '#ffffff',
                padding: '16px 32px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                fontFamily: 'Manrope, sans-serif',
                transition: 'all 0.3s ease',
                alignSelf: 'flex-start'
              }}>
                Join Now as a Provider
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
