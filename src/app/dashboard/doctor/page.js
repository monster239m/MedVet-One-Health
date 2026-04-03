'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import { MOCK_USERS, MOCK_APPOINTMENTS, MOCK_QUEUE } from '@/data/mockData';

const sidebarItems = [
  { label: 'Main', items: [
    { icon: '📊', label: 'Dashboard', href: '/dashboard/doctor' },
    { icon: '🎯', label: 'Live Demo', href: '/dashboard/doctor/live-demo', badge: 'NEW', badgeColor: 'rgba(239,68,68,0.4)' },
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

export default function DoctorDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [doctor, setDoctor] = useState(null);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'doctor')) {
      router.push('/login');
    }
    if (user) {
      const d = MOCK_USERS.doctors.find(d => d.id === user.id);
      setDoctor(d);
    }
  }, [user, loading, router]);

  if (loading || !user || !doctor) return null;

  const todayAppts = MOCK_APPOINTMENTS.filter(a => a.doctorId === user.id && a.status === 'upcoming');

  return (
    <DashboardLayout sidebarItems={sidebarItems}>
      {/* Header */}
      <div style={{ marginBottom: '32px', animation: 'fadeIn 0.5s ease-out' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
              Welcome, {user.name} 👨‍⚕️
            </h1>
            <p style={{ fontSize: '15px', color: '#64748b' }}>
              {doctor.specialization} • {doctor.hospital}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{
              padding: '8px 16px', borderRadius: '12px',
              background: doctor.isOnline ? '#dcfce7' : '#fef2f2',
              color: doctor.isOnline ? '#15803d' : '#dc2626',
              fontSize: '13px', fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: '6px',
            }}>
              <span style={{
                width: '8px', height: '8px', borderRadius: '50%',
                background: doctor.isOnline ? '#22c55e' : '#ef4444',
                boxShadow: doctor.isOnline ? '0 0 8px rgba(34,197,94,0.5)' : 'none',
              }}></span>
              {doctor.isOnline ? 'Online' : 'Offline'}
            </div>
            <button style={{
              padding: '8px 20px', borderRadius: '12px',
              background: 'linear-gradient(135deg, #14b8a6, #06b6d4)',
              color: 'white', fontWeight: 600, fontSize: '13px',
              border: 'none', cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(20,184,166,0.3)',
            }}>📹 Start Consultation</button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '28px' }}>
        {[
          { label: 'Today\'s Patients', value: doctor.todayPatients, icon: '👥', color: '#6366f1', gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)', change: '+3 from yesterday' },
          { label: 'Total Consultations', value: doctor.totalConsultations.toLocaleString(), icon: '🩺', color: '#14b8a6', gradient: 'linear-gradient(135deg, #14b8a6, #06b6d4)', change: '+28 this week' },
          { label: 'Rating', value: `${doctor.rating} ⭐`, icon: '⭐', color: '#f59e0b', gradient: 'linear-gradient(135deg, #f59e0b, #f97316)', change: `${doctor.totalReviews} reviews` },
          { label: 'This Month Revenue', value: '₹' + (doctor.consultationFee * doctor.todayPatients * 22).toLocaleString(), icon: '💰', color: '#22c55e', gradient: 'linear-gradient(135deg, #22c55e, #10b981)', change: '+18% growth' },
        ].map((stat, i) => (
          <div key={i} style={{
            background: 'white', borderRadius: '16px', padding: '20px',
            border: '1px solid #e2e8f0', position: 'relative', overflow: 'hidden',
            animation: `fadeInUp 0.5s ease-out ${i * 0.1}s both`, transition: 'all 0.3s', cursor: 'default',
          }}
          onMouseOver={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='0 12px 30px rgba(0,0,0,0.08)'; }}
          onMouseOut={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none'; }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: stat.gradient }}></div>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: `${stat.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', marginBottom: '12px' }}>{stat.icon}</div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', marginBottom: '2px' }}>{stat.value}</div>
            <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>{stat.label}</div>
            <div style={{ fontSize: '12px', color: stat.color, fontWeight: 600, marginTop: '8px' }}>↗ {stat.change}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Today's Queue */}
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>📋 Live Queue</h3>
            <Link href="/dashboard/doctor/queue" style={{ fontSize: '13px', color: '#6366f1', fontWeight: 600, textDecoration: 'none' }}>Manage →</Link>
          </div>
          {MOCK_QUEUE.map((item, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '12px', borderRadius: '10px', marginBottom: '8px',
              background: item.status === 'in-progress' ? '#f0f9ff' : '#f8fafc',
              border: item.status === 'in-progress' ? '1px solid #bae6fd' : '1px solid #f1f5f9',
            }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%',
                background: item.status === 'in-progress' ? '#3b82f6' : '#e2e8f0',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: item.status === 'in-progress' ? 'white' : '#64748b',
                fontWeight: 700, fontSize: '13px',
              }}>#{item.position}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>{item.patientName}</div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>{item.waitTime}</div>
              </div>
              <span style={{
                padding: '3px 10px', borderRadius: '999px',
                fontSize: '11px', fontWeight: 600,
                background: item.type === 'veterinary' ? '#ccfbf1' : '#e0e7ff',
                color: item.type === 'veterinary' ? '#0d9488' : '#4338ca',
              }}>{item.type === 'veterinary' ? '🐾 Vet' : '👤 Human'}</span>
              {item.status === 'in-progress' && (
                <span style={{ padding: '3px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 600, background: '#dbeafe', color: '#1d4ed8' }}>In Progress</span>
              )}
            </div>
          ))}
        </div>

        {/* Upcoming Appointments */}
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>📅 Today&apos;s Appointments</h3>
            <Link href="/dashboard/doctor/appointments" style={{ fontSize: '13px', color: '#6366f1', fontWeight: 600, textDecoration: 'none' }}>View All →</Link>
          </div>
          {todayAppts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>✨</div>
              <div style={{ fontSize: '14px' }}>No more appointments today</div>
            </div>
          ) : (
            todayAppts.map(apt => {
              const patient = MOCK_USERS.patients.find(p => p.id === apt.patientId);
              return (
                <div key={apt.id} style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '12px', borderRadius: '10px', marginBottom: '8px',
                  background: '#f8fafc', border: '1px solid #f1f5f9',
                }}>
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '10px',
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontWeight: 700, fontSize: '13px',
                  }}>{patient?.initials}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>{patient?.name}</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>{apt.reason}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>{apt.time}</div>
                    <div style={{ fontSize: '11px', color: '#6366f1' }}>{apt.type}</div>
                  </div>
                </div>
              );
            })
          )}

          {/* Availability Schedule */}
          <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '12px' }}>Today&apos;s Schedule</div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30'].map((time, i) => {
                const isBooked = i < 4;
                const isCurrent = i === 4;
                return (
                  <div key={time} style={{
                    padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 500,
                    background: isCurrent ? '#6366f1' : isBooked ? '#fef2f2' : '#f0fdf4',
                    color: isCurrent ? 'white' : isBooked ? '#dc2626' : '#15803d',
                    border: `1px solid ${isCurrent ? '#6366f1' : isBooked ? '#fecaca' : '#bbf7d0'}`,
                  }}>{time}</div>
                );
              })}
            </div>
            <div style={{ display: 'flex', gap: '16px', marginTop: '10px', fontSize: '11px', color: '#64748b' }}>
              <span>🟥 Booked</span><span>🟦 Current</span><span>🟩 Available</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div style={{ marginTop: '24px', background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>⚡ Recent Activity</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
          {[
            { icon: '✅', text: 'Consultation completed with Amit V.', time: '30 min ago', color: '#22c55e' },
            { icon: '💊', text: 'Prescription sent for Sunita K.', time: '45 min ago', color: '#6366f1' },
            { icon: '📹', text: 'Video call scheduled with Rahul S.', time: '1 hr ago', color: '#14b8a6' },
            { icon: '⭐', text: 'New 5-star review received', time: '2 hrs ago', color: '#f59e0b' },
            { icon: '📋', text: 'Lab report reviewed for Patient #42', time: '3 hrs ago', color: '#8b5cf6' },
            { icon: '🔔', text: 'System: Schedule updated for tomorrow', time: '4 hrs ago', color: '#64748b' },
          ].map((activity, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'flex-start', gap: '10px',
              padding: '12px', borderRadius: '10px', background: '#f8fafc',
            }}>
              <span style={{ fontSize: '16px' }}>{activity.icon}</span>
              <div>
                <div style={{ fontSize: '12px', color: '#334155', lineHeight: 1.4 }}>{activity.text}</div>
                <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>{activity.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
