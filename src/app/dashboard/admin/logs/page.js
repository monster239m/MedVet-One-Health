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

const AUDIT_LOGS = [
  { id: 'LOG001', timestamp: '2026-04-01 19:42:13', action: 'LOGIN', user: 'Admin User', role: 'admin', ip: '192.168.1.100', details: 'Admin login from Chrome/Windows', status: 'success' },
  { id: 'LOG002', timestamp: '2026-04-01 19:38:45', action: 'VERIFY_DOCTOR', user: 'Admin User', role: 'admin', ip: '192.168.1.100', details: 'Approved Dr. Priya Nair (VET-2847) registration', status: 'success' },
  { id: 'LOG003', timestamp: '2026-04-01 19:35:22', action: 'PAYMENT_RECEIVED', user: 'System', role: 'system', ip: 'razorpay-webhook', details: 'Payment ₹800 received from PAT001 for APT001 via UPI', status: 'success' },
  { id: 'LOG004', timestamp: '2026-04-01 19:30:10', action: 'APPOINTMENT_BOOKED', user: 'Rahul Sharma', role: 'patient', ip: '103.21.58.12', details: 'Booked video consultation with Dr. Arun Mehta for Apr 2', status: 'success' },
  { id: 'LOG005', timestamp: '2026-04-01 19:25:33', action: 'LOGIN_FAILED', user: 'unknown@test.com', role: 'unknown', ip: '103.21.58.99', details: 'Failed login attempt — invalid credentials (attempt 3/5)', status: 'failed' },
  { id: 'LOG006', timestamp: '2026-04-01 19:20:45', action: 'PRESCRIPTION_CREATED', user: 'Dr. Arun Mehta', role: 'doctor', ip: '192.168.1.45', details: 'Rx generated for PAT001 — Metformin 500mg, Glimepiride 2mg', status: 'success' },
  { id: 'LOG007', timestamp: '2026-04-01 19:15:12', action: 'ORDER_DISPATCHED', user: 'System', role: 'system', ip: 'internal', details: 'Order ORD002 dispatched — Pet Multivitamin, Flea & Tick Spray', status: 'success' },
  { id: 'LOG008', timestamp: '2026-04-01 19:10:28', action: 'SETTINGS_UPDATED', user: 'Admin User', role: 'admin', ip: '192.168.1.100', details: 'Updated commission rate from 12% to 15%', status: 'success' },
  { id: 'LOG009', timestamp: '2026-04-01 19:05:56', action: 'USER_REGISTERED', user: 'Amit Verma', role: 'patient', ip: '49.207.12.34', details: 'New patient registration from Mumbai — Email verified', status: 'success' },
  { id: 'LOG010', timestamp: '2026-04-01 19:00:14', action: 'RATE_LIMIT', user: 'unknown', role: 'system', ip: '103.21.58.99', details: 'Rate limit applied — 10 requests/min exceeded from IP', status: 'warning' },
  { id: 'LOG011', timestamp: '2026-04-01 18:55:30', action: 'STOCK_ALERT', user: 'System', role: 'system', ip: 'internal', details: 'Paracetamol 500mg stock below threshold (32 units remaining)', status: 'warning' },
  { id: 'LOG012', timestamp: '2026-04-01 18:50:00', action: 'BACKUP_COMPLETED', user: 'System', role: 'system', ip: 'internal', details: 'Daily MongoDB backup completed — 2.4GB compressed', status: 'success' },
  { id: 'LOG013', timestamp: '2026-04-01 18:45:18', action: 'DOCTOR_PROFILE_UPDATE', user: 'Dr. Sneha Reddy', role: 'doctor', ip: '192.168.1.67', details: 'Updated availability schedule — Added Saturday slots', status: 'success' },
  { id: 'LOG014', timestamp: '2026-04-01 18:40:05', action: 'API_ERROR', user: 'System', role: 'system', ip: 'nmc-api', details: 'NMC verification API timeout — retry scheduled in 5 min', status: 'failed' },
  { id: 'LOG015', timestamp: '2026-04-01 18:35:42', action: 'REVIEW_POSTED', user: 'Priya Patel', role: 'patient', ip: '103.21.44.78', details: '5-star review posted for Dr. Anita Desai — "Excellent care!"', status: 'success' },
];

export default function AdminAuditLogsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [filterAction, setFilterAction] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) router.push('/login');
  }, [user, loading, router]);

  if (loading || !user) return null;

  let logs = AUDIT_LOGS;
  if (search) logs = logs.filter(l => l.details.toLowerCase().includes(search.toLowerCase()) || l.user.toLowerCase().includes(search.toLowerCase()) || l.action.toLowerCase().includes(search.toLowerCase()));
  if (filterStatus !== 'all') logs = logs.filter(l => l.status === filterStatus);

  const actionColors = {
    LOGIN: '#6366f1', LOGIN_FAILED: '#ef4444', VERIFY_DOCTOR: '#22c55e', PAYMENT_RECEIVED: '#14b8a6',
    APPOINTMENT_BOOKED: '#3b82f6', PRESCRIPTION_CREATED: '#8b5cf6', ORDER_DISPATCHED: '#06b6d4',
    SETTINGS_UPDATED: '#f59e0b', USER_REGISTERED: '#10b981', RATE_LIMIT: '#f97316',
    STOCK_ALERT: '#f59e0b', BACKUP_COMPLETED: '#22c55e', DOCTOR_PROFILE_UPDATE: '#14b8a6',
    API_ERROR: '#ef4444', REVIEW_POSTED: '#f59e0b',
  };

  return (
    <DashboardLayout sidebarItems={sidebarItems}>
      <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>Audit Logs 📜</h1>
            <p style={{ fontSize: '15px', color: '#64748b' }}>Complete activity trail for platform security & compliance</p>
          </div>
          <button style={{
            padding: '8px 20px', borderRadius: '12px',
            background: '#f1f5f9', color: '#334155', fontWeight: 600, fontSize: '13px',
            border: '1px solid #e2e8f0', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
          }}>📥 Export CSV</button>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            background: 'white', borderRadius: '12px', padding: '8px 14px',
            border: '1px solid #e2e8f0', flex: 1, maxWidth: '400px',
          }}>
            <span>🔍</span>
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search logs by user, action, or details..."
              style={{ flex: 1, background: 'none', border: 'none', fontSize: '14px', color: '#0f172a', outline: 'none' }}
            />
          </div>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            style={{ padding: '8px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', background: 'white', fontSize: '13px', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
            <option value="all">All Status</option>
            <option value="success">✅ Success</option>
            <option value="failed">❌ Failed</option>
            <option value="warning">⚠️ Warning</option>
          </select>
        </div>

        {/* Stats Strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
          {[
            { label: 'Total Events', value: AUDIT_LOGS.length, color: '#6366f1' },
            { label: 'Successful', value: AUDIT_LOGS.filter(l => l.status === 'success').length, color: '#22c55e' },
            { label: 'Warnings', value: AUDIT_LOGS.filter(l => l.status === 'warning').length, color: '#f59e0b' },
            { label: 'Failures', value: AUDIT_LOGS.filter(l => l.status === 'failed').length, color: '#ef4444' },
          ].map((s, i) => (
            <div key={i} style={{ background: 'white', borderRadius: '12px', padding: '14px 18px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '8px', height: '32px', borderRadius: '4px', background: s.color }} />
              <div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>{s.value}</div>
                <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 500 }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Log Table */}
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                {['Timestamp', 'Action', 'User', 'IP Address', 'Details', 'Status'].map(h => (
                  <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {logs.map((log, i) => (
                <tr key={log.id} style={{
                  borderBottom: '1px solid #f1f5f9',
                  animation: `fadeIn 0.3s ease-out ${i * 0.03}s both`,
                  transition: 'background 0.15s',
                }}
                onMouseOver={e => e.currentTarget.style.backgroundColor = '#f8fafc'}
                onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <td style={{ padding: '12px 16px', fontSize: '12px', color: '#64748b', fontFamily: `'JetBrains Mono', monospace`, whiteSpace: 'nowrap' }}>{log.timestamp}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      padding: '3px 10px', borderRadius: '6px', fontSize: '10px', fontWeight: 700,
                      background: `${actionColors[log.action] || '#64748b'}15`,
                      color: actionColors[log.action] || '#64748b',
                      letterSpacing: '0.03em', fontFamily: `'JetBrains Mono', monospace`,
                    }}>{log.action}</span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>{log.user}</div>
                    <div style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'capitalize' }}>{log.role}</div>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '12px', color: '#64748b', fontFamily: `'JetBrains Mono', monospace` }}>{log.ip}</td>
                  <td style={{ padding: '12px 16px', fontSize: '12px', color: '#475569', maxWidth: '350px' }}>{log.details}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      padding: '3px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 600,
                      background: log.status === 'success' ? '#dcfce7' : log.status === 'failed' ? '#fef2f2' : '#fef3c7',
                      color: log.status === 'success' ? '#15803d' : log.status === 'failed' ? '#dc2626' : '#92400e',
                    }}>{log.status === 'success' ? '✅' : log.status === 'failed' ? '❌' : '⚠️'} {log.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
          <span style={{ fontSize: '13px', color: '#64748b' }}>Showing {logs.length} of {AUDIT_LOGS.length} entries</span>
          <div style={{ display: 'flex', gap: '4px' }}>
            {[1, 2, 3].map(p => (
              <button key={p} style={{
                width: '36px', height: '36px', borderRadius: '8px',
                background: p === 1 ? '#6366f1' : '#f1f5f9',
                color: p === 1 ? 'white' : '#64748b',
                border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '13px',
              }}>{p}</button>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
