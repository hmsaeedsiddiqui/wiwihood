"use client";
import DashboardLayout from '../components/DashboardLayout';
import { useState } from 'react';

export default function AccountPage() {
  const [name, setName] = useState('Sarah Lee');
  const [email, setEmail] = useState('sarah@example.com');
  const [password, setPassword] = useState('');
  const [notifications, setNotifications] = useState(true);

  return (
    <DashboardLayout role="customer">
      <h1 style={{fontSize:'2.2rem',fontWeight:800,marginBottom:24}}>Account Settings</h1>
      <div style={{background:'#fff',borderRadius:12,boxShadow:'0 2px 12px rgba(0,0,0,0.04)',padding:32,maxWidth:480,margin:'0 auto'}}>
        <div style={{marginBottom:24}}>
          <label style={{fontWeight:700,display:'block',marginBottom:8}}>Name</label>
          <input value={name} onChange={e=>setName(e.target.value)} style={{width:'100%',padding:12,borderRadius:8,border:'1px solid #e5e7eb',marginBottom:16}} />
          <label style={{fontWeight:700,display:'block',marginBottom:8}}>Email</label>
          <input value={email} onChange={e=>setEmail(e.target.value)} style={{width:'100%',padding:12,borderRadius:8,border:'1px solid #e5e7eb',marginBottom:16}} />
          <label style={{fontWeight:700,display:'block',marginBottom:8}}>New Password</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} style={{width:'100%',padding:12,borderRadius:8,border:'1px solid #e5e7eb',marginBottom:16}} />
          <label style={{fontWeight:700,display:'block',marginBottom:8}}>Notifications</label>
          <div style={{marginBottom:16}}>
            <input type="checkbox" checked={notifications} onChange={e=>setNotifications(e.target.checked)} id="notif" />
            <label htmlFor="notif" style={{marginLeft:8}}>Email me about bookings and offers</label>
          </div>
          <button style={{background:'#10b981',color:'#fff',border:'none',borderRadius:8,padding:'12px 32px',fontWeight:800,fontSize:16,cursor:'pointer',marginTop:8}}>Save Changes</button>
        </div>
      </div>
    </DashboardLayout>
  );
}
