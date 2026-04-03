'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
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

const MOCK_ALERTS = [
  { id: 1, type: 'critical', title: 'Payment Gateway Latency Detected', message: 'Razorpay API response time exceeded 2s threshold. Avg latency: 3.2s. Fallback to backup gateway recommended.', time: '2 min ago', category: 'System', acknowledged: false },
  { id: 2, type: 'critical', title: 'Doctor Verification Backlog', message: '12 doctor registrations pending verification for over 48 hours. SLA breach imminent.', time: '15 min ago', category: 'Operations', acknowledged: false },
  { id: 3, type: 'warning', title: 'Medicine Stock Alert — Paracetamol 500mg', message: 'Stock level below 50 units (current: 32). Auto-reorder threshold triggered.', time: '1 hour ago', category: 'Inventory', acknowledged: false },
  { id: 4, type: 'warning', title: 'Unusual Login Pattern Detected', message: 'Multiple failed login attempts from IP 103.21.xx.xx targeting doctor accounts. Rate limiting applied.', time: '2 hours ago', category: 'Security', acknowledged: true },
  { id: 5, type: 'info', title: 'Scheduled Maintenance Window', message: 'Database maintenance scheduled for tonight 2:00 AM — 4:00 AM IST. Expected downtime: ~15 min.', time: '3 hours ago', category: 'System', acknowledged: true },
  { id: 6, type: 'warning', title: 'High Support Ticket Volume', message: '34 unresolved support tickets. 8 tickets marked as urgent. Average resolution time: 4.2 hours.', time: '4 hours ago', category: 'Support', acknowledged: false },
  { id: 7, type: 'info', title: 'New Feature Deployment — Video Consultation', message: 'v2.3.0 deployed successfully to production. Video consultation WebRTC module now active.', time: '5 hours ago', category: 'Deployment', acknowledged: true },
  { id: 8, type: 'critical', title: 'SMS Gateway Quota 90% Used', message: 'Monthly SMS quota at 90% utilization (27,000/30,000). Consider upgrading plan before OTP failures.', time: '6 hours ago', category: 'System', acknowledged: false },
  { id: 9, type: 'info', title: 'Weekly Report Generated', message: 'Platform performance report for Week 13 is ready. Revenue up 18%, user registrations up 23%.', time: '8 hours ago', category: 'Reports', acknowledged: true },
  { id: 10, type: 'warning', title: 'CDN Cache Miss Rate Elevated', message: 'Cache miss rate at 34% (threshold: 20%). Static asset delivery latency increased by 180ms.', time: '10 hours ago', category: 'Performance', acknowledged: true },
];

export default function AdminAlertsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [filter, setFilter] = useState('all');
  const [alerts, setAlerts] = useState(MOCK_ALERTS);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) router.push('/login');
  }, [user, loading, router]);

  if (loading || !user) return null;

  const filtered = filter === 'all' ? alerts : alerts.filter(a => a.type === filter);
  const criticalCount = alerts.filter(a => a.type === 'critical' && !a.acknowledged).length;
  const warningCount = alerts.filter(a => a.type === 'warning' && !a.acknowledged).length;
  const unacknowledged = alerts.filter(a => !a.acknowledged).length;

  const acknowledgeAlert = (id) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, acknowledged: true } : a));
  };

  const getTypeConfig = (type) => {
    switch(type) {
      case 'critical': return { color: '#ef4444', bg: '#fef2f2', border: '#fecaca', icon: '🚨', label: 'Critical' };
      case 'warning': return { color: '#f59e0b', bg: '#fef3c7', border: '#fde68a', icon: '⚠️', label: 'Warning' };
      case 'info': return { color: '#3b82f6', bg: '#dbeafe', border: '#bfdbfe', icon: 'ℹ️', label: 'Info' };
      default: return { color: '#64748b', bg: '#f1f5f9', border: '#e2e8f0', icon: '📄', label: 'General' };
    }
  };

  return (
    <DashboardLayout sidebarItems={sidebarItems}>
      <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>System Alerts 🔔</h1>
            <p style={{ fontSize: '15px', color: '#64748b' }}>Monitor critical system events and operational alerts</p>
          </div>
          {unacknowledged > 0 && (
            <button onClick={() => setAlerts(prev => prev.map(a => ({...a, acknowledged: true})))}
              style={{
                padding: '8px 20px', borderRadius: '12px',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: 'white', fontWeight: 600, fontSize: '13px',
                border: 'none', cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(99,102,241,0.3)',
              }}>✅ Acknowledge All ({unacknowledged})</button>
          )}
        </div>

        {/* Alert Summary Strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
          {[
            { label: 'Total Alerts', value: alerts.length, icon: '🔔', color: '#6366f1', gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)' },
            { label: 'Critical', value: criticalCount, icon: '🚨', color: '#ef4444', gradient: 'linear-gradient(135deg, #ef4444, #dc2626)' },
            { label: 'Warnings', value: warningCount, icon: '⚠️', color: '#f59e0b', gradient: 'linear-gradient(135deg, #f59e0b, #f97316)' },
            { label: 'Unresolved', value: unacknowledged, icon: '📋', color: '#3b82f6', gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)' },
          ].map((s, i) => (
            <div key={i} style={{
              background: 'white', borderRadius: '14px', padding: '16px 20px',
              border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '14px',
              animation: `fadeInUp 0.4s ease-out ${i * 0.08}s both`,
            }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: `${s.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>{s.icon}</div>
              <div>
                <div style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a' }}>{s.value}</div>
                <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: '4px', background: '#f1f5f9', borderRadius: '12px', padding: '4px', marginBottom: '20px', width: 'fit-content' }}>
          {['all', 'critical', 'warning', 'info'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '8px 20px', borderRadius: '8px', fontSize: '13px', fontWeight: 600,
              background: filter === f ? 'white' : 'transparent',
              color: filter === f ? '#0f172a' : '#64748b',
              border: 'none', cursor: 'pointer', textTransform: 'capitalize',
              boxShadow: filter === f ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
            }}>{f === 'all' ? `All (${alerts.length})` : f}</button>
          ))}
        </div>

        {/* Alert List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filtered.map((alert, i) => {
            const cfg = getTypeConfig(alert.type);
            return (
              <div key={alert.id} style={{
                background: 'white', borderRadius: '14px',
                border: `1px solid ${alert.acknowledged ? '#e2e8f0' : cfg.border}`,
                borderLeft: `4px solid ${cfg.color}`,
                padding: '18px 24px',
                opacity: alert.acknowledged ? 0.65 : 1,
                animation: `fadeIn 0.4s ease-out ${i * 0.05}s both`,
                transition: 'all 0.3s',
              }}
              onMouseOver={e => { e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.06)'; }}
              onMouseOut={e => { e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '10px',
                    background: cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '18px', flexShrink: 0, marginTop: '2px',
                  }}>{cfg.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>{alert.title}</span>
                        <span style={{
                          padding: '2px 8px', borderRadius: '999px', fontSize: '10px', fontWeight: 700,
                          background: cfg.bg, color: cfg.color, textTransform: 'uppercase', letterSpacing: '0.05em',
                        }}>{cfg.label}</span>
                        <span style={{
                          padding: '2px 8px', borderRadius: '999px', fontSize: '10px', fontWeight: 600,
                          background: '#f1f5f9', color: '#64748b',
                        }}>{alert.category}</span>
                      </div>
                      <span style={{ fontSize: '12px', color: '#94a3b8', whiteSpace: 'nowrap' }}>{alert.time}</span>
                    </div>
                    <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.5, marginTop: '4px' }}>{alert.message}</p>
                    {!alert.acknowledged && (
                      <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                        <button onClick={() => acknowledgeAlert(alert.id)} style={{
                          padding: '6px 14px', borderRadius: '8px',
                          background: cfg.bg, color: cfg.color,
                          fontSize: '12px', fontWeight: 600, border: `1px solid ${cfg.border}`,
                          cursor: 'pointer', transition: 'all 0.2s',
                        }}>✅ Acknowledge</button>
                        <button style={{
                          padding: '6px 14px', borderRadius: '8px',
                          background: '#f8fafc', color: '#334155',
                          fontSize: '12px', fontWeight: 600, border: '1px solid #e2e8f0',
                          cursor: 'pointer',
                        }}>🔍 Investigate</button>
                        {alert.type === 'critical' && (
                          <button style={{
                            padding: '6px 14px', borderRadius: '8px',
                            background: '#fef2f2', color: '#dc2626',
                            fontSize: '12px', fontWeight: 600, border: '1px solid #fecaca',
                            cursor: 'pointer',
                          }}>🚀 Escalate</button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
