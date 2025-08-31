import DashboardLayout from '../components/DashboardLayout';

const reviews = [
  {
    id: 'REV-001',
    customer: 'Sarah Lee',
    service: 'Haircut',
    rating: 5,
    date: '2025-08-25',
    text: 'Great service, very professional and friendly!'
  },
  {
    id: 'REV-002',
    customer: 'John Smith',
    service: 'Beard Trim',
    rating: 4,
    date: '2025-08-20',
    text: 'Good experience, will come again.'
  },
  {
    id: 'REV-003',
    customer: 'Emily Chen',
    service: 'Hair Color',
    rating: 5,
    date: '2025-08-18',
    text: 'Loved the result! Highly recommend.'
  },
];

function Stars({ count }: { count: number }) {
  return <span>{'★'.repeat(count)}{'☆'.repeat(5 - count)}</span>;
}

export default function ProviderReviews() {
  return (
    <DashboardLayout role="provider">
      <div style={{padding:40}}>
        <h1 style={{fontSize:'2.2rem',fontWeight:800,marginBottom:24}}>My Reviews</h1>
        <div style={{background:'#fff',borderRadius:12,boxShadow:'0 2px 12px rgba(0,0,0,0.04)',padding:24}}>
          {reviews.map(r => (
            <div key={r.id} style={{borderBottom:'1px solid #e5e7eb',padding:'18px 0'}}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                <div>
                  <span style={{fontWeight:700,fontSize:16}}>{r.customer}</span>
                  <span style={{marginLeft:12,color:'#6b7280',fontSize:14}}>{r.service}</span>
                  <span style={{marginLeft:12,color:'#fbbf24',fontSize:16}}><Stars count={r.rating} /></span>
                </div>
                <span style={{color:'#6b7280',fontSize:13}}>{r.date}</span>
              </div>
              <div style={{marginTop:8,fontSize:15,color:'#374151'}}>{r.text}</div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
