import DashboardLayout from '../components/DashboardLayout';

const categories = [
  { id: 'CAT-001', name: 'Beauty & Wellness', parent: null },
  { id: 'CAT-002', name: 'Hair Services', parent: 'Beauty & Wellness' },
  { id: 'CAT-003', name: 'Massage', parent: 'Beauty & Wellness' },
  { id: 'CAT-004', name: 'Healthcare', parent: null },
  { id: 'CAT-005', name: 'Dental', parent: 'Healthcare' },
];

export default function AdminCategories() {
  return (
    <DashboardLayout role="admin">
      <div style={{padding:40}}>
        <h1 style={{fontSize:'2.2rem',fontWeight:800,marginBottom:24}}>Categories & Services</h1>
        <div style={{background:'#fff',borderRadius:12,boxShadow:'0 2px 12px rgba(0,0,0,0.04)',padding:24}}>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead>
              <tr style={{background:'#f3f4f6'}}>
                <th style={{padding:'12px 8px',textAlign:'left',fontWeight:700}}>Category Name</th>
                <th style={{padding:'12px 8px',textAlign:'left',fontWeight:700}}>Parent Category</th>
                <th style={{padding:'12px 8px',textAlign:'left',fontWeight:700}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(c => (
                <tr key={c.id} style={{borderBottom:'1px solid #e5e7eb'}}>
                  <td style={{padding:'10px 8px'}}>{c.name}</td>
                  <td style={{padding:'10px 8px'}}>{c.parent || '-'}</td>
                  <td style={{padding:'10px 8px'}}>
                    <button style={{background:'#6366f1',color:'#fff',border:'none',borderRadius:6,padding:'6px 14px',fontWeight:700,marginRight:8,cursor:'pointer'}}>Edit</button>
                    <button style={{background:'#ef4444',color:'#fff',border:'none',borderRadius:6,padding:'6px 14px',fontWeight:700,cursor:'pointer'}}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{marginTop:24}}>
            <button style={{background:'#10b981',color:'#fff',border:'none',borderRadius:8,padding:'12px 32px',fontWeight:800,fontSize:16,cursor:'pointer'}}>Add New Category</button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
