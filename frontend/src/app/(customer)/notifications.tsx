import DashboardLayout from '../components/DashboardLayout';
import Footer from '../../components/Footer';

const mockNotifications = [
  { id: 1, message: 'Your booking with Glow Salon is confirmed for Aug 30, 2025 at 2:00 PM.', read: false },
  { id: 2, message: 'Your payment of $50 was successful.', read: true },
  { id: 3, message: 'Reminder: Your appointment at Wellness Spa is tomorrow at 4:00 PM.', read: false },
];

export default function CustomerNotifications() {
  return (
    <>
      <DashboardLayout role="customer">
        <div style={{padding:40}}>
          <h1 style={{fontSize:'2.2rem',fontWeight:800}}>Notifications</h1>
          <div style={{marginTop:32}}>
            {mockNotifications.length === 0 ? (
              <div style={{background:'#fff',borderRadius:8,padding:24,textAlign:'center',color:'#6b7280'}}>No notifications.</div>
            ) : (
              <ul style={{listStyle:'none',padding:0}}>
                {mockNotifications.map(n => (
                  <li key={n.id} style={{background:n.read?'#f3f4f6':'#e0f7ef',borderRadius:8,padding:18,marginBottom:16,fontWeight:n.read?400:700,color:'#222'}}>
                    {n.message}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </DashboardLayout>
      <Footer />
    </>
  );
}
