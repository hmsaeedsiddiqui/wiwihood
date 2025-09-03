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
    return <div style={{ padding: 40, textAlign: "center" }}>Loading...</div>;
  }
  if (!service) {
    return <div style={{ padding: 40, textAlign: "center" }}>Service not found.</div>;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <section style={{ padding: "40px 0 20px 0", background: "#f8fafc", flex: 1 }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
          <Card style={{ borderRadius: 16, overflow: "hidden", background: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
            <div style={{ position: "relative", overflow: "hidden" }}>
              <div style={{ height: 260, background: "#e0e7ef", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {service.images && service.images.length > 0 ? (
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 16,
                      justifyContent: service.images.length === 1 ? 'center' : 'flex-start',
                      alignItems: 'center',
                      height: '100%',
                      width: '100%'
                    }}
                  >
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
                          style={{
                            width,
                            height: '220px',
                            objectFit: 'cover',
                            borderRadius: 12,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                            background: '#fff',
                            display: 'block'
                          }}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <div style={{ fontSize: 64, fontWeight: 700, color: "#60a5fa" }}>{service.name.charAt(0)}</div>
                )}
              </div>
            </div>
            <CardHeader style={{ paddingBottom: 8 }}>
              <CardTitle style={{ fontSize: 28, fontWeight: 700, color: "#222", marginBottom: 4 }}>{service.name}</CardTitle>
            </CardHeader>
            <CardContent style={{ paddingTop: 0 }}>
              <div style={{ color: "#6b7280", fontSize: 17, marginBottom: 18 }}>{service.description}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
                <Star size={18} color="#fbbf24" fill="#fbbf24" />
                <span style={{ fontSize: 16, fontWeight: 600 }}>{service.provider.averageRating}</span>
                <span style={{ fontSize: 15, color: "#6b7280" }}>({service.provider.totalReviews} reviews)</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <Clock size={16} color="#6b7280" />
                <span style={{ fontSize: 15 }}>{service.duration} min</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <MapPin size={16} color="#6b7280" />
                <span style={{ fontSize: 15 }}>{service.provider.businessAddress}</span>
              </div>
              <div style={{ color: "#6b7280", fontSize: 15, marginBottom: 10 }}>
                Provided by <span style={{ fontWeight: 600 }}>{service.provider.businessName}</span>
              </div>
              <div style={{ color: "#6b7280", fontSize: 15, marginBottom: 10 }}>
                <b>Shop Location:</b> {service.provider.businessAddress}
              </div>
              <div style={{ color: "#6b7280", fontSize: 15, marginBottom: 10 }}>
                {/* City removed: not present on provider type */}
              </div>
              <button
                style={{
                  background: "#10b981",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "12px 32px",
                  fontWeight: 700,
                  fontSize: 18,
                  marginTop: 18,
                  cursor: "pointer"
                }}
                onClick={() => {
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
                  router.push('/404');
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
