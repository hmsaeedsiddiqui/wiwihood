'use client';


import { useWishlist } from './WishlistContext';
import { useCart } from './cartContext';


export default function Wishlist() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3 text-red-500">
            <i className="fas fa-heart"></i> My Wishlist
          </h1>
          <p className="text-gray-500 mt-1">{wishlist.length} {wishlist.length === 1 ? 'service' : 'services'} saved for later</p>
        </div>
        {wishlist.length > 0 && (
          <button
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-4 py-2 rounded-lg border border-gray-200 shadow-sm flex items-center gap-2"
            onClick={() => wishlist.forEach(item => removeFromWishlist(item.id))}
          >
            <i className="fas fa-trash"></i> Clear Wishlist
          </button>
        )}
      </div>

      {wishlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-xl shadow-md border border-gray-100">
          <i className="fas fa-heart-broken text-5xl text-gray-300 mb-4"></i>
          <h3 className="text-xl font-semibold mb-2">Your wishlist is empty</h3>
          <p className="text-gray-500 mb-6">Browse our services and add your favorites here</p>
          <a href="/shop" className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-lg font-semibold shadow hover:bg-green-700 transition">
            <i className="fas fa-search"></i> Browse Services
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {wishlist.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex flex-col group hover:shadow-2xl transition relative">
              <button
                className="absolute top-3 right-3 z-10 rounded-full p-2 bg-white/80 hover:bg-white shadow border border-gray-200 text-gray-400 hover:text-red-500 transition"
                onClick={() => removeFromWishlist(item.id)}
                title="Remove from wishlist"
              >
                <i className="fas fa-times"></i>
              </button>
              <div className="h-44 w-full bg-gray-100 flex items-center justify-center overflow-hidden">
                <img
                  src={item.image || '/blog1.jpg'}
                  alt={item.name}
                  className="object-cover w-full h-full group-hover:scale-105 transition"
                  onError={e => { (e.currentTarget as HTMLImageElement).src = '/blog1.jpg'; }}
                />
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="font-bold text-lg text-gray-900 mb-1 truncate">{item.name}</div>
                <div className="text-gray-600 text-sm mb-2 line-clamp-2 min-h-[40px]">{item.description}</div>
                <div className="flex items-center justify-between mt-auto">
                  {item.basePrice && <span className="text-green-700 font-bold text-base">${item.basePrice}</span>}
                  {item.durationMinutes && <span className="text-xs text-gray-500 bg-gray-100 rounded px-2 py-1 ml-2">{item.durationMinutes} min</span>}
                </div>
                <button
                  className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-2 shadow transition"
                  onClick={() => addToCart({
                    id: Number(item.id),
                    name: item.name,
                    provider: '',
                    price: item.basePrice || 0,
                    imageUrl: item.image || '/blog1.jpg',
                    quantity: 1,
                  })}
                >
                  <i className="fa-solid fa-cart-plus"></i> Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
