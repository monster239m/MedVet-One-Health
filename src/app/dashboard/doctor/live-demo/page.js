'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useLiveDemo, PHASES } from '@/context/LiveDemoContext';
import LiveMap from '@/components/LiveMap';
import OTPVerification from '@/components/OTPVerification';
import TreatmentTimeline from '@/components/TreatmentTimeline';
import TreatmentSummary from '@/components/TreatmentSummary';
import NotificationToast from '@/components/NotificationToast';

const sidebarItems = [
  { label: 'Main', items: [
    { icon: '📊', label: 'Dashboard', href: '/dashboard/doctor' },
    { icon: '🎯', label: 'Live Demo', href: '/dashboard/doctor/live-demo' },
    { icon: '📅', label: 'Appointments', href: '/dashboard/doctor/appointments' },
    { icon: '👥', label: 'My Patients', href: '/dashboard/doctor/patients' },
  ]},
  { label: 'Practice', items: [
    { icon: '📋', label: 'Queue', href: '/dashboard/doctor/queue' },
    { icon: '💊', label: 'Prescriptions', href: '/dashboard/doctor/prescriptions' },
    { icon: '📊', label: 'Analytics', href: '/dashboard/doctor/analytics' },
  ]},
  { label: 'Account', items: [
    { icon: '💰', label: 'Earnings', href: '/dashboard/doctor/earnings' },
    { icon: '⭐', label: 'Reviews', href: '/dashboard/doctor/reviews' },
    { icon: '⚙️', label: 'Settings', href: '/dashboard/doctor/settings' },
  ]},
];

const AVAILABLE_MEDICINES = [
  { name: 'Paracetamol 500mg', category: 'Pain Relief' },
  { name: 'Amoxicillin 500mg', category: 'Antibiotic' },
  { name: 'Cetirizine 10mg', category: 'Allergy' },
  { name: 'Metformin 500mg', category: 'Diabetes' },
  { name: 'Omeprazole 20mg', category: 'Gastric' },
  { name: 'Vitamin D3 60K', category: 'Supplement' },
];

function PrescriptionForm({ onSubmit }) {
  const [diagnosis, setDiagnosis] = useState('Diabetes Type 2 - Routine Check-up');
  const [medicines, setMedicines] = useState([
    { name: 'Metformin 500mg', dosage: '1-0-1', duration: '30 days', instructions: 'After meals' },
    { name: 'Vitamin D3 60K', dosage: '0-0-1', duration: '30 days', instructions: 'After dinner' },
  ]);
  const [notes, setNotes] = useState('Blood sugar levels stable. Continue current medication. Follow low-sugar diet and exercise regularly.');
  const [followUpDate, setFollowUpDate] = useState(() => {
    const d = new Date(); d.setDate(d.getDate() + 30);
    return d.toISOString().slice(0, 10);
  });
  
  // Voice Dictation State
  const [isRecording, setIsRecording] = useState(false);
  const [recognitionInfo, setRecognitionInfo] = useState('');

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      setRecognitionInfo('Recording stopped.');
      setTimeout(() => setRecognitionInfo(''), 2000);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support the Web Speech API for voice dictation. Please use Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsRecording(true);
      setRecognitionInfo('Listening... Speak now.');
    };

    recognition.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript + ' ';
        }
      }
      if (finalTranscript) {
        setNotes(prev => (prev + ' ' + finalTranscript).trim());
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      setIsRecording(false);
      setRecognitionInfo('Microphone error or permission denied.');
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    try {
      recognition.start();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
      <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>✍️ Write Prescription</h3>
      <div style={{ marginBottom: '14px' }}>
        <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Diagnosis</label>
        <input value={diagnosis} onChange={e => setDiagnosis(e.target.value)} style={{
          width: '100%', padding: '10px 12px', borderRadius: '10px',
          border: '2px solid #e2e8f0', fontSize: '14px', color: '#0f172a', outline: 'none',
        }} />
      </div>
      <div style={{ marginBottom: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>Medicines</label>
          <button onClick={() => setMedicines([...medicines, { name: '', dosage: '', duration: '', instructions: '' }])} style={{
            fontSize: '12px', color: '#6366f1', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer',
          }}>+ Add</button>
        </div>
        {medicines.map((med, i) => (
          <div key={i} style={{ background: '#f8fafc', borderRadius: '10px', padding: '12px', marginBottom: '8px', border: '1px solid #f1f5f9' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '8px', marginBottom: '8px' }}>
              <select value={med.name} onChange={e => {
                const m = [...medicines]; m[i].name = e.target.value; setMedicines(m);
              }} style={{ padding: '8px 10px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px', background: 'white', color: '#0f172a' }}>
                <option value="">Select Medicine</option>
                {AVAILABLE_MEDICINES.map(m => <option key={m.name} value={m.name}>{m.name}</option>)}
              </select>
              <button onClick={() => setMedicines(medicines.filter((_, idx) => idx !== i))} style={{
                padding: '8px 12px', borderRadius: '8px', background: '#fef2f2', color: '#dc2626',
                border: '1px solid #fecaca', cursor: 'pointer', fontSize: '13px',
              }}>✕</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
              {[{ k: 'dosage', p: 'Dosage (e.g. 1-0-1)' }, { k: 'duration', p: 'Duration (e.g. 7 days)' }, { k: 'instructions', p: 'Instructions' }].map(f => (
                <input key={f.k} value={med[f.k]} placeholder={f.p} onChange={e => {
                  const m = [...medicines]; m[i][f.k] = e.target.value; setMedicines(m);
                }} style={{ padding: '8px 10px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px', color: '#0f172a', outline: 'none' }} />
              ))}
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginBottom: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>Doctor&apos;s Notes</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {recognitionInfo && <span style={{ fontSize: '11px', color: '#ef4444', animation: 'fadeIn 0.5s' }}>{recognitionInfo}</span>}
            <button 
              onClick={toggleRecording}
              style={{
                background: isRecording ? '#fee2e2' : '#f1f5f9',
                color: isRecording ? '#dc2626' : '#64748b',
                border: 'none', borderRadius: '8px', padding: '4px 8px',
                fontSize: '11px', fontWeight: 600, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '4px',
                transition: 'all 0.2s', boxShadow: isRecording ? '0 0 10px rgba(220, 38, 38, 0.2)' : 'none'
              }}
            >
              {isRecording ? <><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#dc2626', animation: 'pulse 1s infinite' }}/> Stop Recording</> : '🎤 Start Dictation'}
            </button>
          </div>
        </div>
        <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} style={{
          width: '100%', padding: '10px 12px', borderRadius: '10px',
          border: isRecording ? '2px solid #ef4444' : '2px solid #e2e8f0', 
          fontSize: '13px', color: '#0f172a', outline: 'none', resize: 'vertical',
          transition: 'border 0.3s'
        }} />
      </div>
      <div style={{ marginBottom: '16px' }}>
        <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Follow-up Date</label>
        <input type="date" value={followUpDate} onChange={e => setFollowUpDate(e.target.value)} style={{
          padding: '8px 12px', borderRadius: '10px', border: '2px solid #e2e8f0', fontSize: '14px', color: '#0f172a', outline: 'none',
        }} />
      </div>
      <button onClick={() => onSubmit({ diagnosis, medicines, notes, followUpDate })} style={{
        width: '100%', padding: '12px', borderRadius: '12px', fontWeight: 700, fontSize: '14px',
        background: 'linear-gradient(135deg, #14b8a6, #06b6d4)', color: 'white',
        border: 'none', cursor: 'pointer', boxShadow: '0 4px 15px rgba(20,184,166,0.3)',
      }}>
        💊 Save Prescription & Request OTP
      </button>
    </div>
  );
}

export default function DoctorLiveDemoPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const demo = useLiveDemo();
  const [treatmentNotes, setTreatmentNotes] = useState('');
  const [dismissedNotifs, setDismissedNotifs] = useState(new Set());
  const [treatmentTimer, setTreatmentTimer] = useState(0);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'doctor')) router.push('/login');
  }, [user, loading, router]);

  useEffect(() => {
    if (demo.phase === PHASES.TREATMENT_IN_PROGRESS) {
      const interval = setInterval(() => setTreatmentTimer(t => t + 1), 1000);
      return () => clearInterval(interval);
    }
  }, [demo.phase]);

  const formatTimer = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  const handleDismissNotif = (id) => setDismissedNotifs(prev => new Set([...prev, id]));
  const visibleNotifs = (demo.notifications.doctor || []).filter(n => !dismissedNotifs.has(n.id));

  if (loading || !user) return null;
  const progress = demo.getProgress ? demo.getProgress() : 0;

  // ── IDLE / SEARCHING / PAYMENT (not yet notified) ───
  if ([PHASES.IDLE, PHASES.SEARCHING, PHASES.DOCTOR_SELECTED, PHASES.PAYMENT_INITIATED].includes(demo.phase)) {
    return (
      <DashboardLayout sidebarItems={sidebarItems}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>🎯 Doctor Live Demo</h1>
        <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '24px' }}>Waiting for a patient request...</p>
        <div style={{ textAlign: 'center', padding: '80px 0', background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px', animation: 'pulse 2s ease-in-out infinite' }}>⏳</div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>Awaiting Patient Request</h2>
          <p style={{ fontSize: '14px', color: '#64748b', maxWidth: '400px', margin: '0 auto' }}>
            A notification will appear here when a patient sends a home visit request and makes the advance payment.
          </p>
          <div style={{ marginTop: '24px', padding: '12px 24px', borderRadius: '12px', background: '#f0fdf4', border: '1px solid #bbf7d0', display: 'inline-block', fontSize: '13px', color: '#15803d', fontWeight: 500 }}>
            ✅ Status: Online & Available
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // ── DOCTOR NOTIFIED — Incoming Request ─────────────
  if (demo.phase === PHASES.DOCTOR_NOTIFIED || demo.phase === PHASES.PAYMENT_50_COMPLETE) {
    const fee = demo.demoDoctor?.consultationFee || 800;
    return (
      <DashboardLayout sidebarItems={sidebarItems}>
        <NotificationToast notifications={visibleNotifs} onDismiss={handleDismissNotif} />
        <div style={{ animation: 'scaleIn 0.4s ease-out' }}>
          <div style={{
            background: 'linear-gradient(135deg, #f43f5e, #e11d48)', borderRadius: '20px',
            padding: '24px', color: 'white', marginBottom: '20px',
            boxShadow: '0 8px 30px rgba(244,63,94,0.3)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ fontSize: '32px', animation: 'pulse 1s ease-in-out infinite' }}>🔔</div>
              <div>
                <div style={{ fontSize: '20px', fontWeight: 800 }}>New Home Visit Request!</div>
                <div style={{ fontSize: '13px', opacity: 0.9 }}>Patient has paid 50% advance • Just now</div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '20px' }}>
              {[
                { k: 'Patient', v: demo.demoPatient?.name },
                { k: 'Distance', v: '3.2 km away' },
                { k: 'Advance Paid', v: `₹${fee / 2}` },
                { k: 'Reason', v: 'Diabetes Check-up' },
                { k: 'ETA', v: '~12 min drive' },
                { k: 'Total Fee', v: `₹${fee}` },
              ].map((item, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '10px', padding: '10px 12px' }}>
                  <div style={{ fontSize: '10px', opacity: 0.8, marginBottom: '2px' }}>{item.k}</div>
                  <div style={{ fontSize: '14px', fontWeight: 700 }}>{item.v}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={demo.doctorAccept} style={{
                flex: 1, padding: '14px', borderRadius: '14px', fontWeight: 800, fontSize: '15px',
                background: 'white', color: '#16a34a', border: 'none', cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
              }}>✅ Accept Request</button>
              <button onClick={demo.doctorDecline} style={{
                flex: 1, padding: '14px', borderRadius: '14px', fontWeight: 700, fontSize: '15px',
                background: 'rgba(0,0,0,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.3)',
                cursor: 'pointer',
              }}>❌ Decline</button>
            </div>
          </div>
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '20px', fontSize: '14px', color: '#334155' }}>
            <div style={{ fontWeight: 700, marginBottom: '8px', color: '#0f172a' }}>📋 Patient Medical History</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div>• Diabetes Type 2</div><div>• Mild Hypertension</div>
              <div>• Allergy: Penicillin</div><div>• Blood Group: O+</div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // ── EN ROUTE ─────────────────────────────────────
  if ([PHASES.DOCTOR_ACCEPTED, PHASES.DOCTOR_EN_ROUTE].includes(demo.phase)) {
    return (
      <DashboardLayout sidebarItems={sidebarItems}>
        <NotificationToast notifications={visibleNotifs} onDismiss={handleDismissNotif} />
        <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>🚗 Navigate to Patient</h2>
        <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '16px' }}>
          Heading to {demo.demoPatient?.address} • ETA: {demo.getDoctorETA ? demo.getDoctorETA() : '...'}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '20px' }}>
          <div>
            <LiveMap
              doctorLocation={demo.doctorLocation}
              patientLocation={demo.patientLocation}
              route={demo.DOCTOR_ROUTE}
              routeIndex={demo.doctorRouteIndex}
              showDoctorMarker
              height={340}
              style={{ marginBottom: '16px' }}
            />
            <div style={{ background: 'linear-gradient(135deg, #14b8a6, #06b6d4)', borderRadius: '14px', padding: '16px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '13px', opacity: 0.9 }}>Distance Remaining</div>
                <div style={{ fontSize: '22px', fontWeight: 800 }}>
                  {((demo.DOCTOR_ROUTE.length - demo.doctorRouteIndex - 1) * 0.28).toFixed(1)} km
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '13px', opacity: 0.9 }}>ETA</div>
                <div style={{ fontSize: '22px', fontWeight: 800 }}>{demo.getDoctorETA ? demo.getDoctorETA() : '...'}</div>
              </div>
              <button onClick={demo.startTreatment} style={{
                padding: '10px 18px', borderRadius: '10px', background: 'white', color: '#0d9488',
                fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: '13px',
              }}>📍 I&apos;ve Arrived</button>
            </div>
          </div>
          <TreatmentTimeline currentPhase={demo.phase} timeline={demo.timeline} />
        </div>
      </DashboardLayout>
    );
  }

  // ── ARRIVED ───────────────────────────────────────
  if (demo.phase === PHASES.DOCTOR_ARRIVED) {
    return (
      <DashboardLayout sidebarItems={sidebarItems}>
        <NotificationToast notifications={visibleNotifs} onDismiss={handleDismissNotif} />
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', padding: '40px 0' }}>
          <div style={{ fontSize: '72px', marginBottom: '16px', animation: 'scaleIn 0.5s ease-out' }}>📍</div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>You&apos;ve Arrived!</h2>
          <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '24px' }}>At {demo.demoPatient?.name}&apos;s location</p>
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '20px', marginBottom: '20px', textAlign: 'left' }}>
            {[
              { k: 'Patient', v: demo.demoPatient?.name },
              { k: 'Address', v: demo.demoPatient?.address },
              { k: 'Phone', v: demo.demoPatient?.phone },
              { k: 'Reason', v: 'Diabetes Check-up' },
              { k: 'Medical History', v: 'Diabetes Type 2, Hypertension' },
              { k: 'Allergies', v: 'Penicillin' },
            ].map((row, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: i < 5 ? '1px solid #f1f5f9' : 'none', fontSize: '13px' }}>
                <span style={{ color: '#64748b' }}>{row.k}</span>
                <span style={{ fontWeight: 600, color: '#0f172a' }}>{row.v}</span>
              </div>
            ))}
          </div>
          <button onClick={demo.startTreatment} style={{
            width: '100%', padding: '14px', borderRadius: '14px', fontWeight: 700, fontSize: '15px',
            background: 'linear-gradient(135deg, #8b5cf6, #6366f1)', color: 'white',
            border: 'none', cursor: 'pointer', boxShadow: '0 4px 15px rgba(99,102,241,0.3)',
          }}>🩺 Begin Treatment</button>
        </div>
      </DashboardLayout>
    );
  }

  // ── TREATMENT IN PROGRESS ─────────────────────────
  if (demo.phase === PHASES.TREATMENT_IN_PROGRESS) {
    return (
      <DashboardLayout sidebarItems={sidebarItems}>
        <NotificationToast notifications={visibleNotifs} onDismiss={handleDismissNotif} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a' }}>🩺 Treatment in Progress</h2>
                <p style={{ fontSize: '14px', color: '#64748b' }}>Patient: {demo.demoPatient?.name}</p>
              </div>
              <div style={{ background: 'linear-gradient(135deg, #8b5cf6, #6366f1)', borderRadius: '14px', padding: '12px 20px', color: 'white', textAlign: 'center' }}>
                <div style={{ fontSize: '10px', opacity: 0.9 }}>Duration</div>
                <div style={{ fontSize: '24px', fontWeight: 800, fontFamily: 'monospace' }}>{formatTimer(treatmentTimer)}</div>
              </div>
            </div>
            <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '20px', marginBottom: '16px' }}>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a', marginBottom: '10px' }}>📝 Treatment Notes</div>
              <textarea
                value={treatmentNotes}
                onChange={e => setTreatmentNotes(e.target.value)}
                placeholder="Enter examination findings, symptoms, vitals, notes..."
                rows={5}
                style={{
                  width: '100%', padding: '12px', borderRadius: '10px',
                  border: '2px solid #e2e8f0', fontSize: '13px', color: '#0f172a',
                  outline: 'none', resize: 'vertical', lineHeight: 1.6,
                }}
              />
            </div>
            <PrescriptionForm onSubmit={(rx) => { demo.createPrescription(rx); demo.requestCompletion(treatmentNotes); }} />
          </div>
          <TreatmentTimeline currentPhase={demo.phase} timeline={demo.timeline} />
        </div>
      </DashboardLayout>
    );
  }

  // ── OTP Verification ──────────────────────────────
  if ([PHASES.COMPLETION_REQUESTED, PHASES.OTP_GENERATED].includes(demo.phase)) {
    return (
      <DashboardLayout sidebarItems={sidebarItems}>
        <NotificationToast notifications={visibleNotifs} onDismiss={handleDismissNotif} />
        <div style={{ maxWidth: '560px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>🔐 Verify Treatment Completion</h2>
          <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '24px' }}>Ask the patient for their 6-digit OTP to confirm treatment</p>
          <OTPVerification
            mode="input"
            otp={demo.otp}
            otpExpiry={demo.otpExpiry}
            onVerify={(code) => demo.verifyOTP(code)}
            onResend={() => demo.requestCompletion(treatmentNotes)}
          />
        </div>
      </DashboardLayout>
    );
  }

  // ── POST OTP — Awaiting Payment ──────────────────
  if ([PHASES.OTP_VERIFIED, PHASES.FINAL_PAYMENT, PHASES.PRESCRIPTION_CREATED, PHASES.MEDICINE_DISPATCHED, PHASES.MEDICINE_IN_TRANSIT, PHASES.MEDICINE_DELIVERED].includes(demo.phase)) {
    return (
      <DashboardLayout sidebarItems={sidebarItems}>
        <NotificationToast notifications={visibleNotifs} onDismiss={handleDismissNotif} />
        <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>
          {demo.phase === PHASES.OTP_VERIFIED ? '✅ OTP Verified — Awaiting Payment' :
           demo.phase === PHASES.PRESCRIPTION_CREATED ? '💊 Prescription Sent' : '📦 Medicines Dispatched'}
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '20px' }}>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '12px' }}>💰 Payment Status</div>
            {[
              { k: 'Advance (50%)', v: `₹${demo.paymentState?.firstHalf || 0}`, color: '#22c55e', done: true },
              { k: 'Final (50%)', v: `₹${demo.paymentState?.secondHalf || 0}`, color: demo.paymentState?.secondHalf ? '#22c55e' : '#f59e0b', done: !!demo.paymentState?.secondHalf },
              { k: 'Total Revenue', v: `₹${(demo.paymentState?.firstHalf || 0) + (demo.paymentState?.secondHalf || 0)}`, color: '#6366f1', done: true },
            ].map((row, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < 2 ? '1px solid #f1f5f9' : 'none', fontSize: '13px' }}>
                <span style={{ color: '#64748b' }}>{row.k} {row.done ? '✅' : '⏳'}</span>
                <span style={{ fontWeight: 700, color: row.color }}>{row.v}</span>
              </div>
            ))}
          </div>
          <TreatmentTimeline currentPhase={demo.phase} timeline={demo.timeline} />
        </div>
      </DashboardLayout>
    );
  }

  // ── COMPLETED ─────────────────────────────────────
  if (demo.phase === PHASES.COMPLETED) {
    return (
      <DashboardLayout sidebarItems={sidebarItems}>
        <TreatmentSummary state={demo} />
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button onClick={demo.resetDemo} style={{
            padding: '12px 28px', borderRadius: '14px', fontWeight: 700,
            background: '#f1f5f9', color: '#334155', border: '1px solid #e2e8f0', cursor: 'pointer',
          }}>🔄 Restart Demo</button>
        </div>
      </DashboardLayout>
    );
  }

  return null;
}
