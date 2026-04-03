'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { MOCK_USERS } from '@/data/mockData';

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

export default function DoctorPatientsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!loading && (!user || user.role !== 'doctor')) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) return null;

  let patients = MOCK_USERS.patients;
  if (search) {
    patients = patients.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase()));
  }

  return (
    <DashboardLayout sidebarItems={sidebarItems}>
      <div style={{ marginBottom: '28px', animation: 'fadeIn 0.5s ease-out' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>My Patients 👥</h1>
        <p style={{ fontSize: '15px', color: '#64748b' }}>Directory of patients you have treated</p>
      </div>

      <div style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        background: 'white', borderRadius: '12px', padding: '10px 16px',
        border: '1px solid #e2e8f0', marginBottom: '24px',
      }}>
        <span style={{ fontSize: '18px' }}>🔍</span>
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search patients by name or ID..."
          style={{ flex: 1, background: 'none', border: 'none', fontSize: '15px', color: '#0f172a', outline: 'none' }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        {patients.map((patient, i) => (
          <div key={patient.id} style={{
            background: 'white', borderRadius: '16px', padding: '24px',
            border: '1px solid #e2e8f0', transition: 'all 0.3s',
            animation: `fadeInUp 0.5s ease-out ${i * 0.1}s both`,
          }}
          onMouseOver={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='0 12px 30px rgba(0,0,0,0.08)'; }}
          onMouseOut={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none'; }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
               <div style={{
                  width: '56px', height: '56px', borderRadius: '14px',
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontWeight: 800, fontSize: '20px', flexShrink: 0,
                }}>{patient.initials}</div>
                <div>
                  <div style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>{patient.name}</div>
                  <div style={{ fontSize: '13px', color: '#64748b' }}>ID: {patient.id} • {patient.age}y</div>
                </div>
            </div>
            
            <div style={{ padding: '12px', borderRadius: '10px', background: '#f8fafc', marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', marginBottom: '4px' }}>Medical History</div>
               {patient.medicalHistory && patient.medicalHistory.length > 0 ? (
                  patient.medicalHistory.map((hist, idx) => (
                    <div key={idx} style={{ fontSize: '13px', color: '#0f172a', marginBottom: '2px' }}>• {hist}</div>
                  ))
               ) : (
                 <div style={{ fontSize: '13px', color: '#94a3b8' }}>No major history reported</div>
               )}
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={{ flex: 1, padding: '8px', borderRadius: '8px', background: '#f1f5f9', border: '1px solid #e2e8f0', fontSize: '12px', fontWeight: 600, cursor: 'pointer', color: '#334155' }}>View Profile</button>
              <button style={{ flex: 1, padding: '8px', borderRadius: '8px', background: 'linear-gradient(135deg, #14b8a6, #06b6d4)', border: 'none', color: 'white', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>Message</button>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
