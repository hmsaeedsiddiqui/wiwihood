interface Shop {
  id: string;
  businessName: string;
  description?: string | null;
  city?: string;
  address?: string;
  logo?: string;
  averageRating?: number;
  totalReviews?: number;
}

interface Category {
  id: string;
  name: string;
  count: number;
}

"use client";


import React, { useEffect, useState } from "react";
import Link from "next/link";
import Footer from '../../components/Footer';

export default function ShopPage() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/providers?page=1&limit=100`)
      .then(res => res.json())
      .then(data => {
        // The backend returns { data: Provider[], ... } or { items: Provider[], ... } or { providers: Provider[], ... }
        // Try to support common patterns
        let providers = [];
        if (Array.isArray(data)) {
          providers = data;
        } else if (Array.isArray(data.items)) {
          providers = data.items;
        } else if (Array.isArray(data.providers)) {
          providers = data.providers;
        } else if (Array.isArray(data.data)) {
          providers = data.data;
        }
        setShops(providers);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`)
      .then(res => res.json())
      .then(data => {
        const fetchedCategories = Array.isArray(data) ? data : data.categories || [];
        setCategories(fetchedCategories);
      })
      .catch(() => setCategories([]));
  }, []);

  // Trending Categories section (matches provided image)
  const trendingCategoriesSection = (
    <div style={{ background: '#fff', maxWidth: 1200, margin: '0 auto', marginTop: -32, borderRadius: 18, padding: '40px 32px 32px 32px', position: 'relative', zIndex: 2 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: '#111', letterSpacing: '-0.5px', margin: 0 }}>Trending Categories</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={{ width: 36, height: 36, borderRadius: '50%', border: '1px solid #e5e7eb', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(16,185,129,0.08)', cursor: 'pointer', outline: 'none' }}>
            <span style={{ color: '#10b981', fontSize: 20, fontWeight: 700, display: 'inline-block', transform: 'rotate(180deg)' }}>&#8594;</span>
          </button>
          <button style={{ width: 36, height: 36, borderRadius: '50%', border: '1px solid #e5e7eb', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(16,185,129,0.08)', cursor: 'pointer', outline: 'none' }}>
            <span style={{ color: '#10b981', fontSize: 20, fontWeight: 700 }}>&#8594;</span>
          </button>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 24, marginBottom: 24 }}>
        {categories.map((cat) => (
          <div key={cat.id} style={{ flex: 1, background: '#fff', border: '1.5px solid #e5e7eb', borderRadius: 12, padding: '22px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'center', boxShadow: '0 2px 8px rgba(30,41,59,0.02)', position: 'relative', minWidth: 180 }}>
            <div style={{ fontWeight: 700, fontSize: 18, color: '#111', marginBottom: 4 }}>{cat.name}</div>
            <div style={{ color: '#6b7280', fontSize: 15, fontWeight: 500 }}>({cat.count} Shops)</div>
            <div style={{ position: 'absolute', top: 18, right: 18, width: 16, height: 16, background: '#111827', borderRadius: 4 }} />
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 18 }}>
        <div style={{ flex: 1, display: 'flex', gap: 8 }}>
          <button style={{ background: '#f3f4f6', border: '1.5px solid #e5e7eb', borderRadius: 8, padding: '8px 18px', fontWeight: 600, color: '#222', fontSize: 15, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <span style={{ width: 16, height: 16, background: '#111827', borderRadius: 4, display: 'inline-block' }}></span>
            Categories
          </button>
          <select style={{ background: '#f3f4f6', border: '1.5px solid #e5e7eb', borderRadius: 8, padding: '8px 18px', fontWeight: 600, color: '#222', fontSize: 15, outline: 'none', minWidth: 120 }}>
            <option>Locations</option>
          </select>
          <select style={{ background: '#f3f4f6', border: '1.5px solid #e5e7eb', borderRadius: 8, padding: '8px 18px', fontWeight: 600, color: '#222', fontSize: 15, outline: 'none', minWidth: 120 }}>
            <option>Reviews</option>
          </select>
          <button style={{ background: '#f3f4f6', border: '1.5px solid #e5e7eb', borderRadius: 8, padding: '8px 18px', fontWeight: 600, color: '#222', fontSize: 15, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <span style={{ width: 16, height: 16, background: '#111827', borderRadius: 4, display: 'inline-block' }}></span>
            Seller Details
          </button>
        </div>
        <div style={{ minWidth: 220, display: 'flex', alignItems: 'center', gap: 8 }}>
          <button style={{ background: '#111827', border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 600, color: '#fff', fontSize: 15, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <span style={{ width: 16, height: 16, background: '#111827', borderRadius: 4, display: 'inline-block' }}></span>
            Sort by: <span style={{ color: '#10b981', fontWeight: 700, marginLeft: 4 }}>Recommended</span>
            <span style={{ marginLeft: 4, fontSize: 16 }}>&#9660;</span>
          </button>
        </div>
      </div>
    </div>
  );
  // Hero section matching the design image
  const heroSection = (
    <div className="shop-hero-section">
      {/* Background Image with dark overlay */}
      <div className="hero-background">
        <img 
          src="https://images.unsplash.com/photo-1560472355-536de3962603?w=1500&h=600&fit=crop&crop=center" 
          alt="Shop Background" 
          className="hero-bg-image"
        />
        <div className="hero-dark-overlay"></div>
      </div>
      
      {/* Content Container */}
      <div className="hero-content">
        <div className="hero-layout">
          {/* Left Side - Text and Search */}
          <div className="hero-left">
            <h1 className="hero-main-title">
              Find <span className="highlight-green">Trusted Providers</span> &<br />
              <span className="highlight-green">Book Services</span> at the<br />
              Best Prices
            </h1>
            <p className="hero-subtitle-new">
              Search for top-rated beauty, wellness, and healthcare providers near you.
            </p>
            
            {/* Search Bar */}
            <div className="hero-search-container">
              <input 
                type="text" 
                placeholder="Search..."
                className="hero-search-input"
              />
              <select className="hero-location-select">
                <option>Select...</option>
                <option>New York</option>
                <option>Los Angeles</option>
                <option>Chicago</option>
              </select>
              <button className="hero-search-button">
                Find Providers
              </button>
            </div>
            
            {/* Popular Searches */}
            <div className="hero-popular-searches">
              <span className="popular-label">Popular Searches:</span>
              <span className="popular-items">Haircuts, Massage, Facials.</span>
            </div>
          </div>
          
          {/* Right Side - Image */}
          <div className="hero-right">
            <div className="hero-image-frame">
              <img 
                src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=400&fit=crop&crop=center" 
                alt="Professional Service" 
                className="hero-feature-image"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Diagonal cut */}
      <div className="hero-diagonal-cut"></div>
    </div>
  );

  return (
    <>
  {heroSection}
  <div style={{ height: 32 }} />
  {trendingCategoriesSection}
      <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: 'Manrope, sans-serif', padding: '60px 0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
          <h1 style={{ fontSize: 36, fontWeight: 800, textAlign: 'center', marginBottom: 40, letterSpacing: '-1px', color: '#222' }}>Shops</h1>
          {loading ? (
            <div style={{ textAlign: 'center', color: '#6b7280', fontSize: 18 }}>Loading shops...</div>
          ) : shops.length === 0 ? (
            <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.10)', padding: 32, textAlign: 'center', color: '#6b7280', fontSize: 18 }}>
              No shops found.
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', justifyContent: 'center' }}>
              {shops.map((shop) => (
                <Link key={shop.id} href={`/shop/${shop.id}`} style={{ textDecoration: 'none' }}>
                  <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 8px 32px rgba(16,185,129,0.10)', width: 320, minHeight: 360, maxHeight: 360, overflow: 'hidden', display: 'flex', flexDirection: 'column', marginBottom: 24, transition: 'transform 0.2s', cursor: 'pointer' }}>
                    <div style={{ height: 180, width: '100%', background: shop.logo ? `url(${shop.logo}) center/cover no-repeat` : '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '2px solid #e5e7eb' }}>
                      {!shop.logo && (
                        <span style={{ color: '#9ca3af', fontSize: 48, fontWeight: 700 }}>🛍️</span>
                      )}
                    </div>
                    <div style={{ padding: 24, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: 20, color: '#222', marginBottom: 8, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{shop.businessName}</div>
                      <div style={{ color: '#6b7280', fontSize: 15, marginBottom: 8, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis', minHeight: 44, maxHeight: 44 }}>{typeof shop.description === 'string' ? shop.description : shop.description || 'No description available'}</div>
                      <div style={{ color: '#6b7280', fontSize: 14, marginBottom: 8, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>City: {shop.city || shop.address || ''}</div>
                      <div style={{ color: '#f59e42', fontWeight: 700, fontSize: 15, marginBottom: 8 }}>Rating: {shop.averageRating?.toFixed ? shop.averageRating.toFixed(1) : (shop.averageRating ?? 'N/A')} ({shop.totalReviews ?? 0} reviews)</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
  <Footer />
    </>
  );
}
