'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { MOCK_QUEUE } from '@/data/mockData';

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

export default function DoctorQueuePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [queue, setQueue] = useState(MOCK_QUEUE);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'doctor')) router.push('/login');
  }, [user, loading, router]);

  if (loading || !user) return null;

  const moveNext = () => {
    setQueue(prev => {
      const updated = [...prev];
      const inProgress = updated.findIndex(q => q.status === 'in-progress');
      if (inProgress >= 0) updated[inProgress].status = 'completed';
      const nextWaiting = updated.findIndex(q => q.status === 'waiting');
      if (nextWaiting >= 0) updated[nextWaiting].status = 'in-progress';
      return updated.filter(q => q.status !== 'completed');
    });
  };

  return (
    <DashboardLayout sidebarItems={sidebarItems}>
      <div style={{ marginBottom: '28px', animation: 'fadeIn 0.5s ease-out' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>Queue Management 📋</h1>
            <p style={{ fontSize: '15px', color: '#64748b' }}>Manage your patient queue in real-time</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={moveNext} style={{
              padding: '10px 20px', borderRadius: '12px',
              background: 'linear-gradient(135deg, #22c55e, #16a34a)',
              color: 'white', fontWeight: 600, fontSize: '14px',
              cursor: 'pointer', border: 'none', boxShadow: '0 4px 15px rgba(34,197,94,0.3)',
            }}>✅ Next Patient</button>
            <button style={{
              padding: '10px 20px', borderRadius: '12px',
              background: '#fef2f2', color: '#dc2626', fontWeight: 600, fontSize: '14px',
              border: '1px solid #fecaca', cursor: 'pointer',
            }}>🚨 Emergency Override</button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'In Queue', value: queue.filter(q => q.status === 'waiting').length, icon: '👥', color: '#6366f1' },
          { label: 'In Progress', value: queue.filter(q => q.status === 'in-progress').length, icon: '🔵', color: '#3b82f6' },
          { label: 'Completed Today', value: 12, icon: '✅', color: '#22c55e' },
          { label: 'Avg Wait Time', value: '15 min', icon: '⏱️', color: '#f59e0b' },
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

      {/* Queue List */}
      <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>Current Queue</h3>
        </div>
        {queue.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎉</div>
            <div style={{ fontSize: '16px', fontWeight: 600 }}>All patients have been seen!</div>
          </div>
        ) : (
          queue.map((item, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: '16px',
              padding: '16px 24px',
              background: item.status === 'in-progress' ? '#eff6ff' : 'white',
              borderBottom: '1px solid #f1f5f9',
              transition: 'all 0.2s',
            }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '50%',
                background: item.status === 'in-progress' ? 'linear-gradient(135deg, #3b82f6, #2563eb)' : '#f1f5f9',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: item.status === 'in-progress' ? 'white' : '#64748b',
                fontWeight: 800, fontSize: '14px',
              }}>#{item.position}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '15px', fontWeight: 600, color: '#0f172a' }}>{item.patientName}</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Wait: {item.waitTime}</div>
              </div>
              <span style={{
                padding: '4px 12px', borderRadius: '999px', fontSize: '11px', fontWeight: 600,
                background: item.type === 'veterinary' ? '#ccfbf1' : '#e0e7ff',
                color: item.type === 'veterinary' ? '#0d9488' : '#4338ca',
              }}>{item.type === 'veterinary' ? '🐾 Vet' : '👤 Human'}</span>
              {item.status === 'in-progress' && (
                <span style={{ padding: '4px 12px', borderRadius: '999px', fontSize: '11px', fontWeight: 600, background: '#dbeafe', color: '#1d4ed8', animation: 'pulse 2s infinite' }}>🔵 In Progress</span>
              )}
              <div style={{ display: 'flex', gap: '6px' }}>
                {item.status === 'in-progress' ? (
                  <button style={{ padding: '6px 14px', borderRadius: '8px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', fontSize: '12px', fontWeight: 600, border: 'none', cursor: 'pointer' }}>📹 Video Call</button>
                ) : (
                  <button style={{ padding: '6px 14px', borderRadius: '8px', background: '#f1f5f9', color: '#334155', fontSize: '12px', fontWeight: 600, border: '1px solid #e2e8f0', cursor: 'pointer' }}>View</button>
                )}
                <button style={{ padding: '6px 14px', borderRadius: '8px', background: '#fef2f2', color: '#dc2626', fontSize: '12px', fontWeight: 600, border: '1px solid #fecaca', cursor: 'pointer' }}>Skip</button>
              </div>
            </div>
          ))
        )}
      </div>
    </DashboardLayout>
  );
}
