"use client";

import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../AuthProvider";

export default function SignupForm({ onSuccess }: { onSuccess?: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState<string | string[]>("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1/auth/register`,
        { email, password, firstName, lastName, userRole: 'customer' },
        { withCredentials: true }
      );
      if (res.data && res.data.accessToken) {
        // Use auth context to login
        login(res.data.user, res.data.accessToken);
        if (onSuccess) onSuccess();
      }
    } catch (err: any) {
      const msg = err.response?.data?.message;
      setError(Array.isArray(msg) ? msg : msg || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form-container">
      <div className="auth-form-card">
        <h2 className="auth-form-title">Create Account</h2>
        
        {error && (
          <div className="auth-error-message">
            {Array.isArray(error) ? (
              <ul className="error-list">
                {error.map((msg, i) => <li key={i}>{msg}</li>)}
              </ul>
            ) : error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-row">
            <div className="form-group">
              <input
                type="text"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                required
                className="form-input"
                placeholder="First Name"
                autoComplete="given-name"
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                required
                className="form-input"
                placeholder="Last Name"
                autoComplete="family-name"
              />
            </div>
          </div>
          
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
                autoComplete="new-password"
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
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>
        
        <div className="auth-link">
          Already have an account?{' '}
          <a href="/auth/login" className="auth-link-anchor">
            Sign in here
          </a>
        </div>
      </div>
    </div>
  );
}
