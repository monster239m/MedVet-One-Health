'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { ADMIN_STATS, MOCK_USERS, MOCK_APPOINTMENTS } from '@/data/mockData';

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

const monthlyData = [
  { month: 'Oct', users: 12400, revenue: 1240000, appointments: 8200 },
  { month: 'Nov', users: 18900, revenue: 1890000, appointments: 12600 },
  { month: 'Dec', users: 25600, revenue: 2560000, appointments: 17100 },
  { month: 'Jan', users: 34200, revenue: 3420000, appointments: 22800 },
  { month: 'Feb', users: 43100, revenue: 4310000, appointments: 28700 },
  { month: 'Mar', users: 52847, revenue: 5280000, appointments: 35200 },
];

const trafficSources = [
  { label: 'Direct', percent: 35, color: '#6366f1' },
  { label: 'Organic Search', percent: 28, color: '#14b8a6' },
  { label: 'Referral', percent: 18, color: '#f59e0b' },
  { label: 'Social Media', percent: 12, color: '#f43f5e' },
  { label: 'Paid Ads', percent: 7, color: '#8b5cf6' },
];

const geoData = [
  { city: 'Mumbai', users: 12400, percent: 23 },
  { city: 'Delhi', users: 9800, percent: 19 },
  { city: 'Bangalore', users: 8200, percent: 16 },
  { city: 'Hyderabad', users: 6500, percent: 12 },
  { city: 'Chennai', users: 5400, percent: 10 },
  { city: 'Pune', users: 4200, percent: 8 },
  { city: 'Kolkata', users: 3500, percent: 7 },
  { city: 'Others', users: 2847, percent: 5 },
];

const hourlyActivity = [0.2, 0.1, 0.05, 0.03, 0.05, 0.15, 0.35, 0.55, 0.75, 0.85, 0.9, 0.88, 0.82, 0.78, 0.8, 0.85, 0.92, 0.95, 1.0, 0.88, 0.7, 0.55, 0.4, 0.3];

export default function AdminAnalyticsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [period, setPeriod] = useState('6months');
  const [animReady, setAnimReady] = useState(false);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) router.push('/login');
    setTimeout(() => setAnimReady(true), 100);
  }, [user, loading, router]);

  if (loading || !user) return null;

  const maxUsers = Math.max(...monthlyData.map(d => d.users));
  const maxRevenue = Math.max(...monthlyData.map(d => d.revenue));

  return (
    <DashboardLayout sidebarItems={sidebarItems}>
      <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>Platform Analytics 📈</h1>
            <p style={{ fontSize: '15px', color: '#64748b' }}>Deep insights into platform performance & user behavior</p>
          </div>
          <div style={{ display: 'flex', gap: '4px', background: '#f1f5f9', borderRadius: '12px', padding: '4px' }}>
            {['7days', '30days', '6months'].map(p => (
              <button key={p} onClick={() => setPeriod(p)} style={{
                padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600,
                background: period === p ? 'white' : 'transparent',
                color: period === p ? '#0f172a' : '#64748b',
                border: 'none', cursor: 'pointer',
                boxShadow: period === p ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
              }}>{p === '7days' ? '7 Days' : p === '30days' ? '30 Days' : '6 Months'}</button>
            ))}
          </div>
        </div>

        {/* KPI Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '28px' }}>
          {[
            { label: 'Total Page Views', value: '2.4M', change: '+18.2%', icon: '👁️', color: '#6366f1', gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)' },
            { label: 'Avg. Session Duration', value: '8m 42s', change: '+12.5%', icon: '⏱️', color: '#14b8a6', gradient: 'linear-gradient(135deg, #14b8a6, #06b6d4)' },
            { label: 'Bounce Rate', value: '24.3%', change: '-5.1%', icon: '📊', color: '#f59e0b', gradient: 'linear-gradient(135deg, #f59e0b, #f97316)', isNeg: true },
            { label: 'Conversion Rate', value: '12.8%', change: '+3.4%', icon: '🎯', color: '#22c55e', gradient: 'linear-gradient(135deg, #22c55e, #10b981)' },
          ].map((kpi, i) => (
            <div key={i} style={{
              background: 'white', borderRadius: '16px', padding: '20px',
              border: '1px solid #e2e8f0', position: 'relative', overflow: 'hidden',
              animation: `fadeInUp 0.5s ease-out ${i * 0.1}s both`, transition: 'all 0.3s', cursor: 'default',
            }}
            onMouseOver={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='0 12px 30px rgba(0,0,0,0.08)'; }}
            onMouseOut={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none'; }}
            >
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: kpi.gradient }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 500, marginBottom: '8px' }}>{kpi.label}</div>
                  <div style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a' }}>{kpi.value}</div>
                </div>
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: `${kpi.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>{kpi.icon}</div>
              </div>
              <div style={{ fontSize: '12px', fontWeight: 600, marginTop: '8px', color: kpi.isNeg ? '#22c55e' : '#22c55e' }}>↗ {kpi.change} vs last period</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '28px' }}>
          {/* User Growth Chart */}
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>📈 User Growth Trajectory</h3>
              <span style={{ fontSize: '12px', color: '#64748b', background: '#f1f5f9', padding: '4px 12px', borderRadius: '999px' }}>Last 6 Months</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', height: '220px', paddingBottom: '30px', position: 'relative' }}>
              {/* Y-axis labels */}
              <div style={{ position: 'absolute', left: 0, top: 0, bottom: '30px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                {[50000, 37500, 25000, 12500, 0].map(v => (
                  <span key={v} style={{ fontSize: '10px', color: '#94a3b8', width: '35px', textAlign: 'right' }}>{(v/1000)}k</span>
                ))}
              </div>
              {/* Bars */}
              <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: '12px', marginLeft: '45px', height: '100%' }}>
                {monthlyData.map((d, i) => (
                  <div key={d.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#6366f1' }}>{(d.users/1000).toFixed(1)}k</span>
                    <div style={{
                      width: '100%', borderRadius: '8px 8px 4px 4px',
                      background: 'linear-gradient(180deg, #6366f1, #8b5cf6)',
                      height: animReady ? `${(d.users / maxUsers) * 150}px` : '0px',
                      transition: `height 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 0.1}s`,
                      position: 'relative', overflow: 'hidden',
                    }}>
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)', animation: 'shimmer 2s infinite' }} />
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>{d.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Traffic Sources */}
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '24px' }}>🌐 Traffic Sources</h3>
            {/* CSS Donut */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
              <div style={{ width: '140px', height: '140px', borderRadius: '50%', position: 'relative',
                background: `conic-gradient(${trafficSources.map((s, i) => `${s.color} ${trafficSources.slice(0,i).reduce((a,b)=>a+b.percent,0)}% ${trafficSources.slice(0,i+1).reduce((a,b)=>a+b.percent,0)}%`).join(', ')})`,
              }}>
                <div style={{ position: 'absolute', inset: '30px', borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>2.4M</div>
                    <div style={{ fontSize: '10px', color: '#64748b' }}>Total Visits</div>
                  </div>
                </div>
              </div>
            </div>
            {trafficSources.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: s.color, flexShrink: 0 }} />
                <span style={{ fontSize: '13px', color: '#334155', flex: 1 }}>{s.label}</span>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>{s.percent}%</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '28px' }}>
          {/* Revenue Trend */}
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '24px' }}>💰 Revenue Trend</h3>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px', height: '180px' }}>
              {monthlyData.map((d, i) => (
                <div key={d.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: '#14b8a6' }}>₹{(d.revenue/100000).toFixed(1)}L</span>
                  <div style={{
                    width: '100%', borderRadius: '6px 6px 3px 3px',
                    background: 'linear-gradient(180deg, #14b8a6, #06b6d4)',
                    height: animReady ? `${(d.revenue / maxRevenue) * 120}px` : '0px',
                    transition: `height 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 0.12}s`,
                    opacity: 0.85,
                  }} />
                  <span style={{ fontSize: '11px', color: '#64748b' }}>{d.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Hourly Activity Heatmap */}
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '20px' }}>🕐 Hourly Activity Heatmap</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '4px' }}>
              {hourlyActivity.map((val, i) => (
                <div key={i} style={{
                  aspectRatio: '1', borderRadius: '6px',
                  background: `rgba(99, 102, 241, ${val})`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '9px', fontWeight: 600,
                  color: val > 0.5 ? 'white' : '#64748b',
                  transition: `all 0.5s ${i * 0.02}s`,
                }}>
                  {i}h
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', fontSize: '11px', color: '#64748b' }}>
              <span>🟣 Low</span><span>🟢 Peak: 6-8 PM</span><span>🟣 High</span>
            </div>
          </div>
        </div>

        {/* Geographic Distribution */}
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '20px' }}>🗺️ Geographic Distribution — Top Cities</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            {geoData.map((g, i) => (
              <div key={g.city} style={{
                padding: '16px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #f1f5f9',
                animation: `fadeInUp 0.4s ease-out ${i * 0.05}s both`,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>{g.city}</span>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#6366f1' }}>{g.percent}%</span>
                </div>
                <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>{g.users.toLocaleString()} users</div>
                <div style={{ height: '6px', borderRadius: '999px', background: '#e2e8f0', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', borderRadius: '999px',
                    background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
                    width: animReady ? `${g.percent}%` : '0%',
                    transition: `width 1s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 0.1}s`,
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performing Metrics */}
        <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          {[
            { title: 'Most Popular Specialty', value: 'General Physician', sub: '34% of all consultations', icon: '🩺', color: '#6366f1' },
            { title: 'Fastest Growing City', value: 'Hyderabad', sub: '+42% user growth MoM', icon: '🏙️', color: '#14b8a6' },
            { title: 'Peak Booking Hour', value: '10:00 AM — 12:00 PM', sub: '38% of daily bookings', icon: '⏰', color: '#f59e0b' },
          ].map((m, i) => (
            <div key={i} style={{
              background: 'white', borderRadius: '16px', padding: '20px',
              border: '1px solid #e2e8f0', display: 'flex', gap: '16px', alignItems: 'center',
            }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: `${m.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0 }}>{m.icon}</div>
              <div>
                <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>{m.title}</div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>{m.value}</div>
                <div style={{ fontSize: '12px', color: m.color, fontWeight: 600, marginTop: '2px' }}>{m.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
