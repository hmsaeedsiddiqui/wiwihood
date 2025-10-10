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
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/auth/register`,
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
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
      <div className="space-y-6">
        {/* Wiwihood Header */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-br from-orange-500 to-pink-500 rounded-2xl p-3 mr-3">
              <span className="text-2xl font-bold text-white">W</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-br from-orange-500 to-pink-500 bg-clip-text text-transparent">
              Wiwihood
            </span>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">Create Account</h2>
        <p className="text-center text-gray-600 text-sm mb-4">Join our platform to access amazing services</p>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {Array.isArray(error) ? (
              <ul className="list-disc list-inside space-y-1">
                {error.map((msg, i) => <li key={i}>{msg}</li>)}
              </ul>
            ) : error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="First Name"
                autoComplete="given-name"
              />
            </div>
            <div>
              <input
                type="text"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Last Name"
                autoComplete="family-name"
              />
            </div>
          </div>
          
          <div>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Your Email"
              autoComplete="email"
            />
          </div>
          
          <div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent pr-12"
                placeholder="Your Password"
                autoComplete="new-password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L7.05 7.05M9.878 9.878a3 3 0 00-.007 4.243m4.242-4.242L16.95 7.05M14.121 14.121a3 3 0 01-4.243 0m4.243 0l2.829 2.829M14.121 14.121L19.071 9.171" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3 px-4 rounded-lg font-semibold hover:from-orange-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating account...
              </div>
            ) : (
              "Create Account"
            )}
          </button>
        </form>
        
        <div className="text-center mt-6">
          <p className="text-gray-600">
            Already have an account?{' '}
            <a 
              href="/auth/login" 
              className="text-orange-600 font-semibold hover:text-orange-500 transition-colors"
            >
              Sign in here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
