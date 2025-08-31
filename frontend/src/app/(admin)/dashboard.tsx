import DashboardLayout from '../components/DashboardLayout';

export default function AdminDashboard() {
  return (
    <DashboardLayout role="admin">
      <div style={{padding:40}}>
        <h1 style={{fontSize:'2.2rem',fontWeight:800}}>Admin Dashboard</h1>
        <p>Analytics, quick stats, and system health overview will appear here.</p>
      </div>
    </DashboardLayout>
  );
}
