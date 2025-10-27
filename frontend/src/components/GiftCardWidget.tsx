'use client'

import React from 'react'
import Link from 'next/link'
import { Gift } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function GiftCardWidget() {
  return (
    <div className="relative">
      <Link href="/gift-cards">
        <Button
          variant="outline"
          className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white border-none hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <Gift className="h-4 w-4" />
          <span className="hidden sm:inline">Gift Cards</span>
        </Button>
      </Link>
    </div>
  )
}

// Quick purchase modal component for easier access
export function QuickGiftCardModal() {
  // This would be implemented as a modal version of the gift card purchase
  return null
}