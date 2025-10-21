"use client"

import React from 'react'
import PopularServices from './PopularServices'
import TopRatedBusinesses from './TopRatedBusinesses'
import PromotionsDeals from './PromotionsDeals'
import NewOnWiwihood from './NewOnWiwihood'

const FeaturedSections = () => {
  return (
    <div className="w-full">
      <NewOnWiwihood />
      <PopularServices />
      <TopRatedBusinesses />
      <PromotionsDeals />
    </div>
  )
}

export default FeaturedSections