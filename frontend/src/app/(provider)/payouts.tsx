import DashboardLayout from '../components/DashboardLayout';

const payouts = [
  { id: 'PAYOUT-101', amount: 120, date: '2025-08-28', status: 'Completed' },
  { id: 'PAYOUT-102', amount: 80, date: '2025-08-20', status: 'Pending' },
  { id: 'PAYOUT-103', amount: 200, date: '2025-08-10', status: 'Completed' },
];

export default function ProviderPayouts() {
  return (
    <DashboardLayout role="provider">
      <div style={{padding:40}}>
        <h1 style={{fontSize:'2.2rem',fontWeight:800,marginBottom:24}}>Payouts</h1>
        <p>View payout history and request new payouts.</p>
        <div style={{background:'#fff',borderRadius:12,boxShadow:'0 2px 12px rgba(0,0,0,0.04)',padding:24}}>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead>
              <tr style={{background:'#f3f4f6'}}>
                <th style={{padding:'12px 8px',textAlign:'left',fontWeight:700}}>Payout ID</th>
                <th style={{padding:'12px 8px',textAlign:'left',fontWeight:700}}>Amount</th>
                <th style={{padding:'12px 8px',textAlign:'left',fontWeight:700}}>Date</th>
                <th style={{padding:'12px 8px',textAlign:'left',fontWeight:700}}>Status</th>
              </tr>
            </thead>
            <tbody>
              {payouts.map(p => (
                <tr key={p.id} style={{borderBottom:'1px solid #e5e7eb'}}>
                  <td style={{padding:'10px 8px'}}>{p.id}</td>
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
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{marginTop:24}}>
            <button style={{background:'#10b981',color:'#fff',border:'none',borderRadius:8,padding:'12px 32px',fontWeight:800,fontSize:16,cursor:'pointer'}}>Request Payout</button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
