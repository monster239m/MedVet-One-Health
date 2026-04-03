'use client';
import { useState, useRef, useEffect } from 'react';

export default function OTPVerification({
  mode = 'display', // 'display' (patient sees OTP) or 'input' (doctor enters OTP)
  otp = '',
  otpExpiry = null,
  onVerify,
  onResend,
}) {
  const [inputValues, setInputValues] = useState(['', '', '', '', '', '']);
  const [status, setStatus] = useState('idle'); // idle, verifying, success, error
  const [timeLeft, setTimeLeft] = useState(0);
  const inputRefs = useRef([]);

  // Countdown timer
  useEffect(() => {
    if (otpExpiry) {
      const update = () => {
        const remaining = Math.max(0, Math.floor((otpExpiry - Date.now()) / 1000));
        setTimeLeft(remaining);
      };
      update();
      const interval = setInterval(update, 1000);
      return () => clearInterval(interval);
    }
  }, [otpExpiry]);

  const handleInputChange = (index, value) => {
    if (value.length > 1) value = value.slice(-1);
    if (!/^\d*$/.test(value)) return;

    const newValues = [...inputValues];
    newValues[index] = value;
    setInputValues(newValues);
    setStatus('idle');

    // Auto-focus next
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-verify when all filled
    if (newValues.every(v => v) && newValues.join('').length === 6) {
      const enteredOTP = newValues.join('');
      setStatus('verifying');
      setTimeout(() => {
        if (onVerify) {
          const result = onVerify(enteredOTP);
          setStatus(result ? 'success' : 'error');
          if (!result) {
            setTimeout(() => {
              setInputValues(['', '', '', '', '', '']);
              inputRefs.current[0]?.focus();
            }, 1500);
          }
        }
      }, 800);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !inputValues[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newValues = [...inputValues];
    for (let i = 0; i < pasted.length; i++) {
      newValues[i] = pasted[i];
    }
    setInputValues(newValues);
    if (pasted.length === 6) {
      setStatus('verifying');
      setTimeout(() => {
        if (onVerify) {
          const result = onVerify(pasted);
          setStatus(result ? 'success' : 'error');
        }
      }, 800);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const statusColor = status === 'success' ? '#22c55e' : status === 'error' ? '#ef4444' : '#6366f1';

  return (
    <div style={{
      background: 'white', borderRadius: '20px', padding: '32px',
      border: '1px solid #e2e8f0', maxWidth: '420px', margin: '0 auto',
      boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <div style={{
          width: '64px', height: '64px', borderRadius: '18px',
          background: mode === 'display'
            ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
            : 'linear-gradient(135deg, #14b8a6, #06b6d4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '28px', margin: '0 auto 14px',
          boxShadow: `0 8px 20px ${mode === 'display' ? 'rgba(99,102,241,0.3)' : 'rgba(20,184,166,0.3)'}`,
        }}>
          {mode === 'display' ? '🔑' : '🔐'}
        </div>
        <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
          {mode === 'display' ? 'Your Verification OTP' : 'Enter Patient OTP'}
        </h3>
        <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.5 }}>
          {mode === 'display'
            ? 'Share this code with your doctor to verify treatment completion'
            : 'Ask the patient for their 6-digit verification code'}
        </p>
      </div>

      {/* Display Mode — Show OTP digits */}
      {mode === 'display' && (
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '20px' }}>
          {otp.split('').map((digit, i) => (
            <div key={i} style={{
              width: '50px', height: '60px', borderRadius: '14px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '24px', fontWeight: 900, color: 'white',
              boxShadow: '0 4px 12px rgba(99,102,241,0.3)',
              animation: `scaleIn 0.3s ease-out ${i * 0.08}s both`,
            }}>
              {digit}
            </div>
          ))}
        </div>
      )}

      {/* Input Mode — OTP input boxes */}
      {mode === 'input' && (
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '20px' }}>
          {inputValues.map((val, i) => (
            <input
              key={i}
              ref={el => inputRefs.current[i] = el}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={val}
              onChange={e => handleInputChange(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)}
              onPaste={i === 0 ? handlePaste : undefined}
              style={{
                width: '50px', height: '60px', borderRadius: '14px',
                border: `2px solid ${val ? statusColor : '#e2e8f0'}`,
                background: val ? `${statusColor}08` : '#f8fafc',
                fontSize: '24px', fontWeight: 900, color: '#0f172a',
                textAlign: 'center', outline: 'none',
                transition: 'all 0.2s',
                boxShadow: val ? `0 0 0 3px ${statusColor}15` : 'none',
              }}
            />
          ))}
        </div>
      )}

      {/* Status */}
      {status === 'verifying' && (
        <div style={{
          textAlign: 'center', padding: '12px', borderRadius: '12px',
          background: '#eef2ff', color: '#6366f1', fontSize: '13px',
          fontWeight: 600, marginBottom: '16px',
          animation: 'pulse 1s ease-in-out infinite',
        }}>
          🔄 Verifying OTP...
        </div>
      )}
      {status === 'success' && (
        <div style={{
          textAlign: 'center', padding: '12px', borderRadius: '12px',
          background: '#f0fdf4', color: '#15803d', fontSize: '13px',
          fontWeight: 600, marginBottom: '16px',
          animation: 'scaleIn 0.3s ease-out',
        }}>
          ✅ OTP Verified Successfully!
        </div>
      )}
      {status === 'error' && (
        <div style={{
          textAlign: 'center', padding: '12px', borderRadius: '12px',
          background: '#fef2f2', color: '#dc2626', fontSize: '13px',
          fontWeight: 600, marginBottom: '16px',
          animation: 'scaleIn 0.3s ease-out',
        }}>
          ❌ Invalid OTP. Please try again.
        </div>
      )}

      {/* Timer */}
      {otpExpiry && timeLeft > 0 && (
        <div style={{ textAlign: 'center', fontSize: '13px', color: timeLeft < 60 ? '#ef4444' : '#64748b' }}>
          ⏱ OTP expires in <span style={{ fontWeight: 700 }}>{formatTime(timeLeft)}</span>
        </div>
      )}
      {otpExpiry && timeLeft === 0 && (
        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '13px', color: '#ef4444' }}>OTP expired. </span>
          {onResend && (
            <button onClick={onResend} style={{
              fontSize: '13px', color: '#6366f1', fontWeight: 600,
              background: 'none', border: 'none', cursor: 'pointer',
              textDecoration: 'underline',
            }}>Resend OTP</button>
          )}
        </div>
      )}

      {/* Security note */}
      <div style={{
        textAlign: 'center', marginTop: '16px', fontSize: '11px',
        color: '#94a3b8', display: 'flex', alignItems: 'center',
        justifyContent: 'center', gap: '4px',
      }}>
        🔒 OTP is encrypted and valid for one-time use only
      </div>
    </div>
  );
}
