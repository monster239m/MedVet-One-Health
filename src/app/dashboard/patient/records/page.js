'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';

const sidebarItems = [
  { label: 'Main', items: [
    { icon: '🏠', label: 'Dashboard', href: '/dashboard/patient' },
    { icon: '📅', label: 'Appointments', href: '/dashboard/patient/appointments' },
    { icon: '🔍', label: 'Find Doctors', href: '/dashboard/patient/doctors' },
  ]},
  { label: 'Health', items: [
    { icon: '💊', label: 'Prescriptions', href: '/dashboard/patient/prescriptions' },
    { icon: '🏪', label: 'Medicines', href: '/dashboard/patient/medicines' },
    { icon: '📋', label: 'Queue Status', href: '/dashboard/patient/queue' },
    { icon: '📦', label: 'My Orders', href: '/dashboard/patient/orders' },
  ]},
  { label: 'More', items: [
    { icon: '🐾', label: 'My Pets', href: '/dashboard/patient/pets' },
    { icon: '📁', label: 'Health Records', href: '/dashboard/patient/records' },
    { icon: '💬', label: 'Messages', href: '/dashboard/patient/messages' },
    { icon: '⚙️', label: 'Settings', href: '/dashboard/patient/settings' },
  ]},
];

const HEALTH_RECORDS = [
  {
    id: 'REC001', type: 'Lab Report', title: 'Complete Blood Count (CBC)', date: '2026-03-20',
    doctor: 'Dr. Arun Mehta', hospital: 'Apollo Hospital, Mumbai', status: 'normal',
    details: { hemoglobin: '14.2 g/dL', wbc: '7,500 /μL', rbc: '5.1 M/μL', platelets: '250,000 /μL', hematocrit: '42%' },
  },
  {
    id: 'REC002', type: 'Lab Report', title: 'HbA1c Test — Diabetes Monitor', date: '2026-03-18',
    doctor: 'Dr. Arun Mehta', hospital: 'Apollo Hospital, Mumbai', status: 'attention',
    details: { hba1c: '6.8%', fastingGlucose: '118 mg/dL', postprandial: '155 mg/dL', previousHbA1c: '7.2%', target: '<7.0%' },
  },
  {
    id: 'REC003', type: 'Imaging', title: 'Chest X-Ray — PA View', date: '2026-02-15',
    doctor: 'Dr. Vikram Singh', hospital: 'Max Heart Center, Delhi', status: 'normal',
    details: { finding: 'Normal cardiac silhouette', lungFields: 'Clear bilateral lung fields', costophrenic: 'Angles sharp', impression: 'No active pathology' },
  },
  {
    id: 'REC004', type: 'Prescription', title: 'Prescription #RX001 — Diabetes Management', date: '2026-03-10',
    doctor: 'Dr. Arun Mehta', hospital: 'Apollo Hospital, Mumbai', status: 'active',
    details: { medicines: 'Metformin 500mg, Glimepiride 2mg', duration: '30 days', followUp: 'April 10, 2026' },
  },
  {
    id: 'REC005', type: 'Vaccination', title: 'COVID-19 Booster — Covishield', date: '2026-01-20',
    doctor: 'Dr. Anita Desai', hospital: 'Rainbow Children Hospital', status: 'completed',
    details: { vaccine: 'Covishield (AstraZeneca)', dose: 'Booster (3rd dose)', batch: 'ABV5840', nextDue: 'Not required' },
  },
  {
    id: 'REC006', type: 'Lab Report', title: 'Lipid Profile', date: '2025-12-20',
    doctor: 'Dr. Arun Mehta', hospital: 'Apollo Hospital, Mumbai', status: 'attention',
    details: { totalCholesterol: '220 mg/dL', ldl: '140 mg/dL', hdl: '48 mg/dL', triglycerides: '175 mg/dL', vldl: '32 mg/dL' },
  },
  {
    id: 'REC007', type: 'Vet Record', title: 'Bruno — Annual Health Check', date: '2026-03-01',
    doctor: 'Dr. Sneha Reddy', hospital: 'PetCare Clinic, Bangalore', status: 'normal',
    details: { weight: '32 kg', temperature: '101.5°F', heartRate: '80 bpm', vaccination: 'Rabies (up to date)', deworming: 'Done (Feb 2026)' },
  },
];

const VITALS_HISTORY = [
  { date: 'Mar 20', bp: '120/80', pulse: 72, glucose: 118, weight: 75 },
  { date: 'Feb 15', bp: '125/82', pulse: 76, glucose: 125, weight: 76 },
  { date: 'Jan 10', bp: '128/85', pulse: 80, glucose: 132, weight: 77 },
  { date: 'Dec 20', bp: '130/86', pulse: 78, glucose: 140, weight: 78 },
  { date: 'Nov 15', bp: '126/84', pulse: 74, glucose: 128, weight: 76.5 },
];

export default function PatientRecordsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState('all');
  const [expandedCard, setExpandedCard] = useState(null);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'patient')) router.push('/login');
  }, [user, loading, router]);

  if (loading || !user) return null;

  const types = ['all', 'Lab Report', 'Imaging', 'Prescription', 'Vaccination', 'Vet Record'];
  const filtered = tab === 'all' ? HEALTH_RECORDS : HEALTH_RECORDS.filter(r => r.type === tab);

  const typeIcons = { 'Lab Report': '🔬', 'Imaging': '📷', 'Prescription': '💊', 'Vaccination': '💉', 'Vet Record': '🐾' };
  const statusConfig = {
    normal: { bg: '#dcfce7', color: '#15803d', label: 'Normal' },
    attention: { bg: '#fef3c7', color: '#92400e', label: 'Needs Attention' },
    active: { bg: '#dbeafe', color: '#1d4ed8', label: 'Active' },
    completed: { bg: '#f1f5f9', color: '#475569', label: 'Completed' },
  };

  return (
    <DashboardLayout sidebarItems={sidebarItems}>
      <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>Health Records 📁</h1>
            <p style={{ fontSize: '15px', color: '#64748b' }}>Your complete medical history in one place — Human & Pets</p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button style={{
              padding: '8px 16px', borderRadius: '10px', background: '#f1f5f9',
              border: '1px solid #e2e8f0', fontSize: '13px', fontWeight: 600, cursor: 'pointer', color: '#334155',
            }}>📥 Download All</button>
            <button style={{
              padding: '8px 16px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              border: 'none', fontSize: '13px', fontWeight: 600, cursor: 'pointer', color: 'white',
              boxShadow: '0 4px 12px rgba(99,102,241,0.3)',
            }}>📤 Upload Record</button>
          </div>
        </div>

        {/* Health Score Card */}
        <div style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)',
          borderRadius: '16px', padding: '24px', marginBottom: '24px', color: 'white',
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', gap: '20px',
        }}>
          <div style={{ borderRight: '1px solid rgba(255,255,255,0.1)', paddingRight: '20px' }}>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Health Score</div>
            <div style={{ fontSize: '36px', fontWeight: 900 }}>82<span style={{ fontSize: '16px', color: '#22c55e' }}>/100</span></div>
            <div style={{ fontSize: '11px', color: '#22c55e', fontWeight: 600, marginTop: '4px' }}>↗ +5 from last check</div>
          </div>
          {VITALS_HISTORY.slice(0, 1).map((v, i) => (
            <>
              <div key={'bp'+i}>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Blood Pressure</div>
                <div style={{ fontSize: '24px', fontWeight: 800 }}>{v.bp}</div>
                <div style={{ fontSize: '11px', color: '#22c55e', fontWeight: 600, marginTop: '4px' }}>Normal Range</div>
              </div>
              <div key={'hr'+i}>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Heart Rate</div>
                <div style={{ fontSize: '24px', fontWeight: 800 }}>{v.pulse} <span style={{ fontSize: '12px'}}>bpm</span></div>
                <div style={{ fontSize: '11px', color: '#22c55e', fontWeight: 600, marginTop: '4px' }}>Normal</div>
              </div>
              <div key={'gl'+i}>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Fasting Glucose</div>
                <div style={{ fontSize: '24px', fontWeight: 800 }}>{v.glucose} <span style={{ fontSize: '12px'}}>mg/dL</span></div>
                <div style={{ fontSize: '11px', color: '#f59e0b', fontWeight: 600, marginTop: '4px' }}>Slightly Elevated</div>
              </div>
              <div key={'wt'+i}>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Weight</div>
                <div style={{ fontSize: '24px', fontWeight: 800 }}>{v.weight} <span style={{ fontSize: '12px'}}>kg</span></div>
                <div style={{ fontSize: '11px', color: '#22c55e', fontWeight: 600, marginTop: '4px' }}>↘ -3 kg (3 mo)</div>
              </div>
            </>
          ))}
        </div>

        {/* Type Filters */}
        <div style={{ display: 'flex', gap: '4px', background: '#f1f5f9', borderRadius: '12px', padding: '4px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {types.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600,
              background: tab === t ? 'white' : 'transparent',
              color: tab === t ? '#0f172a' : '#64748b',
              border: 'none', cursor: 'pointer',
              boxShadow: tab === t ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
              display: 'flex', alignItems: 'center', gap: '6px',
            }}>
              {typeIcons[t] || '📋'} {t === 'all' ? 'All Records' : t}
            </button>
          ))}
        </div>

        {/* Records */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {filtered.map((record, i) => {
            const stCfg = statusConfig[record.status];
            const isExpanded = expandedCard === record.id;
            return (
              <div key={record.id} style={{
                background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0',
                overflow: 'hidden', animation: `fadeIn 0.4s ease-out ${i * 0.06}s both`,
                transition: 'all 0.3s',
              }}
              onMouseOver={e => e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.06)'}
              onMouseOut={e => e.currentTarget.style.boxShadow = 'none'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '18px 24px', cursor: 'pointer' }}
                  onClick={() => setExpandedCard(isExpanded ? null : record.id)}
                >
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '14px',
                    background: record.type === 'Vet Record' ? 'linear-gradient(135deg, #14b8a6, #06b6d4)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '22px', flexShrink: 0,
                  }}>{typeIcons[record.type]}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2px' }}>
                      <span style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>{record.title}</span>
                      <span style={{ padding: '2px 8px', borderRadius: '999px', fontSize: '10px', fontWeight: 600, background: stCfg.bg, color: stCfg.color }}>{stCfg.label}</span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>{record.doctor} • {record.hospital}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>{record.date}</div>
                    <span style={{ padding: '2px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 600, background: '#f1f5f9', color: '#64748b' }}>{record.type}</span>
                  </div>
                  <span style={{ fontSize: '16px', color: '#94a3b8', transition: 'transform 0.3s', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)' }}>▼</span>
                </div>

                {isExpanded && (
                  <div style={{
                    borderTop: '1px solid #f1f5f9', padding: '18px 24px',
                    background: '#f8fafc', animation: 'fadeIn 0.3s ease-out',
                  }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                      {Object.entries(record.details).map(([key, val]) => (
                        <div key={key} style={{ padding: '10px 14px', borderRadius: '10px', background: 'white', border: '1px solid #e2e8f0' }}>
                          <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'capitalize', marginBottom: '2px' }}>{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                          <div style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>{val}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                      <button style={{ padding: '7px 16px', borderRadius: '8px', background: '#f1f5f9', border: '1px solid #e2e8f0', fontSize: '12px', fontWeight: 600, cursor: 'pointer', color: '#334155' }}>📥 Download PDF</button>
                      <button style={{ padding: '7px 16px', borderRadius: '8px', background: '#f1f5f9', border: '1px solid #e2e8f0', fontSize: '12px', fontWeight: 600, cursor: 'pointer', color: '#334155' }}>📤 Share with Doctor</button>
                      <button style={{ padding: '7px 16px', borderRadius: '8px', background: '#f1f5f9', border: '1px solid #e2e8f0', fontSize: '12px', fontWeight: 600, cursor: 'pointer', color: '#334155' }}>🖨️ Print</button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Vitals Trend */}
        <div style={{ marginTop: '28px', background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '20px' }}>📊 Vitals History — Last 5 Visits</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                  {['Date', 'Blood Pressure', 'Heart Rate', 'Fasting Glucose', 'Weight'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {VITALS_HISTORY.map((v, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}
                    onMouseOver={e => e.currentTarget.style.backgroundColor = '#f8fafc'}
                    onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>{v.date}</td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', color: '#475569' }}>{v.bp} mmHg</td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', color: '#475569' }}>{v.pulse} bpm</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        fontSize: '13px', fontWeight: 600,
                        color: v.glucose > 126 ? '#dc2626' : v.glucose > 100 ? '#f59e0b' : '#22c55e',
                      }}>{v.glucose} mg/dL</span>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', color: '#475569' }}>{v.weight} kg</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
