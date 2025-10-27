'use client'

import React from 'react'
import Link from 'next/link'
import { Gift, Heart, Star, CreditCard, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function GiftCardSection() {
  const features = [
    {
      icon: <Gift className="h-6 w-6" />,
      title: "Perfect for Any Occasion",
      description: "Birthdays, anniversaries, holidays, or just because"
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: "Give the Gift of Wellness",
      description: "Spa services, beauty treatments, and self-care experiences"
    },
    {
      icon: <Star className="h-6 w-6" />,
      title: "Never Expires",
      description: "Our gift cards are valid for 12 months from purchase date"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Hundreds of Providers",
      description: "Choose from thousands of services across all categories"
    }
  ]

  const designPreviews = [
    { name: 'Classic', gradient: 'from-blue-500 to-purple-600' },
    { name: 'Valentine', gradient: 'from-pink-500 to-red-500' },
    { name: 'Birthday', gradient: 'from-yellow-400 to-orange-500' },
    { name: 'Spa', gradient: 'from-teal-400 to-blue-500' }
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-6">
            <Gift className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Give the Gift of Beauty & Wellness
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Perfect for birthdays, holidays, or any special occasion. Let your loved ones choose from thousands of beauty and wellness services.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/gift-cards">
              <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 text-lg">
                <Gift className="h-5 w-5 mr-2" />
                Buy Gift Cards
              </Button>
            </Link>
            <Link href="/gift-cards?tab=balance">
              <Button size="lg" variant="outline" className="px-8 py-3 text-lg border-purple-200 text-purple-600 hover:bg-purple-50">
                <CreditCard className="h-5 w-5 mr-2" />
                Check Balance
              </Button>
            </Link>
          </div>
        </div>

        {/* Gift Card Previews */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {designPreviews.map((design) => (
            <div key={design.name} className="relative">
              <div className={`h-40 rounded-xl bg-gradient-to-r ${design.gradient} p-6 text-white shadow-lg transform hover:scale-105 transition-transform duration-200`}>
                <div className="flex justify-between items-start h-full">
                  <div>
                    <h3 className="text-lg font-bold mb-2">Wiwihood</h3>
                    <p className="text-sm opacity-90">{design.name} Edition</p>
                  </div>
                  <Gift className="h-6 w-6 opacity-80" />
                </div>
                <div className="absolute bottom-6 left-6">
                  <p className="text-xl font-bold">$100</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <div key={index} className="text-center group">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-white rounded-xl shadow-lg text-purple-600 mb-4 group-hover:scale-110 transition-transform duration-200">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Start at Just $25
          </h3>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Choose from preset amounts or create a custom gift card. Delivered instantly via email with a personalized message.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {[25, 50, 100, 200, 500].map((amount) => (
              <div key={amount} className="px-6 py-3 bg-purple-50 text-purple-700 rounded-full font-semibold">
                ${amount}
              </div>
            ))}
            <div className="px-6 py-3 bg-gray-100 text-gray-700 rounded-full font-semibold">
              Custom Amount
            </div>
          </div>
          <Link href="/gift-cards">
            <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-12 py-4 text-lg">
              Purchase Now
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}