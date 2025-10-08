'use client';

import Link from 'next/link';

export function AuthHeader() {
  console.log('AuthHeader component is loading');
  return (
    <div className="bg-gradient-to-r from-orange-500 to-pink-600 shadow-sm sticky top-0 z-30">
      <div className="flex items-center justify-center h-16 px-4 lg:px-6">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-sm">V</span>
          </div>
          <span className="text-lg lg:text-xl font-bold text-white">
            vivi<span className="text-yellow-300">hood</span>
          </span>
        </div>
      </div>
    </div>
  );
}