"use client";

import Link from 'next/link';
import Footer from '@/components/Footer';

const demoFavorites = [
  {
    id: 1,
    name: 'Elite Hair Studio',
    category: 'Haircuts',
    rating: 4.8,
    reviews: 120,
    city: 'Downtown',
    image: 'https://images.pexels.com/photos/3993427/pexels-photo-3993427.jpeg?auto=compress&cs=tinysrgb&w=640&h=480&dpr=2',
  },
  {
    id: 2,
    name: 'Zen Wellness Spa',
    category: 'Massage',
    rating: 4.9,
    reviews: 98,
    city: 'Wellness Blvd',
    image: 'https://images.pexels.com/photos/3993427/pexels-photo-3993427.jpeg?auto=compress&cs=tinysrgb&w=640&h=480&dpr=2',
  },
  {
    id: 3,
    name: 'Glow Studio',
    category: 'Facials',
    rating: 4.7,
    reviews: 75,
    city: 'Beauty Lane',
   image: 'https://images.pexels.com/photos/3993427/pexels-photo-3993427.jpeg?auto=compress&cs=tinysrgb&w=640&h=480&dpr=2',
  },
];

export default function FavoritesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 style={{fontSize:'2.2rem',fontWeight:800,marginBottom:24}}>My Favorites</h1>
        <div style={{display:'flex',gap:24,flexWrap:'wrap'}}>
          {demoFavorites.map(fav => (
            <div key={fav.id} style={{background:'#fff',borderRadius:12,boxShadow:'0 2px 12px rgba(0,0,0,0.04)',padding:24,minWidth:260,maxWidth:320,display:'flex',flexDirection:'column',alignItems:'center'}}>
              <img src={fav.image} alt={fav.name} style={{width:80,height:80,borderRadius:'50%',objectFit:'cover',marginBottom:16}} />
              <div style={{fontWeight:700,fontSize:20,marginBottom:4}}>{fav.name}</div>
              <div style={{color:'#6b7280',fontSize:15,marginBottom:4}}>{fav.category}</div>
              <div style={{color:'#6b7280',fontSize:14,marginBottom:4}}>City: {fav.city}</div>
              <div style={{color:'#f59e42',fontWeight:700,fontSize:15,marginBottom:8}}>Rating: {fav.rating} ({fav.reviews} reviews)</div>
              <button style={{background:'#10b981',color:'#fff',border:'none',borderRadius:8,padding:'8px 24px',fontWeight:700,fontSize:15,cursor:'pointer',marginTop:8}}>Book Again</button>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/dashboard" className="inline-block bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
       <Footer />
    </div>
   
  );
}
