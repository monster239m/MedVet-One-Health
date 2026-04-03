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

function DoctorPlaceholder({ title, icon, features }) {
  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>{title} {icon}</h1>
      </div>
      <div style={{
        background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0',
        padding: '60px 40px', textAlign: 'center',
      }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🚧</div>
        <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>Coming Soon</h2>
        <p style={{ fontSize: '14px', color: '#64748b', maxWidth: '500px', margin: '0 auto 32px' }}>This feature is under development. Here&apos;s what to expect:</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', maxWidth: '700px', margin: '0 auto' }}>
          {features.map((f, i) => (
            <div key={i} style={{ padding: '20px', borderRadius: '14px', background: '#f8fafc', border: '1px solid #f1f5f9' }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>{f.icon}</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>{f.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function DoctorAppointmentsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  useEffect(() => { if (!loading && (!user || user.role !== 'doctor')) router.push('/login'); }, [user, loading, router]);
  if (loading || !user) return null;
  return (
    <DashboardLayout sidebarItems={sidebarItems}>
      <DoctorPlaceholder title="Appointments" icon="📅" features={[
        { icon: '📅', label: 'Schedule View' }, { icon: '🔄', label: 'Reschedule' }, { icon: '📊', label: 'Analytics' },
      ]} />
    </DashboardLayout>
  );
}

export function DoctorPatientsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  useEffect(() => { if (!loading && (!user || user.role !== 'doctor')) router.push('/login'); }, [user, loading, router]);
  if (loading || !user) return null;
  return (
    <DashboardLayout sidebarItems={sidebarItems}>
      <DoctorPlaceholder title="My Patients" icon="👥" features={[
        { icon: '📋', label: 'Patient Records' }, { icon: '💬', label: 'Chat' }, { icon: '📊', label: 'History' },
      ]} />
    </DashboardLayout>
  );
}

export function DoctorPrescriptionsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  useEffect(() => { if (!loading && (!user || user.role !== 'doctor')) router.push('/login'); }, [user, loading, router]);
  if (loading || !user) return null;
  return (
    <DashboardLayout sidebarItems={sidebarItems}>
      <DoctorPlaceholder title="Prescriptions" icon="💊" features={[
        { icon: '✍️', label: 'Write Rx' }, { icon: '📋', label: 'Templates' }, { icon: '📤', label: 'Send to Patient' },
      ]} />
    </DashboardLayout>
  );
}

export function DoctorConsultationsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  useEffect(() => { if (!loading && (!user || user.role !== 'doctor')) router.push('/login'); }, [user, loading, router]);
  if (loading || !user) return null;
  return (
    <DashboardLayout sidebarItems={sidebarItems}>
      <DoctorPlaceholder title="Consultations" icon="📹" features={[
        { icon: '📹', label: 'Video Call' }, { icon: '💬', label: 'Chat' }, { icon: '📎', label: 'File Share' },
      ]} />
    </DashboardLayout>
  );
}

export function DoctorAnalyticsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  useEffect(() => { if (!loading && (!user || user.role !== 'doctor')) router.push('/login'); }, [user, loading, router]);
  if (loading || !user) return null;
  return (
    <DashboardLayout sidebarItems={sidebarItems}>
      <DoctorPlaceholder title="Analytics" icon="📊" features={[
        { icon: '📈', label: 'Performance' }, { icon: '💰', label: 'Revenue' }, { icon: '⭐', label: 'Ratings' },
      ]} />
    </DashboardLayout>
  );
}

export function DoctorProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  useEffect(() => { if (!loading && (!user || user.role !== 'doctor')) router.push('/login'); }, [user, loading, router]);
  if (loading || !user) return null;
  return (
    <DashboardLayout sidebarItems={sidebarItems}>
      <DoctorPlaceholder title="My Profile" icon="👤" features={[
        { icon: '✏️', label: 'Edit Info' }, { icon: '📸', label: 'Photo' }, { icon: '🕐', label: 'Availability' },
      ]} />
    </DashboardLayout>
  );
}

export function DoctorEarningsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  useEffect(() => { if (!loading && (!user || user.role !== 'doctor')) router.push('/login'); }, [user, loading, router]);
  if (loading || !user) return null;
  return (
    <DashboardLayout sidebarItems={sidebarItems}>
      <DoctorPlaceholder title="Earnings" icon="💰" features={[
        { icon: '📊', label: 'Overview' }, { icon: '💸', label: 'Withdrawals' }, { icon: '🧾', label: 'Invoices' },
      ]} />
    </DashboardLayout>
  );
}

export function DoctorReviewsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  useEffect(() => { if (!loading && (!user || user.role !== 'doctor')) router.push('/login'); }, [user, loading, router]);
  if (loading || !user) return null;
  return (
    <DashboardLayout sidebarItems={sidebarItems}>
      <DoctorPlaceholder title="Reviews" icon="⭐" features={[
        { icon: '⭐', label: 'All Reviews' }, { icon: '📊', label: 'Rating Trend' }, { icon: '💬', label: 'Respond' },
      ]} />
    </DashboardLayout>
  );
}

export function DoctorSettingsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  useEffect(() => { if (!loading && (!user || user.role !== 'doctor')) router.push('/login'); }, [user, loading, router]);
  if (loading || !user) return null;
  return (
    <DashboardLayout sidebarItems={sidebarItems}>
      <DoctorPlaceholder title="Settings" icon="⚙️" features={[
        { icon: '👤', label: 'Account' }, { icon: '🔔', label: 'Notifications' }, { icon: '🔒', label: 'Privacy' },
      ]} />
    </DashboardLayout>
  );
}
