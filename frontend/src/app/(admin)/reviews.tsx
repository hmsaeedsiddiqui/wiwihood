import DashboardLayout from '../components/DashboardLayout';

const reviews = [
  {
    id: 'REV-101',
    customer: 'Sarah Lee',
    provider: 'Glow Salon',
    service: 'Facial',
    rating: 5,
    date: '2025-08-25',
    text: 'Great service, very professional and friendly!'
  },
  {
    id: 'REV-102',
    customer: 'John Smith',
    provider: 'Barber Bros',
    service: 'Haircut',
    rating: 4,
    date: '2025-08-20',
    text: 'Good experience, will come again.'
  },
  {
    id: 'REV-103',
    customer: 'Emily Chen',
    provider: 'Wellness Spa',
    service: 'Massage',
    rating: 5,
    date: '2025-08-18',
    text: 'Loved the result! Highly recommend.'
  },
];

function Stars({ count }: { count: number }) {
  return <span>{'★'.repeat(count)}{'☆'.repeat(5 - count)}</span>;
}

export default function AdminReviews() {
  return (
    <DashboardLayout role="admin">
      <div style={{padding:40}}>
        <h1 style={{fontSize:'2.2rem',fontWeight:800,marginBottom:24}}>Reviews Moderation</h1>
        <div style={{background:'#fff',borderRadius:12,boxShadow:'0 2px 12px rgba(0,0,0,0.04)',padding:24}}>
          {reviews.map(r => (
            <div key={r.id} style={{borderBottom:'1px solid #e5e7eb',padding:'18px 0'}}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                <div>
                  <span style={{fontWeight:700,fontSize:16}}>{r.customer}</span>
                  <span style={{marginLeft:12,color:'#10b981',fontWeight:600,fontSize:14}}>{r.provider}</span>
                  <span style={{marginLeft:12,color:'#6b7280',fontSize:14}}>{r.service}</span>
                  <span style={{marginLeft:12,color:'#fbbf24',fontSize:16}}><Stars count={r.rating} /></span>
                </div>
                <span style={{color:'#6b7280',fontSize:13}}>{r.date}</span>
              </div>
              <div style={{marginTop:8,fontSize:15,color:'#374151'}}>{r.text}</div>
              <div style={{marginTop:12,display:'flex',gap:8}}>
                <button style={{background:'#10b981',color:'#fff',border:'none',borderRadius:6,padding:'6px 14px',fontWeight:700,cursor:'pointer'}}>Approve</button>
                <button style={{background:'#ef4444',color:'#fff',border:'none',borderRadius:6,padding:'6px 14px',fontWeight:700,cursor:'pointer'}}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
