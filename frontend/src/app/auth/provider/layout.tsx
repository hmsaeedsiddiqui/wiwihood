"use client";

import React from "react";
import Link from "next/link";

export default function ProviderAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      {/* Provider Auth Header */}
      <header style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e5e7eb',
        height: '64px',
        width: '100%',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}>
        <div style={{
          height: '100%',
          maxWidth: '100%',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px'
        }}>
          
          {/* Left - Logo and Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link href="/" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              textDecoration: 'none',
              gap: '12px'
            }}>
              <span style={{
                fontSize: '32px',
                fontWeight: '700',
                color: '#059669',
                letterSpacing: '-0.025em'
              }}>
                Reservista
              </span>
              <span style={{
                fontSize: '14px',
                color: '#6b7280',
                fontWeight: '500',
                textTransform: 'uppercase',
                letterSpacing: '0.1em'
              }}>
                PROVIDER DASHBOARD
              </span>
            </Link>
          </div>

          {/* Center - Search Bar */}
          <div style={{
            flex: '1',
            maxWidth: '500px',
            margin: '0 60px'
          }}>
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '16px',
                transform: 'translateY(-50%)',
                pointerEvents: 'none'
              }}>
                <svg style={{ height: '20px', width: '20px', color: '#9ca3af' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search orders, customers, services..."
                style={{
                  width: '100%',
                  paddingLeft: '48px',
                  paddingRight: '16px',
                  paddingTop: '12px',
                  paddingBottom: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  backgroundColor: '#f9fafb',
                  fontSize: '14px',
                  color: '#374151',
                  outline: 'none',
                  transition: 'all 0.2s ease-in-out'
                }}
                onFocus={(e) => {
                  const target = e.target as HTMLInputElement;
                  target.style.backgroundColor = '#ffffff';
                  target.style.borderColor = '#3b82f6';
                  target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                }}
                onBlur={(e) => {
                  const target = e.target as HTMLInputElement;
                  target.style.backgroundColor = '#f9fafb';
                  target.style.borderColor = '#d1d5db';
                  target.style.boxShadow = 'none';
                }}
                disabled
              />
            </div>
          </div>

          {/* Right - Auth Links */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px'
          }}>
            {/* Notification Bell (disabled for auth) */}
            <button style={{
              position: 'relative',
              padding: '8px',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'not-allowed',
              color: '#d1d5db',
              borderRadius: '6px',
              opacity: 0.5
            }} disabled>
              <svg style={{ height: '24px', width: '24px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-3-3V9a6 6 0 10-12 0v5l-3 3h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>

            {/* Auth State Placeholder */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '6px 12px',
              backgroundColor: 'transparent',
              borderRadius: '8px'
            }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  lineHeight: '1.25'
                }}>
                  Not signed in
                </div>
              </div>
              <div style={{
                width: '44px',
                height: '44px',
                backgroundColor: '#e5e7eb',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                fontWeight: '600',
                color: '#9ca3af',
                border: '2px solid #e5e7eb'
              }}>
                ?
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <main>
        {children}
      </main>
    </div>
  );
}
