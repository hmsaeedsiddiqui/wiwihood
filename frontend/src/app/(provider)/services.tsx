import DashboardLayout from '../components/DashboardLayout';

const services = [
  { id: 'SRV-001', name: 'Haircut', category: 'Hair Services', price: 30, duration: '30 min' },
  { id: 'SRV-002', name: 'Beard Trim', category: 'Hair Services', price: 15, duration: '15 min' },
  { id: 'SRV-003', name: 'Facial', category: 'Beauty & Wellness', price: 50, duration: '45 min' },
];

export default function ProviderServices() {
  return (
    <DashboardLayout role="provider">
      <div style={{padding:40}}>
        <h1 style={{fontSize:'2.2rem',fontWeight:800,marginBottom:24}}>Manage Services</h1>
        <div style={{background:'#fff',borderRadius:12,boxShadow:'0 2px 12px rgba(0,0,0,0.04)',padding:24}}>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead>
              <tr style={{background:'#f3f4f6'}}>
                <th style={{padding:'12px 8px',textAlign:'left',fontWeight:700}}>Service Name</th>
                <th style={{padding:'12px 8px',textAlign:'left',fontWeight:700}}>Category</th>
                <th style={{padding:'12px 8px',textAlign:'left',fontWeight:700}}>Price</th>
                <th style={{padding:'12px 8px',textAlign:'left',fontWeight:700}}>Duration</th>
                <th style={{padding:'12px 8px',textAlign:'left',fontWeight:700}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map(s => (
                <tr key={s.id} style={{borderBottom:'1px solid #e5e7eb'}}>
                  <td style={{padding:'10px 8px'}}>{s.name}</td>
                  <td style={{padding:'10px 8px'}}>{s.category}</td>
                  <td style={{padding:'10px 8px'}}>${s.price}</td>
                  <td style={{padding:'10px 8px'}}>{s.duration}</td>
                  <td style={{padding:'10px 8px'}}>
                    <button style={{background:'#6366f1',color:'#fff',border:'none',borderRadius:6,padding:'6px 14px',fontWeight:700,marginRight:8,cursor:'pointer'}}>Edit</button>
                    <button style={{background:'#ef4444',color:'#fff',border:'none',borderRadius:6,padding:'6px 14px',fontWeight:700,cursor:'pointer'}}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{marginTop:24}}>
            <button style={{background:'#10b981',color:'#fff',border:'none',borderRadius:8,padding:'12px 32px',fontWeight:800,fontSize:16,cursor:'pointer'}}>Add New Service</button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
