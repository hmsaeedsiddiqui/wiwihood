import DashboardLayout from '../components/DashboardLayout';

const tickets = [
  { id: 'TCK-001', user: 'Sarah Lee', subject: 'Booking issue', status: 'Open', date: '2025-08-28' },
  { id: 'TCK-002', user: 'John Smith', subject: 'Payment not received', status: 'In Progress', date: '2025-08-27' },
  { id: 'TCK-003', user: 'Emily Chen', subject: 'Provider not responding', status: 'Closed', date: '2025-08-25' },
];

export default function AdminSupport() {
  return (
    <DashboardLayout role="admin">
      <div style={{padding:40}}>
        <h1 style={{fontSize:'2.2rem',fontWeight:800,marginBottom:24}}>Support Tickets</h1>
        <div style={{background:'#fff',borderRadius:12,boxShadow:'0 2px 12px rgba(0,0,0,0.04)',padding:24}}>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead>
              <tr style={{background:'#f3f4f6'}}>
                <th style={{padding:'12px 8px',textAlign:'left',fontWeight:700}}>Ticket ID</th>
                <th style={{padding:'12px 8px',textAlign:'left',fontWeight:700}}>User</th>
                <th style={{padding:'12px 8px',textAlign:'left',fontWeight:700}}>Subject</th>
                <th style={{padding:'12px 8px',textAlign:'left',fontWeight:700}}>Status</th>
                <th style={{padding:'12px 8px',textAlign:'left',fontWeight:700}}>Date</th>
                <th style={{padding:'12px 8px',textAlign:'left',fontWeight:700}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map(t => (
                <tr key={t.id} style={{borderBottom:'1px solid #e5e7eb'}}>
                  <td style={{padding:'10px 8px'}}>{t.id}</td>
                  <td style={{padding:'10px 8px'}}>{t.user}</td>
                  <td style={{padding:'10px 8px'}}>{t.subject}</td>
                  <td style={{padding:'10px 8px'}}>
                    <span style={{
                      background: t.status === 'Open' ? '#fbbf24' : t.status === 'In Progress' ? '#6366f1' : '#10b981',
                      color: '#fff',
                      borderRadius: 6,
                      padding: '2px 10px',
                      fontWeight: 700,
                      fontSize: 13,
                    }}>{t.status}</span>
                  </td>
                  <td style={{padding:'10px 8px'}}>{t.date}</td>
                  <td style={{padding:'10px 8px'}}>
                    <button style={{background:'#6366f1',color:'#fff',border:'none',borderRadius:6,padding:'6px 14px',fontWeight:700,marginRight:8,cursor:'pointer'}}>View</button>
                    <button style={{background:'#10b981',color:'#fff',border:'none',borderRadius:6,padding:'6px 14px',fontWeight:700,cursor:'pointer'}}>Assign</button>
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
