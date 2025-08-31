"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiService, Service } from "@/lib/api";

// Demo/mock data for fallback
const demoServices: Service[] = [
  // Facials
  ...Array.from({ length: 20 }).map((_, i) => ({
    id: `FAC-${(i+1).toString().padStart(3, '0')}`,
    name: [
      'Glow Facial', 'Hydra Facial', 'Anti-Aging Facial', 'Acne Treatment', 'Collagen Boost', 'Vitamin C Facial', 'Microdermabrasion', 'Oxygen Facial', 'Peel Treatment', 'Sensitive Skin Facial',
      'Brightening Facial', 'Firming Facial', 'Detox Facial', 'Gold Facial', 'Charcoal Facial', 'Men’s Facial', 'Teen Facial', 'Classic Facial', 'Express Facial', 'Luxury Facial'
    ][i % 20],
    description: [
      'Brightening facial for radiant skin.', 'Deep hydration and cleansing.', 'Reduces wrinkles and fine lines.', 'Acne reduction and healing.', 'Boosts collagen production.',
      'Vitamin C for glowing skin.', 'Exfoliation and renewal.', 'Oxygen infusion for freshness.', 'Chemical peel for clarity.', 'Gentle care for sensitive skin.',
      'Brightens dull skin.', 'Firms and tightens.', 'Detoxifies pores.', 'Gold particles for luxury.', 'Charcoal for deep clean.',
      'Tailored for men.', 'Teen skin care.', 'Classic facial treatment.', 'Quick express facial.', 'Ultimate luxury experience.'
    ][i % 20],
    basePrice: 40 + (i % 10) * 5,
    duration: 60,
    imageUrl: [
      'https://images.pexels.com/photos/3993446/pexels-photo-3993446.jpeg?auto=compress&w=400&h=300',
      'https://images.pexels.com/photos/3993445/pexels-photo-3993445.jpeg?auto=compress&w=400&h=300',
      'https://images.pexels.com/photos/3993447/pexels-photo-3993447.jpeg?auto=compress&w=400&h=300',
      'https://images.pexels.com/photos/3993448/pexels-photo-3993448.jpeg?auto=compress&w=400&h=300',
      'https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&w=400&h=300',
      'https://images.pexels.com/photos/3993450/pexels-photo-3993450.jpeg?auto=compress&w=400&h=300',
      'https://images.pexels.com/photos/3993451/pexels-photo-3993451.jpeg?auto=compress&w=400&h=300',
      'https://images.pexels.com/photos/3993452/pexels-photo-3993452.jpeg?auto=compress&w=400&h=300',
      'https://images.pexels.com/photos/3993453/pexels-photo-3993453.jpeg?auto=compress&w=400&h=300',
      'https://images.pexels.com/photos/3993454/pexels-photo-3993454.jpeg?auto=compress&w=400&h=300',
      'https://images.pexels.com/photos/3993455/pexels-photo-3993455.jpeg?auto=compress&w=400&h=300',
      'https://images.pexels.com/photos/3993456/pexels-photo-3993456.jpeg?auto=compress&w=400&h=300',
      'https://images.pexels.com/photos/3993457/pexels-photo-3993457.jpeg?auto=compress&w=400&h=300',
      'https://images.pexels.com/photos/3993458/pexels-photo-3993458.jpeg?auto=compress&w=400&h=300',
      'https://images.pexels.com/photos/3993459/pexels-photo-3993459.jpeg?auto=compress&w=400&h=300',
      'https://images.pexels.com/photos/3993460/pexels-photo-3993460.jpeg?auto=compress&w=400&h=300',
      'https://images.pexels.com/photos/3993461/pexels-photo-3993461.jpeg?auto=compress&w=400&h=300',
      'https://images.pexels.com/photos/3993462/pexels-photo-3993462.jpeg?auto=compress&w=400&h=300',
      'https://images.pexels.com/photos/3993463/pexels-photo-3993463.jpeg?auto=compress&w=400&h=300'
    ][i % 20],
    category: { id: 'facials', name: 'Facials', description: '', slug: 'facials', sortOrder: 1, isActive: true, isFeatured: false, createdAt: '', updatedAt: '' },
    provider: { id: '1', businessName: [
      'Glow Studio', 'Beauty Bliss', 'Fresh Face', 'Acne Clinic', 'Collagen Lab', 'Vitamin Spa', 'Microderm Center', 'Oxygen Bar', 'Peel Place', 'Sensitive Care',
      'Brighten Spa', 'Firming Studio', 'Detox Den', 'Gold Lounge', 'Charcoal House', 'Men’s Spa', 'Teen Studio', 'Classic Spa', 'Express Spa', 'Luxury Lounge'
    ][i % 20], averageRating: 4.5, totalReviews: 50, businessAddress: '123 Main St' }
  })),
  // Add similar demo data for haircuts, massages, etc. as needed
];
import Link from "next/link";
import { useCart } from "@/components/cartContext";

export default function ServiceDetailPage() {
  const params = useParams();
  const { id } = params as { id: string };
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchService() {
      setLoading(true);
      try {
        // Try API first
        const result = await apiService.getServices();
        let found = (result.data || []).find((s: Service) => s.id === id);
        // Fallback to demo data if not found
        if (!found) {
          found = demoServices.find((s) => s.id === id);
        }
        setService(found ?? null);
      } catch (e) {
        // On error, fallback to demo data
  const found = demoServices.find((s) => s.id === id);
  setService(found ?? null);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchService();
  }, [id]);

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: 60 }}>Loading service...</div>;
  }
  if (!service) {
    return <div style={{ textAlign: 'center', marginTop: 60, color: '#ef4444' }}>Service not found.</div>;
  }

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: 'Manrope, sans-serif', padding: '60px 0' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 24px' }}>
        <Link href="/shop" style={{ color: '#10b981', fontWeight: 600, fontSize: 16, textDecoration: 'none', marginBottom: 24, display: 'inline-block' }}>&larr; Back to Shop</Link>
        <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 8px 32px rgba(0,0,0,0.10)', padding: 40, display: 'flex', gap: 32, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 260 }}>
            <div style={{ height: 240, width: '100%', background: service.imageUrl ? `url(${service.imageUrl}) center/cover no-repeat` : '#f3f4f6', borderRadius: 12, marginBottom: 24 }}></div>
          </div>
          <div style={{ flex: 2, minWidth: 260 }}>
            <h1 style={{ fontSize: 32, fontWeight: 800, color: '#222', marginBottom: 16 }}>{service.name}</h1>
            <div style={{ color: '#6b7280', fontSize: 18, marginBottom: 16 }}>{service.description}</div>
            <div style={{ color: '#10b981', fontWeight: 700, fontSize: 22, marginBottom: 16 }}>${service.basePrice}</div>
            <div style={{ color: '#6b7280', fontSize: 16, marginBottom: 8 }}>Category: {service.category?.name}</div>
            <div style={{ color: '#6b7280', fontSize: 16, marginBottom: 8 }}>Provider: {service.provider?.businessName}</div>
            <div style={{ color: '#6b7280', fontSize: 16, marginBottom: 24 }}>Duration: {service.duration} min</div>
            <AddToCartButton service={service} />
          </div>
        </div>
      </div>
    </div>
  );
}


// AddToCartButton component
function AddToCartButton({ service }: { service: Service }) {
  const { addToCart } = useCart();
  const router = useRouter();
  const [added, setAdded] = React.useState(false);

  const handleAdd = () => {
    addToCart({
  id: Number(service.id),
      name: service.name,
      provider: service.provider?.businessName || '',
      price: service.basePrice,
      imageUrl: service.imageUrl || '',
      quantity: 1
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div style={{ marginTop: 24 }}>
      <button onClick={handleAdd} style={{ background: '#10b981', color: '#fff', padding: '14px 32px', borderRadius: 8, fontWeight: 700, fontSize: 18, border: 'none', cursor: 'pointer' }}>
        {added ? 'Added!' : 'Add to Cart'}
      </button>
      <button onClick={() => router.push('/cart')} style={{ marginLeft: 16, background: '#fff', color: '#10b981', border: '2px solid #10b981', padding: '14px 32px', borderRadius: 8, fontWeight: 700, fontSize: 18, cursor: 'pointer' }}>
        Go to Cart
      </button>
    </div>
  );
}
