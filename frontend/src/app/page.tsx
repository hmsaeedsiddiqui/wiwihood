"use client";

import React, { useState, useEffect } from "react";
import Footer from "../components/Footer";
import Link from 'next/link';
import { apiService, Category } from '@/lib/api';
import { 
  Search, 
  Calendar, 
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
  ChevronDown,
  Shield
} from 'lucide-react';

const HomePage = () => {
  useEffect(() => {
    fetchServiceCards();
  }, []);

  // Fetch dynamic service cards from API
  const fetchServiceCards = async () => {
    try {
  // Fetch services (limit 3, no unsupported params)
  const response = await apiService.getServices();
  const services = Array.isArray(response) ? response.slice(0, 3) : (response.data || []).slice(0, 3);
      // Map API data to ServiceCard model
      const cards = services.map((service: any) => ({
        id: service.id,
        name: service.name,
        description: service.description,
        providerName: service.provider?.businessName || '',
        providerId: service.provider?.id || '',
        providerAvatar: service.provider?.logoPublicId || '',
        discount: service.discount || 0,
        price: service.basePrice,
        oldPrice: service.oldPrice || service.basePrice,
        rating: service.averageRating || 5,
        reviews: service.totalReviews || 0,
        imageUrl:
          service.images && service.images.length > 0 && service.images[0]
            ? (service.images[0].startsWith('http')
                ? service.images[0]
                : `https://res.cloudinary.com/djgdfq23e/image/upload/${service.images[0]}`)
          : service.imageUrl && service.imageUrl.startsWith('http')
            ? service.imageUrl
          : service.imageUrl && service.imageUrl.length > 0
            ? `https://res.cloudinary.com/djgdfq23e/image/upload/${service.imageUrl}`
          : 'https://via.placeholder.com/640x480',
        slots: service.availableSlots || 0,
        isTopRated: service.isTopRated || false,
      }));
      setServiceCards(cards);
    } catch (error) {
      setServiceCards([]);
    }
  };
  const [dbCategories, setDbCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const categories = await apiService.getCategories(true); // Fetch active categories
      setDbCategories(categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setDbCategories([]); // Clear categories on error
    } finally {
      setLoadingCategories(false);
    }
  };

  // Service card data model
  type ServiceCard = {
    id: string;
    name: string;
    description: string;
    providerName: string;
    providerId: string;
    providerAvatar?: string;
    discount: number;
    price: number;
    oldPrice: number;
    rating: number;
    reviews: number;
    imageUrl: string;
    slots: number;
    isTopRated?: boolean;
  };

  // Dynamic service cards state
  const [serviceCards, setServiceCards] = useState<ServiceCard[]>([]);

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

  return (
    <div className="min-h-screen bg-white">
      {/* HERO SECTION - 100% MATCHED TO ORIGINAL DESIGN */}
      <section
        style={{
          width: '100%',
          minHeight: 540,
          background: `linear-gradient(rgba(34, 40, 49, 0.45), rgba(34, 40, 49, 0.45)), url('https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=1500&q=80') center/cover no-repeat`,
          position: 'relative',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '0',
          overflow: 'hidden',
        }}
      >
        {/* Diagonal White Cut */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            width: '100%',
            height: 120,
            background: '#fff',
            transform: 'skewY(-4deg)',
            transformOrigin: 'bottom right',
            zIndex: 2,
          }}
        />
        <div
          style={{
            position: 'relative',
            zIndex: 3,
            width: '100%',
            maxWidth: 1300,
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            padding: '60px 0 0 0',
            minHeight: 540,
          }}
        >
          {/* LEFT: HERO TEXT & SEARCH */}
          <div
            style={{
              flex: 1.2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'center',
              padding: '0 0 0 60px',
              minWidth: 0,
              maxWidth: 600,
            }}
          >
            <h1
              style={{
                fontFamily: 'Manrope, sans-serif',
                fontWeight: 800,
                fontSize: '2.8rem',
                lineHeight: 1.13,
                color: '#fff',
                marginBottom: 18,
                textAlign: 'left',
              }}
            >
              Find <span className="highlight-green" style={{ fontStyle: 'italic', fontWeight: 700, fontSize: '2.2rem', background: 'var(--color-green)', color: '#fff', borderRadius: 6, padding: '2px 14px', margin: '0 2px', boxDecorationBreak: 'clone', WebkitBoxDecorationBreak: 'clone', border: '2px solid #fff', display: 'inline-block' }}>Trusted Providers</span> &<br />
              <span className="highlight-green" style={{ fontStyle: 'italic', fontWeight: 700, fontSize: '2.2rem', background: 'var(--color-green)', color: '#fff', borderRadius: 6, padding: '2px 14px', margin: '0 2px', boxDecorationBreak: 'clone', WebkitBoxDecorationBreak: 'clone', border: '2px solid #fff', display: 'inline-block' }}>Book Services</span> at the<br />
              Best Prices
            </h1>
            <p style={{ color: '#fff', fontSize: 18, fontWeight: 500, marginBottom: 32, textAlign: 'left', textShadow: '0 2px 8px rgba(0,0,0,0.18)' }}>
              Search for top-rated beauty, wellness, and healthcare providers near you.
            </p>
            {/* SEARCH BAR */}
            <div style={{ width: '100%', maxWidth: 520, marginBottom: 18 }}>
              <div style={{ display: 'flex', gap: 8, background: '#fff', borderRadius: 12, boxShadow: '0 4px 24px rgba(16,185,129,0.10)', padding: 8, alignItems: 'center' }}>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, background: '#f3f4f6', borderRadius: 8, padding: '8px 14px' }}>
                  <i className="fa fa-search" style={{ color: '#9ca3af', fontSize: 18 }}></i>
                  <input type="text" placeholder="Search..." style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: 16, width: '100%' }} />
                </div>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, background: '#f3f4f6', borderRadius: 8, padding: '8px 14px' }}>
                  <i className="fa fa-map-marker-alt" style={{ color: '#9ca3af', fontSize: 18 }}></i>
                  <select style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: 16, width: '100%' }}>
                    <option>Select...</option>
                  </select>
                </div>
                <button style={{ background: 'var(--color-green)', color: '#fff', fontWeight: 700, fontSize: 17, border: 'none', borderRadius: 8, padding: '12px 32px', cursor: 'pointer', transition: 'background 0.2s', boxShadow: '0 2px 8px rgba(16,185,129,0.10)' }}>Find Providers</button>
              </div>
            </div>
            <div style={{ color: '#fff', fontSize: 15, fontWeight: 500, marginTop: 8, textAlign: 'left', textShadow: '0 2px 8px rgba(0,0,0,0.18)' }}>
              Popular Searches: Haircuts, Massage, Facials.
            </div>
          </div>
          {/* RIGHT: VIDEO/IMAGE CARD */}
          <div
            style={{
              flex: 0.9,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              minWidth: 0,
              paddingRight: 60,
              marginTop: 18,
            }}
          >
            <div style={{
              width: 320,
              height: 420,
              background: '#fff',
              borderRadius: 24,
              boxShadow: '0 8px 32px rgba(16,185,129,0.13)',
              overflow: 'hidden',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '6px solid #fff',
            }}>
              <img
                src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&w=640&h=800&q=80"
                alt="Provider Video"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              {/* Play button overlay */}
              <button style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 64,
                height: 64,
                background: '#fff',
                borderRadius: '50%',
                border: '4px solid #fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
                cursor: 'pointer',
                zIndex: 2,
                transition: 'box-shadow 0.2s',
              }}>
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="14" cy="14" r="14" fill="#fff" />
                  <polygon points="11,9.5 20,14 11,18.5" fill="#ec4899" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>
      <div style={{ height: 56 }} />
      <section style={{ background: '#fff', padding: '48px 0 0 0', margin: '0 auto', maxWidth: 1200 }}>
        <h2 style={{ textAlign: 'center', fontSize: '2.2rem', fontWeight: 800, marginBottom: 12, fontFamily: 'Manrope, sans-serif' }}>Browse Services</h2>
        <p style={{ textAlign: 'center', color: '#6b7280', fontSize: 17, marginBottom: 38, fontWeight: 500, maxWidth: 600, marginLeft: 'auto', marginRight: 'auto' }}>
          Browse and book top-rated services from trusted providers near you. Compare options, read reviews, and find the perfect match for your beauty, wellness, and healthcare needs.
        </p>
        <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 240 }}>
          {/* Left Arrow Button */}
          <button
            style={{
              position: 'absolute',
              left: -32,
              zIndex: 2,
              top: '50%',
              transform: 'translateY(-50%)',
              background: '#fff',
              border: 'none',
              borderRadius: '16px',
              boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
              width: 48,
              height: 48,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              outline: 'none',
              transition: 'box-shadow 0.2s',
            }}
            aria-label="Previous"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          {/* Cards */}
          <div style={{ display: 'flex', gap: 24, width: '100%' }}>
            {dbCategories.map((category) => {
              const bannerImages = category.bannerImage ? category.bannerImage.split(',').map(url => url.replace(/"/g, '').trim()) : [];
              const imageUrl = bannerImages.length > 0 ? bannerImages[0] : category.services?.[0]?.images?.[0] || 'https://via.placeholder.com/640x480';

              return (
                <Link
                  key={category.id}
                  href={`/browse?categoryId=${category.id}`}
                  style={{ flex: 1, height: 280, borderRadius: 16, overflow: 'hidden', background: '#fff', boxShadow: '0 4px 24px rgba(0,0,0,0.10)', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', cursor: 'pointer', minWidth: 0, maxWidth: 'none' }}
                >
                  <img src={imageUrl} alt={category.name} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 1 }} />
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(180deg,rgba(0,0,0,0.10) 60%,rgba(0,0,0,0.38) 100%)', zIndex: 2 }} />
                  <div style={{ position: 'relative', zIndex: 3, padding: '0 0 18px 18px', color: '#fff' }}>
                    <div style={{ fontSize: 19, fontWeight: 700, marginBottom: 6 }}>{category.name}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 15, fontWeight: 600 }}>{category.services?.length || 0}</span>
                      <svg width="16" height="16" fill="#fbbf24" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                      <span style={{ fontSize: 13, fontWeight: 500 }}>Top-Rated Professionals</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
          {/* Right Arrow Button */}
          <button
            style={{
              position: 'absolute',
              right: -32,
              zIndex: 2,
              top: '50%',
              transform: 'translateY(-50%)',
              background: '#fff',
              border: 'none',
              borderRadius: '16px',
              boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
              width: 48,
              height: 48,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              outline: 'none',
              transition: 'box-shadow 0.2s',
            }}
            aria-label="Next"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        </div>
      </section>



      {/* Testimonials Section - 100% Design Match */}


      {/* Latest Updates Section */}


      {/* Become a Provider Section - 100% Design Match */}
      <section style={{
        padding: '90px 0',
        backgroundColor: '#fff',
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'stretch',
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.10)',
            backgroundColor: '#fff',
            minHeight: '440px',
            height: '500px',
          }}>
            {/* Left Side - Images Container */}
            <div style={{
              flex: '1',
              minWidth: 0,
              position: 'relative',
              backgroundColor: '#f6f8f7',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {/* Main large image - matches design */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '450px',
                height: '400px',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(0,0,0,0.13)',
                background: '#eee',
                zIndex: 1,
              }}>
                <img
                  src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&w=640&h=800&q=80"
                  alt="Professional Provider"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                {/* Play button overlay */}
                <div style={{
                  position: 'absolute',
                  top: '20%',
                  left: '100%',
                  transform: 'translate(-50%, -50%)',
                  width: '44px',
                  height: '44px',
                  backgroundColor: '#fff',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
                  cursor: 'pointer',
                  zIndex: 2,
                  border: '2px solid #e5e7eb',
                }}>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="9" cy="9" r="9" fill="#fff" />
                    <polygon points="7,5.5 13,9 7,12.5" fill="#10b981" />
                  </svg>
                </div>
              </div>
              {/* Smaller overlapping image - matches design */}
              <div style={{
                position: 'absolute',
                left: '330px',
                bottom: '10px',
                width: '210px',
                height: '260px',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 4px 16px rgba(0,0,0,0.13)',
                border: '3px solid #fff',
                background: '#eee',
                zIndex: 2,
              }}>
                <img
                  src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=facearea&w=400&h=500&q=80"
                  alt="Provider 2"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            </div>
            {/* Right Side - Content */}
            <div style={{
              flex: '1',
              backgroundColor: '#e7f7ef',
              padding: '56px 44px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              minHeight: '440px',
              height: '100%',
          
            }}>
              {/* Small title */}

              <p style={{
                fontSize: '15px',
                color: '#10b981',
                fontWeight: 600,
                marginBottom: '10px',
                fontFamily: 'Manrope, sans-serif',
                letterSpacing: '0.5px',
              }}>Become a Provider</p>
              <h2 style={{
                fontSize: '2.1rem',
                fontWeight: 800,
                color: '#1f2937',
                lineHeight: 1.18,
                marginBottom: '14px',
                fontFamily: 'Manrope, sans-serif',
              }}>List Your Services on Reservista</h2>
              <p style={{
                fontSize: '16px',
                color: '#374151',
                lineHeight: 1.5,
                marginBottom: '28px',
                fontFamily: 'Manrope, sans-serif',
                maxWidth: 420,
              }}>
                Reach more clients, manage your appointments, and get paid securely.
              </p>

              {/* Features list */}
              <div style={{ marginBottom: '32px' }}>
                {/* Feature 1 */}
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '13px' }}>
                  <span style={{
                    width: 22,
                    height: 22,
                    background: '#10b981',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 12,
                  }}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 6.5L5.5 9L9 4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </span>
                  <span style={{ fontSize: 15, color: '#1f2937', fontWeight: 500, fontFamily: 'Manrope, sans-serif' }}>
                    Instant Booking & Availability Management
                  </span>
                </div>

                {/* Feature 2 */}
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '13px' }}>
                  <span style={{
                    width: 22,
                    height: 22,
                    background: '#10b981',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 12,
                  }}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 6.5L5.5 9L9 4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </span>
                  <span style={{ fontSize: 15, color: '#1f2937', fontWeight: 500, fontFamily: 'Manrope, sans-serif' }}>
                    Secure Payments via Stripe
                  </span>
                </div>

                {/* Feature 3 */}
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '13px' }}>
                  <span style={{
                    width: 22,
                    height: 22,
                    background: '#10b981',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 12,
                  }}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 6.5L5.5 9L9 4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </span>
                  <span style={{ fontSize: 15, color: '#1f2937', fontWeight: 500, fontFamily: 'Manrope, sans-serif' }}>
                    Reach New Clients Near You
                  </span>
                </div>

                {/* Feature 4 */}
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0' }}>
                  <span style={{
                    width: 22,
                    height: 22,
                    background: '#10b981',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 12,
                  }}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 6.5L5.5 9L9 4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </span>
                  <span style={{ fontSize: 15, color: '#1f2937', fontWeight: 500, fontFamily: 'Manrope, sans-serif' }}>
                    Top-Rated & Verified Professionals
                  </span>
                </div>
              </div>

              {/* CTA Button */}
              <button style={{
                backgroundColor: '#10b981',
                color: '#fff',
                padding: '13px 32px',
                borderRadius: '7px',
                border: 'none',
                fontSize: '16px',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'Manrope, sans-serif',
                transition: 'all 0.2s',
                alignSelf: 'flex-start',
                boxShadow: '0 2px 8px rgba(16,185,129,0.13)',
                marginTop: 8,
              }}>
                Join Now as a Provider
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* How it's Work Section - 100% Design Match */}
      <section style={{
        width: '100%',
        background: 'linear-gradient(rgba(31, 41, 55, 0.55), rgba(31, 41, 55, 0.55)), url("https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=compress&w=1200&q=80") center center / cover no-repeat',
        padding: '80px 0 100px 0',
        margin: 0,
        boxSizing: 'border-box',
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px',
        }}>
          <h2 style={{
            color: '#fff',
            fontFamily: 'Manrope, sans-serif',
            fontWeight: 800,
            fontSize: '40px',
            textAlign: 'center',
            marginBottom: '16px',
            letterSpacing: '-1px',
          }}>
            How it's Work?
          </h2>
          <p style={{
            color: '#e5e7eb',
            fontFamily: 'Manrope, sans-serif',
            fontWeight: 400,
            fontSize: '16px',
            textAlign: 'center',
            marginBottom: '48px',
            letterSpacing: '0.1px',
            lineHeight: 1.5,
            maxWidth: '700px',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}>
            It's simple to get started with Reservista. Just follow these easy steps to book your next service.
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '32px',
            justifyContent: 'center',
            alignItems: 'stretch',
            width: '100%',
            maxWidth: '1100px',
            margin: '0 auto',
          }}>
            {/* Card 1 */}
            <Link href="/signup" style={{
              background: '#fff',
              borderRadius: '18px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
              padding: '40px 32px 32px 32px',
              minWidth: '320px',
              maxWidth: '340px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              position: 'relative',
              width: '100%',
              textDecoration: 'none',
              color: 'inherit',
              cursor: 'pointer',
            }}>
              <div style={{
                background: '#d4f4dd',
                borderRadius: '12px',
                width: '56px',
                height: '56px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '24px',
              }}>
                <i className="fa-regular fa-id-card" style={{ color: '#10b981', fontSize: '28px' }}></i>
              </div>
              <h3 style={{
                fontFamily: 'Manrope, sans-serif',
                fontWeight: 700,
                fontSize: '22px',
                color: '#1f2937',
                marginBottom: '12px',
              }}>
                Create Your Account
              </h3>
              <p style={{
                fontFamily: 'Manrope, sans-serif',
                fontWeight: 400,
                fontSize: '15px',
                color: '#6b7280',
                lineHeight: 1.6,
                margin: 0,
              }}>
                Sign up for free and create your account to access personalized services and providers.
              </p>
            </Link>
            {/* Card 2 */}
            <Link href="/services" style={{
              background: '#fff',
              borderRadius: '18px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
              padding: '40px 32px 32px 32px',
              minWidth: '320px',
              maxWidth: '340px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              position: 'relative',
              width: '100%',
              textDecoration: 'none',
              color: 'inherit',
              cursor: 'pointer',
            }}>
              <div style={{
                background: '#d4f4dd',
                borderRadius: '12px',
                width: '56px',
                height: '56px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '24px',
              }}>
                <i className="fa-solid fa-scissors" style={{ color: '#10b981', fontSize: '28px' }}></i>
              </div>
              <h3 style={{
                fontFamily: 'Manrope, sans-serif',
                fontWeight: 700,
                fontSize: '22px',
                color: '#1f2937',
                marginBottom: '12px',
              }}>
                Choose Your Service
              </h3>
              <p style={{
                fontFamily: 'Manrope, sans-serif',
                fontWeight: 400,
                fontSize: '15px',
                color: '#6b7280',
                lineHeight: 1.6,
                margin: 0,
              }}>
                Search for services you need, compare providers, and select your preferred option.
              </p>
            </Link>
            {/* Card 3 */}
            <Link href="/book" style={{
              background: '#fff',
              borderRadius: '18px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
              padding: '40px 32px 32px 32px',
              minWidth: '320px',
              maxWidth: '340px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              position: 'relative',
              width: '100%',
              textDecoration: 'none',
              color: 'inherit',
              cursor: 'pointer',
            }}>
              <div style={{
                background: '#d4f4dd',
                borderRadius: '12px',
                width: '56px',
                height: '56px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '24px',
              }}>
                <i className="fa-regular fa-calendar-check" style={{ color: '#10b981', fontSize: '28px' }}></i>
              </div>
              <h3 style={{
                fontFamily: 'Manrope, sans-serif',
                fontWeight: 700,
                fontSize: '22px',
                color: '#1f2937',
                marginBottom: '12px',
              }}>
                Book & Confirm
              </h3>
              <p style={{
                fontFamily: 'Manrope, sans-serif',
                fontWeight: 400,
                fontSize: '15px',
                color: '#6b7280',
                lineHeight: 1.6,
                margin: 0,
              }}>
                Book your service, choose a time, and get an instant confirmation. Enjoy the service at your convenience.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Exclusive Prices Section - 100% Design Match */}
      <section style={{
        width: '100%',
        background: '#f8fafc',
        padding: '80px 0 60px 0',
        margin: 0,
        boxSizing: 'border-box',
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 20px',
        }}>
          <h2 style={{
            color: '#1f2937',
            fontFamily: 'Manrope, sans-serif',
            fontWeight: 800,
            fontSize: '38px',
            textAlign: 'center',
            marginBottom: '10px',
            letterSpacing: '-1px',
          }}>
            Exclusive Prices
          </h2>
          <p style={{
            color: '#6b7280',
            fontFamily: 'Manrope, sans-serif',
            fontWeight: 400,
            fontSize: '16px',
            textAlign: 'center',
            marginBottom: '38px',
            letterSpacing: '0.1px',
            lineHeight: 1.5,
            maxWidth: '600px',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}>
            Browse popular services and enjoy exclusive discounts. Don’t miss out on these limited-time offers!
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '28px',
            marginBottom: '38px',
          }}>
            {serviceCards.map((card) => (
              <div
                key={card.id}
                style={{
                  background: '#fff',
                  borderRadius: '16px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  minHeight: '410px',
                  position: 'relative',
                  cursor: 'pointer',
                }}
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    // Navigate to the correct service detail page with the service ID
                    window.location.href = `/service/${card.id}`;
                  }
                }}
              >
                <div style={{ position: 'relative', width: '100%', height: '180px', overflow: 'hidden' }}>
                  <img src={card.imageUrl} alt={card.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <span style={{ position: 'absolute', top: '14px', left: '14px', background: '#f97316', color: '#fff', fontWeight: 700, fontSize: '15px', borderRadius: '8px', padding: '4px 14px', letterSpacing: '0.5px' }}>{card.discount ? `${card.discount}% OFF` : ''}</span>
                  <button style={{ position: 'absolute', top: '14px', right: '14px', background: 'rgba(255,255,255,0.85)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.10)' }}><i className="fa-regular fa-heart" style={{ color: '#10b981', fontSize: '16px' }}></i></button>
                  {/* Slider dots */}
                  <div style={{ position: 'absolute', left: '50%', bottom: '10px', transform: 'translateX(-50%)', display: 'flex', gap: '6px' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#fbbf24', display: 'inline-block', border: '2px solid #fff' }}></span>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#e5e7eb', display: 'inline-block', border: '2px solid #fff' }}></span>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#e5e7eb', display: 'inline-block', border: '2px solid #fff' }}></span>
                  </div>
                </div>
                <div style={{ padding: '22px 22px 18px 22px', background: '#f3fdf6', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ color: '#6b7280', fontWeight: 500, fontSize: '15px', marginRight: '8px', display: 'flex', alignItems: 'center' }}>
                      <i className="fa-regular fa-user" style={{ marginRight: '6px', fontSize: '16px' }}></i> {card.providerName}
                    </span>
                    {card.isTopRated && (
                      <span style={{ marginLeft: 'auto', background: '#e0f7ec', color: '#10b981', fontWeight: 700, fontSize: '13px', borderRadius: '6px', padding: '3px 14px' }}>Top Rated</span>
                    )}
                  </div>
                  <div style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '19px', color: '#1f2937', marginBottom: '2px' }}>{card.name}</div>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                    <i className="fa-solid fa-star" style={{ color: '#fbbf24', fontSize: '15px', marginRight: '3px' }}></i>
                    <span style={{ color: '#1f2937', fontWeight: 700, fontSize: '15px', marginRight: '4px' }}>{card.rating}</span>
                    <span style={{ color: '#6b7280', fontSize: '14px' }}>({card.reviews})</span>
                  </div>
                  <div style={{
                    color: '#6b7280',
                    fontSize: '15px',
                    fontFamily: 'Manrope, sans-serif',
                    marginBottom: '12px',
                    maxHeight: '54px', // about 3 lines
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                  }}>{card.description}</div>
                  <div style={{ display: 'flex', alignItems: 'flex-end', marginBottom: '0', marginTop: '10px' }}>
                    <span style={{ color: '#ef4444', fontWeight: 800, fontSize: '24px', marginRight: '8px' }}>${card.price}</span>
                    <span style={{ color: '#9ca3af', fontWeight: 600, fontSize: '17px', textDecoration: 'line-through', marginTop: '2px' }}>${card.oldPrice}</span>
                  </div>
                  <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '18px 0 10px 0' }} />
                  <div style={{ color: '#bdbdbd', fontSize: '15px', fontFamily: 'Manrope, sans-serif', marginBottom: '10px', fontWeight: 500 }}>
                    This service is about to run out
                  </div>
                  <div style={{ width: '100%', height: '8px', borderRadius: '4px', overflow: 'hidden', marginBottom: '8px', background: 'linear-gradient(90deg, #ffe259 0%, #ffa751 50%, #ef4444 100%)' }}>
                    <div style={{ width: '100%', height: '100%' }}></div>
                  </div>
                  <div style={{ color: '#6b7280', fontSize: '15px', fontFamily: 'Manrope, sans-serif', marginBottom: '16px', fontWeight: 400 }}>
                    available slots only : <b style={{ fontWeight: 800, color: '#222' }}>{card.slots}</b>
                  </div>
                  
                  {/* Book Now Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card click navigation
                      if (typeof window !== 'undefined') {
                        // Navigate to booking page with service ID and provider ID
                        window.location.href = `/book-service?serviceId=${card.id}&providerId=${card.providerId || 'unknown'}`;
                      }
                    }}
                    style={{
                      width: '100%',
                      background: '#10b981',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '12px 16px',
                      fontWeight: 700,
                      fontSize: '16px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      fontFamily: 'Manrope, sans-serif',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = '#059669';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = '#10b981';
                    }}
                  >
                    Book Now - ${card.price}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Browse Services Section - 100% Exact Design */}
      
      {/* Testimonials Section - 100% Design Match */}
      <section style={{
        width: '100%',
        minHeight: '420px',
        background: 'linear-gradient(rgba(31,41,55,0.65),rgba(31,41,55,0.65)), url("https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&w=1200&q=80") center center / cover no-repeat',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0',
        position: 'relative',
      }}>
        <div style={{
          width: '100%',
          maxWidth: '900px',
          margin: '0 auto',
          textAlign: 'center',
          position: 'relative',
          zIndex: 2,
        }}>
          <div style={{ fontSize: '15px', color: '#e5e7eb', fontFamily: 'Manrope, sans-serif', fontWeight: 600, marginBottom: '10px', letterSpacing: '1px' }}>Testimonials</div>
          <h2 style={{ color: '#fff', fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: '32px', marginBottom: '16px', letterSpacing: '-0.5px' }}>What they say about us</h2>
          <div style={{ marginBottom: '12px' }}>
            {[...Array(5)].map((_, i) => (
              <i key={i} className="fa-solid fa-star" style={{ color: '#fbbf24', fontSize: '22px', margin: '0 2px' }}></i>
            ))}
          </div>
          <div style={{ color: '#fff', fontFamily: 'Manrope, sans-serif', fontWeight: 400, fontSize: '18px', marginBottom: '30px', maxWidth: '700px', marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.5 }}>
            “A real sense of community, nurtured” Really appreciate the help and support from the staff during my trips. Very helpful and always available when needed.
          </div>
          {/* Slider dots */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '0' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#fff', opacity: 1, display: 'inline-block' }}></span>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#fff', opacity: 0.4, display: 'inline-block' }}></span>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#fff', opacity: 0.4, display: 'inline-block' }}></span>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#fff', opacity: 0.4, display: 'inline-block' }}></span>
          </div>
          {/* Arrows */}
          <button style={{
            position: 'absolute',
            left: '-60px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '48px',
            height: '48px',
            backgroundColor: '#fff',
            border: 'none',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
            zIndex: 3,
          }}>
            <i className="fa-solid fa-chevron-left" style={{ color: '#10b981', fontSize: '22px' }}></i>
          </button>
          <button style={{
            position: 'absolute',
            right: '-60px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '48px',
            height: '48px',
            backgroundColor: '#fff',
            border: 'none',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
            zIndex: 3,
          }}>
            <i className="fa-solid fa-chevron-right" style={{ color: '#10b981', fontSize: '22px' }}></i>
          </button>
        </div>
      </section>

            <section style={{ background: '#fff', padding: '60px 0 0 0', minHeight: '420px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <h2 style={{
            fontFamily: 'Manrope, sans-serif',
            fontWeight: 800,
            fontSize: 36,
            textAlign: 'center',
            color: '#222',
            marginBottom: 10
          }}>
            Stay Informed with Our Latest Updates
          </h2>
          <p style={{
            fontFamily: 'Manrope, sans-serif',
            fontWeight: 400,
            fontSize: 16,
            textAlign: 'center',
            color: '#7A7A7A',
            marginBottom: 40
          }}>
            Discover the latest news, tips, and trends in beauty, wellness, and lifestyle.
          </p>
          <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap' }}>
            {/* Card 1 */}
            <div style={{ background: '#fff', border: '1px solid #E5E5E5', borderRadius: 8, width: 350, boxShadow: '0 2px 8px rgba(0,0,0,0.03)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: 170, width: '100%', background: 'url(/blog1.jpg) center/cover no-repeat' }}></div>
              <div style={{ padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ background: '#22C55E', color: '#fff', fontSize: 12, fontWeight: 600, borderRadius: 4, padding: '2px 10px', marginRight: 10 }}>Skincare Tips</span>
                  <span style={{ color: '#7A7A7A', fontSize: 13, display: 'flex', alignItems: 'center', marginRight: 10 }}><i className="fa-regular fa-calendar" style={{ marginRight: 5 }}></i>20th February, 2025</span>
                  <span style={{ color: '#7A7A7A', fontSize: 13, display: 'flex', alignItems: 'center' }}><i className="fa-regular fa-clock" style={{ marginRight: 5 }}></i>5 min read</span>
                </div>
                <div style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: 18, color: '#222', marginBottom: 12 }}>
                  Top 5 Skincare Tips for Glowing Skin
                </div>
                <Link href="/blog/1" style={{ color: '#222', fontWeight: 600, fontSize: 15, textDecoration: 'none' }}>Read More <i className="fa-solid fa-arrow-right" style={{ fontSize: 13, marginLeft: 4 }}></i></Link>
              </div>
            </div>
            {/* Card 2 */}
            <div style={{ background: '#fff', border: '1px solid #E5E5E5', borderRadius: 8, width: 350, boxShadow: '0 2px 8px rgba(0,0,0,0.03)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: 170, width: '100%', background: 'url(/blog2.jpg) center/cover no-repeat' }}></div>
              <div style={{ padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ background: '#22C55E', color: '#fff', fontSize: 12, fontWeight: 600, borderRadius: 4, padding: '2px 10px', marginRight: 10 }}>Skincare Tips</span>
                  <span style={{ color: '#7A7A7A', fontSize: 13, display: 'flex', alignItems: 'center', marginRight: 10 }}><i className="fa-regular fa-calendar" style={{ marginRight: 5 }}></i>July 30, 2025</span>
                  <span style={{ color: '#7A7A7A', fontSize: 13, display: 'flex', alignItems: 'center' }}><i className="fa-regular fa-clock" style={{ marginRight: 5 }}></i>5 min read</span>
                </div>
                <div style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: 18, color: '#222', marginBottom: 12 }}>
                  The Ultimate Guide to Stress Relief with Massage
                </div>
                <Link href="/blog/2" style={{ color: '#222', fontWeight: 600, fontSize: 15, textDecoration: 'none' }}>Read More <i className="fa-solid fa-arrow-right" style={{ fontSize: 13, marginLeft: 4 }}></i></Link>
              </div>
            </div>
            {/* Card 3 */}
            <div style={{ background: '#fff', border: '1px solid #E5E5E5', borderRadius: 8, width: 350, boxShadow: '0 2px 8px rgba(0,0,0,0.03)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: 170, width: '100%', background: 'url(/blog3.jpg) center/cover no-repeat' }}></div>
              <div style={{ padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ background: '#22C55E', color: '#fff', fontSize: 12, fontWeight: 600, borderRadius: 4, padding: '2px 10px', marginRight: 10 }}>Skincare Tips</span>
                  <span style={{ color: '#7A7A7A', fontSize: 13, display: 'flex', alignItems: 'center', marginRight: 10 }}><i className="fa-regular fa-calendar" style={{ marginRight: 5 }}></i>20th February, 2025</span>
                  <span style={{ color: '#7A7A7A', fontSize: 13, display: 'flex', alignItems: 'center' }}><i className="fa-regular fa-clock" style={{ marginRight: 5 }}></i>5 min read</span>
                </div>
                <div style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: 18, color: '#222', marginBottom: 12 }}>
                  How to Choose the Right Facial Treatment
                </div>
                <Link href="/blog/3" style={{ color: '#222', fontWeight: 600, fontSize: 15, textDecoration: 'none' }}>Read More <i className="fa-solid fa-arrow-right" style={{ fontSize: 13, marginLeft: 4 }}></i></Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ...all homepage sections above... */}
      <Footer />
    </div>
  );
}

export default HomePage;
