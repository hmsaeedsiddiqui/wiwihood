import DashboardLayout from '../components/DashboardLayout';

export default function AdminAnalytics() {
  return (
    <DashboardLayout role="admin">
      <h1 style={{fontSize:'2.2rem',fontWeight:800,marginBottom:24}}>Analytics & Reports</h1>
      <div style={{display:'flex',gap:32,flexWrap:'wrap',marginBottom:32}}>
        <div style={{background:'#fff',borderRadius:12,boxShadow:'0 2px 12px rgba(0,0,0,0.04)',padding:24,minWidth:220,flex:'1 1 220px'}}>
          <div style={{fontSize:14,color:'#6b7280'}}>Total Bookings</div>
          <div style={{fontSize:32,fontWeight:900,color:'#10b981'}}>1,245</div>
        </div>
        <div style={{background:'#fff',borderRadius:12,boxShadow:'0 2px 12px rgba(0,0,0,0.04)',padding:24,minWidth:220,flex:'1 1 220px'}}>
          <div style={{fontSize:14,color:'#6b7280'}}>Total Revenue</div>
          <div style={{fontSize:32,fontWeight:900,color:'#10b981'}}>$32,800</div>
        </div>
        <div style={{background:'#fff',borderRadius:12,boxShadow:'0 2px 12px rgba(0,0,0,0.04)',padding:24,minWidth:220,flex:'1 1 220px'}}>
          <div style={{fontSize:14,color:'#6b7280'}}>New Users (This Month)</div>
          <div style={{fontSize:32,fontWeight:900,color:'#10b981'}}>320</div>
        </div>
      </div>
      <div style={{background:'#fff',borderRadius:12,boxShadow:'0 2px 12px rgba(0,0,0,0.04)',padding:24}}>
        <div style={{fontWeight:700,fontSize:18,marginBottom:16}}>Bookings Trend (Sample Chart)</div>
        <div style={{height:180,background:'linear-gradient(90deg,#10b98122 0%,#10b98111 100%)',borderRadius:8,display:'flex',alignItems:'flex-end',gap:8,padding:'0 16px'}}>
          {/* Simple bar chart mockup */}
          {[60, 80, 120, 100, 140, 90, 110].map((h,i) => (
            <div key={i} style={{width:32,height:h,background:'#10b981',borderRadius:6,transition:'height 0.3s'}}></div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
