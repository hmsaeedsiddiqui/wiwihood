"use client";
import { useRouter } from 'next/navigation';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { apiService, Category, Service } from '@/lib/api';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, MapPin, Clock, Heart, Share2 } from 'lucide-react';

export default function CategoryPage() {
  const router = useRouter();
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
        setCategory(cat || null);
        setServices(cat?.services || []);
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

      {/* Services Grid Section */}
      <section className="py-[60px] pb-[40px] bg-slate-50 flex-1">
        <div className="max-w-[1280px] mx-auto w-[95%]">
          <h2 className="font-extrabold text-[32px] text-[#222] mb-2.5 text-center font-manrope">
            {category?.name || 'Category'} Services
          </h2>
          <p className="text-gray-500 font-manrope font-normal text-base text-center mb-9 tracking-[0.1px] leading-[1.5] max-w-[600px] mx-auto">
            Browse and book top-rated services in this category. Compare options, read reviews, and find the perfect match for your needs.
          </p>
          {loading ? (
            <div className="text-center py-16">
              <div className="text-[48px] text-gray-300 mb-4">Loading...</div>
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-[48px] text-gray-300 mb-4">🔍</div>
              <h3 className="text-[20px] font-semibold text-gray-900 mb-2">No services found</h3>
              <p className="text-gray-500 mb-8">
                No services available in this category yet
              </p>
            </div>
          ) : (
            <div className="grid gap-8" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
              {services.map((service) => (
                <Card key={service.id} className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-0 shadow-md rounded-2xl overflow-hidden bg-white">
                  <div
                    className="relative overflow-hidden"
                    onClick={() => router.push(`/service/${service.id}`)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={e => { if (e.key === 'Enter') router.push(`/service/${service.id}`); }}
                  >
                    <div className="h-[180px] bg-slate-200 flex items-center justify-center">
                      {service.images && service.images.length > 0 ? (
                        <img src={service.images[0]} alt={service.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-[48px] font-bold text-blue-400">{service.name.charAt(0)}</div>
                      )}
                    </div>
                    <div className="absolute top-4 right-4 flex gap-2">
                      <button className="bg-white border-none rounded-lg p-1.5 shadow-[0_2px_8px_rgba(0,0,0,0.08)] cursor-pointer"><Heart size={18} color="#10b981" /></button>
                      <button className="bg-white border-none rounded-lg p-1.5 shadow-[0_2px_8px_rgba(0,0,0,0.08)] cursor-pointer"><Share2 size={18} color="#10b981" /></button>
                    </div>
                    <div className="absolute top-4 left-4 bg-emerald-500 text-white px-3 py-1 rounded-lg font-semibold text-[15px]">
                      ${service.basePrice}
                    </div>
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-[20px] font-bold text-[#222] mb-1">{service.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div
                      className="text-gray-500 text-[15px] mb-2.5 whitespace-nowrap overflow-hidden text-ellipsis max-w-full"
                      title={service.description}
                    >
                      {service.description}
                    </div>
                    <div className="flex items-center gap-3 mb-2">
                      <Star size={16} color="#fbbf24" fill="#fbbf24" />
                      <span className="text-[15px] font-semibold">{service.provider.averageRating}</span>
                      <span className="text-[14px] text-gray-500">({service.provider.totalReviews} reviews)</span>
                    </div>
                    <div className="flex items-center gap-2.5 mb-2">
                      <Clock size={15} color="#6b7280" />
                      <span className="text-[14px]">{service.duration} min</span>
                    </div>
                    <div className="flex items-center gap-2.5 mb-2">
                      <MapPin size={15} color="#6b7280" />
                      <span className="text-[14px]">{service.provider.businessAddress}</span>
                    </div>
                    <div className="text-gray-500 text-[14px]">by <span className="font-semibold">{service.provider.businessName}</span></div>
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
