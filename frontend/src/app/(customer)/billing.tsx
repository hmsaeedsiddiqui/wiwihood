import DashboardLayout from '../components/DashboardLayout';
import Footer from '../../components/Footer';

const mockPayments = [
  { id: 'PMT-001', date: '2025-08-01', amount: 50, method: 'Credit Card', status: 'Paid' },
  { id: 'PMT-002', date: '2025-07-15', amount: 80, method: 'PayPal', status: 'Paid' },
  { id: 'PMT-003', date: '2025-07-01', amount: 30, method: 'Credit Card', status: 'Refunded' },
];

export default function CustomerBilling() {
  return (
    <>
      <DashboardLayout role="customer">
        <div style={{padding:40}}>
          <h1 style={{fontSize:'2.2rem',fontWeight:800}}>Billing & Payments</h1>
          <p>View your payment history and manage billing methods.</p>
          <div style={{marginTop:32,background:'#fff',borderRadius:12,padding:24}}>
            <h2 style={{fontSize:'1.2rem',fontWeight:700,marginBottom:12}}>Payment History</h2>
            <table style={{width:'100%',borderCollapse:'collapse'}}>
              <thead>
                <tr style={{background:'#f3f4f6'}}>
                  <th style={{padding:'12px 8px',textAlign:'left',fontWeight:700}}>Payment ID</th>
                  <th style={{padding:'12px 8px',textAlign:'left',fontWeight:700}}>Date</th>
                  <th style={{padding:'12px 8px',textAlign:'left',fontWeight:700}}>Amount</th>
                  <th style={{padding:'12px 8px',textAlign:'left',fontWeight:700}}>Method</th>
                  <th style={{padding:'12px 8px',textAlign:'left',fontWeight:700}}>Status</th>
                </tr>
              </thead>
              <tbody>
                {mockPayments.map(p => (
                  <tr key={p.id} style={{borderBottom:'1px solid #e5e7eb'}}>
                    <td style={{padding:'10px 8px'}}>{p.id}</td>
                    <td style={{padding:'10px 8px'}}>{p.date}</td>
                    <td style={{padding:'10px 8px'}}>${p.amount}</td>
                    <td style={{padding:'10px 8px'}}>{p.method}</td>
                    <td style={{padding:'10px 8px',color:p.status==='Paid'?'#10b981':'#ef4444',fontWeight:700}}>{p.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </DashboardLayout>
      <Footer />
    </>
  );
}
