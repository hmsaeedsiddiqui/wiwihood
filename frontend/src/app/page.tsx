"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Footer from "../components/Footer";
import Link from 'next/link';
import { apiService, Category } from '@/lib/api';
import { 
  Search, 
  Calendar, 
  Star, 
  Clock, 
  Users, 
  CheckCircle,
  ArrowRight,
  Scissors,
  Wrench,
  Heart,
  Briefcase,
  Home,
  Car,
  ChevronLeft,
  ChevronRight,
  User,
  MapPin,
  ChevronDown,
  Shield
} from 'lucide-react';

// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react';

import { Navigation, Pagination } from 'swiper/modules';



// Swiper CSS imports
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '../styles/swiper-custom.css';


const testimonials = [
  {
    quote: "A real sense of community, nurtured.",
    detail: "Really appreciate the help and support from the staff during my trips. Very helpful and always available when needed.",
  },
  {
    quote: "Exceptional service every time.",
    detail: "The team goes above and beyond. I always feel welcomed and valued.",
  },
  {
    quote: "Feels like home.",
    detail: "Warm atmosphere and professional care. I wouldn’t go anywhere else.",
  },
  {
    quote: "Highly recommended!",
    detail: "They truly understand customer needs and deliver with excellence.",
  },
];  

const HomePage = () => {
  const router = useRouter(); 
  const servicesSwiper = useRef<any>(null);
  // Testimonials now handled by Swiper
  
  useEffect(() => {
    fetchServiceCards();
  }, []);

  // Fetch dynamic service cards from API
  const fetchServiceCards = async () => {
    try {
  // Fetch services (limit 3, no unsupported params)
  const response = await apiService.getServices();
  const services = Array.isArray(response) ? response.slice(0, 3) : (response.data || []).slice(0, 3);
      // Map API data to ServiceCard model
      const cards = services.map((service: any) => ({
        id: service.id,
        name: service.name,
        description: service.description,
        providerName: service.provider?.businessName || '',
        providerId: service.provider?.id || '',
        providerAvatar: service.provider?.logoPublicId || '',
        discount: service.discount || 0,
        price: service.basePrice,
        oldPrice: service.oldPrice || service.basePrice,
        rating: service.averageRating || 5,
        reviews: service.totalReviews || 0,
        imageUrl:
          service.images && service.images.length > 0 && service.images[0]
            ? (service.images[0].startsWith('http')
                ? service.images[0]
                : `https://res.cloudinary.com/djgdfq23e/image/upload/${service.images[0]}`)
          : service.imageUrl && service.imageUrl.startsWith('http')
            ? service.imageUrl
          : service.imageUrl && service.imageUrl.length > 0
            ? `https://res.cloudinary.com/djgdfq23e/image/upload/${service.imageUrl}`
          : 'https://via.placeholder.com/640x480',
        slots: service.availableSlots || 0,
        isTopRated: service.isTopRated || false,
      }));
      setServiceCards(cards);
    } catch (error) {
      setServiceCards([]);
    }
  };
  const [dbCategories, setDbCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const categories = await apiService.getCategories(true); // Fetch active categories
      setDbCategories(categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setDbCategories([]); // Clear categories on error
    } finally {
      setLoadingCategories(false);
    }
  };

  // Service card data model
  type ServiceCard = {
    id: string;
    name: string;
    description: string;
    providerName: string;
    providerId: string;
    providerAvatar?: string;
    discount: number;
    price: number;
    oldPrice: number;
    rating: number;
    reviews: number;
    imageUrl: string;
    slots: number;
    isTopRated?: boolean;
  };

  // Dynamic service cards state
  const [serviceCards, setServiceCards] = useState<ServiceCard[]>([]);

  const features = [
    {
      icon: Search,
      title: 'Find Services',
      description: 'Browse trusted professionals in your area'
    },
    {
      icon: Calendar,
      title: 'Book Online',
      description: 'Schedule appointments with ease'
    },
    {
      icon: Shield,
      title: 'Secure Payments',
      description: 'Safe and protected transactions'
    }
  ];

  const mockServices = [
    {
      category: 'Haircuts',
      image: 'https://images.pexels.com/photos/3993427/pexels-photo-3993427.jpeg?auto=compress&cs=tinysrgb&w=640&h=480&dpr=2',
    },
    {
      category: 'Massages',
      image: 'https://images.pexels.com/photos/3757942/pexels-photo-3757942.jpeg?auto=compress&cs=tinysrgb&w=640&h=480&dpr=2',
    },
    {
      category: 'Facials',
      image: 'https://images.pexels.com/photos/3993427/pexels-photo-3993427.jpeg?auto=compress&cs=tinysrgb&w=640&h=480&dpr=2',
    },
    {
      category: 'Manicure & Pedicure',
      image: 'https://images.pexels.com/photos/3997993/pexels-photo-3997993.jpeg?auto=compress&cs=tinysrgb&w=640&h=480&dpr=2',
    },
    {
      category: 'Yoga Classes',
      image: 'https://images.pexels.com/photos/3822621/pexels-photo-3822621.jpeg?auto=compress&cs=tinysrgb&w=640&h=480&dpr=2',
    },
    {
      category: 'Personal Training',
      image: 'https://images.pexels.com/photos/3757942/pexels-photo-3757942.jpeg?auto=compress&cs=tinysrgb&w=640&h=480&dpr=2',
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* HERO SECTION - FIXED TAILWIND CLASSES */}
      <section 
        className="w-full min-h-[600px] relative flex items-start justify-center  overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(34, 40, 49, 0.45), rgba(34, 40, 49, 0.45)), url('https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=1500&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Remove blue overlay - it was causing conflicts */}
        
        {/* Diagonal White Cut - Fixed with inline style */}
        <div 
          className="absolute left-0 bottom-0 w-full h-32 bg-white z-20"
          style={{
            transform: 'skewY(-4deg)',
            transformOrigin: 'bottom right'
          }}
        />

        <div className="relative z-30 max-w-[1400px] mx-auto w-[95%] py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[500px]">
            
            {/* LEFT: HERO TEXT & SEARCH */}
            <div className="space-y-8">
              <h1 className="text-white text-4xl lg:text-5xl font-extrabold leading-none mb-4">
                Find{' '}
                <span className="inline-block italic rounded-xl font-bold text-3xl lg:text-4xl bg-emerald-500 text-white px-4 py-1 mx-1 border-2  border-white">
                  Trusted Providers
                </span>{' '}
                &<br />
                <span className="inline-block rounded-xl italic font-bold text-3xl lg:text-4xl bg-emerald-500 text-white  px-4 py-1 mx-1 border-2 border-white">
                  Book Services
                </span>{' '}
                at the<br />
                Best Prices
              </h1>
              
              <p className="text-white text-md font-medium pb-5">
                Search for top-rated beauty, wellness, and healthcare providers near you.
              </p>
              
              {/* SEARCH BAR - Fixed Tailwind classes */}
              <div className="w-full max-w-2xl mb-4">
                <div className="flex flex-col sm:flex-row gap-2 rounded-xl bg-white shadow-2xl p-2">
                  <div className="flex-1 flex items-center gap-3 bg-gray-100 rounded-lg px-4 py-3">
                    <i className="fa fa-search text-emerald-500 text-lg"></i>
                    <input 
                      type="text" 
                      placeholder="Search..." 
                      className="w-full bg-transparent border-0 outline-none text-base text-gray-700" 
                    />
                  </div>
                  <div className="flex-1 flex items-center gap-3 bg-gray-100 rounded-lg px-4 py-3">
                    <i className="fa fa-map-marker-alt text-emerald-500 text-lg"></i>
                    <select className="w-full bg-transparent border-0 outline-none text-base text-gray-700">
                      <option>Select Location...</option>
                      <option value="lahore">Lahore</option>
                      <option value="karachi">Karachi</option>
                      <option value="islamabad">Islamabad</option>
                    </select>
                  </div>
                  <button className="bg-emerald-500 rounded-xl hover:bg-emerald-600 text-white font-bold text-lg border-0  px-8 py-3 cursor-pointer transition-all duration-200 whitespace-nowrap transform hover:scale-105">
                    Find Providers
                  </button>
                </div>
              </div>
              
              <div className="text-white text-base font-medium drop-shadow-lg">
                Popular Searches: Haircuts, Massage, Facials.
              </div>
            </div>
            
            {/* RIGHT: VIDEO/IMAGE CARD */}
            <div className="flex justify-center lg:justify-center items-start pt-12">
              <div className="w-100 h-[450px]  bg-white rounded-3xl shadow-2xl overflow-hidden relative border-8 border-white transform hover:scale-105 transition-transform duration-300 block sm:hidden lg:block">
                <img
                  src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&w=640&h=800&q=80"
                  alt="Provider Video"
                  className="w-full h-full object-cover"
                />
                {/* Play button overlay */}
                <button className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full border-4 border-white flex items-center justify-center shadow-lg cursor-pointer z-10 transition-all duration-200 hover:scale-110">
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="14" cy="14" r="14" fill="#fff" />
                    <polygon points="11,9.5 20,14 11,18.5" fill="#10b981" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Browse Services Section - With Swiper Slider */}
      <section className="w-full pt-20 min-h-[540px] flex flex-col justify-center items-center relative">
        <div className="w-[95%] max-w-[1400px] mx-auto">
          <h2 className="text-center m-0 text-[2.2rem] font-extrabold font-[Manrope,sans-serif] tracking-[-0.5px] text-gray-800">
            Browse Services
          </h2>
          <p className="text-[15px] text-gray-500 my-2 mx-auto mb-11 text-center max-w-[600px] leading-[1.5]">
            Browse and book top-rated services from trusted providers near you. Compare options, read reviews, and find the perfect match for your beauty, wellness, and healthcare needs.
          </p>
          
          {/* Swiper Slider for Services */}
          <div className="relative w-full min-h-[320px] mt-0">
            <Swiper
              modules={[Navigation]}
              spaceBetween={24}
              slidesPerView={1}
              onSwiper={(swiper) => (servicesSwiper.current = swiper)}
              loop={true}
              breakpoints={{
                640: {
                  slidesPerView: 1,
                  spaceBetween: 20,
                },
                768: {
                  slidesPerView: 2,
                  spaceBetween: 20,
                },
                1024: {
                  slidesPerView: 3,
                  spaceBetween: 24,
                },
              }}
              className="services-cards-swiper pb-12"
            >
              {mockServices.map((service, index) => (
                <SwiperSlide key={`${service.category}-${index}`}>
                  <div 
                    className="w-full h-[170px] mx-auto rounded-[18px] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.13)] min-h-[260px] flex flex-col justify-end relative"
                    style={{
                      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.18), rgba(0, 0, 0, 0.28)), url('${service.image}')`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat'
                      }}
                    >
                    <div className="absolute top-0 left-0 w-full h-full z-[1]" />
                    <div className="relative z-[2] p-[22px] text-white w-full">
                      <h3 className="text-xl font-bold m-0 mb-2 font-[Manrope,sans-serif] tracking-[-0.5px]">
                        {service.category}
                      </h3>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[15px] mr-[2px]">🏆</span>
                        <span className="text-[13px] opacity-92 font-medium">
                          Top-Rated Professionals
                        </span>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Custom Navigation Buttons */}
            <div 
              onClick={() => servicesSwiper.current?.slidePrev()}
              className="services-nav-button services-nav-prev absolute left-[-20px] top-[110px] w-12 h-12 bg-white border border-gray-200 rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:shadow-xl transition-all duration-200 z-10"
            >
              <i className="fa-solid fa-chevron-left text-emerald-600 text-lg"></i>
            </div>
            <div 
              onClick={() => servicesSwiper.current?.slideNext()}
              className="services-nav-button services-nav-next absolute right-[-20px] top-[110px] w-12 h-12 bg-white border border-gray-200 rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:shadow-xl transition-all duration-200 z-10"
            >
              <i className="fa-solid fa-chevron-right text-emerald-600 text-lg"></i>
            </div>
          </div>
        </div>
      </section>






      {/* Become a Provider Section - 100% Design Match */}
  <section className="py-[90px] bg-white">
  <div className="max-w-[1400px] mx-auto w-[95%]">
    <div className="flex flex-col lg:flex-row items-stretch rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.10)] bg-[#e7f7ef] min-h-[440px] h-auto lg:h-[500px] relative overflow-visible">
      
      {/* Left Side - Images Container */}
      <div className="flex-1 flex flex-col items-center justify-center w-full lg:relative lg:flex lg:items-center lg:justify-center">
        
        {/* Main large image */}
        <div className="w-full h-[400px] lg:w-[480px] lg:h-full border-2 border-white overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.15)] bg-gray-200 z-[1] lg:absolute lg:top-0 lg:left-0">
          <img
            src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&w=640&h=800&q=80"
            alt="Professional Provider"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Play button - sirf large screen pe */}
        <div className="hidden lg:flex absolute top-[30%] left-[460px] w-12 h-12 bg-white rounded-full items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.15)] cursor-pointer z-[3] border-[3px] border-white">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <polygon points="8,6 16,10 8,14" fill="#10b981" />
          </svg>
        </div>

        {/* Smaller image */}
        <div className="w-full h-[300px] mt-6 rounded-xl overflow-hidden shadow-[0_6px_20px_rgba(0,0,0,0.15)] border-[4px] border-white bg-gray-200 z-[2] lg:w-[220px] lg:h-[280px] lg:absolute lg:right-[20px] lg:bottom-[-40px] lg:mt-0">
          <img
            src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=facearea&w=400&h=500&q=80"
            alt="Provider 2"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Right Side - Content */}
      <div className="flex-1 bg-[#e7f7ef] px-6 lg:px-11 py-10 lg:py-14 flex flex-col justify-center min-h-[440px] h-full w-full lg:w-1/2">
        <p className="text-[15px] text-emerald-600 font-semibold mb-[10px] font-[Manrope,sans-serif] tracking-[0.5px]">
          Become a Provider
        </p>
        <h2 className="text-[1.8rem] lg:text-[2.1rem] font-extrabold text-gray-800 leading-[1.2] mb-[14px] font-[Manrope,sans-serif]">
          List Your Services on Wiwihood
        </h2>
        <p className="text-base text-gray-600 leading-[1.5] mb-7 font-[Manrope,sans-serif] max-w-[420px]">
          Reach more clients, manage your appointments, and get paid securely.
        </p>

        {/* Features list */}
        <div className="mb-8">
          <div className="flex items-center mb-[13px]">
            <span className="w-[22px] h-[22px] bg-emerald-600 rounded-full flex items-center justify-center mr-3">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M3 6.5L5.5 9L9 4"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="text-[15px] text-gray-800 font-medium font-[Manrope,sans-serif]">
              Instant Booking & Availability Management
            </span>
          </div>

          <div className="flex items-center mb-[13px]">
            <span className="w-[22px] h-[22px] bg-emerald-600 rounded-full flex items-center justify-center mr-3">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M3 6.5L5.5 9L9 4"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="text-[15px] text-gray-800 font-medium font-[Manrope,sans-serif]">
              Secure Payments via Stripe
            </span>
          </div>

          <div className="flex items-center mb-[13px]">
            <span className="w-[22px] h-[22px] bg-emerald-600 rounded-full flex items-center justify-center mr-3">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M3 6.5L5.5 9L9 4"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="text-[15px] text-gray-800 font-medium font-[Manrope,sans-serif]">
              Reach New Clients Near You
            </span>
          </div>

          <div className="flex items-center mb-0">
            <span className="w-[22px] h-[22px] bg-emerald-600 rounded-full flex items-center justify-center mr-3">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M3 6.5L5.5 9L9 4"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="text-[15px] text-gray-800 font-medium font-[Manrope,sans-serif]">
              Top-Rated & Verified Professionals
            </span>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={() => router.push("/auth/provider/signup")}
          className="bg-emerald-600 text-white py-[13px] px-8 rounded-[7px] border-none text-base font-semibold cursor-pointer font-[Manrope,sans-serif] transition-all duration-200 self-start shadow-[0_2px_8px_rgba(16,185,129,0.13)] mt-2 hover:bg-emerald-700 hover:-translate-y-px"
        >
          Join Now as a Provider
        </button>
      </div>
    </div>
  </div>
</section>




      {/* How it's Work Section - 100% Design Match */}
      <section
        className="w-full py-20 pb-25 bg-gray-800"
        style={{
          backgroundImage: `linear-gradient(rgba(31, 41, 55, 0.55), rgba(31, 41, 55, 0.55)), url('https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=compress&w=1200&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
            >
        <div className="max-w-[1400px] w-[95%] mx-auto ">
          <h2 className="text-white font-[Manrope,sans-serif] font-extrabold text-[40px] text-center mb-4 tracking-tight">
            How it's Work?
          </h2>
          <p className="text-gray-300 font-[Manrope,sans-serif] font-normal text-base text-center mb-12 tracking-wide leading-relaxed max-w-[700px] mx-auto">
            It's simple to get started with Wiwihood. Just follow these easy steps to book your next service.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-center items-stretch ">
            {/* Card 1 */}
            <Link href="/signup" className="bg-white rounded-[18px] shadow-[0_8px_32px_rgba(0,0,0,0.10)] px-8 pt-10 pb-8  flex flex-col items-center text-center relative w-full no-underline text-inherit cursor-pointer">
              <div className="bg-emerald-100 rounded-xl w-14 h-14 flex items-center justify-center mb-6">
                <i className="fa-regular fa-id-card text-emerald-600 text-[28px]"></i>
              </div>
              <h3 className="font-[Manrope,sans-serif] font-bold text-[22px] text-gray-800 mb-3">
                Create Your Account
              </h3>
              <p className="font-[Manrope,sans-serif] font-normal text-[15px] text-gray-500 leading-relaxed m-0">
                Sign up for free and create your account to access personalized services and providers.
              </p>
            </Link>
            {/* Card 2 */}
            <Link href="/services" className="bg-white rounded-[18px] shadow-[0_8px_32px_rgba(0,0,0,0.10)] px-8 pt-10 pb-8  flex flex-col items-center text-center relative w-full no-underline text-inherit cursor-pointer">
              <div className="bg-emerald-100 rounded-xl w-14 h-14 flex items-center justify-center mb-6">
                <i className="fa-solid fa-scissors text-emerald-600 text-[28px]"></i>
              </div>
              <h3 className="font-[Manrope,sans-serif] font-bold text-[22px] text-gray-800 mb-3">
                Choose Your Service
              </h3>
              <p className="font-[Manrope,sans-serif] font-normal text-[15px] text-gray-500 leading-relaxed m-0">
                Search for services you need, compare providers, and select your preferred option.
              </p>
            </Link>
            {/* Card 3 */}
            <Link href="/book" className="bg-white rounded-[18px] shadow-[0_8px_32px_rgba(0,0,0,0.10)] px-8 pt-10 pb-8 flex flex-col items-center text-center relative w-full no-underline text-inherit cursor-pointer">
              <div className="bg-emerald-100 rounded-xl w-14 h-14 flex items-center justify-center mb-6">
                <i className="fa-regular fa-calendar-check text-emerald-600 text-[28px]"></i>
              </div>
              <h3 className="font-[Manrope,sans-serif] font-bold text-[22px] text-gray-800 mb-3">
                Book & Confirm
              </h3>
              <p className="font-[Manrope,sans-serif] font-normal text-[15px] text-gray-500 leading-relaxed m-0">
                Book your service, choose a time, and get an instant confirmation. Enjoy the service at your convenience.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Exclusive Prices Section - 100% Design Match */}
      <section className="w-full bg-slate-50 py-20 pb-15 m-0 box-border">
        <div className="w-[95%] max-w-[1400px] mx-auto ">
          <h2 className="text-gray-800 font-[Manrope] font-extrabold text-[38px] text-center mb-2 tracking-tight">
            Exclusive Prices
          </h2>
            <p className="text-gray-500 font-[Manrope,sans-serif] font-normal text-base text-center mb-9 leading-relaxed max-w-[600px] mx-auto tracking-[0.1px]">
            Browse popular services and enjoy exclusive discounts. Don’t miss out on these limited-time offers!
            </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 mb-10">
            {serviceCards.map((card) => (
              <div
                key={card.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col min-h-[410px] relative cursor-pointer"
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    // Navigate to the correct service detail page with the service ID
                    window.location.href = `/service/${card.id}`;
                  }
                }}
              >
                <div className="relative w-full h-45 overflow-hidden">
                  <Swiper
                    modules={[Pagination]}
                    spaceBetween={0}
                    slidesPerView={1}
                    pagination={{
                      clickable: true,
                      dynamicBullets: false,
                    }}
                    loop={true}
                    className="card-image-swiper h-full"
                  >
                    {/* Multiple images for demo - you can replace with actual service images */}
                    <SwiperSlide>
                      <img src={card.imageUrl} alt={`${card.name} - Image 1`} className="w-full h-full object-cover" />
                    </SwiperSlide>
                    <SwiperSlide>
                      <img src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=640&h=480&q=80" alt={`${card.name} - Image 2`} className="w-full h-full object-cover" />
                    </SwiperSlide>
                    <SwiperSlide>
                      <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=640&h=480&q=80" alt={`${card.name} - Image 3`} className="w-full h-full object-cover" />
                    </SwiperSlide>
                  </Swiper>
                  
                  {/* Overlay content */}
                  <span className="absolute top-3.5 left-3.5 bg-orange-500 text-white font-bold text-sm rounded-lg px-3.5 py-1 tracking-wide z-10"> {card.discount ? `${card.discount}% OFF` : ''}</span>
                  <button className="absolute top-3.5 right-3.5 bg-white/85 border-none rounded-full w-8 h-8 flex items-center justify-center cursor-pointer shadow-sm z-10"><i className="fa-regular fa-heart text-emerald-600 text-base"></i></button>
                </div>
                <div className="px-5 pt-5 pb-4 bg-green-50 flex-1 flex flex-col justify-between">
                  <div className="flex items-center mb-2.5">
                    <span className="text-gray-500 font-medium text-sm mr-2 flex items-center">
                      <i className="fa-regular fa-user mr-1.5 text-base"></i> {card.providerName}
                    </span>
                    {card.isTopRated && (
                      <span className="ml-auto bg-emerald-50 text-emerald-600 font-bold text-xs rounded-md px-3.5 py-0.5">Top Rated</span>
                    )}
                  </div>
                  <div className="font-[Manrope] font-bold text-lg text-gray-800 mb-0.5">{card.name}</div>
                  <div className="flex items-center mb-2">
                    <i className="fa-solid fa-star text-amber-400 text-sm mr-0.5"></i>
                    <span className="text-gray-800 font-bold text-sm mr-1">{card.rating}</span>
                    <span className="text-gray-500 text-sm">({card.reviews})</span>
                  </div>
                    <div
                    className="text-gray-500 text-[15px] font-[Manrope,sans-serif] mb-3  overflow-hidden text-ellipsis"
                    style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                    }}
                    >
                    {card.description}
                    </div>
                  <div style={{ display: 'flex', alignItems: 'flex-end', marginBottom: '0', marginTop: '10px' }}>
                    <span style={{ color: '#ef4444', fontWeight: 800, fontSize: '24px', marginRight: '8px' }}>${card.price}</span>
                    <span style={{ color: '#9ca3af', fontWeight: 600, fontSize: '17px', textDecoration: 'line-through', marginTop: '2px' }}>${card.oldPrice}</span>
                  </div>
                  <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '18px 0 10px 0' }} />
                  <div style={{ color: '#bdbdbd', fontSize: '15px', fontFamily: 'Manrope, sans-serif', marginBottom: '10px', fontWeight: 500 }}>
                    This service is about to run out
                  </div>
                  <div style={{ width: '100%', height: '8px', borderRadius: '4px', overflow: 'hidden', marginBottom: '8px', background: 'linear-gradient(90deg, #ffe259 0%, #ffa751 50%, #ef4444 100%)' }}>
                    <div style={{ width: '100%', height: '100%' }}></div>
                  </div>
                  <div style={{ color: '#6b7280', fontSize: '15px', fontFamily: 'Manrope, sans-serif', marginBottom: '16px', fontWeight: 400 }}>
                    available slots only : <b style={{ fontWeight: 800, color: '#222' }}>{card.slots}</b>
                  </div>
                  
                  {/* Book Now Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card click navigation
                      if (typeof window !== 'undefined') {
                        // Navigate to booking page with service ID and provider ID
                        window.location.href = `/book-service?serviceId=${card.id}&providerId=${card.providerId || 'unknown'}`;
                      }
                    }}
                    style={{
                      width: '100%',
                      background: '#10b981',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '12px 16px',
                      fontWeight: 700,
                      fontSize: '16px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      fontFamily: 'Manrope, sans-serif',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = '#059669';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = '#10b981';
                    }}
                  >
                    Book Now - ${card.price}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>







      {/* Browse Services Section - 100% Exact Design */}
      
    
    
     {/* Testimonials Section - Tailwind CSS */}
    <section 
      className="w-full min-h-[420px] flex items-center justify-center relative z-[1]"
      style={{
        background: 'linear-gradient(rgba(31,41,55,0.65),rgba(31,41,55,0.65)), url("https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&w=1200&q=80") center center / cover no-repeat'
      }}
    >
      <div className="w-full max-w-[900px] mx-auto text-center relative z-[2]">
        <div className="text-[15px] text-gray-300 font-[Manrope,sans-serif] font-semibold mb-[10px]">Testimonials</div>

        {/* Slider */}
        <div className="overflow-hidden relative w-full min-h-[220px] flex items-center justify-center">
          <Swiper
            modules={[Navigation]}
            spaceBetween={30}
            slidesPerView={1}
            navigation={{
              nextEl: '.testimonials-button-next',
              prevEl: '.testimonials-button-prev',
            }}
            loop={true}
            className="testimonials-swiper w-full h-[220px]"
          >
            {testimonials.map((item, index) => (
              <SwiperSlide key={index}>
                <div className="w-full py-10 px-5 box-border flex flex-col items-center justify-center h-full">
                <h2 className="text-white font-[Manrope,sans-serif] font-extrabold text-[32px] mb-4">What they say about us</h2>
                <div className="mb-3">
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className="fa-solid fa-star text-amber-400 text-[22px] mx-[2px]"></i>
                  ))}
                </div>
                <div style={{
                  color: '#fff',
                  fontFamily: 'Manrope, sans-serif',
                  fontWeight: 400,
                  fontSize: '18px',
                  maxWidth: '700px',
                  lineHeight: 1.6,
                  textAlign: 'center',
                }}>
                  <strong>“{item.quote}”</strong> {item.detail}
                </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Swiper Pagination will be handled automatically */}

        {/* Navigation Arrows */}
        <button className="testimonials-button-prev" style={{
          position: 'absolute',
          left: '-60px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '48px',
          height: '48px',
          backgroundColor: '#fff',
          border: 'none',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
          zIndex: 3,
        }}>
          <i className="fa-solid fa-chevron-left" style={{ color: '#10b981', fontSize: '22px' }}></i>
        </button>
        <button className="testimonials-button-next" style={{
          position: 'absolute',
          right: '-60px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '48px',
          height: '48px',
          backgroundColor: '#fff',
          border: 'none',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
          zIndex: 3,
        }}>
          <i className="fa-solid fa-chevron-right" style={{ color: '#10b981', fontSize: '22px' }}></i>
        </button>
      </div>
    </section>


          {/* Stay Informed Section */}
          <section className="bg-white pt-[60px] pb-16 min-h-[420px]">
            <div className="max-w-[1400px] w-[95%] mx-auto">
              <h2 className="font-[Manrope,sans-serif] font-extrabold text-[36px] text-center text-gray-800 mb-[10px]">
                Stay Informed with Our Latest Updates
              </h2>
              <p className="font-[Manrope,sans-serif] font-normal text-base text-center text-gray-500 mb-10">
                Discover the latest news, tips, and trends in beauty, wellness, and lifestyle.
              </p>
              
              {/* Swiper Slider */}
              <div className="relative">
                <Swiper
                  modules={[Navigation]}
                  spaceBetween={24}
                  slidesPerView={1}
                  navigation={{
                    nextEl: '.blog-swiper-button-next',
                    prevEl: '.blog-swiper-button-prev',
                  }}
                 
                  
                  breakpoints={{
                    678: {
                      slidesPerView: 1,
                      spaceBetween: 20,
                    },
                    768: {
                      slidesPerView: 2,
                      spaceBetween: 20,
                    },
                    1024: {
                      slidesPerView: 3,
                      spaceBetween: 24,
                    },
                  }}
                  loop={true}
                  className="blog-cards-swiper pb-12"
                >
                  {/* Slide 1 */}
                  <SwiperSlide>
                    <div className="bg-white border border-gray-200 rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col w-full h-full">
                      <img
                        src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&w=640&h=800&q=80"
                        alt="Professional Provider"
                        className="w-full h-[170px] object-cover"
                      />
                      <div className="p-5 flex-1 flex flex-col">
                        <div className="flex items-center mb-3">
                          <span className="bg-green-500 text-white text-xs font-semibold rounded px-[10px] py-[2px] mr-[10px]">Skincare Tips</span>
                          <span className="text-gray-500 text-[13px] flex items-center mr-[10px]">
                            <i className="fa-regular fa-calendar mr-[5px]"></i>20th February, 2025
                          </span>
                          <span className="text-gray-500 text-[13px] flex items-center">
                            <i className="fa-regular fa-clock mr-[5px]"></i>5 min read
                          </span>
                        </div>
                        <div className="font-[Manrope,sans-serif] font-bold text-lg text-gray-800 mb-3 flex-1">
                          Top 5 Skincare Tips for Glowing Skin
                        </div>
                        <Link href="/blog/1" className="text-gray-800 font-semibold text-[15px] no-underline mt-auto">
                          Read More <i className="fa-solid fa-arrow-right text-[13px] ml-1"></i>
                        </Link>
                      </div>
                    </div>
                  </SwiperSlide>

                  {/* Slide 2 */}
                  <SwiperSlide>
                    <div className="bg-white border border-gray-200 rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col w-full h-full">
                       <img
                        src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&w=640&h=800&q=80"
                        alt="Professional Provider"
                        className="w-full h-[170px] object-cover"
                      />
                      <div className="p-5 flex-1 flex flex-col">
                        <div className="flex items-center mb-3">
                          <span className="bg-blue-500 text-white text-xs font-semibold rounded px-[10px] py-[2px] mr-[10px]">Wellness</span>
                          <span className="text-gray-500 text-[13px] flex items-center mr-[10px]">
                            <i className="fa-regular fa-calendar mr-[5px]"></i>July 30, 2025
                          </span>
                          <span className="text-gray-500 text-[13px] flex items-center">
                            <i className="fa-regular fa-clock mr-[5px]"></i>7 min read
                          </span>
                        </div>
                        <div className="font-[Manrope,sans-serif] font-bold text-lg text-gray-800 mb-3 flex-1">
                          The Ultimate Guide to Stress Relief with Massage
                        </div>
                        <Link href="/blog/2" className="text-gray-800 font-semibold text-[15px] no-underline mt-auto">
                          Read More <i className="fa-solid fa-arrow-right text-[13px] ml-1"></i>
                        </Link>
                      </div>
                    </div>
                  </SwiperSlide>

                  {/* Slide 3 */}
                  <SwiperSlide>
                    <div className="bg-white border border-gray-200 rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col w-full h-full">
                     <img
                        src="https://images.unsplash.com/photo-1559599101-f09722fb4948?auto=format&fit=crop&w=640&h=400&q=80"
                        alt="Health & Wellness"
                        className="w-full h-[170px] object-cover"
                      />
                      <div className="p-5 flex-1 flex flex-col">
                        <div className="flex items-center mb-3">
                          <span className="bg-purple-500 text-white text-xs font-semibold rounded px-[10px] py-[2px] mr-[10px]">Beauty</span>
                          <span className="text-gray-500 text-[13px] flex items-center mr-[10px]">
                            <i className="fa-regular fa-calendar mr-[5px]"></i>15th March, 2025
                          </span>
                          <span className="text-gray-500 text-[13px] flex items-center">
                            <i className="fa-regular fa-clock mr-[5px]"></i>6 min read
                          </span>
                        </div>
                        <div className="font-[Manrope,sans-serif] font-bold text-lg text-gray-800 mb-3 flex-1">
                          How to Choose the Right Facial Treatment
                        </div>
                        <Link href="/blog/3" className="text-gray-800 font-semibold text-[15px] no-underline mt-auto">
                          Read More <i className="fa-solid fa-arrow-right text-[13px] ml-1"></i>
                        </Link>
                      </div>
                    </div>
                  </SwiperSlide>

                  {/* Slide 4 - Extra */}
                  <SwiperSlide>
                    <div className="bg-white border border-gray-200 rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col w-full h-full">
                      <img
                        src="https://images.unsplash.com/photo-1559599101-f09722fb4948?auto=format&fit=crop&w=640&h=400&q=80"
                        alt="Health & Wellness"
                        className="w-full h-[170px] object-cover"
                      />
                      <div className="p-5 flex-1 flex flex-col">
                        <div className="flex items-center mb-3">
                          <span className="bg-orange-500 text-white text-xs font-semibold rounded px-[10px] py-[2px] mr-[10px]">Health</span>
                          <span className="text-gray-500 text-[13px] flex items-center mr-[10px]">
                            <i className="fa-regular fa-calendar mr-[5px]"></i>10th April, 2025
                          </span>
                          <span className="text-gray-500 text-[13px] flex items-center">
                            <i className="fa-regular fa-clock mr-[5px]"></i>4 min read
                          </span>
                        </div>
                        <div className="font-[Manrope,sans-serif] font-bold text-lg text-gray-800 mb-3 flex-1">
                          Mental Health and Self-Care Tips
                        </div>
                        <Link href="/blog/4" className="text-gray-800 font-semibold text-[15px] no-underline mt-auto">
                          Read More <i className="fa-solid fa-arrow-right text-[13px] ml-1"></i>
                        </Link>
                      </div>
                    </div>
                  </SwiperSlide>
                </Swiper>

                {/* Custom Navigation Buttons */}
                <div className="blog-swiper-button-prev absolute left-[-20px] top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center cursor-pointer shadow-md hover:shadow-lg transition-all duration-200 z-10">
                  <i className="fa-solid fa-chevron-left text-emerald-600 text-sm"></i>
                </div>
                <div className="blog-swiper-button-next absolute right-[-20px] top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center cursor-pointer shadow-md hover:shadow-lg transition-all duration-200 z-10">
                  <i className="fa-solid fa-chevron-right text-emerald-600 text-sm"></i>
                </div>
              </div>
            </div>
          </section>
      {/* ...all homepage sections above... */}
      <Footer />
    </div>
  );
}

export default HomePage;
