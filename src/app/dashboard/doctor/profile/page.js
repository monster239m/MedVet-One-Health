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

export default function DoctorProfilePage() {
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
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>My Public Profile 👤</h1>
        <p style={{ fontSize: '15px', color: '#64748b' }}>Manage how your profile appears to patients</p>
      </div>

      <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '32px' }}>
         <div style={{ display: 'flex', alignItems: 'flex-start', gap: '32px', borderBottom: '1px solid #f1f5f9', paddingBottom: '32px', marginBottom: '32px' }}>
             <div style={{
                  width: '120px', height: '120px', borderRadius: '24px',
                  background: 'linear-gradient(135deg, #14b8a6, #06b6d4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontWeight: 800, fontSize: '40px', position: 'relative',
             }}>
                {doctor.initials}
                <button style={{ position: 'absolute', bottom: '-10px', right: '-10px', background: 'white', border: '1px solid #e2e8f0', padding: '6px', borderRadius: '50%', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>📷</button>
             </div>
             <div style={{ flex: 1 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#64748b', marginBottom: '6px' }}>Full Name</label>
                    <input type="text" defaultValue={doctor.name} style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '2px solid #e2e8f0', fontSize: '14px', color: '#0f172a', outline: 'none' }} />
                  </div>
                  <div>
                     <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#64748b', marginBottom: '6px' }}>Specialization</label>
                    <input type="text" defaultValue={doctor.specialization} style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '2px solid #e2e8f0', fontSize: '14px', color: '#0f172a', outline: 'none' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#64748b', marginBottom: '6px' }}>Qualifications</label>
                    <input type="text" defaultValue={doctor.qualification} style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '2px solid #e2e8f0', fontSize: '14px', color: '#0f172a', outline: 'none' }} />
                  </div>
                  <div>
                     <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#64748b', marginBottom: '6px' }}>Years of Experience</label>
                    <input type="number" defaultValue={doctor.experience} style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '2px solid #e2e8f0', fontSize: '14px', color: '#0f172a', outline: 'none' }} />
                  </div>
                </div>
             </div>
         </div>

         <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#64748b', marginBottom: '6px' }}>Professional Bio (Visible to patients)</label>
            <textarea rows="4" defaultValue={doctor.bio} style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '2px solid #e2e8f0', fontSize: '14px', color: '#0f172a', outline: 'none', fontFamily: 'inherit' }}></textarea>
         </div>

         <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>Practice Details</h3>
         <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '32px' }}>
             <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#64748b', marginBottom: '6px' }}>Hospital / Clinic Name</label>
                <input type="text" defaultValue={doctor.hospital} style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '2px solid #e2e8f0', fontSize: '14px', color: '#0f172a', outline: 'none' }} />
             </div>
             <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#64748b', marginBottom: '6px' }}>City Location</label>
                <input type="text" defaultValue={doctor.city} style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '2px solid #e2e8f0', fontSize: '14px', color: '#0f172a', outline: 'none' }} />
             </div>
             <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#64748b', marginBottom: '6px' }}>Consultation Fee</label>
                <input type="number" defaultValue={doctor.consultationFee} style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '2px solid #e2e8f0', fontSize: '14px', color: '#0f172a', outline: 'none' }} />
             </div>
         </div>

         <div style={{ display: 'flex', gap: '12px' }}>
            <button style={{ padding: '12px 28px', borderRadius: '10px', background: 'linear-gradient(135deg, #14b8a6, #06b6d4)', color: 'white', fontWeight: 700, fontSize: '14px', border: 'none', cursor: 'pointer', boxShadow: '0 4px 15px rgba(20,184,166,0.3)' }}>Save Profile</button>
            <button style={{ padding: '12px 28px', borderRadius: '10px', background: '#f1f5f9', color: '#64748b', fontWeight: 600, fontSize: '14px', border: '1px solid #e2e8f0', cursor: 'pointer' }}>Cancel</button>
         </div>
      </div>
    </DashboardLayout>
  );
}
