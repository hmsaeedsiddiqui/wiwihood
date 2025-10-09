"use client";

import React from 'react';
import { Play } from 'lucide-react';

export default function Video() {
  return (
    <section className="py-16" style={{
      background: 'linear-gradient(135deg, #FFB5B5 0%, #FFC4A3 50%, #FFD3CC 100%)'
    }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl">
          <div className="aspect-video bg-gradient-to-br from-orange-100 to-pink-100 flex items-center justify-center relative">
            <img 
              src="/video-thumbnail.jpg"
              alt="Spa Treatment"
              className="w-full h-full object-cover"
            />
            <button className="absolute w-20 h-20 bg-white/90 rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl transition-all backdrop-blur-sm">
              <Play className="h-8 w-8 text-orange-500 ml-1" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}