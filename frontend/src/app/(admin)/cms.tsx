import DashboardLayout from '../components/DashboardLayout';

const pages = [
  { id: 'CMS-001', title: 'About Us', slug: '/about', updated: '2025-08-20' },
  { id: 'CMS-002', title: 'Terms of Service', slug: '/terms', updated: '2025-08-15' },
  { id: 'CMS-003', title: 'Privacy Policy', slug: '/privacy', updated: '2025-08-10' },
];

export default function AdminCMS() {
  return (
    <DashboardLayout role="admin">
      <div style={{padding:40}}>
        <h1 style={{fontSize:'2.2rem',fontWeight:800,marginBottom:24}}>CMS Pages</h1>
        <div style={{background:'#fff',borderRadius:12,boxShadow:'0 2px 12px rgba(0,0,0,0.04)',padding:24}}>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead>
              <tr style={{background:'#f3f4f6'}}>
                <th style={{padding:'12px 8px',textAlign:'left',fontWeight:700}}>Title</th>
                <th style={{padding:'12px 8px',textAlign:'left',fontWeight:700}}>Slug</th>
                <th style={{padding:'12px 8px',textAlign:'left',fontWeight:700}}>Last Updated</th>
                <th style={{padding:'12px 8px',textAlign:'left',fontWeight:700}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pages.map(p => (
                <tr key={p.id} style={{borderBottom:'1px solid #e5e7eb'}}>
                  <td style={{padding:'10px 8px'}}>{p.title}</td>
                  <td style={{padding:'10px 8px'}}>{p.slug}</td>
                  <td style={{padding:'10px 8px'}}>{p.updated}</td>
                  <td style={{padding:'10px 8px'}}>
                    <button style={{background:'#6366f1',color:'#fff',border:'none',borderRadius:6,padding:'6px 14px',fontWeight:700,marginRight:8,cursor:'pointer'}}>Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{marginTop:24}}>
            <button style={{background:'#10b981',color:'#fff',border:'none',borderRadius:8,padding:'12px 32px',fontWeight:800,fontSize:16,cursor:'pointer'}}>Add New Page</button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
