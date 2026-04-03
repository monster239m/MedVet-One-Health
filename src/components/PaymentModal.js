'use client';
import { useState, useEffect } from 'react';

export default function PaymentModal({
  isOpen,
  onClose,
  amount,
  splitLabel = '50% Advance Payment',
  totalFee,
  doctorName,
  onPaymentComplete,
  transactionId = null,
}) {
  const [step, setStep] = useState('select'); // select, processing, success
  const [method, setMethod] = useState('upi');
  const [progress, setProgress] = useState(0);
  const [txnId, setTxnId] = useState(transactionId);

  useEffect(() => {
    if (step === 'processing') {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setStep('success');
            return 100;
          }
          return prev + Math.random() * 15 + 5;
        });
      }, 300);
      return () => clearInterval(interval);
    }
  }, [step]);

  useEffect(() => {
    if (step === 'success' && !txnId) {
      setTxnId('TXN' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 6).toUpperCase());
    }
  }, [step, txnId]);

  const handlePay = () => {
    setStep('processing');
    setProgress(0);
  };

  const handleDone = () => {
    if (onPaymentComplete) onPaymentComplete();
    setStep('select');
    setProgress(0);
    setTxnId(null);
  };

  if (!isOpen) return null;

  const methods = [
    { id: 'upi', label: 'UPI', icon: '📱', desc: 'GPay / PhonePe / Paytm' },
    { id: 'card', label: 'Card', icon: '💳', desc: 'Credit / Debit Card' },
    { id: 'wallet', label: 'MedVet Wallet', icon: '👛', desc: 'Balance: ₹2,450' },
    { id: 'netbanking', label: 'Net Banking', icon: '🏦', desc: 'All Major Banks' },
  ];

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
      backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center',
      justifyContent: 'center', zIndex: 1000, animation: 'fadeIn 0.2s ease-out',
    }} onClick={step !== 'processing' ? onClose : undefined}>
      <div style={{
        background: 'white', borderRadius: '24px', padding: '32px',
        width: '440px', maxWidth: '90vw', maxHeight: '85vh', overflowY: 'auto',
        animation: 'scaleIn 0.3s ease-out', boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
      }} onClick={e => e.stopPropagation()}>

        {/* ── Select Payment Method ── */}
        {step === 'select' && (
          <>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{
                width: '56px', height: '56px', borderRadius: '16px',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '24px', margin: '0 auto 12px',
              }}>💳</div>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
                {splitLabel}
              </h2>
              <p style={{ fontSize: '13px', color: '#64748b' }}>
                for consultation with {doctorName}
              </p>
            </div>

            {/* Amount Breakdown */}
            <div style={{
              background: '#f8fafc', borderRadius: '14px', padding: '16px',
              marginBottom: '20px', border: '1px solid #e2e8f0',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', color: '#64748b' }}>Total Consultation Fee</span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>₹{totalFee}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', color: '#64748b' }}>{splitLabel}</span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#6366f1' }}>₹{amount}</span>
              </div>
              <div style={{ borderTop: '1px dashed #e2e8f0', paddingTop: '8px', marginTop: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>Amount to Pay Now</span>
                  <span style={{ fontSize: '18px', fontWeight: 800, color: '#6366f1' }}>₹{amount}</span>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '10px' }}>
                Select Payment Method
              </div>
              {methods.map(m => (
                <div
                  key={m.id}
                  onClick={() => setMethod(m.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '12px 14px', borderRadius: '12px', marginBottom: '8px',
                    border: method === m.id ? '2px solid #6366f1' : '2px solid #e2e8f0',
                    background: method === m.id ? '#eef2ff' : 'white',
                    cursor: 'pointer', transition: 'all 0.2s',
                  }}
                >
                  <span style={{ fontSize: '22px' }}>{m.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>{m.label}</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>{m.desc}</div>
                  </div>
                  <div style={{
                    width: '20px', height: '20px', borderRadius: '50%',
                    border: method === m.id ? '6px solid #6366f1' : '2px solid #cbd5e1',
                    transition: 'all 0.2s',
                  }} />
                </div>
              ))}
            </div>

            {/* Pay Button */}
            <button
              onClick={handlePay}
              style={{
                width: '100%', padding: '14px', borderRadius: '14px',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: 'white', fontWeight: 700, fontSize: '15px',
                border: 'none', cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(99,102,241,0.4)',
                transition: 'all 0.2s',
              }}
            >
              Pay ₹{amount} →
            </button>

            <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '11px', color: '#94a3b8' }}>
              🔒 Secured by MedVet Pay • 256-bit SSL Encrypted
            </div>
          </>
        )}

        {/* ── Processing ── */}
        {step === 'processing' && (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div style={{
              width: '80px', height: '80px', margin: '0 auto 24px',
              borderRadius: '50%', border: '4px solid #e2e8f0',
              borderTopColor: '#6366f1', animation: 'spin 1s linear infinite',
            }} />
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
              Processing Payment...
            </h3>
            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '24px' }}>
              Please don&apos;t close this window
            </p>
            <div style={{
              width: '100%', height: '8px', background: '#e2e8f0',
              borderRadius: '999px', overflow: 'hidden',
            }}>
              <div style={{
                height: '100%', borderRadius: '999px',
                background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
                width: `${Math.min(progress, 100)}%`,
                transition: 'width 0.3s ease-out',
              }} />
            </div>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '8px' }}>
              {progress < 30 ? 'Connecting to payment gateway...' :
               progress < 60 ? 'Verifying payment details...' :
               progress < 90 ? 'Processing transaction...' : 'Finalizing...'}
            </div>
          </div>
        )}

        {/* ── Success ── */}
        {step === 'success' && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{
              width: '80px', height: '80px', margin: '0 auto 20px',
              borderRadius: '50%', background: 'linear-gradient(135deg, #22c55e, #10b981)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '36px', animation: 'scaleIn 0.4s ease-out',
              boxShadow: '0 8px 25px rgba(34,197,94,0.3)',
            }}>✓</div>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
              Payment Successful!
            </h3>
            <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '20px' }}>
              ₹{amount} paid via {methods.find(m => m.id === method)?.label}
            </p>

            <div style={{
              background: '#f0fdf4', borderRadius: '14px', padding: '16px',
              marginBottom: '20px', border: '1px solid #bbf7d0', textAlign: 'left',
            }}>
              <div style={{ fontSize: '11px', color: '#15803d', fontWeight: 600, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Transaction Receipt
              </div>
              {[
                { label: 'Transaction ID', value: txnId },
                { label: 'Amount', value: `₹${amount}` },
                { label: 'Method', value: methods.find(m => m.id === method)?.label },
                { label: 'Date', value: new Date().toLocaleDateString('en-IN') },
                { label: 'Time', value: new Date().toLocaleTimeString('en-IN') },
                { label: 'Status', value: '✅ Confirmed' },
              ].map((item, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between',
                  padding: '4px 0', fontSize: '12px',
                }}>
                  <span style={{ color: '#64748b' }}>{item.label}</span>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>{item.value}</span>
                </div>
              ))}
            </div>

            <button
              onClick={handleDone}
              style={{
                width: '100%', padding: '14px', borderRadius: '14px',
                background: 'linear-gradient(135deg, #22c55e, #10b981)',
                color: 'white', fontWeight: 700, fontSize: '15px',
                border: 'none', cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(34,197,94,0.3)',
              }}
            >
              Continue →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
