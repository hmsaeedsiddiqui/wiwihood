import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import LoginForm from '../auth/LoginForm';
import SignupForm from '../auth/SignupForm';
import UserMenu from './UserMenu';

export default function UserActions() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    setIsLoggedIn(!!token);
  }, []);

  const openLogin = () => {
    setMode('login');
    setShowModal(true);
  };
  const closeModal = () => setShowModal(false);
  const handleAuthSuccess = () => {
    setIsLoggedIn(true);
    closeModal();
    // Trigger a page reload to ensure UserMenu fetches fresh user data
    window.location.reload();
  };

  const modalContent = showModal && mounted ? (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '16px'
      }}
    >
      <div 
        style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          maxWidth: '400px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative'
        }}
      >
        <button 
          onClick={closeModal} 
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            fontSize: '24px',
            color: '#9CA3AF',
            cursor: 'pointer',
            zIndex: 10,
            lineHeight: 1
          }}
          onMouseOver={(e) => (e.target as HTMLButtonElement).style.color = '#374151'}
          onMouseOut={(e) => (e.target as HTMLButtonElement).style.color = '#9CA3AF'}
        >
          &times;
        </button>
        <div style={{ padding: '32px' }}>
          {mode === 'login' ? (
            <div>
              <h2 style={{ 
                fontSize: '24px', 
                fontWeight: 'bold', 
                marginBottom: '24px', 
                textAlign: 'center',
                color: '#111827'
              }}>
                Login
              </h2>
              <LoginForm onSuccess={handleAuthSuccess} />
              <div style={{ 
                textAlign: 'center', 
                marginTop: '24px', 
                fontSize: '14px',
                color: '#6B7280'
              }}>
                Don't have an account?{' '}
                <button 
                  style={{
                    color: '#059669',
                    textDecoration: 'underline',
                    fontWeight: '500',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                  onClick={() => setMode('signup')}
                  onMouseOver={(e) => (e.target as HTMLButtonElement).style.color = '#047857'}
                  onMouseOut={(e) => (e.target as HTMLButtonElement).style.color = '#059669'}
                >
                  Sign up
                </button>
              </div>
            </div>
          ) : (
            <div>
              <h2 style={{ 
                fontSize: '24px', 
                fontWeight: 'bold', 
                marginBottom: '24px', 
                textAlign: 'center',
                color: '#111827'
              }}>
                Sign Up
              </h2>
              <SignupForm onSuccess={handleAuthSuccess} />
              <div style={{ 
                textAlign: 'center', 
                marginTop: '24px', 
                fontSize: '14px',
                color: '#6B7280'
              }}>
                Already have an account?{' '}
                <button 
                  style={{
                    color: '#059669',
                    textDecoration: 'underline',
                    fontWeight: '500',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                  onClick={() => setMode('login')}
                  onMouseOver={(e) => (e.target as HTMLButtonElement).style.color = '#047857'}
                  onMouseOut={(e) => (e.target as HTMLButtonElement).style.color = '#059669'}
                >
                  Login
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  ) : null;

  if (!mounted) return null;
  return (
    <>
      {isLoggedIn ? (
        <UserMenu />
      ) : (
        <button
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
          onClick={openLogin}
        >
          <i className="fa-regular fa-user" style={{ fontSize: 20, marginRight: 4 }}></i>
          <span>Sign in</span>
          <span style={{ fontSize: 13, color: '#222', fontWeight: 400, marginLeft: 2 }}>Account</span>
        </button>
      )}
      {/* Heart/Wishlist icon hidden - keeping code intact for future use */}
      {/* <a href="#" className="heart-icon"><i className="fa-regular fa-heart"></i></a> */}
      {/* Cart icon hidden - keeping code intact for future use */}
      {/* <a href="/cart" className="cart-icon"><i className="fa-solid fa-cart-shopping"></i></a> */}
      {/* Portal Modal */}
      {modalContent && createPortal(modalContent, document.body)}
    </>
  );
}
