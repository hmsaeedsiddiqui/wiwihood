"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function ProviderHeader() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
      
      if (token) {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1/auth/profile`,
            {
              headers: { Authorization: `Bearer ${token}` },
              withCredentials: true,
            }
          );

          if (response.data && response.data.role === 'provider') {
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
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1/auth/logout`,
        {},
        { withCredentials: true }
      );
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      setIsLoggedIn(false);
      setUser(null);
      router.push("/");
    } catch (err) {
      console.error("Logout failed", err);
      // Still clear local storage and redirect even if API call fails
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      setIsLoggedIn(false);
      setUser(null);
      router.push("/");
    }
  };

  return (
    <header style={{
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e5e7eb',
      height: '64px',
      display: 'flex',
      alignItems: 'center',
      padding: '0 24px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        
        {/* Left - Logo and Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Link href="/provider/dashboard" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            textDecoration: 'none',
            gap: '8px'
          }}>
            <span style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#059669',
              letterSpacing: '-0.025em'
            }}>
              Reservista
            </span>
            <span style={{
              fontSize: '12px',
              color: '#6b7280',
              fontWeight: '500',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              PROVIDER DASHBOARD
            </span>
          </Link>
        </div>

        {/* Center - Search Bar */}
        <div style={{
          flex: '1',
          maxWidth: '400px',
          margin: '0 48px'
        }}>
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '16px',
              transform: 'translateY(-50%)',
              pointerEvents: 'none'
            }}>
              <svg style={{ height: '18px', width: '18px', color: '#9ca3af' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                paddingTop: '10px',
                paddingBottom: '10px',
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
            />
          </div>
        </div>

        {/* Right - Notifications and Profile */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px'
        }}>
          {isLoggedIn && user ? (
            <>
              {/* Notification Bell */}
              <button style={{
                position: 'relative',
                padding: '8px',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: '#6b7280',
                transition: 'color 0.2s ease-in-out'
              }}
              onMouseEnter={(e) => {
                const target = e.target as HTMLButtonElement;
                target.style.color = '#374151';
              }}
              onMouseLeave={(e) => {
                const target = e.target as HTMLButtonElement;
                target.style.color = '#6b7280';
              }}>
                <svg style={{ height: '20px', width: '20px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-3-3V9a6 6 0 10-12 0v5l-3 3h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span style={{
                  position: 'absolute',
                  top: '6px',
                  right: '6px',
                  height: '8px',
                  width: '8px',
                  backgroundColor: '#ef4444',
                  borderRadius: '50%',
                  border: '2px solid #ffffff'
                }}></span>
              </button>

              {/* User Profile */}
              <div className="relative" ref={profileRef}>
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
                  onMouseEnter={(e) => {
                    const target = e.target as HTMLButtonElement;
                    target.style.backgroundColor = '#f3f4f6';
                  }}
                  onMouseLeave={(e) => {
                    const target = e.target as HTMLButtonElement;
                    target.style.backgroundColor = 'transparent';
                  }}
                >
                  <div style={{ textAlign: 'right' }}>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#374151',
                      lineHeight: '1.2'
                    }}>
                      {user.firstName} {user.lastName}
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: '#6b7280',
                      lineHeight: '1.2'
                    }}>
                      Provider
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
                    color: '#ffffff'
                  }}>
                    {user.firstName?.[0]}{user.lastName?.[0]}
                  </div>
                </button>

                {isProfileOpen && (
                  <div style={{
                    position: 'absolute',
                    right: 0,
                    top: '100%',
                    marginTop: '8px',
                    width: '200px',
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    zIndex: 50,
                    padding: '8px'
                  }}>
                    <Link
                      href="/provider/profile"
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
                      onMouseOver={(e) => (e.target as HTMLAnchorElement).style.backgroundColor = '#f3f4f6'}
                      onMouseOut={(e) => (e.target as HTMLAnchorElement).style.backgroundColor = 'transparent'}
                    >
                      👤 Profile
                    </Link>
                    <Link
                      href="/provider/settings"
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
                      onMouseOver={(e) => (e.target as HTMLAnchorElement).style.backgroundColor = '#f3f4f6'}
                      onMouseOut={(e) => (e.target as HTMLAnchorElement).style.backgroundColor = 'transparent'}
                    >
                      ⚙️ Settings
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
                      onMouseOver={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#fef2f2'}
                      onMouseOut={(e) => (e.target as HTMLButtonElement).style.backgroundColor = 'transparent'}
                    >
                      🚪 Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Login/Signup buttons for non-authenticated users */
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Link
                href="/auth/provider/login"
                style={{
                  color: '#6b7280',
                  fontSize: '14px',
                  fontWeight: '500',
                  textDecoration: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  transition: 'all 0.2s ease-in-out'
                }}
                onMouseOver={(e) => {
                  const target = e.target as HTMLAnchorElement;
                  target.style.color = '#374151';
                  target.style.backgroundColor = '#f3f4f6';
                }}
                onMouseOut={(e) => {
                  const target = e.target as HTMLAnchorElement;
                  target.style.color = '#6b7280';
                  target.style.backgroundColor = 'transparent';
                }}
              >
                Sign In
              </Link>
              <Link
                href="/auth/provider/signup"
                style={{
                  backgroundColor: '#3b82f6',
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: '500',
                  textDecoration: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  transition: 'background-color 0.2s ease-in-out'
                }}
                onMouseOver={(e) => {
                  const target = e.target as HTMLAnchorElement;
                  target.style.backgroundColor = '#2563eb';
                }}
                onMouseOut={(e) => {
                  const target = e.target as HTMLAnchorElement;
                  target.style.backgroundColor = '#3b82f6';
                }}
              >
                Join as Provider
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
