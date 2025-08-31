"use client";


import React from "react";
import Link from "next/link";
import Footer from "../../components/Footer";
import { useCart } from "@/components/cartContext";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return (
    <>
      <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: 'Manrope, sans-serif', padding: '60px 0' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px' }}>
          <h1 style={{ fontSize: 32, fontWeight: 800, textAlign: 'center', marginBottom: 40, color: '#222' }}>Your Cart</h1>
          {cart.length === 0 ? (
            <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.10)', padding: 32, textAlign: 'center', color: '#6b7280', fontSize: 18 }}>
              Your cart is empty.
              <div style={{ marginTop: 24 }}>
                <Link href="/browse" style={{ color: '#10b981', fontWeight: 700, textDecoration: 'underline' }}>Browse Services</Link>
              </div>
            </div>
          ) : (
            <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.10)', padding: 32 }}>
              {cart.map(item => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', marginBottom: 24, borderBottom: '1px solid #f1f5f9', paddingBottom: 24 }}>
                  <img src={item.imageUrl} alt={item.name} style={{ width: 90, height: 90, borderRadius: 8, objectFit: 'cover', marginRight: 24 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 18, color: '#222' }}>{item.name}</div>
                    <div style={{ color: '#6b7280', fontSize: 15, marginBottom: 8 }}>{item.provider}</div>
                    <div style={{ color: '#10b981', fontWeight: 700, fontSize: 17 }}>${item.price}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', marginRight: 24 }}>
                    <button onClick={() => updateQuantity(item.id, -1)} style={{ fontSize: 20, padding: '2px 10px', border: 'none', background: '#e5e7eb', borderRadius: 4, marginRight: 8 }}>-</button>
                    <span style={{ fontWeight: 700, fontSize: 16 }}>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} style={{ fontSize: 20, padding: '2px 10px', border: 'none', background: '#e5e7eb', borderRadius: 4, marginLeft: 8 }}>+</button>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} style={{ color: '#ef4444', fontWeight: 700, border: 'none', background: 'none', fontSize: 16 }}>Remove</button>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 32 }}>
                <div style={{ fontWeight: 800, fontSize: 22, color: '#222' }}>Total: ${total}</div>
                <Link href="/book">
                  <button style={{ background: '#10b981', color: '#fff', fontWeight: 700, fontSize: 18, padding: '12px 32px', borderRadius: 8, border: 'none', boxShadow: '0 4px 16px rgba(16,185,129,0.10)', cursor: 'pointer' }}>
                    Proceed to Booking
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
