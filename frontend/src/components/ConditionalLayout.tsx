"use client";
import { usePathname } from 'next/navigation';
import { Header } from './layout/header-new';
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
  const isProviderPage = pathname?.startsWith('/provider');
  const isProviderAuthPage = pathname?.startsWith('/auth/provider');
  const isAdminPage = pathname?.startsWith('/admin');
  const isAdminAuthPage = pathname?.startsWith('/auth/admin');

  if (isProviderPage || isProviderAuthPage) {
    // Provider pages - completely isolated layout (no AuthProvider, no Header, no Cart)
    return <>{children}</>;
  }

  if (isAdminPage || isAdminAuthPage) {
    // Admin pages - completely isolated layout (no customer header, no cart, etc.)
    return <>{children}</>;
  }

  // Customer pages - show original customer header with auth
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
