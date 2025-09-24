// Header and Hero section React component based on provided HTML/CSS
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useWishlist } from '../WishlistContext';
import { useCart } from '../cartContext';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { apiService } from '@/lib/api';

export function Header() {
  const { wishlist } = useWishlist();
  const { cart, addToCart } = useCart();
  const router = useRouter();
  const [showWishlistModal, setShowWishlistModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const { user, logout, isAuthenticated, isLoading } = useAuthStore();

  // Categories state
  const [categories, setCategories] = useState<{ id: string, name: string, slug: string }[]>([]);

  useEffect(() => {
    // Fetch categories from backend using proper API service
    console.log('Fetching categories...');
    apiService.getCategories(true)
      .then(cats => {
        console.log('Categories fetched:', cats);
        // Filter for Haircuts, Massages, Facials by name (case-insensitive)
        const wanted = ['haircuts', 'massages', 'facials'];
        const filteredCats = cats.filter((cat: any) =>
          wanted.includes((cat.name || '').toLowerCase())
        );
        console.log('Filtered categories:', filteredCats);
        setCategories(filteredCats);
      })
      .catch(error => {
        console.error('Error fetching categories:', error);
        setCategories([]);
      });
  }, []);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  const handleCartClick = () => {
    if (mounted) {
      router.push('/cart');
    }
  };

  return (
    <>
      {/* Header Section */}
      <header className="site-header">
        <div className="top-banner">
          <div className="container">
            <p>FREE delivery &amp; 40% Discount for next 3 Bookings! Place your first appointment in.</p>
            <div className="sale-timer">
              <span className="timer-label">Until the end of the sale</span>
              <span className="timer-unit">47 <span className="label">days</span></span>
              <span className="timer-unit">06 <span className="label">hours</span></span>
              <span className="timer-unit">55 <span className="label">min</span></span>
              <span className="timer-unit">51 <span className="label">sec</span></span>
            </div>
          </div>
        </div>
        {/* Info Bar Below Green Banner */}
        <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', fontSize: 13, fontWeight: 500, color: '#222', padding: '6px 0', width: '100%' }}>
          <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>We book appointments from <span style={{ color: '#f97316', fontWeight: 700 }}>7:00 to 22:00</span></span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 24, color: '#6b7280', fontWeight: 500 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
                English <i className="fa-solid fa-chevron-down fa-xs" style={{ marginLeft: 2 }}></i>
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
                USD <i className="fa-solid fa-chevron-down fa-xs" style={{ marginLeft: 2 }}></i>
              </span>
              <span style={{ cursor: 'pointer' }}>Booking Tracking</span>
            </div>
          </div>
        </div>
        <nav className="main-nav">
          <div className="container nav-content">
            <div className="logo">
              <span className="brand-name">Reservista</span>
              <div className="location-info">
                <i className="fa-solid fa-location-dot"></i> Available near <a href="#">you</a>
              </div>
            </div>
            <ul className="nav-links">
              <li><a href="/">Home</a></li>
              <li><a href="/shop">Shop</a></li>
              {/* Book Service link hidden - keeping code intact for future use */}
              {/* <li><a href="/book-service">Book Service</a></li> */}
              {categories.map(cat => (
                <li key={cat.id}><a href={`/category/${cat.slug}`}>{cat.name}</a></li>
              ))}
              <li><a href="/contact">Contact</a></li>
            </ul>
            <div className="user-actions">
              <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
                {/* Sign In Button or User Menu */}
                {!isLoading && (
                  <>
                    {isAuthenticated && user ? (
                      <div className="relative group">
                        <button style={{
                          display: 'flex',
                          alignItems: 'center',
                          color: '#111',
                          textDecoration: 'none',
                          minWidth: 90,
                          height: 44,
                          padding: 0,
                          margin: 0,
                          fontFamily: 'inherit',
                          cursor: 'pointer',
                          userSelect: 'none',
                          background: 'transparent',
                          border: 'none',
                        }}>
                          <i className="fa-regular fa-user" style={{ fontSize: 26, color: '#111', marginRight: 8 }}></i>
                          <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1.1 }}>
                            <span style={{ fontSize: 13, fontWeight: 400, color: '#6b7280', margin: 0, letterSpacing: 0 }}>Welcome</span>
                            <span style={{ fontSize: 16, fontWeight: 700, color: '#111', margin: 0, letterSpacing: 0 }}>{user.firstName}</span>
                          </span>
                        </button>
                        {/* Dropdown Menu */}
                        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                          <div className="py-2">
                            <a href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">My Profile</a>
                            <a href="/customer/bookings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">My Bookings</a>
                            <a href="/customer/messages" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">💬 Messages</a>
                            <a href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</a>
                            <hr className="my-1" />
                            <button 
                              onClick={handleLogout}
                              className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                            >
                              Sign Out
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <Link href="/auth/login" style={{
                        display: 'flex',
                        alignItems: 'center',
                        color: '#111',
                        textDecoration: 'none',
                        minWidth: 90,
                        height: 44,
                        padding: 0,
                        margin: 0,
                        fontFamily: 'inherit',
                        cursor: 'pointer',
                        userSelect: 'none',
                      }}>
                        <i className="fa-regular fa-user" style={{ fontSize: 26, color: '#111', marginRight: 8 }}></i>
                        <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1.1 }}>
                          <span style={{ fontSize: 13, fontWeight: 400, color: '#6b7280', margin: 0, letterSpacing: 0 }}>Sign In</span>
                          <span style={{ fontSize: 16, fontWeight: 700, color: '#111', margin: 0, letterSpacing: 0 }}>Account</span>
                        </span>
                      </Link>
                    )}
                  </>
                )}
                {/* Wishlist Icon with badge - HIDDEN */}
                <button
                  type="button"
                  onClick={() => setShowWishlistModal(true)}
                  style={{
                    display: 'none', // HIDDEN: Will be re-enabled later
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#222',
                    fontSize: 22,
                    textDecoration: 'none',
                    position: 'relative',
                    width: 32,
                    height: 32,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                  aria-label="Show wishlist"
                >
                  <i className="fa-regular fa-heart"></i>
                  {mounted && wishlist.length > 0 && (
                    <span style={{
                      position: 'absolute',
                      top: -4,
                      right: -4,
                      background: '#ef4444',
                      color: '#fff',
                      borderRadius: '50%',
                      fontSize: 12,
                      fontWeight: 700,
                      minWidth: 18,
                      height: 18,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '2px solid #fff',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
                    }}>{wishlist.length}</span>
                  )}
                </button>
      {/* Wishlist Modal */}
      {showWishlistModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.3)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={() => setShowWishlistModal(false)}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: 18,
              boxShadow: '0 8px 48px rgba(0,0,0,0.18)',
              padding: 40,
              minWidth: 480,
              maxWidth: 700,
              width: '90vw',
              maxHeight: '90vh',
              overflowY: 'auto',
              position: 'relative',
            }}
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setShowWishlistModal(false)}
              style={{
                position: 'absolute',
                top: 18,
                right: 18,
                background: 'none',
                border: 'none',
                fontSize: 26,
                cursor: 'pointer',
                color: '#888',
              }}
              aria-label="Close wishlist"
            >
              <i className="fas fa-times"></i>
            </button>
            <h2 style={{ fontWeight: 700, fontSize: 28, marginBottom: 28, display: 'flex', alignItems: 'center', gap: 12, color: '#374151' }}>
              <i className="fa-regular fa-heart"></i> My Wishlist
            </h2>
            {wishlist.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#888', padding: 40 }}>
                <i className="fas fa-heart-broken" style={{ fontSize: 40, marginBottom: 12 }}></i>
                <div style={{ fontWeight: 600, marginBottom: 6, fontSize: 18 }}>Your wishlist is empty</div>
                <div style={{ fontSize: 15 }}>Browse services and add your favorites here.</div>
              </div>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {wishlist.map(item => (
                  <li
                    key={item.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 24,
                      marginBottom: 28,
                      background: '#f9fafb',
                      borderRadius: 12,
                      padding: 18,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    }}
                  >
                    <img
                      src={item.image || '/blog1.jpg'}
                      alt={item.name}
                      style={{ width: 80, height: 80, borderRadius: 10, objectFit: 'cover', border: '1px solid #eee', background: '#fff' }}
                      onError={e => { e.currentTarget.src = '/blog1.jpg'; }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 18, color: '#222' }}>{item.name}</div>
                      {item.basePrice && <div style={{ color: '#16a34a', fontWeight: 600, fontSize: 17, marginTop: 2 }}>${item.basePrice}</div>}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <button
                        style={{
                          background: '#16a34a',
                          color: '#fff',
                          border: 'none',
                          borderRadius: 8,
                          padding: '8px 18px',
                          fontWeight: 600,
                          fontSize: 15,
                          cursor: 'pointer',
                          marginBottom: 2,
                        }}
                        onClick={() => addToCart({
                          id: item.id.toString(),
                          name: item.name,
                          provider: '',
                          price: item.basePrice || 0,
                          imageUrl: item.image || '/blog1.jpg',
                          quantity: 1,
                        })}
                      >
                        <i className="fa-solid fa-cart-plus"></i> Add to Cart
                      </button>
                      <button
                        style={{
                          background: '#f59e42',
                          color: '#fff',
                          border: 'none',
                          borderRadius: 8,
                          padding: '8px 18px',
                          fontWeight: 600,
                          fontSize: 15,
                          cursor: 'pointer',
                        }}
                        // Add your buy logic here
                      >
                        <i className="fa-solid fa-bag-shopping"></i> Buy Now
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
                {/* Cart Icon with badge - HIDDEN */}
                <button
                  onClick={handleCartClick}
                  style={{
                    display: 'none', // HIDDEN: Will be re-enabled later
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#222',
                    fontSize: 22,
                    textDecoration: 'none',
                    position: 'relative',
                    width: 32,
                    height: 32,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                  aria-label="Show cart"
                >
                  <i className="fa-solid fa-cart-shopping"></i>
                  {mounted && cart.length > 0 && (
                    <span style={{
                      position: 'absolute',
                      top: -4,
                      right: -4,
                      background: '#ef4444',
                      color: '#fff',
                      borderRadius: '50%',
                      fontSize: 12,
                      fontWeight: 700,
                      minWidth: 18,
                      height: 18,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '2px solid #fff',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
                    }}>{cart.length}</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section - Only show on home page */}
      {isHomePage && (
        <section>
          
        </section>
        // <section className="hero-section">
        //   <div className="container hero-content">
        //     <div className="hero-text-area">
        //       <h1 className="hero-headline">
        //         Find <span className="highlight-green">Trusted Providers</span> &amp;<br/>
        //         <span className="highlight-green">Book Services</span> at the<br/>
        //         Best Prices
        //       </h1>
        //       <p className="hero-description">
        //         Search for top-rated beauty, wellness, and healthcare providers near you.
        //       </p>
        //       <div className="search-bar">
        //         <div className="input-group">
        //           <i className="fa-regular fa-calendar-days"></i>
        //           <input type="text" placeholder="Search..." />
        //         </div>
        //         <div className="input-group">
        //           <div className="select-wrapper">
        //             <i className="fa-solid fa-location-dot"></i>
        //             <select>
        //               <option>Select...</option>
        //             </select>
        //             <i className="fa-solid fa-chevron-down"></i>
        //           </div>
        //         </div>
        //         <button className="btn-find-providers">Find Providers</button>
        //       </div>
        //       <p className="popular-searches">
        //         Popular Searches: <span>Haircuts, Massage, Facials.</span>
        //       </p>
        //     </div>
        //     <div className="hero-video-area">
        //       <div className="video-placeholder">
        //         <div className="video-overlay">
        //           <div className="play-button">
        //             <i className="fa-solid fa-play"></i>
        //           </div>
        //         </div>
        //       </div>
        //     </div>
        //   </div>
        // </section>
      )}
    </>
  );
}
