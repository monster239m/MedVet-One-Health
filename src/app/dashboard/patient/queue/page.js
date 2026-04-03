'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { MOCK_QUEUE, MOCK_USERS } from '@/data/mockData';

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

export default function QueuePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [selectedDoctor, setSelectedDoctor] = useState('DOC001');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  if (loading || !user) return null;

  const doctor = MOCK_USERS.doctors.find(d => d.id === selectedDoctor);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <DashboardLayout sidebarItems={sidebarItems}>
      <div style={{ marginBottom: '28px', animation: 'fadeIn 0.5s ease-out' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>Queue Status 📊</h1>
        <p style={{ fontSize: '15px', color: '#64748b' }}>Real-time queue tracking for your appointments</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Live Queue */}
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <div style={{
            padding: '20px 24px', borderBottom: '1px solid #e2e8f0',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>📋 Live Queue — {doctor?.name}</h3>
              <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>{doctor?.specialization} • {doctor?.hospital}</div>
            </div>
            <button onClick={handleRefresh} style={{
              padding: '6px 14px', borderRadius: '8px', background: '#f1f5f9',
              border: '1px solid #e2e8f0', fontSize: '12px', fontWeight: 500,
              cursor: 'pointer', color: '#334155', display: 'flex', alignItems: 'center', gap: '4px',
            }}>
              <span style={{ display: 'inline-block', animation: refreshing ? 'spin 1s linear infinite' : 'none' }}>🔄</span> Refresh
            </button>
          </div>

          <div style={{ padding: '16px 24px' }}>
            {MOCK_QUEUE.map((item, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '14px',
                padding: '14px', borderRadius: '12px', marginBottom: '8px',
                background: item.status === 'in-progress' ? '#eff6ff' : item.patientName === 'Rahul S.' ? '#f0fdf4' : '#f8fafc',
                border: `1px solid ${item.status === 'in-progress' ? '#bfdbfe' : item.patientName === 'Rahul S.' ? '#bbf7d0' : '#f1f5f9'}`,
                transition: 'all 0.2s',
              }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: item.status === 'in-progress' ? 'linear-gradient(135deg, #3b82f6, #2563eb)' : item.patientName === 'Rahul S.' ? 'linear-gradient(135deg, #22c55e, #16a34a)' : '#e2e8f0',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: item.status === 'in-progress' || item.patientName === 'Rahul S.' ? 'white' : '#64748b',
                  fontWeight: 800, fontSize: '13px',
                }}>#{item.position}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {item.patientName}
                    {item.patientName === 'Rahul S.' && (
                      <span style={{ padding: '1px 8px', borderRadius: '999px', fontSize: '10px', fontWeight: 700, background: '#dcfce7', color: '#15803d' }}>You</span>
                    )}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>Wait: {item.waitTime}</div>
                </div>
                <span style={{
                  padding: '4px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 600,
                  background: item.type === 'veterinary' ? '#ccfbf1' : '#e0e7ff',
                  color: item.type === 'veterinary' ? '#0d9488' : '#4338ca',
                }}>{item.type === 'veterinary' ? '🐾 Vet' : '👤 Human'}</span>
                {item.status === 'in-progress' && (
                  <span style={{
                    padding: '4px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 600,
                    background: '#dbeafe', color: '#1d4ed8',
                    animation: 'pulse 2s infinite',
                  }}>🔵 In Progress</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Your Position */}
          <div style={{
            background: 'linear-gradient(135deg, #22c55e, #16a34a)', borderRadius: '16px',
            padding: '28px', color: 'white', position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }}></div>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ fontSize: '13px', fontWeight: 600, opacity: 0.9, marginBottom: '8px' }}>Your Position</div>
              <div style={{ fontSize: '52px', fontWeight: 900, marginBottom: '4px' }}>#4</div>
              <div style={{ fontSize: '14px', opacity: 0.9 }}>Estimated Wait: ~30 minutes</div>
              <div style={{ marginTop: '16px', padding: '10px 16px', borderRadius: '10px', background: 'rgba(255,255,255,0.15)', fontSize: '13px' }}>
                💡 You&apos;ll receive a notification when it&apos;s almost your turn
              </div>
            </div>
          </div>

          {/* Queue Stats */}
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>📊 Queue Statistics</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {[
                { label: 'Total in Queue', value: '5', icon: '👥', color: '#6366f1' },
                { label: 'Avg Wait Time', value: '15 min', icon: '⏱️', color: '#14b8a6' },
                { label: 'Completed Today', value: '12', icon: '✅', color: '#22c55e' },
                { label: 'Current Patient', value: '#1', icon: '🔵', color: '#3b82f6' },
              ].map((stat, i) => (
                <div key={i} style={{ padding: '14px', borderRadius: '10px', background: '#f8fafc', textAlign: 'center' }}>
                  <div style={{ fontSize: '20px', marginBottom: '4px' }}>{stat.icon}</div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: stat.color }}>{stat.value}</div>
                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Queue Actions */}
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>⚡ Quick Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button style={{
                width: '100%', padding: '12px', borderRadius: '10px',
                background: '#fef2f2', border: '1px solid #fecaca',
                color: '#dc2626', fontWeight: 600, fontSize: '13px',
                cursor: 'pointer', textAlign: 'left',
              }}>🚨 Mark as Emergency (Priority Queue)</button>
              <button style={{
                width: '100%', padding: '12px', borderRadius: '10px',
                background: '#f1f5f9', border: '1px solid #e2e8f0',
                color: '#334155', fontWeight: 600, fontSize: '13px',
                cursor: 'pointer', textAlign: 'left',
              }}>📹 Switch to Video Consultation</button>
              <button style={{
                width: '100%', padding: '12px', borderRadius: '10px',
                background: '#f1f5f9', border: '1px solid #e2e8f0',
                color: '#334155', fontWeight: 600, fontSize: '13px',
                cursor: 'pointer', textAlign: 'left',
              }}>⏸️ Reschedule Appointment</button>
              <button style={{
                width: '100%', padding: '12px', borderRadius: '10px',
                background: '#f1f5f9', border: '1px solid #e2e8f0',
                color: '#ef4444', fontWeight: 600, fontSize: '13px',
                cursor: 'pointer', textAlign: 'left',
              }}>❌ Cancel & Leave Queue</button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
