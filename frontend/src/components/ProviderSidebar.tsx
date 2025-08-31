"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function ProviderSidebar() {
  const pathname = usePathname();

  const menuItems = [
    {
      title: 'ANALYTICS',
      items: [
        { name: 'Dashboard', href: '/provider/dashboard', icon: '📊' },
      ]
    },
    {
      title: 'BUSINESS',
      items: [
        { name: 'Service Management', href: '/provider/services', icon: '🛠️' },
        { name: 'Shop Management', href: '/provider/shops', icon: '🏪' },
      ]
    },
    {
      title: 'CLIENTS',
      items: [
        { name: 'My Buyers', href: '/provider/buyers', icon: '👥' },
        { name: 'Visited', href: '/provider/visited', icon: '👁️' },
        { name: 'Transactions', href: '/provider/transactions', icon: '💳' },
        { name: 'Payouts', href: '/provider/payouts', icon: '💰' },
      ]
    },
    {
      title: 'EDUCATION',
      items: [
        { name: 'My Reviews', href: '/provider/reviews', icon: '⭐' },
        { name: 'My Discounts', href: '/provider/discounts', icon: '🏷️' },
        { name: 'Notifications', href: '/provider/notifications', icon: '🔔' },
      ]
    },
    {
      title: 'SETTINGS',
      items: [
        { name: 'Settings', href: '/provider/settings', icon: '⚙️' },
        { name: 'Transactions', href: '/provider/transactions', icon: '📄' },
        { name: 'Payouts', href: '/provider/payouts', icon: '💸' },
      ]
    }
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <div style={{
      width: '256px',
      height: '100vh',
      backgroundColor: '#ffffff',
      borderRight: '1px solid #e5e7eb',
      position: 'fixed',
      left: 0,
      top: '64px', // Adjust based on header height
      overflowY: 'auto',
      zIndex: 10
    }}>
      {/* Logo/Brand */}
      <div style={{
        padding: '20px 16px',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <Link href="/provider/dashboard" style={{
          display: 'flex',
          alignItems: 'center',
          textDecoration: 'none'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            backgroundColor: '#22c55e',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '12px'
          }}>
            <span style={{ color: '#ffffff', fontWeight: 'bold', fontSize: '16px' }}>R</span>
          </div>
          <div>
            <div style={{ fontSize: '16px', fontWeight: '600', color: '#22c55e' }}>Reservista</div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>PROVIDER DASHBOARD</div>
          </div>
        </Link>
      </div>

      {/* Navigation Menu */}
      <nav style={{ padding: '16px 0' }}>
        {menuItems.map((section, sectionIndex) => (
          <div key={sectionIndex} style={{ marginBottom: '24px' }}>
            {/* Section Title */}
            <div style={{
              padding: '0 16px 8px 16px',
              fontSize: '11px',
              fontWeight: '600',
              color: '#6b7280',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              {section.title}
            </div>

            {/* Section Items */}
            {section.items.map((item, itemIndex) => (
              <Link
                key={itemIndex}
                href={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '8px 16px',
                  margin: '0 8px',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  fontSize: '14px',
                  transition: 'all 0.2s',
                  backgroundColor: isActive(item.href) ? '#dcfce7' : 'transparent',
                  color: isActive(item.href) ? '#16a34a' : '#374151',
                  borderLeft: isActive(item.href) ? '3px solid #22c55e' : '3px solid transparent'
                }}
                onMouseEnter={(e) => {
                  if (!isActive(item.href)) {
                    e.currentTarget.style.backgroundColor = '#f9fafb';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive(item.href)) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <span style={{ marginRight: '12px', fontSize: '16px' }}>{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </div>
        ))}
      </nav>
    </div>
  );
}
