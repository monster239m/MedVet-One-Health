'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { MOCK_PRESCRIPTIONS, MOCK_USERS } from '@/data/mockData';

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

export default function PrescriptionsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  if (loading || !user) return null;

  const prescriptions = MOCK_PRESCRIPTIONS.filter(p => p.patientId === user.id);

  return (
    <DashboardLayout sidebarItems={sidebarItems}>
      <div style={{ marginBottom: '28px', animation: 'fadeIn 0.5s ease-out' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>My Prescriptions 💊</h1>
        <p style={{ fontSize: '15px', color: '#64748b' }}>View and manage all your prescriptions</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {prescriptions.map((rx, i) => {
          const doc = MOCK_USERS.doctors.find(d => d.id === rx.doctorId);
          return (
            <div key={rx.id} style={{
              background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0',
              overflow: 'hidden', animation: `fadeInUp 0.5s ease-out ${i * 0.15}s both`,
            }}>
              {/* Header */}
              <div style={{
                padding: '20px 24px',
                background: 'linear-gradient(135deg, rgba(99,102,241,0.05), rgba(139,92,246,0.03))',
                borderBottom: '1px solid #f1f5f9',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '12px',
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontWeight: 700, fontSize: '16px',
                  }}>{doc?.initials}</div>
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>{doc?.name}</div>
                    <div style={{ fontSize: '13px', color: '#64748b' }}>{doc?.specialization} • {rx.date}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button style={{
                    padding: '6px 14px', borderRadius: '8px', background: '#f1f5f9',
                    border: '1px solid #e2e8f0', fontSize: '12px', fontWeight: 500,
                    cursor: 'pointer', color: '#334155',
                  }}>📥 Download</button>
                  <button style={{
                    padding: '6px 14px', borderRadius: '8px', background: '#6366f1',
                    color: 'white', fontSize: '12px', fontWeight: 600,
                    cursor: 'pointer', border: 'none',
                  }}>🛒 Order Medicines</button>
                </div>
              </div>

              {/* Diagnosis */}
              <div style={{ padding: '16px 24px', borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Diagnosis</div>
                <div style={{ fontSize: '15px', fontWeight: 600, color: '#0f172a' }}>{rx.diagnosis}</div>
              </div>

              {/* Medicines Table */}
              <div style={{ padding: '0 24px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      {['Medicine', 'Dosage', 'Duration', 'Instructions'].map(h => (
                        <th key={h} style={{
                          padding: '12px 0', textAlign: 'left', fontSize: '11px', fontWeight: 600,
                          color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em',
                          borderBottom: '1px solid #f1f5f9',
                        }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rx.medicines.map((med, j) => (
                      <tr key={j}>
                        <td style={{ padding: '12px 0', fontSize: '14px', fontWeight: 600, color: '#0f172a', borderBottom: '1px solid #f8fafc' }}>💊 {med.name}</td>
                        <td style={{ padding: '12px 0', fontSize: '13px', color: '#334155', borderBottom: '1px solid #f8fafc' }}>
                          <span style={{ padding: '2px 10px', borderRadius: '999px', background: '#e0e7ff', color: '#4338ca', fontSize: '12px', fontWeight: 600 }}>{med.dosage}</span>
                        </td>
                        <td style={{ padding: '12px 0', fontSize: '13px', color: '#334155', borderBottom: '1px solid #f8fafc' }}>{med.duration}</td>
                        <td style={{ padding: '12px 0', fontSize: '13px', color: '#64748b', borderBottom: '1px solid #f8fafc' }}>{med.instructions}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Notes & Follow-up */}
              <div style={{ padding: '16px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ padding: '12px 16px', borderRadius: '10px', background: '#f8fafc' }}>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: '#64748b', marginBottom: '4px', textTransform: 'uppercase' }}>Doctor&apos;s Notes</div>
                  <div style={{ fontSize: '13px', color: '#334155', lineHeight: 1.5 }}>{rx.notes}</div>
                </div>
                <div style={{ padding: '12px 16px', borderRadius: '10px', background: '#eff6ff', border: '1px solid #bfdbfe' }}>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: '#1d4ed8', marginBottom: '4px', textTransform: 'uppercase' }}>Follow-up Date</div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#1e40af' }}>📅 {rx.followUp}</div>
                  <button style={{
                    marginTop: '8px', padding: '4px 12px', borderRadius: '6px',
                    background: '#3b82f6', color: 'white', fontSize: '11px', fontWeight: 600,
                    border: 'none', cursor: 'pointer',
                  }}>Set Reminder</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
