'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { MOCK_USERS } from '@/data/mockData';

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

export default function AdminDoctorsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) return null;

  let doctors = MOCK_USERS.doctors;
  if (search) {
    doctors = doctors.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.specialization.toLowerCase().includes(search.toLowerCase()));
  }

  return (
    <DashboardLayout sidebarItems={sidebarItems}>
       <div style={{ marginBottom: '28px', animation: 'fadeIn 0.5s ease-out' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>Doctor Directory 👨‍⚕️</h1>
        <p style={{ fontSize: '15px', color: '#64748b' }}>Manage registered medical professionals</p>
      </div>

       <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
          {/* Quick Stats */}
          <div style={{ flex: 1, background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
             <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#e0e7ff', color: '#4338ca', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>👨‍⚕️</div>
             <div><div style={{ fontSize: '20px', fontWeight: 800 }}>534</div><div style={{ fontSize: '13px', color: '#64748b' }}>Total Doctors</div></div>
          </div>
          <div style={{ flex: 1, background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
             <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#ccfbf1', color: '#0d9488', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>🐾</div>
             <div><div style={{ fontSize: '20px', fontWeight: 800 }}>112</div><div style={{ fontSize: '13px', color: '#64748b' }}>Veterinarians</div></div>
          </div>
          <div style={{ flex: 1, background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
             <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>✅</div>
             <div><div style={{ fontSize: '20px', fontWeight: 800 }}>12</div><div style={{ fontSize: '13px', color: '#64748b' }}>Pending Verifications</div></div>
          </div>
       </div>

       <div style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        background: 'white', borderRadius: '12px', padding: '10px 16px',
        border: '1px solid #e2e8f0', marginBottom: '24px',
      }}>
        <span style={{ fontSize: '18px' }}>🔍</span>
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search doctors by name or specialty..."
          style={{ flex: 1, background: 'none', border: 'none', fontSize: '15px', color: '#0f172a', outline: 'none' }}
        />
      </div>

      <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
           <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                 <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Doctor Details</th>
                 <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Type</th>
                 <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Performance</th>
                 <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Status</th>
                 <th style={{ padding: '16px 24px', textAlign: 'right', fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Actions</th>
              </tr>
           </thead>
           <tbody>
              {doctors.map((d, i) => (
                <tr key={d.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' }} onMouseOver={e=>e.currentTarget.style.backgroundColor='#f8fafc'} onMouseOut={e=>e.currentTarget.style.backgroundColor='transparent'}>
                   <td style={{ padding: '16px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                         <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '14px' }}>{d.initials}</div>
                         <div>
                            <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>{d.name}</div>
                            <div style={{ fontSize: '12px', color: '#64748b' }}>{d.specialization}</div>
                         </div>
                      </div>
                   </td>
                   <td style={{ padding: '16px 24px' }}>
                      <span style={{ padding: '4px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 600, background: d.type === 'human' ? '#e0e7ff' : '#ccfbf1', color: d.type === 'human' ? '#4338ca' : '#0d9488' }}>
                         {d.type === 'human' ? '👨‍⚕️ Human' : '🐾 Veterinary'}
                      </span>
                   </td>
                   <td style={{ padding: '16px 24px' }}>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>{d.totalConsultations} Consults</div>
                      <div style={{ fontSize: '12px', color: '#f59e0b', fontWeight: 600 }}>{d.rating} ⭐</div>
                   </td>
                   <td style={{ padding: '16px 24px' }}>
                      <span style={{ padding: '4px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 600, background: '#dcfce7', color: '#15803d' }}>Verified</span>
                   </td>
                   <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                         <button style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', fontSize: '12px', fontWeight: 600, cursor: 'pointer', color: '#334155' }}>View</button>
                      </div>
                   </td>
                </tr>
              ))}
           </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
