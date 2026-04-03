'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { MOCK_USERS } from '@/data/mockData';

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

export default function DoctorAnalyticsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [doctor, setDoctor] = useState(null);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'doctor')) {
      router.push('/login');
    }
    if (user) {
      const d = MOCK_USERS.doctors.find(doc => doc.id === user.id);
      setDoctor(d);
    }
  }, [user, loading, router]);

  if (loading || !user || !doctor) return null;

  return (
    <DashboardLayout sidebarItems={sidebarItems}>
       <div style={{ marginBottom: '28px', animation: 'fadeIn 0.5s ease-out' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>Practice Analytics 📈</h1>
        <p style={{ fontSize: '15px', color: '#64748b' }}>Insights into your consultations and performance over time</p>
      </div>

      {/* Summary Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '24px' }}>
        {[
          { label: 'Total Consultations', value: doctor.totalConsultations.toLocaleString(), change: '+12% this month', icon: '🩺', color: '#6366f1' },
          { label: 'Total Patients', value: '1,245', change: '+5% this month', icon: '👥', color: '#14b8a6' },
          { label: 'Patient Retention', value: '84%', change: 'Steady', icon: '❤️', color: '#f59e0b' },
          { label: 'Platform Rating', value: `${doctor.rating} ⭐`, change: `From ${doctor.totalReviews} reviews`, icon: '🏆', color: '#22c55e' },
        ].map((stat, i) => (
          <div key={i} style={{
            background: 'white', borderRadius: '16px', padding: '20px',
            border: '1px solid #e2e8f0', animation: `fadeInUp 0.5s ease-out ${i * 0.1}s both`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: `${stat.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>{stat.icon}</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>{stat.label}</div>
            </div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>{stat.value}</div>
            <div style={{ fontSize: '12px', color: stat.color, fontWeight: 600 }}>{stat.change}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
          {/* Revenue Chart Placeholder */}
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
               <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>Monthly Consultations</h3>
               <select style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px', outline: 'none' }}>
                 <option>Last 6 Months</option>
                 <option>This Year</option>
               </select>
             </div>
             
             {/* Mock Chart */}
             <div style={{ display: 'flex', alignItems: 'flex-end', gap: '24px', height: '250px', paddingBottom: '20px', borderBottom: '1px solid #f1f5f9' }}>
                {[
                  { month: 'Oct', val: 45 }, { month: 'Nov', val: 60 }, { month: 'Dec', val: 50 },
                  { month: 'Jan', val: 80 }, { month: 'Feb', val: 95 }, { month: 'Mar', val: 75 }
                ].map(bar => (
                   <div key={bar.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                     <div style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>{bar.val * 5}</div>
                     <div style={{ width: '100%', background: 'linear-gradient(180deg, #6366f1, #8b5cf6)', height: `${bar.val}%`, borderRadius: '8px 8px 0 0', opacity: 0.9 }}></div>
                     <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>{bar.month}</div>
                   </div>
                ))}
             </div>
          </div>

          {/* Patient Demographics */}
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
             <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '24px' }}>Consultation Types</h3>
             
             <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                <div style={{ width: '160px', height: '160px', borderRadius: '50%', background: 'conic-gradient(#6366f1 0% 65%, #14b8a6 65% 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                   <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyItems: 'center', paddingLeft: '30px', paddingTop: '30px' }}>
                     <div style={{ fontSize: '18px', fontWeight: 800 }}>100%</div>
                   </div>
                </div>
             </div>

             <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#6366f1' }}></div>
                    <span style={{ fontSize: '14px', color: '#334155', fontWeight: 500 }}>Video Consultations</span>
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: 700 }}>65%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#14b8a6' }}></div>
                    <span style={{ fontSize: '14px', color: '#334155', fontWeight: 500 }}>In-Person Visits</span>
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: 700 }}>35%</span>
                </div>
             </div>
          </div>
      </div>
    </DashboardLayout>
  );
}
