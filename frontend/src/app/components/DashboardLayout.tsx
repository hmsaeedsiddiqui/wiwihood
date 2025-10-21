"use client";
import Link from 'next/link';

const navItems = {
  admin: [
    { label: 'Dashboard', href: '/(admin)/dashboard' },
    { label: 'Users', href: '/(admin)/users' },
    { label: 'Bookings', href: '/(admin)/bookings' },
    { label: 'Categories', href: '/(admin)/categories' },
    { label: 'Payouts', href: '/(admin)/payouts' },
    { label: 'Reviews', href: '/(admin)/reviews' },
    { label: 'CMS', href: '/(admin)/cms' },
    { label: 'Support', href: '/(admin)/support' },
    { label: 'Logs', href: '/(admin)/logs' },
    { label: 'Analytics', href: '/(admin)/analytics' },
  ],
  provider: [
    { label: 'Dashboard', href: '/(provider)/dashboard' },
    { label: 'Bookings', href: '/(provider)/bookings' },
    { label: 'Services', href: '/(provider)/services' },
    { label: 'Calendar', href: '/(provider)/calendar' },
    { label: 'Payouts', href: '/(provider)/payouts' },
    { label: 'Reviews', href: '/(provider)/reviews' },
    { label: 'Profile', href: '/(provider)/profile' },
    { label: 'Settings', href: '/(provider)/settings' },
  ],
  customer: [
    { label: 'Dashboard', href: '/(customer)/dashboard' },
    { label: 'Bookings', href: '/(customer)/bookings' },
    { label: 'Favorites', href: '/(customer)/favorites' },
    { label: 'Profile', href: '/(customer)/profile' },
    { label: 'Account', href: '/account' },
  ],
};

export default function DashboardLayout({ children, role = 'admin' }: { children: React.ReactNode, role?: 'admin'|'provider'|'customer' }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      {/* Sidebar */}
      <aside style={{ width: 220, background: '#fff', boxShadow: '2px 0 12px rgba(0,0,0,0.04)', padding: '32px 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ fontWeight: 900, fontSize: 22, color: '#10b981', textAlign: 'center', marginBottom: 32, letterSpacing: -1 }}>Reservista</div>
        {navItems[role].map(item => (
          <Link key={item.href} href={item.href} style={{
            display: 'block',
            padding: '12px 32px',
            color: '#222',
            fontWeight: 600,
            borderRadius: 8,
            margin: '2px 0',
            textDecoration: 'none',
            transition: 'background 0.2s',
          }}
          >{item.label}</Link>
        ))}
      </aside>
      {/* Main Content */}
      <main style={{ flex: 1, padding: '0 0 0 0', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Topbar */}
        <header style={{ height: 64, background: '#fff', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 32px', gap: 24 }}>
          <span style={{ color: '#10b981', fontWeight: 700 }}>EN</span>
          <span style={{ color: '#6b7280', fontWeight: 700, cursor: 'pointer' }}>DE</span>
          <span style={{ color: '#222', fontWeight: 700 }}>Notifications</span>
          <span style={{ color: '#222', fontWeight: 700 }}>Profile</span>
        </header>
        <div style={{ flex: 1, padding: 32 }}>{children}</div>
      </main>
    </div>
  );
}
