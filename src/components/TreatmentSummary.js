'use client';
import { useState } from 'react';

export default function TreatmentSummary({ state }) {
  const [rating, setRating] = useState(0);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const { demoDoctor, demoPatient, paymentState, prescription, timeline, treatmentStartTime, treatmentEndTime, medicineOrder, demoStartTime, demoEndTime } = state;


  const totalDuration = treatmentStartTime && treatmentEndTime
    ? Math.ceil((new Date(treatmentEndTime) - new Date(treatmentStartTime)) / 60000)
    : null;

  const sections = [
    {
      label: 'Patient', icon: '👤',
      rows: [
        { k: 'Name', v: demoPatient?.name },
        { k: 'ID', v: demoPatient?.id },
        { k: 'Phone', v: demoPatient?.phone },
        { k: 'Blood Group', v: demoPatient?.bloodGroup },
        { k: 'Address', v: demoPatient?.address },
      ],
    },
    {
      label: 'Doctor', icon: '👨‍⚕️',
      rows: [
        { k: 'Name', v: demoDoctor?.name },
        { k: 'Specialization', v: demoDoctor?.specialization },
        { k: 'Hospital', v: demoDoctor?.hospital },
        { k: 'Rating', v: `⭐ ${demoDoctor?.rating}` },
        { k: 'Verified', v: demoDoctor?.isVerified ? '✅ Yes' : '❌ No' },
      ],
    },
    {
      label: 'Payment', icon: '💰',
      rows: [
        { k: 'Consultation Fee', v: `₹${paymentState?.consultationFee || 0}` },
        { k: 'Advance (50%)', v: `₹${paymentState?.firstHalf || 0}`, color: '#22c55e' },
        { k: 'TXN 1', v: paymentState?.firstTransactionId },
        { k: 'Final (50%)', v: `₹${paymentState?.secondHalf || 0}`, color: '#22c55e' },
        { k: 'TXN 2', v: paymentState?.secondTransactionId },
      ],
    },
  ];

  return (
    <div style={{ maxWidth: '760px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #22c55e, #10b981)',
        borderRadius: '20px', padding: '28px 32px', marginBottom: '20px',
        color: 'white', textAlign: 'center',
      }}>
        <div style={{ fontSize: '48px', marginBottom: '8px' }}>🎉</div>
        <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '4px' }}>Treatment Completed!</h2>
        <p style={{ opacity: 0.9, fontSize: '14px' }}>
          {demoEndTime && new Date(demoEndTime).toLocaleString('en-IN')}
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '16px', flexWrap: 'wrap' }}>
          {[
            { label: 'Total Paid', value: `₹${paymentState?.consultationFee || 0}` },
            { label: 'Duration', value: totalDuration ? `${totalDuration} min` : 'N/A' },
            { label: 'Status', value: '✅ Completed' },
          ].map((item, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '12px', padding: '10px 18px', textAlign: 'center' }}>
              <div style={{ fontSize: '18px', fontWeight: 800 }}>{item.value}</div>
              <div style={{ fontSize: '11px', opacity: 0.85 }}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Info Sections */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px', marginBottom: '16px' }}>
        {sections.map((sec, si) => (
          <div key={si} style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '18px' }}>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '12px' }}>
              {sec.icon} {sec.label}
            </div>
            {sec.rows.map((row, ri) => row.v && (
              <div key={ri} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: ri < sec.rows.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                <span style={{ fontSize: '11px', color: '#64748b' }}>{row.k}</span>
                <span style={{ fontSize: '11px', fontWeight: 600, color: row.color || '#0f172a', maxWidth: '120px', textAlign: 'right' }}>{row.v}</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Prescription */}
      {prescription && (
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '20px', marginBottom: '16px' }}>
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '12px' }}>💊 Prescription</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
            <div style={{ fontSize: '12px', color: '#64748b' }}>Diagnosis: <span style={{ color: '#0f172a', fontWeight: 600 }}>{prescription.diagnosis}</span></div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>Follow-up: <span style={{ color: '#0f172a', fontWeight: 600 }}>{prescription.followUpDate}</span></div>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                {['Medicine', 'Dosage', 'Duration', 'Instructions'].map(h => (
                  <th key={h} style={{ padding: '8px 10px', textAlign: 'left', color: '#64748b', fontWeight: 600, borderBottom: '1px solid #e2e8f0' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(prescription.medicines || []).map((med, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '8px 10px', fontWeight: 600, color: '#0f172a' }}>{med.name}</td>
                  <td style={{ padding: '8px 10px', color: '#334155' }}>{med.dosage}</td>
                  <td style={{ padding: '8px 10px', color: '#334155' }}>{med.duration}</td>
                  <td style={{ padding: '8px 10px', color: '#64748b' }}>{med.instructions}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {prescription.notes && (
            <div style={{ marginTop: '12px', padding: '10px', background: '#fffbeb', borderRadius: '8px', fontSize: '12px', color: '#92400e' }}>
              📝 Doctor&apos;s Notes: {prescription.notes}
            </div>
          )}
        </div>
      )}

      {/* Timeline */}
      {timeline.length > 0 && (
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '20px', marginBottom: '16px' }}>
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '12px' }}>📋 Audit Trail</div>
          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {timeline.map((entry, i) => (
              <div key={i} style={{ display: 'flex', gap: '10px', padding: '6px 0', borderBottom: i < timeline.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                <span style={{ fontSize: '10px', color: '#94a3b8', flexShrink: 0, paddingTop: '2px' }}>
                  {new Date(entry.timestamp).toLocaleTimeString()}
                </span>
                <span style={{ fontSize: '12px', color: '#334155', flex: 1 }}>{entry.event}</span>
                <span style={{
                  fontSize: '10px', padding: '1px 6px', borderRadius: '4px',
                  background: entry.actor === 'admin' ? '#fef2f2' : entry.actor === 'doctor' ? '#f0fdf4' : '#eef2ff',
                  color: entry.actor === 'admin' ? '#dc2626' : entry.actor === 'doctor' ? '#15803d' : '#4338ca',
                  fontWeight: 600, flexShrink: 0,
                }}>{entry.actor}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rating */}
      <div style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: '16px', padding: '20px', color: 'white', textAlign: 'center' }}>
        {feedbackSubmitted ? (
          <div style={{ animation: 'bounceIn 0.5s ease-out' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>❤️</div>
            <div style={{ fontSize: '18px', fontWeight: 700 }}>Thank you for your feedback!</div>
            <div style={{ fontSize: '13px', opacity: 0.9, marginTop: '4px' }}>Your review helps us improve.</div>
          </div>
        ) : (
          <>
            <div style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px' }}>Rate your experience</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '12px' }}>
              {[1,2,3,4,5].map(star => (
                <span key={star} 
                  onClick={() => setRating(star)}
                  style={{ 
                    fontSize: '28px', cursor: 'pointer', 
                    filter: rating >= star ? 'grayscale(0%)' : 'grayscale(100%)',
                    transition: 'all 0.2s'
                  }}>⭐</span>
              ))}
            </div>
            <textarea placeholder="Share your feedback (optional)..." style={{
              width: '100%', minHeight: '60px', borderRadius: '10px', padding: '10px',
              border: 'none', background: 'rgba(255,255,255,0.15)', color: 'white',
              fontSize: '13px', resize: 'none', outline: 'none',
            }} />
            <button onClick={() => setFeedbackSubmitted(true)} style={{
              marginTop: '10px', padding: '10px 24px', borderRadius: '10px',
              background: 'white', color: '#6366f1', fontWeight: 700, border: 'none', cursor: 'pointer',
            }}>Submit Feedback</button>
          </>
        )}
      </div>
    </div>
  );
}
