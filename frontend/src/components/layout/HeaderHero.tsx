// Header and Hero section React component based on provided HTML/CSS
'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

import UserActions from './UserActions';

export function HeaderHero() {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

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
              {/* Dynamic categories will be rendered here */}
              <li><a href="/contact">Contact</a></li>
            </ul>
            <div className="user-actions">
              <UserActions />
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section - Only show on home page */}
      {isHomePage && (
        <section className="hero-section">
          <div className="container hero-content">
            <div className="hero-text-area">
           <h1 className="hero-headline">
  Find <span className="highlight-green">Trusted Providers</span> &amp; 
  <span className="highlight-green">Book Services</span> at the Best Prices
</h1>

              <p className="hero-description">
                Search for top-rated beauty, wellness, and healthcare providers near you.
              </p>
              <div className="search-bar">
                <div className="input-group">
                  <i className="fa-regular fa-calendar-days"></i>
                  <input type="text" placeholder="Search..." />
                </div>
                <div className="input-group">
                  <div className="select-wrapper">
                    <i className="fa-solid fa-location-dot"></i>
                    <select>
                      <option>Select...</option>
                    </select>
                    <i className="fa-solid fa-chevron-down"></i>
                  </div>
                </div>
                <button className="btn-find-providers">Find Providers</button>
              </div>
              <p className="popular-searches">
                Popular Searches: <span>Haircuts, Massage, Facials.</span>
              </p>
            </div>
            <div className="hero-video-area">
              <div className="video-placeholder">
                <div className="video-overlay">
                  <div className="play-button">
                    <i className="fa-solid fa-play"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
