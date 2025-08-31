"use client";

import React, { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // Here you would send the form data to your backend or email service
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: 'Manrope, sans-serif', padding: '60px 0' }}>
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '0 24px' }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, textAlign: 'center', marginBottom: 40, letterSpacing: '-1px', color: '#222' }}>Contact Us</h1>
        {submitted ? (
          <div style={{ background: '#d4f4dd', padding: 32, borderRadius: 12, textAlign: 'center', color: '#10b981', fontWeight: 600 }}>
            Thank you for contacting us! We'll get back to you soon.
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.10)', padding: 32, display: 'flex', flexDirection: 'column', gap: 20 }}>
            <input name="name" type="text" placeholder="Your Name" value={form.name} onChange={handleChange} required style={{ padding: 14, borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 16 }} />
            <input name="email" type="email" placeholder="Your Email" value={form.email} onChange={handleChange} required style={{ padding: 14, borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 16 }} />
            <textarea name="message" placeholder="Your Message" value={form.message} onChange={handleChange} required rows={5} style={{ padding: 14, borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 16 }} />
            <button type="submit" style={{ background: '#10b981', color: '#fff', padding: '14px 0', borderRadius: 8, fontWeight: 700, fontSize: 16, border: 'none', cursor: 'pointer' }}>Send Message</button>
          </form>
        )}
      </div>
    </div>
  );
}
