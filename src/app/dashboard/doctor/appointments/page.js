'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { MOCK_APPOINTMENTS, MOCK_USERS } from '@/data/mockData';

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

export default function DoctorAppointmentsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState('upcoming');

  useEffect(() => {
    if (!loading && (!user || user.role !== 'doctor')) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) return null;

  const allAppts = MOCK_APPOINTMENTS.filter(a => a.doctorId === user.id);
  const upcoming = allAppts.filter(a => a.status === 'upcoming');
  const completed = allAppts.filter(a => a.status === 'completed');
  const displayed = tab === 'upcoming' ? upcoming : completed;

  return (
    <DashboardLayout sidebarItems={sidebarItems}>
      <div style={{ marginBottom: '28px', animation: 'fadeIn 0.5s ease-out' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>Appointments 📅</h1>
        <p style={{ fontSize: '15px', color: '#64748b' }}>Manage your upcoming schedule and view past visits</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', background: '#f1f5f9', borderRadius: '12px', padding: '4px', marginBottom: '24px', width: 'fit-content' }}>
        {['upcoming', 'completed'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '8px 24px', borderRadius: '8px', fontSize: '14px', fontWeight: 600,
            background: tab === t ? 'white' : 'transparent',
            color: tab === t ? '#0f172a' : '#64748b',
            border: 'none', cursor: 'pointer', textTransform: 'capitalize',
            boxShadow: tab === t ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
            transition: 'all 0.2s',
          }}>{t} ({t === 'upcoming' ? upcoming.length : completed.length})</button>
        ))}
      </div>

      {/* Appointment Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {displayed.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', color: '#94a3b8' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>{tab === 'upcoming' ? '📭' : '📋'}</div>
            <div style={{ fontSize: '16px', fontWeight: 500 }}>No {tab} appointments</div>
          </div>
        ) : (
          displayed.map((apt, i) => {
            const patient = MOCK_USERS.patients.find(p => p.id === apt.patientId);
            return (
              <div key={apt.id} style={{
                background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0',
                padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '20px',
                animation: `fadeIn 0.4s ease-out ${i * 0.1}s both`, transition: 'all 0.2s',
              }}
              onMouseOver={e => { e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.06)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseOut={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div style={{
                  width: '56px', height: '56px', borderRadius: '14px',
                  background: 'linear-gradient(135deg, #14b8a6, #06b6d4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontWeight: 800, fontSize: '18px', flexShrink: 0,
                }}>{patient?.initials}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>{patient?.name}</div>
                  <div style={{ fontSize: '13px', color: '#6366f1', fontWeight: 500 }}>{apt.reason}</div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>{apt.patientType === 'veterinary' ? '🐾 Vet Patient' : '👤 Human Patient'}</div>
                </div>
                <div style={{ textAlign: 'center', padding: '8px 16px', borderRadius: '12px', background: '#f8fafc' }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>{apt.date}</div>
                  <div style={{ fontSize: '13px', color: '#6366f1', fontWeight: 500 }}>{apt.time}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                  <span style={{
                    padding: '4px 12px', borderRadius: '999px', fontSize: '11px', fontWeight: 600,
                    background: apt.type === 'Video Consultation' ? '#dbeafe' : '#dcfce7',
                    color: apt.type === 'Video Consultation' ? '#1d4ed8' : '#15803d',
                  }}>{apt.type === 'Video Consultation' ? '📹 Video' : '🏥 In-Person'}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {apt.status === 'upcoming' ? (
                    <>
                      <button style={{ padding: '7px 16px', borderRadius: '8px', background: 'linear-gradient(135deg, #14b8a6, #06b6d4)', color: 'white', fontSize: '12px', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
                        Start Checkup
                      </button>
                      <button style={{ padding: '7px 16px', borderRadius: '8px', background: '#fef2f2', color: '#dc2626', fontSize: '12px', fontWeight: 600, border: '1px solid #fecaca', cursor: 'pointer' }}>Reschedule</button>
                    </>
                  ) : (
                    <>
                      <button style={{ padding: '7px 16px', borderRadius: '8px', background: '#f1f5f9', color: '#334155', fontSize: '12px', fontWeight: 600, border: '1px solid #e2e8f0', cursor: 'pointer' }}>View Details</button>
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </DashboardLayout>
  );
}
