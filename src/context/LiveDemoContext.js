'use client';
import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { MOCK_USERS, MOCK_MEDICINES } from '@/data/mockData';

const LiveDemoContext = createContext(null);

// ── Phase Constants ──────────────────────────────────
export const PHASES = {
  IDLE: 'IDLE',
  SEARCHING: 'SEARCHING',
  DOCTOR_SELECTED: 'DOCTOR_SELECTED',
  PAYMENT_INITIATED: 'PAYMENT_INITIATED',
  PAYMENT_50_COMPLETE: 'PAYMENT_50_COMPLETE',
  DOCTOR_NOTIFIED: 'DOCTOR_NOTIFIED',
  DOCTOR_ACCEPTED: 'DOCTOR_ACCEPTED',
  DOCTOR_EN_ROUTE: 'DOCTOR_EN_ROUTE',
  DOCTOR_ARRIVED: 'DOCTOR_ARRIVED',
  TREATMENT_IN_PROGRESS: 'TREATMENT_IN_PROGRESS',
  COMPLETION_REQUESTED: 'COMPLETION_REQUESTED',
  OTP_GENERATED: 'OTP_GENERATED',
  OTP_VERIFIED: 'OTP_VERIFIED',
  FINAL_PAYMENT: 'FINAL_PAYMENT',
  PRESCRIPTION_CREATED: 'PRESCRIPTION_CREATED',
  MEDICINE_DISPATCHED: 'MEDICINE_DISPATCHED',
  MEDICINE_IN_TRANSIT: 'MEDICINE_IN_TRANSIT',
  MEDICINE_DELIVERED: 'MEDICINE_DELIVERED',
  COMPLETED: 'COMPLETED',
};

export const PHASE_ORDER = Object.values(PHASES);

export const PHASE_LABELS = {
  [PHASES.IDLE]: 'Ready to Start',
  [PHASES.SEARCHING]: 'Searching Doctors',
  [PHASES.DOCTOR_SELECTED]: 'Doctor Selected',
  [PHASES.PAYMENT_INITIATED]: 'Processing Payment',
  [PHASES.PAYMENT_50_COMPLETE]: '50% Payment Done',
  [PHASES.DOCTOR_NOTIFIED]: 'Doctor Notified',
  [PHASES.DOCTOR_ACCEPTED]: 'Doctor Accepted',
  [PHASES.DOCTOR_EN_ROUTE]: 'Doctor En Route',
  [PHASES.DOCTOR_ARRIVED]: 'Doctor Arrived',
  [PHASES.TREATMENT_IN_PROGRESS]: 'Treatment in Progress',
  [PHASES.COMPLETION_REQUESTED]: 'Completion Requested',
  [PHASES.OTP_GENERATED]: 'OTP Generated',
  [PHASES.OTP_VERIFIED]: 'OTP Verified',
  [PHASES.FINAL_PAYMENT]: 'Final Payment',
  [PHASES.PRESCRIPTION_CREATED]: 'Prescription Created',
  [PHASES.MEDICINE_DISPATCHED]: 'Medicine Dispatched',
  [PHASES.MEDICINE_IN_TRANSIT]: 'Medicine In Transit',
  [PHASES.MEDICINE_DELIVERED]: 'Medicine Delivered',
  [PHASES.COMPLETED]: 'Completed',
};

// ── Demo Config ──────────────────────────────────────
const DEMO_DOCTOR = MOCK_USERS.doctors.find(d => d.id === 'DOC001'); // Dr. Arun Mehta
const DEMO_PATIENT = MOCK_USERS.patients.find(p => p.id === 'PAT001'); // Rahul Sharma

// Simulated GPS route points (doctor traveling to patient)
const DOCTOR_ROUTE = [
  { lat: 19.0760, lng: 72.8777, label: 'Apollo Hospital' },
  { lat: 19.0745, lng: 72.8790, label: 'SV Road' },
  { lat: 19.0730, lng: 72.8810, label: 'Linking Road' },
  { lat: 19.0715, lng: 72.8830, label: 'Turner Road' },
  { lat: 19.0700, lng: 72.8850, label: 'Pedder Road' },
  { lat: 19.0685, lng: 72.8870, label: 'Haji Ali' },
  { lat: 19.0665, lng: 72.8890, label: 'Breach Candy' },
  { lat: 19.0650, lng: 72.8905, label: 'Kemps Corner' },
  { lat: 19.0640, lng: 72.8920, label: 'Charni Road' },
  { lat: 19.0630, lng: 72.8935, label: 'Marine Lines' },
  { lat: 19.0622, lng: 72.8948, label: 'Nariman Point' },
  { lat: 19.0615, lng: 72.8960, label: 'Marine Drive' },
];

const MEDICINE_ROUTE = [
  { lat: 19.0800, lng: 72.8700, label: 'MedVet Pharmacy Hub' },
  { lat: 19.0780, lng: 72.8725, label: 'Warehouse Gate' },
  { lat: 19.0760, lng: 72.8760, label: 'Main Highway' },
  { lat: 19.0740, lng: 72.8800, label: 'Distribution Center' },
  { lat: 19.0720, lng: 72.8840, label: 'Local Hub' },
  { lat: 19.0700, lng: 72.8870, label: 'Area Office' },
  { lat: 19.0680, lng: 72.8900, label: 'Nearby Junction' },
  { lat: 19.0660, lng: 72.8930, label: 'Delivery Lane' },
  { lat: 19.0640, lng: 72.8950, label: 'Patient Address' },
];

const PATIENT_LOCATION = { lat: 19.0615, lng: 72.8960 };

const NEARBY_DOCTORS = [
  { id: 'DOC001', name: 'Dr. Arun Mehta', specialization: 'General Physician', rating: 4.8, fee: 800, distance: '3.2 km', eta: '12 min', lat: 19.0760, lng: 72.8777, isDemo: true, isOnline: true, type: 'human' },
  { id: 'DOC003', name: 'Dr. Vikram Singh', specialization: 'Cardiologist', rating: 4.7, fee: 1500, distance: '5.1 km', eta: '18 min', lat: 19.0810, lng: 72.8750, isDemo: false, isOnline: true, type: 'human' },
  { id: 'DOC004', name: 'Dr. Meera Joshi', specialization: 'Dermatologist', rating: 4.6, fee: 700, distance: '4.8 km', eta: '16 min', lat: 19.0690, lng: 72.8820, isDemo: false, isOnline: true, type: 'human' },
  { id: 'DOC002', name: 'Dr. Sneha Reddy', specialization: 'Veterinary Surgeon', rating: 4.9, fee: 600, distance: '6.3 km', eta: '22 min', lat: 19.0850, lng: 72.8690, isDemo: false, isOnline: true, type: 'veterinary' },
  { id: 'DOC006', name: 'Dr. Anita Desai', specialization: 'Pediatrician', rating: 4.9, fee: 900, distance: '7.5 km', eta: '25 min', lat: 19.0580, lng: 72.9000, isDemo: false, isOnline: false, type: 'human' },
];

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function generateTransactionId() {
  return 'TXN' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 6).toUpperCase();
}

// ── Initial State ────────────────────────────────────
function getInitialState() {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('medvet_live_demo');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
  }
  return {
    phase: PHASES.IDLE,
    demoDoctor: DEMO_DOCTOR,
    demoPatient: DEMO_PATIENT,
    nearbyDoctors: NEARBY_DOCTORS,
    patientLocation: PATIENT_LOCATION,
    selectedDoctor: null,
    doctorLocation: DOCTOR_ROUTE[0],
    doctorRouteIndex: 0,
    medicineLocation: MEDICINE_ROUTE[0],
    medicineRouteIndex: 0,
    otp: '',
    otpExpiry: null,
    paymentState: {
      consultationFee: DEMO_DOCTOR?.consultationFee || 800,
      firstHalf: 0,
      secondHalf: 0,
      firstTransactionId: null,
      secondTransactionId: null,
      firstPaidAt: null,
      secondPaidAt: null,
    },
    prescription: null,
    medicineOrder: null,
    treatmentNotes: '',
    treatmentStartTime: null,
    treatmentEndTime: null,
    timeline: [],
    notifications: { patient: [], doctor: [], admin: [] },
    adminOverrides: { blocked: false, paused: false, notes: '' },
    demoStartTime: null,
    demoEndTime: null,
  };
}

// ── Provider ─────────────────────────────────────────
export function LiveDemoProvider({ children }) {
  const [state, setState] = useState(getInitialState);
  const locationIntervalRef = useRef(null);
  const medicineIntervalRef = useRef(null);

  // Persist state
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('medvet_live_demo', JSON.stringify(state));
    }
  }, [state]);

  // Sync state across multiple tabs (e.g. Patient, Doctor, Admin open simultaneously)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'medvet_live_demo') {
        if (e.newValue) {
          try {
            setState(JSON.parse(e.newValue));
          } catch (err) {}
        } else {
          // If the key was deleted (resetDemo was called in another tab)
          if (locationIntervalRef.current) clearInterval(locationIntervalRef.current);
          if (medicineIntervalRef.current) clearInterval(medicineIntervalRef.current);
          setState(getInitialState());
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // ── Timeline Logger ──
  const logEvent = useCallback((event, actor = 'system') => {
    setState(prev => ({
      ...prev,
      timeline: [...prev.timeline, {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        event,
        actor,
        phase: prev.phase,
      }],
    }));
  }, []);

  // ── Notification Push ──
  const pushNotification = useCallback((role, message, type = 'info') => {
    setState(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [role]: [...prev.notifications[role], {
          id: Date.now(),
          message,
          type,
          time: new Date().toLocaleTimeString(),
          read: false,
        }],
      },
    }));
  }, []);

  // ── Phase Transition ──
  const setPhase = useCallback((phase) => {
    setState(prev => {
      if (prev.adminOverrides.blocked) return prev;
      return { ...prev, phase };
    });
  }, []);

  // ── Actions ──

  const startDemo = useCallback(() => {
    const fresh = getInitialState();
    fresh.phase = PHASES.SEARCHING;
    fresh.demoStartTime = new Date().toISOString();
    fresh.timeline = [{ id: Date.now(), timestamp: new Date().toISOString(), event: 'Live Demo started', actor: 'system', phase: PHASES.SEARCHING }];
    setState(fresh);
    pushNotification('admin', '🎯 New Live Demo session started', 'info');
  }, [pushNotification]);

  const selectDoctor = useCallback((doctorId) => {
    const doc = NEARBY_DOCTORS.find(d => d.id === doctorId) || NEARBY_DOCTORS[0];
    setState(prev => ({ ...prev, phase: PHASES.DOCTOR_SELECTED, selectedDoctor: doc }));
    logEvent(`Doctor selected: ${doc.name}`, 'patient');
    pushNotification('admin', `📋 Patient selected ${doc.name}`, 'info');
  }, [logEvent, pushNotification]);

  const initiatePayment = useCallback(() => {
    setPhase(PHASES.PAYMENT_INITIATED);
    logEvent('Payment initiated (50% advance)', 'patient');
    pushNotification('admin', '💳 Payment initiated by patient', 'info');
  }, [setPhase, logEvent, pushNotification]);

  const completeFirstPayment = useCallback(() => {
    const txnId = generateTransactionId();
    setState(prev => ({
      ...prev,
      phase: PHASES.PAYMENT_50_COMPLETE,
      paymentState: {
        ...prev.paymentState,
        firstHalf: prev.paymentState.consultationFee / 2,
        firstTransactionId: txnId,
        firstPaidAt: new Date().toISOString(),
      },
    }));
    logEvent(`50% payment completed (₹${DEMO_DOCTOR?.consultationFee / 2}). TXN: ${txnId}`, 'patient');
    pushNotification('doctor', '🔔 New home visit request! Patient has paid 50% advance.', 'urgent');
    pushNotification('patient', '✅ Payment successful! Notifying doctor...', 'success');
    pushNotification('admin', `💰 Payment received: ₹${DEMO_DOCTOR?.consultationFee / 2}. TXN: ${txnId}`, 'success');

    // Auto-transition to DOCTOR_NOTIFIED after brief delay
    setTimeout(() => {
      setState(prev => prev.phase === PHASES.PAYMENT_50_COMPLETE ? { ...prev, phase: PHASES.DOCTOR_NOTIFIED } : prev);
    }, 1500);
  }, [logEvent, pushNotification]);

  const doctorAccept = useCallback(() => {
    setState(prev => ({ ...prev, phase: PHASES.DOCTOR_ACCEPTED }));
    logEvent('Doctor accepted the request', 'doctor');
    pushNotification('patient', '🎉 Great news! Dr. Arun Mehta accepted your request and is on the way!', 'success');
    pushNotification('admin', '✅ Doctor accepted patient request', 'success');

    // Auto-transition to EN_ROUTE
    setTimeout(() => {
      setState(prev => prev.phase === PHASES.DOCTOR_ACCEPTED ? { ...prev, phase: PHASES.DOCTOR_EN_ROUTE, doctorRouteIndex: 0 } : prev);
    }, 2000);
  }, [logEvent, pushNotification]);

  const doctorDecline = useCallback(() => {
    logEvent('Doctor declined the request', 'doctor');
    pushNotification('patient', '😔 Doctor is unavailable. Searching for another doctor...', 'warning');
    pushNotification('admin', '❌ Doctor declined the request', 'warning');
    setPhase(PHASES.SEARCHING);
  }, [logEvent, pushNotification, setPhase]);

  // Doctor location interpolation
  const advanceDoctorLocation = useCallback(() => {
    setState(prev => {
      if (prev.phase !== PHASES.DOCTOR_EN_ROUTE) return prev;
      if (prev.adminOverrides.blocked || prev.adminOverrides.paused) return prev;
      const nextIndex = prev.doctorRouteIndex + 1;
      if (nextIndex >= DOCTOR_ROUTE.length) {
        return { ...prev, phase: PHASES.DOCTOR_ARRIVED, doctorLocation: DOCTOR_ROUTE[DOCTOR_ROUTE.length - 1], doctorRouteIndex: DOCTOR_ROUTE.length - 1 };
      }
      return { ...prev, doctorLocation: DOCTOR_ROUTE[nextIndex], doctorRouteIndex: nextIndex };
    });
  }, []);

  // Doctor location simulation
  useEffect(() => {
    if (state.phase === PHASES.DOCTOR_EN_ROUTE && !state.adminOverrides.blocked && !state.adminOverrides.paused) {
      locationIntervalRef.current = setInterval(advanceDoctorLocation, 2500);
      return () => clearInterval(locationIntervalRef.current);
    } else {
      if (locationIntervalRef.current) clearInterval(locationIntervalRef.current);
    }
  }, [state.phase, state.adminOverrides.blocked, state.adminOverrides.paused, advanceDoctorLocation]);

  // Auto-log arrival
  useEffect(() => {
    if (state.phase === PHASES.DOCTOR_ARRIVED && state.timeline.length > 0) {
      const lastEvent = state.timeline[state.timeline.length - 1];
      if (!lastEvent.event.includes('arrived')) {
        logEvent('Doctor arrived at patient location', 'system');
        pushNotification('patient', '📍 Dr. Arun Mehta has arrived at your location!', 'success');
        pushNotification('admin', '📍 Doctor arrived at patient location', 'info');
      }
    }
  }, [state.phase]);

  const startTreatment = useCallback(() => {
    setState(prev => ({ ...prev, phase: PHASES.TREATMENT_IN_PROGRESS, treatmentStartTime: new Date().toISOString() }));
    logEvent('Treatment started', 'doctor');
    pushNotification('patient', '🩺 Your treatment has begun!', 'info');
    pushNotification('admin', '🩺 Treatment in progress', 'info');
  }, [logEvent, pushNotification]);

  const requestCompletion = useCallback((notes = '') => {
    const otp = generateOTP();
    setState(prev => ({
      ...prev,
      phase: PHASES.OTP_GENERATED,
      otp,
      otpExpiry: Date.now() + 300000, // 5 min
      treatmentNotes: notes,
      treatmentEndTime: new Date().toISOString(),
    }));
    logEvent(`Treatment completion requested. OTP generated: ${otp}`, 'doctor');
    pushNotification('patient', `🔑 Your treatment verification OTP has been generated. Please share it with your doctor.`, 'urgent');
    pushNotification('admin', `🔑 OTP generated for treatment verification`, 'info');
  }, [logEvent, pushNotification]);

  const verifyOTP = useCallback((inputOTP) => {
    if (inputOTP === state.otp) {
      setState(prev => ({ ...prev, phase: PHASES.OTP_VERIFIED }));
      logEvent('OTP verified successfully', 'doctor');
      pushNotification('patient', '✅ Treatment verified! Proceeding to final payment.', 'success');
      pushNotification('doctor', '✅ OTP verified! Treatment confirmed.', 'success');
      pushNotification('admin', '✅ OTP verification successful', 'success');
      return true;
    }
    logEvent('OTP verification failed — invalid code', 'doctor');
    pushNotification('doctor', '❌ Invalid OTP. Please try again.', 'error');
    return false;
  }, [state.otp, logEvent, pushNotification]);

  const initiateFinalPayment = useCallback(() => {
    setPhase(PHASES.FINAL_PAYMENT);
    logEvent('Final payment initiated (remaining 50%)', 'patient');
  }, [setPhase, logEvent]);

  const completeSecondPayment = useCallback(() => {
    const txnId = generateTransactionId();
    setState(prev => ({
      ...prev,
      phase: PHASES.PRESCRIPTION_CREATED,
      paymentState: {
        ...prev.paymentState,
        secondHalf: prev.paymentState.consultationFee / 2,
        secondTransactionId: txnId,
        secondPaidAt: new Date().toISOString(),
      },
    }));
    logEvent(`Final 50% payment completed. TXN: ${txnId}`, 'patient');
    pushNotification('doctor', `💰 Full payment received! ₹${DEMO_DOCTOR?.consultationFee}`, 'success');
    pushNotification('admin', `💰 Full payment complete. TXN: ${txnId}`, 'success');
  }, [logEvent, pushNotification]);

  const createPrescription = useCallback((prescriptionData) => {
    setState(prev => ({ ...prev, prescription: prescriptionData }));
    logEvent('Prescription created by doctor', 'doctor');
    pushNotification('patient', '💊 Your prescription is ready! Review it in your dashboard.', 'info');
    pushNotification('admin', '💊 Prescription created — awaiting verification', 'info');
  }, [logEvent, pushNotification]);

  const dispatchMedicine = useCallback(() => {
    const order = {
      id: 'ORD-DEMO-' + Date.now().toString(36).toUpperCase(),
      items: state.prescription?.medicines || [],
      status: 'dispatched',
      dispatchedAt: new Date().toISOString(),
    };
    setState(prev => ({
      ...prev,
      phase: PHASES.MEDICINE_DISPATCHED,
      medicineOrder: order,
      medicineRouteIndex: 0,
      medicineLocation: MEDICINE_ROUTE[0],
    }));
    logEvent(`Medicine order dispatched: ${order.id}`, 'admin');
    pushNotification('patient', '📦 Your medicines have been dispatched!', 'success');
    pushNotification('doctor', '📦 Prescribed medicines dispatched to patient', 'info');

    // Auto-transition to in-transit
    setTimeout(() => {
      setState(prev => prev.phase === PHASES.MEDICINE_DISPATCHED ? { ...prev, phase: PHASES.MEDICINE_IN_TRANSIT } : prev);
    }, 2000);
  }, [state.prescription, logEvent, pushNotification]);

  // Medicine location simulation
  const advanceMedicineLocation = useCallback(() => {
    setState(prev => {
      if (prev.phase !== PHASES.MEDICINE_IN_TRANSIT) return prev;
      if (prev.adminOverrides.blocked || prev.adminOverrides.paused) return prev;
      const nextIndex = prev.medicineRouteIndex + 1;
      if (nextIndex >= MEDICINE_ROUTE.length) {
        return { ...prev, phase: PHASES.MEDICINE_DELIVERED, medicineLocation: MEDICINE_ROUTE[MEDICINE_ROUTE.length - 1], medicineRouteIndex: MEDICINE_ROUTE.length - 1 };
      }
      return { ...prev, medicineLocation: MEDICINE_ROUTE[nextIndex], medicineRouteIndex: nextIndex };
    });
  }, []);

  useEffect(() => {
    if (state.phase === PHASES.MEDICINE_IN_TRANSIT && !state.adminOverrides.blocked && !state.adminOverrides.paused) {
      medicineIntervalRef.current = setInterval(advanceMedicineLocation, 2000);
      return () => clearInterval(medicineIntervalRef.current);
    } else {
      if (medicineIntervalRef.current) clearInterval(medicineIntervalRef.current);
    }
  }, [state.phase, state.adminOverrides.blocked, state.adminOverrides.paused, advanceMedicineLocation]);

  // Auto-log medicine delivery
  useEffect(() => {
    if (state.phase === PHASES.MEDICINE_DELIVERED) {
      const lastEvent = state.timeline[state.timeline.length - 1];
      if (!lastEvent?.event?.includes('Medicine delivered')) {
        logEvent('Medicine delivered to patient', 'system');
        pushNotification('patient', '📦 Your medicines have been delivered!', 'success');
        pushNotification('admin', '📦 Medicine delivery completed', 'success');
      }
    }
  }, [state.phase]);

  const completeDemo = useCallback(() => {
    setState(prev => {
      const newState = {
        ...prev,
        phase: PHASES.COMPLETED,
        demoEndTime: new Date().toISOString(),
      };
      
      // Push to real MongoDB backend
      fetch('/api/consultations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: newState.demoPatient?.id || 'PAT_UNKNOWN',
          patientName: newState.demoPatient?.name || 'Unknown Patient',
          doctorId: newState.demoDoctor?.id || 'DOC_UNKNOWN',
          doctorName: newState.demoDoctor?.name || 'Unknown Doctor',
          disease: newState.prescription?.diagnosis || newState.treatmentNotes || 'General Checkup',
          totalFee: (newState.paymentState?.firstHalf || 0) + (newState.paymentState?.secondHalf || 0),
          durationMins: newState.treatmentStartTime ? Math.ceil((new Date() - new Date(newState.treatmentStartTime)) / 60000) : 0,
          status: 'COMPLETED',
          medicinesDelivered: !!newState.medicineOrder,
        }),
      }).catch(err => console.error('Failed to save to backend:', err));

      return newState;
    });

    logEvent('Live Demo completed successfully', 'system');
    pushNotification('patient', '🎉 Treatment completed! View your summary report.', 'success');
    pushNotification('doctor', '🎉 Treatment session completed!', 'success');
    pushNotification('admin', '🎉 Live Demo session completed successfully', 'success');
  }, [logEvent, pushNotification]);

  const skipToMedicinePhase = useCallback(() => {
    // For demos without medicine, skip straight to completed
    setState(prev => ({ ...prev, phase: PHASES.COMPLETED, demoEndTime: new Date().toISOString() }));
    logEvent('Demo completed (no medicine prescribed)', 'system');
  }, [logEvent]);

  // ── Admin Actions ──
  const adminBlock = useCallback((notes = '') => {
    setState(prev => ({ ...prev, adminOverrides: { ...prev.adminOverrides, blocked: true, notes } }));
    logEvent(`Session BLOCKED by admin. Reason: ${notes || 'No reason provided'}`, 'admin');
    pushNotification('patient', '⚠️ Your session has been paused by the admin.', 'warning');
    pushNotification('doctor', '⚠️ Session paused by admin.', 'warning');
  }, [logEvent, pushNotification]);

  const adminResume = useCallback(() => {
    setState(prev => ({ ...prev, adminOverrides: { ...prev.adminOverrides, blocked: false, paused: false, notes: '' } }));
    logEvent('Session RESUMED by admin', 'admin');
    pushNotification('patient', '✅ Session resumed!', 'success');
    pushNotification('doctor', '✅ Session resumed!', 'success');
  }, [logEvent, pushNotification]);

  const adminPause = useCallback(() => {
    setState(prev => ({ ...prev, adminOverrides: { ...prev.adminOverrides, paused: true } }));
    logEvent('Session PAUSED by admin', 'admin');
  }, [logEvent]);

  const adminSendNotification = useCallback((role, message) => {
    pushNotification(role, `📢 Admin: ${message}`, 'warning');
    logEvent(`Admin sent notification to ${role}: ${message}`, 'admin');
  }, [pushNotification, logEvent]);

  const clearNotifications = useCallback((role) => {
    setState(prev => ({
      ...prev,
      notifications: { ...prev.notifications, [role]: prev.notifications[role].map(n => ({ ...n, read: true })) },
    }));
  }, []);

  const resetDemo = useCallback(() => {
    if (locationIntervalRef.current) clearInterval(locationIntervalRef.current);
    if (medicineIntervalRef.current) clearInterval(medicineIntervalRef.current);
    localStorage.removeItem('medvet_live_demo');
    setState(getInitialState());
  }, []);

  // Utility: get progress percentage
  const getProgress = useCallback(() => {
    const idx = PHASE_ORDER.indexOf(state.phase);
    return Math.round((idx / (PHASE_ORDER.length - 1)) * 100);
  }, [state.phase]);

  // Utility: get ETA
  const getDoctorETA = useCallback(() => {
    if (state.phase !== PHASES.DOCTOR_EN_ROUTE) return null;
    const remaining = DOCTOR_ROUTE.length - state.doctorRouteIndex - 1;
    return `${remaining * 2} min`;
  }, [state.phase, state.doctorRouteIndex]);

  const getMedicineETA = useCallback(() => {
    if (state.phase !== PHASES.MEDICINE_IN_TRANSIT) return null;
    const remaining = MEDICINE_ROUTE.length - state.medicineRouteIndex - 1;
    return `${remaining * 2} min`;
  }, [state.phase, state.medicineRouteIndex]);

  const value = {
    ...state,
    DOCTOR_ROUTE,
    MEDICINE_ROUTE,
    // Actions
    startDemo,
    selectDoctor,
    initiatePayment,
    completeFirstPayment,
    doctorAccept,
    doctorDecline,
    startTreatment,
    requestCompletion,
    verifyOTP,
    initiateFinalPayment,
    completeSecondPayment,
    createPrescription,
    dispatchMedicine,
    completeDemo,
    skipToMedicinePhase,
    // Admin
    adminBlock,
    adminResume,
    adminPause,
    adminSendNotification,
    // Utilities
    clearNotifications,
    resetDemo,
    getProgress,
    getDoctorETA,
    getMedicineETA,
    logEvent,
    pushNotification,
  };

  return (
    <LiveDemoContext.Provider value={value}>
      {children}
    </LiveDemoContext.Provider>
  );
}

export function useLiveDemo() {
  const ctx = useContext(LiveDemoContext);
  if (!ctx) throw new Error('useLiveDemo must be used within LiveDemoProvider');
  return ctx;
}

export default LiveDemoContext;
