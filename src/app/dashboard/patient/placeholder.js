'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';

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

function PlaceholderPage({ title, icon, description, features }) {
  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>{title} {icon}</h1>
        <p style={{ fontSize: '15px', color: '#64748b' }}>{description}</p>
      </div>
      <div style={{
        background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0',
        padding: '60px 40px', textAlign: 'center',
      }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🚧</div>
        <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>Coming Soon</h2>
        <p style={{ fontSize: '14px', color: '#64748b', maxWidth: '500px', margin: '0 auto 32px', lineHeight: 1.6 }}>
          This feature is under active development and will be available soon. Here&apos;s what to expect:
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', maxWidth: '700px', margin: '0 auto' }}>
          {features.map((f, i) => (
            <div key={i} style={{
              padding: '20px', borderRadius: '14px', background: '#f8fafc',
              border: '1px solid #f1f5f9',
            }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>{f.icon}</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>{f.label}</div>
              <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>{f.desc}</div>
            </div>
          ))}
        </div>
        <div style={{
          marginTop: '32px', padding: '12px 24px', borderRadius: '12px',
          background: '#eff6ff', border: '1px solid #bfdbfe', display: 'inline-block',
          fontSize: '13px', color: '#1d4ed8', fontWeight: 500,
        }}>🔔 We&apos;ll notify you when this feature launches!</div>
      </div>
    </div>
  );
}

export function RecordsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  useEffect(() => { if (!loading && !user) router.push('/login'); }, [user, loading, router]);
  if (loading || !user) return null;

  return (
    <DashboardLayout sidebarItems={sidebarItems}>
      <PlaceholderPage
        title="Health Records" icon="📋" description="Digital health records for you and your pets"
        features={[
          { icon: '📊', label: 'Lab Reports', desc: 'Upload & view results' },
          { icon: '🏥', label: 'Visit History', desc: 'Complete timeline' },
          { icon: '📱', label: 'Share Records', desc: 'Securely with doctors' },
        ]}
      />
    </DashboardLayout>
  );
}

export function MessagesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  useEffect(() => { if (!loading && !user) router.push('/login'); }, [user, loading, router]);
  if (loading || !user) return null;

  return (
    <DashboardLayout sidebarItems={sidebarItems}>
      <PlaceholderPage
        title="Messages" icon="💬" description="Chat with your doctors securely"
        features={[
          { icon: '💬', label: 'Direct Chat', desc: 'Message your doctors' },
          { icon: '📎', label: 'File Sharing', desc: 'Send reports & images' },
          { icon: '🔒', label: 'Encrypted', desc: 'End-to-end secure' },
        ]}
      />
    </DashboardLayout>
  );
}
