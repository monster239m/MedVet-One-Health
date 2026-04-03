'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { MOCK_APPOINTMENTS, MOCK_USERS } from '@/data/mockData';

const sidebarItems = [
  { label: 'Overview', items: [
    { icon: '📊', label: 'Dashboard', href: '/dashboard/admin' },
    { icon: '📈', label: 'Analytics', href: '/dashboard/admin/analytics' },
    { icon: '🔔', label: 'Alerts', href: '/dashboard/admin/alerts', badge: '3', badgeColor: 'rgba(239,68,68,0.4)' },
  ]},
  { label: 'Management', items: [
    { icon: '👥', label: 'Users', href: '/dashboard/admin/users' },
    { icon: '👨‍⚕️', label: 'Doctors', href: '/dashboard/admin/doctors' },
    { icon: '✅', label: 'Verifications', href: '/dashboard/admin/verifications', badge: '12', badgeColor: 'rgba(245,158,11,0.4)' },
    { icon: '📅', label: 'Appointments', href: '/dashboard/admin/appointments' },
  ]},
  { label: 'Operations', items: [
    { icon: '💊', label: 'Medicine Inventory', href: '/dashboard/admin/medicines' },
    { icon: '📦', label: 'Orders', href: '/dashboard/admin/orders' },
    { icon: '💰', label: 'Revenue', href: '/dashboard/admin/revenue' },
    { icon: '🎫', label: 'Support Tickets', href: '/dashboard/admin/support', badge: '34' },
  ]},
  { label: 'System', items: [
    { icon: '🔧', label: 'Settings', href: '/dashboard/admin/settings' },
    { icon: '📜', label: 'Audit Logs', href: '/dashboard/admin/logs' },
    { icon: '🛡️', label: 'Security', href: '/dashboard/admin/security' },
  ]},
];

export default function AdminAppointmentsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) return null;

  return (
    <DashboardLayout sidebarItems={sidebarItems}>
       <div style={{ marginBottom: '28px', animation: 'fadeIn 0.5s ease-out' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>Platform Appointments 📅</h1>
        <p style={{ fontSize: '15px', color: '#64748b' }}>Global view of all platform consultations</p>
      </div>

      <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', gap: '12px' }}>
           <input type="text" placeholder="Search ID..." style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none' }} />
           <select style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none' }}>
             <option>All Status</option>
             <option>Upcoming</option>
             <option>Completed</option>
           </select>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
           <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                 <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>ID / Status</th>
                 <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Patient</th>
                 <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Doctor</th>
                 <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Date & Time</th>
                 <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Fee</th>
              </tr>
           </thead>
           <tbody>
              {MOCK_APPOINTMENTS.map((apt, i) => {
                 const patient = MOCK_USERS.patients.find(p=>p.id===apt.patientId);
                 const doctor = MOCK_USERS.doctors.find(d=>d.id===apt.doctorId);
                 return (
                 <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '16px 24px' }}>
                       <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>{apt.id}</div>
                       <span style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 600, background: apt.status === 'upcoming' ? '#fef3c7' : '#dcfce7', color: apt.status === 'upcoming' ? '#d97706' : '#15803d', textTransform: 'uppercase' }}>{apt.status}</span>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                       <div style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>{patient?.name}</div>
                       <div style={{ fontSize: '12px', color: '#64748b' }}>{apt.patientType}</div>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                       <div style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>{doctor?.name}</div>
                       <div style={{ fontSize: '12px', color: '#64748b' }}>{apt.type}</div>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                       <div style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>{apt.date}</div>
                       <div style={{ fontSize: '13px', color: '#64748b' }}>{apt.time}</div>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                       <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>₹{apt.fee}</div>
                       <div style={{ fontSize: '11px', color: apt.isPaid ? '#15803d' : '#ef4444', fontWeight: 600 }}>{apt.isPaid ? 'PAID' : 'PENDING'}</div>
                    </td>
                 </tr>
                 );
              })}
           </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
