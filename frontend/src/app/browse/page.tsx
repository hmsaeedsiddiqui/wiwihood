"use client";
import React from "react";
import Link from "next/link";
import Footer from "../../components/Footer";

export default function BrowsePage() {
  return (
    <>
      <div className="min-h-[80vh] bg-white py-12">
        <div className="w-[95%] max-w-[1400px] mx-auto px-4">
          <h1 className="text-4xl font-extrabold font-[Manrope] mb-4">
            Browse All Services & Offers
          </h1>
          <p className="text-gray-500 text-lg mb-10 font-medium max-w-2xl">
            Explore all available services, top-rated providers, and exclusive offers. Click any service to view details or add to cart.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* 20 visually rich cards for demo */}
            {[
              {
                href: "/haircuts",
                img: "https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&w=640&h=480",
                title: "Hair Services",
                desc: "24 Top-Rated Professionals"
              },
              {
                href: "/massages",
                img: "https://images.pexels.com/photos/3757942/pexels-photo-3757942.jpeg?auto=compress&w=640&h=480",
                title: "Body Massage",
                desc: "10 Top-Rated Professionals"
              },
              {
                href: "/facials",
                img: "https://images.pexels.com/photos/3993446/pexels-photo-3993446.jpeg?auto=compress&w=640&h=480",
                title: "Skin Care",
                desc: "11 Top-Rated Professionals"
              },
              {
                href: "/nails",
                img: "https://images.pexels.com/photos/3993450/pexels-photo-3993450.jpeg?auto=compress&w=640&h=480",
                title: "Nail Art & Manicure",
                desc: "8 Top-Rated Professionals"
              },
              {
                href: "/fitness",
                img: "https://images.pexels.com/photos/3993450/pexels-photo-3993450.jpeg?auto=compress&w=640&h=480",
                title: "Fitness Training",
                desc: "6 Top-Rated Trainers"
              },
              {
                href: "/spa",
                img: "https://images.pexels.com/photos/3993447/pexels-photo-3993447.jpeg?auto=compress&w=640&h=480",
                title: "Luxury Spa",
                desc: "5 Top-Rated Spas"
              },
              {
                href: "/makeup",
                img: "https://images.pexels.com/photos/3993451/pexels-photo-3993451.jpeg?auto=compress&w=640&h=480",
                title: "Makeup Artists",
                desc: "15 Glam Experts"
              },
              {
                href: "/eyebrows",
                img: "https://images.pexels.com/photos/3993452/pexels-photo-3993452.jpeg?auto=compress&w=640&h=480",
                title: "Eyebrow Shaping",
                desc: "7 Brow Stylists"
              },
              {
                href: "/lashes",
                img: "https://images.pexels.com/photos/3993453/pexels-photo-3993453.jpeg?auto=compress&w=640&h=480",
                title: "Lash Extensions",
                desc: "9 Lash Artists"
              },
              {
                href: "/waxing",
                img: "https://images.pexels.com/photos/3993454/pexels-photo-3993454.jpeg?auto=compress&w=640&h=480",
                title: "Waxing & Hair Removal",
                desc: "12 Specialists"
              },
              {
                href: "/tattoo",
                img: "https://images.pexels.com/photos/3993455/pexels-photo-3993455.jpeg?auto=compress&w=640&h=480",
                title: "Tattoo Artists",
                desc: "4 Ink Masters"
              },
              {
                href: "/piercing",
                img: "https://images.pexels.com/photos/3993456/pexels-photo-3993456.jpeg?auto=compress&w=640&h=480",
                title: "Piercing Studios",
                desc: "3 Studios"
              },
              {
                href: "/teeth-whitening",
                img: "https://images.pexels.com/photos/3993457/pexels-photo-3993457.jpeg?auto=compress&w=640&h=480",
                title: "Teeth Whitening",
                desc: "5 Smile Experts"
              },
              {
                href: "/barbers",
                img: "https://images.pexels.com/photos/3993458/pexels-photo-3993458.jpeg?auto=compress&w=640&h=480",
                title: "Barber Shops",
                desc: "18 Barbers"
              },
              {
                href: "/dermatology",
                img: "https://images.pexels.com/photos/3993459/pexels-photo-3993459.jpeg?auto=compress&w=640&h=480",
                title: "Dermatology",
                desc: "6 Skin Doctors"
              },
              {
                href: "/cosmetic-dentistry",
                img: "https://images.pexels.com/photos/3993460/pexels-photo-3993460.jpeg?auto=compress&w=640&h=480",
                title: "Cosmetic Dentistry",
                desc: "4 Dentists"
              },
              {
                href: "/yoga",
                img: "https://images.pexels.com/photos/3993461/pexels-photo-3993461.jpeg?auto=compress&w=640&h=480",
                title: "Yoga Classes",
                desc: "10 Instructors"
              },
              {
                href: "/personal-training",
                img: "https://images.pexels.com/photos/3993462/pexels-photo-3993462.jpeg?auto=compress&w=640&h=480",
                title: "Personal Training",
                desc: "8 Trainers"
              },
              {
                href: "/nutrition",
                img: "https://images.pexels.com/photos/3993463/pexels-photo-3993463.jpeg?auto=compress&w=640&h=480",
                title: "Nutritionists",
                desc: "5 Experts"
              },
              {
                href: "/wellness-coaching",
                img: "https://images.pexels.com/photos/3993464/pexels-photo-3993464.jpeg?auto=compress&w=640&h=480",
                title: "Wellness Coaching",
                desc: "7 Coaches"
              }
            ].map((card, i) => (
              <Link key={i} href={card.href} className=" rounded-2xl overflow-hidden shadow-xl bg-green-50 no-underline text-gray-900 block hover:shadow-2xl transition-shadow duration-300">
                <img src={card.img} alt={card.title} className="w-full h-40 object-cover" />
                <div className="p-4">
                  <div className="font-bold text-lg">{card.title}</div>
                  <div className="text-gray-500 text-sm">{card.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
