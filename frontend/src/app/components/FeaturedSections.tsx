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
      <PromotionsDeals />
    </div>
  )
}

export default FeaturedSections