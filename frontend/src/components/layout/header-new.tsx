// Header and Hero section React component based on provided HTML/CSS
'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '../AuthProvider';

export function Header() {
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const { user, logout, isAuthenticated, isLoading } = useAuth();

  const handleLogout = async () => {
    await logout();
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
              <li><a href="/haircuts">Haircuts</a></li>
              <li><a href="/massages">Massages</a></li>
              <li><a href="/facials">Facials</a></li>
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
                            <a href="/bookings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">My Bookings</a>
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
                      <a href="/auth/login" style={{
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
                      </a>
                    )}
                  </>
                )}
                {/* Wishlist Icon with badge */}
                <a href="/wishlist" style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#222',
                  fontSize: 22,
                  textDecoration: 'none',
                  position: 'relative',
                  width: 32,
                  height: 32,
                }}>
                  <i className="fa-regular fa-heart"></i>
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
                  }}>2</span>
                </a>
                {/* Cart Icon with badge */}
                <a href="/cart" style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#222',
                  fontSize: 22,
                  textDecoration: 'none',
                  position: 'relative',
                  width: 32,
                  height: 32,
                }}>
                  <i className="fa-solid fa-cart-shopping"></i>
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
                  }}>9</span>
                </a>
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
