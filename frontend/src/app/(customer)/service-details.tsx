
import DashboardLayout from '../components/DashboardLayout';
import { useEffect, useState } from 'react';

function getServiceFromState() {
  if (typeof window === 'undefined') return null;
  const data = window.sessionStorage.getItem('serviceCard');
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

function Stars({ count }: { count: number }) {
  return <span>{'★'.repeat(count)}{'☆'.repeat(5 - count)}</span>;
}

export default function ServiceDetails() {
  const [service, setService] = useState<any>(null);
  useEffect(() => {
    setService(getServiceFromState());
  }, []);

  if (!service) {
    return <DashboardLayout role="customer"><div>Service not found.</div></DashboardLayout>;
  }

  return (
    <DashboardLayout role="customer">
      <h1 style={{fontSize:'2.2rem',fontWeight:800,marginBottom:8}}>{service.name}</h1>
      <div style={{color:'#10b981',fontWeight:600,fontSize:16,marginBottom:2}}>{service.providerName || service.provider || ''}</div>
      <div style={{color:'#6b7280',fontSize:14,marginBottom:2}}>{service.category?.name || service.category || ''}</div>
      <div style={{color:'#fbbf24',fontSize:16,marginBottom:8}}><Stars count={service.rating || service.averageRating || 5} /></div>
      <div style={{fontWeight:700,fontSize:18,marginBottom:8}}>${service.price || service.basePrice}</div>
      <div style={{marginBottom:16}}>{service.description}</div>
      <button style={{background:'#10b981',color:'#fff',border:'none',borderRadius:8,padding:'12px 32px',fontWeight:800,fontSize:16,cursor:'pointer',marginBottom:24}} onClick={() => window.location.href = '/(customer)/booking-flow'}>Book Now</button>
      {/* Optionally show reviews if present */}
      {service.reviews && Array.isArray(service.reviews) && (
        <div style={{marginTop:24}}>
          <div style={{fontWeight:700,fontSize:18,marginBottom:12}}>Reviews</div>
          {service.reviews.map((r: any) => (
            <div key={r.id} style={{borderBottom:'1px solid #e5e7eb',padding:'12px 0'}}>
              <span style={{fontWeight:700}}>{r.customer}</span>
              <span style={{marginLeft:12,color:'#fbbf24',fontSize:16}}><Stars count={r.rating} /></span>
              <div style={{marginTop:4,fontSize:15,color:'#374151'}}>{r.text}</div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

