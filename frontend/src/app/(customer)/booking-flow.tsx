import { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';

const services = [
  { id: 'SRV-101', name: 'Facial', price: 50 },
  { id: 'SRV-102', name: 'Haircut', price: 30 },
];

const times = ['10:00', '11:00', '12:00', '14:00', '15:00'];

export default function BookingFlow() {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState(services[0].id);
  const [selectedDate, setSelectedDate] = useState('2025-08-30');
  const [selectedTime, setSelectedTime] = useState(times[0]);
  const [confirmed, setConfirmed] = useState(false);

  return (
    <DashboardLayout role="customer">
      <h1 style={{fontSize:'2.2rem',fontWeight:800,marginBottom:24}}>Book a Service</h1>
      <div style={{background:'#fff',borderRadius:12,boxShadow:'0 2px 12px rgba(0,0,0,0.04)',padding:32,maxWidth:480,margin:'0 auto'}}>
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:32}}>
          <div style={{fontWeight:step===1?800:600,color:step===1?'#10b981':'#6b7280'}}>1. Service</div>
          <div style={{fontWeight:step===2?800:600,color:step===2?'#10b981':'#6b7280'}}>2. Time</div>
          <div style={{fontWeight:step===3?800:600,color:step===3?'#10b981':'#6b7280'}}>3. Confirm</div>
        </div>
        {step === 1 && (
          <div>
            <div style={{marginBottom:16,fontWeight:700}}>Select Service</div>
            <select value={selectedService} onChange={e=>setSelectedService(e.target.value)} style={{width:'100%',padding:12,borderRadius:8,border:'1px solid #e5e7eb',marginBottom:24}}>
              {services.map(s => (
                <option key={s.id} value={s.id}>{s.name} (${s.price})</option>
              ))}
            </select>
            <button style={{background:'#10b981',color:'#fff',border:'none',borderRadius:8,padding:'12px 32px',fontWeight:800,fontSize:16,cursor:'pointer',float:'right'}} onClick={()=>setStep(2)}>Next</button>
          </div>
        )}
        {step === 2 && (
          <div>
            <div style={{marginBottom:16,fontWeight:700}}>Pick Date & Time</div>
            <input type="date" value={selectedDate} onChange={e=>setSelectedDate(e.target.value)} style={{width:'100%',padding:12,borderRadius:8,border:'1px solid #e5e7eb',marginBottom:16}} />
            <select value={selectedTime} onChange={e=>setSelectedTime(e.target.value)} style={{width:'100%',padding:12,borderRadius:8,border:'1px solid #e5e7eb',marginBottom:24}}>
              {times.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <div style={{display:'flex',justifyContent:'space-between'}}>
              <button style={{background:'#6b7280',color:'#fff',border:'none',borderRadius:8,padding:'12px 32px',fontWeight:800,fontSize:16,cursor:'pointer'}} onClick={()=>setStep(1)}>Back</button>
              <button style={{background:'#10b981',color:'#fff',border:'none',borderRadius:8,padding:'12px 32px',fontWeight:800,fontSize:16,cursor:'pointer'}} onClick={()=>setStep(3)}>Next</button>
            </div>
          </div>
        )}
        {step === 3 && !confirmed && (
          <div>
            <div style={{marginBottom:16,fontWeight:700}}>Confirm Details</div>
            <div style={{marginBottom:8}}>Service: <b>{services.find(s=>s.id===selectedService)?.name}</b></div>
            <div style={{marginBottom:8}}>Date: <b>{selectedDate}</b></div>
            <div style={{marginBottom:24}}>Time: <b>{selectedTime}</b></div>
            <div style={{display:'flex',justifyContent:'space-between'}}>
              <button style={{background:'#6b7280',color:'#fff',border:'none',borderRadius:8,padding:'12px 32px',fontWeight:800,fontSize:16,cursor:'pointer'}} onClick={()=>setStep(2)}>Back</button>
              <button style={{background:'#10b981',color:'#fff',border:'none',borderRadius:8,padding:'12px 32px',fontWeight:800,fontSize:16,cursor:'pointer'}} onClick={()=>setConfirmed(true)}>Book</button>
            </div>
          </div>
        )}
        {step === 3 && confirmed && (
          <div style={{textAlign:'center',padding:32}}>
            <div style={{fontSize:32,color:'#10b981',fontWeight:900,marginBottom:16}}>Booking Confirmed!</div>
            <div style={{color:'#374151',fontSize:16}}>Your appointment is scheduled.<br/>Thank you for booking with Reservista.</div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
