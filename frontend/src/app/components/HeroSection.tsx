"use client";

import React from 'react';
import { ArrowRight, Play, CheckCircle } from 'lucide-react';
import Link from 'next/link';

interface HeroSectionProps {
  title: string;
  subtitle: string;
  description?: string;
  primaryCTA?: {
    text: string;
    href: string;
    onClick?: () => void;
  };
  secondaryCTA?: {
    text: string;
    href: string;
    onClick?: () => void;
  };
  features?: string[];
  backgroundImage?: string;
  variant?: 'default' | 'centered' | 'split';
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  description,
  primaryCTA,
  secondaryCTA,
  features = [],
  backgroundImage,
  variant = 'default'
}) => {
  const gradientBg = backgroundImage 
    ? `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${backgroundImage})`
    : 'linear-gradient(135deg, #f97316 0%, #ec4899 100%)';

  if (variant === 'centered') {
    return (
      <section 
        className="relative py-20 md:py-32 text-white overflow-hidden"
        style={{ background: gradientBg }}
      >
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            {title}
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">
            {subtitle}
          </p>
          {description && (
            <p className="text-lg mb-12 text-white/80 max-w-2xl mx-auto">
              {description}
            </p>
          )}
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            {primaryCTA && (
              <Link href={primaryCTA.href}>
                <button 
                  onClick={primaryCTA.onClick}
                  className="bg-white text-orange-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all flex items-center justify-center"
                >
                  {primaryCTA.text}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </Link>
            )}
            {secondaryCTA && (
              <Link href={secondaryCTA.href}>
                <button 
                  onClick={secondaryCTA.onClick}
                  className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-orange-600 transition-all flex items-center justify-center"
                >
                  <Play className="mr-2 h-5 w-5" />
                  {secondaryCTA.text}
                </button>
              </Link>
            )}
          </div>

          {features.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center justify-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-white/90">{feature}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    );
  }

  if (variant === 'split') {
    return (
      <section className="min-h-screen flex items-center bg-gradient-to-br from-orange-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                {title}
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                {subtitle}
              </p>
              {description && (
                <p className="text-lg text-gray-600 mb-8">
                  {description}
                </p>
              )}
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                {primaryCTA && (
                  <Link href={primaryCTA.href}>
                    <button 
                      onClick={primaryCTA.onClick}
                      className="bg-gradient-to-r from-orange-500 to-pink-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-lg transition-all flex items-center justify-center"
                    >
                      {primaryCTA.text}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </button>
                  </Link>
                )}
                {secondaryCTA && (
                  <Link href={secondaryCTA.href}>
                    <button 
                      onClick={secondaryCTA.onClick}
                      className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-50 transition-all flex items-center justify-center"
                    >
                      <Play className="mr-2 h-5 w-5" />
                      {secondaryCTA.text}
                    </button>
                  </Link>
                )}
              </div>

              {features.length > 0 && (
                <div className="space-y-3">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Visual */}
            <div className="relative">
              <div className="bg-gradient-to-r from-orange-500 to-pink-600 rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">Ready to get started?</h3>
                <p className="text-lg mb-6 text-white/90">
                  Join thousands of satisfied customers who trust us with their service needs.
                </p>
                <div className="flex space-x-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">10K+</div>
                    <div className="text-sm text-white/80">Happy Customers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">500+</div>
                    <div className="text-sm text-white/80">Service Providers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">4.8★</div>
                    <div className="text-sm text-white/80">Average Rating</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Default variant
  return (
    <section 
      className="relative py-20 md:py-32 text-white overflow-hidden"
      style={{ background: gradientBg }}
    >
      <div className="absolute inset-0 bg-black opacity-10"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            {title}
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90">
            {subtitle}
          </p>
          {description && (
            <p className="text-lg mb-12 text-white/80 max-w-2xl">
              {description}
            </p>
          )}
          
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            {primaryCTA && (
              <Link href={primaryCTA.href}>
                <button 
                  onClick={primaryCTA.onClick}
                  className="bg-white text-orange-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all flex items-center justify-center"
                >
                  {primaryCTA.text}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </Link>
            )}
            {secondaryCTA && (
              <Link href={secondaryCTA.href}>
                <button 
                  onClick={secondaryCTA.onClick}
                  className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-orange-600 transition-all flex items-center justify-center"
                >
                  <Play className="mr-2 h-5 w-5" />
                  {secondaryCTA.text}
                </button>
              </Link>
            )}
          </div>

          {features.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-white/90">{feature}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};