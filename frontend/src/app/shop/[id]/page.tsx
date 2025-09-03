'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useWishlist } from '@/components/WishlistContext';
import { useCart } from '@/components/cartContext';
import Image from 'next/image';
import { CloudinaryImage } from '@/components/CloudinaryImage';
import { 
  Heart as HeartIconOutline, 
  Star as StarIcon, 
  MapPin as MapPinIcon, 
  Clock as ClockIcon, 
  Phone as PhoneIcon,
  MessageCircle as ChatBubbleLeftRightIcon,
  Share as ShareIcon,
  BadgeCheck as CheckBadgeIcon,
  Tag as TagIcon,
  Calendar as CalendarDaysIcon,
  Camera as PhotoIcon,
  Globe as GlobeAltIcon,
  Users as UserGroupIcon,
  Trophy as TrophyIcon,
  ShieldCheck as ShieldCheckIcon
} from 'lucide-react';
import { Heart as HeartIconSolid } from 'lucide-react';
import * as Toast from '@radix-ui/react-toast';

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  category: string;
  isPopular?: boolean;
  discount?: number;
  image?: string;
  images?: string[];
  imagesPublicIds?: string[];
}

interface Provider {
  id: string;
  businessName: string;
  description?: string;
  city?: string;
  logo?: string;
  logoPublicId?: string;
  coverImagePublicId?: string;
  averageRating?: number;
  totalReviews?: number;
  address?: string;
  price?: number;
  images?: string[];
  phone?: string;
  coverImage?: string;
  isVerified?: boolean;
  experience?: string;
  specialties?: string[];
  workingHours?: {
    open: string;
    close: string;
  };
  socialProof?: {
    completedBookings: number;
    repeatClients: number;
    responseTime: string;
  };
}

// Helper function to get service image with fallbacks
const getServiceImage = (service: Service): string => {
  console.log('Getting image for service:', service.name, service);
  
  // First try: service.image (if exists)
  if (service.image) {
    console.log('Using service.image:', service.image);
    return service.image;
  }
  
  // Second try: first image from images array (these are already Cloudinary URLs)
  if (service.images && service.images.length > 0) {
    const cloudinaryUrl = `https://res.cloudinary.com/djgdfq23e/image/upload/${service.images[0]}`;
    console.log('Using images[0]:', cloudinaryUrl);
    return cloudinaryUrl;
  }
  
  // Third try: first public ID from imagesPublicIds array
  if (service.imagesPublicIds && service.imagesPublicIds.length > 0) {
    const cloudinaryUrl = `https://res.cloudinary.com/djgdfq23e/image/upload/${service.imagesPublicIds[0]}`;
    console.log('Using imagesPublicIds[0]:', cloudinaryUrl);
    return cloudinaryUrl;
  }
  
  // Fallback: category-specific images
  const categoryName = typeof service.category === 'object' && service.category?.name 
    ? service.category.name.toLowerCase() 
    : typeof service.category === 'string' 
    ? service.category.toLowerCase() 
    : 'general';
    
  let fallbackImage = '/provider1.jpg'; // default fallback
  
  if (categoryName.includes('beauty') || categoryName.includes('hair') || categoryName.includes('spa')) {
    fallbackImage = '/provider1.jpg';
  } else if (categoryName.includes('fitness') || categoryName.includes('health')) {
    fallbackImage = '/provider2.jpg';
  } else if (categoryName.includes('home') || categoryName.includes('repair')) {
    fallbackImage = '/provider3.jpg';
  } else if (categoryName.includes('food') || categoryName.includes('catering')) {
    fallbackImage = '/provider4.jpg';
  }
  
  console.log('Using fallback image:', fallbackImage);
  return fallbackImage;
};

export default function ShopDetailPage() {
  const { id } = useParams();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [shop, setShop] = useState<Provider | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('services');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [open, setOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    
    // Fetch real data and fallback to dummy
    Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/providers/${id}`).then(res => res.json()).catch(() => null),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/services/provider/${id}`).then(res => res.json()).catch(() => null)
    ])
      .then(([shopData, servicesData]) => {
        // Set shop data with enhanced dummy data
        const realShop = shopData?.data || shopData;
        
        // Safely process specialties to ensure they're strings
        let processedSpecialties = ["Bridal Makeup", "Hair Styling", "Skincare", "Nail Art"];
        if (realShop?.specialties) {
          if (Array.isArray(realShop.specialties)) {
            processedSpecialties = realShop.specialties.map((item: any) => {
              if (typeof item === 'string') return item;
              if (item?.name) return item.name;
              if (item?.title) return item.title;
              return String(item);
            });
          }
        }
        
        setShop({
          id: id as string,
          businessName: realShop?.businessName || "Beauty Studio Elite",
          description: realShop?.description || "Transforming beauty with expert care and premium services. Over 8 years of experience in creating stunning looks for special occasions and everyday elegance.",
          logo: realShop?.logo || "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&w=400&h=400&facepad=2",
          coverImage: realShop?.coverImage || "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=facearea&w=400&h=400&facepad=2",
          averageRating: realShop?.averageRating || 4.9,
          totalReviews: realShop?.totalReviews || 342,
          address: realShop?.address || realShop?.city || "Downtown, New York",
          phone: realShop?.phone || "+1 (555) 123-4567",
          isVerified: realShop?.isVerified ?? true,
          experience: realShop?.experience || "8+ years",
          specialties: processedSpecialties,
          workingHours: realShop?.workingHours || {
            open: "9:00 AM",
            close: "7:00 PM"
          },
          socialProof: realShop?.socialProof || {
            completedBookings: 1250,
            repeatClients: 85,
            responseTime: "< 2 hours"
          },
          images: realShop?.images || ["/provider1.jpg", "/provider3.jpg", "/provider4.jpg", "/blog1.jpg"]
        });

        // Set services data with enhanced dummy data
        let realServices = Array.isArray(servicesData?.data) ? servicesData.data : Array.isArray(servicesData) ? servicesData : [];
        console.log('Raw services data from API:', servicesData);
        console.log('Processed real services:', realServices);
        if (realServices.length === 0) {
          realServices = [
            {
              id: '1',
              name: 'Bridal Makeup Package',
              description: 'Complete bridal transformation including trial, wedding day makeup, and touch-up kit',
              price: 299,
              duration: 180,
              category: 'makeup',
              isPopular: true,
              discount: 20,
              image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&w=400&h=400&facepad=2'
            },
            {
              id: '2',
              name: 'Hair Styling & Blowout',
              description: 'Professional hair styling with premium products for any occasion',
              price: 89,
              duration: 90,
              category: 'hair',
              image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=facearea&w=400&h=400&facepad=2'
            },
            {
              id: '3',
              name: 'Deep Cleansing Facial',
              description: 'Rejuvenating facial treatment with extraction and hydrating mask',
              price: 129,
              duration: 75,
              category: 'skincare',
              isPopular: true,
              image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=facearea&w=400&h=400&facepad=2'
            },
            {
              id: '4',
              name: 'Luxury Manicure & Pedicure',
              description: 'Complete nail care with gel polish and nail art options',
              price: 79,
              duration: 120,
              category: 'nails',
              image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=facearea&w=400&h=400&facepad=2'
            },
            {
              id: '5',
              name: 'Evening Glam Package',
              description: 'Makeup and hair styling perfect for special events and parties',
              price: 159,
              duration: 120,
              category: 'makeup',
              image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&w=400&h=400&facepad=2'
            },
            {
              id: '6',
              name: 'Anti-Aging Treatment',
              description: 'Advanced skincare treatment to reduce fine lines and improve skin texture',
              price: 199,
              duration: 90,
              category: 'skincare',
              image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=facearea&w=400&h=400&facepad=2'
            }
          ];
        }
        setServices(realServices);
        console.log('Services loaded:', realServices);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (mounted && shop) {
      setIsWishlisted(wishlist.some(item => item.id === shop.id));
    }
  }, [wishlist, shop, mounted]);

  if (loading || !mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Shop not found</h1>
          <p className="text-gray-600">The shop you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const canWriteReview = (booking: Booking) => {
    return booking.status === 'completed' && !booking.hasReview;
  };

  const getServiceCategoryString = (category: any): string => {
    if (typeof category === 'string') return category;
    if (category?.name) return category.name.toLowerCase();
    if (category?.slug) return category.slug;
    return 'other';
  };

  const categories = [
    { id: 'all', name: 'All Services', count: services.length },
    { id: 'makeup', name: 'Makeup', count: services.filter(s => getServiceCategoryString(s.category) === 'makeup').length },
    { id: 'hair', name: 'Hair', count: services.filter(s => getServiceCategoryString(s.category) === 'hair').length },
    { id: 'skincare', name: 'Skincare', count: services.filter(s => getServiceCategoryString(s.category) === 'skincare').length },
    { id: 'nails', name: 'Nails', count: services.filter(s => getServiceCategoryString(s.category) === 'nails').length }
  ];

  const filteredServices = selectedCategory === 'all' 
    ? services 
    : services.filter(service => getServiceCategoryString(service.category) === selectedCategory);

  const handleWishlistToggle = () => {
    if (isWishlisted) {
      removeFromWishlist(shop.id);
    } else {
      addToWishlist({
        id: shop.id,
        name: shop.businessName,
        description: shop.description,
        image: shop.logo || ''
      });
    }
  };

  const handleAddToCart = (service: Service) => {
    const finalPrice = service.discount ? service.price * (1 - service.discount / 100) : service.price;
    addToCart({
      id: service.id,
      name: service.name,
      provider: shop.businessName,
      price: finalPrice,
      imageUrl: getServiceImage(service),
      quantity: 1
    });
    setToastMsg(`${service.name} added to cart!`);
    setOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Cover Image */}
      <div className="relative h-80 lg:h-96 overflow-hidden">
        <div className="relative w-full h-full">
          {shop.coverImagePublicId ? (
            <CloudinaryImage
              publicId={shop.coverImagePublicId}
              alt={`${shop.businessName} cover`}
              width={1200}
              height={400}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <img
              src={shop.coverImage || shop.logo || 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=facearea&w=400&h=400&facepad=2'}
              alt={shop.businessName}
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&w=400&h=400&facepad=2';
              }}
            />
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        
        {/* Action Buttons */}
        <div className="absolute top-6 right-6 flex space-x-3">
          <button 
            onClick={handleWishlistToggle}
            className="p-3 rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white transition-all duration-200 group"
            disabled={!mounted}
          >
            {mounted && isWishlisted ? (
              <HeartIconSolid className="h-6 w-6 text-red-500" />
            ) : (
              <HeartIconOutline className="h-6 w-6 text-gray-700 group-hover:text-red-500 transition-colors" />
            )}
          </button>
          <button className="p-3 rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white transition-all duration-200">
            <ShareIcon className="h-6 w-6 text-gray-700" />
          </button>
        </div>

        {/* Provider Info Overlay */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex items-end space-x-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl border-4 border-white shadow-lg overflow-hidden bg-white">
                {shop.logoPublicId ? (
                  <CloudinaryImage
                    publicId={shop.logoPublicId}
                    alt={`${shop.businessName} logo`}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={shop.logo || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&w=400&h=400&facepad=2'}
                    alt={shop.businessName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&w=400&h=400&facepad=2';
                    }}
                  />
                )}
              </div>
              {shop.isVerified && (
                <div className="absolute -top-2 -right-2 bg-blue-500 rounded-full p-1">
                  <CheckBadgeIcon className="h-5 w-5 text-white" />
                </div>
              )}
            </div>
            <div className="flex-1 text-white">
              <h1 className="text-3xl font-bold mb-2">{shop.businessName}</h1>
              <div className="flex items-center space-x-4 text-white/90">
                <div className="flex items-center">
                  <StarIcon className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="ml-1 font-semibold">{shop.averageRating}</span>
                  <span className="ml-1">({shop.totalReviews} reviews)</span>
                </div>
                <div className="flex items-center">
                  <MapPinIcon className="h-5 w-5" />
                  <span className="ml-1">{shop.address}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Navigation Tabs */}
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-8">
                  {[
                    { id: 'services', name: 'Services', icon: TagIcon },
                    { id: 'about', name: 'About', icon: ChatBubbleLeftRightIcon },
                    { id: 'gallery', name: 'Gallery', icon: PhotoIcon }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center py-6 px-2 border-b-2 font-medium text-sm transition-all duration-300 ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600 transform scale-105'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <tab.icon className="h-5 w-5 mr-2" />
                      {tab.name}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-8">
                {activeTab === 'services' && (
                  <div className="space-y-8">
                    {/* Category Filter */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">Filter by Category</h3>
                      <div className="flex flex-wrap gap-3">
                        {categories.map((category) => (
                          <button
                            key={category.id}
                            onClick={() => setSelectedCategory(category.id)}
                            className={`px-6 py-3 rounded-2xl text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                              selectedCategory === category.id
                                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
                            }`}
                          >
                            {category.name} ({category.count})
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Services Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {filteredServices.map((service) => (
                        <div key={service.id} className="group relative bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 transform perspective-1000">
                          {/* Badge Container */}
                          <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
                            {service.isPopular && (
                              <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm bg-opacity-90">
                                ⭐ Most Popular
                              </div>
                            )}
                            {service.discount && (
                              <div className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm bg-opacity-90 ml-auto">
                                🏷️ {service.discount}% OFF
                              </div>
                            )}
                          </div>

                          {/* Service Image */}
                          <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50">
                            <img
                              src={getServiceImage(service)}
                              alt={service.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/provider1.jpg';
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                          </div>
                          
                          {/* Content */}
                          <div className="p-6 space-y-4">
                            {/* Header */}
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">
                                  {service.name}
                                </h3>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  {typeof service.category === 'string' ? service.category : service.category?.name || 'Service'}
                                </span>
                              </div>
                              <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                                {service.description || 'Professional service with expert care and attention to detail.'}
                              </p>
                            </div>
                            
                            {/* Service Details */}
                            <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-xl">
                              <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <div className="flex items-center space-x-1">
                                  <ClockIcon className="h-4 w-4 text-blue-500" />
                                  <span className="font-medium">{service.duration || service.durationMinutes || 60} mins</span>
                                </div>
                                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                                <div className="flex items-center space-x-1">
                                  <StarIcon className="h-4 w-4 text-yellow-500 fill-current" />
                                  <span className="font-medium">4.9</span>
                                </div>
                              </div>
                            </div>
                            
                            {/* Price and Action */}
                            <div className="flex items-center justify-between pt-2">
                              <div className="space-y-1">
                                {service.discount ? (
                                  <div className="flex items-center space-x-2">
                                    <span className="text-2xl font-bold text-emerald-600">
                                      €{((service.price || parseFloat(service.basePrice || '0')) * (1 - service.discount / 100)).toFixed(0)}
                                    </span>
                                    <span className="text-lg text-gray-400 line-through">
                                      €{service.price || service.basePrice || 0}
                                    </span>
                                  </div>
                                ) : (
                                  <span className="text-2xl font-bold text-gray-900">
                                    €{service.price || service.basePrice || 0}
                                  </span>
                                )}
                                <p className="text-xs text-gray-500">Starting price</p>
                              </div>
                              
                              <button
                                onClick={() => handleAddToCart(service)}
                                className="group relative bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-2xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl active:scale-95 overflow-hidden"
                              >
                                <span className="relative z-10 flex items-center space-x-2">
                                  <span>Book Now</span>
                                  <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                  </svg>
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'about' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">About {shop.businessName}</h3>
                      <p className="text-gray-600 leading-relaxed">{shop.description}</p>
                    </div>
                    
                    {shop.specialties && shop.specialties.length > 0 && (
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-3">Specialties</h4>
                        <div className="flex flex-wrap gap-2">
                          {shop.specialties.map((specialty, index) => (
                            <span
                              key={index}
                              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                            >
                              {typeof specialty === 'string' ? specialty : specialty?.name || specialty?.toString() || 'Specialty'}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl text-center">
                        <TrophyIcon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                        <div className="font-bold text-blue-900">{shop.experience}</div>
                        <div className="text-sm text-blue-700">Experience</div>
                      </div>
                      <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl text-center">
                        <UserGroupIcon className="h-8 w-8 text-green-600 mx-auto mb-2" />
                        <div className="font-bold text-green-900">{shop.socialProof?.completedBookings}+</div>
                        <div className="text-sm text-green-700">Happy Clients</div>
                      </div>
                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl text-center">
                        <ShieldCheckIcon className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                        <div className="font-bold text-purple-900">{shop.socialProof?.repeatClients}%</div>
                        <div className="text-sm text-purple-700">Repeat Rate</div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'gallery' && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {(shop.images || ['/provider1.jpg', '/provider3.jpg', '/provider4.jpg', '/blog1.jpg']).map((image, index) => (
                      <div key={index} className="aspect-square rounded-xl overflow-hidden bg-gray-200">
                        <img
                          src={image}
                          alt={`Gallery ${index + 1}`}
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/provider1.jpg';
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Contact Card */}
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Get in Touch</h3>
                <p className="text-gray-600 text-sm">Ready to book your appointment?</p>
              </div>
              
              <div className="space-y-5 mb-6">
                <div className="flex items-center p-3 bg-gray-50 rounded-xl">
                  <div className="bg-blue-100 p-2 rounded-lg mr-3">
                    <PhoneIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Phone</p>
                    <p className="text-gray-900 font-medium">{shop.phone}</p>
                  </div>
                </div>
                
                <div className="flex items-center p-3 bg-gray-50 rounded-xl">
                  <div className="bg-green-100 p-2 rounded-lg mr-3">
                    <MapPinIcon className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Location</p>
                    <p className="text-gray-900 font-medium">{shop.address}</p>
                  </div>
                </div>
                
                <div className="flex items-center p-3 bg-gray-50 rounded-xl">
                  <div className="bg-purple-100 p-2 rounded-lg mr-3">
                    <ClockIcon className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Hours</p>
                    <p className="text-gray-900 font-medium">
                      {shop.workingHours?.open} - {shop.workingHours?.close}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-2xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                  <CalendarDaysIcon className="h-5 w-5 inline mr-2" />
                  Schedule Consultation
                </button>
                <button className="w-full border border-gray-200 text-gray-700 py-4 rounded-2xl font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all duration-300">
                  <ChatBubbleLeftRightIcon className="h-5 w-5 inline mr-2" />
                  Send Message
                </button>
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl shadow-lg border border-gray-100 p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Professional Stats</h3>
              <div className="space-y-5">
                <div className="flex justify-between items-center p-4 bg-white rounded-xl shadow-sm">
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-2 rounded-lg mr-3">
                      <TrophyIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <span className="text-gray-600 font-medium">Experience</span>
                  </div>
                  <span className="font-bold text-gray-900 text-lg">{shop.experience}</span>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-white rounded-xl shadow-sm">
                  <div className="flex items-center">
                    <div className="bg-green-100 p-2 rounded-lg mr-3">
                      <UserGroupIcon className="h-5 w-5 text-green-600" />
                    </div>
                    <span className="text-gray-600 font-medium">Happy Clients</span>
                  </div>
                  <span className="font-bold text-gray-900 text-lg">{shop.socialProof?.completedBookings}+</span>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-white rounded-xl shadow-sm">
                  <div className="flex items-center">
                    <div className="bg-purple-100 p-2 rounded-lg mr-3">
                      <ShieldCheckIcon className="h-5 w-5 text-purple-600" />
                    </div>
                    <span className="text-gray-600 font-medium">Repeat Rate</span>
                  </div>
                  <span className="font-bold text-gray-900 text-lg">{shop.socialProof?.repeatClients}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Response Time</span>
                  <span className="font-semibold text-gray-900">{shop.socialProof?.responseTime}</span>
                </div>
              </div>
            </div>

            {/* Reviews Preview */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Reviews</h3>
                <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                  View All
                </button>
              </div>
              
              <div className="space-y-4">
                {[1, 2].map((review) => (
                  <div key={review} className="border-b border-gray-100 pb-4 last:border-b-0">
                    <div className="flex items-center mb-2">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon key={i} className="h-4 w-4 fill-current" />
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-gray-600">Sarah M.</span>
                    </div>
                    <p className="text-sm text-gray-700">
                      "Amazing service! Professional and talented. Highly recommend."
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      <Toast.Provider swipeDirection="right">
        <Toast.Root 
          open={open} 
          onOpenChange={setOpen} 
          className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-[9999] font-semibold text-lg flex items-center gap-2"
        >
          <CheckBadgeIcon className="h-5 w-5" />
          {toastMsg}
        </Toast.Root>
        <Toast.Viewport className="fixed bottom-0 left-0 right-0 flex flex-col items-center z-[9999]" />
      </Toast.Provider>
    </div>
  );
}
