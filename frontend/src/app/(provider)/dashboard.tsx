import DashboardLayout from '../components/DashboardLayout';

export default function ProviderDashboard() {
  return (
    <DashboardLayout role="provider">
      <div style={{padding:40}}>
        <h1 style={{fontSize:'2.2rem',fontWeight:800}}>Provider Dashboard</h1>
        <p>Upcoming bookings, stats, and quick actions for providers.</p>
      </div>
    </DashboardLayout>
  );
}
