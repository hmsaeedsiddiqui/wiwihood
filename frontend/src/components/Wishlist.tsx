'use client';

import React, { useState } from 'react';

const wishlistItems = [
  {
    id: 1,
    name: 'Relaxing Massage',
    provider: 'Spa Heaven',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop&crop=center',
    price: '$60',
    rating: 4.8,
    duration: '60 min',
    category: 'Massage',
    description: 'Full body relaxing massage to relieve stress and tension'
  },
  {
    id: 2,
    name: 'Facial Treatment',
    provider: 'Glow Clinic',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=300&fit=crop&crop=center',
    price: '$45',
    rating: 4.9,
    duration: '45 min',
    category: 'Facial',
    description: 'Deep cleansing facial with organic products'
  },
  {
    id: 3,
    name: 'Hair Styling',
    provider: 'Style Studio',
    image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400&h=300&fit=crop&crop=center',
    price: '$35',
    rating: 4.7,
    duration: '30 min',
    category: 'Hair',
    description: 'Professional hair styling and treatment'
  },
  {
    id: 4,
    name: 'Manicure & Pedicure',
    provider: 'Nail Art Plus',
    image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=300&fit=crop&crop=center',
    price: '$50',
    rating: 4.6,
    duration: '90 min',
    category: 'Nails',
    description: 'Complete nail care with premium polish'
  },
  {
    id: 5,
    name: 'Deep Tissue Massage',
    provider: 'Wellness Center',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=300&fit=crop&crop=center',
    price: '$80',
    rating: 4.9,
    duration: '75 min',
    category: 'Massage',
    description: 'Therapeutic massage for muscle tension relief'
  },
  {
    id: 6,
    name: 'Anti-Aging Facial',
    provider: 'Beauty Lounge',
    image: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=400&h=300&fit=crop&crop=center',
    price: '$95',
    rating: 4.8,
    duration: '60 min',
    category: 'Facial',
    description: 'Advanced anti-aging treatment with collagen boost'
  }
];

export default function Wishlist() {
  const [items, setItems] = useState(wishlistItems);

  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  const addToCart = (item: any) => {
    // Add to cart functionality
    console.log('Added to cart:', item);
  };

  return (
    <div className="wishlist-container">
      <div className="wishlist-header">
        <h1 className="wishlist-title">
          <i className="fas fa-heart"></i>
          My Wishlist
        </h1>
        <p className="wishlist-subtitle">
          {items.length} {items.length === 1 ? 'service' : 'services'} saved for later
        </p>
      </div>

      {items.length === 0 ? (
        <div className="empty-wishlist">
          <i className="fas fa-heart-broken"></i>
          <h3>Your wishlist is empty</h3>
          <p>Browse our services and add your favorites here</p>
          <button className="browse-btn">
            <i className="fas fa-search"></i>
            Browse Services
          </button>
        </div>
      ) : (
        <div className="wishlist-grid">
          {items.map((item) => (
            <div key={item.id} className="wishlist-card">
              <div className="card-image">
                <img src={item.image} alt={item.name} />
                <div className="card-category">{item.category}</div>
                <button 
                  className="remove-btn"
                  onClick={() => removeItem(item.id)}
                  title="Remove from wishlist"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              
              <div className="card-content">
                <div className="card-header">
                  <h3 className="service-name">{item.name}</h3>
                  <div className="rating">
                    <i className="fas fa-star"></i>
                    <span>{item.rating}</span>
                  </div>
                </div>
                
                <p className="provider-name">
                  <i className="fas fa-map-marker-alt"></i>
                  {item.provider}
                </p>
                
                <p className="service-description">{item.description}</p>
                
                <div className="service-details">
                  <span className="duration">
                    <i className="fas fa-clock"></i>
                    {item.duration}
                  </span>
                  <span className="price">{item.price}</span>
                </div>
                
                <div className="card-actions">
                  <button 
                    className="book-btn"
                    onClick={() => addToCart(item)}
                  >
                    <i className="fas fa-calendar-plus"></i>
                    Book Now
                  </button>
                  <button className="share-btn">
                    <i className="fas fa-share"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
