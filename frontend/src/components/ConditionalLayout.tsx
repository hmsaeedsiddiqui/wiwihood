"use client";
import { usePathname } from 'next/navigation';
import { Header } from './layout/header-new';
import { AuthHeader } from './layout/AuthHeader';
import { CartProvider } from './cartContext';
import { AuthProvider } from './AuthProvider';
import { WishlistProvider } from './WishlistContext';
import NoSSR from './NoSSR';

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  console.log('Current pathname:', pathname);
  const isProviderDashboardPage = pathname?.startsWith('/provider') && !pathname?.startsWith('/auth/provider');
  const isProviderAuthPage = pathname?.startsWith('/auth/provider');
  const isAdminDashboardPage = pathname?.startsWith('/admin') && !pathname?.startsWith('/auth/admin');
  const isAdminAuthPage = pathname?.startsWith('/auth/admin');
  const isCustomerAuthPage = pathname?.startsWith('/auth/customer') || pathname === '/auth/login' || pathname === '/auth/register' || pathname === '/login' || pathname === '/signup';
  
  console.log('isProviderAuthPage:', isProviderAuthPage);
  console.log('isAdminAuthPage:', isAdminAuthPage);
  console.log('isCustomerAuthPage:', isCustomerAuthPage);

  if (isProviderDashboardPage) {
    // Provider dashboard pages - completely isolated layout (no AuthProvider, no Header, no Cart)
    return <>{children}</>;
  }

  if (isAdminDashboardPage) {
    // Admin dashboard pages - completely isolated layout (no customer header, no cart, etc.)
    return <>{children}</>;
  }

  // Auth pages (provider, admin, customer) - no header, clean layout
  if (isProviderAuthPage || isAdminAuthPage || isCustomerAuthPage) {
    console.log('Loading clean auth page without header for path:', pathname);
    return (
      <NoSSR fallback={<div className="min-h-screen bg-gray-50" />}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </NoSSR>
    );
  }  // Customer pages - show original customer header with auth
  // AuthProvider only applies to customer pages
  return (
    <NoSSR fallback={<div className="min-h-screen bg-gray-50" />}>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <Header />
            {children}
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </NoSSR>
  );
}
