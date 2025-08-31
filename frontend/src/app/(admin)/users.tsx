import DashboardLayout from '../components/DashboardLayout';

const users = [
  { id: 'USR-001', name: 'Sarah Lee', email: 'sarah@example.com', role: 'Customer', status: 'Active' },
  { id: 'USR-002', name: 'John Smith', email: 'john@example.com', role: 'Provider', status: 'Active' },
  { id: 'USR-003', name: 'Emily Chen', email: 'emily@example.com', role: 'Admin', status: 'Suspended' },
];

export default function AdminUsers() {
  return (
    <DashboardLayout role="admin">
      <div style={{padding:40}}>
        <h1 style={{fontSize:'2.2rem',fontWeight:800,marginBottom:24}}>User Management</h1>
        <div style={{background:'#fff',borderRadius:12,boxShadow:'0 2px 12px rgba(0,0,0,0.04)',padding:24}}>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead>
              <tr style={{background:'#f3f4f6'}}>
                <th style={{padding:'12px 8px',textAlign:'left',fontWeight:700}}>User ID</th>
                <th style={{padding:'12px 8px',textAlign:'left',fontWeight:700}}>Name</th>
                <th style={{padding:'12px 8px',textAlign:'left',fontWeight:700}}>Email</th>
                <th style={{padding:'12px 8px',textAlign:'left',fontWeight:700}}>Role</th>
                <th style={{padding:'12px 8px',textAlign:'left',fontWeight:700}}>Status</th>
                <th style={{padding:'12px 8px',textAlign:'left',fontWeight:700}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} style={{borderBottom:'1px solid #e5e7eb'}}>
                  <td style={{padding:'10px 8px'}}>{u.id}</td>
                  <td style={{padding:'10px 8px'}}>{u.name}</td>
                  <td style={{padding:'10px 8px'}}>{u.email}</td>
                  <td style={{padding:'10px 8px'}}>{u.role}</td>
                  <td style={{padding:'10px 8px'}}>
                    <span style={{
                      background: u.status === 'Active' ? '#10b981' : '#ef4444',
                      color: '#fff',
                      borderRadius: 6,
                      padding: '2px 10px',
                      fontWeight: 700,
                      fontSize: 13,
                    }}>{u.status}</span>
                  </td>
                  <td style={{padding:'10px 8px'}}>
                    <button style={{background:'#6366f1',color:'#fff',border:'none',borderRadius:6,padding:'6px 14px',fontWeight:700,marginRight:8,cursor:'pointer'}}>View</button>
                    <button style={{background:'#10b981',color:'#fff',border:'none',borderRadius:6,padding:'6px 14px',fontWeight:700,marginRight:8,cursor:'pointer'}}>Edit</button>
                    <button style={{background:'#fbbf24',color:'#fff',border:'none',borderRadius:6,padding:'6px 14px',fontWeight:700,cursor:'pointer'}}>Permissions</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
