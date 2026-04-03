'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { MOCK_PRESCRIPTIONS, MOCK_USERS } from '@/data/mockData';

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

export default function DoctorPrescriptionsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'doctor')) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) return null;

  const prescriptions = MOCK_PRESCRIPTIONS.filter(p => p.doctorId === user.id);

  return (
    <DashboardLayout sidebarItems={sidebarItems}>
      <div style={{ marginBottom: '28px', animation: 'fadeIn 0.5s ease-out' }}>
         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>Prescriptions 💊</h1>
              <p style={{ fontSize: '15px', color: '#64748b' }}>Write and manage patient prescriptions</p>
            </div>
            <button onClick={() => setShowForm(!showForm)} style={{
              padding: '10px 20px', borderRadius: '12px',
              background: 'linear-gradient(135deg, #14b8a6, #06b6d4)',
              color: 'white', fontWeight: 600, fontSize: '14px',
              cursor: 'pointer', border: 'none', boxShadow: '0 4px 15px rgba(20,184,166,0.3)',
            }}>✍️ Write New Rx</button>
         </div>
      </div>

      {showForm && (
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px', marginBottom: '24px', animation: 'fadeInDown 0.3s ease-out' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', marginBottom: '20px' }}>New Prescription</h3>
           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Select Patient</label>
                <select style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none' }}>
                  <option>Rahul Sharma (PAT001)</option>
                  <option>Priya Patel (PAT002)</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Diagnosis</label>
                <input type="text" placeholder="e.g. Viral Fever" style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none' }} />
              </div>
           </div>
           
           <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', marginBottom: '16px' }}>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '12px' }}>Medicines</div>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                <input type="text" placeholder="Medicine Name" style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none' }} />
                <input type="text" placeholder="Dosage (e.g. 1-0-1)" style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none' }} />
                <input type="text" placeholder="Duration" style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none' }} />
                <button style={{ padding: '8px', background: '#e2e8f0', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>+ Add</button>
              </div>
           </div>

           <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Clinical Notes</label>
              <textarea rows="3" placeholder="Additional instructions..." style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', fontFamily: 'inherit' }}></textarea>
           </div>
           
           <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <button style={{ padding: '10px 24px', borderRadius: '10px', background: 'linear-gradient(135deg, #14b8a6, #06b6d4)', color: 'white', fontWeight: 700, fontSize: '14px', border: 'none', cursor: 'pointer' }}>Generate Rx</button>
              <button onClick={() => setShowForm(false)} style={{ padding: '10px 24px', borderRadius: '10px', background: '#f1f5f9', color: '#64748b', fontWeight: 600, fontSize: '14px', border: '1px solid #e2e8f0', cursor: 'pointer' }}>Cancel</button>
           </div>
        </div>
      )}

      {/* Existing Prescriptions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {prescriptions.map((rx, i) => {
          const patient = MOCK_USERS.patients.find(p => p.id === rx.patientId);
          return (
            <div key={rx.id} style={{
              background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0',
              overflow: 'hidden', animation: `fadeInUp 0.5s ease-out ${i * 0.15}s both`,
            }}>
              <div style={{
                padding: '20px 24px',
                background: 'linear-gradient(135deg, rgba(20,184,166,0.08), rgba(6,182,212,0.04))',
                borderBottom: '1px solid #f1f5f9',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '12px',
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontWeight: 700, fontSize: '16px',
                  }}>{patient?.initials}</div>
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>{patient?.name}</div>
                    <div style={{ fontSize: '13px', color: '#64748b' }}>Date: {rx.date}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button style={{
                    padding: '6px 14px', borderRadius: '8px', background: '#f1f5f9',
                    border: '1px solid #e2e8f0', fontSize: '12px', fontWeight: 500,
                    cursor: 'pointer', color: '#334155',
                  }}>View PDF</button>
                </div>
              </div>

              <div style={{ padding: '16px 24px', borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Diagnosis</div>
                <div style={{ fontSize: '15px', fontWeight: 600, color: '#0f172a' }}>{rx.diagnosis}</div>
              </div>

              <div style={{ padding: '0 24px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                     <tr>
                      {['Medicine', 'Dosage', 'Duration', 'Instructions'].map(h => (
                        <th key={h} style={{
                          padding: '12px 0', textAlign: 'left', fontSize: '11px', fontWeight: 600,
                          color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em',
                          borderBottom: '1px solid #f1f5f9',
                        }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rx.medicines.map((med, j) => (
                      <tr key={j}>
                        <td style={{ padding: '12px 0', fontSize: '14px', fontWeight: 600, color: '#0f172a', borderBottom: '1px solid #f8fafc' }}>💊 {med.name}</td>
                        <td style={{ padding: '12px 0', fontSize: '13px', color: '#334155', borderBottom: '1px solid #f8fafc' }}>
                          <span style={{ padding: '2px 10px', borderRadius: '999px', background: '#e0e7ff', color: '#4338ca', fontSize: '12px', fontWeight: 600 }}>{med.dosage}</span>
                        </td>
                        <td style={{ padding: '12px 0', fontSize: '13px', color: '#334155', borderBottom: '1px solid #f8fafc' }}>{med.duration}</td>
                        <td style={{ padding: '12px 0', fontSize: '13px', color: '#64748b', borderBottom: '1px solid #f8fafc' }}>{med.instructions}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
