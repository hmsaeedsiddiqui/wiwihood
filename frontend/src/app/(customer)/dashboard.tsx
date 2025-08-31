import DashboardLayout from '../components/DashboardLayout';
import NavLinkButton from '../components/NavLinkButton';

export default function CustomerDashboard() {
  return (
    <DashboardLayout role="customer">
      <div style={{padding:40}}>
        <h1 style={{fontSize:'2.2rem',fontWeight:800}}>My Dashboard</h1>
        <p>View your bookings, favorites, and account info here.</p>
        <div style={{marginTop:32,display:'flex',gap:16}}>
          <NavLinkButton href="/(customer)/browse" style={{background:'#10b981',color:'#fff',border:'none',borderRadius:8,padding:'12px 32px',fontWeight:800,fontSize:16,cursor:'pointer'}}>Browse Services</NavLinkButton>
          <NavLinkButton href="/(customer)/bookings" style={{background:'#6366f1',color:'#fff',border:'none',borderRadius:8,padding:'12px 32px',fontWeight:800,fontSize:16,cursor:'pointer'}}>My Bookings</NavLinkButton>
          <NavLinkButton href="/(customer)/favorites" style={{background:'#fbbf24',color:'#fff',border:'none',borderRadius:8,padding:'12px 32px',fontWeight:800,fontSize:16,cursor:'pointer'}}>Favorites</NavLinkButton>
          <NavLinkButton href="/account" style={{background:'#6b7280',color:'#fff',border:'none',borderRadius:8,padding:'12px 32px',fontWeight:800,fontSize:16,cursor:'pointer'}}>Account</NavLinkButton>
        </div>
      </div>
    </DashboardLayout>
  );
}
