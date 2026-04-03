'use client';
import { PHASE_LABELS, PHASE_ORDER } from '@/context/LiveDemoContext';

const PHASE_ICONS = {
  IDLE: '⏸️', SEARCHING: '🔍', DOCTOR_SELECTED: '👨‍⚕️', PAYMENT_INITIATED: '💳',
  PAYMENT_50_COMPLETE: '✅', DOCTOR_NOTIFIED: '🔔', DOCTOR_ACCEPTED: '🤝',
  DOCTOR_EN_ROUTE: '🚗', DOCTOR_ARRIVED: '📍', TREATMENT_IN_PROGRESS: '🩺',
  COMPLETION_REQUESTED: '📋', OTP_GENERATED: '🔑', OTP_VERIFIED: '✅',
  FINAL_PAYMENT: '💰', PRESCRIPTION_CREATED: '💊', MEDICINE_DISPATCHED: '📦',
  MEDICINE_IN_TRANSIT: '🚚', MEDICINE_DELIVERED: '📬', COMPLETED: '🎉',
};

const PHASE_COLORS = {
  IDLE: '#94a3b8', SEARCHING: '#6366f1', DOCTOR_SELECTED: '#6366f1',
  PAYMENT_INITIATED: '#f59e0b', PAYMENT_50_COMPLETE: '#22c55e',
  DOCTOR_NOTIFIED: '#f59e0b', DOCTOR_ACCEPTED: '#22c55e',
  DOCTOR_EN_ROUTE: '#14b8a6', DOCTOR_ARRIVED: '#14b8a6',
  TREATMENT_IN_PROGRESS: '#8b5cf6', COMPLETION_REQUESTED: '#f59e0b',
  OTP_GENERATED: '#6366f1', OTP_VERIFIED: '#22c55e',
  FINAL_PAYMENT: '#f59e0b', PRESCRIPTION_CREATED: '#14b8a6',
  MEDICINE_DISPATCHED: '#f97316', MEDICINE_IN_TRANSIT: '#f97316',
  MEDICINE_DELIVERED: '#22c55e', COMPLETED: '#22c55e',
};

export default function TreatmentTimeline({ currentPhase, timeline = [], compact = false }) {
  const currentIndex = PHASE_ORDER.indexOf(currentPhase);

  if (compact) {
    return (
      <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
        {PHASE_ORDER.map((phase, i) => (
          <div key={phase} style={{
            flex: 1, height: '4px', borderRadius: '2px',
            background: i <= currentIndex ? (PHASE_COLORS[phase] || '#6366f1') : '#e2e8f0',
            transition: 'background 0.5s ease',
          }} title={PHASE_LABELS[phase]} />
        ))}
      </div>
    );
  }

  return (
    <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '20px' }}>
      <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>📊 Treatment Timeline</h3>
      <div style={{ position: 'relative' }}>
        {PHASE_ORDER.map((phase, i) => {
          const isDone = i < currentIndex;
          const isActive = i === currentIndex;
          const isPending = i > currentIndex;
          const color = PHASE_COLORS[phase] || '#6366f1';
          const timelineEntry = timeline.find(t => t.phase === phase);

          return (
            <div key={phase} style={{
              display: 'flex', gap: '12px', paddingBottom: i < PHASE_ORDER.length - 1 ? '8px' : 0,
              opacity: isPending ? 0.4 : 1, transition: 'opacity 0.3s',
            }}>
              {i < PHASE_ORDER.length - 1 && (
                <div style={{
                  position: 'absolute', left: '11px', top: `${i * 36 + 28}px`,
                  width: '2px', height: '16px',
                  background: isDone ? color : '#e2e8f0',
                }} />
              )}
              <div style={{
                width: '24px', height: '24px', borderRadius: '50%', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: isDone ? color : isActive ? 'white' : '#f1f5f9',
                border: isActive ? `2px solid ${color}` : isDone ? 'none' : '1px solid #e2e8f0',
                fontSize: '11px', position: 'relative', zIndex: 1,
                boxShadow: isActive ? `0 0 0 3px ${color}20` : 'none',
              }}>
                {isDone ? <span style={{ color: 'white', fontSize: '10px' }}>✓</span> : <span>{PHASE_ICONS[phase]}</span>}
              </div>
              <div style={{ flex: 1, paddingTop: '2px' }}>
                <div style={{ fontSize: '12px', fontWeight: isActive ? 700 : 500, color: isPending ? '#94a3b8' : '#0f172a' }}>
                  {PHASE_LABELS[phase]}
                </div>
                {timelineEntry && (
                  <div style={{ fontSize: '10px', color: '#94a3b8' }}>
                    {new Date(timelineEntry.timestamp).toLocaleTimeString()}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
