import DashboardLayout from '../components/DashboardLayout';
import NavLinkButton from '../components/NavLinkButton';

const provider = {
  id: 'PRV-101',
  name: 'Glow Salon',
  bio: 'Glow Salon offers premium beauty and wellness services with experienced professionals and a relaxing atmosphere.',
  rating: 5,
  services: [
    { id: 'SRV-101', name: 'Facial', price: 50, duration: '45 min' },
    { id: 'SRV-102', name: 'Haircut', price: 30, duration: '30 min' },
  ],
  reviews: [
    { id: 'REV-301', customer: 'Sarah Lee', rating: 5, text: 'Amazing experience, highly recommend!' },
    { id: 'REV-302', customer: 'John Smith', rating: 4, text: 'Very professional and friendly staff.' },
  ],
};

function Stars({ count }: { count: number }) {
  return <span>{'★'.repeat(count)}{'☆'.repeat(5 - count)}</span>;
}

export default function ProviderProfile() {
  return (
    <DashboardLayout role="customer">
      <h1 style={{fontSize:'2.2rem',fontWeight:800,marginBottom:8}}>{provider.name}</h1>
      <div style={{color:'#fbbf24',fontSize:16,marginBottom:8}}><Stars count={provider.rating} /></div>
      <div style={{marginBottom:16,color:'#374151'}}>{provider.bio}</div>
      <div style={{fontWeight:700,fontSize:18,marginBottom:12}}>Services</div>
      <div style={{display:'flex',gap:24,flexWrap:'wrap',marginBottom:24}}>
        {provider.services.map(s => (
          <div key={s.id} style={{background:'#fff',borderRadius:12,boxShadow:'0 2px 12px rgba(0,0,0,0.04)',padding:20,minWidth:200,maxWidth:240,flex:'1 1 200px',display:'flex',flexDirection:'column',justifyContent:'space-between'}}>
            <div style={{fontWeight:700,fontSize:16,marginBottom:4}}>{s.name}</div>
            <div style={{color:'#10b981',fontWeight:600,fontSize:14,marginBottom:2}}>${s.price}</div>
            <div style={{color:'#6b7280',fontSize:14,marginBottom:8}}>{s.duration}</div>
            <button style={{background:'#10b981',color:'#fff',border:'none',borderRadius:6,padding:'6px 14px',fontWeight:700,cursor:'pointer'}} onClick={() => window.location.href = '/(customer)/booking-flow'}>Book</button>
          </div>
        ))}
      </div>
      <div style={{fontWeight:700,fontSize:18,marginBottom:12}}>Reviews</div>
      <div>
        {provider.reviews.map(r => (
          <div key={r.id} style={{borderBottom:'1px solid #e5e7eb',padding:'12px 0'}}>
            <span style={{fontWeight:700}}>{r.customer}</span>
            <span style={{marginLeft:12,color:'#fbbf24',fontSize:16}}><Stars count={r.rating} /></span>
            <div style={{marginTop:4,fontSize:15,color:'#374151'}}>{r.text}</div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
