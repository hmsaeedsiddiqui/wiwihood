"use client";

import React from "react";

const testimonials = [
  {
    name: "Sarah M.",
    text: "Reservista made booking my beauty appointments so easy! The providers are top-notch and I love the secure payment system.",
    image: "/blog1.jpg"
  },
  {
    name: "James L.",
    text: "I found a great home cleaning service through Reservista. The reviews helped me choose the best provider!",
    image: "/blog2.jpg"
  },
  {
    name: "Priya S.",
    text: "The booking process is seamless and I always get reminders for my appointments. Highly recommended!",
    image: "/blog3.jpg"
  }
];

export default function TestimonialsPage() {
  return (
    <div style={{ background: '#222', minHeight: '100vh', color: '#fff', fontFamily: 'Manrope, sans-serif', padding: '60px 0' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px' }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, textAlign: 'center', marginBottom: 40, letterSpacing: '-1px' }}>Testimonials</h1>
        <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', justifyContent: 'center' }}>
          {testimonials.map((t, i) => (
            <div key={i} style={{ background: '#292929', borderRadius: 18, padding: 32, maxWidth: 320, minWidth: 260, boxShadow: '0 8px 32px rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <img src={t.image} alt={t.name} style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', marginBottom: 18, border: '3px solid #10b981' }} />
              <div style={{ fontSize: 17, fontWeight: 500, marginBottom: 12, textAlign: 'center' }}>&ldquo;{t.text}&rdquo;</div>
              <div style={{ fontWeight: 700, color: '#10b981', fontSize: 16 }}>{t.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
