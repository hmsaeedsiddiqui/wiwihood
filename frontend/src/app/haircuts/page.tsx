
"use client";
import Footer from '../../components/Footer';

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { apiService, Service, Category } from "@/lib/api";

export default function HaircutsPage() {
  const [services] = useState(
    Array.from({ length: 20 }).map((_, i) => ({
      id: `CUT-${(i+1).toString().padStart(3, '0')}`,
      name: [
        'Classic Cut', 'Fade', 'Shear Genius', 'Buzz Cut', 'Layered Style', 'Undercut', 'Pompadour', 'Crew Cut', 'Textured Crop', 'Side Part',
        'French Crop', 'Quiff', 'Comb Over', 'Taper', 'Mohawk', 'Shaggy', 'Slick Back', 'Spiky', 'Curly Style', 'Modern Mullet'
      ][i % 20],
      description: [
        'Traditional haircut for men and women.', 'Modern fade style.', 'Creative hair styling and coloring.', 'Short and easy buzz cut.', 'Layered look for volume.',
        'Trendy undercut style.', 'Classic pompadour.', 'Simple crew cut.', 'Textured crop for a modern look.', 'Side part for a clean finish.',
        'French crop for sophistication.', 'Quiff for volume.', 'Comb over for style.', 'Taper for a neat look.', 'Mohawk for boldness.',
        'Shaggy for a relaxed vibe.', 'Slick back for elegance.', 'Spiky for fun.', 'Curly style for natural curls.', 'Modern mullet for trendsetters.'
      ][i % 20],
      basePrice: 20 + (i % 10) * 5,
      imageUrl: [
        'https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&w=400&h=300',
        'https://images.pexels.com/photos/1813272/pexels-photo-1813272.jpeg?auto=compress&w=400&h=300',
        'https://images.pexels.com/photos/3993448/pexels-photo-3993448.jpeg?auto=compress&w=400&h=300',
        'https://images.pexels.com/photos/3993458/pexels-photo-3993458.jpeg?auto=compress&w=400&h=300',
        'https://images.pexels.com/photos/3993459/pexels-photo-3993459.jpeg?auto=compress&w=400&h=300',
        'https://images.pexels.com/photos/3993460/pexels-photo-3993460.jpeg?auto=compress&w=400&h=300',
        'https://images.pexels.com/photos/3993461/pexels-photo-3993461.jpeg?auto=compress&w=400&h=300',
        'https://images.pexels.com/photos/3993462/pexels-photo-3993462.jpeg?auto=compress&w=400&h=300',
        'https://images.pexels.com/photos/3993463/pexels-photo-3993463.jpeg?auto=compress&w=400&h=300',
        'https://images.pexels.com/photos/3993464/pexels-photo-3993464.jpeg?auto=compress&w=400&h=300',
        'https://images.pexels.com/photos/3993445/pexels-photo-3993445.jpeg?auto=compress&w=400&h=300',
        'https://images.pexels.com/photos/3993446/pexels-photo-3993446.jpeg?auto=compress&w=400&h=300',
        'https://images.pexels.com/photos/3993447/pexels-photo-3993447.jpeg?auto=compress&w=400&h=300',
        'https://images.pexels.com/photos/3993450/pexels-photo-3993450.jpeg?auto=compress&w=400&h=300',
        'https://images.pexels.com/photos/3993451/pexels-photo-3993451.jpeg?auto=compress&w=400&h=300',
        'https://images.pexels.com/photos/3993452/pexels-photo-3993452.jpeg?auto=compress&w=400&h=300',
        'https://images.pexels.com/photos/3993453/pexels-photo-3993453.jpeg?auto=compress&w=400&h=300',
        'https://images.pexels.com/photos/3993454/pexels-photo-3993454.jpeg?auto=compress&w=400&h=300',
        'https://images.pexels.com/photos/3993455/pexels-photo-3993455.jpeg?auto=compress&w=400&h=300'
      ][i % 20],
      provider: { businessName: [
        'Urban Cuts', 'Classic Barbers', 'Shear Genius', 'Downtown Styles', 'Fade Masters', 'Layered Lounge', 'Pompadour Palace', 'Crew HQ', 'Crop Shop', 'Side Part Studio',
        'French Crop House', 'Quiff Corner', 'Comb Over Club', 'Taper Town', 'Mohawk Mania', 'Shaggy Shack', 'Slick Back Barbers', 'Spiky Spot', 'Curly Crew', 'Mullet Magic'
      ][i % 20] }
    })
    )
  );
  const [loading] = useState(false);

  return (
    <>
      <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: 'Manrope, sans-serif', padding: '60px 0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
          <h1 style={{ fontSize: 36, fontWeight: 800, textAlign: 'center', marginBottom: 40, letterSpacing: '-1px', color: '#222' }}>Haircuts</h1>
          {loading ? (
            <div style={{ textAlign: 'center', color: '#6b7280', fontSize: 18 }}>Loading services...</div>
          ) : services.length === 0 ? (
            <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.10)', padding: 32, textAlign: 'center', color: '#6b7280', fontSize: 18 }}>
              No haircut services found.
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', justifyContent: 'center' }}>
                {services.map((service) => (
                  <Link key={service.id} href={`/services/[id]?id=${service.id}`} as={`/services/${service.id}`} style={{ textDecoration: 'none' }}>
                    <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.10)', width: 320, minHeight: 340, overflow: 'hidden', display: 'flex', flexDirection: 'column', marginBottom: 24 }}>
                      <div style={{ height: 170, width: '100%', background: service.imageUrl ? `url(${service.imageUrl}) center/cover no-repeat` : '#f3f4f6' }}></div>
                      <div style={{ padding: 24, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: 18, color: '#222', marginBottom: 8 }}>{service.name}</div>
                        <div style={{ color: '#6b7280', fontSize: 15, marginBottom: 8 }}>{service.description}</div>
                        <div style={{ color: '#10b981', fontWeight: 700, fontSize: 17, marginBottom: 8 }}>${service.basePrice}</div>
                        <div style={{ color: '#6b7280', fontSize: 14 }}>Provider: {service.provider?.businessName}</div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
