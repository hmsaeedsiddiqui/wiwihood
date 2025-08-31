import DashboardLayout from '../components/DashboardLayout';

const bookings = [
  { id: 'BKG-201', customer: 'Sarah Lee', provider: 'Glow Salon', service: 'Facial', date: '2025-08-30', status: 'Confirmed', payment: 'Paid' },
  { id: 'BKG-202', customer: 'John Smith', provider: 'Barber Bros', service: 'Haircut', date: '2025-08-29', status: 'Completed', payment: 'Paid' },
  { id: 'BKG-203', customer: 'Emily Chen', provider: 'Wellness Spa', service: 'Massage', date: '2025-08-25', status: 'Cancelled', payment: 'Refunded' },
];

export default function AdminBookings() {
  return (
    <DashboardLayout role="admin">
      <div style={{padding:40}}>
        <h1 style={{fontSize:'2.2rem',fontWeight:800,marginBottom:24}}>Bookings & Payments</h1>
        <div style={{background:'#fff',borderRadius:12,boxShadow:'0 2px 12px rgba(0,0,0,0.04)',padding:24}}>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead>
              <tr style={{background:'#f3f4f6'}}>
                <th style={{padding:'12px 8px',textAlign:'left',fontWeight:700}}>Booking ID</th>
                <th style={{padding:'12px 8px',textAlign:'left',fontWeight:700}}>Customer</th>
                <th style={{padding:'12px 8px',textAlign:'left',fontWeight:700}}>Provider</th>
                <th style={{padding:'12px 8px',textAlign:'left',fontWeight:700}}>Service</th>
                <th style={{padding:'12px 8px',textAlign:'left',fontWeight:700}}>Date</th>
                <th style={{padding:'12px 8px',textAlign:'left',fontWeight:700}}>Status</th>
                <th style={{padding:'12px 8px',textAlign:'left',fontWeight:700}}>Payment</th>
                <th style={{padding:'12px 8px',textAlign:'left',fontWeight:700}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b.id} style={{borderBottom:'1px solid #e5e7eb'}}>
                  <td style={{padding:'10px 8px'}}>{b.id}</td>
                  <td style={{padding:'10px 8px'}}>{b.customer}</td>
                  <td style={{padding:'10px 8px'}}>{b.provider}</td>
                  <td style={{padding:'10px 8px'}}>{b.service}</td>
                  <td style={{padding:'10px 8px'}}>{b.date}</td>
                  <td style={{padding:'10px 8px'}}>
                    <span style={{
                      background: b.status === 'Confirmed' ? '#10b981' : b.status === 'Completed' ? '#6b7280' : '#ef4444',
                      color: '#fff',
                      borderRadius: 6,
                      padding: '2px 10px',
                      fontWeight: 700,
                      fontSize: 13,
                    }}>{b.status}</span>
                  </td>
                  <td style={{padding:'10px 8px'}}>
                    <span style={{
                      background: b.payment === 'Paid' ? '#10b981' : '#fbbf24',
                      color: '#fff',
                      borderRadius: 6,
                      padding: '2px 10px',
                      fontWeight: 700,
                      fontSize: 13,
                    }}>{b.payment}</span>
                  </td>
                  <td style={{padding:'10px 8px'}}>
                    <button style={{background:'#6366f1',color:'#fff',border:'none',borderRadius:6,padding:'6px 14px',fontWeight:700,marginRight:8,cursor:'pointer'}}>View</button>
                    {b.payment === 'Paid' && b.status === 'Cancelled' && (
                      <button style={{background:'#fbbf24',color:'#fff',border:'none',borderRadius:6,padding:'6px 14px',fontWeight:700,cursor:'pointer'}}>Refund</button>
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
