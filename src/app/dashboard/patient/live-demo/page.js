'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useLiveDemo, PHASES } from '@/context/LiveDemoContext';
import LiveMap from '@/components/LiveMap';
import PaymentModal from '@/components/PaymentModal';
import OTPVerification from '@/components/OTPVerification';
import LiveTracker from '@/components/LiveTracker';
import TreatmentTimeline from '@/components/TreatmentTimeline';
import TreatmentSummary from '@/components/TreatmentSummary';
import NotificationToast from '@/components/NotificationToast';
import TelemedicineRoom from '@/components/TelemedicineRoom';

const sidebarItems = [
  { label: 'Main', items: [
    { icon: '📊', label: 'Dashboard', href: '/dashboard/patient' },
    { icon: '🎯', label: 'Live Demo', href: '/dashboard/patient/live-demo' },
    { icon: '📅', label: 'Appointments', href: '/dashboard/patient/appointments' },
    { icon: '🔍', label: 'Find Doctors', href: '/dashboard/patient/doctors' },
  ]},
  { label: 'Health', items: [
    { icon: '💊', label: 'Prescriptions', href: '/dashboard/patient/prescriptions' },
    { icon: '🛒', label: 'Medicines', href: '/dashboard/patient/medicines' },
    { icon: '📋', label: 'Health Records', href: '/dashboard/patient/records' },
    { icon: '🐾', label: 'My Pets', href: '/dashboard/patient/pets' },
  ]},
  { label: 'Services', items: [
    { icon: '📦', label: 'Orders', href: '/dashboard/patient/orders' },
    { icon: '💬', label: 'Messages', href: '/dashboard/patient/messages' },
    { icon: '⚙️', label: 'Settings', href: '/dashboard/patient/settings' },
  ]},
];

function PhaseHeader({ phase, progress }) {
  return (
    <div style={{ marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
        <div style={{
          padding: '4px 12px', borderRadius: '999px', fontSize: '12px',
          fontWeight: 700, background: 'rgba(239,68,68,0.1)', color: '#ef4444',
          display: 'flex', alignItems: 'center', gap: '6px',
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ef4444', animation: 'pulse 1.5s infinite', display: 'inline-block' }} />
          LIVE DEMO
        </div>
        <div style={{ fontSize: '13px', color: '#64748b' }}>Patient Portal</div>
      </div>
      <TreatmentTimeline currentPhase={phase} compact />
      <div style={{ marginTop: '6px', fontSize: '12px', color: '#64748b', textAlign: 'right' }}>{progress}% complete</div>
    </div>
  );
}

export default function PatientLiveDemoPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const demo = useLiveDemo();
  const [showPayment, setShowPayment] = useState(false);
  const [showFinalPayment, setShowFinalPayment] = useState(false);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [treatmentTimer, setTreatmentTimer] = useState(0);
  const [dismissedNotifs, setDismissedNotifs] = useState(new Set());

  useEffect(() => {
    if (!loading && (!user || user.role !== 'patient')) router.push('/login');
  }, [user, loading, router]);

  // Treatment timer
  useEffect(() => {
    if (demo.phase === PHASES.TREATMENT_IN_PROGRESS) {
      const interval = setInterval(() => setTreatmentTimer(t => t + 1), 1000);
      return () => clearInterval(interval);
    }
  }, [demo.phase]);

  const formatTimer = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  const handleDismissNotif = (id) => {
    setDismissedNotifs(prev => new Set([...prev, id]));
  };

  const visibleNotifs = (demo.notifications.patient || []).filter(n => !dismissedNotifs.has(n.id));
  const progress = demo.getProgress ? demo.getProgress() : 0;

  if (loading || !user) return null;

  const doctorTrackerSteps = [
    { icon: '✅', label: 'Request Accepted', time: demo.phase >= 2 ? 'Done' : '' },
    { icon: '🚗', label: 'Doctor En Route', sublabel: `ETA: ${demo.getDoctorETA ? demo.getDoctorETA() : '...'}`, detail: 'Doctor is on the way to your location' },
    { icon: '📍', label: 'Doctor Arrived', time: '' },
    { icon: '🩺', label: 'Treatment in Progress', time: '' },
  ];
  const doctorTrackerStep = [PHASES.DOCTOR_ACCEPTED, PHASES.DOCTOR_EN_ROUTE, PHASES.DOCTOR_ARRIVED, PHASES.TREATMENT_IN_PROGRESS].indexOf(demo.phase);

  const medicineTrackerSteps = [
    { icon: '💊', label: 'Prescription Verified', time: 'Done' },
    { icon: '📦', label: 'Packed & Dispatched', sublabel: 'From MedVet Pharmacy Hub' },
    { icon: '🚚', label: 'Out for Delivery', sublabel: `ETA: ${demo.getMedicineETA ? demo.getMedicineETA() : '...'}`, detail: 'Delivery partner is on the way' },
    { icon: '📬', label: 'Delivered', time: '' },
  ];
  const medicineTrackerStep = [PHASES.MEDICINE_DISPATCHED, PHASES.MEDICINE_DISPATCHED, PHASES.MEDICINE_IN_TRANSIT, PHASES.MEDICINE_DELIVERED].indexOf(demo.phase);

  // ─── PHASE: IDLE ───────────────────────────────────
  if (demo.phase === PHASES.IDLE) {
    return (
      <DashboardLayout sidebarItems={sidebarItems}>
        <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center', padding: '60px 0' }}>
          <div style={{
            width: '100px', height: '100px', borderRadius: '28px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '48px', margin: '0 auto 24px',
            boxShadow: '0 20px 50px rgba(99,102,241,0.3)',
            animation: 'float 3s ease-in-out infinite',
          }}>🎯</div>
          <h1 style={{ fontSize: '32px', fontWeight: 900, color: '#0f172a', marginBottom: '12px' }}>
            MedVet Live Demo
          </h1>
          <p style={{ fontSize: '16px', color: '#64748b', marginBottom: '32px', lineHeight: 1.6, maxWidth: '500px', margin: '0 auto 32px' }}>
            Experience the complete healthcare journey — from finding a doctor to medicine delivery — in a fully interactive live demo.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px', marginBottom: '32px', textAlign: 'left' }}>
            {[
              { icon: '🗺️', label: 'Find Nearby Doctors', desc: 'Map view with real-time availability' },
              { icon: '💳', label: 'Split Payment', desc: '50% now, 50% after treatment' },
              { icon: '🚗', label: 'Live Tracking', desc: 'Track doctor en route' },
              { icon: '🔑', label: 'OTP Verification', desc: 'Secure treatment confirmation' },
              { icon: '💊', label: 'Prescription', desc: 'Digital Rx + medicine delivery' },
              { icon: '📊', label: 'Full Summary', desc: 'Complete treatment report' },
            ].map((feat, i) => (
              <div key={i} style={{ padding: '16px', borderRadius: '14px', background: 'white', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>{feat.icon}</div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>{feat.label}</div>
                <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>{feat.desc}</div>
              </div>
            ))}
          </div>
          <button onClick={demo.startDemo} style={{
            padding: '16px 40px', borderRadius: '16px', fontSize: '16px', fontWeight: 700,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white',
            border: 'none', cursor: 'pointer', boxShadow: '0 8px 25px rgba(99,102,241,0.4)',
            transition: 'all 0.2s',
          }}
            onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            🚀 Start Live Demo
          </button>
          <div style={{ marginTop: '12px', fontSize: '12px', color: '#94a3b8' }}>
            Pre-configured with Dr. Arun Mehta & patient Rahul Sharma
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // ─── PHASE: SEARCHING ─────────────────────────────
  if (demo.phase === PHASES.SEARCHING || demo.phase === PHASES.DOCTOR_SELECTED) {
    return (
      <DashboardLayout sidebarItems={sidebarItems}>
        <NotificationToast notifications={visibleNotifs} onDismiss={handleDismissNotif} />
        <PhaseHeader phase={demo.phase} progress={progress} />
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>🔍 Find a Doctor Nearby</h1>
        <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '20px' }}>Real-time doctor availability in your area</p>

        {/* Map */}
        <LiveMap
          patientLocation={demo.patientLocation}
          doctorLocation={demo.nearbyDoctors[0]}
          nearbyDoctors={demo.nearbyDoctors}
          route={[]}
          showDoctorMarker={false}
          height={320}
          style={{ marginBottom: '20px' }}
        />

        {/* Doctor cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {demo.nearbyDoctors.map(doc => (
            <div key={doc.id} style={{
              background: 'white', borderRadius: '16px', border: doc.isDemo ? '2px solid #6366f1' : '1px solid #e2e8f0',
              padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px',
              transition: 'all 0.2s', position: 'relative',
              boxShadow: doc.isDemo ? '0 4px 20px rgba(99,102,241,0.15)' : 'none',
            }}>
              {doc.isDemo && (
                <div style={{
                  position: 'absolute', top: '-10px', left: '16px',
                  padding: '3px 10px', borderRadius: '999px',
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  color: 'white', fontSize: '11px', fontWeight: 700,
                }}>⭐ Recommended for Demo</div>
              )}
              <div style={{
                width: '52px', height: '52px', borderRadius: '14px', flexShrink: 0,
                background: doc.type === 'veterinary' ? 'linear-gradient(135deg, #14b8a6, #06b6d4)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontWeight: 800, fontSize: '16px',
              }}>{doc.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>{doc.name}</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>{doc.specialization}</div>
                <div style={{ display: 'flex', gap: '12px', marginTop: '6px' }}>
                  <span style={{ fontSize: '12px', color: '#f59e0b', fontWeight: 600 }}>⭐ {doc.rating}</span>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>📍 {doc.distance}</span>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>⏱ {doc.eta}</span>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#22c55e' }}>₹{doc.fee}</span>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{
                  padding: '3px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 600,
                  background: doc.isOnline ? '#dcfce7' : '#fef2f2',
                  color: doc.isOnline ? '#15803d' : '#dc2626',
                }}>● {doc.isOnline ? 'Online' : 'Offline'}</span>
                {doc.isOnline && (
                  <button onClick={() => demo.selectDoctor(doc.id)} style={{
                    padding: '8px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 700,
                    background: doc.isDemo ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : '#f1f5f9',
                    color: doc.isDemo ? 'white' : '#334155',
                    border: 'none', cursor: 'pointer',
                  }}>Book Visit</button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Doctor selected confirmation */}
        {demo.phase === PHASES.DOCTOR_SELECTED && (
          <div style={{
            marginTop: '20px', background: '#eef2ff', borderRadius: '16px',
            padding: '20px', border: '2px solid #6366f1',
          }}>
            <div style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
              ✅ {demo.selectedDoctor?.name || 'Dr. Arun Mehta'} Selected
            </div>
            <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>
              Consultation Fee: ₹{demo.demoDoctor?.consultationFee} | Pay 50% advance to confirm booking
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setShowPayment(true)} style={{
                padding: '12px 24px', borderRadius: '12px', fontWeight: 700, fontSize: '14px',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white',
                border: 'none', cursor: 'pointer', boxShadow: '0 4px 15px rgba(99,102,241,0.3)',
              }}>💳 Pay ₹{(demo.demoDoctor?.consultationFee || 800) / 2} Advance</button>
              <button onClick={() => demo.startDemo()} style={{
                padding: '12px 24px', borderRadius: '12px', fontWeight: 600, fontSize: '14px',
                background: 'white', color: '#64748b', border: '1px solid #e2e8f0', cursor: 'pointer',
              }}>← Change Doctor</button>
            </div>
          </div>
        )}

        <PaymentModal
          isOpen={showPayment}
          onClose={() => setShowPayment(false)}
          amount={(demo.demoDoctor?.consultationFee || 800) / 2}
          totalFee={demo.demoDoctor?.consultationFee || 800}
          splitLabel="50% Advance Payment"
          doctorName={demo.demoDoctor?.name}
          onPaymentComplete={() => { setShowPayment(false); demo.initiatePayment(); setTimeout(() => demo.completeFirstPayment(), 500); }}
        />
      </DashboardLayout>
    );
  }

  // ─── PHASE: PAYMENT / DOCTOR NOTIFIED ─────────────
  if ([PHASES.PAYMENT_INITIATED, PHASES.PAYMENT_50_COMPLETE, PHASES.DOCTOR_NOTIFIED].includes(demo.phase)) {
    return (
      <DashboardLayout sidebarItems={sidebarItems}>
        <NotificationToast notifications={visibleNotifs} onDismiss={handleDismissNotif} />
        <PhaseHeader phase={demo.phase} progress={progress} />
        <div style={{ maxWidth: '540px', margin: '0 auto', textAlign: 'center', padding: '40px 0' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px', animation: 'pulse 2s ease-in-out infinite' }}>⏳</div>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
            Waiting for Doctor Response
          </h2>
          <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '24px' }}>
            ₹{(demo.demoDoctor?.consultationFee || 800) / 2} advance paid successfully.
            Notification sent to Dr. Arun Mehta.
          </p>
          <div style={{
            background: '#f0fdf4', borderRadius: '14px', padding: '16px', marginBottom: '20px',
            border: '1px solid #bbf7d0', textAlign: 'left',
          }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a', marginBottom: '8px' }}>📋 Booking Confirmation</div>
            {[
              { k: 'Doctor', v: demo.demoDoctor?.name },
              { k: 'Specialization', v: demo.demoDoctor?.specialization },
              { k: 'Advance Paid', v: `₹${(demo.demoDoctor?.consultationFee || 800) / 2}` },
              { k: 'Transaction', v: demo.paymentState?.firstTransactionId || '—' },
            ].map((row, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: '13px' }}>
                <span style={{ color: '#64748b' }}>{row.k}</span>
                <span style={{ fontWeight: 600, color: '#0f172a' }}>{row.v}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
            {['Booking Confirmed', 'Doctor Notified', 'Awaiting Response'].map((s, i) => (
              <div key={i} style={{
                padding: '8px 12px', borderRadius: '10px', fontSize: '12px', fontWeight: 600,
                background: i <= 1 ? '#dcfce7' : '#fef3c7',
                color: i <= 1 ? '#15803d' : '#92400e',
              }}>{i <= 1 ? '✅' : '⏳'} {s}</div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // ─── PHASE: DOCTOR ACCEPTED / EN ROUTE / ARRIVED / TREATMENT ───
  if ([PHASES.DOCTOR_ACCEPTED, PHASES.DOCTOR_EN_ROUTE, PHASES.DOCTOR_ARRIVED, PHASES.TREATMENT_IN_PROGRESS].includes(demo.phase)) {
    return (
      <DashboardLayout sidebarItems={sidebarItems}>
        <NotificationToast notifications={visibleNotifs} onDismiss={handleDismissNotif} />
        <PhaseHeader phase={demo.phase} progress={progress} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px' }}>
          {/* Map */}
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>
              {demo.phase === PHASES.DOCTOR_ARRIVED ? '📍 Doctor Has Arrived!' :
               demo.phase === PHASES.TREATMENT_IN_PROGRESS ? '🩺 Treatment in Progress' :
               '🚗 Doctor En Route'}
            </h2>
            <LiveMap
              doctorLocation={demo.doctorLocation}
              patientLocation={demo.patientLocation}
              route={demo.DOCTOR_ROUTE}
              routeIndex={demo.doctorRouteIndex}
              showDoctorMarker
              height={350}
              style={{ marginBottom: '16px' }}
            />

            {/* Doctor info card */}
            <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '16px', display: 'flex', gap: '14px', alignItems: 'center' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'linear-gradient(135deg, #14b8a6, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '18px', flexShrink: 0 }}>AM</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>{demo.demoDoctor?.name}</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>{demo.demoDoctor?.specialization} • ⭐ {demo.demoDoctor?.rating}</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>{demo.demoDoctor?.hospital}</div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => setShowVideoCall(true)} style={{ padding: '8px 16px', borderRadius: '10px', background: '#dcfce7', border: '1px solid #bbf7d0', cursor: 'pointer', fontSize: '13px', fontWeight: 600, color: '#15803d', display: 'flex', alignItems: 'center', gap: '6px' }}>📹 Video Call</button>
                <button style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#e0e7ff', border: 'none', cursor: 'pointer', fontSize: '18px' }}>💬</button>
              </div>
            </div>

            {demo.phase === PHASES.TREATMENT_IN_PROGRESS && (
              <div style={{ marginTop: '16px', background: 'linear-gradient(135deg, #8b5cf6, #6366f1)', borderRadius: '16px', padding: '20px', color: 'white', textAlign: 'center' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '4px', opacity: 0.9 }}>Treatment Duration</div>
                <div style={{ fontSize: '36px', fontWeight: 900, fontFamily: 'monospace' }}>{formatTimer(treatmentTimer)}</div>
                <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '4px' }}>Dr. Arun Mehta is attending to you</div>
                <button 
                  onClick={() => setShowVideoCall(true)}
                  style={{ marginTop: '16px', padding: '10px 24px', borderRadius: '10px', background: 'white', color: '#6366f1', border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: '14px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}
                >
                  Join Secure Video Room 📹
                </button>
              </div>
            )}
          </div>
          
          {showVideoCall && (
            <TelemedicineRoom 
              doctorName={demo.demoDoctor?.name}
              patientName={demo.demoPatient?.name}
              onClose={() => setShowVideoCall(false)}
            />
          )}

          {/* Tracker sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <LiveTracker
              title="Doctor Tracking"
              subtitle="Home Visit Service"
              entityName={demo.demoDoctor?.name}
              entityIcon="🚗"
              accentColor="#14b8a6"
              steps={doctorTrackerSteps}
              currentStep={Math.max(0, doctorTrackerStep)}
              eta={demo.getDoctorETA ? demo.getDoctorETA() : null}
            />
            <TreatmentTimeline currentPhase={demo.phase} timeline={demo.timeline} />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // ─── PHASE: OTP GENERATED ──────────────────────────
  if ([PHASES.COMPLETION_REQUESTED, PHASES.OTP_GENERATED].includes(demo.phase)) {
    return (
      <DashboardLayout sidebarItems={sidebarItems}>
        <NotificationToast notifications={visibleNotifs} onDismiss={handleDismissNotif} />
        <PhaseHeader phase={demo.phase} progress={progress} />
        <div style={{ maxWidth: '560px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>🔑 Treatment Verification OTP</h2>
          <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '24px' }}>
            Treatment is complete! Share this OTP with your doctor to confirm and unlock final payment.
          </p>
          <OTPVerification
            mode="display"
            otp={demo.otp}
            otpExpiry={demo.otpExpiry}
          />
          <div style={{ marginTop: '16px', background: '#fffbeb', borderRadius: '12px', padding: '14px', border: '1px solid #fde68a', textAlign: 'center' }}>
            <div style={{ fontSize: '13px', color: '#92400e', fontWeight: 500 }}>
              📢 Read this OTP aloud to Dr. Arun Mehta to verify treatment completion
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // ─── PHASE: OTP VERIFIED → FINAL PAYMENT ──────────
  if (demo.phase === PHASES.OTP_VERIFIED || demo.phase === PHASES.FINAL_PAYMENT) {
    return (
      <DashboardLayout sidebarItems={sidebarItems}>
        <NotificationToast notifications={visibleNotifs} onDismiss={handleDismissNotif} />
        <PhaseHeader phase={demo.phase} progress={progress} />
        <div style={{ maxWidth: '540px', margin: '0 auto', textAlign: 'center', padding: '20px 0' }}>
          <div style={{
            width: '80px', height: '80px', borderRadius: '24px', margin: '0 auto 20px',
            background: 'linear-gradient(135deg, #22c55e, #10b981)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '36px', boxShadow: '0 8px 25px rgba(34,197,94,0.3)',
            animation: 'scaleIn 0.4s ease-out',
          }}>✅</div>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>Treatment Verified!</h2>
          <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '24px' }}>
            Please complete the remaining 50% payment to finalize your consultation.
          </p>
          <div style={{ background: '#f8fafc', borderRadius: '14px', padding: '16px', marginBottom: '20px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
              <span style={{ color: '#64748b' }}>Advance Paid</span>
              <span style={{ fontWeight: 600, color: '#22c55e' }}>₹{demo.paymentState?.firstHalf}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
              <span style={{ color: '#64748b' }}>Remaining Balance</span>
              <span style={{ fontWeight: 700, color: '#ef4444', fontSize: '16px' }}>₹{demo.paymentState?.consultationFee / 2}</span>
            </div>
          </div>
          <button onClick={() => { demo.initiateFinalPayment(); setShowFinalPayment(true); }} style={{
            width: '100%', padding: '14px', borderRadius: '14px', fontSize: '15px', fontWeight: 700,
            background: 'linear-gradient(135deg, #22c55e, #10b981)', color: 'white',
            border: 'none', cursor: 'pointer', boxShadow: '0 4px 15px rgba(34,197,94,0.3)',
          }}>💳 Pay Remaining ₹{demo.paymentState?.consultationFee / 2}</button>
          <PaymentModal
            isOpen={showFinalPayment}
            onClose={() => setShowFinalPayment(false)}
            amount={(demo.demoDoctor?.consultationFee || 800) / 2}
            totalFee={demo.demoDoctor?.consultationFee || 800}
            splitLabel="Final 50% Payment"
            doctorName={demo.demoDoctor?.name}
            onPaymentComplete={() => { setShowFinalPayment(false); demo.completeSecondPayment(); }}
          />
        </div>
      </DashboardLayout>
    );
  }

  // ─── PHASE: PRESCRIPTION ──────────────────────────
  if (demo.phase === PHASES.PRESCRIPTION_CREATED) {
    const rx = demo.prescription;
    return (
      <DashboardLayout sidebarItems={sidebarItems}>
        <NotificationToast notifications={visibleNotifs} onDismiss={handleDismissNotif} />
        <PhaseHeader phase={demo.phase} progress={progress} />
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>💊 Your Prescription</h2>
          <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '20px' }}>Digital prescription from Dr. Arun Mehta</p>
          {rx ? (
            <div style={{ background: 'white', borderRadius: '16px', border: '2px solid #e2e8f0', overflow: 'hidden' }}>
              <div style={{ background: 'linear-gradient(135deg, #0f172a, #1e1b4b)', padding: '20px 24px', color: 'white' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: '18px', fontWeight: 800 }}>MedVet Rx</div>
                    <div style={{ fontSize: '12px', opacity: 0.7 }}>{new Date().toLocaleDateString('en-IN')}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '13px', fontWeight: 600 }}>{demo.demoDoctor?.name}</div>
                    <div style={{ fontSize: '11px', opacity: 0.7 }}>{demo.demoDoctor?.qualification}</div>
                  </div>
                </div>
              </div>
              <div style={{ padding: '24px' }}>
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Diagnosis</div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>{rx.diagnosis}</div>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginBottom: '10px' }}>Prescribed Medicines</div>
                  {(rx.medicines || []).map((med, i) => (
                    <div key={i} style={{ padding: '12px', background: '#f8fafc', borderRadius: '10px', marginBottom: '8px', border: '1px solid #f1f5f9' }}>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>{med.name}</div>
                      <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                        {med.dosage} • {med.duration} • {med.instructions}
                      </div>
                    </div>
                  ))}
                </div>
                {rx.notes && <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>📝 {rx.notes}</div>}
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={demo.dispatchMedicine} style={{
                    flex: 1, padding: '12px', borderRadius: '12px', fontWeight: 700, fontSize: '14px',
                    background: 'linear-gradient(135deg, #14b8a6, #06b6d4)', color: 'white',
                    border: 'none', cursor: 'pointer', boxShadow: '0 4px 15px rgba(20,184,166,0.3)',
                  }}>📦 Order Medicines</button>
                  <button onClick={demo.skipToMedicinePhase} style={{
                    padding: '12px 16px', borderRadius: '12px', fontWeight: 600, fontSize: '13px',
                    background: 'white', color: '#64748b', border: '1px solid #e2e8f0', cursor: 'pointer',
                  }}>Skip →</button>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px', background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '36px', marginBottom: '12px' }}>⏳</div>
              <div style={{ fontSize: '14px', color: '#64748b' }}>Waiting for doctor to create prescription...</div>
            </div>
          )}
        </div>
      </DashboardLayout>
    );
  }

  // ─── PHASE: MEDICINE TRACKING ─────────────────────
  if ([PHASES.MEDICINE_DISPATCHED, PHASES.MEDICINE_IN_TRANSIT, PHASES.MEDICINE_DELIVERED].includes(demo.phase)) {
    return (
      <DashboardLayout sidebarItems={sidebarItems}>
        <NotificationToast notifications={visibleNotifs} onDismiss={handleDismissNotif} />
        <PhaseHeader phase={demo.phase} progress={progress} />
        <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>📦 Medicine Delivery Tracking</h2>
        <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '20px' }}>Real-time delivery tracking for your prescribed medicines</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px' }}>
          <div>
            <LiveMap
              patientLocation={demo.patientLocation}
              doctorLocation={null}
              medicineLocation={demo.medicineLocation}
              medicineRoute={demo.MEDICINE_ROUTE}
              medicineRouteIndex={demo.medicineRouteIndex}
              showDoctorMarker={false}
              showMedicineMarker
              height={340}
              style={{ marginBottom: '16px' }}
            />
            {demo.phase === PHASES.MEDICINE_DELIVERED && (
              <div style={{ background: 'linear-gradient(135deg, #22c55e, #10b981)', borderRadius: '16px', padding: '20px', color: 'white', textAlign: 'center' }}>
                <div style={{ fontSize: '36px', marginBottom: '8px' }}>📬</div>
                <div style={{ fontSize: '18px', fontWeight: 800, marginBottom: '4px' }}>Medicines Delivered!</div>
                <div style={{ fontSize: '13px', opacity: 0.9, marginBottom: '16px' }}>Your medicines have been delivered to your address.</div>
                <button onClick={demo.completeDemo} style={{
                  padding: '12px 24px', borderRadius: '12px', background: 'white',
                  color: '#15803d', fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: '14px',
                }}>View Treatment Summary →</button>
              </div>
            )}
          </div>
          <div>
            <LiveTracker
              title="Medicine Delivery"
              subtitle={demo.medicineOrder?.id}
              entityName="MedVet Delivery Partner"
              entityIcon="🛵"
              accentColor="#f59e0b"
              steps={medicineTrackerSteps}
              currentStep={Math.max(0, medicineTrackerStep)}
              eta={demo.getMedicineETA ? demo.getMedicineETA() : null}
            />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // ─── PHASE: COMPLETED ─────────────────────────────
  if (demo.phase === PHASES.COMPLETED) {
    return (
      <DashboardLayout sidebarItems={sidebarItems}>
        <NotificationToast notifications={visibleNotifs} onDismiss={handleDismissNotif} />
        <PhaseHeader phase={demo.phase} progress={100} />
        <TreatmentSummary state={demo} />
        <div style={{ textAlign: 'center', marginTop: '24px', marginBottom: '8px' }}>
          <button onClick={demo.resetDemo} style={{
            padding: '12px 28px', borderRadius: '14px', fontWeight: 700,
            background: '#f1f5f9', color: '#334155', border: '1px solid #e2e8f0',
            cursor: 'pointer', fontSize: '14px',
          }}>🔄 Restart Demo</button>
        </div>
      </DashboardLayout>
    );
  }

  return null;
}
