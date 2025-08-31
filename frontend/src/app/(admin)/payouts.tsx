import DashboardLayout from '../components/DashboardLayout';

const payouts = [
  { id: 'PAYOUT-001', provider: 'Glow Salon', amount: 250, date: '2025-08-28', status: 'Pending' },
  { id: 'PAYOUT-002', provider: 'Barber Bros', amount: 120, date: '2025-08-27', status: 'Completed' },
  { id: 'PAYOUT-003', provider: 'Wellness Spa', amount: 300, date: '2025-08-25', status: 'Completed' },
];

export default function AdminPayouts() {
  return (
    <DashboardLayout role="admin">
      <div style={{padding:40}}>
        <h1 style={{fontSize:'2.2rem',fontWeight:800,marginBottom:24}}>Payouts</h1>
        <p>Approve, track, and export provider payouts.</p>
        <div style={{background:'#fff',borderRadius:12,boxShadow:'0 2px 12px rgba(0,0,0,0.04)',padding:24}}>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead>
              <tr style={{background:'#f3f4f6'}}>
                <th style={{padding:'12px 8px',textAlign:'left',fontWeight:700}}>Payout ID</th>
                <th style={{padding:'12px 8px',textAlign:'left',fontWeight:700}}>Provider</th>
                <th style={{padding:'12px 8px',textAlign:'left',fontWeight:700}}>Amount</th>
                <th style={{padding:'12px 8px',textAlign:'left',fontWeight:700}}>Date</th>
                <th style={{padding:'12px 8px',textAlign:'left',fontWeight:700}}>Status</th>
                <th style={{padding:'12px 8px',textAlign:'left',fontWeight:700}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {payouts.map(p => (
                <tr key={p.id} style={{borderBottom:'1px solid #e5e7eb'}}>
                  <td style={{padding:'10px 8px'}}>{p.id}</td>
                  <td style={{padding:'10px 8px'}}>{p.provider}</td>
                  <td style={{padding:'10px 8px'}}>${p.amount}</td>
                  <td style={{padding:'10px 8px'}}>{p.date}</td>
                  <td style={{padding:'10px 8px'}}>
                    <span style={{
                      background: p.status === 'Completed' ? '#10b981' : '#fbbf24',
                      color: '#fff',
                      borderRadius: 6,
                      padding: '2px 10px',
                      fontWeight: 700,
                      fontSize: 13,
                    }}>{p.status}</span>
                  </td>
                  <td style={{padding:'10px 8px'}}>
                    {p.status === 'Pending' && (
                      <button style={{background:'#10b981',color:'#fff',border:'none',borderRadius:6,padding:'6px 14px',fontWeight:700,marginRight:8,cursor:'pointer'}}>Approve</button>
                    )}
                    <button style={{background:'#6366f1',color:'#fff',border:'none',borderRadius:6,padding:'6px 14px',fontWeight:700,cursor:'pointer'}}>Export</button>
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
