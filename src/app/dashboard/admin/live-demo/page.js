'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useLiveDemo, PHASES, PHASE_LABELS } from '@/context/LiveDemoContext';
import LiveMap from '@/components/LiveMap';
import TreatmentTimeline from '@/components/TreatmentTimeline';
import TreatmentSummary from '@/components/TreatmentSummary';
import NotificationToast from '@/components/NotificationToast';

const sidebarItems = [
  { label: 'Overview', items: [
    { icon: '📊', label: 'Dashboard', href: '/dashboard/admin' },
    { icon: '🎯', label: 'Live Demo', href: '/dashboard/admin/live-demo' },
    { icon: '📈', label: 'Analytics', href: '/dashboard/admin/analytics' },
    { icon: '🔔', label: 'Alerts', href: '/dashboard/admin/alerts', badge: '3', badgeColor: 'rgba(239,68,68,0.4)' },
  ]},
  { label: 'Management', items: [
    { icon: '👥', label: 'Users', href: '/dashboard/admin/users' },
    { icon: '👨‍⚕️', label: 'Doctors', href: '/dashboard/admin/doctors' },
    { icon: '✅', label: 'Verifications', href: '/dashboard/admin/verifications' },
    { icon: '📅', label: 'Appointments', href: '/dashboard/admin/appointments' },
  ]},
  { label: 'Operations', items: [
    { icon: '💊', label: 'Medicine Inventory', href: '/dashboard/admin/medicines' },
    { icon: '📦', label: 'Orders', href: '/dashboard/admin/orders' },
    { icon: '💰', label: 'Revenue', href: '/dashboard/admin/revenue' },
  ]},
  { label: 'System', items: [
    { icon: '🔧', label: 'Settings', href: '/dashboard/admin/settings' },
    { icon: '📜', label: 'Audit Logs', href: '/dashboard/admin/logs' },
    { icon: '🛡️', label: 'Security', href: '/dashboard/admin/security' },
  ]},
];

function PhaseStatusBadge({ phase, color }) {
  return (
    <div style={{
      padding: '4px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: 700,
      background: `${color}15`, color, display: 'inline-flex', alignItems: 'center', gap: '6px',
    }}>
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: color, animation: 'pulse 1.5s infinite', display: 'inline-block' }} />
      {PHASE_LABELS[phase] || phase}
    </div>
  );
}

export default function AdminLiveDemoPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const demo = useLiveDemo();
  const [activeTab, setActiveTab] = useState('overview');
  const [blockReason, setBlockReason] = useState('');
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [notifMessage, setNotifMessage] = useState('');
  const [notifTarget, setNotifTarget] = useState('patient');
  const [dismissedNotifs, setDismissedNotifs] = useState(new Set());

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) router.push('/login');
  }, [user, loading, router]);

  const handleDismissNotif = (id) => setDismissedNotifs(prev => new Set([...prev, id]));
  const visibleNotifs = (demo.notifications.admin || []).filter(n => !dismissedNotifs.has(n.id));

  if (loading || !user) return null;

  const progress = demo.getProgress ? demo.getProgress() : 0;
  const isActive = demo.phase !== PHASES.IDLE && demo.phase !== PHASES.COMPLETED;
  const phaseColor = demo.adminOverrides?.blocked ? '#ef4444' : demo.adminOverrides?.paused ? '#f59e0b' : '#22c55e';

  const tabs = [
    { id: 'overview', label: '📡 Overview' },
    { id: 'map', label: '🗺️ Live Map' },
    { id: 'controls', label: '🎛️ Controls' },
    { id: 'payments', label: '💰 Payments' },
    { id: 'audit', label: '📋 Audit Trail' },
    { id: 'summary', label: '📊 Summary' },
  ];

  return (
    <DashboardLayout sidebarItems={sidebarItems}>
      <NotificationToast notifications={visibleNotifs} onDismiss={handleDismissNotif} />

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
            <h1 style={{ fontSize: '26px', fontWeight: 900, color: '#0f172a' }}>📡 Live Operations Center</h1>
            {isActive && (
              <div style={{ padding: '4px 12px', borderRadius: '999px', background: 'rgba(239,68,68,0.1)', fontSize: '12px', fontWeight: 700, color: '#ef4444', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ef4444', animation: 'pulse 1.5s infinite', display: 'inline-block' }} />
                LIVE SESSION ACTIVE
              </div>
            )}
          </div>
          <p style={{ fontSize: '14px', color: '#64748b' }}>Real-time monitoring and control of live treatment sessions</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {demo.adminOverrides?.blocked ? (
            <button onClick={demo.adminResume} style={{
              padding: '10px 18px', borderRadius: '12px', fontWeight: 700, fontSize: '13px',
              background: 'linear-gradient(135deg, #22c55e, #10b981)', color: 'white', border: 'none', cursor: 'pointer',
            }}>▶️ Resume Session</button>
          ) : (
            <button onClick={() => setShowBlockModal(true)} disabled={!isActive} style={{
              padding: '10px 18px', borderRadius: '12px', fontWeight: 700, fontSize: '13px',
              background: isActive ? 'linear-gradient(135deg, #f43f5e, #e11d48)' : '#f1f5f9',
              color: isActive ? 'white' : '#94a3b8', border: 'none', cursor: isActive ? 'pointer' : 'not-allowed',
            }}>🛑 Emergency Stop</button>
          )}
          <button onClick={demo.resetDemo} style={{
            padding: '10px 18px', borderRadius: '12px', fontWeight: 600, fontSize: '13px',
            background: '#f1f5f9', color: '#334155', border: '1px solid #e2e8f0', cursor: 'pointer',
          }}>🔄 Reset</button>
        </div>
      </div>

      {/* Status Bar */}
      {isActive && (
        <div style={{
          background: demo.adminOverrides?.blocked ? '#fef2f2' : '#f0fdf4',
          border: `1px solid ${demo.adminOverrides?.blocked ? '#fecaca' : '#bbf7d0'}`,
          borderRadius: '14px', padding: '12px 20px', marginBottom: '20px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <PhaseStatusBadge phase={demo.phase} color={phaseColor} />
            <div style={{ fontSize: '13px', color: '#64748b' }}>
              {demo.demoPatient?.name} → {demo.demoDoctor?.name}
            </div>
            {demo.adminOverrides?.blocked && (
              <div style={{ fontSize: '13px', color: '#dc2626', fontWeight: 600 }}>
                ⛔ Blocked: {demo.adminOverrides?.notes || 'No reason'}
              </div>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ fontSize: '12px', color: '#64748b' }}>Progress</div>
            <div style={{ width: '120px', height: '6px', background: '#e2e8f0', borderRadius: '999px', overflow: 'hidden' }}>
              <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, #6366f1, #22c55e)', borderRadius: '999px', transition: 'width 0.5s ease' }} />
            </div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>{progress}%</div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', background: '#f1f5f9', borderRadius: '12px', padding: '4px', marginBottom: '20px' }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            flex: 1, padding: '8px', borderRadius: '8px', fontSize: '12px', fontWeight: 600,
            background: activeTab === tab.id ? 'white' : 'transparent',
            color: activeTab === tab.id ? '#0f172a' : '#64748b',
            border: 'none', cursor: 'pointer',
            boxShadow: activeTab === tab.id ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
            transition: 'all 0.15s',
          }}>{tab.label}</button>
        ))}
      </div>

      {/* ── OVERVIEW TAB ── */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {/* Patient Status Card */}
          {['Patient Portal', 'Doctor Portal'].map((portal, pi) => {
            const person = pi === 0 ? demo.demoPatient : demo.demoDoctor;
            const color = pi === 0 ? '#6366f1' : '#14b8a6';
            const portals_phases = {
              0: { name: demo.demoPatient?.name, status: PHASE_LABELS[demo.phase] || 'Idle', actions: demo.timeline.filter(t => t.actor === 'patient').slice(-3) },
              1: { name: demo.demoDoctor?.name, status: PHASE_LABELS[demo.phase] || 'Idle', actions: demo.timeline.filter(t => t.actor === 'doctor').slice(-3) },
            };
            const pd = portals_phases[pi];
            return (
              <div key={pi} style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#64748b', marginBottom: '2px' }}>{portal}</div>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>{pd.name}</div>
                  </div>
                  <PhaseStatusBadge phase={demo.phase} color={color} />
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>Recent Actions</div>
                  {pd.actions.length > 0 ? pd.actions.map((action, i) => (
                    <div key={i} style={{ fontSize: '12px', color: '#334155', padding: '4px 0', borderBottom: i < pd.actions.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                      <span style={{ color: '#94a3b8', marginRight: '8px' }}>{new Date(action.timestamp).toLocaleTimeString()}</span>
                      {action.event}
                    </div>
                  )) : <div style={{ fontSize: '12px', color: '#94a3b8' }}>No actions yet</div>}
                </div>
              </div>
            );
          })}

          {/* Key Metrics */}
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '20px' }}>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '14px' }}>📊 Session Metrics</div>
            {[
              { k: 'Session ID', v: `DEMO-${new Date(demo.demoStartTime || Date.now()).toISOString().slice(0,10).replace(/-/g,'')}` },
              { k: 'Start Time', v: demo.demoStartTime ? new Date(demo.demoStartTime).toLocaleTimeString() : 'Not started' },
              { k: 'Doctor', v: demo.demoDoctor?.name },
              { k: 'Patient', v: demo.demoPatient?.name },
              { k: 'Phase', v: PHASE_LABELS[demo.phase] },
              { k: 'Revenue', v: `₹${(demo.paymentState?.firstHalf || 0) + (demo.paymentState?.secondHalf || 0)}` },
              { k: 'Advance Paid', v: demo.paymentState?.firstHalf ? `₹${demo.paymentState?.firstHalf} ✅` : 'Pending' },
              { k: 'Final Paid', v: demo.paymentState?.secondHalf ? `₹${demo.paymentState?.secondHalf} ✅` : 'Pending' },
            ].map((row, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: i < 7 ? '1px solid #f8fafc' : 'none', fontSize: '12px' }}>
                <span style={{ color: '#64748b' }}>{row.k}</span>
                <span style={{ fontWeight: 600, color: '#0f172a' }}>{row.v}</span>
              </div>
            ))}
          </div>

          {/* Timeline */}
          <TreatmentTimeline currentPhase={demo.phase} timeline={demo.timeline} />
        </div>
      )}

      {/* ── MAP TAB ── */}
      {activeTab === 'map' && (
        <div>
          <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '16px' }}>Bird&apos;s-eye view of all active session locations</p>
          <LiveMap
            doctorLocation={demo.doctorLocation}
            patientLocation={demo.patientLocation}
            route={demo.DOCTOR_ROUTE}
            routeIndex={demo.doctorRouteIndex}
            medicineLocation={demo.medicineLocation}
            medicineRoute={demo.MEDICINE_ROUTE}
            medicineRouteIndex={demo.medicineRouteIndex}
            nearbyDoctors={demo.nearbyDoctors}
            showDoctorMarker={[PHASES.DOCTOR_EN_ROUTE, PHASES.DOCTOR_ARRIVED, PHASES.TREATMENT_IN_PROGRESS].includes(demo.phase)}
            showMedicineMarker={[PHASES.MEDICINE_DISPATCHED, PHASES.MEDICINE_IN_TRANSIT, PHASES.MEDICINE_DELIVERED].includes(demo.phase)}
            height={480}
          />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px', marginTop: '16px' }}>
            {[
              { label: 'Doctor Location', value: demo.doctorLocation ? `${demo.doctorLocation.lat?.toFixed(4)}, ${demo.doctorLocation.lng?.toFixed(4)}` : 'N/A', color: '#14b8a6' },
              { label: 'Patient Location', value: `${demo.patientLocation?.lat?.toFixed(4)}, ${demo.patientLocation?.lng?.toFixed(4)}`, color: '#6366f1' },
              { label: 'Medicine Location', value: demo.medicineLocation ? `${demo.medicineLocation.lat?.toFixed(4)}, ${demo.medicineLocation.lng?.toFixed(4)}` : 'N/A', color: '#f59e0b' },
            ].map((item, i) => (
              <div key={i} style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '14px' }}>
                <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, marginBottom: '4px' }}>{item.label}</div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: item.color, fontFamily: 'monospace' }}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── CONTROLS TAB ── */}
      {activeTab === 'controls' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {/* Emergency Controls */}
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '20px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '14px' }}>🎛️ Session Controls</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {demo.adminOverrides?.blocked ? (
                <button onClick={demo.adminResume} style={{
                  padding: '12px', borderRadius: '12px', fontWeight: 700,
                  background: 'linear-gradient(135deg, #22c55e, #10b981)', color: 'white', border: 'none', cursor: 'pointer',
                }}>▶️ Resume Session</button>
              ) : (
                <button onClick={() => setShowBlockModal(true)} disabled={!isActive} style={{
                  padding: '12px', borderRadius: '12px', fontWeight: 700,
                  background: 'linear-gradient(135deg, #f43f5e, #e11d48)', color: 'white', border: 'none',
                  cursor: isActive ? 'pointer' : 'not-allowed', opacity: isActive ? 1 : 0.5,
                }}>🛑 Emergency Block Session</button>
              )}
              <button onClick={() => !demo.adminOverrides?.paused ? demo.adminPause() : demo.adminResume()} disabled={!isActive} style={{
                padding: '12px', borderRadius: '12px', fontWeight: 700,
                background: '#fffbeb', color: '#92400e', border: '1px solid #fde68a',
                cursor: isActive ? 'pointer' : 'not-allowed', opacity: isActive ? 1 : 0.5,
              }}>{demo.adminOverrides?.paused ? '▶️ Un-pause Location Tracking' : '⏸️ Pause Location Tracking'}</button>
              <button onClick={demo.dispatchMedicine} disabled={demo.phase !== PHASES.PRESCRIPTION_CREATED} style={{
                padding: '12px', borderRadius: '12px', fontWeight: 700,
                background: '#f0f9ff', color: '#1d4ed8', border: '1px solid #bfdbfe',
                cursor: demo.phase === PHASES.PRESCRIPTION_CREATED ? 'pointer' : 'not-allowed',
                opacity: demo.phase === PHASES.PRESCRIPTION_CREATED ? 1 : 0.5,
              }}>✅ Approve & Dispatch Medicine</button>
              <button onClick={demo.resetDemo} style={{
                padding: '12px', borderRadius: '12px', fontWeight: 700,
                background: '#f8fafc', color: '#334155', border: '1px solid #e2e8f0', cursor: 'pointer',
              }}>🔄 Reset Demo</button>
            </div>
          </div>

          {/* Notification Sender */}
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '20px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '14px' }}>📢 Send Notification</h3>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>To</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {['patient', 'doctor', 'both'].map(target => (
                  <button key={target} onClick={() => setNotifTarget(target)} style={{
                    flex: 1, padding: '8px', borderRadius: '8px', fontSize: '12px', fontWeight: 600,
                    background: notifTarget === target ? '#6366f1' : '#f1f5f9',
                    color: notifTarget === target ? 'white' : '#64748b',
                    border: 'none', cursor: 'pointer', textTransform: 'capitalize',
                  }}>{target}</button>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Message</label>
              <textarea
                value={notifMessage}
                onChange={e => setNotifMessage(e.target.value)}
                placeholder="Enter notification message..."
                rows={3}
                style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '2px solid #e2e8f0', fontSize: '13px', color: '#0f172a', outline: 'none', resize: 'none' }}
              />
            </div>
            <button onClick={() => {
              if (notifMessage) {
                if (notifTarget === 'both') {
                  demo.adminSendNotification('patient', notifMessage);
                  demo.adminSendNotification('doctor', notifMessage);
                } else {
                  demo.adminSendNotification(notifTarget, notifMessage);
                }
                setNotifMessage('');
              }
            }} style={{
              width: '100%', padding: '10px', borderRadius: '10px', fontWeight: 700, fontSize: '13px',
              background: 'linear-gradient(135deg, #f43f5e, #e11d48)', color: 'white', border: 'none', cursor: 'pointer',
            }}>📤 Send Message</button>
          </div>
        </div>
      )}

      {/* ── PAYMENTS TAB ── */}
      {activeTab === 'payments' && (
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '20px' }}>💰 Payment Ledger</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '14px', marginBottom: '24px' }}>
            {[
              { label: 'Total Fee', value: `₹${demo.paymentState?.consultationFee || 0}`, color: '#6366f1' },
              { label: 'Received', value: `₹${(demo.paymentState?.firstHalf || 0) + (demo.paymentState?.secondHalf || 0)}`, color: '#22c55e' },
              { label: 'Pending', value: `₹${(demo.paymentState?.consultationFee || 0) - (demo.paymentState?.firstHalf || 0) - (demo.paymentState?.secondHalf || 0)}`, color: '#f59e0b' },
            ].map((item, i) => (
              <div key={i} style={{ padding: '16px', borderRadius: '14px', background: `${item.color}08`, border: `1px solid ${item.color}20`, textAlign: 'center' }}>
                <div style={{ fontSize: '22px', fontWeight: 800, color: item.color }}>{item.value}</div>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>{item.label}</div>
              </div>
            ))}
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                {['Type', 'Amount', 'Transaction ID', 'Time', 'Status'].map(h => (
                  <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 600, color: '#64748b', borderBottom: '2px solid #e2e8f0' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { type: '50% Advance', amt: demo.paymentState?.firstHalf, txn: demo.paymentState?.firstTransactionId, time: demo.paymentState?.firstPaidAt },
                { type: '50% Final', amt: demo.paymentState?.secondHalf, txn: demo.paymentState?.secondTransactionId, time: demo.paymentState?.secondPaidAt },
              ].map((row, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px', fontWeight: 600, color: '#0f172a' }}>{row.type}</td>
                  <td style={{ padding: '12px', fontWeight: 700, color: row.amt ? '#22c55e' : '#94a3b8' }}>{row.amt ? `₹${row.amt}` : '—'}</td>
                  <td style={{ padding: '12px', color: '#64748b', fontFamily: 'monospace', fontSize: '11px' }}>{row.txn || '—'}</td>
                  <td style={{ padding: '12px', color: '#64748b' }}>{row.time ? new Date(row.time).toLocaleTimeString() : '—'}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ padding: '3px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 600, background: row.amt ? '#f0fdf4' : '#f8fafc', color: row.amt ? '#15803d' : '#94a3b8' }}>
                      {row.amt ? '✅ Paid' : '⏳ Pending'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── AUDIT TRAIL TAB ── */}
      {activeTab === 'audit' && (
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>📋 Complete Audit Trail</h3>
            <div style={{ fontSize: '12px', color: '#64748b' }}>{demo.timeline.length} events logged</div>
          </div>
          {demo.timeline.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8', fontSize: '14px' }}>No events yet. Start the demo first.</div>
          ) : (
            <div>
              {[...demo.timeline].reverse().map((entry, i) => {
                const actorColor = entry.actor === 'admin' ? '#f43f5e' : entry.actor === 'doctor' ? '#14b8a6' : entry.actor === 'patient' ? '#6366f1' : '#64748b';
                return (
                  <div key={i} style={{ display: 'flex', gap: '14px', padding: '12px 0', borderBottom: i < demo.timeline.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                    <div style={{ flexShrink: 0, textAlign: 'right', width: '80px' }}>
                      <div style={{ fontSize: '11px', fontWeight: 600, color: '#0f172a' }}>{new Date(entry.timestamp).toLocaleTimeString()}</div>
                      <div style={{ fontSize: '10px', color: '#94a3b8' }}>{new Date(entry.timestamp).toLocaleDateString()}</div>
                    </div>
                    <div style={{ width: '2px', background: '#e2e8f0', flexShrink: 0, borderRadius: '2px', position: 'relative' }}>
                      <div style={{ position: 'absolute', top: '4px', left: '-4px', width: '10px', height: '10px', borderRadius: '50%', background: actorColor }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '13px', color: '#0f172a', marginBottom: '2px' }}>{entry.event}</div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <span style={{ fontSize: '10px', padding: '1px 8px', borderRadius: '4px', background: `${actorColor}15`, color: actorColor, fontWeight: 600 }}>{entry.actor}</span>
                        <span style={{ fontSize: '10px', color: '#94a3b8' }}>{PHASE_LABELS[entry.phase] || entry.phase}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── SUMMARY TAB ── */}
      {activeTab === 'summary' && (
        demo.phase === PHASES.COMPLETED
          ? <TreatmentSummary state={demo} />
          : <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>📊</div>
              <div style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a' }}>Summary available after session completion</div>
              <div style={{ fontSize: '13px', color: '#64748b', marginTop: '8px' }}>Current phase: <strong>{PHASE_LABELS[demo.phase]}</strong></div>
            </div>
      )}

      {/* Block Modal */}
      {showBlockModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
          onClick={() => setShowBlockModal(false)}>
          <div style={{ background: 'white', borderRadius: '20px', padding: '28px', width: '420px', animation: 'scaleIn 0.3s ease-out' }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: '36px', textAlign: 'center', marginBottom: '12px' }}>🛑</div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', textAlign: 'center', marginBottom: '8px' }}>Emergency Block Session</h3>
            <p style={{ fontSize: '13px', color: '#64748b', textAlign: 'center', marginBottom: '16px' }}>This will halt all activity for both patient and doctor.</p>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Reason (required)</label>
              <textarea value={blockReason} onChange={e => setBlockReason(e.target.value)} placeholder="e.g. Suspected fraudulent activity..." rows={3} style={{
                width: '100%', padding: '10px', borderRadius: '10px', border: '2px solid #fecaca',
                fontSize: '13px', outline: 'none', resize: 'none', color: '#0f172a',
              }} />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setShowBlockModal(false)} style={{ flex: 1, padding: '12px', borderRadius: '12px', background: '#f1f5f9', color: '#334155', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
              <button onClick={() => { if (blockReason) { demo.adminBlock(blockReason); setBlockReason(''); setShowBlockModal(false); } }} disabled={!blockReason} style={{
                flex: 1, padding: '12px', borderRadius: '12px', fontWeight: 700,
                background: 'linear-gradient(135deg, #f43f5e, #e11d48)', color: 'white', border: 'none',
                cursor: blockReason ? 'pointer' : 'not-allowed', opacity: blockReason ? 1 : 0.5,
              }}>🛑 Block Now</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
