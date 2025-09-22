import Footer from '../components/Footer';
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

// Mock services data commented out to prevent bugs
// Will be replaced with real API data when services section is reactivated
/*
const mockServices = [
  {
    category: 'Haircuts',
    image: 'https://images.pexels.com/photos/3993427/pexels-photo-3993427.jpeg?auto=compress&cs=tinysrgb&w=640&h=480&dpr=2',
    shops: [
      { name: 'Urban Cuts', rating: 4.8, address: 'Downtown', price: '$25' },
      { name: 'Classic Barbers', rating: 4.6, address: 'Main Street', price: '$30' },
      { name: 'Shear Genius', rating: 4.9, address: 'Market Ave', price: '$28' },
    ]
  },
  {
    category: 'Massages',
    image: 'https://images.pexels.com/photos/3757942/pexels-photo-3757942.jpeg?auto=compress&cs=tinysrgb&w=640&h=480&dpr=2',
    shops: [
      { name: 'Relax Spa', rating: 4.7, address: 'Wellness Blvd', price: '$50' },
      { name: 'Therapy Touch', rating: 4.5, address: 'Elm Street', price: '$45' },
    ]
  },
  {
    category: 'Facials',
    image: 'https://images.pexels.com/photos/3985363/pexels-photo-3985363.jpeg?auto=compress&cs=tinysrgb&w=640&h=480&dpr=2',
    shops: [
      { name: 'Glow Studio', rating: 4.9, address: 'Beauty Lane', price: '$40' },
      { name: 'Fresh Face', rating: 4.8, address: 'Sunset Ave', price: '$38' },
    ]
  }
];
*/

export default function HomePage() {

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - 100% Design Match */}
      <section style={{
        width: '100vw',
        minHeight: '480px',
        background: 'linear-gradient(90deg, rgba(34,197,94,0.04) 0%, rgba(255,255,255,1) 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        padding: '0',
      }}>
        <div style={{
          width: '100%',
          maxWidth: 1400,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 60px',
        }}>
          {/* Left - Text */}
          <div style={{ flex: 1, minWidth: 0, zIndex: 2 }}>
            <h1 style={{
              fontSize: '2.8rem',
              fontWeight: 800,
              color: '#222',
              lineHeight: 1.15,
              marginBottom: 18,
              fontFamily: 'Manrope, sans-serif',
            }}>
              Find <span style={{
                background: '#10b981',
                color: '#fff',
                borderRadius: 6,
                padding: '1px 8px',
                fontWeight: 600,
                fontStyle: 'italic',
                display: 'inline-block',
                transform: 'skew(-10deg)',
                boxShadow: '2px 2px 0 #fff, 2px 2px 0 #fff',
                marginRight: 2
              }}>Trusted Providers</span> &<br />
              <span style={{
                background: '#10b981',
                color: '#fff',
                borderRadius: 6,
                padding: '2px 10px',
                fontWeight: 600,
                fontStyle: 'italic',
                display: 'inline-block',
                transform: 'skew(-10deg)',
                boxShadow: '2px 2px 0 #fff, 2px 2px 0 #fff',
                marginRight: 2
              }}>Book Services</span> at the<br />
              Best Prices
            </h1>
            <p style={{ fontSize: 14, color: '#374151', marginBottom: 32, maxWidth: 500 }}>
              Search for top-rated beauty, wellness, and healthcare providers near you.
            </p>
            <div style={{ display: 'flex', gap: 12, marginBottom: 18 }}>
              <input type="text" placeholder="Search..." style={{ padding: '12px 16px', borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 16, width: 180 }} />
              <select style={{ padding: '12px 16px', borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 16, width: 140 }}>
                <option>Select...</option>
              </select>
              <button style={{ background: '#10b981', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 28px', fontWeight: 700, fontSize: 16, cursor: 'pointer', boxShadow: '0 2px 8px rgba(16,185,129,0.13)' }}>
                Find Providers
              </button>
            </div>
            <div style={{ color: '#6b7280', fontSize: 15, marginTop: 8 }}>
              Popular Searches: Haircuts, Massage, Repair
            </div>
          </div>
          {/* Right - Image with overlay */}
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            position: 'relative',
            minWidth: 0,
          }}>
            <div style={{
              position: 'relative',
              width: 340,
              height: 380,
              borderRadius: 18,
              overflow: 'hidden',
              boxShadow: '0 8px 32px rgba(0,0,0,0.13)',
              border: '6px solid #fff',
              background: '#eee',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <img src="https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&w=640&h=480" alt="Provider" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              {/* Play button overlay */}
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 64,
                height: 64,
                background: '#fff',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
                cursor: 'pointer',
                zIndex: 2,
              }}>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="16" fill="#fff" /><polygon points="13,10 23,16 13,22" fill="#ec4899" /></svg>
              </div>
              {/* Small overlapping image */}
              <div style={{
                position: 'absolute',
                right: '-40px',
                bottom: '-40px',
                width: 120,
                height: 120,
                borderRadius: 16,
                overflow: 'hidden',
                boxShadow: '0 4px 16px rgba(0,0,0,0.13)',
                border: '4px solid #fff',
                background: '#eee',
                zIndex: 3,
              }}>
                <img src="https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&w=640&h=480" alt="Small" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </div>
          </div>
        </div>
  </section>
  <section className="browse-services" style={{ width: '100vw', background: '#fff', padding: '0', minHeight: '540px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
        <div style={{ width: '100%', maxWidth: '1400px', margin: '0 auto', padding: 0 }}>
          <h2 style={{ textAlign: 'center', margin: 0, fontSize: '2.2rem', fontWeight: 800, fontFamily: 'Manrope, sans-serif', letterSpacing: '-0.5px' }}>Browse Services</h2>
          <p style={{
            fontSize: '15px',
            color: '#6b7280',
            margin: '8px auto 44px auto',
            textAlign: 'center',
            maxWidth: '600px',
            lineHeight: 1.5
          }}>
            Browse and book top-rated services from trusted providers near you. Compare options, read reviews, and find the perfect match for your beauty, wellness, and healthcare needs.
          </p>
          {/* Services section commented out to remove static data
          <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: '320px', marginTop: 0, gap: 32 }}>
            {mockServices.map(service => (
              <div key={service.category} style={{
                width: '340px',
                borderRadius: '18px',
                overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.13)',
                background: `linear-gradient(rgba(0, 0, 0, 0.18), rgba(0, 0, 0, 0.28)), url('${service.image}') center center / cover no-repeat`,
                minHeight: 260,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                position: 'relative',
              }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }} />
                <div style={{ position: 'relative', zIndex: 2, padding: 22, color: '#fff', width: '100%' }}>
                  <h3 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 8px 0', fontFamily: 'Manrope, sans-serif', letterSpacing: '-0.5px' }}>{service.category}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#fff', opacity: 0.92 }}>{service.shops.length}</span>
                    <span style={{ fontSize: 15, marginRight: 2 }}>🏆</span>
                    <span style={{ fontSize: 13, opacity: 0.92, fontWeight: 500 }}>Top-Rated Professionals</span>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.13)', borderRadius: 10, padding: 10, marginTop: 8 }}>
                    {service.shops.map(shop => (
                      <div key={shop.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                        <div>
                          <span style={{ fontWeight: 700 }}>{shop.name}</span>
                          <span style={{ color: '#d1fae5', fontSize: 13, marginLeft: 8 }}>({shop.address})</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ color: '#fbbf24', fontWeight: 700 }}>{shop.rating}★</span>
                          <span style={{ color: '#fff', fontWeight: 600 }}>{shop.price}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          */}
        </div>
      </section>

      {/* Become a Provider Section - 100% Design Match */}
      <section style={{
        padding: '100px 0',
        backgroundColor: '#ffffff'
      }}>
        <div style={{ 
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'stretch',
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.1)',
            backgroundColor: '#ffffff',
            height: '500px'
          }}>
            {/* Left Side - Image */}
            <div style={{
              flex: '1',
              position: 'relative',
              backgroundImage: 'url("https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}>
              {/* Play button overlay */}
              <div style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                width: '60px',
                height: '60px',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
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
                  marginLeft: '3px'
                }}></i>
              </div>
            </div>

            {/* Right Side - Content */}
            <div style={{
              flex: '1',
              backgroundColor: '#d4f4dd',
              padding: '60px 50px',
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
                Join thousands of trusted service providers and grow your business. Reach more customers, manage bookings easily, and get paid securely.
              </p>

              {/* Features list */}
              <div style={{ marginBottom: '40px' }}>
                {/* Feature 1 */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '16px'
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
                    fontSize: '16px',
                    color: '#1f2937',
                    fontWeight: '500',
                    fontFamily: 'Manrope, sans-serif'
                  }}>
                    Get more customers
                  </span>
                </div>

                {/* Feature 2 */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '16px'
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
                    fontSize: '16px',
                    color: '#1f2937',
                    fontWeight: '500',
                    fontFamily: 'Manrope, sans-serif'
                  }}>
                    Manage your schedule
                  </span>
                </div>

                {/* Feature 3 */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '16px'
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
                    fontSize: '16px',
                    color: '#1f2937',
                    fontWeight: '500',
                    fontFamily: 'Manrope, sans-serif'
                  }}>
                    Secure payments
                  </span>
                </div>

                {/* Feature 4 */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '16px'
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
                    fontSize: '16px',
                    color: '#1f2937',
                    fontWeight: '500',
                    fontFamily: 'Manrope, sans-serif'
                  }}>
                    Build your reputation
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
                alignSelf: 'flex-start',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
              }}>
                Join as Provider
              </button>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}
