"use client";
import Link from "next/link";

import React from "react";

const updates = [
  {
    title: "Top 5 Skincare Tips for Glowing Skin",
    date: "20th February, 2025",
    read: "5 min read",
    image: "/blog1.jpg",
    tag: "Skincare Tips"
  },
  {
    title: "The Ultimate Guide to Stress Relief with Massage",
    date: "July 30, 2025",
    read: "5 min read",
    image: "/blog2.jpg",
    tag: "Wellness"
  },
  {
    title: "How to Choose the Right Facial Treatment",
    date: "20th February, 2025",
    read: "5 min read",
    image: "/blog3.jpg",
    tag: "Beauty"
  }
];

export default function UpdatesPage() {
  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: 'Manrope, sans-serif', padding: '60px 0' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, textAlign: 'center', marginBottom: 40, letterSpacing: '-1px', color: '#222' }}>Latest Updates</h1>
        <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', justifyContent: 'center' }}>
          {updates.map((u, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.10)', overflow: 'hidden', width: 340, minHeight: 380, display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: 170, width: '100%', background: `url(${u.image}) center/cover no-repeat` }}></div>
              <div style={{ padding: 24, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ background: '#22C55E', color: '#fff', fontSize: 12, fontWeight: 600, borderRadius: 4, padding: '2px 10px', marginRight: 10 }}>{u.tag}</span>
                  <span style={{ color: '#7A7A7A', fontSize: 13, marginRight: 10 }}>{u.date}</span>
                  <span style={{ color: '#7A7A7A', fontSize: 13 }}>{u.read}</span>
                </div>
                <div style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: 18, color: '#222', marginBottom: 12 }}>{u.title}</div>
                <Link href="#" style={{ color: '#10b981', fontWeight: 600, fontSize: 15, textDecoration: 'none' }}>Read More</Link>
// ...ensure import Link from "next/link" is present at the top...
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
