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

function AdminPlaceholder({ title, icon, features }) {
  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>{title} {icon}</h1>
      </div>
      <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '60px 40px', textAlign: 'center' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🚧</div>
        <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>Under Development</h2>
        <p style={{ fontSize: '14px', color: '#64748b', maxWidth: '500px', margin: '0 auto 32px' }}>This admin module is being built. Planned capabilities:</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', maxWidth: '700px', margin: '0 auto' }}>
          {features.map((f, i) => (
            <div key={i} style={{ padding: '20px', borderRadius: '14px', background: '#f8fafc', border: '1px solid #f1f5f9' }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>{f.icon}</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>{f.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function withAdmin(Component) {
  return function AdminPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    useEffect(() => { if (!loading && (!user || user.role !== 'admin')) router.push('/login'); }, [user, loading, router]);
    if (loading || !user) return null;
    return <DashboardLayout sidebarItems={sidebarItems}><Component /></DashboardLayout>;
  };
}

export const AdminAnalyticsPage = withAdmin(() => <AdminPlaceholder title="Analytics" icon="📈" features={[{ icon: '📊', label: 'Metrics' }, { icon: '📈', label: 'Trends' }, { icon: '🗺️', label: 'Geo Data' }]} />);
export const AdminAlertsPage = withAdmin(() => <AdminPlaceholder title="Alerts" icon="🔔" features={[{ icon: '⚠️', label: 'System Alerts' }, { icon: '📊', label: 'Thresholds' }, { icon: '📧', label: 'Notifications' }]} />);
export const AdminUsersPage = withAdmin(() => <AdminPlaceholder title="User Management" icon="👥" features={[{ icon: '📋', label: 'User List' }, { icon: '🔍', label: 'Search' }, { icon: '🚫', label: 'Ban/Suspend' }]} />);
export const AdminDoctorsPage = withAdmin(() => <AdminPlaceholder title="Doctor Management" icon="👨‍⚕️" features={[{ icon: '✅', label: 'Verify' }, { icon: '📋', label: 'Profiles' }, { icon: '📊', label: 'Performance' }]} />);
export const AdminVerificationsPage = withAdmin(() => <AdminPlaceholder title="Verifications" icon="✅" features={[{ icon: '📄', label: 'Documents' }, { icon: '🔍', label: 'Review' }, { icon: '✅', label: 'Approve' }]} />);
export const AdminAppointmentsPage = withAdmin(() => <AdminPlaceholder title="Appointments" icon="📅" features={[{ icon: '📅', label: 'All Bookings' }, { icon: '📊', label: 'Stats' }, { icon: '🔄', label: 'Manage' }]} />);
export const AdminMedicinesPage = withAdmin(() => <AdminPlaceholder title="Medicine Inventory" icon="💊" features={[{ icon: '📦', label: 'Stock' }, { icon: '💊', label: 'Add Items' }, { icon: '📊', label: 'Reports' }]} />);
export const AdminOrdersPage = withAdmin(() => <AdminPlaceholder title="Orders" icon="📦" features={[{ icon: '📦', label: 'All Orders' }, { icon: '🚚', label: 'Tracking' }, { icon: '↩️', label: 'Returns' }]} />);
export const AdminRevenuePage = withAdmin(() => <AdminPlaceholder title="Revenue" icon="💰" features={[{ icon: '💰', label: 'Earnings' }, { icon: '📊', label: 'Charts' }, { icon: '💸', label: 'Payouts' }]} />);
export const AdminSupportPage = withAdmin(() => <AdminPlaceholder title="Support Tickets" icon="🎫" features={[{ icon: '🎫', label: 'Tickets' }, { icon: '💬', label: 'Respond' }, { icon: '📊', label: 'Metrics' }]} />);
export const AdminSettingsPage = withAdmin(() => <AdminPlaceholder title="Settings" icon="🔧" features={[{ icon: '⚙️', label: 'General' }, { icon: '📧', label: 'Email' }, { icon: '🔑', label: 'API Keys' }]} />);
export const AdminLogsPage = withAdmin(() => <AdminPlaceholder title="Audit Logs" icon="📜" features={[{ icon: '📜', label: 'Activity' }, { icon: '🔍', label: 'Search' }, { icon: '📥', label: 'Export' }]} />);
export const AdminSecurityPage = withAdmin(() => <AdminPlaceholder title="Security" icon="🛡️" features={[{ icon: '🔒', label: 'Access Control' }, { icon: '🛡️', label: 'Firewall' }, { icon: '📊', label: 'Threats' }]} />);
