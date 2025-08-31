import DashboardLayout from '../components/DashboardLayout';
import Footer from '../../components/Footer';

export default function CustomerSettings() {
  return (
    <>
      <DashboardLayout role="customer">
        <div style={{padding:40}}>
          <h1 style={{fontSize:'2.2rem',fontWeight:800}}>Settings</h1>
          <p>Manage your notification preferences, privacy, and account settings.</p>
          <div style={{marginTop:32}}>
            <h2 style={{fontSize:'1.2rem',fontWeight:700,marginBottom:12}}>Notifications</h2>
            <div style={{background:'#fff',borderRadius:8,padding:24,marginBottom:24}}>
              <label style={{display:'block',marginBottom:8}}>
                <input type="checkbox" defaultChecked /> Email Notifications
              </label>
              <label style={{display:'block',marginBottom:8}}>
                <input type="checkbox" /> SMS Notifications
              </label>
              <label style={{display:'block',marginBottom:8}}>
                <input type="checkbox" defaultChecked /> App Push Notifications
              </label>
              <button style={{background:'#10b981',color:'#fff',border:'none',borderRadius:6,padding:'8px 24px',fontWeight:700,marginTop:12}}>Save Preferences</button>
            </div>
            <h2 style={{fontSize:'1.2rem',fontWeight:700,marginBottom:12}}>Privacy</h2>
            <div style={{background:'#fff',borderRadius:8,padding:24,marginBottom:24}}>
              <label style={{display:'block',marginBottom:8}}>
                <input type="checkbox" defaultChecked /> Show my profile to providers
              </label>
              <label style={{display:'block',marginBottom:8}}>
                <input type="checkbox" /> Allow marketing emails
              </label>
              <button style={{background:'#10b981',color:'#fff',border:'none',borderRadius:6,padding:'8px 24px',fontWeight:700,marginTop:12}}>Save Privacy Settings</button>
            </div>
            <h2 style={{fontSize:'1.2rem',fontWeight:700,marginBottom:12}}>Account</h2>
            <div style={{background:'#fff',borderRadius:8,padding:24}}>
              <button style={{background:'#ef4444',color:'#fff',border:'none',borderRadius:6,padding:'8px 24px',fontWeight:700}}>Delete My Account</button>
            </div>
          </div>
        </div>
      </DashboardLayout>
      <Footer />
    </>
  );
}
