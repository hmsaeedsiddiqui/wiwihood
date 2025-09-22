
"use client";
import Footer from '../../components/Footer';

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { apiService, Service, Category } from "@/lib/api";

export default function MassagesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch real massage services from API
    const fetchMassageServices = async () => {
      try {
        setLoading(true);
        const result = await apiService.getServices();
        const allServices = result.data || [];
        // Filter for massage services if category info available
        const massageServices = allServices.filter((service: Service) => 
          service.category?.name?.toLowerCase().includes('massage') ||
          service.name.toLowerCase().includes('massage')
        );
        setServices(massageServices);
      } catch (error) {
        console.error('Error fetching massage services:', error);
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMassageServices();
  }, []);

  return (
    <>
      <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: 'Manrope, sans-serif', padding: '60px 0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
          <h1 style={{ fontSize: 36, fontWeight: 800, textAlign: 'center', marginBottom: 40, letterSpacing: '-1px', color: '#222' }}>Massages</h1>
          {loading ? (
            <div style={{ textAlign: 'center', color: '#6b7280', fontSize: 18 }}>Loading services...</div>
          ) : services.length === 0 ? (
            <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.10)', padding: 32, textAlign: 'center', color: '#6b7280', fontSize: 18 }}>
              No massage services found.
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', justifyContent: 'center' }}>
                {services.map((service) => (
                  <Link key={service.id} href={`/services/[id]?id=${service.id}`} as={`/services/${service.id}`} style={{ textDecoration: 'none' }}>
                    <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.10)', width: 320, minHeight: 340, overflow: 'hidden', display: 'flex', flexDirection: 'column', marginBottom: 24 }}>
                      <div style={{ height: 170, width: '100%', background: service.imageUrl ? `url(${service.imageUrl}) center/cover no-repeat` : '#f3f4f6' }}></div>
                      <div style={{ padding: 24, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: 18, color: '#222', marginBottom: 8 }}>{service.name}</div>
                        <div style={{ color: '#6b7280', fontSize: 15, marginBottom: 8 }}>{service.description}</div>
                        <div style={{ color: '#10b981', fontWeight: 700, fontSize: 17, marginBottom: 8 }}>${service.basePrice}</div>
                        <div style={{ color: '#6b7280', fontSize: 14 }}>Provider: {service.provider?.businessName}</div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
