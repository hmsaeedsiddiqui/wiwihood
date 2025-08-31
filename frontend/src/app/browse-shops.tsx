import React from 'react';
import { HeaderHero } from '../components/layout/HeaderHero';
import Footer from '../components/Footer';

const trendingCategories = [
  { name: 'Hair Services' },
  { name: 'Body Massage' },
  { name: 'Skincare' },
  { name: 'Facial Treatment' },
];

const shopCards = [
  // Example data, replace with real data as needed
  { title: 'Beauty Facial Massage', image: '/images/shop1.jpg', category: 'Body Massage', rating: 4.8, reviews: 120, price: '$40', location: 'London', time: '30 min' },
  { title: 'Relaxing Facial Massage', image: '/images/shop2.jpg', category: 'Body Massage', rating: 4.7, reviews: 98, price: '$35', location: 'London', time: '30 min' },
  { title: 'Swedish Massage', image: '/images/shop3.jpg', category: 'Body Massage', rating: 4.9, reviews: 150, price: '$50', location: 'London', time: '45 min' },
  { title: 'Deep Tissue Massage', image: '/images/shop4.jpg', category: 'Body Massage', rating: 4.6, reviews: 80, price: '$45', location: 'London', time: '40 min' },
  { title: 'Aromatherapy Massage', image: '/images/shop5.jpg', category: 'Body Massage', rating: 4.8, reviews: 110, price: '$55', location: 'London', time: '50 min' },
  { title: 'Hot Stone Massage', image: '/images/shop6.jpg', category: 'Body Massage', rating: 4.7, reviews: 90, price: '$60', location: 'London', time: '60 min' },
];

export default function BrowseShopsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <HeaderHero />
      {/* Hero Section */}
      <div className="relative w-full h-[320px] md:h-[380px] lg:h-[420px] flex items-center justify-center" style={{backgroundImage: 'url(/images/hero-bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center'}}>
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <h1 className="relative z-10 text-white text-3xl md:text-4xl font-bold">Browse All Shops</h1>
      </div>
      {/* Angled White Section */}
      <div className="relative -mt-16 z-10">
        <div className="bg-white rounded-t-3xl shadow-lg" style={{clipPath: 'polygon(0 3vw, 100% 0, 100% 100%, 0 100%)'}}>
          <div className="max-w-7xl mx-auto px-4 py-10">
            {/* Trending Categories */}
            <div className="flex flex-wrap gap-4 mb-8">
              {trendingCategories.map((cat, idx) => (
                <button key={cat.name} className="bg-white border border-gray-200 rounded-lg px-6 py-3 font-semibold shadow-sm flex items-center gap-2">
                  {cat.name}
                  {idx === 0 && <span className="ml-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded">Hot</span>}
                </button>
              ))}
              <button className="ml-auto bg-gray-100 rounded-full p-2 shadow"><i className="fa fa-ellipsis-h"></i></button>
            </div>
            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-8 items-center">
              <select className="border border-gray-200 rounded px-3 py-2 text-sm">
                <option>Categories</option>
              </select>
              <select className="border border-gray-200 rounded px-3 py-2 text-sm">
                <option>Sort by</option>
              </select>
              <input className="border border-gray-200 rounded px-3 py-2 text-sm flex-1 min-w-[180px]" placeholder="Search..." />
              <button className="ml-auto bg-green-500 text-white px-4 py-2 rounded font-semibold flex items-center gap-2"><i className="fa fa-star"></i> Best Recommended</button>
            </div>
            {/* Shop Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {shopCards.map((card, idx) => (
                <div key={idx} className="bg-white border border-gray-100 rounded-xl shadow hover:shadow-lg transition overflow-hidden flex flex-col">
                  <img src={card.image} alt={card.title} className="w-full h-40 object-cover" />
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded">{card.category}</span>
                      <span className="ml-auto text-yellow-500"><i className="fa fa-star"></i> {card.rating}</span>
                    </div>
                    <h2 className="font-bold text-lg mb-1">{card.title}</h2>
                    <div className="text-gray-500 text-sm mb-2">{card.location} • {card.time}</div>
                    <div className="flex items-center mt-auto">
                      <span className="font-bold text-green-600 text-lg">{card.price}</span>
                      <span className="ml-auto text-gray-400 text-xs">{card.reviews} reviews</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Pagination */}
            <div className="flex justify-center gap-2">
              {[1,2,3,4,5].map(n => (
                <button key={n} className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${n===3 ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700'}`}>{n}</button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
