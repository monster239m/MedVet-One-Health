'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { MOCK_APPOINTMENTS, MOCK_USERS } from '@/data/mockData';

const sidebarItems = [
  { label: 'Main', items: [
    { icon: '📊', label: 'Dashboard', href: '/dashboard/patient' },
    { icon: '📅', label: 'Appointments', href: '/dashboard/patient/appointments' },
    { icon: '🔍', label: 'Find Doctors', href: '/dashboard/patient/doctors' },
  ]},
  { label: 'Health', items: [
    { icon: '💊', label: 'Prescriptions', href: '/dashboard/patient/prescriptions' },
    { icon: '🛒', label: 'Medicines', href: '/dashboard/patient/medicines' },
    { icon: '📋', label: 'Health Records', href: '/dashboard/patient/records' },
    { icon: '🐾', label: 'My Pets', href: '/dashboard/patient/pets' },
  ]},
  { label: 'Services', items: [
    { icon: '📊', label: 'Queue Status', href: '/dashboard/patient/queue' },
    { icon: '📦', label: 'Orders', href: '/dashboard/patient/orders', badge: '2' },
    { icon: '💬', label: 'Messages', href: '/dashboard/patient/messages', badge: '3', badgeColor: 'rgba(239,68,68,0.4)' },
    { icon: '⚙️', label: 'Settings', href: '/dashboard/patient/settings' },
  ]},
];

export default function AppointmentsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState('upcoming');

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  if (loading || !user) return null;

  const allAppts = MOCK_APPOINTMENTS.filter(a => a.patientId === user.id);
  const upcoming = allAppts.filter(a => a.status === 'upcoming');
  const completed = allAppts.filter(a => a.status === 'completed');
  const displayed = tab === 'upcoming' ? upcoming : completed;

  return (
    <DashboardLayout sidebarItems={sidebarItems}>
      <div style={{ marginBottom: '28px', animation: 'fadeIn 0.5s ease-out' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>My Appointments 📅</h1>
        <p style={{ fontSize: '15px', color: '#64748b' }}>Manage your upcoming and past appointments</p>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Upcoming', value: upcoming.length, icon: '📅', color: '#6366f1' },
          { label: 'Completed', value: completed.length, icon: '✅', color: '#22c55e' },
          { label: 'Total Spent', value: `₹${allAppts.reduce((s, a) => s + a.fee, 0).toLocaleString()}`, icon: '💰', color: '#f59e0b' },
        ].map((s, i) => (
          <div key={i} style={{
            background: 'white', borderRadius: '14px', padding: '18px 20px',
            border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '14px',
          }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: `${s.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>{s.icon}</div>
            <div>
              <div style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a' }}>{s.value}</div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>{s.label}</div>
            </div>
          </div>
        ))}
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
            const doc = MOCK_USERS.doctors.find(d => d.id === apt.doctorId);
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
                  background: apt.patientType === 'veterinary' ? 'linear-gradient(135deg, #14b8a6, #06b6d4)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontWeight: 800, fontSize: '18px', flexShrink: 0,
                }}>{doc?.initials}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>{doc?.name}</div>
                  <div style={{ fontSize: '13px', color: '#6366f1', fontWeight: 500 }}>{doc?.specialization}</div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>{apt.reason}</div>
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
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>₹{apt.fee}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {apt.status === 'upcoming' ? (
                    <>
                      <button style={{ padding: '7px 16px', borderRadius: '8px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', fontSize: '12px', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
                        {apt.type === 'Video Consultation' ? '📹 Join Call' : '📍 Directions'}
                      </button>
                      <button style={{ padding: '7px 16px', borderRadius: '8px', background: '#fef2f2', color: '#dc2626', fontSize: '12px', fontWeight: 600, border: '1px solid #fecaca', cursor: 'pointer' }}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button style={{ padding: '7px 16px', borderRadius: '8px', background: '#f1f5f9', color: '#334155', fontSize: '12px', fontWeight: 600, border: '1px solid #e2e8f0', cursor: 'pointer' }}>View Rx</button>
                      <button style={{ padding: '7px 16px', borderRadius: '8px', background: '#f1f5f9', color: '#334155', fontSize: '12px', fontWeight: 600, border: '1px solid #e2e8f0', cursor: 'pointer' }}>Rebook</button>
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
