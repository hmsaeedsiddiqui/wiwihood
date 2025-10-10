import React from 'react'

function Footer() {
  return (
    <footer className="bg-[#2C2C2C] text-white">
      {/* Top Section */}
      <div className="border-b border-gray-600">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Logo */}
            <div className="text-2xl font-light mb-4 md:mb-0">
              vividhood
            </div>
            
            {/* Newsletter Signup */}
            <div className="flex items-center space-x-4">
              <span className="text-lg">Newsletter Sign Up</span>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Enter your e-mail address"
                  className="bg-transparent border border-gray-500 rounded-l-full px-4 py-2 text-sm focus:outline-none focus:border-[#E89B8B] w-64"
                />
                <button className="bg-[#E89B8B] px-4 py-2 rounded-r-full hover:bg-[#D4876F] transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Description and Social Media */}
          <div className="md:col-span-1">
            <div className="flex space-x-4 mb-6">
              {/* Instagram */}
              <a href="#" className="w-8 h-8 border border-gray-500 rounded-sm flex items-center justify-center hover:border-[#E89B8B] transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              
              {/* Threads/X */}
              <a href="#" className="w-8 h-8 border border-gray-500 rounded-sm flex items-center justify-center hover:border-[#E89B8B] transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
            
            <p className="text-gray-300 text-sm leading-relaxed">
              It is a long established fact that a reader will be distracted 
              by the readable content of a page when looking at its 
              layout. The point of using Lorem Ipsum is that it has a more-
              or-less normal distribution of letters
            </p>
          </div>

          {/* Pages */}
          <div>
            <h3 className="text-lg font-medium mb-4">Pages</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-[#E89B8B] transition-colors">About vividhood</a></li>
              <li><a href="#" className="hover:text-[#E89B8B] transition-colors">List your business</a></li>
              <li><a href="#" className="hover:text-[#E89B8B] transition-colors">Blog</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-medium mb-4">Categories</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-[#E89B8B] transition-colors">Nails</a></li>
              <li><a href="#" className="hover:text-[#E89B8B] transition-colors">Lashes</a></li>
              <li><a href="#" className="hover:text-[#E89B8B] transition-colors">Brows</a></li>
              <li><a href="#" className="hover:text-[#E89B8B] transition-colors">Facials</a></li>
              <li><a href="#" className="hover:text-[#E89B8B] transition-colors">Hair</a></li>
            </ul>
          </div>

          {/* Hair Services */}
          <div>
            <h3 className="text-lg font-medium mb-4">Hair</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-[#E89B8B] transition-colors">Massage</a></li>
              <li><a href="#" className="hover:text-[#E89B8B] transition-colors">Lip</a></li>
              <li><a href="#" className="hover:text-[#E89B8B] transition-colors">Ear</a></li>
              <li><a href="#" className="hover:text-[#E89B8B] transition-colors">Hair Remove</a></li>
              <li><a href="#" className="hover:text-[#E89B8B] transition-colors">Yoga / Pilates</a></li>
            </ul>
          </div>

          {/* Legal & Contact */}
          <div>
            <h3 className="text-lg font-medium mb-4">Legal</h3>
            <ul className="space-y-2 text-gray-300 mb-6">
              <li><a href="#" className="hover:text-[#E89B8B] transition-colors">Privacy policy</a></li>
              <li><a href="#" className="hover:text-[#E89B8B] transition-colors">Terms & Conditions</a></li>
            </ul>

            <h3 className="text-lg font-medium mb-4">Contact</h3>
            <div className="space-y-2 text-gray-300">
              <p className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
                Beyoutiful@salon.io
              </p>
              <p className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                </svg>
                1800 123 4567
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer