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
  const { cart, addToCart } = useCart();
  const router = useRouter();
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  const [showWishlistModal, setShowWishlistModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { user, logout, isAuthenticated, isLoading } = useAuthStore();

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
    <>
      <header className="site-header">
        {/* Top Banner */}
        <div className="bg-gradient-to-r from-orange-500 to-pink-600 text-white text-[13px] py-2.5 font-medium hidden lg:block">
          <div className="max-w-[1400px] w-[95%] mx-auto flex justify-between items-center">
            <p>
              FREE delivery &amp; 40% Discount for next 3 Bookings! Place your first appointment in.
            </p>
            <div className="flex items-baseline gap-3">
              <span className="timer-label">Until the end of the sale</span>
              <span className="text-base font-bold">
                47 <span className="label font-normal text-[13px]">days</span>
              </span>{' '}
              <span className="text-base font-bold">
                06 <span className="label font-normal text-[13px]">hours</span>
              </span>{' '}
              <span className="text-base font-bold">
                55 <span className="label font-normal text-[13px]">min</span>
              </span>{' '}
              <span className="text-base font-bold">
                51 <span className="label font-normal text-[13px]">sec</span>
              </span>
            </div>
          </div>
        </div>

        {/* Info Bar */}
        <div className="max-w-[1400px] w-[95%] mx-auto bg-white border-b border-gray-200 text-[13px] font-medium text-gray-800 py-1.5  hidden lg:block">
          <div className="flex items-center justify-between">
            <span>
              We book appointments from{' '}
              <span className="text-orange-500 font-bold">7:00 to 22:00</span>
            </span>
            <div className="flex items-center gap-6 text-gray-500 font-medium">
              <span className="flex items-center gap-1 cursor-pointer">
                English <i className="fa-solid fa-chevron-down fa-xs ml-0.5"></i>
              </span>
              <span className="flex items-center gap-1 cursor-pointer">
                USD <i className="fa-solid fa-chevron-down fa-xs ml-0.5"></i>
              </span>
              <span className="cursor-pointer">Booking Tracking</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="bg-white border-b border-gray-100 py-4">
          <div className="max-w-[1400px] w-[95%] mx-auto flex items-center justify-between ">
            {/* Logo + Location */}
            <div className="flex items-center">
              <Link
                href="/"
                className="flex items-center cursor-pointer mr-4 hover:opacity-80 transition-opacity no-underline"
              >
                <div className="bg-gradient-to-r from-orange-500 to-pink-600 rounded-xl p-2 mr-3">
                  <span className="text-white font-bold text-xl">W</span>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent">
                  Wiwihood
                </span>
              </Link>
              <div className="hidden md:flex items-center gap-2 ml-2">
                <div>
                  <i className="fa-solid fa-location-dot mr-1"></i>
                </div>
                <div className="text-sm text-gray-600">
                  <p>Available near</p>
                  <a href="#" className="hover:text-orange-600">
                    you
                  </a>
                </div>
              </div>
            </div>

            {/* Menu Items (Desktop) */}
            <ul className="hidden lg:flex items-center justify-between gap-6 list-none">
              <li>
                <a
                  href="/"
                  className="text-gray-700 hover:text-orange-600 font-medium transition-colors"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/shop"
                  className="text-gray-700 hover:text-orange-600 font-medium transition-colors"
                >
                  Shop
                </a>
              </li>
              {categories.map(cat => (
                <li key={cat.id}>
                  <a
                    href={`/category/${cat.slug}`}
                    className="text-gray-700 hover:text-orange-600 font-medium transition-colors"
                  >
                    {cat.name}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="/contact"
                  className="text-gray-700 hover:text-orange-600 font-medium transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>

            {/* Right Side Buttons */}
            <div className="flex items-center gap-4 md:gap-6">
              {/* Wishlist + Cart */}
              {/* <div className="flex order-1 md:order-2 gap-4">
                <button
                  type="button"
                  onClick={() => setShowWishlistModal(true)}
                  className="flex items-center justify-center text-gray-700 text-xl relative w-8 h-8 hover:text-orange-600"
                >
                  <i className="fa-regular fa-heart"></i>
                  {mounted && wishlist.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs font-bold min-w-[18px] h-[18px] flex items-center justify-center border-2 border-white shadow-sm">
                      {wishlist.length}
                    </span>
                  )}
                </button>

                <button
                  onClick={handleCartClick}
                  className="flex items-center justify-center text-gray-700 text-xl relative w-8 h-8 hover:text-orange-600"
                >
                  <i className="fa-solid fa-cart-shopping"></i>
                  {mounted && cart.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs font-bold min-w-[18px] h-[18px] flex items-center justify-center border-2 border-white shadow-sm">
                      {cart.length}
                    </span>
                  )}
                </button>
              </div> */}

              {/* Account (desktop hover dropdown) */}
              <div className="relative user-menu-container order-2 hidden lg:block group">
                {!isLoading && (
                  <>
                    {isAuthenticated && user ? (
                      <>
                        <button
                          className="flex items-center no-underline min-w-[90px] h-11 p-2 rounded-md bg-transparent text-gray-900 hover:bg-gray-50"
                        >
                          <i className="fa-regular fa-user text-[20px] mr-2 text-gray-900"></i>
                          <span className="flex flex-col items-start leading-tight">
                            <span className="text-[13px] font-normal text-gray-500">
                              Welcome
                            </span>
                            <span className="text-base font-bold text-gray-900">
                              {user.firstName}
                            </span>
                          </span>
                          <i className="fa-solid fa-chevron-down ml-2 text-xs text-gray-900"></i>
                        </button>

                        {/* Dropdown on hover */}
                        <div className="absolute top-full right-0  w-48 bg-white shadow-lg rounded-md border border-gray-200 hidden group-hover:block z-50">
                          <a
                            href="/profile"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            My Profile
                          </a>
                          <a
                            href="/bookings"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            My Bookings
                          </a>
                          <a
                            href="/settings"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Settings
                          </a>
                          <button
                            onClick={handleLogout}
                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            Sign Out
                          </button>
                        </div>
                      </>
                    ) : (
                      <Link
                        href="/auth/login"
                        className="flex items-center text-gray-900 no-underline min-w-[90px] h-11"
                      >
                        <i className="fa-regular fa-user text-[20px] text-gray-900 mr-2"></i>
                        <span className="flex flex-col items-start leading-tight">
                          <span className="text-[13px] font-normal text-gray-700">Sign In</span>
                          <span className="text-base font-bold text-gray-900">Account</span>
                        </span>
                      </Link>
                    )}
                  </>
                )}
              </div>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden flex items-center justify-center text-gray-700 text-xl w-8 h-8 hover:text-orange-600 order-3"
              >
                <i className="fa-solid fa-bars"></i>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <ul className="lg:hidden mt-4 space-y-2 px-4">
              <li>
                <a href="/" className="block py-2 text-gray-700 hover:text-orange-600">
                  Home
                </a>
              </li>
              <li>
                <a href="/shop" className="block py-2 text-gray-700 hover:text-orange-600">
                  Shop
                </a>
              </li>
              {categories.map(cat => (
                <li key={cat.id}>
                  <a
                    href={`/category/${cat.slug}`}
                    className="block py-2 text-gray-700 hover:text-orange-600"
                  >
                    {cat.name}
                  </a>
                </li>
              ))}
              <li>
                <a href="/contact" className="block py-2 text-gray-700 hover:text-orange-600">
                  Contact
                </a>
              </li>

              {/* Account now inside mobile nav */}
              <li className="border-t pt-2">
                {!isLoading && (
                  <>
                    {isAuthenticated && user ? (
                      <>
                        <a href="/profile" className="block py-2 text-gray-700 hover:text-orange-600">
                          My Profile
                        </a>
                        <a href="/bookings" className="block py-2 text-gray-700 hover:text-orange-600">
                          My Bookings
                        </a>
                        <a href="/settings" className="block py-2 text-gray-700 hover:text-orange-600">
                          Settings
                        </a>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left py-2 text-red-600 hover:bg-red-50"
                        >
                          Sign Out
                        </button>
                      </>
                    ) : (
                      <Link
                        href="/auth/login"
                        className="block py-2 text-gray-700 hover:text-orange-600"
                      >
                        Sign In / Account
                      </Link>
                    )}
                  </>
                )}
              </li>
            </ul>
          )}
        </nav>
      </header>

      {/* Wishlist Modal */}
      {showWishlistModal && (
        <div
          className="fixed top-0 left-0 w-screen h-screen bg-black/70 z-[1000] flex items-center justify-center"
          onClick={() => setShowWishlistModal(false)}
        >
          <div
            className="bg-white rounded-[18px] shadow-[0_8px_48px_rgba(0,0,0,0.18)] p-10 min-w-[480px] max-w-[700px] w-[90vw] max-h-[90vh] overflow-y-auto relative"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setShowWishlistModal(false)}
              className="absolute top-[18px] right-[18px] text-[26px] text-gray-500 hover:text-gray-700"
            >
              <i className="fas fa-times"></i>
            </button>
            <h2 className="font-bold text-[28px] mb-7 flex items-center gap-3 text-gray-700">
              <i className="fa-regular fa-heart"></i> My Wishlist
            </h2>
            {wishlist.length === 0 ? (
              <div className="text-center text-gray-500 p-10">
                <i className="fas fa-heart-broken text-[40px] mb-3"></i>
                <div className="font-semibold mb-1.5 text-lg">Your wishlist is empty</div>
                <div className="text-[15px]">Browse services and add your favorites here.</div>
              </div>
            ) : (
              <ul className="list-none p-0 m-0">
                {wishlist.map(item => (
                  <li
                    key={item.id}
                    className="flex items-center gap-6 mb-7 bg-gray-50 rounded-xl p-[18px] shadow-sm"
                  >
                    <img
                      src={item.image || '/blog1.jpg'}
                      alt={item.name}
                      className="w-20 h-20 rounded-[10px] object-cover border border-gray-200 bg-white"
                      onError={e => {
                        e.currentTarget.src = '/blog1.jpg';
                      }}
                    />
                    <div className="flex-1">
                      <div className="font-bold text-lg text-gray-800">{item.name}</div>
                      {item.basePrice && (
                        <div className="text-emerald-600 font-semibold text-[17px] mt-0.5">
                          ${item.basePrice}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <button
                        className="bg-emerald-600 text-white rounded-lg px-4 py-2 font-semibold text-sm hover:bg-emerald-700"
                        onClick={() =>
                          addToCart({
                            id: item.id.toString(),
                            name: item.name,
                            provider: '',
                            price: item.basePrice || 0,
                            imageUrl: item.image || '/blog1.jpg',
                            quantity: 1,
                          })
                        }
                      >
                        <i className="fa-solid fa-cart-plus mr-1"></i> Add to Cart
                      </button>
                      <button className="bg-orange-500 text-white rounded-lg px-4 py-2 font-semibold text-sm hover:bg-orange-600">
                        <i className="fa-solid fa-bag-shopping mr-1"></i> Buy Now
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </>
  );
}