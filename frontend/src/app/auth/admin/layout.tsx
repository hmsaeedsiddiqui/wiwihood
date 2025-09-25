"use client";

import React from "react";
import Link from "next/link";

export default function AdminAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      {/* Admin Auth Header */}
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
                color: '#dc2626',
                letterSpacing: '-0.025em'
              }}>
                Reservista
              </span>
              <span style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#ffffff',
                backgroundColor: '#dc2626',
                padding: '4px 8px',
                borderRadius: '4px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Admin
              </span>
            </Link>
          </div>

          {/* Right - Navigation Links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <Link 
              href="/auth/provider/login" 
              style={{ 
                color: '#6b7280',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Provider Login
            </Link>
            <Link 
              href="/auth/customer/login" 
              style={{ 
                color: '#6b7280',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Customer Login
            </Link>
            
            <div style={{
              height: '24px',
              width: '1px',
              backgroundColor: '#e5e7eb'
            }} />
            
            <Link
              href="/"
              style={{
                color: '#374151',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '500',
                padding: '8px 16px',
                borderRadius: '6px',
                border: '1px solid #d1d5db',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#f9fafb';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
              }}
            >
              Back to Site
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Auth Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer style={{
        backgroundColor: '#f9fafb',
        borderTop: '1px solid #e5e7eb',
        padding: '24px 0',
        marginTop: 'auto'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '16px'
        }}>
          <div style={{
            display: 'flex',
            gap: '32px',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            <Link 
              href="/about" 
              style={{ 
                color: '#6b7280', 
                textDecoration: 'none',
                fontSize: '14px'
              }}
            >
              About
            </Link>
            <Link 
              href="/contact" 
              style={{ 
                color: '#6b7280', 
                textDecoration: 'none',
                fontSize: '14px'
              }}
            >
              Contact
            </Link>
            <Link 
              href="/privacy" 
              style={{ 
                color: '#6b7280', 
                textDecoration: 'none',
                fontSize: '14px'
              }}
            >
              Privacy Policy
            </Link>
            <Link 
              href="/terms" 
              style={{ 
                color: '#6b7280', 
                textDecoration: 'none',
                fontSize: '14px'
              }}
            >
              Terms of Service
            </Link>
          </div>
          
          <div style={{
            color: '#9ca3af',
            fontSize: '14px'
          }}>
            © 2024 Reservista Admin Portal. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}