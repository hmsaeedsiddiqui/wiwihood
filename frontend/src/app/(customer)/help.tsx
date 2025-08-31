import DashboardLayout from '../components/DashboardLayout';
import Footer from '../../components/Footer';

export default function CustomerHelp() {
  return (
    <>
      <DashboardLayout role="customer">
        <div style={{padding:40}}>
          <h1 style={{fontSize:'2.2rem',fontWeight:800}}>Help Center</h1>
          <p>Find answers to common questions or contact support.</p>
          <div style={{marginTop:32}}>
            <h2 style={{fontSize:'1.2rem',fontWeight:700,marginBottom:12}}>Frequently Asked Questions</h2>
            <div style={{background:'#fff',borderRadius:8,padding:24,marginBottom:24}}>
              <strong>How do I book a service?</strong>
              <p>Browse services, select your provider, and follow the booking flow to confirm your appointment.</p>
              <strong>How do I cancel a booking?</strong>
              <p>Go to My Bookings, find your booking, and click Cancel.</p>
              <strong>How do I contact support?</strong>
              <p>Use the contact form below or email support@reservista.com.</p>
            </div>
            <h2 style={{fontSize:'1.2rem',fontWeight:700,marginBottom:12}}>Contact Support</h2>
            <form style={{background:'#fff',borderRadius:8,padding:24,maxWidth:400}}>
              <label style={{display:'block',marginBottom:8}}>Your Email</label>
              <input type="email" style={{width:'100%',padding:8,borderRadius:6,border:'1px solid #e5e7eb',marginBottom:16}} />
              <label style={{display:'block',marginBottom:8}}>Message</label>
              <textarea style={{width:'100%',padding:8,borderRadius:6,border:'1px solid #e5e7eb',marginBottom:16}} rows={4}></textarea>
              <button type="submit" style={{background:'#10b981',color:'#fff',border:'none',borderRadius:6,padding:'8px 24px',fontWeight:700}}>Send</button>
            </form>
          </div>
        </div>
      </DashboardLayout>
      <Footer />
    </>
  );
}
