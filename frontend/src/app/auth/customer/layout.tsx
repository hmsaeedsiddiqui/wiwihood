"use client";

import React from "react";
import Link from "next/link";

export default function CustomerAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      {/* Customer Auth Header */}
      <header style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e5e7eb',
        height: '80px',
        width: '100%',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}>
        <div style={{
          height: '100%',
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px'
        }}>
          
          {/* Left - Logo */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Link href="/" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              textDecoration: 'none'
            }}>
              <span style={{
                fontSize: '32px',
                fontWeight: '700',
                color: '#059669',
                letterSpacing: '-0.025em'
              }}>
                Reservista
              </span>
            </Link>
            <span style={{
              marginLeft: '12px',
              height: '24px',
              width: '1px',
              backgroundColor: '#d1d5db'
            }}></span>
            <span style={{
              marginLeft: '12px',
              fontSize: '14px',
              color: '#6b7280',
              fontWeight: '500'
            }}>
              Customer Portal
            </span>
          </div>

          {/* Center - Navigation */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <Link href="/" style={{
              fontSize: '16px',
              fontWeight: '500',
              color: '#374151',
              textDecoration: 'none',
              transition: 'color 0.2s ease-in-out'
            }}>
              Home
            </Link>
            <Link href="/shop" style={{
              fontSize: '16px',
              fontWeight: '500',
              color: '#374151',
              textDecoration: 'none',
              transition: 'color 0.2s ease-in-out'
            }}>
              Shop
            </Link>
            <Link href="/services" style={{
              fontSize: '16px',
              fontWeight: '500',
              color: '#374151',
              textDecoration: 'none',
              transition: 'color 0.2s ease-in-out'
            }}>
              Services
            </Link>
            <Link href="/about" style={{
              fontSize: '16px',
              fontWeight: '500',
              color: '#374151',
              textDecoration: 'none',
              transition: 'color 0.2s ease-in-out'
            }}>
              About
            </Link>
          </nav>

          {/* Right - Auth Links */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            <Link href="/auth/customer/login" style={{
              fontSize: '16px',
              fontWeight: '500',
              color: '#374151',
              textDecoration: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              transition: 'all 0.2s ease-in-out'
            }}>
              Sign In
            </Link>
            <Link href="/auth/customer/register" style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#ffffff',
              textDecoration: 'none',
              backgroundColor: '#059669',
              padding: '10px 20px',
              borderRadius: '6px',
              transition: 'all 0.2s ease-in-out'
            }}>
              Sign Up
            </Link>
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
