"use client";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { logout } from "../auth/logout";

export default function UserMenu() {
  const [user, setUser] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    if (!token) return;
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    })
      .then(res => setUser(res.data))
      .catch(() => setUser(null));
  }, []);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      window.location.href = "/";
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  if (!user) return null;

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          background: 'none',
          color: '#222',
          fontWeight: 700,
          fontSize: 16,
          border: 'none',
          borderRadius: 0,
          padding: 0,
          marginLeft: 12,
          textDecoration: 'none',
          boxShadow: 'none',
          cursor: 'pointer',
          fontFamily: 'inherit',
        }}
        onClick={() => setOpen((prevOpen) => !prevOpen)}
        aria-haspopup="true"
        aria-expanded={open}
      >
        <i className="fa-regular fa-user" style={{ fontSize: 20, marginRight: 4 }}></i>
        <span>{user.firstName}</span>
        <span style={{ fontSize: 13, color: '#222', fontWeight: 400, marginLeft: 2 }}>Account</span>
      </button>
      {open && (
        <div style={{
          position: 'absolute',
          right: 0,
          marginTop: '8px',
          width: '160px',
          backgroundColor: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          zIndex: 50
        }}>
          <button
            style={{
              width: '100%',
              textAlign: 'left',
              padding: '12px 16px',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              color: '#374151'
            }}
            onMouseOver={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#f3f4f6'}
            onMouseOut={(e) => (e.target as HTMLButtonElement).style.backgroundColor = 'transparent'}
            onClick={handleLogout}
          >
            <i className="fa-solid fa-sign-out-alt" style={{ marginRight: '8px' }}></i>
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
