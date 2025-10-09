"use client";

import React from 'react';

export default function NewsArticle() {
  const articles = [
    {
      id: 1,
      title: "Best nail trends: This season's biggest beauty boosts",
      category: "Nails",
      date: "2 days ago"
    },
    {
      id: 2, 
      title: "Best nail trends: This season's biggest beauty boosts",
      category: "Nails",
      date: "2 days ago"
    },
    {
      id: 3,
      title: "Best nail trends: This season's biggest beauty boosts", 
      category: "Nails",
      date: "2 days ago"
    }
  ];

  // Testimonial section
  const testimonial = {
    text: "I love how easy it is to book beauty appointments on Vivihood. The platform connects me with professional services near me and the booking process is so quick and seamless!",
    author: "Sophia Lee",
    role: "Beauty Enthusiast"
  };

  return (
    <>
      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Profile Images */}
          <div className="flex justify-center space-x-2 mb-8">
            <img src="/testimonial1.jpg" alt="User 1" className="w-12 h-12 rounded-full border-2 border-white shadow-sm object-cover" />
            <img src="/testimonial2.jpg" alt="User 2" className="w-12 h-12 rounded-full border-2 border-white shadow-sm object-cover" />
            <img src="/testimonial3.jpg" alt="User 3" className="w-12 h-12 rounded-full border-2 border-white shadow-sm object-cover" />
          </div>

          <blockquote className="text-xl md:text-2xl font-light text-gray-700 mb-6 italic leading-relaxed">
            "{testimonial.text}"
          </blockquote>

          <div className="text-center">
            <p className="font-semibold text-gray-800">{testimonial.author}</p>
            <p className="text-gray-500 text-sm">{testimonial.role}</p>
          </div>
        </div>
      </section>

      {/* Latest News Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-gray-600 mb-2">Latest News</p>
            <h2 className="text-3xl font-light text-gray-800">News & Articles</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article, index) => (
              <div key={article.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all border border-gray-100">
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={index === 0 ? '/facial-treatment.jpg' : index === 1 ? '/service2.jpg' : '/service3.jpg'}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 text-gray-700 px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                      {article.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 leading-tight">
                    {article.title}
                  </h3>
                  <p className="text-gray-500 text-sm">{article.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}