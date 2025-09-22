'use client';

import { useWishlist } from '@/components/WishlistContext';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Heart as HeartIconSolid,
  Star as StarIcon,
  MapPin as MapPinIcon,
  ShoppingCart as ShoppingCartIcon,
  Trash2 as TrashIcon,
  Sparkles as SparklesIcon,
  Eye as EyeIcon,
  Heart as HeartIconOutline, 
  X as XMarkIcon
} from 'lucide-react';
import { useCart } from '@/components/cartContext';
import { useState } from 'react';

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [showClearModal, setShowClearModal] = useState(false);

  const handleAddToCart = (item: any) => {
    addToCart({
      id: item.id,
      name: item.name,
      provider: item.name,
      price: 99, // Default price - in real app this would come from the item
      imageUrl: item.image,
      quantity: 1
    });
  };

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mx-auto w-32 h-32 bg-gradient-to-br from-pink-100 to-red-100 rounded-full flex items-center justify-center mb-8">
              <HeartIconOutline className="h-16 w-16 text-gray-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Wishlist is Empty</h1>
            <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
              Start exploring our amazing services and add your favorites to your wishlist.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-pink-500 to-red-500 text-white font-semibold rounded-2xl hover:from-pink-600 hover:to-red-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <SparklesIcon className="h-5 w-5 mr-2" />
              Discover Services
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-br from-pink-500 to-red-500 p-4 rounded-2xl shadow-lg">
              <HeartIconSolid className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Your Wishlist
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            {wishlist.length} {wishlist.length === 1 ? 'service' : 'services'} saved for later
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => setShowClearModal(true)}
              className="flex items-center px-6 py-3 border-2 border-red-300 text-red-600 font-semibold rounded-xl hover:bg-red-50 transition-all duration-200"
            >
              <TrashIcon className="h-5 w-5 mr-2" />
              Clear All
            </button>
            <Link
              href="/shop"
              className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg"
            >
              <SparklesIcon className="h-5 w-5 mr-2" />
              Continue Shopping
            </Link>
          </div>
        </div>

        {/* Wishlist Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {wishlist.map((item) => (
            <div
              key={item.id}
              className="group bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              {/* Image Section */}
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={item.image || '/provider1.jpg'}
                  alt={item.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                
                {/* Action Buttons Overlay */}
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button
                    onClick={() => removeFromWishlist(item.id)}
                    className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-200 group/btn"
                  >
                    <XMarkIcon className="h-5 w-5 text-gray-700 group-hover/btn:text-red-500" />
                  </button>
                </div>

                {/* Quick Actions */}
                <div className="absolute bottom-4 left-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Link
                    href={`/shop/${item.id}`}
                    className="flex-1 bg-white/90 backdrop-blur-sm text-gray-800 py-2 px-4 rounded-xl font-semibold text-center hover:bg-white transition-all duration-200 flex items-center justify-center"
                  >
                    <EyeIcon className="h-4 w-4 mr-2" />
                    View
                  </Link>
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center justify-center"
                  >
                    <ShoppingCartIcon className="h-4 w-4 mr-2" />
                    Add to Cart
                  </button>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {item.name}
                  </h3>
                  <HeartIconSolid className="h-6 w-6 text-red-500" />
                </div>

                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                    <span className="font-medium">{item.rating}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPinIcon className="h-4 w-4 text-gray-400 mr-1" />
                    <span>{item.location}</span>
                  </div>
                </div>

                {/* Price and Category */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-gray-900">
                    From $99
                  </span>
                  <span className="bg-gradient-to-r from-pink-100 to-red-100 text-pink-800 px-3 py-1 rounded-full text-sm font-medium">
                    Beauty & Wellness
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <Link
                    href={`/shop/${item.id}`}
                    className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-semibold text-center hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
                  >
                    View Details
                  </Link>
                  <button
                    onClick={() => {
                      // Navigate to booking page for this service
                      window.location.href = `/book-service?serviceId=${item.id}&providerId=unknown`;
                    }}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-8 border border-blue-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Book Your Favorites?
            </h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Don't wait too long! These popular services book up quickly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  wishlist.forEach(item => handleAddToCart(item));
                }}
                className="px-8 py-4 bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold rounded-2xl hover:from-green-600 hover:to-teal-600 transition-all duration-200 shadow-lg"
              >
                Add All to Cart
              </button>
              <Link
                href="/shop"
                className="px-8 py-4 border-2 border-blue-300 text-blue-600 font-semibold rounded-2xl hover:bg-blue-50 transition-all duration-200"
              >
                Explore More Services
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Clear Confirmation Modal */}
      {showClearModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                <TrashIcon className="h-8 w-8 text-red-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Clear Wishlist?</h3>
              <p className="text-gray-600 mb-8">
                Are you sure you want to remove all items from your wishlist? This action cannot be undone.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowClearModal(false)}
                  className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    clearWishlist();
                    setShowClearModal(false);
                  }}
                  className="flex-1 bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition-all duration-200"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
