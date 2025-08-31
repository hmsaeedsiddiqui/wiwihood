"use client";

import React from "react";

const steps = [
  {
    step: '01',
    title: 'Search & Discover',
    description: 'Find the perfect service provider near you',
  },
  {
    step: '02',
    title: 'Compare & Choose',
    description: 'Review profiles, ratings, and pricing options',
  },
  {
    step: '03',
    title: 'Book & Confirm',
    description: 'Schedule your appointment and receive instant confirmation',
  }
];

export default function HowItWorksPage() {
  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: 'Manrope, sans-serif', padding: '60px 0' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px' }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, textAlign: 'center', marginBottom: 40, letterSpacing: '-1px', color: '#222' }}>How it Works</h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 32, justifyContent: 'center', alignItems: 'stretch', width: '100%' }}>
          {steps.map((step, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: 18, boxShadow: '0 8px 32px rgba(0,0,0,0.10)', padding: '40px 32px 32px 32px', minWidth: 220, maxWidth: 340, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'relative', width: '100%' }}>
              <div style={{ background: '#d4f4dd', borderRadius: '12px', width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, fontWeight: 700, fontSize: 22, color: '#10b981' }}>{step.step}</div>
              <h3 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: 22, color: '#1f2937', marginBottom: 12 }}>{step.title}</h3>
              <p style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 400, fontSize: 15, color: '#6b7280', lineHeight: 1.6, margin: 0 }}>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
