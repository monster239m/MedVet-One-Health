'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';

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

export default function AdminSupportPage() {
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
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>Support Tickets 🎫</h1>
        <p style={{ fontSize: '15px', color: '#64748b' }}>Manage user complaints and platform issues</p>
      </div>

      <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
           <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                 <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Ticket / User</th>
                 <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Issue Category</th>
                 <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Status</th>
                 <th style={{ padding: '16px 24px', textAlign: 'right', fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Actions</th>
              </tr>
           </thead>
           <tbody>
              {[
                { id: 'TKT-9901', user: 'Rahul Sharma', cat: 'Order Delay', status: 'Open', color: '#ef4444' },
                { id: 'TKT-9892', user: 'Dr. Sneha Reddy', cat: 'Payout Issue', status: 'In Progress', color: '#f59e0b' },
                { id: 'TKT-9855', user: 'Amit Verma', cat: 'App Bug', status: 'Resolved', color: '#10b981' },
              ].map((tkt, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                   <td style={{ padding: '16px 24px' }}>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>{tkt.id}</div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>{tkt.user}</div>
                   </td>
                   <td style={{ padding: '16px 24px', fontSize: '14px', fontWeight: 600, color: '#334155' }}>{tkt.cat}</td>
                   <td style={{ padding: '16px 24px' }}>
                      <span style={{ padding: '4px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 600, background: `${tkt.color}15`, color: tkt.color }}>{tkt.status}</span>
                   </td>
                   <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                      <button style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', fontSize: '12px', fontWeight: 600, cursor: 'pointer', color: '#334155' }}>Reply</button>
                   </td>
                </tr>
              ))}
           </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
