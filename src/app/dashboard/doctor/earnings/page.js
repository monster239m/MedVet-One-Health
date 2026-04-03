'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';

const sidebarItems = [
  { label: 'Main', items: [
    { icon: '📊', label: 'Dashboard', href: '/dashboard/doctor' },
    { icon: '📅', label: 'Appointments', href: '/dashboard/doctor/appointments' },
    { icon: '👥', label: 'My Patients', href: '/dashboard/doctor/patients' },
  ]},
  { label: 'Practice', items: [
    { icon: '📋', label: 'Queue Management', href: '/dashboard/doctor/queue' },
    { icon: '💊', label: 'Prescriptions', href: '/dashboard/doctor/prescriptions' },
    { icon: '📹', label: 'Consultations', href: '/dashboard/doctor/consultations' },
    { icon: '📊', label: 'Analytics', href: '/dashboard/doctor/analytics' },
  ]},
  { label: 'Account', items: [
    { icon: '👤', label: 'My Profile', href: '/dashboard/doctor/profile' },
    { icon: '💰', label: 'Earnings', href: '/dashboard/doctor/earnings' },
    { icon: '⭐', label: 'Reviews', href: '/dashboard/doctor/reviews' },
    { icon: '⚙️', label: 'Settings', href: '/dashboard/doctor/settings' },
  ]},
];

export default function DoctorEarningsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'doctor')) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) return null;

  return (
    <DashboardLayout sidebarItems={sidebarItems}>
       <div style={{ marginBottom: '28px', animation: 'fadeIn 0.5s ease-out' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>Earnings & Payouts 💰</h1>
        <p style={{ fontSize: '15px', color: '#64748b' }}>Track your revenue, bank accounts, and payouts</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '24px' }}>
         <div style={{ background: 'linear-gradient(135deg, #0f172a, #334155)', borderRadius: '16px', padding: '24px', color: 'white', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', right: '-20px', top: '-20px', fontSize: '100px', opacity: 0.1 }}>💰</div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#e2e8f0', marginBottom: '8px' }}>Available Balance</div>
            <div style={{ fontSize: '36px', fontWeight: 800, marginBottom: '20px' }}>₹ 42,500</div>
            <button style={{ padding: '10px 20px', borderRadius: '10px', background: 'white', color: '#0f172a', fontWeight: 700, fontSize: '14px', border: 'none', cursor: 'pointer' }}>Withdraw Funds</button>
         </div>
         <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
             <div style={{ fontSize: '14px', fontWeight: 600, color: '#64748b', marginBottom: '8px' }}>Pending Clearance</div>
             <div style={{ fontSize: '32px', fontWeight: 800, color: '#0f172a', marginBottom: '12px' }}>₹ 12,400</div>
             <div style={{ fontSize: '13px', color: '#f59e0b', fontWeight: 500, background: '#fef3c7', padding: '4px 8px', borderRadius: '6px', display: 'inline-block' }}>⏳ Settles in 3-5 business days</div>
         </div>
         <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
             <div style={{ fontSize: '14px', fontWeight: 600, color: '#64748b', marginBottom: '8px' }}>Lifetime Earnings</div>
             <div style={{ fontSize: '32px', fontWeight: 800, color: '#0f172a', marginBottom: '12px' }}>₹ 8,45,200</div>
             <div style={{ fontSize: '13px', color: '#22c55e', fontWeight: 500, background: '#dcfce7', padding: '4px 8px', borderRadius: '6px', display: 'inline-block' }}>📈 Top 10% performer</div>
         </div>
      </div>

      <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
         <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>Recent Transactions</h3>
            <button style={{ padding: '6px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>Download CSV</button>
         </div>
         <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
               <tr style={{ background: '#f8fafc' }}>
                  <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Date</th>
                  <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Description</th>
                  <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Type</th>
                  <th style={{ padding: '12px 24px', textAlign: 'right', fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Amount</th>
                  <th style={{ padding: '12px 24px', textAlign: 'right', fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Status</th>
               </tr>
            </thead>
            <tbody>
               {[
                 { date: '28 Mar 2026', desc: 'Consultation - Rahul Sharma', type: 'Credit', amount: '+ ₹800', status: 'Cleared', color: '#22c55e' },
                 { date: '27 Mar 2026', desc: 'Payout to Bank Acct ****9821', type: 'Debit', amount: '- ₹25,000', status: 'Processing', color: '#f59e0b' },
                 { date: '26 Mar 2026', desc: 'Consultation - Amit Verma', type: 'Credit', amount: '+ ₹800', status: 'Cleared', color: '#22c55e' },
                 { date: '26 Mar 2026', desc: 'Consultation - Sunita K.', type: 'Credit', amount: '+ ₹800', status: 'Cleared', color: '#22c55e' },
               ].map((txn, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                     <td style={{ padding: '16px 24px', fontSize: '14px', color: '#334155' }}>{txn.date}</td>
                     <td style={{ padding: '16px 24px', fontSize: '14px', color: '#0f172a', fontWeight: 500 }}>{txn.desc}</td>
                     <td style={{ padding: '16px 24px', fontSize: '14px', color: '#64748b' }}>{txn.type}</td>
                     <td style={{ padding: '16px 24px', fontSize: '14px', fontWeight: 700, textAlign: 'right', color: txn.type === 'Credit' ? '#15803d' : '#0f172a' }}>{txn.amount}</td>
                     <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                        <span style={{ padding: '4px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 600, background: `${txn.color}15`, color: txn.color }}>{txn.status}</span>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
    </DashboardLayout>
  );
}
