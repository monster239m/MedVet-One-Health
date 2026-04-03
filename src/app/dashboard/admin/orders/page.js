'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { MOCK_ORDERS } from '@/data/mockData';

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

export default function AdminOrdersPage() {
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
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>Pharmacy Orders 📦</h1>
        <p style={{ fontSize: '15px', color: '#64748b' }}>Monitor medicine dispatches and active deliveries</p>
      </div>

       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
          {[
            { label: 'Processing', val: 24, color: '#f59e0b' },
            { label: 'Dispatched', val: 56, color: '#3b82f6' },
            { label: 'In Transit', val: 112, color: '#6366f1' },
            { label: 'Delivered', val: 845, color: '#10b981' }
          ].map((s, i) => (
             <div key={i} style={{ background: 'white', padding: '20px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
               <div style={{ fontSize: '13px', fontWeight: 600, color: '#64748b', marginBottom: '8px' }}>{s.label}</div>
               <div style={{ fontSize: '28px', fontWeight: 800, color: s.color }}>{s.val}</div>
             </div>
          ))}
       </div>

      <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
           <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                 <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Order Details</th>
                 <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Items</th>
                 <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Value</th>
                 <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Status</th>
                 <th style={{ padding: '16px 24px', textAlign: 'right', fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Actions</th>
              </tr>
           </thead>
           <tbody>
              {MOCK_ORDERS.map((ord, i) => (
                <tr key={ord.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                   <td style={{ padding: '16px 24px' }}>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>{ord.id}</div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>Patient: {ord.patientId}</div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>Ordered: {ord.orderDate}</div>
                   </td>
                   <td style={{ padding: '16px 24px' }}>
                      <div style={{ fontSize: '13px', color: '#0f172a', fontWeight: 500 }}>{ord.items.length} items</div>
                      <div style={{ fontSize: '11px', color: '#64748b', maxWidth: '150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {ord.items.map(it=>it.name).join(', ')}
                      </div>
                   </td>
                   <td style={{ padding: '16px 24px', fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>
                      ₹ {ord.total}
                   </td>
                   <td style={{ padding: '16px 24px' }}>
                      <span style={{ padding: '4px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 600, background: ord.status === 'delivered' ? '#dcfce7' : '#e0e7ff', color: ord.status === 'delivered' ? '#15803d' : '#4338ca', textTransform: 'capitalize' }}>
                         {ord.status}
                      </span>
                   </td>
                   <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                      <button style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', fontSize: '12px', fontWeight: 600, cursor: 'pointer', color: '#334155' }}>Manage</button>
                   </td>
                </tr>
              ))}
           </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
