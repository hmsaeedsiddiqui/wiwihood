"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function CustomerHeader() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('customerToken') : null;
      
      if (token) {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/auth/profile`,
            {
              headers: { Authorization: `Bearer ${token}` },
              withCredentials: true,
            }
          );

          if (response.data && response.data.role === 'customer') {
            setUser(response.data);
            setIsLoggedIn(true);
          } else {
            setIsLoggedIn(false);
            setUser(null);
          }
        } catch (error) {
          setIsLoggedIn(false);
          setUser(null);
        }
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    };

    checkAuth();
  }, []);

  // Click outside handler for profile dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    if (isProfileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isProfileOpen]);

  const handleLogout = async () => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/auth/logout`,
        {},
        { withCredentials: true }
      );
      localStorage.removeItem("customerToken");
      localStorage.removeItem("customer");
      setIsLoggedIn(false);
      setUser(null);
      router.push("/");
    } catch (err) {
      console.error("Logout failed", err);
      // Still clear local storage and redirect even if API call fails
      localStorage.removeItem("customerToken");
      localStorage.removeItem("customer");
      setIsLoggedIn(false);
      setUser(null);
      router.push("/");
    }
  };

  return (
    <header style={{
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e5e7eb',
      height: '80px',
      width: '100%',
      position: 'sticky',
      top: 0,
      zIndex: 10001
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

        {/* Right - Auth/Profile */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          {isLoggedIn && user ? (
            <>
              {/* Shopping Cart */}
              <button style={{
                position: 'relative',
                padding: '8px',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: '#6b7280',
                borderRadius: '6px',
                transition: 'all 0.2s ease-in-out'
              }}>
                <svg style={{ height: '24px', width: '24px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 7H17M9 19.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM20.5 19.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                </svg>
                <span style={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  height: '18px',
                  minWidth: '18px',
                  backgroundColor: '#059669',
                  borderRadius: '50%',
                  border: '2px solid #ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#ffffff'
                }}>0</span>
              </button>

              {/* User Profile */}
              <div className="relative" ref={profileRef} style={{ zIndex: 10000 }}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '6px 12px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    borderRadius: '8px',
                    transition: 'background-color 0.2s ease-in-out'
                  }}
                >
                  <div style={{ textAlign: 'right' }}>
                    <div style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#1f2937',
                      lineHeight: '1.25'
                    }}>
                      {user.firstName} {user.lastName}
                    </div>
                    <div style={{
                      fontSize: '13px',
                      color: '#6b7280',
                      lineHeight: '1.25'
                    }}>
                      Customer
                    </div>
                  </div>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: '#3b82f6',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#ffffff',
                    border: '2px solid #e5e7eb'
                  }}>
                    {user.firstName?.[0]}{user.lastName?.[0]}
                  </div>
                </button>

                {/* Profile Dropdown */}
                {isProfileOpen && (
                  <div style={{
                    position: 'fixed',
                    right: '24px',
                    top: '80px',
                    width: '200px',
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    zIndex: 99999,
                    padding: '8px'
                  }}>
                    <Link
                      href="/profile"
                      onClick={() => setIsProfileOpen(false)}
                      style={{
                        display: 'block',
                        width: '100%',
                        textAlign: 'left',
                        padding: '8px 12px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '14px',
                        color: '#374151',
                        borderRadius: '4px',
                        textDecoration: 'none',
                        transition: 'background-color 0.2s ease-in-out'
                      }}
                    >
                      👤 My Profile
                    </Link>
                    <Link
                      href="/bookings"
                      onClick={() => setIsProfileOpen(false)}
                      style={{
                        display: 'block',
                        width: '100%',
                        textAlign: 'left',
                        padding: '8px 12px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '14px',
                        color: '#374151',
                        borderRadius: '4px',
                        textDecoration: 'none',
                        transition: 'background-color 0.2s ease-in-out'
                      }}
                    >
                      📅 My Bookings
                    </Link>
                    <Link
                      href="/favorites"
                      onClick={() => setIsProfileOpen(false)}
                      style={{
                        display: 'block',
                        width: '100%',
                        textAlign: 'left',
                        padding: '8px 12px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '14px',
                        color: '#374151',
                        borderRadius: '4px',
                        textDecoration: 'none',
                        transition: 'background-color 0.2s ease-in-out'
                      }}
                    >
                      ❤️ Favorites
                    </Link>
                    <div style={{ height: '1px', backgroundColor: '#e5e7eb', margin: '4px 0' }}></div>
                    <button
                      onClick={handleLogout}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '8px 12px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '14px',
                        color: '#ef4444',
                        borderRadius: '4px',
                        transition: 'background-color 0.2s ease-in-out'
                      }}
                    >
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Not Logged In */}
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
            </>
          )}
        </div>
      </div>
    </header>
  );
}
