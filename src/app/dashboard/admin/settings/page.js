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

export default function AdminSettingsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('general');
  const [saved, setSaved] = useState(false);

  const [settings, setSettings] = useState({
    siteName: 'MedVet One-Health',
    siteTagline: 'India\'s First Unified Healthcare Platform',
    supportEmail: 'support@medvet.health',
    supportPhone: '+91 1800-MEDVET',
    timezone: 'Asia/Kolkata',
    currency: 'INR',
    language: 'en',
    maintenanceMode: false,
    registrationOpen: true,
    emailVerification: true,
    twoFactorAuth: false,
    autoApproveVets: false,
    maxLoginAttempts: 5,
    sessionTimeout: 30,
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: false,
    weeklyReports: true,
    alertThreshold: 'medium',
    commissionRate: 15,
    minWithdrawal: 500,
    paymentMethods: ['UPI', 'Cards', 'NetBanking'],
    taxRate: 18,
  });

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) router.push('/login');
  }, [user, loading, router]);

  if (loading || !user) return null;

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const tabs = [
    { id: 'general', label: '⚙️ General', icon: '⚙️' },
    { id: 'security', label: '🔒 Security', icon: '🔒' },
    { id: 'notifications', label: '🔔 Notifications', icon: '🔔' },
    { id: 'payments', label: '💳 Payments', icon: '💳' },
    { id: 'integrations', label: '🔗 Integrations', icon: '🔗' },
  ];

  const ToggleSwitch = ({ value, onChange }) => (
    <button onClick={onChange} style={{
      width: '48px', height: '26px', borderRadius: '999px',
      background: value ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : '#e2e8f0',
      padding: '3px', border: 'none', cursor: 'pointer', transition: 'all 0.3s',
      position: 'relative',
    }}>
      <div style={{
        width: '20px', height: '20px', borderRadius: '50%', background: 'white',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        transform: value ? 'translateX(22px)' : 'translateX(0)',
        transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }} />
    </button>
  );

  return (
    <DashboardLayout sidebarItems={sidebarItems}>
      <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>Platform Settings 🔧</h1>
            <p style={{ fontSize: '15px', color: '#64748b' }}>Configure platform-wide settings and preferences</p>
          </div>
          <button onClick={handleSave} style={{
            padding: '10px 24px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            color: 'white', fontWeight: 600, fontSize: '14px',
            border: 'none', cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(99,102,241,0.4)',
            transition: 'all 0.2s',
          }}>💾 Save Changes</button>
        </div>

        {saved && (
          <div style={{
            position: 'fixed', top: '20px', right: '20px', padding: '12px 24px',
            borderRadius: '12px', background: 'white', boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
            borderLeft: '4px solid #22c55e', zIndex: 400, animation: 'slideInRight 0.3s ease-out',
            display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 500,
          }}>✅ Settings saved successfully!</div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '24px' }}>
          {/* Settings Nav */}
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '8px', height: 'fit-content' }}>
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                display: 'flex', alignItems: 'center', gap: '10px', width: '100%',
                padding: '12px 16px', borderRadius: '10px', fontSize: '14px', fontWeight: 600,
                background: activeTab === tab.id ? '#f1f5f9' : 'transparent',
                color: activeTab === tab.id ? '#0f172a' : '#64748b',
                border: 'none', cursor: 'pointer', textAlign: 'left',
                transition: 'all 0.2s', marginBottom: '2px',
              }}>{tab.label}</button>
            ))}
          </div>

          {/* Settings Content */}
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '28px' }}>
            {activeTab === 'general' && (
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', marginBottom: '24px' }}>General Configuration</h3>
                <div style={{ display: 'grid', gap: '20px' }}>
                  {[
                    { label: 'Platform Name', value: settings.siteName, key: 'siteName', type: 'text' },
                    { label: 'Tagline', value: settings.siteTagline, key: 'siteTagline', type: 'text' },
                    { label: 'Support Email', value: settings.supportEmail, key: 'supportEmail', type: 'email' },
                    { label: 'Support Phone', value: settings.supportPhone, key: 'supportPhone', type: 'text' },
                  ].map(field => (
                    <div key={field.key} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>{field.label}</label>
                      <input type={field.type} value={field.value}
                        onChange={e => setSettings(prev => ({...prev, [field.key]: e.target.value}))}
                        style={{
                          padding: '10px 14px', borderRadius: '10px', border: '2px solid #e2e8f0',
                          fontSize: '14px', color: '#0f172a', outline: 'none', transition: 'all 0.2s',
                        }}
                        onFocus={e => e.target.style.borderColor = '#6366f1'}
                        onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                      />
                    </div>
                  ))}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>Timezone</label>
                      <select value={settings.timezone} onChange={e => setSettings(prev => ({...prev, timezone: e.target.value}))}
                        style={{ padding: '10px 14px', borderRadius: '10px', border: '2px solid #e2e8f0', fontSize: '14px', background: 'white' }}>
                        <option>Asia/Kolkata</option><option>Asia/Dubai</option><option>UTC</option>
                      </select>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>Currency</label>
                      <select value={settings.currency} onChange={e => setSettings(prev => ({...prev, currency: e.target.value}))}
                        style={{ padding: '10px 14px', borderRadius: '10px', border: '2px solid #e2e8f0', fontSize: '14px', background: 'white' }}>
                        <option>INR</option><option>USD</option><option>EUR</option>
                      </select>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>Language</label>
                      <select value={settings.language} onChange={e => setSettings(prev => ({...prev, language: e.target.value}))}
                        style={{ padding: '10px 14px', borderRadius: '10px', border: '2px solid #e2e8f0', fontSize: '14px', background: 'white' }}>
                        <option value="en">English</option><option value="hi">Hindi</option><option value="ta">Tamil</option>
                      </select>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderRadius: '12px', background: '#fef2f2', border: '1px solid #fecaca' }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>🚧 Maintenance Mode</div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>Take the platform offline for maintenance</div>
                    </div>
                    <ToggleSwitch value={settings.maintenanceMode} onChange={() => setSettings(prev => ({...prev, maintenanceMode: !prev.maintenanceMode}))} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #f1f5f9' }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>📝 Open Registration</div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>Allow new users to register on the platform</div>
                    </div>
                    <ToggleSwitch value={settings.registrationOpen} onChange={() => setSettings(prev => ({...prev, registrationOpen: !prev.registrationOpen}))} />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', marginBottom: '24px' }}>Security Settings</h3>
                <div style={{ display: 'grid', gap: '16px' }}>
                  {[
                    { label: 'Email Verification Required', desc: 'New users must verify email before accessing dashboard', key: 'emailVerification' },
                    { label: 'Two-Factor Authentication', desc: 'Require 2FA for doctor and admin accounts', key: 'twoFactorAuth' },
                    { label: 'Auto-Approve Vet Registrations', desc: 'Skip manual verification for veterinary doctors', key: 'autoApproveVets' },
                  ].map(item => (
                    <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #f1f5f9' }}>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>{item.label}</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>{item.desc}</div>
                      </div>
                      <ToggleSwitch value={settings[item.key]} onChange={() => setSettings(prev => ({...prev, [item.key]: !prev[item.key]}))} />
                    </div>
                  ))}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '8px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>Max Login Attempts</label>
                      <input type="number" value={settings.maxLoginAttempts}
                        onChange={e => setSettings(prev => ({...prev, maxLoginAttempts: parseInt(e.target.value)}))}
                        style={{ padding: '10px 14px', borderRadius: '10px', border: '2px solid #e2e8f0', fontSize: '14px', outline: 'none' }}
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>Session Timeout (min)</label>
                      <input type="number" value={settings.sessionTimeout}
                        onChange={e => setSettings(prev => ({...prev, sessionTimeout: parseInt(e.target.value)}))}
                        style={{ padding: '10px 14px', borderRadius: '10px', border: '2px solid #e2e8f0', fontSize: '14px', outline: 'none' }}
                      />
                    </div>
                  </div>
                  <div style={{ padding: '16px', borderRadius: '12px', background: '#eff6ff', border: '1px solid #bfdbfe', marginTop: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', fontWeight: 600, color: '#1d4ed8', marginBottom: '8px' }}>🔐 Compliance Status</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                      {[
                        { label: 'DPDP Act 2023', status: 'Compliant', color: '#22c55e' },
                        { label: 'ABDM Ready', status: 'In Progress', color: '#f59e0b' },
                        { label: 'HIPAA Inspired', status: 'Compliant', color: '#22c55e' },
                      ].map((c, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: c.color }} />
                          <span style={{ fontSize: '12px', color: '#334155' }}>{c.label}: <strong style={{ color: c.color }}>{c.status}</strong></span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', marginBottom: '24px' }}>Notification Preferences</h3>
                <div style={{ display: 'grid', gap: '16px' }}>
                  {[
                    { label: 'Email Notifications', desc: 'Receive email alerts for critical system events', key: 'emailNotifications', icon: '📧' },
                    { label: 'SMS Notifications', desc: 'Get SMS alerts for urgent issues (charges apply)', key: 'smsNotifications', icon: '📱' },
                    { label: 'Push Notifications', desc: 'Browser push notifications for real-time alerts', key: 'pushNotifications', icon: '🔔' },
                    { label: 'Weekly Reports', desc: 'Receive weekly performance summary via email', key: 'weeklyReports', icon: '📊' },
                  ].map(item => (
                    <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #f1f5f9' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '20px' }}>{item.icon}</span>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>{item.label}</div>
                          <div style={{ fontSize: '12px', color: '#64748b' }}>{item.desc}</div>
                        </div>
                      </div>
                      <ToggleSwitch value={settings[item.key]} onChange={() => setSettings(prev => ({...prev, [item.key]: !prev[item.key]}))} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'payments' && (
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', marginBottom: '24px' }}>Payment Configuration</h3>
                <div style={{ display: 'grid', gap: '20px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>Platform Commission (%)</label>
                      <input type="number" value={settings.commissionRate}
                        onChange={e => setSettings(prev => ({...prev, commissionRate: parseInt(e.target.value)}))}
                        style={{ padding: '10px 14px', borderRadius: '10px', border: '2px solid #e2e8f0', fontSize: '14px', outline: 'none' }}
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>Min Withdrawal (₹)</label>
                      <input type="number" value={settings.minWithdrawal}
                        onChange={e => setSettings(prev => ({...prev, minWithdrawal: parseInt(e.target.value)}))}
                        style={{ padding: '10px 14px', borderRadius: '10px', border: '2px solid #e2e8f0', fontSize: '14px', outline: 'none' }}
                      />
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>GST Rate (%)</label>
                    <input type="number" value={settings.taxRate}
                      onChange={e => setSettings(prev => ({...prev, taxRate: parseInt(e.target.value)}))}
                      style={{ padding: '10px 14px', borderRadius: '10px', border: '2px solid #e2e8f0', fontSize: '14px', outline: 'none', width: '200px' }}
                    />
                  </div>
                  <div style={{ padding: '20px', borderRadius: '12px', background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#15803d', marginBottom: '12px' }}>💳 Active Payment Gateways</div>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                      {['Razorpay', 'UPI (GPay/PhonePe)', 'Cards (Visa/MC)', 'Net Banking', 'MedVet Wallet'].map((method, i) => (
                        <span key={i} style={{ padding: '6px 14px', borderRadius: '999px', background: 'white', border: '1px solid #bbf7d0', fontSize: '12px', fontWeight: 600, color: '#15803d' }}>✅ {method}</span>
                      ))}
                    </div>
                  </div>
                  <div style={{ padding: '16px', borderRadius: '12px', background: '#fef3c7', border: '1px solid #fde68a' }}>
                    <div style={{ fontSize: '13px', color: '#92400e' }}>
                      <strong>💡 50/50 Trust Payment Model:</strong> Patients pay 50% upfront to secure booking and 50% post-treatment. This USP reduces no-shows by 70% and builds provider trust.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'integrations' && (
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', marginBottom: '24px' }}>API & Integrations</h3>
                <div style={{ display: 'grid', gap: '16px' }}>
                  {[
                    { name: 'NMC Verification API', desc: 'National Medical Commission doctor verification', status: 'Connected', color: '#22c55e', icon: '🏥' },
                    { name: 'VCI Verification API', desc: 'Veterinary Council of India verification', status: 'Connected', color: '#22c55e', icon: '🐾' },
                    { name: 'Razorpay Payments', desc: 'Payment gateway for transactions', status: 'Active', color: '#22c55e', icon: '💳' },
                    { name: 'Twilio SMS Gateway', desc: 'OTP and notification SMS delivery', status: 'Active', color: '#22c55e', icon: '📱' },
                    { name: 'ABDM Integration', desc: 'Ayushman Bharat Digital Mission health ID', status: 'Pending', color: '#f59e0b', icon: '🔗' },
                    { name: 'WhatsApp Business API', desc: 'Appointment reminders via WhatsApp', status: 'Planned', color: '#94a3b8', icon: '💬' },
                  ].map((intg, i) => (
                    <div key={i} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '16px 20px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #f1f5f9',
                      animation: `fadeIn 0.4s ease-out ${i * 0.05}s both`,
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'white', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>{intg.icon}</div>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>{intg.name}</div>
                          <div style={{ fontSize: '12px', color: '#64748b' }}>{intg.desc}</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ padding: '4px 12px', borderRadius: '999px', fontSize: '11px', fontWeight: 600, background: `${intg.color}18`, color: intg.color }}>{intg.status}</span>
                        <button style={{ padding: '6px 12px', borderRadius: '8px', background: 'white', border: '1px solid #e2e8f0', fontSize: '12px', fontWeight: 600, cursor: 'pointer', color: '#334155' }}>Configure</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
