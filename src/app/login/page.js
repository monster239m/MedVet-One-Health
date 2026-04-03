'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { login, getDashboardPath } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const result = await login(email, password);
    if (result.success) {
      router.push(getDashboardPath(result.user.role));
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const quickLogin = (email, password) => {
    setEmail(email);
    setPassword(password);
  };

  return (
    <div className="login-container">
      {/* Background orbs */}
      <div style={{ position:'absolute', top:'-10%', right:'-5%', width:'500px', height:'500px', borderRadius:'50%', background:'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)', animation:'float 6s ease-in-out infinite' }}></div>
      <div style={{ position:'absolute', bottom:'-10%', left:'-5%', width:'400px', height:'400px', borderRadius:'50%', background:'radial-gradient(circle, rgba(20,184,166,0.1) 0%, transparent 70%)', animation:'float 8s ease-in-out infinite reverse' }}></div>

      {/* Left Panel - Branding */}
      <div className="login-left-panel">
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '48px', textDecoration: 'none', color: 'white' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>🏥</div>
          <div>
            <span style={{ fontWeight: 800, fontSize: '24px' }}>MedVet</span>
            <span style={{ fontSize: '12px', color: '#6366f1', marginLeft: '6px', fontWeight: 600 }}>ONE-HEALTH</span>
          </div>
        </Link>

        <h1 style={{ fontSize: '44px', fontWeight: 900, lineHeight: 1.15, letterSpacing: '-0.03em', marginBottom: '20px' }}>
          Welcome back to{' '}
          <span style={{ background: 'linear-gradient(135deg, #a5b4fc, #14b8a6)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            better healthcare
          </span>
        </h1>
        <p style={{ fontSize: '17px', color: '#94a3b8', lineHeight: 1.7, maxWidth: '440px', marginBottom: '40px' }}>
          Access your health dashboard, manage appointments, and connect with doctors — for you and your pets.
        </p>

        {/* Feature highlights */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[
            { icon: '🔒', text: 'Bank-grade security for your health data' },
            { icon: '⚡', text: 'Instant access to 500+ verified doctors' },
            { icon: '🐾', text: 'Human & veterinary care in one place' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '10px',
                background: 'rgba(255,255,255,0.08)', display: 'flex',
                alignItems: 'center', justifyContent: 'center', fontSize: '16px',
              }}>{item.icon}</div>
              <span style={{ fontSize: '14px', color: '#cbd5e1' }}>{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="login-right-panel">
        <div style={{
          width: '100%', maxWidth: '420px',
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '24px', padding: '40px',
          backdropFilter: 'blur(20px)',
          animation: 'fadeIn 0.5s ease-out',
        }}>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'white', marginBottom: '4px' }}>Sign In</h2>
          <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '28px' }}>Enter your credentials to access your account</p>

          {error && (
            <div style={{
              padding: '12px 16px', borderRadius: '12px',
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
              color: '#fca5a5', fontSize: '13px', marginBottom: '20px',
              display: 'flex', alignItems: 'center', gap: '8px',
            }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#94a3b8', marginBottom: '6px' }}>Email Address</label>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                background: 'rgba(255,255,255,0.06)', border: '2px solid rgba(255,255,255,0.1)',
                borderRadius: '12px', padding: '0 14px', transition: 'border-color 0.2s',
              }}>
                <span style={{ color: '#64748b', fontSize: '16px' }}>📧</span>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  style={{
                    flex: 1, padding: '14px 0', background: 'none', border: 'none',
                    color: 'white', fontSize: '15px', outline: 'none',
                  }}
                  required
                />
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#94a3b8', marginBottom: '6px' }}>Password</label>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                background: 'rgba(255,255,255,0.06)', border: '2px solid rgba(255,255,255,0.1)',
                borderRadius: '12px', padding: '0 14px', transition: 'border-color 0.2s',
              }}>
                <span style={{ color: '#64748b', fontSize: '16px' }}>🔒</span>
                <input type={showPassword ? 'text' : 'password'} value={password}
                  onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                  style={{
                    flex: 1, padding: '14px 0', background: 'none', border: 'none',
                    color: 'white', fontSize: '15px', outline: 'none',
                  }}
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ color: '#64748b', cursor: 'pointer', fontSize: '14px', background: 'none', border: 'none' }}>
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input type="checkbox" style={{ accentColor: '#6366f1' }} />
                <span style={{ fontSize: '13px', color: '#94a3b8' }}>Remember me</span>
              </label>
              <a href="#" style={{ fontSize: '13px', color: '#818cf8', textDecoration: 'none', fontWeight: 500 }}>Forgot password?</a>
            </div>

            <button type="submit" disabled={loading}
              style={{
                width: '100%', padding: '14px', borderRadius: '12px',
                background: loading ? '#4f46e5' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: 'white', fontWeight: 700, fontSize: '15px',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 8px 25px rgba(99,102,241,0.4)',
                transition: 'all 0.3s', border: 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              }}
            >
              {loading ? (
                <>
                  <span style={{ width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }}></span>
                  Signing in...
                </>
              ) : 'Sign In →'}
            </button>
          </form>

          <div style={{ margin: '24px 0', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>QUICK LOGIN</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
          </div>

          {/* Demo accounts */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { label: '👤 Patient Demo', email: 'rahul@demo.com', pass: 'demo123', color: '#6366f1' },
              { label: '👨‍⚕️ Doctor Demo', email: 'arun@demo.com', pass: 'demo123', color: '#14b8a6' },
              { label: '🔑 Admin Demo', email: 'admin@medvet.com', pass: 'admin123', color: '#f43f5e' },
            ].map((item, i) => (
              <button key={i} onClick={() => quickLogin(item.email, item.pass)}
                style={{
                  width: '100%', padding: '10px 16px', borderRadius: '10px',
                  background: `${item.color}15`, border: `1px solid ${item.color}30`,
                  color: item.color, fontSize: '13px', fontWeight: 500,
                  cursor: 'pointer', display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between', transition: 'all 0.2s',
                }}
                onMouseOver={e => { e.currentTarget.style.background = `${item.color}25`; }}
                onMouseOut={e => { e.currentTarget.style.background = `${item.color}15`; }}
              >
                <span>{item.label}</span>
                <span style={{ fontSize: '11px', opacity: 0.7 }}>{item.email}</span>
              </button>
            ))}
          </div>

          <p style={{ textAlign: 'center', fontSize: '13px', color: '#64748b', marginTop: '24px' }}>
            Don&apos;t have an account?{' '}
            <Link href="/register" style={{ color: '#818cf8', fontWeight: 600, textDecoration: 'none' }}>Create Account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
