
"use client";
import Footer from '../../components/Footer';

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { apiService, Service, Category } from "@/lib/api";

export default function MassagesPage() {
  const [services] = useState(
    Array.from({ length: 20 }).map((_, i) => ({
      id: `MSG-${(i+1).toString().padStart(3, '0')}`,
      name: [
        'Swedish Massage', 'Deep Tissue Massage', 'Aromatherapy Massage', 'Hot Stone Massage', 'Thai Massage', 'Sports Massage', 'Prenatal Massage', 'Reflexology', 'Shiatsu', 'Trigger Point Therapy',
        'Couples Massage', 'Chair Massage', 'Lymphatic Drainage', 'Craniosacral Therapy', 'Facial Massage', 'Hand Massage', 'Foot Massage', 'Back Massage', 'Neck Massage', 'Full Body Massage'
      ][i % 20],
      description: [
        'Relaxing full body massage.', 'Intense muscle relief.', 'Massage with essential oils.', 'Heated stones for relaxation.', 'Traditional Thai techniques.',
        'For athletes and active people.', 'Massage for expectant mothers.', 'Pressure points in feet.', 'Japanese finger pressure.', 'Targeted pain relief.',
        'Massage for couples.', 'Quick seated massage.', 'Gentle lymph flow.', 'Head and neck relaxation.', 'Facial rejuvenation.',
        'Hand relaxation.', 'Foot therapy.', 'Back pain relief.', 'Neck tension release.', 'Complete relaxation.'
      ][i % 20],
      basePrice: 50 + (i % 10) * 5,
      imageUrl: [
        'https://images.pexels.com/photos/3757942/pexels-photo-3757942.jpeg?auto=compress&w=400&h=300',
        'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&w=400&h=300',
        'https://images.pexels.com/photos/3993447/pexels-photo-3993447.jpeg?auto=compress&w=400&h=300',
        'https://images.pexels.com/photos/3993446/pexels-photo-3993446.jpeg?auto=compress&w=400&h=300',
        'https://images.pexels.com/photos/3993445/pexels-photo-3993445.jpeg?auto=compress&w=400&h=300',
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
      provider: { businessName: [
        'Relax Spa', 'Therapy Touch', 'Beauty Bliss', 'Hot Stone Studio', 'Thai Wellness', 'Sports Relief', 'Prenatal Care', 'Reflex Point', 'Shiatsu House', 'Trigger Therapy',
        'Couples Retreat', 'Chair Zone', 'Lymph Flow', 'Cranio Center', 'Facial Spa', 'Hand Haven', 'Foot Focus', 'Back Base', 'Neck Nook', 'Full Body Spa'
      ][i % 20] }
    }))
  );
  const [loading] = useState(false);

  return (
    <>
      <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: 'Manrope, sans-serif', padding: '60px 0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
          <h1 style={{ fontSize: 36, fontWeight: 800, textAlign: 'center', marginBottom: 40, letterSpacing: '-1px', color: '#222' }}>Massages</h1>
          {loading ? (
            <div style={{ textAlign: 'center', color: '#6b7280', fontSize: 18 }}>Loading services...</div>
          ) : services.length === 0 ? (
            <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.10)', padding: 32, textAlign: 'center', color: '#6b7280', fontSize: 18 }}>
              No massage services found.
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
