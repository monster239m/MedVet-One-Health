'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { MOCK_USERS } from '@/data/mockData';

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

export default function PetsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  useEffect(() => { if (!loading && !user) router.push('/login'); }, [user, loading, router]);
  if (loading || !user) return null;

  const patient = MOCK_USERS.patients.find(p => p.id === user.id);
  const pets = patient?.pets || [];

  return (
    <DashboardLayout sidebarItems={sidebarItems}>
      <div style={{ marginBottom: '28px', animation: 'fadeIn 0.5s ease-out' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>My Pets 🐾</h1>
            <p style={{ fontSize: '15px', color: '#64748b' }}>Manage profiles and health records for your pets</p>
          </div>
          <button style={{
            padding: '10px 20px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #14b8a6, #06b6d4)',
            color: 'white', fontWeight: 600, fontSize: '14px',
            cursor: 'pointer', border: 'none',
            boxShadow: '0 4px 15px rgba(20,184,166,0.3)',
          }}>+ Add New Pet</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {pets.map((pet, i) => (
          <div key={pet.id} style={{
            background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0',
            overflow: 'hidden', animation: `fadeInUp 0.5s ease-out ${i * 0.15}s both`,
          }}>
            <div style={{
              padding: '24px', background: 'linear-gradient(135deg, rgba(20,184,166,0.08), rgba(6,182,212,0.04))',
              borderBottom: '1px solid #f1f5f9',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  width: '64px', height: '64px', borderRadius: '16px',
                  background: 'linear-gradient(135deg, #14b8a6, #06b6d4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '32px',
                }}>{pet.type === 'Dog' ? '🐕' : '🐈'}</div>
                <div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>{pet.name}</div>
                  <div style={{ fontSize: '14px', color: '#64748b' }}>{pet.breed} • {pet.age} years old</div>
                  <span style={{ display: 'inline-block', marginTop: '4px', padding: '2px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 600, background: '#dcfce7', color: '#15803d' }}>✓ Healthy</span>
                </div>
              </div>
            </div>
            <div style={{ padding: '20px 24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                {[
                  { label: 'Type', value: pet.type },
                  { label: 'Weight', value: pet.weight },
                  { label: 'Last Checkup', value: '2026-03-15' },
                  { label: 'Next Vaccine', value: '2026-05-01' },
                ].map((f,j) => (
                  <div key={j} style={{ padding: '10px', borderRadius: '8px', background: '#f8fafc' }}>
                    <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 500 }}>{f.label}</div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>{f.value}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button style={{ flex: 1, padding: '8px', borderRadius: '8px', background: '#f1f5f9', border: '1px solid #e2e8f0', fontSize: '12px', fontWeight: 600, cursor: 'pointer', color: '#334155' }}>📋 Records</button>
                <button style={{ flex: 1, padding: '8px', borderRadius: '8px', background: '#f1f5f9', border: '1px solid #e2e8f0', fontSize: '12px', fontWeight: 600, cursor: 'pointer', color: '#334155' }}>📅 Book Vet</button>
                <button style={{ flex: 1, padding: '8px', borderRadius: '8px', background: '#f1f5f9', border: '1px solid #e2e8f0', fontSize: '12px', fontWeight: 600, cursor: 'pointer', color: '#334155' }}>✏️ Edit</button>
              </div>
            </div>
          </div>
        ))}

        {/* Add Pet Card */}
        <div style={{
          borderRadius: '16px', border: '2px dashed #d1d5db',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: '48px', cursor: 'pointer', transition: 'all 0.2s',
          minHeight: '280px',
        }}
        onMouseOver={e => { e.currentTarget.style.borderColor = '#14b8a6'; e.currentTarget.style.background = 'rgba(20,184,166,0.03)'; }}
        onMouseOut={e => { e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.background = 'transparent'; }}
        >
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>➕</div>
          <div style={{ fontSize: '16px', fontWeight: 700, color: '#334155' }}>Add a New Pet</div>
          <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>Register your pet for veterinary care</div>
        </div>
      </div>
    </DashboardLayout>
  );
}
