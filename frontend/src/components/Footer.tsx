import React from "react";
import Link from 'next/link';

const footerStyles: React.CSSProperties = {
  backgroundColor: '#10b981',
  color: '#fff',
  paddingTop: 120,
  position: 'relative',
  clipPath: 'polygon(0 22%, 100% 0, 100% 100%, 0 100%)',
  fontFamily: 'Manrope, sans-serif',
  marginTop: '48px',
  boxShadow: 'none', // Remove any shadow
  border: 'none', // Remove any border
};

const containerStyles: React.CSSProperties = {
  width: '90%',
  maxWidth: 1280,
  margin: '0 auto',
   marginTop:20,
};

const footerMainStyles: React.CSSProperties = {
  textAlign: 'center',
  paddingBottom: 40,
  borderBottom: '1px solid rgba(255,255,255,0.2)',
};

const logoStyles: React.CSSProperties = {
  fontSize: 32,
  fontWeight: 800,
  margin: '0 0 24px 0',
};

const navStyles: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  gap: 32,
  listStyle: 'none',
  padding: 0,
  margin: 0,
};

const navLinkStyles: React.CSSProperties = {
  color: '#fff',
  textDecoration: 'none',
  fontSize: 16,
  fontWeight: 500,
  opacity: 0.9,
  transition: 'opacity 0.2s ease',
};

const bottomStyles: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '24px 0',
};

const copyrightStyles: React.CSSProperties = {
  fontSize: 15,
  fontWeight: 500,
  opacity: 0.8,
};

const socialsStyles: React.CSSProperties = {
  display: 'flex',
  gap: 12,
};

const socialIconStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 36,
  height: 36,
  border: '1.5px solid rgba(255,255,255,0.8)',
  borderRadius: 6,
  color: '#fff',
  fontSize: 16,
  textDecoration: 'none',
  transition: 'background-color 0.2s ease, border-color 0.2s ease',
};

const Footer = () => (
  <footer style={footerStyles}>
    <div style={containerStyles}>
      <div style={footerMainStyles}>
        <div style={logoStyles}>Reservista</div>
        <ul style={navStyles}>
          <li><Link href="/" style={navLinkStyles}>Home</Link></li>
          <li><Link href="/shop" style={navLinkStyles}>Shop</Link></li>
          <li><Link href="/bookings" style={navLinkStyles}>Bookings</Link></li>
          <li><Link href="/favorites" style={navLinkStyles}>Favorites</Link></li>
          <li><Link href="/help" style={navLinkStyles}>Help</Link></li>
          <li><Link href="/about" style={navLinkStyles}>About us</Link></li>
          <li><Link href="/contact" style={navLinkStyles}>Contact us</Link></li>
        </ul>
      </div>
      <div style={bottomStyles}>
        <div style={copyrightStyles}>
          ©2025 Reservista. Design & Develop with <span role="img" aria-label="love">❤️</span>
        </div>
        <div style={socialsStyles}>
          <a href="#" style={socialIconStyles}><i className="fab fa-linkedin-in"></i></a>
          <a href="#" style={socialIconStyles}><i className="fab fa-facebook-f"></i></a>
          <a href="#" style={socialIconStyles}><i className="fab fa-instagram"></i></a>
          <a href="#" style={socialIconStyles}><i className="fab fa-twitter"></i></a>
          <a href="#" style={socialIconStyles}><i className="fas fa-envelope"></i></a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
