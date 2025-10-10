"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/footer";

function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const serviceId = params?.id as string;

  const handleBookNow = () => {
    router.push(`/services/${serviceId}/booking`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Service Detail Page</h1>
        <p className="mb-4">Service ID: {serviceId}</p>
        <button onClick={handleBookNow} className="bg-orange-500 text-white px-4 py-2 rounded">
          Book Now
        </button>
      </div>
      <Footer />
    </div>
  );
}

export default ServiceDetailPage;