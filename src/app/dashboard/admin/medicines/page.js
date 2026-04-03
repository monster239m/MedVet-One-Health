'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { MOCK_MEDICINES } from '@/data/mockData';

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

export default function AdminMedicinesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) return null;

  let inventory = MOCK_MEDICINES;
  if (search) {
    inventory = inventory.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()));
  }

  return (
    <DashboardLayout sidebarItems={sidebarItems}>
       <div style={{ marginBottom: '28px', animation: 'fadeIn 0.5s ease-out' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>Medicine Inventory 💊</h1>
            <p style={{ fontSize: '15px', color: '#64748b' }}>Manage product catalog, pricing, and stock levels</p>
          </div>
          <button style={{
            padding: '10px 20px', borderRadius: '12px', background: 'linear-gradient(135deg, #14b8a6, #06b6d4)',
            color: 'white', fontWeight: 600, fontSize: '14px', cursor: 'pointer', border: 'none', boxShadow: '0 4px 15px rgba(20,184,166,0.3)',
          }}>+ Add Product</button>
        </div>
      </div>

       <div style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        background: 'white', borderRadius: '12px', padding: '10px 16px',
        border: '1px solid #e2e8f0', marginBottom: '24px',
      }}>
        <span style={{ fontSize: '18px' }}>🔍</span>
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search products by name or category..."
          style={{ flex: 1, background: 'none', border: 'none', fontSize: '15px', color: '#0f172a', outline: 'none' }}
        />
        <select style={{ padding: '6px 12px', borderRadius: '8px', background: '#f8fafc', border: '1px solid #e2e8f0', outline: 'none', fontSize: '13px' }}>
          <option>All Stock</option>
          <option>Low Stock</option>
          <option>Out of Stock</option>
        </select>
      </div>

      <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
           <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                 <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Product Name</th>
                 <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Category/Type</th>
                 <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Pricing</th>
                 <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Available Stock</th>
                 <th style={{ padding: '16px 24px', textAlign: 'right', fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Actions</th>
              </tr>
           </thead>
           <tbody>
              {inventory.map((item, i) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' }} onMouseOver={e=>e.currentTarget.style.backgroundColor='#f8fafc'} onMouseOut={e=>e.currentTarget.style.backgroundColor='transparent'}>
                   <td style={{ padding: '16px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                         <div style={{ fontSize: '24px', padding: '8px', background: '#f1f5f9', borderRadius: '8px' }}>{item.image}</div>
                         <div>
                            <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>{item.name}</div>
                            <div style={{ fontSize: '12px', color: '#64748b' }}>ID: {item.id}</div>
                         </div>
                      </div>
                   </td>
                   <td style={{ padding: '16px 24px' }}>
                      <div style={{ fontSize: '13px', color: '#0f172a', fontWeight: 600 }}>{item.category}</div>
                      {item.prescription && <div style={{ fontSize: '11px', color: '#ef4444', fontWeight: 600 }}>Rx Required</div>}
                   </td>
                   <td style={{ padding: '16px 24px', fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>
                      ₹ {item.price}
                   </td>
                   <td style={{ padding: '16px 24px' }}>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: item.stock < 100 ? '#ef4444' : '#15803d' }}>{item.stock} Units</div>
                      {item.stock < 100 && <div style={{ fontSize: '11px', color: '#ef4444', fontWeight: 600 }}>Low Stock Alert</div>}
                   </td>
                   <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                         <button style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', fontSize: '12px', fontWeight: 600, cursor: 'pointer', color: '#334155' }}>Edit</button>
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
