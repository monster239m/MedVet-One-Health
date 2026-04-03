'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { MOCK_ORDERS } from '@/data/mockData';

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

export default function OrdersPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  if (loading || !user) return null;

  return (
    <DashboardLayout sidebarItems={sidebarItems}>
      <div style={{ marginBottom: '28px', animation: 'fadeIn 0.5s ease-out' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>My Orders 📦</h1>
        <p style={{ fontSize: '15px', color: '#64748b' }}>Track your medicine orders and delivery status</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {MOCK_ORDERS.map(order => (
          <div key={order.id} style={{
            background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0',
            overflow: 'hidden', transition: 'all 0.3s',
          }}>
            {/* Order Header */}
            <div style={{
              padding: '20px 24px', borderBottom: '1px solid #f1f5f9',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  width: '44px', height: '44px', borderRadius: '12px',
                  background: order.status === 'delivered' ? '#dcfce7' : '#dbeafe',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px',
                }}>{order.status === 'delivered' ? '✅' : '🚚'}</div>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>Order #{order.id}</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>Placed on {order.orderDate}</div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{
                  padding: '4px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: 600,
                  background: order.status === 'delivered' ? '#dcfce7' : '#dbeafe',
                  color: order.status === 'delivered' ? '#15803d' : '#1d4ed8',
                  textTransform: 'capitalize',
                }}>{order.status.replace('-', ' ')}</div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>₹{order.total}</div>
              </div>
            </div>

            {/* Items */}
            <div style={{ padding: '16px 24px', borderBottom: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {order.items.map((item, j) => (
                  <div key={j} style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '8px 14px', borderRadius: '10px', background: '#f8fafc',
                    fontSize: '13px',
                  }}>
                    <span>💊</span>
                    <span style={{ fontWeight: 500 }}>{item.name}</span>
                    <span style={{ color: '#64748b' }}>×{item.qty}</span>
                    <span style={{ fontWeight: 700 }}>₹{item.price * item.qty}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tracking */}
            <div style={{ padding: '20px 24px' }}>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>📍 Tracking</div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0', position: 'relative' }}>
                {order.trackingSteps.map((step, k) => (
                  <div key={k} style={{
                    flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
                    position: 'relative',
                  }}>
                    {/* Connector Line */}
                    {k < order.trackingSteps.length - 1 && (
                      <div style={{
                        position: 'absolute', top: '14px', left: '50%', right: '-50%',
                        height: '3px',
                        background: step.done ? 'linear-gradient(90deg, #22c55e, #22c55e)' : '#e2e8f0',
                        zIndex: 0,
                      }}></div>
                    )}
                    {/* Dot */}
                    <div style={{
                      width: '28px', height: '28px', borderRadius: '50%',
                      background: step.done ? '#22c55e' : '#e2e8f0',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '12px', color: step.done ? 'white' : '#94a3b8',
                      fontWeight: 700, zIndex: 1, flexShrink: 0,
                      border: step.done ? '3px solid #dcfce7' : '3px solid #f1f5f9',
                    }}>{step.done ? '✓' : k + 1}</div>
                    <div style={{ textAlign: 'center', marginTop: '8px' }}>
                      <div style={{ fontSize: '11px', fontWeight: 600, color: step.done ? '#0f172a' : '#94a3b8' }}>{step.label}</div>
                      {step.time && <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '2px' }}>{step.time}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Address */}
            <div style={{ padding: '12px 24px 16px', borderTop: '1px solid #f1f5f9' }}>
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                📍 Delivery: {order.address}
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
