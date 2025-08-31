import DashboardLayout from '../components/DashboardLayout';
import Footer from '../../components/Footer';

export default function CustomerPrivacy() {
  return (
    <>
      <DashboardLayout role="customer">
        <div style={{padding:40}}>
          <h1 style={{fontSize:'2.2rem',fontWeight:800}}>Privacy Settings</h1>
          <p>Control your privacy and data sharing preferences.</p>
          <div style={{marginTop:32,background:'#fff',borderRadius:12,padding:24,maxWidth:500}}>
            <label style={{display:'block',marginBottom:16}}>
              <input type="checkbox" defaultChecked /> Show my profile to providers
            </label>
            <label style={{display:'block',marginBottom:16}}>
              <input type="checkbox" /> Allow data analytics for service improvement
            </label>
            <label style={{display:'block',marginBottom:16}}>
              <input type="checkbox" /> Receive marketing emails
            </label>
            <button style={{background:'#10b981',color:'#fff',border:'none',borderRadius:6,padding:'8px 24px',fontWeight:700,marginTop:12}}>Save Privacy Settings</button>
          </div>
        </div>
      </DashboardLayout>
      <Footer />
    </>
  );
}
