import DashboardLayout from '../components/DashboardLayout';

const logs = [
  { id: 'LOG-001', user: 'Admin', action: 'Created User', entity: 'USR-004', date: '2025-08-28', details: 'Added new provider account.' },
  { id: 'LOG-002', user: 'Admin', action: 'Updated Booking', entity: 'BKG-201', date: '2025-08-27', details: 'Changed status to Confirmed.' },
  { id: 'LOG-003', user: 'Admin', action: 'Deleted Review', entity: 'REV-102', date: '2025-08-25', details: 'Removed inappropriate review.' },
];

export default function AdminLogs() {
  return (
    <DashboardLayout role="admin">
      <div style={{padding:40}}>
        <h1 style={{fontSize:'2.2rem',fontWeight:800,marginBottom:24}}>System Logs & Audit</h1>
        <div style={{background:'#fff',borderRadius:12,boxShadow:'0 2px 12px rgba(0,0,0,0.04)',padding:24}}>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead>
              <tr style={{background:'#f3f4f6'}}>
                <th style={{padding:'12px 8px',textAlign:'left',fontWeight:700}}>Log ID</th>
                <th style={{padding:'12px 8px',textAlign:'left',fontWeight:700}}>User</th>
                <th style={{padding:'12px 8px',textAlign:'left',fontWeight:700}}>Action</th>
                <th style={{padding:'12px 8px',textAlign:'left',fontWeight:700}}>Entity</th>
                <th style={{padding:'12px 8px',textAlign:'left',fontWeight:700}}>Date</th>
                <th style={{padding:'12px 8px',textAlign:'left',fontWeight:700}}>Details</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(l => (
                <tr key={l.id} style={{borderBottom:'1px solid #e5e7eb'}}>
                  <td style={{padding:'10px 8px'}}>{l.id}</td>
                  <td style={{padding:'10px 8px'}}>{l.user}</td>
                  <td style={{padding:'10px 8px'}}>{l.action}</td>
                  <td style={{padding:'10px 8px'}}>{l.entity}</td>
                  <td style={{padding:'10px 8px'}}>{l.date}</td>
                  <td style={{padding:'10px 8px'}}>{l.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
