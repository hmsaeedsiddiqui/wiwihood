"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Footer from "../../../components/Footer";

// Mock provider/shop detail data
const mockShop = {
  id: 1,
  name: "Elite Hair Studio",
  description: "Trendy barbershop for men and women. Expert stylists, modern cuts, and a relaxing atmosphere.",
  address: "123 Main St, Downtown",
  city: "Downtown",
  logoUrl: "https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&w=400&h=300",
  rating: 4.8,
  reviews: 127,
  gallery: [
    "https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&w=400&h=300",
    "https://images.pexels.com/photos/1813272/pexels-photo-1813272.jpeg?auto=compress&w=400&h=300"
  ],
  services: [
    { id: 1, name: "Premium Hair Cut", price: 45 },
    { id: 2, name: "Beard Trim", price: 20 }
  ]
};

export default function ShopDetailPage() {
  const router = useRouter();
  // In real app, fetch shop by id from router.query
  const shop = mockShop;

  return (
    <>
      <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: 'Manrope, sans-serif', padding: '60px 0' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px' }}>
          <button onClick={() => router.back()} style={{ marginBottom: 24, background: 'none', border: 'none', color: '#10b981', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>&larr; Back</button>
          <div style={{ display: 'flex', gap: 32, background: '#fff', borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.10)', padding: 32 }}>
            <img src={shop.logoUrl} alt={shop.name} style={{ width: 180, height: 180, borderRadius: 12, objectFit: 'cover' }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: 28, color: '#222', marginBottom: 8 }}>{shop.name}</div>
              <div style={{ color: '#6b7280', fontSize: 17, marginBottom: 12 }}>{shop.description}</div>
              <div style={{ color: '#222', fontWeight: 700, fontSize: 17, marginBottom: 8 }}>{shop.address}, {shop.city}</div>
              <div style={{ color: '#f59e42', fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Rating: {shop.rating} ({shop.reviews} reviews)</div>
              <div style={{ marginBottom: 16 }}>
                <strong>Gallery:</strong>
                <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                  {shop.gallery.map((img, i) => (
                    <img key={i} src={img} alt="Gallery" style={{ width: 80, height: 80, borderRadius: 8, objectFit: 'cover' }} />
                  ))}
                </div>
              </div>
              <div>
                <strong>Services:</strong>
                <ul style={{ marginTop: 8 }}>
                  {shop.services.map((s) => (
                    <li key={s.id} style={{ marginBottom: 4 }}>{s.name} - <span style={{ color: '#10b981', fontWeight: 700 }}>${s.price}</span></li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
