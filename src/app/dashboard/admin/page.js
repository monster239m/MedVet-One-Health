'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import AdminAnalyticsDashboard from '@/components/AdminAnalyticsDashboard';
import { ADMIN_STATS, MOCK_USERS } from '@/data/mockData';

const sidebarItems = [
  { label: 'Overview', items: [
    { icon: '📊', label: 'Dashboard', href: '/dashboard/admin' },
    { icon: '🎯', label: 'Live Demo', href: '/dashboard/admin/live-demo', badge: 'NEW', badgeColor: 'rgba(239,68,68,0.4)' },
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

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) return null;

  const stats = ADMIN_STATS;

  return (
    <DashboardLayout sidebarItems={sidebarItems}>
      {/* Header */}
      <div style={{ marginBottom: '32px', animation: 'fadeIn 0.5s ease-out' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
              Admin Dashboard 🛡️
            </h1>
            <p style={{ fontSize: '15px', color: '#64748b' }}>Platform overview and management console</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button style={{
              padding: '8px 16px', borderRadius: '10px', background: '#f1f5f9',
              border: '1px solid #e2e8f0', fontSize: '13px', fontWeight: 500,
              color: '#334155', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
            }}>📥 Export Report</button>
            <button style={{
              padding: '8px 16px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #f43f5e, #e11d48)',
              color: 'white', fontWeight: 600, fontSize: '13px',
              border: 'none', cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(244,63,94,0.3)',
            }}>⚙️ System Settings</button>
          </div>
        </div>
      </div>
      
      {/* Live MongoDB Analytics */}
      <AdminAnalyticsDashboard />


      {/* Key Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '28px' }}>
        {[
          { label: 'Total Users', value: stats.totalUsers.toLocaleString(), icon: '👥', color: '#6366f1', gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)', change: `+${stats.monthlyGrowth}% this month` },
          { label: 'Active Doctors', value: stats.totalDoctors, icon: '👨‍⚕️', color: '#14b8a6', gradient: 'linear-gradient(135deg, #14b8a6, #06b6d4)', change: `${stats.pendingVerifications} pending` },
          { label: 'Total Appointments', value: stats.totalAppointments.toLocaleString(), icon: '📅', color: '#f59e0b', gradient: 'linear-gradient(135deg, #f59e0b, #f97316)', change: '1,243 this week' },
          { label: 'Total Revenue', value: `₹${(stats.totalRevenue / 100000).toFixed(1)}L`, icon: '💰', color: '#22c55e', gradient: 'linear-gradient(135deg, #22c55e, #10b981)', change: '+₹28L this month' },
        ].map((stat, i) => (
          <div key={i} style={{
            background: 'white', borderRadius: '16px', padding: '20px',
            border: '1px solid #e2e8f0', position: 'relative', overflow: 'hidden',
            animation: `fadeInUp 0.5s ease-out ${i * 0.1}s both`, transition: 'all 0.3s',
          }}
          onMouseOver={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='0 12px 30px rgba(0,0,0,0.08)'; }}
          onMouseOut={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none'; }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: stat.gradient }}></div>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: `${stat.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', marginBottom: '12px' }}>{stat.icon}</div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', marginBottom: '2px' }}>{stat.value}</div>
            <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>{stat.label}</div>
            <div style={{ fontSize: '12px', color: stat.color, fontWeight: 600, marginTop: '8px' }}>↗ {stat.change}</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '24px' }}>
        {/* User Growth Chart (Simple bar chart) */}
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>📈 User Growth</h3>
            <div style={{ display: 'flex', gap: '4px', background: '#f1f5f9', borderRadius: '8px', padding: '2px' }}>
              {['6M', '1Y', 'All'].map((p, i) => (
                <button key={p} style={{
                  padding: '4px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 500,
                  background: i === 0 ? 'white' : 'transparent',
                  color: i === 0 ? '#0f172a' : '#64748b',
                  border: 'none', cursor: 'pointer',
                  boxShadow: i === 0 ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                }}>{p}</button>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px', height: '200px', padding: '0 8px' }}>
            {stats.userGrowth.map((item, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div style={{ fontSize: '11px', fontWeight: 600, color: '#334155' }}>{(item.users / 1000).toFixed(1)}K</div>
                <div style={{
                  width: '100%', borderRadius: '8px 8px 0 0',
                  background: `linear-gradient(180deg, #6366f1 0%, #8b5cf6 100%)`,
                  height: `${(item.users / 60000) * 160}px`,
                  minHeight: '20px',
                  transition: 'height 1s ease-out',
                  opacity: 0.8 + (i * 0.04),
                }}></div>
                <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>{item.month}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Distribution */}
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '20px' }}>💰 Revenue Split</h3>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px', position: 'relative' }}>
            <div style={{
              width: '160px', height: '160px', borderRadius: '50%',
              background: `conic-gradient(#6366f1 0% 45%, #14b8a6 45% 70%, #f59e0b 70% 88%, #f43f5e 88% 100%)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{
                width: '100px', height: '100px', borderRadius: '50%', background: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexDirection: 'column',
              }}>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>₹1.56Cr</div>
                <div style={{ fontSize: '10px', color: '#64748b' }}>Total</div>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { label: 'Consultations', value: '45%', color: '#6366f1' },
              { label: 'Medicine Sales', value: '25%', color: '#14b8a6' },
              { label: 'Subscriptions', value: '18%', color: '#f59e0b' },
              { label: 'Other', value: '12%', color: '#f43f5e' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: item.color }}></div>
                <span style={{ flex: 1, fontSize: '13px', color: '#334155' }}>{item.label}</span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
        {/* Recent Activity */}
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>⚡ Recent Activity</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {stats.recentActivities.slice(0, 6).map(activity => (
              <div key={activity.id} style={{
                display: 'flex', alignItems: 'flex-start', gap: '10px',
                padding: '10px 8px', borderRadius: '8px',
                transition: 'background 0.15s', cursor: 'default',
              }}
              onMouseOver={e => e.currentTarget.style.background='#f8fafc'}
              onMouseOut={e => e.currentTarget.style.background='transparent'}
              >
                <span style={{ fontSize: '16px', marginTop: '1px' }}>{activity.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '12px', color: '#334155', lineHeight: 1.4 }}>{activity.message}</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Doctors */}
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>🏆 Top Performing Doctors</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {stats.topDoctors.map((doc, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '10px', borderRadius: '10px', background: '#f8fafc',
              }}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  background: i === 0 ? '#fbbf24' : i === 1 ? '#94a3b8' : i === 2 ? '#d97706' : '#e2e8f0',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '12px', fontWeight: 800, color: i < 3 ? 'white' : '#64748b',
                }}>{i + 1}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>{doc.name}</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>{doc.consultations} consultations • ⭐ {doc.rating}</div>
                </div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#22c55e' }}>₹{(doc.revenue / 1000).toFixed(0)}K</div>
              </div>
            ))}
          </div>
        </div>

        {/* System Health & Quick Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* System Health */}
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '20px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '14px' }}>🖥️ System Health</h3>
            {[
              { label: 'Server Uptime', value: '99.97%', color: '#22c55e' },
              { label: 'API Response', value: '142ms', color: '#22c55e' },
              { label: 'Active Sessions', value: stats.activeUsers.toLocaleString(), color: '#6366f1' },
              { label: 'Error Rate', value: '0.03%', color: '#22c55e' },
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '8px 0', borderBottom: i < 3 ? '1px solid #f1f5f9' : 'none',
              }}>
                <span style={{ fontSize: '13px', color: '#64748b' }}>{item.label}</span>
                <span style={{ fontSize: '13px', fontWeight: 700, color: item.color }}>{item.value}</span>
              </div>
            ))}
          </div>

          {/* Pending Actions */}
          <div style={{
            background: 'linear-gradient(135deg, #f43f5e, #e11d48)', borderRadius: '16px',
            padding: '20px', color: 'white',
          }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '14px' }}>⚠️ Needs Attention</h3>
            {[
              { label: 'Pending Verifications', value: stats.pendingVerifications },
              { label: 'Support Tickets', value: stats.supportTickets },
              { label: 'Flagged Reviews', value: 3 },
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '8px 0', borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.15)' : 'none',
              }}>
                <span style={{ fontSize: '13px', opacity: 0.9 }}>{item.label}</span>
                <span style={{
                  padding: '2px 10px', borderRadius: '999px',
                  background: 'rgba(255,255,255,0.2)', fontSize: '13px', fontWeight: 700,
                }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Daily Stats Table */}
      <div style={{ marginTop: '24px', background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>📊 This Week&apos;s Breakdown</h3>
          <button style={{
            padding: '6px 14px', borderRadius: '8px', background: '#f1f5f9',
            border: '1px solid #e2e8f0', fontSize: '12px', fontWeight: 500,
            color: '#334155', cursor: 'pointer',
          }}>Download CSV</button>
        </div>
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
          <thead>
            <tr>
              {['Day', 'New Users', 'Appointments', 'Revenue', 'Avg. Rating', 'Conversion'].map(h => (
                <th key={h} style={{
                  padding: '10px 14px', textAlign: 'left', fontSize: '11px', fontWeight: 600,
                  color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em',
                  background: '#f8fafc', borderBottom: '2px solid #e2e8f0',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {stats.dailyStats.map((day, i) => (
              <tr key={i} style={{ transition: 'background 0.15s' }}
                onMouseOver={e => e.currentTarget.style.background='#f8fafc'}
                onMouseOut={e => e.currentTarget.style.background='transparent'}
              >
                <td style={{ padding: '12px 14px', fontSize: '13px', fontWeight: 600, color: '#0f172a', borderBottom: '1px solid #f1f5f9' }}>{day.day}</td>
                <td style={{ padding: '12px 14px', fontSize: '13px', color: '#334155', borderBottom: '1px solid #f1f5f9' }}>{day.users.toLocaleString()}</td>
                <td style={{ padding: '12px 14px', fontSize: '13px', color: '#334155', borderBottom: '1px solid #f1f5f9' }}>{day.appointments}</td>
                <td style={{ padding: '12px 14px', fontSize: '13px', fontWeight: 600, color: '#22c55e', borderBottom: '1px solid #f1f5f9' }}>₹{(day.revenue / 1000).toFixed(0)}K</td>
                <td style={{ padding: '12px 14px', fontSize: '13px', color: '#334155', borderBottom: '1px solid #f1f5f9' }}>⭐ {(4.5 + Math.random() * 0.4).toFixed(1)}</td>
                <td style={{ padding: '12px 14px', borderBottom: '1px solid #f1f5f9' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ flex: 1, height: '6px', background: '#f1f5f9', borderRadius: '999px' }}>
                      <div style={{ height: '100%', borderRadius: '999px', background: 'linear-gradient(90deg, #6366f1, #8b5cf6)', width: `${60 + Math.random() * 30}%` }}></div>
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>{(60 + Math.random() * 30).toFixed(0)}%</span>
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
