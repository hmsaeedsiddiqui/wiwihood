"use client";

import React, { useState } from "react";

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
    <>
      <style jsx global>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: 'Manrope, sans-serif', padding: '60px 0' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', padding: '0 24px' }}>
          <h1 style={{ fontSize: 36, fontWeight: 800, textAlign: 'center', marginBottom: 40, letterSpacing: '-1px', color: '#222' }}>Contact Us</h1>
        {submitted ? (
          <div style={{ background: '#d4f4dd', padding: 32, borderRadius: 12, textAlign: 'center', color: '#10b981', fontWeight: 600 }}>
            Thank you for contacting us! We'll get back to you soon.
            <div style={{ marginTop: 16 }}>
              <button
                onClick={() => setSubmitted(false)}
                style={{ 
                  background: '#10b981', 
                  color: '#fff', 
                  padding: '8px 16px', 
                  borderRadius: 6, 
                  border: 'none', 
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: 600
                }}
              >
                Send Another Message
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.10)', padding: 32, display: 'flex', flexDirection: 'column', gap: 20 }}>
            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: 16, borderRadius: 8, fontSize: 14 }}>
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
              style={{ 
                padding: 14, 
                borderRadius: 8, 
                border: '1px solid #e5e7eb', 
                fontSize: 16,
                backgroundColor: loading ? '#f9fafb' : '#fff',
                opacity: loading ? 0.7 : 1
              }} 
            />
            <input 
              name="email" 
              type="email" 
              placeholder="Your Email" 
              value={form.email} 
              onChange={handleChange} 
              required 
              disabled={loading}
              style={{ 
                padding: 14, 
                borderRadius: 8, 
                border: '1px solid #e5e7eb', 
                fontSize: 16,
                backgroundColor: loading ? '#f9fafb' : '#fff',
                opacity: loading ? 0.7 : 1
              }} 
            />
            <textarea 
              name="message" 
              placeholder="Your Message" 
              value={form.message} 
              onChange={handleChange} 
              required 
              rows={5} 
              disabled={loading}
              style={{ 
                padding: 14, 
                borderRadius: 8, 
                border: '1px solid #e5e7eb', 
                fontSize: 16,
                backgroundColor: loading ? '#f9fafb' : '#fff',
                opacity: loading ? 0.7 : 1
              }} 
            />
            <button 
              type="submit" 
              disabled={loading}
              style={{ 
                background: loading ? '#9ca3af' : '#10b981', 
                color: '#fff', 
                padding: '14px 0', 
                borderRadius: 8, 
                fontWeight: 700, 
                fontSize: 16, 
                border: 'none', 
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8
              }}
            >
              {loading ? (
                <>
                  <span style={{ width: 16, height: 16, border: '2px solid #fff', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></span>
                  Sending...
                </>
              ) : (
                'Send Message'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
    </>
  );
}
