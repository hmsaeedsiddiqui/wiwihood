"use client";

import React, { useState } from "react";
import Footer from "@/components/Footer";

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitted(true);
        setForm({ name: '', email: '', message: '' });
      } else {
        setError(data.message || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      setError('Failed to send message. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pt-16">
      <div className="max-w-2xl mx-auto px-6">
        <h1 className="text-4xl font-extrabold text-center mb-10 tracking-tight text-gray-900">Contact Us</h1>
        {submitted ? (
          <div className="bg-green-100 p-8 rounded-xl text-center text-green-600 font-semibold">
            Thank you for contacting us! We'll get back to you soon.
            <div className="mt-4">
              <button
                onClick={() => setSubmitted(false)}
                className="bg-green-500 text-white px-4 py-2 rounded-md border-none cursor-pointer text-sm font-semibold hover:bg-green-600 transition-colors"
              >
                Send Another Message
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-xl p-8 flex flex-col gap-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg text-sm">
                {error}
              </div>
            )}
            <input 
              name="name" 
              type="text" 
              placeholder="Your Name" 
              value={form.name} 
              onChange={handleChange} 
              required 
              disabled={loading}
              className={`p-3.5 rounded-lg border border-gray-300 text-base transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none ${
                loading ? 'bg-gray-50 opacity-70 cursor-not-allowed' : 'bg-white'
              }`}
            />
            <input 
              name="email" 
              type="email" 
              placeholder="Your Email" 
              value={form.email} 
              onChange={handleChange} 
              required 
              disabled={loading}
              className={`p-3.5 rounded-lg border border-gray-300 text-base transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none ${
                loading ? 'bg-gray-50 opacity-70 cursor-not-allowed' : 'bg-white'
              }`}
            />
            <textarea 
              name="message" 
              placeholder="Your Message" 
              value={form.message} 
              onChange={handleChange} 
              required 
              rows={5} 
              disabled={loading}
              className={`p-3.5 rounded-lg border border-gray-300 text-base transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none resize-none ${
                loading ? 'bg-gray-50 opacity-70 cursor-not-allowed' : 'bg-white'
              }`}
            />
            <button 
              type="submit" 
              disabled={loading}
              className={`py-3.5 px-0 rounded-lg font-bold text-base border-none flex items-center justify-center gap-2 transition-all ${
                loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-green-500 hover:bg-green-600 cursor-pointer'
              } text-white`}
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Sending...
                </>
              ) : (
                'Send Message'
              )}
            </button>
          </form>
        )}
      </div>
      < Footer />
    </div>
    
  );
}
