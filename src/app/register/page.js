'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('');
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', password: '', confirmPassword: '',
    city: '', gender: '', age: '',
    // Doctor specific
    specialization: '', qualification: '', experience: '', hospital: '', type: '', license: '',
    // Pet info
    petName: '', petType: '', petBreed: '',
  });
  const router = useRouter();

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In prototype, just redirect to login
    router.push('/login');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 40%, #312e81 70%, #1e293b 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '40px', position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position:'absolute', top:'-10%', right:'-5%', width:'500px', height:'500px', borderRadius:'50%', background:'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)', animation:'float 6s ease-in-out infinite' }}></div>
      <div style={{ position:'absolute', bottom:'-10%', left:'-5%', width:'400px', height:'400px', borderRadius:'50%', background:'radial-gradient(circle, rgba(20,184,166,0.08) 0%, transparent 70%)', animation:'float 8s ease-in-out infinite reverse' }}></div>

      <div style={{
        width: '100%', maxWidth: '640px',
        background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '24px', padding: '40px', backdropFilter: 'blur(20px)',
        position: 'relative', zIndex: 1, animation: 'fadeIn 0.5s ease-out',
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px', textDecoration: 'none', color: 'white' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🏥</div>
          <span style={{ fontWeight: 800, fontSize: '18px' }}>MedVet</span>
        </Link>

        {/* Progress Steps */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px' }}>
          {[1, 2, 3].map(s => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%',
                background: step >= s ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'rgba(255,255,255,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '13px', fontWeight: 700, color: step >= s ? 'white' : '#64748b',
                transition: 'all 0.3s', flexShrink: 0,
              }}>{step > s ? '✓' : s}</div>
              {s < 3 && <div style={{ flex: 1, height: '2px', background: step > s ? '#6366f1' : 'rgba(255,255,255,0.1)', transition: 'background 0.3s' }}></div>}
            </div>
          ))}
        </div>

        {/* Step 1: Choose Role */}
        {step === 1 && (
          <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'white', marginBottom: '8px' }}>Create Account</h2>
            <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '28px' }}>Choose how you want to use MedVet</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '24px' }}>
              {[
                { value: 'patient', icon: '👤', label: 'Patient', desc: 'Book appointments & manage health' },
                { value: 'doctor', icon: '👨‍⚕️', label: 'Doctor', desc: 'Manage practice & patients' },
                { value: 'pet_parent', icon: '🐾', label: 'Pet Parent', desc: 'Veterinary care for your pets' },
              ].map(r => (
                <button key={r.value} onClick={() => setRole(r.value)}
                  style={{
                    padding: '24px 16px', borderRadius: '16px',
                    background: role === r.value ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.04)',
                    border: `2px solid ${role === r.value ? 'rgba(99,102,241,0.5)' : 'rgba(255,255,255,0.08)'}`,
                    color: 'white', cursor: 'pointer', textAlign: 'center',
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>{r.icon}</div>
                  <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '4px' }}>{r.label}</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>{r.desc}</div>
                </button>
              ))}
            </div>
            <button onClick={() => role && setStep(2)} disabled={!role}
              style={{
                width: '100%', padding: '14px', borderRadius: '12px',
                background: role ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'rgba(255,255,255,0.08)',
                color: role ? 'white' : '#64748b', fontWeight: 700, fontSize: '15px',
                cursor: role ? 'pointer' : 'not-allowed', border: 'none',
                boxShadow: role ? '0 8px 25px rgba(99,102,241,0.4)' : 'none',
                transition: 'all 0.3s',
              }}
            >Continue →</button>
          </div>
        )}

        {/* Step 2: Basic Information */}
        {step === 2 && (
          <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'white', marginBottom: '8px' }}>Personal Information</h2>
            <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '28px' }}>Tell us about yourself</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {[
                { label: 'Full Name', field: 'name', type: 'text', placeholder: 'John Doe', icon: '👤', full: false },
                { label: 'Email', field: 'email', type: 'email', placeholder: 'you@email.com', icon: '📧', full: false },
                { label: 'Phone Number', field: 'phone', type: 'tel', placeholder: '+91 98765 43210', icon: '📱', full: false },
                { label: 'City', field: 'city', type: 'text', placeholder: 'Mumbai', icon: '🏙️', full: false },
                { label: 'Password', field: 'password', type: 'password', placeholder: '••••••••', icon: '🔒', full: false },
                { label: 'Confirm Password', field: 'confirmPassword', type: 'password', placeholder: '••••••••', icon: '🔒', full: false },
              ].map(f => (
                <div key={f.field} style={{ gridColumn: f.full ? '1 / -1' : 'auto' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#94a3b8', marginBottom: '6px' }}>{f.label}</label>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    background: 'rgba(255,255,255,0.06)', border: '2px solid rgba(255,255,255,0.1)',
                    borderRadius: '10px', padding: '0 12px',
                  }}>
                    <span style={{ fontSize: '14px' }}>{f.icon}</span>
                    <input type={f.type} value={formData[f.field]} onChange={e => updateField(f.field, e.target.value)}
                      placeholder={f.placeholder}
                      style={{ flex: 1, padding: '12px 0', background: 'none', border: 'none', color: 'white', fontSize: '14px', outline: 'none' }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button onClick={() => setStep(1)} style={{
                flex: 1, padding: '14px', borderRadius: '12px',
                background: 'rgba(255,255,255,0.08)', color: '#94a3b8',
                fontWeight: 600, fontSize: '15px', cursor: 'pointer', border: 'none',
              }}>← Back</button>
              <button onClick={() => setStep(3)} style={{
                flex: 2, padding: '14px', borderRadius: '12px',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: 'white', fontWeight: 700, fontSize: '15px',
                cursor: 'pointer', border: 'none',
                boxShadow: '0 8px 25px rgba(99,102,241,0.4)',
              }}>Continue →</button>
            </div>
          </div>
        )}

        {/* Step 3: Role-specific info */}
        {step === 3 && (
          <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'white', marginBottom: '8px' }}>
              {role === 'doctor' ? 'Professional Details' : 'Additional Information'}
            </h2>
            <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '28px' }}>
              {role === 'doctor' ? 'Help patients find you' : 'Almost done! Just a few more details'}
            </p>

            {role === 'doctor' ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {[
                  { label: 'Specialization', field: 'specialization', placeholder: 'e.g. Cardiologist' },
                  { label: 'Qualification', field: 'qualification', placeholder: 'e.g. MBBS, MD' },
                  { label: 'Experience (years)', field: 'experience', placeholder: 'e.g. 10' },
                  { label: 'Hospital/Clinic', field: 'hospital', placeholder: 'e.g. Apollo Hospital' },
                  { label: 'License Number', field: 'license', placeholder: 'MCI/VCI Number' },
                ].map(f => (
                  <div key={f.field}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#94a3b8', marginBottom: '6px' }}>{f.label}</label>
                    <input type="text" value={formData[f.field]} onChange={e => updateField(f.field, e.target.value)}
                      placeholder={f.placeholder}
                      style={{
                        width: '100%', padding: '12px 14px', borderRadius: '10px',
                        background: 'rgba(255,255,255,0.06)', border: '2px solid rgba(255,255,255,0.1)',
                        color: 'white', fontSize: '14px', outline: 'none',
                      }}
                    />
                  </div>
                ))}
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#94a3b8', marginBottom: '6px' }}>Practice Type</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {['Human Medicine', 'Veterinary'].map(t => (
                      <button key={t} onClick={() => updateField('type', t.toLowerCase().replace(' ', '_'))}
                        style={{
                          flex: 1, padding: '12px', borderRadius: '10px',
                          background: formData.type === t.toLowerCase().replace(' ', '_') ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.04)',
                          border: `2px solid ${formData.type === t.toLowerCase().replace(' ', '_') ? 'rgba(99,102,241,0.5)' : 'rgba(255,255,255,0.08)'}`,
                          color: 'white', fontSize: '13px', fontWeight: 500, cursor: 'pointer',
                        }}
                      >{t}</button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#94a3b8', marginBottom: '6px' }}>Gender</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {['Male', 'Female', 'Other'].map(g => (
                      <button key={g} onClick={() => updateField('gender', g)}
                        style={{
                          flex: 1, padding: '10px', borderRadius: '10px',
                          background: formData.gender === g ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.04)',
                          border: `2px solid ${formData.gender === g ? 'rgba(99,102,241,0.5)' : 'rgba(255,255,255,0.08)'}`,
                          color: 'white', fontSize: '13px', cursor: 'pointer',
                        }}
                      >{g}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#94a3b8', marginBottom: '6px' }}>Age</label>
                  <input type="number" value={formData.age} onChange={e => updateField('age', e.target.value)}
                    placeholder="25"
                    style={{
                      width: '100%', padding: '12px 14px', borderRadius: '10px',
                      background: 'rgba(255,255,255,0.06)', border: '2px solid rgba(255,255,255,0.1)',
                      color: 'white', fontSize: '14px', outline: 'none',
                    }}
                  />
                </div>
                {(role === 'pet_parent') && (
                  <>
                    <div style={{ gridColumn: '1 / -1', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px', marginTop: '4px' }}>
                      <div style={{ fontSize: '15px', fontWeight: 700, color: 'white', marginBottom: '4px' }}>🐾 Pet Information</div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>Add your first pet (you can add more later)</div>
                    </div>
                    {[
                      { label: 'Pet Name', field: 'petName', placeholder: 'e.g. Bruno' },
                      { label: 'Pet Breed', field: 'petBreed', placeholder: 'e.g. Golden Retriever' },
                    ].map(f => (
                      <div key={f.field}>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#94a3b8', marginBottom: '6px' }}>{f.label}</label>
                        <input type="text" value={formData[f.field]} onChange={e => updateField(f.field, e.target.value)}
                          placeholder={f.placeholder}
                          style={{
                            width: '100%', padding: '12px 14px', borderRadius: '10px',
                            background: 'rgba(255,255,255,0.06)', border: '2px solid rgba(255,255,255,0.1)',
                            color: 'white', fontSize: '14px', outline: 'none',
                          }}
                        />
                      </div>
                    ))}
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#94a3b8', marginBottom: '6px' }}>Pet Type</label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {['🐕 Dog', '🐈 Cat', '🐦 Bird', '🐰 Other'].map(t => (
                          <button key={t} onClick={() => updateField('petType', t)}
                            style={{
                              flex: 1, padding: '10px 6px', borderRadius: '10px',
                              background: formData.petType === t ? 'rgba(20,184,166,0.2)' : 'rgba(255,255,255,0.04)',
                              border: `2px solid ${formData.petType === t ? 'rgba(20,184,166,0.5)' : 'rgba(255,255,255,0.08)'}`,
                              color: 'white', fontSize: '12px', cursor: 'pointer',
                            }}
                          >{t}</button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            <div style={{ marginTop: '24px' }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', marginBottom: '20px' }}>
                <input type="checkbox" style={{ accentColor: '#6366f1', marginTop: '2px' }} />
                <span style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.5 }}>
                  I agree to MedVet&apos;s <a href="#" style={{ color: '#818cf8' }}>Terms of Service</a> and <a href="#" style={{ color: '#818cf8' }}>Privacy Policy</a>. I understand that my data will be handled in accordance with HIPAA and Indian data protection regulations.
                </span>
              </label>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setStep(2)} style={{
                flex: 1, padding: '14px', borderRadius: '12px',
                background: 'rgba(255,255,255,0.08)', color: '#94a3b8',
                fontWeight: 600, fontSize: '15px', cursor: 'pointer', border: 'none',
              }}>← Back</button>
              <button onClick={handleSubmit} style={{
                flex: 2, padding: '14px', borderRadius: '12px',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: 'white', fontWeight: 700, fontSize: '15px',
                cursor: 'pointer', border: 'none',
                boxShadow: '0 8px 25px rgba(99,102,241,0.4)',
              }}>Create Account ✨</button>
            </div>
          </div>
        )}

        <p style={{ textAlign: 'center', fontSize: '13px', color: '#64748b', marginTop: '24px' }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: '#818cf8', fontWeight: 600, textDecoration: 'none' }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
}
