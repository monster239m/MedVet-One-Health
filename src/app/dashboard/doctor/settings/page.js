'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
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

export default function DoctorSettingsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'doctor')) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) return null;

  return (
    <DashboardLayout sidebarItems={sidebarItems}>
       <div style={{ marginBottom: '28px', animation: 'fadeIn 0.5s ease-out' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>Settings ⚙️</h1>
        <p style={{ fontSize: '15px', color: '#64748b' }}>Configure your notifications and security preferences</p>
      </div>

      <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '32px', marginBottom: '24px' }}>
         <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '20px' }}>Notification Preferences</h3>
         
         <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { title: 'New Appointment Alerts', desc: 'Get notified when a patient books a new appointment', defaultChecked: true },
              { title: 'Queue Updates', desc: 'Alerts when patients join the emergency queue', defaultChecked: true },
              { title: 'Daily Summary', desc: 'Receive a daily email with your schedule and earnings', defaultChecked: false },
              { title: 'New Reviews', desc: 'Notification when a patient leaves feedback', defaultChecked: true },
            ].map((pref, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: i < 3 ? '1px solid #f1f5f9' : 'none' }}>
                 <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>{pref.title}</div>
                    <div style={{ fontSize: '13px', color: '#64748b' }}>{pref.desc}</div>
                 </div>
                 {/* Mock Toggle */}
                 <div style={{ width: '44px', height: '24px', borderRadius: '12px', background: pref.defaultChecked ? '#14b8a6' : '#e2e8f0', position: 'relative', cursor: 'pointer' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'white', position: 'absolute', top: '2px', left: pref.defaultChecked ? '22px' : '2px', transition: 'left 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}></div>
                 </div>
              </div>
            ))}
         </div>
      </div>

      <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '32px' }}>
         <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '20px' }}>Security & Privacy</h3>
         <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
            <div>
               <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#64748b', marginBottom: '6px' }}>Change Password</label>
               <input type="password" placeholder="Current Password" style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '8px', outline: 'none' }} />
               <input type="password" placeholder="New Password" style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none' }} />
            </div>
         </div>
         <button style={{ padding: '10px 20px', borderRadius: '8px', background: '#0f172a', color: 'white', fontWeight: 600, fontSize: '14px', border: 'none', cursor: 'pointer' }}>Update Password</button>
      </div>
    </DashboardLayout>
  );
}
