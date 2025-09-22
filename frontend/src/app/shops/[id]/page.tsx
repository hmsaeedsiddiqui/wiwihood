"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Footer from "../../../components/Footer";

// Mock provider/shop detail data commented out to prevent bugs
/*
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
*/

export default function ShopDetailPage() {
  const router = useRouter();
  
  // This page is deprecated - shop data now comes from /shop/[id] page
  // Redirecting to the proper shop page structure
  React.useEffect(() => {
    router.push('/shop');
  }, [router]);

  return (
    <div style={{ 
      background: '#f8fafc', 
      minHeight: '100vh', 
      fontFamily: 'Manrope, sans-serif', 
      padding: '60px 0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ color: '#222', marginBottom: '16px' }}>Redirecting...</h2>
        <p style={{ color: '#6b7280' }}>Taking you to the shops page</p>
      </div>
    </div>
  );
}
