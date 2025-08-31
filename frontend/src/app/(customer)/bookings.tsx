import DashboardLayout from '../components/DashboardLayout';

const bookings = [
  {
    id: 'BKG-101',
    provider: 'Glow Salon',
    service: 'Facial',
    date: '2025-08-30',
    time: '14:00',
    status: 'Upcoming',
  },
  {
    id: 'BKG-102',
    provider: 'Wellness Spa',
    service: 'Massage',
    date: '2025-08-25',
    time: '16:00',
    status: 'Completed',
  },
  {
    id: 'BKG-103',
    provider: 'Barber Bros',
    service: 'Haircut',
    date: '2025-08-20',
    time: '11:00',
    status: 'Cancelled',
  },
];

export default function CustomerBookings() {
  return (
    <DashboardLayout role="customer">
      <div style={{padding:40}}>
        <h1 style={{fontSize:'2.2rem',fontWeight:800,marginBottom:24}}>My Bookings</h1>
        <div style={{background:'#fff',borderRadius:12,boxShadow:'0 2px 12px rgba(0,0,0,0.04)',padding:24}}>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead>
              <tr style={{background:'#f3f4f6'}}>
                <th style={{padding:'12px 8px',textAlign:'left',fontWeight:700}}>Booking ID</th>
                <th style={{padding:'12px 8px',textAlign:'left',fontWeight:700}}>Provider</th>
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
                  <td style={{padding:'10px 8px'}}>{b.provider}</td>
                  <td style={{padding:'10px 8px'}}>{b.service}</td>
                  <td style={{padding:'10px 8px'}}>{b.date}</td>
                  <td style={{padding:'10px 8px'}}>{b.time}</td>
                  <td style={{padding:'10px 8px'}}>
                    <span style={{
                      background: b.status === 'Upcoming' ? '#10b981' : b.status === 'Completed' ? '#6b7280' : '#ef4444',
                      color: '#fff',
                      borderRadius: 6,
                      padding: '2px 10px',
                      fontWeight: 700,
                      fontSize: 13,
                    }}>{b.status}</span>
                  </td>
                  <td style={{padding:'10px 8px'}}>
                    {b.status === 'Upcoming' && (
                      <button style={{background:'#ef4444',color:'#fff',border:'none',borderRadius:6,padding:'6px 14px',fontWeight:700,cursor:'pointer'}}>Cancel</button>
                    )}
                    {b.status === 'Completed' && (
                      <button style={{background:'#10b981',color:'#fff',border:'none',borderRadius:6,padding:'6px 14px',fontWeight:700,cursor:'pointer'}}>Review</button>
                    )}
                    {b.status === 'Cancelled' && (
                      <span style={{color:'#ef4444',fontWeight:700}}>N/A</span>
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
