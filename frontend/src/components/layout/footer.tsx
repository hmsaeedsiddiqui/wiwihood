import Link from 'next/link'
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react'

export function Footer() {
  const footerNavigation = {
    services: [
      { name: 'Browse Services', href: '/services' },
      { name: 'Find Providers', href: '/providers' },
      { name: 'Book Appointment', href: '/book' },
      { name: 'Gift Cards', href: '/gift-cards' },
    ],
    company: [
      { name: 'About', href: '/about' },
      { name: 'Blog', href: '/blog' },
      { name: 'Careers', href: '/careers' },
      { name: 'Press', href: '/press' },
    ],
    support: [
      { name: 'Help Center', href: '/help' },
      { name: 'Contact Us', href: '/contact' },
      { name: 'Status', href: '/status' },
      { name: 'Report Issue', href: '/report' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Cookie Policy', href: '/cookies' },
      { name: 'Refund Policy', href: '/refunds' },
    ],
  }

  const socialLinks = [
    { name: 'Facebook', href: '#', icon: Facebook },
    { name: 'Twitter', href: '#', icon: Twitter },
    { name: 'Instagram', href: '#', icon: Instagram },
  ]

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-col">
          <div className="footer-brand">
            <div className="footer-brand-logo">R</div>
            <span className="footer-brand-name">Reservista</span>
          </div>
          <p className="footer-desc">
            Your trusted platform for booking professional services with verified providers across multiple categories.
          </p>
          <div className="footer-contact"><Mail style={{width:16,height:16}} /> support@reservista.com</div>
          <div className="footer-contact"><Phone style={{width:16,height:16}} /> +1 (555) 123-4567</div>
          <div className="footer-contact"><MapPin style={{width:16,height:16}} /> 123 Service St, City, State 12345</div>
        </div>
        <div className="footer-col">
          <h3 style={{color:'#fff',fontWeight:700,marginBottom:16}}>Services</h3>
          <ul className="footer-links">
            {footerNavigation.services.map((item) => (
              <li key={item.name}><Link href={item.href}>{item.name}</Link></li>
            ))}
          </ul>
        </div>
        <div className="footer-col">
          <h3 style={{color:'#fff',fontWeight:700,marginBottom:16}}>Company</h3>
          <ul className="footer-links">
            {footerNavigation.company.map((item) => (
              <li key={item.name}><Link href={item.href}>{item.name}</Link></li>
            ))}
          </ul>
        </div>
        <div className="footer-col">
          <h3 style={{color:'#fff',fontWeight:700,marginBottom:16}}>Support</h3>
          <ul className="footer-links">
            {footerNavigation.support.map((item) => (
              <li key={item.name}><Link href={item.href}>{item.name}</Link></li>
            ))}
          </ul>
        </div>
      </div>
      <div className="footer-content" style={{borderTop:'1px solid #222',marginTop:0,paddingTop:18,justifyContent:'space-between',alignItems:'center',flexWrap:'wrap'}}>
        <div style={{display:'flex',gap:18,flexWrap:'wrap'}}>
          {footerNavigation.legal.map((item) => (
            <Link key={item.name} href={item.href} className="footer-links" style={{fontSize:14}}>{item.name}</Link>
          ))}
        </div>
        <div className="footer-socials">
          {socialLinks.map((item) => (
            <Link key={item.name} href={item.href} aria-label={item.name}><item.icon style={{width:22,height:22}} /></Link>
          ))}
        </div>
      </div>
      <div className="footer-bottom">
        &copy; 2025 Reservista. All rights reserved.
      </div>
    </footer>
  )
}
