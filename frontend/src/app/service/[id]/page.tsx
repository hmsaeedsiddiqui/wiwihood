"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiService, Service } from "@/lib/api";
import { useCart } from '@/components/cartContext';
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, MapPin, Clock } from "lucide-react";

export default function ServiceDetailPage() {
  const { addToCart, cart } = useCart();
  const params = useParams();
  const router = useRouter();
  const serviceId = params.id as string;
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  useEffect(() => {
    async function fetchService() {
      setLoading(true);
      try {
        const data = await apiService.getServiceById(serviceId);
        setService(data);
      } catch (e) {
        setService(null);
      } finally {
        setLoading(false);
      }
    }
    if (serviceId) fetchService();
  }, [serviceId]);

  if (loading) {
    return <div className="p-10 text-center">Loading...</div>;
  }
  if (!service) {
    return <div className="p-10 text-center">Service not found.</div>;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <section className="py-10 pb-5 bg-slate-50 flex-1">
        <div className="max-w-4xl w-[95%] mx-auto ">
          <Card className="rounded-2xl overflow-hidden bg-white shadow-lg">
            <div className="relative overflow-hidden">
              <div className="h-full bg-slate-200 flex items-center justify-center">
                {service.images && service.images.length > 0 ? (
                  <div className={`flex flex-wrap gap-4 ${service.images.length === 1 ? 'justify-center' : 'justify-start'} items-center h-full w-full`}>
                    {service.images.map((img, idx) => {
                      const isPublicId = !img.startsWith('http');
                      const url = isPublicId
                        ? `https://res.cloudinary.com/djgdfq23e/image/upload/${img}`
                        : img;
                      const imgCount = service.images?.length || 1;
                      // Responsive width: 1 image = 100%, 2 = 50%, 3 = 33.3%, 4+ = 48% (2 per row)
                      let width = '100%';
                      if (imgCount === 2) width = '48%';
                      else if (imgCount === 3) width = '31.5%';
                      else if (imgCount >= 4) width = '48%';
                      return (
                        <img
                          key={idx}
                          src={url}
                          alt={service.name + ' ' + (idx + 1)}
                          className="h-80  object-cover rounded-t-xl shadow-md bg-white block"
                          style={{ width }}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-6xl font-bold text-blue-400">{service.name.charAt(0)}</div>
                )}
              </div>
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-3xl font-bold text-gray-800 mb-1">{service.name}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div 
                className={`text-gray-500 text-lg mb-5 cursor-pointer transition-all duration-300 ${
                  !isDescriptionExpanded 
                    ? 'overflow-hidden' 
                    : ''
                }`}
                style={{
                  display: !isDescriptionExpanded ? '-webkit-box' : 'block',
                  WebkitLineClamp: !isDescriptionExpanded ? 3 : 'none',
                  WebkitBoxOrient: !isDescriptionExpanded ? 'vertical' : 'initial'
                }}
                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
              >
                {service.description}
                {!isDescriptionExpanded && service.description && service.description.length > 150 && (
                  <span className="text-emerald-600 font-medium ml-2">...Read more</span>
                )}
                {isDescriptionExpanded && (
                  <span className="text-emerald-600 font-medium ml-2 block mt-2">Show less</span>
                )}
              </div>
              <div className="flex items-center gap-4 mb-3">
                <Star size={18} color="#fbbf24" fill="#fbbf24" />
                <span className="text-base font-semibold">{service.provider.averageRating}</span>
                <span className="text-sm text-gray-500">({service.provider.totalReviews} reviews)</span>
              </div>
              <div className="flex items-center gap-3 mb-3">
                <Clock size={16} color="#6b7280" />
                <span className="text-sm">{service.duration} min</span>
              </div>
              <div className="flex items-center gap-3 mb-3">
                <MapPin size={16} color="#6b7280" />
                <span className="text-sm">{service.provider.businessAddress}</span>
              </div>
              <div className="text-gray-500 text-sm mb-2.5">
                Provided by <span className="font-semibold">{service.provider.businessName}</span>
              </div>
              <div className="text-gray-500 text-sm mb-2.5">
                <b>Shop Location:</b> {service.provider.businessAddress}
              </div>
              <div className="text-gray-500 text-sm mb-2.5">
                {/* City removed: not present on provider type */}
              </div>
              <button
                className="bg-emerald-600 hover:bg-emerald-700 text-white border-none rounded-lg px-8 py-3 font-bold text-lg mt-5 cursor-pointer transition-colors duration-200"
                onClick={() => {
                  // Cart functionality hidden - going directly to booking
                  router.push(`/book-service?serviceId=${service.id}&providerId=${service.provider.id}`);
                  /* ORIGINAL CART CODE - keeping for future use:
                  addToCart({
                    id: service.id,
                    name: service.name,
                    provider: service.provider.businessName,
                    price: Number(service.basePrice || service.price || 0),
                    imageUrl: service.images && service.images.length > 0
                      ? (service.images[0].startsWith('http')
                        ? service.images[0]
                        : `https://res.cloudinary.com/djgdfq23e/image/upload/${service.images[0]}`)
                      : '',
                    quantity: 1
                  });
                  */
                }}
              >
                Book Now
              </button>
            </CardContent>
          </Card>
        </div>
      </section>
      <Footer />
    </div>
  );
}
