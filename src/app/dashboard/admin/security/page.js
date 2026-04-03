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

const threatEvents = [
  { id: 1, type: 'Brute Force', ip: '103.21.58.99', attempts: 47, country: '🇮🇳 India', status: 'Blocked', time: '2 min ago', severity: 'high' },
  { id: 2, type: 'SQL Injection', ip: '185.220.101.4', attempts: 3, country: '🇩🇪 Germany', status: 'Blocked', time: '15 min ago', severity: 'critical' },
  { id: 3, type: 'XSS Attempt', ip: '45.33.32.156', attempts: 12, country: '🇺🇸 USA', status: 'Blocked', time: '1 hour ago', severity: 'high' },
  { id: 4, type: 'Rate Limiting', ip: '49.207.12.34', attempts: 210, country: '🇮🇳 India', status: 'Throttled', time: '2 hours ago', severity: 'medium' },
  { id: 5, type: 'Suspicious Login', ip: '91.108.4.123', attempts: 8, country: '🇷🇺 Russia', status: 'Flagged', time: '4 hours ago', severity: 'medium' },
];

export default function AdminSecurityPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [animReady, setAnimReady] = useState(false);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) router.push('/login');
    setTimeout(() => setAnimReady(true), 100);
  }, [user, loading, router]);

  if (loading || !user) return null;

  const securityScore = 87;

  return (
    <DashboardLayout sidebarItems={sidebarItems}>
      <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>Security Center 🛡️</h1>
          <p style={{ fontSize: '15px', color: '#64748b' }}>Platform security overview, threat monitoring & access control</p>
        </div>

        {/* Security Score + Quick Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '24px', marginBottom: '28px' }}>
          {/* Security Score Gauge */}
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '28px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#64748b', marginBottom: '20px' }}>Security Score</h3>
            <div style={{ position: 'relative', width: '160px', height: '160px', margin: '0 auto 20px' }}>
              <svg width="160" height="160" viewBox="0 0 160 160" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="80" cy="80" r="70" fill="none" stroke="#f1f5f9" strokeWidth="12" />
                <circle cx="80" cy="80" r="70" fill="none" stroke="url(#scoreGrad)" strokeWidth="12"
                  strokeDasharray={`${animReady ? (securityScore/100) * 440 : 0} 440`}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dasharray 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
                />
                <defs>
                  <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#22c55e" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                </defs>
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontSize: '36px', fontWeight: 900, color: '#0f172a' }}>{securityScore}</div>
                <div style={{ fontSize: '12px', color: '#22c55e', fontWeight: 600 }}>GOOD</div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', fontSize: '11px', color: '#64748b' }}>
              <span>🟢 0-60 Low</span><span>🟡 60-80 Medium</span><span>🟢 80+ Good</span>
            </div>
          </div>

          {/* Security Metrics Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            {[
              { label: 'Threats Blocked (24h)', value: '1,247', icon: '🛡️', color: '#22c55e', gradient: 'linear-gradient(135deg, #22c55e, #10b981)', sub: '99.8% block rate' },
              { label: 'Active Sessions', value: '3,421', icon: '👥', color: '#6366f1', gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)', sub: '342 doctors, 3,079 patients' },
              { label: 'SSL Certificate', value: 'Valid', icon: '🔒', color: '#14b8a6', gradient: 'linear-gradient(135deg, #14b8a6, #06b6d4)', sub: 'Expires: Dec 2026' },
              { label: 'Last Backup', value: '2h ago', icon: '💾', color: '#f59e0b', gradient: 'linear-gradient(135deg, #f59e0b, #f97316)', sub: 'Auto-backup every 6h' },
            ].map((m, i) => (
              <div key={i} style={{
                background: 'white', borderRadius: '14px', padding: '18px',
                border: '1px solid #e2e8f0', position: 'relative', overflow: 'hidden',
                animation: `fadeInUp 0.4s ease-out ${i * 0.1}s both`,
              }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: m.gradient }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 500, marginBottom: '6px' }}>{m.label}</div>
                    <div style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a' }}>{m.value}</div>
                    <div style={{ fontSize: '11px', color: m.color, fontWeight: 600, marginTop: '4px' }}>{m.sub}</div>
                  </div>
                  <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: `${m.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>{m.icon}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Threat Monitor */}
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', marginBottom: '24px' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>🚨 Threat Monitor — Live</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', animation: 'pulse 2s ease-in-out infinite' }} />
              <span style={{ fontSize: '12px', color: '#22c55e', fontWeight: 600 }}>Monitoring Active</span>
            </div>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                {['Threat Type', 'Source IP', 'Country', 'Attempts', 'Status', 'Time', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {threatEvents.map((threat, i) => (
                <tr key={threat.id} style={{ borderBottom: '1px solid #f1f5f9', animation: `fadeIn 0.3s ease-out ${i * 0.05}s both` }}
                  onMouseOver={e => e.currentTarget.style.backgroundColor = '#f8fafc'}
                  onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 700,
                      background: threat.severity === 'critical' ? '#fef2f2' : threat.severity === 'high' ? '#fff7ed' : '#fef3c7',
                      color: threat.severity === 'critical' ? '#dc2626' : threat.severity === 'high' ? '#ea580c' : '#92400e',
                    }}>{threat.type}</span>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '12px', fontFamily: `'JetBrains Mono', monospace`, color: '#475569' }}>{threat.ip}</td>
                  <td style={{ padding: '14px 16px', fontSize: '12px', color: '#334155' }}>{threat.country}</td>
                  <td style={{ padding: '14px 16px', fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>{threat.attempts}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      padding: '3px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 600,
                      background: threat.status === 'Blocked' ? '#dcfce7' : threat.status === 'Throttled' ? '#fef3c7' : '#fef2f2',
                      color: threat.status === 'Blocked' ? '#15803d' : threat.status === 'Throttled' ? '#92400e' : '#dc2626',
                    }}>{threat.status}</span>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '12px', color: '#94a3b8' }}>{threat.time}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <button style={{ padding: '5px 10px', borderRadius: '6px', background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>Ban IP</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Security Features */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          {[
            { title: 'Data Encryption', desc: 'AES-256 encryption at rest, TLS 1.3 in transit. All patient data encrypted with HIPAA-inspired standards.', icon: '🔐', status: 'Active', color: '#22c55e' },
            { title: 'WAF Protection', desc: 'Web Application Firewall active with OWASP Top 10 ruleset. Auto-blocks malicious requests.', icon: '🧱', status: 'Active', color: '#22c55e' },
            { title: 'DDoS Mitigation', desc: 'Cloudflare DDoS protection with rate limiting. 99.99% uptime SLA maintained.', icon: '⚡', status: 'Active', color: '#22c55e' },
            { title: 'DPDP Act 2023 Compliance', desc: 'Data Protection and Privacy compliant. User consent management and data deletion workflows active.', icon: '📋', status: 'Compliant', color: '#22c55e' },
            { title: 'SOC 2 Certification', desc: 'Security, availability, and confidentiality controls. Currently on roadmap for Q3 2026.', icon: '🏆', status: 'In Progress', color: '#f59e0b' },
            { title: 'ABDM Integration Security', desc: 'Ayushman Bharat Digital Mission secure API integration for health ID verification.', icon: '🔗', status: 'Pending', color: '#94a3b8' },
          ].map((feat, i) => (
            <div key={i} style={{
              background: 'white', borderRadius: '14px', padding: '20px',
              border: '1px solid #e2e8f0',
              animation: `fadeInUp 0.4s ease-out ${i * 0.08}s both`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div style={{ fontSize: '28px' }}>{feat.icon}</div>
                <span style={{ padding: '3px 10px', borderRadius: '999px', fontSize: '10px', fontWeight: 700, background: `${feat.color}18`, color: feat.color }}>{feat.status}</span>
              </div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>{feat.title}</div>
              <div style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.6 }}>{feat.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
