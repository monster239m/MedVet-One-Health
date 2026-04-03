'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

export default function DashboardLayout({ children, sidebarItems }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, text: 'Appointment with Dr. Mehta confirmed', time: '5 min ago', read: false, icon: '📅' },
    { id: 2, text: 'Your prescription is ready', time: '1 hour ago', read: false, icon: '💊' },
    { id: 3, text: 'Medicine order dispatched', time: '2 hours ago', read: true, icon: '📦' },
    { id: 4, text: 'New health tip available', time: '5 hours ago', read: true, icon: '💡' },
  ];

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const roleColor = user?.role === 'admin' ? '#f43f5e' : user?.role === 'doctor' ? '#14b8a6' : '#6366f1';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f1f5f9' }}>
      {/* Sidebar */}
      <aside style={{
        width: sidebarCollapsed ? '72px' : '260px',
        background: 'linear-gradient(180deg, #0f172a 0%, #1e1b4b 100%)',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 200,
        overflow: 'hidden',
      }}>
        {/* Logo */}
        <div style={{
          padding: sidebarCollapsed ? '20px 16px' : '20px 24px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          minHeight: '72px',
        }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '18px', flexShrink: 0,
          }}>🏥</div>
          {!sidebarCollapsed && (
            <div>
              <div style={{ fontWeight: 800, fontSize: '16px', letterSpacing: '-0.02em' }}>MedVet</div>
              <div style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>One-Health</div>
            </div>
          )}
        </div>

        {/* Nav Items */}
        <nav style={{ flex: 1, padding: '12px 8px', overflowY: 'auto' }}>
          {sidebarItems?.map((section, si) => (
            <div key={si} style={{ marginBottom: '16px' }}>
              {!sidebarCollapsed && section.label && (
                <div style={{
                  fontSize: '10px', fontWeight: 600, color: '#64748b',
                  textTransform: 'uppercase', letterSpacing: '0.1em',
                  padding: '8px 16px 4px',
                }}>{section.label}</div>
              )}
              {section.items.map(item => {
                const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href));
                return (
                  <Link key={item.href} href={item.href}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: sidebarCollapsed ? '10px 16px' : '10px 16px',
                      borderRadius: '10px',
                      color: isActive ? 'white' : '#94a3b8',
                      background: isActive ? 'rgba(99,102,241,0.2)' : 'transparent',
                      fontSize: '14px',
                      fontWeight: isActive ? 600 : 400,
                      textDecoration: 'none',
                      transition: 'all 0.2s',
                      marginBottom: '2px',
                      position: 'relative',
                    }}
                    onMouseOver={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                    onMouseOut={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                  >
                    {isActive && (
                      <div style={{
                        position: 'absolute', left: '0', top: '50%', transform: 'translateY(-50%)',
                        width: '3px', height: '20px', borderRadius: '0 3px 3px 0',
                        background: 'linear-gradient(180deg, #6366f1, #8b5cf6)',
                      }} />
                    )}
                    <span style={{ fontSize: '18px', width: '24px', textAlign: 'center' }}>{item.icon}</span>
                    {!sidebarCollapsed && <span>{item.label}</span>}
                    {!sidebarCollapsed && item.badge && (
                      <span style={{
                        marginLeft: 'auto', padding: '2px 8px', borderRadius: '999px',
                        background: item.badgeColor || 'rgba(99,102,241,0.3)',
                        fontSize: '11px', fontWeight: 600,
                      }}>{item.badge}</span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Collapse Toggle */}
        <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          style={{
            padding: '16px', borderTop: '1px solid rgba(255,255,255,0.08)',
            color: '#64748b', display: 'flex', alignItems: 'center',
            justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
            gap: '12px', fontSize: '13px', cursor: 'pointer',
            background: 'none', border: 'none', borderTop: '1px solid rgba(255,255,255,0.08)',
            transition: 'color 0.2s', width: '100%',
          }}
          onMouseOver={e => e.currentTarget.style.color = 'white'}
          onMouseOut={e => e.currentTarget.style.color = '#64748b'}
        >
          <span style={{ fontSize: '18px' }}>{sidebarCollapsed ? '→' : '←'}</span>
          {!sidebarCollapsed && 'Collapse Menu'}
        </button>
      </aside>

      {/* Main Content */}
      <div style={{
        flex: 1,
        marginLeft: sidebarCollapsed ? '72px' : '260px',
        transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}>
        {/* Top Bar */}
        <header style={{
          height: '72px',
          background: 'rgba(255,255,255,0.8)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 32px',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}>
          {/* Search Bar */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            background: '#f1f5f9', borderRadius: '12px', padding: '8px 16px',
            width: '360px', border: '1px solid transparent',
            transition: 'all 0.2s',
          }}>
            <span style={{ color: '#94a3b8' }}>🔍</span>
            <input type="text" placeholder="Search anything..."
              style={{
                background: 'none', border: 'none', outline: 'none',
                flex: 1, fontSize: '14px', color: '#1e293b',
              }}
            />
            <kbd style={{
              padding: '2px 6px', borderRadius: '4px', background: '#e2e8f0',
              fontSize: '11px', color: '#64748b', fontFamily: 'inherit',
            }}>⌘K</kbd>
          </div>

          {/* Right Section */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Notifications */}
            <div style={{ position: 'relative' }}>
              <button onClick={() => { setShowNotifications(!showNotifications); setShowProfileMenu(false); }}
                style={{
                  width: '40px', height: '40px', borderRadius: '10px',
                  background: '#f1f5f9', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '18px', cursor: 'pointer',
                  border: '1px solid transparent', transition: 'all 0.2s',
                  position: 'relative',
                }}
              >
                🔔
                <span style={{
                  position: 'absolute', top: '6px', right: '6px',
                  width: '8px', height: '8px', borderRadius: '50%',
                  background: '#ef4444', border: '2px solid white',
                }}></span>
              </button>
              {showNotifications && (
                <div style={{
                  position: 'absolute', top: '50px', right: 0, width: '340px',
                  background: 'white', borderRadius: '16px', boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
                  border: '1px solid #e2e8f0', overflow: 'hidden', animation: 'fadeIn 0.2s ease-out',
                }}>
                  <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, fontSize: '15px' }}>Notifications</span>
                    <span style={{ fontSize: '12px', color: '#6366f1', cursor: 'pointer', fontWeight: 500 }}>Mark all read</span>
                  </div>
                  {notifications.map(n => (
                    <div key={n.id} style={{
                      padding: '12px 20px', display: 'flex', gap: '12px', alignItems: 'flex-start',
                      borderBottom: '1px solid #f8fafc', cursor: 'pointer',
                      background: n.read ? 'white' : '#f8fafc',
                      transition: 'background 0.2s',
                    }}>
                      <span style={{ fontSize: '20px' }}>{n.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '13px', color: '#334155', lineHeight: 1.4 }}>{n.text}</div>
                        <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>{n.time}</div>
                      </div>
                      {!n.read && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#6366f1', marginTop: '6px' }}></div>}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Profile */}
            <div style={{ position: 'relative' }}>
              <button onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotifications(false); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  cursor: 'pointer', padding: '6px 12px 6px 6px',
                  borderRadius: '12px', transition: 'background 0.2s',
                  background: showProfileMenu ? '#f1f5f9' : 'transparent',
                  border: 'none',
                }}
              >
                <div style={{
                  width: '36px', height: '36px', borderRadius: '10px',
                  background: `linear-gradient(135deg, ${roleColor}, ${roleColor}cc)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontWeight: 700, fontSize: '14px',
                }}>{user?.initials || '?'}</div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>{user?.name || 'User'}</div>
                  <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'capitalize' }}>{user?.role}</div>
                </div>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>▾</span>
              </button>
              {showProfileMenu && (
                <div style={{
                  position: 'absolute', top: '54px', right: 0, width: '220px',
                  background: 'white', borderRadius: '12px', boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
                  border: '1px solid #e2e8f0', overflow: 'hidden', animation: 'fadeIn 0.2s ease-out',
                }}>
                  {[
                    { label: '👤 My Profile', href: '#' },
                    { label: '⚙️ Settings', href: '#' },
                    { label: '💳 Billing', href: '#' },
                    { label: '❓ Help Center', href: '#' },
                  ].map(item => (
                    <Link key={item.label} href={item.href} style={{
                      display: 'block', padding: '10px 20px', fontSize: '13px',
                      color: '#334155', textDecoration: 'none', transition: 'background 0.15s',
                    }}
                    onMouseOver={e => e.currentTarget.style.background='#f8fafc'}
                    onMouseOut={e => e.currentTarget.style.background='transparent'}
                    >{item.label}</Link>
                  ))}
                  <div style={{ borderTop: '1px solid #f1f5f9' }}>
                    <button onClick={handleLogout} style={{
                      display: 'block', padding: '10px 20px', fontSize: '13px',
                      color: '#ef4444', width: '100%', textAlign: 'left',
                      cursor: 'pointer', border: 'none', background: 'none',
                      transition: 'background 0.15s',
                    }}
                    onMouseOver={e => e.currentTarget.style.background='#fef2f2'}
                    onMouseOut={e => e.currentTarget.style.background='transparent'}
                    >🚪 Logout</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <main style={{ flex: 1, padding: '32px' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
