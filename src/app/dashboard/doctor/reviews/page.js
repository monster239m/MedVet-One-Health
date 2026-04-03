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

export default function DoctorReviewsPage() {
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
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>Patient Reviews ⭐</h1>
        <p style={{ fontSize: '15px', color: '#64748b' }}>Read and respond to patient feedback</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px', marginBottom: '24px' }}>
         <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '32px', textAlign: 'center' }}>
            <div style={{ fontSize: '64px', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>4.8</div>
            <div style={{ fontSize: '24px', color: '#f59e0b', margin: '8px 0' }}>★★★★★</div>
            <div style={{ fontSize: '14px', color: '#64748b', fontWeight: 500 }}>Based on 342 reviews</div>
            
            <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
               {[5, 4, 3, 2, 1].map(star => (
                 <div key={star} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ fontSize: '13px', color: '#64748b', width: '30px' }}>{star} ★</div>
                    <div style={{ flex: 1, height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                       <div style={{ width: `${star === 5 ? 80 : star === 4 ? 15 : star === 3 ? 3 : star === 2 ? 1 : 1}%`, height: '100%', background: '#f59e0b' }}></div>
                    </div>
                 </div>
               ))}
            </div>
         </div>

         <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { name: 'Rahul S.', date: '2 days ago', rating: 5, text: 'Very attentive and patient doctor. Explained the diagnosis clearly and the treatment plan worked perfectly.' },
              { name: 'Priya P.', date: '1 week ago', rating: 5, text: 'The video consultation was very smooth. The doctor was punctual and polite.' },
              { name: 'Amit V.', date: '2 weeks ago', rating: 4, text: 'Good doctor, but there was a slight delay in the clinic waiting area. However, the treatment was excellent.' },
            ].map((review, i) => (
              <div key={i} style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px', animation: `fadeInUp 0.5s ease-out ${i*0.1}s` }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>{review.name}</div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>{review.date}</div>
                    </div>
                    <div style={{ color: '#f59e0b', fontSize: '14px' }}>
                       {'★'.repeat(review.rating)}{'☆'.repeat(5-review.rating)}
                    </div>
                 </div>
                 <div style={{ fontSize: '14px', color: '#334155', lineHeight: 1.6, marginBottom: '16px' }}>&quot;{review.text}&quot;</div>
                 <button style={{ fontSize: '13px', fontWeight: 600, color: '#6366f1', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Reply to review</button>
              </div>
            ))}
         </div>
      </div>
    </DashboardLayout>
  );
}
