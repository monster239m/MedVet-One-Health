'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { MOCK_MEDICINES } from '@/data/mockData';

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

export default function MedicinesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  if (loading || !user) return null;

  const categories = ['all', ...new Set(MOCK_MEDICINES.map(m => m.category))];
  let medicines = [...MOCK_MEDICINES];
  if (search) medicines = medicines.filter(m => m.name.toLowerCase().includes(search.toLowerCase()));
  if (category !== 'all') medicines = medicines.filter(m => m.category === category);

  const addToCart = (med) => {
    setCart(prev => {
      const existing = prev.find(c => c.id === med.id);
      if (existing) return prev.map(c => c.id === med.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { ...med, qty: 1 }];
    });
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(c => c.id !== id));
  const updateQty = (id, qty) => {
    if (qty <= 0) return removeFromCart(id);
    setCart(prev => prev.map(c => c.id === id ? { ...c, qty } : c));
  };
  const cartTotal = cart.reduce((sum, c) => sum + c.price * c.qty, 0);

  return (
    <DashboardLayout sidebarItems={sidebarItems}>
      <div style={{ marginBottom: '28px', animation: 'fadeIn 0.5s ease-out' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>Medicine Store 💊</h1>
            <p style={{ fontSize: '15px', color: '#64748b' }}>Order medicines for humans and pets with doorstep delivery</p>
          </div>
          <button onClick={() => setShowCart(true)} style={{
            position: 'relative', padding: '10px 20px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            color: 'white', fontWeight: 600, fontSize: '14px',
            cursor: 'pointer', border: 'none', display: 'flex', alignItems: 'center', gap: '8px',
            boxShadow: '0 4px 15px rgba(99,102,241,0.3)',
          }}>
            🛒 Cart
            {cart.length > 0 && (
              <span style={{
                padding: '2px 8px', borderRadius: '999px',
                background: '#ef4444', fontSize: '11px', fontWeight: 700,
              }}>{cart.length}</span>
            )}
          </button>
        </div>
      </div>

      {/* Promo Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #a78bfa)',
        borderRadius: '16px', padding: '24px 32px', marginBottom: '24px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        color: 'white', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }}></div>
        <div>
          <div style={{ fontSize: '20px', fontWeight: 800, marginBottom: '4px' }}>🎉 First Order Offer!</div>
          <div style={{ fontSize: '14px', opacity: 0.9 }}>Get 15% off on your first medicine order. Use code: MEDVET15</div>
        </div>
        <div style={{ fontSize: '32px', fontWeight: 900, opacity: 0.9 }}>15% OFF</div>
      </div>

      {/* Search & Filter */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', alignItems: 'center' }}>
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center', gap: '10px',
          background: 'white', borderRadius: '12px', padding: '10px 16px',
          border: '1px solid #e2e8f0',
        }}>
          <span>🔍</span>
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search medicines..."
            style={{ flex: 1, background: 'none', border: 'none', fontSize: '14px', color: '#0f172a', outline: 'none' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {categories.map(c => (
            <button key={c} onClick={() => setCategory(c)}
              style={{
                padding: '8px 14px', borderRadius: '10px', fontSize: '12px', fontWeight: 500,
                background: category === c ? '#6366f1' : 'white',
                color: category === c ? 'white' : '#64748b',
                border: `1px solid ${category === c ? '#6366f1' : '#e2e8f0'}`,
                cursor: 'pointer', textTransform: 'capitalize', transition: 'all 0.2s',
              }}>{c}</button>
          ))}
        </div>
      </div>

      {/* Medicine Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        {medicines.map((med, i) => {
          const inCart = cart.find(c => c.id === med.id);
          return (
            <div key={med.id} style={{
              background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0',
              padding: '20px', transition: 'all 0.3s',
              animation: `fadeIn 0.4s ease-out ${i * 0.05}s both`,
            }}
            onMouseOver={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='0 12px 30px rgba(0,0,0,0.08)'; }}
            onMouseOut={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none'; }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div style={{ fontSize: '36px' }}>{med.image}</div>
                {med.prescription && (
                  <span style={{
                    padding: '2px 8px', borderRadius: '999px', fontSize: '10px', fontWeight: 600,
                    background: '#fef3c7', color: '#92400e',
                  }}>℞ Required</span>
                )}
              </div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>{med.name}</div>
              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>{med.category}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>₹{med.price}</div>
                <div style={{ fontSize: '11px', color: med.stock > 100 ? '#22c55e' : '#f59e0b' }}>
                  {med.stock > 100 ? 'In Stock' : `Only ${med.stock} left`}
                </div>
              </div>
              {inCart ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button onClick={() => updateQty(med.id, inCart.qty - 1)} style={{
                    width: '32px', height: '32px', borderRadius: '8px', background: '#f1f5f9',
                    border: '1px solid #e2e8f0', cursor: 'pointer', fontSize: '16px', fontWeight: 700,
                  }}>−</button>
                  <span style={{ flex: 1, textAlign: 'center', fontWeight: 700, fontSize: '14px' }}>{inCart.qty}</span>
                  <button onClick={() => updateQty(med.id, inCart.qty + 1)} style={{
                    width: '32px', height: '32px', borderRadius: '8px', background: '#6366f1',
                    border: 'none', cursor: 'pointer', fontSize: '16px', fontWeight: 700, color: 'white',
                  }}>+</button>
                </div>
              ) : (
                <button onClick={() => addToCart(med)} style={{
                  width: '100%', padding: '8px', borderRadius: '10px',
                  background: '#f1f5f9', border: '1px solid #e2e8f0',
                  fontSize: '13px', fontWeight: 600, color: '#334155',
                  cursor: 'pointer', transition: 'all 0.2s',
                }}>+ Add to Cart</button>
              )}
            </div>
          );
        })}
      </div>

      {/* Cart Sidebar */}
      {showCart && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(4px)', zIndex: 300, display: 'flex',
          justifyContent: 'flex-end', animation: 'fadeIn 0.2s ease-out',
        }} onClick={() => setShowCart(false)}>
          <div style={{
            width: '420px', background: 'white', height: '100%',
            animation: 'slideInRight 0.3s ease-out',
            display: 'flex', flexDirection: 'column',
          }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800 }}>🛒 Your Cart ({cart.length})</h3>
              <button onClick={() => setShowCart(false)} style={{ fontSize: '20px', color: '#94a3b8', cursor: 'pointer', background: 'none', border: 'none' }}>✕</button>
            </div>
            <div style={{ flex: 1, overflow: 'auto', padding: '16px 24px' }}>
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
                  <div style={{ fontSize: '48px', marginBottom: '12px' }}>🛒</div>
                  <div style={{ fontSize: '15px', fontWeight: 500 }}>Your cart is empty</div>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} style={{
                    display: 'flex', gap: '12px', padding: '14px', borderRadius: '12px',
                    background: '#f8fafc', marginBottom: '10px', alignItems: 'center',
                  }}>
                    <span style={{ fontSize: '28px' }}>{item.image}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '13px', fontWeight: 600 }}>{item.name}</div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>₹{item.price} × {item.qty}</div>
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 700 }}>₹{item.price * item.qty}</div>
                    <button onClick={() => removeFromCart(item.id)} style={{
                      color: '#ef4444', cursor: 'pointer', background: 'none', border: 'none', fontSize: '14px',
                    }}>✕</button>
                  </div>
                ))
              )}
            </div>
            {cart.length > 0 && (
              <div style={{ padding: '20px 24px', borderTop: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: '#64748b' }}>Subtotal</span>
                  <span style={{ fontWeight: 700 }}>₹{cartTotal}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: '#64748b' }}>Delivery</span>
                  <span style={{ fontWeight: 600, color: '#22c55e' }}>FREE</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid #f1f5f9', marginBottom: '16px' }}>
                  <span style={{ fontWeight: 700, fontSize: '16px' }}>Total</span>
                  <span style={{ fontWeight: 800, fontSize: '18px', color: '#6366f1' }}>₹{cartTotal}</span>
                </div>
                <button onClick={() => { setShowCart(false); setCart([]); alert('Order placed successfully! (Prototype)'); }} style={{
                  width: '100%', padding: '14px', borderRadius: '12px',
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  color: 'white', fontWeight: 700, fontSize: '15px',
                  cursor: 'pointer', border: 'none',
                  boxShadow: '0 8px 25px rgba(99,102,241,0.4)',
                }}>Place Order →</button>
              </div>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
