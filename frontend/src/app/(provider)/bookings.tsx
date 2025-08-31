import DashboardLayout from '../components/DashboardLayout';

const bookings = [
  {
    id: 'BKG-001',
    customer: 'Sarah Lee',
    service: 'Haircut',
    date: '2025-08-29',
    time: '10:00',
    status: 'Pending',
  },
  {
    id: 'BKG-002',
    customer: 'John Smith',
    service: 'Beard Trim',
    date: '2025-08-29',
    time: '11:30',
    status: 'Confirmed',
  },
  {
    id: 'BKG-003',
    customer: 'Emily Chen',
    service: 'Hair Color',
    date: '2025-08-30',
    time: '09:00',
    status: 'Completed',
  },
];

export default function ProviderBookings() {
  return (
    <DashboardLayout role="provider">
      <div style={{padding:40}}>
        <h1 style={{fontSize:'2.2rem',fontWeight:800,marginBottom:24}}>Provider Bookings</h1>
        <p>Manage your bookings: confirm, cancel, mark as complete.</p>
        <div style={{background:'#fff',borderRadius:12,boxShadow:'0 2px 12px rgba(0,0,0,0.04)',padding:24}}>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead>
              <tr style={{background:'#f3f4f6'}}>
                <th style={{padding:'12px 8px',textAlign:'left',fontWeight:700}}>Booking ID</th>
                <th style={{padding:'12px 8px',textAlign:'left',fontWeight:700}}>Customer</th>
                <th style={{padding:'12px 8px',textAlign:'left',fontWeight:700}}>Service</th>
                <th style={{padding:'12px 8px',textAlign:'left',fontWeight:700}}>Date</th>
                <th style={{padding:'12px 8px',textAlign:'left',fontWeight:700}}>Time</th>
                <th style={{padding:'12px 8px',textAlign:'left',fontWeight:700}}>Status</th>
                <th style={{padding:'12px 8px',textAlign:'left',fontWeight:700}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b.id} style={{borderBottom:'1px solid #e5e7eb'}}>
                  <td style={{padding:'10px 8px'}}>{b.id}</td>
                  <td style={{padding:'10px 8px'}}>{b.customer}</td>
                  <td style={{padding:'10px 8px'}}>{b.service}</td>
                  <td style={{padding:'10px 8px'}}>{b.date}</td>
                  <td style={{padding:'10px 8px'}}>{b.time}</td>
                  <td style={{padding:'10px 8px'}}>
                    <span style={{
                      background: b.status === 'Pending' ? '#fbbf24' : b.status === 'Confirmed' ? '#10b981' : '#6b7280',
                      color: '#fff',
                      borderRadius: 6,
                      padding: '2px 10px',
                      fontWeight: 700,
                      fontSize: 13,
                    }}>{b.status}</span>
                  </td>
                  <td style={{padding:'10px 8px'}}>
                    {b.status === 'Pending' && (
                      <>
                        <button style={{background:'#10b981',color:'#fff',border:'none',borderRadius:6,padding:'6px 14px',fontWeight:700,marginRight:8,cursor:'pointer'}}>Confirm</button>
                        <button style={{background:'#ef4444',color:'#fff',border:'none',borderRadius:6,padding:'6px 14px',fontWeight:700,cursor:'pointer'}}>Cancel</button>
                      </>
                    )}
                    {b.status === 'Confirmed' && (
                      <button style={{background:'#6366f1',color:'#fff',border:'none',borderRadius:6,padding:'6px 14px',fontWeight:700,cursor:'pointer'}}>Mark Complete</button>
                    )}
                    {b.status === 'Completed' && (
                      <span style={{color:'#10b981',fontWeight:700}}>Done</span>
                    )}
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
