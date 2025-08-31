"use client";
import React from "react";
import Link from "next/link";

// Demo data for shop detail
const shop = {
  id: 1,
  name: "RoseVista Spa",
  rating: 4.9,
  reviewCount: 120,
  location: "Downtown, Cityname",
  images: [
    "/blog1.jpg",
    "/blog2.jpg",
    "/blog3.jpg",
    "/blog1.jpg",
    "/blog2.jpg",
  ],
  price: 215,
  about:
    "We will do relaxing swedish massage with organic oils. All in a beautiful bright studio with relaxing music and natural light. Our therapists are highly trained and experienced. Enjoy a complimentary herbal tea after your session.",
  whyBook: [
    "Certified and experienced professionals",
    "Organic oils and relaxing environment",
    "Complimentary herbal tea",
    "Flexible booking and cancellation policy",
  ],
  faq: [
    {
      q: "Can I reschedule my appointment?",
      a: "Yes, you can reschedule up to 24 hours before your appointment.",
    },
    {
      q: "Are your oils hypoallergenic?",
      a: "Yes, we use only hypoallergenic, organic oils.",
    },
  ],
  provider: {
    name: "Aadam Smith",
    rating: 4.9,
    reviewCount: 120,
    languages: ["English", "Punjabi"],
    about: "10+ years experience. Certified massage therapist. Specialized in Swedish and deep tissue massage.",
    avatar: "/blog1.jpg",
  },
  reviews: [
    { name: "Jane Doe", rating: 5, text: "Amazing experience!" },
    { name: "John Smith", rating: 4, text: "Very relaxing, will come again." },
    { name: "Emily R.", rating: 5, text: "Best massage in town!" },
  ],
  reviewStats: [
    { label: "Excellent", value: 80 },
    { label: "Good", value: 30 },
    { label: "Average", value: 7 },
    { label: "Poor", value: 2 },
    { label: "Terrible", value: 1 },
  ],
};

export default function ShopDetailPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Main Content */}
      <div className="md:col-span-2">
        {/* Title & Meta */}
        <div className="mb-4">
          <h1 className="text-2xl font-semibold mb-1">{shop.name}</h1>
          <div className="flex items-center text-sm text-gray-500 gap-2">
            <span>⭐ {shop.rating}</span>
            <span>({shop.reviewCount} reviews)</span>
            <span>• {shop.location}</span>
          </div>
        </div>
        {/* Hero Image & Gallery */}
        <div>
          <img
            src={shop.images[0]}
            alt="Shop Hero"
            className="w-full h-64 object-cover rounded-xl mb-2"
          />
          <div className="flex gap-2 overflow-x-auto pb-2">
            {shop.images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt="Gallery"
                className="w-24 h-16 object-cover rounded-md border"
              />
            ))}
          </div>
        </div>
        {/* About */}
        <div className="mt-6">
          <h2 className="font-semibold text-lg mb-2">About this Shop</h2>
          <p className="text-gray-700 text-sm leading-relaxed">{shop.about}</p>
        </div>
        {/* Why Book With Us */}
        <div className="mt-6">
          <h2 className="font-semibold text-lg mb-2">Why Book With Us</h2>
          <ul className="list-disc pl-5 text-gray-700 text-sm">
            {shop.whyBook.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
        {/* FAQ */}
        <div className="mt-6">
          <h2 className="font-semibold text-lg mb-2">FAQ</h2>
          <ul className="space-y-2">
            {shop.faq.map((item, i) => (
              <li key={i}>
                <span className="font-medium">Q: {item.q}</span>
                <br />
                <span className="text-gray-700">A: {item.a}</span>
              </li>
            ))}
          </ul>
        </div>
        {/* Reviews */}
        <div className="mt-8">
          <h2 className="font-semibold text-lg mb-2">Recent Reviews</h2>
          <div className="flex flex-col md:flex-row gap-6">
            {/* Review Stats */}
            <div className="flex-1">
              {shop.reviewStats.map((stat, i) => (
                <div key={i} className="flex items-center gap-2 mb-1">
                  <span className="w-20 text-xs text-gray-500">{stat.label}</span>
                  <div className="flex-1 bg-gray-200 rounded h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded"
                      style={{ width: `${stat.value}%` }}
                    ></div>
                  </div>
                  <span className="w-6 text-xs text-gray-500">{stat.value}</span>
                </div>
              ))}
              <div className="mt-2 text-sm font-semibold">
                Customer rating: <span className="text-yellow-500">4.9/5.0</span>
              </div>
            </div>
            {/* Review Cards */}
            <div className="flex-1 space-y-2">
              {shop.reviews.map((review, i) => (
                <div key={i} className="bg-gray-50 p-3 rounded shadow-sm">
                  <div className="font-medium text-sm">{review.name}</div>
                  <div className="text-yellow-500 text-xs">{'★'.repeat(review.rating)}</div>
                  <div className="text-gray-700 text-xs mt-1">{review.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Sidebar */}
      <aside className="md:col-span-1 bg-gray-50 rounded-xl p-6 h-fit border">
        <div className="mb-4">
          <div className="text-xl font-bold mb-1">${shop.price}</div>
          <button className="w-full bg-green-600 text-white py-2 rounded font-semibold hover:bg-green-700 transition">Book this Shop</button>
        </div>
        <div className="mb-4">
          <div className="font-semibold mb-1">Key Information</div>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>Duration: 60 min</li>
            <li>Instant Confirmation</li>
            <li>Free cancellation</li>
          </ul>
        </div>
        <div className="mb-4">
          <div className="font-semibold mb-1">Provider</div>
          <div className="flex items-center gap-2 mb-2">
            <img src={shop.provider.avatar} alt="Avatar" className="w-10 h-10 rounded-full" />
            <div>
              <div className="font-medium text-sm">{shop.provider.name}</div>
              <div className="text-xs text-gray-500">⭐ {shop.provider.rating} ({shop.provider.reviewCount})</div>
            </div>
          </div>
          <div className="text-xs text-gray-500 mb-1">Languages: {shop.provider.languages.join(", ")}</div>
          <div className="text-xs text-gray-700">{shop.provider.about}</div>
        </div>
        <button className="w-full border border-green-600 text-green-700 py-2 rounded font-semibold hover:bg-green-50 transition">Contact Me</button>
      </aside>
    </div>
  );
}
