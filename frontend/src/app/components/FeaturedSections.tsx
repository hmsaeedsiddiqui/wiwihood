"use client"

import React from 'react'
import PopularServices from './PopularServices'
import TopRatedBusinesses from './TopRatedBusinesses'
import PromotionsDeals from './PromotionsDeals'

const FeaturedSections = () => {
  return (
    <div className="w-full">
      <PopularServices />
      <TopRatedBusinesses />
      {/* Removed PromotionsDeals - now handled in HotProduct component with proper badge filtering */}
    </div>
  )
}

export default FeaturedSections