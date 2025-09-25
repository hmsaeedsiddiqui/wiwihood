// Header Component
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useWishlist } from '../WishlistContext';
import { useCart } from '../cartContext';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { apiService } from '@/lib/api';

export function Header() {
  const { wishlist } = useWishlist();
  const { cart } = useCart();
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout, isAuthenticated, isLoading } = useAuthStore();

  const [showWishlistModal, setShowWishlistModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [categories, setCategories] = useState<{ id: string; name: string; slug: string }[]>([]);

  useEffect(() => {
    apiService
      .getCategories(true)
      .then(cats => {
        const wanted = ['haircuts', 'massages', 'facials'];
        const filteredCats = cats.filter((cat: any) =>
          wanted.includes((cat.name || '').toLowerCase())
        );
        setCategories(filteredCats);
      })
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => setMounted(true), []);

  const handleLogout = async () => {
    await logout();
  };

  const handleCartClick = () => {
    if (mounted) router.push('/cart');
  };

  return (
    <header className="site-header">
      {/* Green Offer Bar (desktop only) */}
      <div className="hidden md:block bg-emerald-500 text-white text-[13px] py-2.5 font-medium">
        <div className="max-w-[1400px] w-[95%] mx-auto flex justify-between items-center ">
          <p className="text-sm">
            FREE delivery &amp; 40% Discount for next 3 Bookings! Place your first appointment in.
          </p>

          <div className="flex items-center gap-3">
            <span className="timer-label text-sm">Until the end of the sale</span>
            <div className="flex gap-2">
              <span className="font-bold">47 <span className="font-normal text-xs">days</span></span>
              <span className="font-bold">06 <span className="font-normal text-xs">hours</span></span>
              <span className="font-bold">55 <span className="font-normal text-xs">min</span></span>
              <span className="font-bold">51 <span className="font-normal text-xs">sec</span></span>
            </div>
          </div>
        </div>
      </div>

      {/* Info Bar (desktop only) */}
      <div className="hidden md:block max-w-[1400px] w-[95%] mx-auto bg-white border-b border-gray-200 text-[13px] font-medium text-gray-800 py-1.5">
        <div className="flex items-center justify-between">
          <span>
            We book appointments from <span className="text-orange-500 font-bold">7:00 to 22:00</span>
          </span>
          <div className="flex items-center gap-6 text-gray-500 font-medium">
            <span className="flex items-center gap-1 cursor-pointer">English</span>
            <span className="flex items-center gap-1 cursor-pointer">USD</span>
            <span className="cursor-pointer">Booking Tracking</span>
          </div>
        </div>
      </div>

      {/* Main Nav (desktop + responsive for mobile) */}
      <nav className="bg-white border-b border-gray-100 py-4">
        <div className="max-w-[1400px] w-[95%] mx-auto flex items-center justify-between ">
          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-bold text-gray-900 hover:text-emerald-600 transition-colors"
          >
            Reservista
          </Link>

          {/* Desktop Nav */}
          <ul className="hidden md:flex items-center gap-6">
            <li>
              <a href="/" className="text-gray-700 hover:text-emerald-600 font-medium">Home</a>
            </li>
            <li>
              <a href="/shop" className="text-gray-700 hover:text-emerald-600 font-medium">Shop</a>
            </li>
            {categories.map(cat => (
              <li key={cat.id}>
                <a href={`/category/${cat.slug}`} className="text-gray-700 hover:text-emerald-600 font-medium">
                  {cat.name}
                </a>
              </li>
            ))}
            <li>
              <a href="/contact" className="text-gray-700 hover:text-emerald-600 font-medium">Contact</a>
            </li>
          </ul>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Account */}
            {!isLoading && (
              <>
                {isAuthenticated && user ? (
                  <button onClick={() => setShowUserMenu(!showUserMenu)} className="hidden md:flex items-center text-gray-900">
                    <i className="fa-regular fa-user mr-2"></i>
                    {user.firstName}
                  </button>
                ) : (
                  <Link href="/auth/login" className="hidden md:flex items-center text-gray-900">
                    <i className="fa-regular fa-user mr-2"></i>
                    Account
                  </Link>
                )}
              </>
            )}

            {/* Wishlist */}
            <button
              type="button"
              onClick={() => setShowWishlistModal(true)}
              className="text-gray-700 text-xl relative"
            >
              <i className="fa-regular fa-heart"></i>
              {mounted && wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs font-bold min-w-[18px] h-[18px] flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart */}
            <button onClick={handleCartClick} className="text-gray-700 text-xl relative">
              <i className="fa-solid fa-cart-shopping"></i>
              {mounted && cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs font-bold min-w-[18px] h-[18px] flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>

            {/* Hamburger Menu (mobile only) */}
            <button
              className="md:hidden text-2xl text-gray-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <i className={`fa-solid ${mobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
            </button>
          </div>
        </div>

        {/* Mobile Nav Menu */}
        {mobileMenuOpen && (
          <ul className="md:hidden flex flex-col gap-4 p-4 bg-white border-t">
            <li><a href="/" className="text-gray-700 font-medium">Home</a></li>
            <li><a href="/shop" className="text-gray-700 font-medium">Shop</a></li>
            {categories.map(cat => (
              <li key={cat.id}>
                <a href={`/category/${cat.slug}`} className="text-gray-700 font-medium">{cat.name}</a>
              </li>
            ))}
            <li><a href="/contact" className="text-gray-700 font-medium">Contact</a></li>
          </ul>
        )}
      </nav>
    </header>
  );
}
