'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import AITriageCard from '@/components/AITriageCard';
import { MOCK_USERS, MOCK_APPOINTMENTS, MOCK_PRESCRIPTIONS } from '@/data/mockData';

const sidebarItems = [
  { label: 'Main', items: [
    { icon: '📊', label: 'Dashboard', href: '/dashboard/patient' },
    { icon: '🤖', label: 'AI Triage', href: '#ai-triage', badge: 'NEW', badgeColor: '#10b981' },
    { icon: '🎯', label: 'Live Demo', href: '/dashboard/patient/live-demo', badge: 'DEMO', badgeColor: 'rgba(239,68,68,0.4)' },
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

export default function PatientDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    if (!loading && (!user || user.role !== 'patient')) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');

    if (user) {
      const p = MOCK_USERS.patients.find(p => p.id === user.id);
      setPatient(p);
      const apt = MOCK_APPOINTMENTS.filter(a => a.patientId === user.id);
      setAppointments(apt);
    }
  }, [user]);

  if (loading || !user) return null;

  const upcomingAppts = appointments.filter(a => a.status === 'upcoming');
  const completedAppts = appointments.filter(a => a.status === 'completed');

  const quickActions = [
    { icon: '🔍', label: 'Find Doctor', desc: 'Search specialists', href: '/dashboard/patient/doctors', color: '#6366f1' },
    { icon: '📅', label: 'Book Appointment', desc: 'Schedule visit', href: '/dashboard/patient/doctors', color: '#14b8a6' },
    { icon: '💊', label: 'Order Medicine', desc: 'Buy prescriptions', href: '/dashboard/patient/medicines', color: '#f59e0b' },
    { icon: '🚨', label: 'Emergency', desc: '24/7 urgent care', href: '#', color: '#ef4444' },
  ];

  return (
    <DashboardLayout sidebarItems={sidebarItems}>
      {/* Welcome Section */}
      <div style={{ marginBottom: '32px', animation: 'fadeIn 0.5s ease-out' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
              {greeting}, {user.name?.split(' ')[0]} 👋
            </h1>
            <p style={{ fontSize: '15px', color: '#64748b' }}>Here&apos;s your health overview for today</p>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '8px 16px', borderRadius: '12px',
            background: 'white', border: '1px solid #e2e8f0',
            fontSize: '13px', color: '#64748b',
          }}>
            📅 {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </div>
      </div>

      {/* AI Triage Section */}
      <div id="ai-triage" style={{ marginBottom: '28px' }}>
        <AITriageCard />
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '28px' }}>
        {[
          { label: 'Upcoming Appointments', value: upcomingAppts.length, icon: '📅', change: '+1 this week', up: true, color: '#6366f1', gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)' },
          { label: 'Prescriptions Active', value: MOCK_PRESCRIPTIONS.filter(p => p.patientId === user.id).length, icon: '💊', change: 'All up to date', up: true, color: '#14b8a6', gradient: 'linear-gradient(135deg, #14b8a6, #06b6d4)' },
          { label: 'Total Consultations', value: completedAppts.length + upcomingAppts.length, icon: '🩺', change: `${completedAppts.length} completed`, up: true, color: '#f59e0b', gradient: 'linear-gradient(135deg, #f59e0b, #f97316)' },
          { label: 'Wallet Balance', value: `₹${(patient?.walletBalance || 0).toLocaleString()}`, icon: '💰', change: 'Add money →', up: true, color: '#22c55e', gradient: 'linear-gradient(135deg, #22c55e, #10b981)' },
        ].map((stat, i) => (
          <div key={i} style={{
            background: 'white', borderRadius: '16px', padding: '20px',
            border: '1px solid #e2e8f0', position: 'relative', overflow: 'hidden',
            animation: `fadeInUp 0.5s ease-out ${i * 0.1}s both`,
            transition: 'all 0.3s', cursor: 'default',
          }}
          onMouseOver={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='0 12px 30px rgba(0,0,0,0.08)'; }}
          onMouseOut={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none'; }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: stat.gradient }}></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div style={{
                width: '42px', height: '42px', borderRadius: '12px',
                background: `${stat.color}12`, display: 'flex',
                alignItems: 'center', justifyContent: 'center', fontSize: '20px',
              }}>{stat.icon}</div>
            </div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', marginBottom: '2px' }}>{stat.value}</div>
            <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>{stat.label}</div>
            <div style={{ fontSize: '12px', color: stat.color, fontWeight: 600, marginTop: '8px' }}>↗ {stat.change}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{ marginBottom: '28px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '14px' }}>Quick Actions</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
          {quickActions.map((action, i) => (
            <Link key={i} href={action.href} style={{
              display: 'flex', alignItems: 'center', gap: '14px',
              padding: '16px 18px', borderRadius: '14px',
              background: 'white', border: '1px solid #e2e8f0',
              textDecoration: 'none', transition: 'all 0.2s',
            }}
            onMouseOver={e => { e.currentTarget.style.borderColor = action.color; e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow=`0 8px 20px ${action.color}15`; }}
            onMouseOut={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none'; }}
            >
              <div style={{
                width: '44px', height: '44px', borderRadius: '12px',
                background: `${action.color}12`, display: 'flex',
                alignItems: 'center', justifyContent: 'center', fontSize: '22px',
              }}>{action.icon}</div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>{action.label}</div>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>{action.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Upcoming Appointments */}
        <div style={{
          background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0',
          padding: '24px', animation: 'fadeIn 0.5s ease-out 0.3s both',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>📅 Upcoming Appointments</h3>
            <Link href="/dashboard/patient/appointments" style={{ fontSize: '13px', color: '#6366f1', fontWeight: 600, textDecoration: 'none' }}>View All →</Link>
          </div>
          {upcomingAppts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>📭</div>
              <div style={{ fontSize: '14px', fontWeight: 500 }}>No upcoming appointments</div>
              <Link href="/dashboard/patient/doctors" style={{
                display: 'inline-block', marginTop: '12px', padding: '8px 20px',
                borderRadius: '10px', background: '#6366f1', color: 'white',
                fontSize: '13px', fontWeight: 600, textDecoration: 'none',
              }}>Book Now</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {upcomingAppts.map(apt => {
                const doctor = MOCK_USERS.doctors.find(d => d.id === apt.doctorId);
                return (
                  <div key={apt.id} style={{
                    display: 'flex', alignItems: 'center', gap: '14px',
                    padding: '14px', borderRadius: '12px',
                    background: '#f8fafc', border: '1px solid #f1f5f9',
                    transition: 'all 0.2s',
                  }}>
                    <div style={{
                      width: '44px', height: '44px', borderRadius: '12px',
                      background: apt.patientType === 'veterinary' ? 'linear-gradient(135deg, #14b8a6, #06b6d4)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'white', fontWeight: 700, fontSize: '14px', flexShrink: 0,
                    }}>{doctor?.initials}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>{doctor?.name}</div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>{doctor?.specialization} • {apt.type}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>{apt.date}</div>
                      <div style={{ fontSize: '12px', color: '#6366f1' }}>{apt.time}</div>
                    </div>
                    <div style={{
                      padding: '4px 10px', borderRadius: '999px',
                      background: apt.type === 'Video Consultation' ? '#dbeafe' : '#dcfce7',
                      color: apt.type === 'Video Consultation' ? '#1d4ed8' : '#15803d',
                      fontSize: '11px', fontWeight: 600,
                    }}>{apt.type === 'Video Consultation' ? '📹 Video' : '🏥 Visit'}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Health Score */}
          <div style={{
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: '16px',
            padding: '24px', color: 'white', position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }}></div>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ fontSize: '13px', fontWeight: 600, opacity: 0.9, marginBottom: '8px' }}>Health Score</div>
              <div style={{ fontSize: '42px', fontWeight: 900, marginBottom: '4px' }}>92<span style={{ fontSize: '20px' }}>/100</span></div>
              <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '16px' }}>Based on your latest reports</div>
              <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.2)', borderRadius: '999px' }}>
                <div style={{ width: '92%', height: '100%', background: 'white', borderRadius: '999px', transition: 'width 1s ease-out' }}></div>
              </div>
            </div>
          </div>

          {/* My Pets */}
          {patient?.pets && patient.pets.length > 0 && (
            <div style={{
              background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '20px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>🐾 My Pets</h3>
                <span style={{ fontSize: '12px', color: '#6366f1', fontWeight: 600, cursor: 'pointer' }}>+ Add</span>
              </div>
              {patient.pets.map(pet => (
                <div key={pet.id} style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '10px', borderRadius: '10px', marginBottom: '8px',
                  background: '#f8fafc',
                }}>
                  <div style={{
                    width: '38px', height: '38px', borderRadius: '10px',
                    background: 'linear-gradient(135deg, #14b8a6, #06b6d4)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '18px',
                  }}>{pet.type === 'Dog' ? '🐕' : pet.type === 'Cat' ? '🐈' : '🐾'}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>{pet.name}</div>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>{pet.breed} • {pet.age} yrs</div>
                  </div>
                  <span style={{ fontSize: '12px', color: '#22c55e', fontWeight: 500 }}>Healthy ✓</span>
                </div>
              ))}
            </div>
          )}

          {/* Recent Prescriptions */}
          <div style={{
            background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '20px',
          }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '14px' }}>💊 Recent Prescriptions</h3>
            {MOCK_PRESCRIPTIONS.filter(p => p.patientId === user.id).slice(0, 2).map(rx => {
              const doc = MOCK_USERS.doctors.find(d => d.id === rx.doctorId);
              return (
                <div key={rx.id} style={{
                  padding: '10px', borderRadius: '10px', marginBottom: '8px',
                  background: '#f8fafc', border: '1px solid #f1f5f9',
                }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a', marginBottom: '2px' }}>{rx.diagnosis}</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>By {doc?.name} • {rx.date}</div>
                  <div style={{ fontSize: '11px', color: '#6366f1', marginTop: '4px', fontWeight: 500, cursor: 'pointer' }}>View Details →</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
