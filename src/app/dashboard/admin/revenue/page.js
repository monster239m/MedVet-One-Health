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

export default function AdminRevenuePage() {
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
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>Platform Revenue 💰</h1>
        <p style={{ fontSize: '15px', color: '#64748b' }}>Financial overview, commissions, and payouts</p>
      </div>

       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '24px' }}>
         <div style={{ background: 'linear-gradient(135deg, #0f172a, #334155)', borderRadius: '16px', padding: '24px', color: 'white', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', right: '-20px', top: '-20px', fontSize: '100px', opacity: 0.1 }}>💳</div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#e2e8f0', marginBottom: '8px' }}>Total Gross Volume (YTD)</div>
            <div style={{ fontSize: '36px', fontWeight: 800, marginBottom: '8px' }}>₹ 156.8 L</div>
            <div style={{ fontSize: '13px', color: '#22c55e', fontWeight: 600 }}>+23.5% vs Last Year</div>
         </div>
         <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
             <div style={{ fontSize: '14px', fontWeight: 600, color: '#64748b', marginBottom: '8px' }}>Platform Commission (15%)</div>
             <div style={{ fontSize: '32px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>₹ 23.5 L</div>
             <div style={{ fontSize: '13px', color: '#14b8a6', fontWeight: 600 }}>Core platform revenue</div>
         </div>
         <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
             <div style={{ fontSize: '14px', fontWeight: 600, color: '#64748b', marginBottom: '8px' }}>Pharmacy Margin (20%)</div>
             <div style={{ fontSize: '32px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>₹ 8.2 L</div>
             <div style={{ fontSize: '13px', color: '#6366f1', fontWeight: 600 }}>From medicine sales</div>
         </div>
      </div>

      <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '32px' }}>
         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>Monthly Revenue Split</h3>
         </div>
         
         <div style={{ display: 'flex', alignItems: 'flex-end', gap: '32px', height: '300px', paddingBottom: '20px', borderBottom: '1px solid #f1f5f9' }}>
            {[
              { month: 'Oct', c: 40, p: 20 }, { month: 'Nov', c: 50, p: 25 }, { month: 'Dec', c: 45, p: 30 },
              { month: 'Jan', c: 65, p: 35 }, { month: 'Feb', c: 80, p: 40 }, { month: 'Mar', c: 100, p: 50 }
            ].map(bar => (
               <div key={bar.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                 <div style={{ fontSize: '11px', fontWeight: 600, color: '#64748b' }}>₹{bar.c + bar.p}K</div>
                 <div style={{ height: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', width: '100%' }}>
                    <div style={{ width: '100%', background: '#14b8a6', height: `${bar.p}%`, borderRadius: '4px 4px 0 0', opacity: 0.9 }}></div>
                    <div style={{ width: '100%', background: '#6366f1', height: `${bar.c}%`, borderRadius: '0', opacity: 0.9 }}></div>
                 </div>
                 <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>{bar.month}</div>
               </div>
            ))}
         </div>
         <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: '12px', height: '12px', background: '#6366f1', borderRadius: '3px' }}></div><span style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>Commissions</span></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: '12px', height: '12px', background: '#14b8a6', borderRadius: '3px' }}></div><span style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>Pharmacy</span></div>
         </div>
      </div>
    </DashboardLayout>
  );
}
