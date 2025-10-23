"use client";

import React from "react";
import { useGetServicesQuery, useGetServiceByIdQuery } from "@/store/api/servicesApi";
import Link from "next/link";

function DebugPage() {
  // Test getting all services
  const { data: services, isLoading: servicesLoading, error: servicesError } = useGetServicesQuery({});
  
  // Test getting a specific service (use the first service ID if available)
  const firstServiceId = services && services.length > 0 ? services[0].id : null;
  const { 
    data: service, 
    isLoading: serviceLoading, 
    error: serviceError 
  } = useGetServiceByIdQuery(firstServiceId!, {
    skip: !firstServiceId
  });

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Services API Debug Page</h1>
        
        {/* All Services Test */}
        <div className="bg-white rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">All Services API Test</h2>
          
          {servicesLoading && <p>Loading services...</p>}
          
          {servicesError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-700">Error loading services:</p>
              <pre className="text-sm text-red-600 mt-2">
                {JSON.stringify(servicesError, null, 2)}
              </pre>
            </div>
          )}
          
          {services && (
            <div>
              <p className="text-green-700 mb-4">✅ Successfully loaded {services.length} services</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {services.slice(0, 6).map((service) => (
                  <div key={service.id} className="border rounded-lg p-4">
                    <h3 className="font-semibold">{service.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{service.shortDescription}</p>
                    <p className="text-sm">ID: {service.id}</p>
                    <p className="text-sm">Price: {service.currency || '$'}{service.basePrice}</p>
                    <Link 
                      href={`/services/${service.id}`}
                      className="inline-block mt-2 text-blue-600 hover:text-blue-800"
                    >
                      View Details →
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Single Service Test */}
        <div className="bg-white rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Single Service API Test</h2>
          
          {!firstServiceId && <p className="text-gray-600">No service ID available for testing</p>}
          
          {firstServiceId && (
            <>
              <p className="text-sm text-gray-600 mb-4">Testing with service ID: {firstServiceId}</p>
              
              {serviceLoading && <p>Loading service details...</p>}
              
              {serviceError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <p className="text-red-700">Error loading service:</p>
                  <pre className="text-sm text-red-600 mt-2">
                    {JSON.stringify(serviceError, null, 2)}
                  </pre>
                </div>
              )}
              
              {service && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-700 mb-4">✅ Successfully loaded service details</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><strong>Name:</strong> {service.name}</div>
                    <div><strong>Price:</strong> {service.currency || '$'}{service.basePrice}</div>
                    <div><strong>Duration:</strong> {service.durationMinutes} min</div>
                    <div><strong>Type:</strong> {service.serviceType}</div>
                    <div><strong>Status:</strong> {service.status}</div>
                    <div><strong>Active:</strong> {service.isActive ? 'Yes' : 'No'}</div>
                  </div>
                  <Link 
                    href={`/services/${service.id}`}
                    className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    View Full Service Page
                  </Link>
                </div>
              )}
            </>
          )}
        </div>

        {/* Environment Information */}
        <div className="bg-white rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Environment Information</h2>
          <div className="text-sm space-y-2">
            <div><strong>API Base URL:</strong> {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}</div>
            <div><strong>Current URL:</strong> {typeof window !== 'undefined' ? window.location.href : 'SSR'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DebugPage;