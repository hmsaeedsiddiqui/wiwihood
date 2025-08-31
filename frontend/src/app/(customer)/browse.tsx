
import DashboardLayout from '../components/DashboardLayout';
import NavLinkButton from '../components/NavLinkButton';
import Footer from '../../components/Footer';

const mockCategories = [
  {
    name: 'Haircuts',
    services: [
      { id: 'SRV-201', name: 'Classic Cut', provider: 'Urban Cuts', rating: 5, price: 25 },
      { id: 'SRV-202', name: 'Fade', provider: 'Classic Barbers', rating: 4, price: 30 },
    ]
  },
  {
    name: 'Massages',
    services: [
      { id: 'SRV-301', name: 'Swedish Massage', provider: 'Relax Spa', rating: 5, price: 50 },
      { id: 'SRV-302', name: 'Deep Tissue', provider: 'Therapy Touch', rating: 4, price: 45 },
    ]
  },
  {
    name: 'Facials',
    services: [
      { id: 'SRV-401', name: 'Glow Facial', provider: 'Glow Studio', rating: 5, price: 40 },
      { id: 'SRV-402', name: 'Fresh Face', provider: 'Fresh Face', rating: 4, price: 38 },
    ]
  }
];

function Stars({ count }: { count: number }) {
  return <span>{'★'.repeat(count)}{'☆'.repeat(5 - count)}</span>;
}

export default function CustomerBrowse() {
  return (
    <>
      <DashboardLayout role="customer">
        <h1 style={{fontSize:'2.2rem',fontWeight:800,marginBottom:24}}>Browse Shops & Services</h1>
        {mockCategories.map(category => (
          <div key={category.name} style={{marginBottom:32}}>
            <h2 style={{fontSize:'1.4rem',fontWeight:700,marginBottom:16,color:'#10b981'}}>{category.name}</h2>
            <div style={{display:'flex',gap:24,flexWrap:'wrap'}}>
              {category.services.map(s => (
                <div key={s.id} style={{background:'#fff',borderRadius:12,boxShadow:'0 2px 12px rgba(0,0,0,0.04)',padding:24,minWidth:260,maxWidth:320,flex:'1 1 260px',display:'flex',flexDirection:'column',justifyContent:'space-between'}}>
                  <div>
                    <div style={{fontWeight:700,fontSize:18,marginBottom:4}}>{s.name}</div>
                    <div style={{color:'#10b981',fontWeight:600,fontSize:14,marginBottom:2}}>{s.provider}</div>
                    <div style={{color:'#fbbf24',fontSize:16,marginBottom:8}}><Stars count={s.rating} /></div>
                    <div style={{fontWeight:700,fontSize:16}}>${s.price}</div>
                  </div>
                  <div style={{display:'flex',gap:8,marginTop:12}}>
                    <NavLinkButton href={`/(customer)/service-details`} style={{background:'#10b981',color:'#fff',border:'none',borderRadius:6,padding:'6px 14px',fontWeight:700,cursor:'pointer'}}>View</NavLinkButton>
                    <NavLinkButton href={`/(customer)/booking-flow`} style={{background:'#6366f1',color:'#fff',border:'none',borderRadius:6,padding:'6px 14px',fontWeight:700,cursor:'pointer'}}>Book</NavLinkButton>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </DashboardLayout>
  <Footer />
    </>
  );
}
