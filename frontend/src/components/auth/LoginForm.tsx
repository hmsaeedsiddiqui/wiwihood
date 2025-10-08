"use client";

import React, { useState } from "react";
import { useAuthStore } from "@/store/authStore";

export default function LoginForm({ onSuccess }: { onSuccess?: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      await login({ email, password });
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 p-3 rounded-2xl">
      <div className="">
        {/* Wiwihood Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px auto'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #f97316 0%, #ec4899 100%)',
              borderRadius: '16px',
              padding: '12px',
              marginRight: '12px'
            }}>
              <span style={{
                fontSize: '32px',
                fontWeight: '700',
                color: '#ffffff'
              }}>
                W
              </span>
            </div>
            <span style={{
              fontSize: '28px',
              fontWeight: '700',
              background: 'linear-gradient(135deg, #f97316 0%, #ec4899 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent'
            }}>
              Wiwihood
            </span>
          </div>
        </div>
        <h2 className="auth-form-title">Sign In</h2>
        
        {error && (
          <div className="auth-error-message">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="form-input"
              placeholder="Your Email"
              autoComplete="email"
            />
          </div>
          
          <div className="form-group">
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="form-input"
                placeholder="Your Password"
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="auth-submit-btn"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
           <div className="text-center mt-6">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <a 
              href="/auth/register" 
              className="text-green-600 font-semibold hover:text-green-500 transition-colors"
            >
              Sign up here
            </a>
          </p>
        </div>
        </form>
        
      </div>
    </div>
  );
}
