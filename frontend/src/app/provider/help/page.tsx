"use client";
import React, { useState } from "react";
import ProviderNav from "@/components/ProviderNav";

// Mock help data
const helpCategories = [
  {
    id: "getting-started",
    title: "Getting Started",
    icon: "🚀",
    articles: [
      { title: "Setting up your provider profile", time: "5 min read", views: 1234 },
      { title: "Adding your first service", time: "3 min read", views: 856 },
      { title: "Understanding the booking process", time: "7 min read", views: 2341 },
      { title: "Setting your availability", time: "4 min read", views: 765 }
    ]
  },
  {
    id: "bookings",
    title: "Managing Bookings",
    icon: "📅",
    articles: [
      { title: "Accepting and declining bookings", time: "6 min read", views: 1876 },
      { title: "Rescheduling appointments", time: "4 min read", views: 923 },
      { title: "Handling cancellations", time: "5 min read", views: 1234 },
      { title: "Communication with customers", time: "3 min read", views: 654 }
    ]
  },
  {
    id: "payments",
    title: "Payments & Earnings",
    icon: "💰",
    articles: [
      { title: "Understanding payment processing", time: "8 min read", views: 2156 },
      { title: "Setting up payout methods", time: "5 min read", views: 1432 },
      { title: "Viewing earnings reports", time: "4 min read", views: 987 },
      { title: "Handling refunds", time: "6 min read", views: 765 }
    ]
  },
  {
    id: "marketing",
    title: "Growing Your Business",
    icon: "📈",
    articles: [
      { title: "Optimizing your service listings", time: "10 min read", views: 1876 },
      { title: "Building customer relationships", time: "7 min read", views: 1234 },
      { title: "Using analytics to improve", time: "9 min read", views: 1543 },
      { title: "Promoting special offers", time: "5 min read", views: 876 }
    ]
  }
];

const faqs = [
  {
    question: "How do I get paid for my services?",
    answer: "Payments are automatically processed when customers complete their bookings. You'll receive payouts weekly to your connected bank account or payment method."
  },
  {
    question: "Can I set different prices for different time slots?",
    answer: "Yes! You can set dynamic pricing based on time of day, day of week, or special occasions through the service management section."
  },
  {
    question: "What happens if a customer doesn't show up?",
    answer: "You can mark the booking as 'No Show' in your booking management. Depending on your cancellation policy, you may still receive payment."
  },
  {
    question: "How do I handle customer complaints?",
    answer: "Use the review response feature to address concerns professionally. For serious issues, contact our support team for assistance."
  },
  {
    question: "Can I block certain dates from bookings?",
    answer: "Yes, use the calendar management feature to set time-off periods, holidays, or personal unavailable dates."
  }
];

export default function ProviderHelp() {
  const [selectedCategory, setSelectedCategory] = useState("getting-started");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [showContactForm, setShowContactForm] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <ProviderNav />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Help Center</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions and learn how to make the most of your provider account
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for help articles..."
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
              <nav className="space-y-2">
                {helpCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition ${
                      selectedCategory === category.id
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <span className="mr-2">{category.icon}</span>
                    {category.title}
                  </button>
                ))}
              </nav>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowContactForm(true)}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
                >
                  📞 Contact Support
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Articles */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-6">
                <span className="text-2xl mr-3">
                  {helpCategories.find(cat => cat.id === selectedCategory)?.icon}
                </span>
                <h2 className="text-xl font-semibold">
                  {helpCategories.find(cat => cat.id === selectedCategory)?.title}
                </h2>
              </div>

              <div className="space-y-4">
                {helpCategories.find(cat => cat.id === selectedCategory)?.articles.map((article, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:bg-blue-50 transition cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900 mb-1">{article.title}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>⏱️ {article.time}</span>
                          <span>👁️ {article.views.toLocaleString()} views</span>
                        </div>
                      </div>
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6">Frequently Asked Questions</h2>
              
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg">
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                      className="w-full text-left p-4 hover:bg-gray-50 transition"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-900">{faq.question}</h3>
                        <svg
                          className={`w-5 h-5 text-gray-400 transition-transform ${
                            expandedFaq === index ? "rotate-180" : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </button>
                    {expandedFaq === index && (
                      <div className="px-4 pb-4">
                        <p className="text-gray-600">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6">Quick Actions</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:bg-blue-50 transition cursor-pointer">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">💬</span>
                    <div>
                      <h3 className="font-medium text-gray-900">Live Chat</h3>
                      <p className="text-sm text-gray-600">Get instant help from our support team</p>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:bg-blue-50 transition cursor-pointer">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">📧</span>
                    <div>
                      <h3 className="font-medium text-gray-900">Email Support</h3>
                      <p className="text-sm text-gray-600">Send us a detailed message</p>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:bg-blue-50 transition cursor-pointer">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">📹</span>
                    <div>
                      <h3 className="font-medium text-gray-900">Video Tutorials</h3>
                      <p className="text-sm text-gray-600">Watch step-by-step guides</p>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:bg-blue-50 transition cursor-pointer">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">👥</span>
                    <div>
                      <h3 className="font-medium text-gray-900">Community Forum</h3>
                      <p className="text-sm text-gray-600">Connect with other providers</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Contact Support</h2>
                <button
                  onClick={() => setShowContactForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option>General Question</option>
                    <option>Booking Issue</option>
                    <option>Payment Problem</option>
                    <option>Technical Support</option>
                    <option>Account Management</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Describe your issue or question..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                    <option>Urgent</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowContactForm(false)}
                    className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
