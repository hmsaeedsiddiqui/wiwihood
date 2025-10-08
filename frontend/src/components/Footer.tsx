import React, { useEffect, useState } from "react";
import Link from 'next/link';

const Footer = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const footerStyles: React.CSSProperties = {
    background: 'linear-gradient(135deg, #f97316 0%, #ec4899 100%)',
    color: '#fff',
    paddingTop: '10vh',
    clipPath: 'polygon(0 22%, 100% 0, 100% 100%, 0 100%)',
    fontFamily: 'Manrope, sans-serif',
    marginTop: 48,
  };

  const containerStyles: React.CSSProperties = {
    width: '90%',
    maxWidth: 1280,
    margin: '0 auto',
    marginTop: 20,
  };

  const footerMainStyles: React.CSSProperties = {
    textAlign: 'center',
    paddingBottom: 40,
    borderBottom: '1px solid rgba(255,255,255,0.2)',
  };

  const logoStyles: React.CSSProperties = {
    fontSize: 'clamp(24px, 5vw, 32px)',
    fontWeight: 800,
    marginBottom: 24,
  };

  const navStyles: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: isMobile ? 16 : 32,
    listStyle: 'none',
    padding: 0,
    margin: '0 auto',
    maxWidth: isMobile ? 300 : 600,
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
    flexDirection: isMobile ? 'column' : 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px 0',
    gap: isMobile ? 16 : 0,
  };

  const copyrightStyles: React.CSSProperties = {
    fontSize: 15,
    fontWeight: 500,
    opacity: 0.8,
    textAlign: isMobile ? 'center' : 'left',
  };

  const socialsStyles: React.CSSProperties = {
    display: 'flex',
    gap: 12,
    justifyContent: isMobile ? 'center' : 'flex-end',
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

  const svgIcon = (path: string) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={path} />
    </svg>
  );

  return (
    <footer style={footerStyles}>
      <div style={containerStyles}>
        <div style={footerMainStyles}>
          <div style={logoStyles}>Wiwihood</div>
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
            ©2025 Wiwihood. Design & Develop with <span role="img" aria-label="love">❤️</span>
          </div>
          <div style={socialsStyles}>
            <a href="#" style={socialIconStyles}>{svgIcon("M16 8a6 6 0 0 1-12 0c0-3.31 2.69-6 6-6s6 2.69 6 6z")}</a>
            <a href="#" style={socialIconStyles}>{svgIcon("M18 2h-3a4 4 0 0 0-4 4v3H8v4h3v8h4v-8h3l1-4h-4V6a1 1 0 0 1 1-1h3z")}</a>
            <a href="#" style={socialIconStyles}>{svgIcon("M4 4h16v16H4z")}</a>
            <a href="#" style={socialIconStyles}>{svgIcon("M23 3a10.9 10.9 0 0 1-3.14 1.53A4.48 4.48 0 0 0 22.43.36a9.1 9.1 0 0 1-2.88 1.1A4.52 4.52 0 0 0 16.5 0c-2.5 0-4.5 2.01-4.5 4.5 0 .35.04.7.1 1.03A12.94 12.94 0 0 1 1.64.89a4.48 4.48 0 0 0-.61 2.27c0 1.57.8 2.96 2.02 3.77A4.52 4.52 0 0 1 .96 6v.05c0 2.2 1.56 4.03 3.63 4.45a4.52 4.52 0 0 1-2.04.08c.58 1.8 2.26 3.11 4.25 3.15A9.06 9.06 0 0 1 0 19.54a12.8 12.8 0 0 0 6.94 2.03c8.34 0 12.9-6.91 12.9-12.9 0-.2-.01-.39-.02-.58A9.22 9.22 0 0 0 23 3z")}</a>
            <a href="#" style={socialIconStyles}>{svgIcon("M4 4h16v16H4z")}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
