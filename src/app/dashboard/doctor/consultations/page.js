'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';

const sidebarItems = [
  { label: 'Main', items: [
    { icon: '📊', label: 'Dashboard', href: '/dashboard/doctor' },
    { icon: '📅', label: 'Appointments', href: '/dashboard/doctor/appointments' },
    { icon: '👥', label: 'My Patients', href: '/dashboard/doctor/patients' },
  ]},
  { label: 'Practice', items: [
    { icon: '📋', label: 'Queue Management', href: '/dashboard/doctor/queue' },
    { icon: '💊', label: 'Prescriptions', href: '/dashboard/doctor/prescriptions' },
    { icon: '📹', label: 'Consultations', href: '/dashboard/doctor/consultations' },
    { icon: '📊', label: 'Analytics', href: '/dashboard/doctor/analytics' },
  ]},
  { label: 'Account', items: [
    { icon: '👤', label: 'My Profile', href: '/dashboard/doctor/profile' },
    { icon: '💰', label: 'Earnings', href: '/dashboard/doctor/earnings' },
    { icon: '⭐', label: 'Reviews', href: '/dashboard/doctor/reviews' },
    { icon: '⚙️', label: 'Settings', href: '/dashboard/doctor/settings' },
  ]},
];

export default function DoctorConsultationsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeCall, setActiveCall] = useState(false);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'doctor')) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) return null;

  if (activeCall) {
    return (
      <div style={{ position: 'fixed', inset: 0, background: '#0f172a', zIndex: 9999, display: 'flex', flexDirection: 'column' }}>
        {/* Top Bar */}
        <div style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.5)' }}>
          <div style={{ color: 'white', fontWeight: 700, fontSize: '18px' }}>MedVet Meet • Consultation with Rahul Sharma</div>
          <div style={{ color: '#ef4444', fontWeight: 600 }}>04:23</div>
        </div>

        {/* Video Area */}
        <div style={{ flex: 1, display: 'flex', padding: '24px', gap: '24px' }}>
          <div style={{ flex: 3, background: '#1e293b', borderRadius: '16px', border: '1px solid #334155', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontSize: '100px', opacity: 0.5 }}>👤</div>
            <div style={{ position: 'absolute', bottom: '20px', left: '20px', background: 'rgba(0,0,0,0.6)', padding: '6px 12px', borderRadius: '8px', color: 'white', fontSize: '14px', fontWeight: 600 }}>Rahul Sharma (Patient)</div>
          </div>
          
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
             <div style={{ height: '30%', background: '#1e293b', borderRadius: '16px', border: '1px solid #334155', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <div style={{ fontSize: '60px', opacity: 0.5 }}>👨‍⚕️</div>
               <div style={{ position: 'absolute', bottom: '10px', left: '10px', background: 'rgba(0,0,0,0.6)', padding: '4px 8px', borderRadius: '6px', color: 'white', fontSize: '12px', fontWeight: 600 }}>You</div>
             </div>
             <div style={{ flex: 1, background: 'white', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', marginBottom: '12px' }}>Chat & Notes</h3>
                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ background: '#f1f5f9', padding: '10px', borderRadius: '8px', fontSize: '13px', alignSelf: 'flex-start', maxWidth: '80%' }}>Hello Doctor. I have shared my blood reports.</div>
                  <div style={{ background: '#eff6ff', padding: '10px', borderRadius: '8px', fontSize: '13px', alignSelf: 'flex-end', maxWidth: '80%', color: '#1d4ed8' }}>Got it. Taking a look now.</div>
                </div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                  <input type="text" placeholder="Type a message..." style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none' }} />
                  <button style={{ padding: '10px 16px', background: '#6366f1', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>Send</button>
                </div>
             </div>
          </div>
        </div>

        {/* Controls */}
        <div style={{ padding: '24px', display: 'flex', justifyContent: 'center', gap: '16px', background: 'rgba(0,0,0,0.5)' }}>
          <button style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', fontSize: '24px', cursor: 'pointer' }}>🎤</button>
          <button style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', fontSize: '24px', cursor: 'pointer' }}>📷</button>
          <button style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', fontSize: '24px', cursor: 'pointer' }}>🖥️</button>
          <button onClick={() => setActiveCall(false)} style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#ef4444', border: 'none', color: 'white', fontSize: '24px', cursor: 'pointer' }}>📞</button>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout sidebarItems={sidebarItems}>
      <div style={{ marginBottom: '28px', animation: 'fadeIn 0.5s ease-out' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>Video Consultations 📹</h1>
        <p style={{ fontSize: '15px', color: '#64748b' }}>Conduct virtual appointments directly from the platform</p>
      </div>

      <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '40px', textAlign: 'center', animation: 'fadeInUp 0.5s ease-out' }}>
         <div style={{ fontSize: '64px', marginBottom: '20px' }}>📹</div>
         <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', marginBottom: '12px' }}>Start a Virtual Consultation</h2>
         <p style={{ fontSize: '15px', color: '#64748b', maxWidth: '400px', margin: '0 auto 32px' }}>You have an upcoming video consultation with Rahul Sharma scheduled in 5 minutes.</p>
         <button onClick={() => setActiveCall(true)} style={{
            padding: '14px 32px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #14b8a6, #06b6d4)',
            color: 'white', fontWeight: 700, fontSize: '16px',
            cursor: 'pointer', border: 'none', boxShadow: '0 8px 25px rgba(20,184,166,0.3)',
            transition: 'transform 0.2s',
         }}
         onMouseOver={e => e.currentTarget.style.transform='scale(1.05)'}
         onMouseOut={e => e.currentTarget.style.transform='scale(1)'}
         >
           Join Consultation Room
         </button>
      </div>
    </DashboardLayout>
  );
}
