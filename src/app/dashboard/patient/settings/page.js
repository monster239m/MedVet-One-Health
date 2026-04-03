'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';

const sidebarItems = [
  { label: 'Main', items: [
    { icon: '📊', label: 'Dashboard', href: '/dashboard/patient' },
    { icon: '📅', label: 'Appointments', href: '/dashboard/patient/appointments' },
    { icon: '🔍', label: 'Find Doctors', href: '/dashboard/patient/doctors' },
  ]},
  { label: 'Health', items: [
    { icon: '💊', label: 'Prescriptions', href: '/dashboard/patient/prescriptions' },
    { icon: '🛒', label: 'Medicines', href: '/dashboard/patient/medicines' },
    { icon: '📋', label: 'Health Records', href: '/dashboard/patient/records' },
    { icon: '🐾', label: 'My Pets', href: '/dashboard/patient/pets' },
  ]},
  { label: 'Services', items: [
    { icon: '📊', label: 'Queue Status', href: '/dashboard/patient/queue' },
    { icon: '📦', label: 'Orders', href: '/dashboard/patient/orders', badge: '2' },
    { icon: '💬', label: 'Messages', href: '/dashboard/patient/messages', badge: '3', badgeColor: 'rgba(239,68,68,0.4)' },
    { icon: '⚙️', label: 'Settings', href: '/dashboard/patient/settings' },
  ]},
];

export default function SettingsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState('profile');
  const [notifications, setNotifications] = useState({ email: true, sms: true, push: true, appointments: true, medicines: false, marketing: false });

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  if (loading || !user) return null;

  const sections = [
    { id: 'profile', icon: '👤', label: 'Profile' },
    { id: 'notifications', icon: '🔔', label: 'Notifications' },
    { id: 'privacy', icon: '🔒', label: 'Privacy & Security' },
    { id: 'billing', icon: '💳', label: 'Billing' },
    { id: 'preferences', icon: '🎨', label: 'Preferences' },
    { id: 'connected', icon: '🔗', label: 'Connected Devices' },
    { id: 'help', icon: '❓', label: 'Help & Support' },
  ];

  return (
    <DashboardLayout sidebarItems={sidebarItems}>
      <div style={{ marginBottom: '28px', animation: 'fadeIn 0.5s ease-out' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>Settings ⚙️</h1>
        <p style={{ fontSize: '15px', color: '#64748b' }}>Manage your account preferences and settings</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '24px' }}>
        {/* Settings Nav */}
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '12px', height: 'fit-content' }}>
          {sections.map(s => (
            <button key={s.id} onClick={() => setActiveSection(s.id)} style={{
              width: '100%', padding: '10px 14px', borderRadius: '10px',
              background: activeSection === s.id ? 'rgba(99,102,241,0.08)' : 'transparent',
              color: activeSection === s.id ? '#4f46e5' : '#64748b',
              fontSize: '13px', fontWeight: activeSection === s.id ? 600 : 500,
              cursor: 'pointer', textAlign: 'left', border: 'none',
              display: 'flex', alignItems: 'center', gap: '10px',
              marginBottom: '2px', transition: 'all 0.15s',
            }}>
              <span>{s.icon}</span>{s.label}
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '28px' }}>
          {activeSection === 'profile' && (
            <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', marginBottom: '24px' }}>Profile Information</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '28px', padding: '20px', borderRadius: '14px', background: '#f8fafc' }}>
                <div style={{
                  width: '72px', height: '72px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontWeight: 800, fontSize: '24px',
                }}>{user.initials}</div>
                <div>
                  <div style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>{user.name}</div>
                  <div style={{ fontSize: '13px', color: '#64748b' }}>{user.email}</div>
                  <button style={{ marginTop: '8px', padding: '4px 14px', borderRadius: '8px', background: '#6366f1', color: 'white', fontSize: '12px', fontWeight: 600, border: 'none', cursor: 'pointer' }}>Change Photo</button>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {[
                  { label: 'Full Name', value: user.name },
                  { label: 'Email', value: user.email },
                  { label: 'Phone', value: user.phone || '+91 98765 43210' },
                  { label: 'City', value: user.city || 'Mumbai' },
                  { label: 'Blood Group', value: user.bloodGroup || 'O+' },
                  { label: 'Date of Birth', value: '1994-05-15' },
                ].map(f => (
                  <div key={f.label}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#64748b', marginBottom: '6px' }}>{f.label}</label>
                    <input type="text" defaultValue={f.value} style={{
                      width: '100%', padding: '10px 14px', borderRadius: '10px',
                      border: '2px solid #e2e8f0', fontSize: '14px', color: '#0f172a', outline: 'none',
                    }} />
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
                <button style={{ padding: '10px 24px', borderRadius: '10px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', fontWeight: 700, fontSize: '14px', border: 'none', cursor: 'pointer', boxShadow: '0 4px 15px rgba(99,102,241,0.3)' }}>Save Changes</button>
                <button style={{ padding: '10px 24px', borderRadius: '10px', background: '#f1f5f9', color: '#64748b', fontWeight: 600, fontSize: '14px', border: '1px solid #e2e8f0', cursor: 'pointer' }}>Cancel</button>
              </div>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', marginBottom: '24px' }}>Notification Preferences</h3>
              {[
                { key: 'email', label: 'Email Notifications', desc: 'Receive updates via email' },
                { key: 'sms', label: 'SMS Notifications', desc: 'Get text alerts for appointments' },
                { key: 'push', label: 'Push Notifications', desc: 'Browser push notifications' },
                { key: 'appointments', label: 'Appointment Reminders', desc: 'Reminders before appointments' },
                { key: 'medicines', label: 'Medicine Refill Alerts', desc: 'When prescriptions are running low' },
                { key: 'marketing', label: 'Promotional Emails', desc: 'Offers, news, and health tips' },
              ].map(n => (
                <div key={n.key} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '16px 0', borderBottom: '1px solid #f1f5f9',
                }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>{n.label}</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>{n.desc}</div>
                  </div>
                  <button onClick={() => setNotifications(prev => ({ ...prev, [n.key]: !prev[n.key] }))}
                    style={{
                      width: '48px', height: '26px', borderRadius: '999px',
                      background: notifications[n.key] ? '#6366f1' : '#e2e8f0',
                      border: 'none', cursor: 'pointer', position: 'relative',
                      transition: 'background 0.2s',
                    }}>
                    <div style={{
                      width: '20px', height: '20px', borderRadius: '50%', background: 'white',
                      position: 'absolute', top: '3px',
                      left: notifications[n.key] ? '25px' : '3px',
                      transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
                    }}></div>
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeSection === 'privacy' && (
            <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', marginBottom: '24px' }}>Privacy & Security</h3>
              {[
                { icon: '🔑', label: 'Change Password', desc: 'Update your password regularly', action: 'Change' },
                { icon: '📱', label: 'Two-Factor Authentication', desc: 'Add extra security layer', action: 'Enable' },
                { icon: '📋', label: 'Login History', desc: 'View recent login activity', action: 'View' },
                { icon: '📥', label: 'Download My Data', desc: 'Export all your health records', action: 'Download' },
                { icon: '🗑️', label: 'Delete Account', desc: 'Permanently remove your account', action: 'Delete', danger: true },
              ].map((item, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: '14px',
                  padding: '16px', borderRadius: '12px', marginBottom: '8px',
                  background: '#f8fafc', border: '1px solid #f1f5f9',
                }}>
                  <span style={{ fontSize: '20px' }}>{item.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>{item.label}</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>{item.desc}</div>
                  </div>
                  <button style={{
                    padding: '6px 16px', borderRadius: '8px',
                    background: item.danger ? '#fef2f2' : '#f1f5f9',
                    color: item.danger ? '#dc2626' : '#334155',
                    fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                    border: `1px solid ${item.danger ? '#fecaca' : '#e2e8f0'}`,
                  }}>{item.action}</button>
                </div>
              ))}
            </div>
          )}

          {['billing', 'preferences', 'connected', 'help'].includes(activeSection) && (
            <div style={{ animation: 'fadeIn 0.3s ease-out', textAlign: 'center', padding: '60px 20px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚧</div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
                {sections.find(s => s.id === activeSection)?.label}
              </h3>
              <p style={{ fontSize: '14px', color: '#64748b', maxWidth: '400px', margin: '0 auto' }}>
                This section is under development and will be available in the next update. Stay tuned for exciting new features!
              </p>
              <div style={{
                marginTop: '20px', padding: '10px 20px', borderRadius: '10px',
                background: '#eff6ff', border: '1px solid #bfdbfe', display: 'inline-block',
                fontSize: '13px', color: '#1d4ed8', fontWeight: 500,
              }}>🔔 You&apos;ll be notified when this feature launches</div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
