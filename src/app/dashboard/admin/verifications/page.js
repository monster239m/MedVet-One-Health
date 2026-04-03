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

export default function AdminVerificationsPage() {
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
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>Verifications ✅</h1>
        <p style={{ fontSize: '15px', color: '#64748b' }}>Review KYC and medical credentials for new doctors</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
         {[
           { name: 'Dr. Sarah James', type: 'Pediatrician', date: '2 hours ago', status: 'Pending Review', id: 'V-89423' },
           { name: 'Dr. Rajesh Patel', type: 'Veterinary Surgeon', date: '5 hours ago', status: 'Pending Review', id: 'V-89422' },
           { name: 'Dr. Ayesha Khan', type: 'Dermatologist', date: '1 day ago', status: 'Docs Requested', id: 'V-89419' }
         ].map((req, i) => (
           <div key={i} style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', animation: `fadeInUp 0.5s ease-out ${i*0.1}s` }}>
              <div style={{ padding: '20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <span style={{ padding: '4px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 600, background: req.status === 'Pending Review' ? '#fef3c7' : '#e0e7ff', color: req.status === 'Pending Review' ? '#d97706' : '#4338ca' }}>{req.status}</span>
                 <span style={{ fontSize: '12px', color: '#64748b' }}>{req.date}</span>
              </div>
              <div style={{ padding: '20px' }}>
                 <div style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>{req.name}</div>
                 <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '16px' }}>{req.type}</div>
                 
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#334155' }}>✔ Medical License</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#334155' }}>✔ Govt. ID (Aadhar/PAN)</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#334155' }}>✔ Clinic Registration</div>
                 </div>

                 <div style={{ display: 'flex', gap: '8px' }}>
                    <button style={{ flex: 1, padding: '8px', borderRadius: '8px', background: 'linear-gradient(135deg, #14b8a6, #06b6d4)', color: 'white', fontSize: '13px', fontWeight: 600, border: 'none', cursor: 'pointer' }}>Review</button>
                 </div>
              </div>
           </div>
         ))}
      </div>
    </DashboardLayout>
  );
}
