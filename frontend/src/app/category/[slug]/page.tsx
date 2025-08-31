'use client'

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { apiService, Category, Service } from '@/lib/api';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, MapPin, Clock, Heart, Share2 } from 'lucide-react';

export default function CategoryPage() {
  const params = useParams();
  const categorySlug = params.slug as string;
  const [category, setCategory] = useState<Category | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const cat = await apiService.getCategoryBySlug(categorySlug);
        setCategory(cat);
        const servs = await apiService.getServicesByCategory(cat.id);
        setServices(servs);
      } catch (e) {
        setCategory(null);
        setServices([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [categorySlug]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Hero Section */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: 300,
        background: `linear-gradient(rgba(44,62,80,0.85),rgba(44,62,80,0.85)), url(${category?.bannerImage || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'}) center/cover no-repeat`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        textAlign: 'center',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <h1 style={{ fontSize: 40, fontWeight: 800, marginBottom: 10, fontFamily: 'Manrope, sans-serif', letterSpacing: '-1px' }}>{category?.name || 'Category'}</h1>
          <p style={{ fontSize: 18, opacity: 0.85 }}>Home &gt; {category?.name || 'Category'}</p>
        </div>
        <div style={{
          position: 'absolute',
          left: 0,
          bottom: -50,
          width: '100%',
          height: 100,
          background: '#fff',
          transform: 'skewY(-3deg)',
          transformOrigin: '100% 0',
          zIndex: 1,
        }}></div>
      </div>

      {/* Services Grid Section */}
      <section style={{ padding: '60px 0 40px 0', background: '#f8fafc', flex: 1 }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <h2 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: 32, color: '#222', marginBottom: 10, textAlign: 'center' }}>
            {category?.name || 'Category'} Services
          </h2>
          <p style={{ color: '#6b7280', fontFamily: 'Manrope, sans-serif', fontWeight: 400, fontSize: 16, textAlign: 'center', marginBottom: 38, letterSpacing: '0.1px', lineHeight: 1.5, maxWidth: 600, marginLeft: 'auto', marginRight: 'auto' }}>
            Browse and book top-rated services in this category. Compare options, read reviews, and find the perfect match for your needs.
          </p>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '64px 0' }}>
              <div style={{ fontSize: 48, color: '#d1d5db', marginBottom: 16 }}>Loading...</div>
            </div>
          ) : services.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '64px 0' }}>
              <div style={{ fontSize: 48, color: '#d1d5db', marginBottom: 16 }}>🔍</div>
              <h3 style={{ fontSize: 20, fontWeight: 600, color: '#111827', marginBottom: 8 }}>No services found</h3>
              <p style={{ color: '#6b7280', marginBottom: 32 }}>
                No services available in this category yet
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: 32, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
              {services.map((service) => (
                <Card key={service.id} className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-0 shadow-md" style={{ borderRadius: 16, overflow: 'hidden', background: '#fff' }}>
                  <div style={{ position: 'relative', overflow: 'hidden' }}>
                    <div style={{ height: 180, background: '#e0e7ef', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {service.imageUrl ? (
                        <img src={service.imageUrl} alt={service.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ fontSize: 48, fontWeight: 700, color: '#60a5fa' }}>{service.name.charAt(0)}</div>
                      )}
                    </div>
                    <div style={{ position: 'absolute', top: 16, right: 16, display: 'flex', gap: 8 }}>
                      <button style={{ background: '#fff', border: 'none', borderRadius: 8, padding: 6, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', cursor: 'pointer' }}><Heart size={18} color="#10b981" /></button>
                      <button style={{ background: '#fff', border: 'none', borderRadius: 8, padding: 6, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', cursor: 'pointer' }}><Share2 size={18} color="#10b981" /></button>
                    </div>
                    <div style={{ position: 'absolute', top: 16, left: 16, background: '#10b981', color: '#fff', padding: '4px 12px', borderRadius: 8, fontWeight: 600, fontSize: 15 }}>
                      ${service.basePrice}
                    </div>
                  </div>
                  <CardHeader style={{ paddingBottom: 8 }}>
                    <CardTitle style={{ fontSize: 20, fontWeight: 700, color: '#222', marginBottom: 4 }}>{service.name}</CardTitle>
                  </CardHeader>
                  <CardContent style={{ paddingTop: 0 }}>
                    <div style={{ color: '#6b7280', fontSize: 15, marginBottom: 10 }}>{service.description}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                      <Star size={16} color="#fbbf24" fill="#fbbf24" />
                      <span style={{ fontSize: 15, fontWeight: 600 }}>{service.provider.averageRating}</span>
                      <span style={{ fontSize: 14, color: '#6b7280' }}>({service.provider.totalReviews} reviews)</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      <Clock size={15} color="#6b7280" />
                      <span style={{ fontSize: 14 }}>{service.duration} min</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      <MapPin size={15} color="#6b7280" />
                      <span style={{ fontSize: 14 }}>{service.provider.businessAddress}</span>
                    </div>
                    <div style={{ color: '#6b7280', fontSize: 14 }}>by <span style={{ fontWeight: 600 }}>{service.provider.businessName}</span></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer Section */}
      <Footer />
    </div>
  );
}
