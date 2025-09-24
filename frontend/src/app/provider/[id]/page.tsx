'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Star, MapPin, Phone, Mail, Clock, ArrowLeft, Calendar } from 'lucide-react';
import Link from 'next/link';

interface Provider {
  id: string;
  businessName: string;
  description?: string;
  logo?: string;
  averageRating?: number;
  totalReviews?: number;
  address?: string;
  phone?: string;
  email?: string;
  services: Service[];
  workingHours?: {
    [key: string]: {
      start: string;
      end: string;
      isOpen: boolean;
    }
  };
}

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  category: string;
}

export default function ProviderProfilePage() {
  const params = useParams();
  const router = useRouter();
  const providerId = params?.id as string;
  
  const [provider, setProvider] = useState<Provider | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (providerId) {
      fetchProviderDetails();
    }
  }, [providerId]);

  const fetchProviderDetails = async () => {
    try {
      setLoading(true);
      
      // Mock provider data for now
      const mockProvider: Provider = {
        id: providerId,
        businessName: "Elite Hair Studio",
        description: "Professional hair styling and beauty services with over 10 years of experience. We specialize in modern cuts, coloring, and treatments using premium products.",
        logo: "/provider1.jpg",
        averageRating: 4.8,
        totalReviews: 127,
        address: "123 Beauty Street, City Center, NY 10001",
        phone: "+1 (555) 123-4567",
        email: "info@elitehairstudio.com",
        services: [
          {
            id: "1",
            name: "Hair Cut & Style",
            description: "Professional haircut and styling service",
            price: 85,
            duration: 60,
            category: "Haircut"
          },
          {
            id: "2", 
            name: "Hair Coloring",
            description: "Full hair coloring service with consultation",
            price: 150,
            duration: 120,
            category: "Coloring"
          },
          {
            id: "3",
            name: "Hair Treatment",
            description: "Deep conditioning and repair treatment",
            price: 65,
            duration: 45,
            category: "Treatment"
          }
        ],
        workingHours: {
          monday: { start: "09:00", end: "18:00", isOpen: true },
          tuesday: { start: "09:00", end: "18:00", isOpen: true },
          wednesday: { start: "09:00", end: "18:00", isOpen: true },
          thursday: { start: "09:00", end: "20:00", isOpen: true },
          friday: { start: "09:00", end: "20:00", isOpen: true },
          saturday: { start: "08:00", end: "17:00", isOpen: true },
          sunday: { start: "00:00", end: "00:00", isOpen: false }
        }
      };

      setProvider(mockProvider);
    } catch (error: any) {
      console.error('Error fetching provider details:', error);
      setError('Failed to load provider details');
    } finally {
      setLoading(false);
    }
  };

  const handleBookService = (serviceId: string) => {
    router.push(`/book-service/${serviceId}?providerId=${providerId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !provider) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {error || 'Provider not found'}
          </h1>
          <p className="text-gray-600 mb-4">
            {error || "The provider you're looking for doesn't exist."}
          </p>
          <Link href="/browse" className="text-blue-600 hover:text-blue-700">
            Browse other providers
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={() => router.back()}
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Provider Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Profile */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start space-x-6">
                <div className="w-24 h-24 bg-gray-200 rounded-full overflow-hidden flex-shrink-0">
                  {provider.logo ? (
                    <img
                      src={provider.logo}
                      alt={provider.businessName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                      <span className="text-gray-600 text-2xl font-medium">
                        {provider.businessName.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{provider.businessName}</h1>
                  {provider.averageRating && (
                    <div className="flex items-center space-x-1 mb-4">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-5 w-5 ${
                              star <= Math.floor(provider.averageRating!)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-lg font-medium text-gray-900">{provider.averageRating.toFixed(1)}</span>
                      <span className="text-gray-600">({provider.totalReviews} reviews)</span>
                    </div>
                  )}
                  {provider.description && (
                    <p className="text-gray-600 mb-4">{provider.description}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
              <div className="space-y-3">
                {provider.address && (
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-5 w-5 mr-3 flex-shrink-0" />
                    <span>{provider.address}</span>
                  </div>
                )}
                {provider.phone && (
                  <div className="flex items-center text-gray-600">
                    <Phone className="h-5 w-5 mr-3 flex-shrink-0" />
                    <a href={`tel:${provider.phone}`} className="hover:text-blue-600">
                      {provider.phone}
                    </a>
                  </div>
                )}
                {provider.email && (
                  <div className="flex items-center text-gray-600">
                    <Mail className="h-5 w-5 mr-3 flex-shrink-0" />
                    <a href={`mailto:${provider.email}`} className="hover:text-blue-600">
                      {provider.email}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Services */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Services</h2>
              <div className="space-y-4">
                {provider.services.map((service) => (
                  <div key={service.id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{service.name}</h3>
                      <span className="text-lg font-bold text-green-600">${service.price}</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{service.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        {service.duration} minutes
                      </div>
                      <button
                        onClick={() => handleBookService(service.id)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Working Hours */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Working Hours
              </h3>
              <div className="space-y-2">
                {provider.workingHours && Object.entries(provider.workingHours).map(([day, hours]) => (
                  <div key={day} className="flex justify-between text-sm">
                    <span className="capitalize font-medium text-gray-700">{day}</span>
                    <span className="text-gray-600">
                      {hours.isOpen ? `${hours.start} - ${hours.end}` : 'Closed'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => router.push(`/book-service?providerId=${provider.id}`)}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Book Appointment
                </button>
                <button className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                  View Reviews
                </button>
                <button 
                  onClick={() => router.push(`/customer/messages?providerId=${provider.id}`)}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  💬 Message Provider
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}