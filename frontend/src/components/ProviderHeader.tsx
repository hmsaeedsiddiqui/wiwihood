"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import ProviderSidebar from "./ProviderSidebar";

export default function ProviderHeader() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  const profileRef = useRef<HTMLDivElement>(null);

  // Responsive check
  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 1024);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  // Auth check
  useEffect(() => {
    const checkAuth = async () => {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("providerToken") : null;
      if (token) {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/auth/profile`,
            {
              headers: { Authorization: `Bearer ${token}` },
              withCredentials: true,
            }
          );
          if (response.data && response.data.role === "provider") {
            setUser(response.data);
            setIsLoggedIn(true);
          } else {
            setIsLoggedIn(false);
            setUser(null);
          }
        } catch {
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

  // Outside click for profile dropdown
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
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      localStorage.removeItem("providerToken");
      localStorage.removeItem("provider");
      setIsLoggedIn(false);
      setUser(null);
      router.push("/auth/provider/login");
    }
  };

  return (
    <>
      <header className="bg-white shadow-sm  top-0 z-40 fixed w-full mb-[10px]">
        <div className="flex items-center justify-between px-4 py-3 lg:px-8">
          {/* Left side */}
          <div className="flex items-center space-x-4">
            {isMobile && (
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                style={{
                  // padding: "8px 12px",
                 
                  backgroundColor: sidebarOpen ? "#fff" : "#fff",
                  color: "rgb(34, 197, 94)",
                  
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s",
                  width: "50px",
                  height: "50px",
                  position: "relative",
                }}
                aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
              >
                {sidebarOpen ? (
                  // Cross icon
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgb(34, 197, 94)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                ) : (
                  // Hamburger icon
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgb(34, 197, 94)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="4" y1="7" x2="20" y2="7" />
                    <line x1="4" y1="12" x2="20" y2="12" />
                    <line x1="4" y1="17" x2="20" y2="17" />
                  </svg>
                )}
              </button>
            )}

            {!isMobile && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/provider/dashboard" style={{ 
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
            )}
          </div>

          {/* Search bar (desktop only) */}
          {!isMobile && (
            <div className="flex-1 max-w-md mx-6">
              <input
                type="text"
                placeholder="Search bookings..."
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
          )}

          {/* Right side */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: isMobile ? "10px" : "20px",
            }}
          >
            {/* Notification Bell */}
            <button
              style={{
                position: "relative",
                padding: "8px",
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer",
                color: "#6b7280",
                borderRadius: "6px",
                transition: "all 0.2s ease-in-out",
              }}
              onMouseEnter={(e) => {
                const target = e.target as HTMLButtonElement;
                target.style.color = "#374151";
                target.style.backgroundColor = "#f3f4f6";
              }}
              onMouseLeave={(e) => {
                const target = e.target as HTMLButtonElement;
                target.style.color = "#6b7280";
                target.style.backgroundColor = "transparent";
              }}
            >
              <svg
                style={{ height: "24px", width: "24px" }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-3-3V9a6 6 0 10-12 0v5l-3 3h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              <span
                style={{
                  position: "absolute",
                  top: "6px",
                  right: "6px",
                  height: "8px",
                  width: "8px",
                  backgroundColor: "#ef4444",
                  borderRadius: "50%",
                  border: "2px solid #ffffff",
                }}
              />
            </button>

            {/* Profile / Auth */}
            {isLoggedIn && user ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "6px 12px",
                    backgroundColor: "transparent",
                    border: "none",
                    cursor: "pointer",
                    borderRadius: "8px",
                    transition: "background-color 0.2s ease-in-out",
                  }}
                  onMouseEnter={(e) => {
                    const target = e.target as HTMLButtonElement;
                    target.style.backgroundColor = "#f3f4f6";
                  }}
                  onMouseLeave={(e) => {
                    const target = e.target as HTMLButtonElement;
                    target.style.backgroundColor = "transparent";
                  }}
                >
                  <div style={{ textAlign: "right" }}>
                    <div
                      style={{
                        fontSize: "16px",
                        fontWeight: "600",
                        color: "#1f2937",
                        lineHeight: "1.25",
                      }}
                    >
                      {user.firstName} {user.lastName}
                    </div>
                    <div
                      style={{
                        fontSize: "13px",
                        color: "#6b7280",
                        lineHeight: "1.25",
                      }}
                    >
                      Provider
                    </div>
                  </div>
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      backgroundColor: "#3b82f6",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "18px",
                      fontWeight: "600",
                      color: "#ffffff",
                      border: "2px solid #e5e7eb",
                    }}
                  >
                    {user.firstName?.[0]}
                    {user.lastName?.[0]}
                  </div>
                </button>

                {/* Profile Dropdown */}
                {isProfileOpen && (
                  <div
                    style={{
                      position: "absolute",
                      right: 0,
                      top: "100%",
                      marginTop: "8px",
                      width: "200px",
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                      zIndex: 50,
                      padding: "8px",
                    }}
                  >
                    <Link
                      href="/provider/profile"
                      onClick={() => setIsProfileOpen(false)}
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      👤 Profile
                    </Link>
                    <Link
                      href="/provider/account"
                      onClick={() => setIsProfileOpen(false)}
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      🧑‍💼 Account Settings
                    </Link>
                    <Link
                      href="/provider/settings"
                      onClick={() => setIsProfileOpen(false)}
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      ⚙️ Settings
                    </Link>
                    <div className="border-t my-2" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                    >
                      🚪 Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <Link
                  href="/auth/provider/login"
                  className="px-4 py-2 rounded hover:bg-gray-100 text-gray-600"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/provider/signup"
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Sidebar (mobile only) */}
      {isMobile && (
        <ProviderSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      )}
    </>
  );
}
