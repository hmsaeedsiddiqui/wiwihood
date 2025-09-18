"use client";
import React from "react";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md flex flex-col items-center border border-gray-100">
        <div className="mb-6">
          <span className="inline-block bg-green-100 p-4 rounded-full shadow-lg">
            <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-green-500">
              <rect x="4" y="7" width="16" height="10" rx="2" strokeWidth="2" />
              <rect x="8" y="3" width="8" height="4" rx="1" strokeWidth="2" />
            </svg>
          </span>
        </div>
        <h2 className="text-3xl font-extrabold mb-3 text-center text-gray-900 tracking-tight">Create Your Account</h2>
        <p className="text-gray-500 mb-8 text-center text-lg">
          Sign up for free and create your account to access personalized services and providers.
        </p>
        <form className="w-full flex flex-col gap-5">
          <div className="relative">
            <input type="text" placeholder="Full Name" className="peer w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition placeholder-gray-400 text-gray-900 font-medium bg-gray-50" />
            <span className="absolute left-3 top-1 text-xs text-gray-400 peer-focus:text-green-500 transition">Name</span>
          </div>
          <div className="relative">
            <input type="email" placeholder="Email Address" className="peer w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition placeholder-gray-400 text-gray-900 font-medium bg-gray-50" />
            <span className="absolute left-3 top-1 text-xs text-gray-400 peer-focus:text-green-500 transition">Email</span>
          </div>
          <div className="relative">
            <input type="password" placeholder="Password" className="peer w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition placeholder-gray-400 text-gray-900 font-medium bg-gray-50" />
            <span className="absolute left-3 top-1 text-xs text-gray-400 peer-focus:text-green-500 transition">Password</span>
          </div>
          <button type="submit" className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 rounded-xl font-bold text-lg shadow-md hover:from-green-600 hover:to-blue-600 transition-colors">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}
