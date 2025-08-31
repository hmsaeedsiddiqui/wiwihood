import DashboardLayout from '../components/DashboardLayout';
import NavLinkButton from '../components/NavLinkButton';

const favorites = [
  {
    id: 'PRV-001',
    name: 'Glow Salon',
    category: 'Beauty & Wellness',
    service: 'Facial',
  },
  {
    id: 'PRV-002',
    name: 'Barber Bros',
    category: 'Hair Services',
    service: 'Haircut',
  },
  {
    id: 'PRV-003',
    name: 'Wellness Spa',
    category: 'Massage',
    service: 'Full Body Massage',
  },
];

export default function CustomerFavorites() {
  return (
    <DashboardLayout role="customer">
      <div style={{padding:40}}>
        <h1 style={{fontSize:'2.2rem',fontWeight:800,marginBottom:24}}>My Favorites</h1>
        <p>List of your favorited providers and services.</p>
        <div style={{display:'flex',gap:24,flexWrap:'wrap'}}>
          {favorites.map(f => (
            <div key={f.id} style={{background:'#fff',borderRadius:12,boxShadow:'0 2px 12px rgba(0,0,0,0.04)',padding:24,minWidth:260,maxWidth:320,flex:'1 1 260px',display:'flex',flexDirection:'column',justifyContent:'space-between'}}>
              <div>
                <div style={{fontWeight:700,fontSize:18,marginBottom:4}}>{f.name}</div>
                <div style={{color:'#10b981',fontWeight:600,fontSize:14,marginBottom:2}}>{f.category}</div>
                <div style={{color:'#6b7280',fontSize:14,marginBottom:12}}>{f.service}</div>
              </div>
              <div style={{display:'flex',gap:8,marginTop:12}}>
                <NavLinkButton href={`/(customer)/booking-flow`} style={{background:'#10b981',color:'#fff',border:'none',borderRadius:6,padding:'6px 14px',fontWeight:700,cursor:'pointer'}}>Book Again</NavLinkButton>
                <button style={{background:'#ef4444',color:'#fff',border:'none',borderRadius:6,padding:'6px 14px',fontWeight:700,cursor:'pointer'}}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
