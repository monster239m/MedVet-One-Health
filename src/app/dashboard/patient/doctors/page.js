'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { MOCK_USERS } from '@/data/mockData';

const sidebarItems = [
  { label: 'Main', items: [
    { icon: '📊', label: 'Dashboard', href: '/dashboard/patient' },
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
    { icon: '📊', label: 'Queue Status', href: '/dashboard/patient/queue' },
    { icon: '📦', label: 'Orders', href: '/dashboard/patient/orders', badge: '2' },
    { icon: '💬', label: 'Messages', href: '/dashboard/patient/messages', badge: '3', badgeColor: 'rgba(239,68,68,0.4)' },
    { icon: '⚙️', label: 'Settings', href: '/dashboard/patient/settings' },
  ]},
];

export default function FindDoctorsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterSpecialty, setFilterSpecialty] = useState('all');
  const [filterCity, setFilterCity] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [showBookModal, setShowBookModal] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [bookingType, setBookingType] = useState('video');

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  if (loading || !user) return null;

  let doctors = [...MOCK_USERS.doctors];

  if (search) {
    const s = search.toLowerCase();
    doctors = doctors.filter(d => d.name.toLowerCase().includes(s) || d.specialization.toLowerCase().includes(s) || d.hospital.toLowerCase().includes(s));
  }
  if (filterType !== 'all') doctors = doctors.filter(d => d.type === filterType);
  if (filterSpecialty !== 'all') doctors = doctors.filter(d => d.specialization === filterSpecialty);
  if (filterCity !== 'all') doctors = doctors.filter(d => d.city === filterCity);

  if (sortBy === 'rating') doctors.sort((a, b) => b.rating - a.rating);
  else if (sortBy === 'experience') doctors.sort((a, b) => b.experience - a.experience);
  else if (sortBy === 'fee-low') doctors.sort((a, b) => a.consultationFee - b.consultationFee);
  else if (sortBy === 'fee-high') doctors.sort((a, b) => b.consultationFee - a.consultationFee);

  const specialties = [...new Set(MOCK_USERS.doctors.map(d => d.specialization))];
  const cities = [...new Set(MOCK_USERS.doctors.map(d => d.city))];

  return (
    <DashboardLayout sidebarItems={sidebarItems}>
      {/* Header */}
      <div style={{ marginBottom: '28px', animation: 'fadeIn 0.5s ease-out' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>Find Doctors 🔍</h1>
        <p style={{ fontSize: '15px', color: '#64748b' }}>Browse and book appointments with our verified healthcare professionals</p>
      </div>

      {/* Search & Filters */}
      <div style={{
        background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0',
        padding: '20px', marginBottom: '24px',
      }}>
        {/* Search Bar */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          background: '#f8fafc', borderRadius: '12px', padding: '10px 16px',
          border: '2px solid #e2e8f0', marginBottom: '16px',
        }}>
          <span style={{ fontSize: '18px' }}>🔍</span>
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by doctor name, specialty, or hospital..."
            style={{ flex: 1, background: 'none', border: 'none', fontSize: '15px', color: '#0f172a', outline: 'none' }}
          />
          {search && (
            <button onClick={() => setSearch('')} style={{ color: '#94a3b8', cursor: 'pointer', fontSize: '16px', background: 'none', border: 'none' }}>✕</button>
          )}
        </div>

        {/* Filter Row */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '6px' }}>
            {[
              { value: 'all', label: '🏥 All' },
              { value: 'human', label: '👤 Human' },
              { value: 'veterinary', label: '🐾 Veterinary' },
            ].map(t => (
              <button key={t.value} onClick={() => setFilterType(t.value)}
                style={{
                  padding: '6px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 500,
                  background: filterType === t.value ? '#6366f1' : '#f1f5f9',
                  color: filterType === t.value ? 'white' : '#64748b',
                  border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                }}>{t.label}</button>
            ))}
          </div>

          <select value={filterSpecialty} onChange={e => setFilterSpecialty(e.target.value)}
            style={{
              padding: '6px 30px 6px 12px', borderRadius: '8px', fontSize: '13px',
              background: '#f1f5f9', border: '1px solid #e2e8f0', color: '#334155',
              cursor: 'pointer', appearance: 'none',
              backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")",
              backgroundPosition: 'right 6px center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em',
            }}>
            <option value="all">All Specialties</option>
            {specialties.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <select value={filterCity} onChange={e => setFilterCity(e.target.value)}
            style={{
              padding: '6px 30px 6px 12px', borderRadius: '8px', fontSize: '13px',
              background: '#f1f5f9', border: '1px solid #e2e8f0', color: '#334155',
              cursor: 'pointer', appearance: 'none',
              backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")",
              backgroundPosition: 'right 6px center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em',
            }}>
            <option value="all">All Cities</option>
            {cities.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', color: '#64748b' }}>Sort:</span>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}
              style={{
                padding: '6px 30px 6px 12px', borderRadius: '8px', fontSize: '13px',
                background: '#f1f5f9', border: '1px solid #e2e8f0', color: '#334155',
                cursor: 'pointer', appearance: 'none',
                backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")",
                backgroundPosition: 'right 6px center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em',
              }}>
              <option value="rating">Top Rated</option>
              <option value="experience">Most Experienced</option>
              <option value="fee-low">Fee: Low to High</option>
              <option value="fee-high">Fee: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div style={{ marginBottom: '16px', fontSize: '14px', color: '#64748b' }}>
        Showing <strong style={{ color: '#0f172a' }}>{doctors.length}</strong> doctors
      </div>

      {/* Doctor Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {doctors.map((doc, i) => (
          <div key={doc.id} style={{
            background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0',
            padding: '24px', transition: 'all 0.3s', cursor: 'default',
            animation: `fadeInUp 0.5s ease-out ${i * 0.1}s both`,
          }}
          onMouseOver={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='0 12px 30px rgba(0,0,0,0.08)'; }}
          onMouseOut={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none'; }}
          >
            <div style={{ display: 'flex', gap: '16px' }}>
              {/* Avatar */}
              <div style={{
                width: '72px', height: '72px', borderRadius: '16px',
                background: doc.type === 'veterinary' ? 'linear-gradient(135deg, #14b8a6, #06b6d4)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontWeight: 800, fontSize: '22px', flexShrink: 0,
                position: 'relative',
              }}>
                {doc.initials}
                {doc.isVerified && (
                  <div style={{
                    position: 'absolute', bottom: '-2px', right: '-2px',
                    width: '20px', height: '20px', borderRadius: '50%',
                    background: '#22c55e', border: '2px solid white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '10px',
                  }}>✓</div>
                )}
              </div>

              {/* Info */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '2px' }}>{doc.name}</div>
                    <div style={{ fontSize: '13px', color: '#6366f1', fontWeight: 500 }}>{doc.specialization}</div>
                  </div>
                  <span style={{
                    padding: '3px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 600,
                    background: doc.type === 'veterinary' ? '#ccfbf1' : '#e0e7ff',
                    color: doc.type === 'veterinary' ? '#0d9488' : '#4338ca',
                  }}>{doc.type === 'veterinary' ? '🐾 Vet' : '👤 Human'}</span>
                </div>

                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                  {doc.qualification} • {doc.experience} yrs exp
                </div>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                  🏥 {doc.hospital}
                </div>

                <div style={{ display: 'flex', gap: '16px', marginTop: '10px', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ color: '#fbbf24', fontSize: '14px' }}>★</span>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>{doc.rating}</span>
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>({doc.totalReviews})</span>
                  </div>
                  <div style={{ fontSize: '13px', color: '#64748b' }}>📍 {doc.city}</div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>₹{doc.consultationFee}</div>
                </div>

                <div style={{ display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap' }}>
                  {doc.languages.map(lang => (
                    <span key={lang} style={{
                      padding: '2px 8px', borderRadius: '999px', fontSize: '10px',
                      background: '#f1f5f9', color: '#64748b', fontWeight: 500,
                    }}>{lang}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginTop: '16px', paddingTop: '14px', borderTop: '1px solid #f1f5f9',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{
                  width: '8px', height: '8px', borderRadius: '50%',
                  background: doc.isOnline ? '#22c55e' : '#94a3b8',
                  boxShadow: doc.isOnline ? '0 0 6px rgba(34,197,94,0.5)' : 'none',
                }}></span>
                <span style={{ fontSize: '12px', color: doc.isOnline ? '#22c55e' : '#94a3b8', fontWeight: 500 }}>
                  {doc.isOnline ? `Available • Next: ${doc.nextAvailable}` : `Offline • ${doc.nextAvailable}`}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button style={{
                  padding: '8px 14px', borderRadius: '10px',
                  background: '#f1f5f9', border: '1px solid #e2e8f0',
                  fontSize: '12px', fontWeight: 600, color: '#334155',
                  cursor: 'pointer', transition: 'all 0.2s',
                }}>View Profile</button>
                <button onClick={() => setShowBookModal(doc)}
                  style={{
                    padding: '8px 18px', borderRadius: '10px',
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    color: 'white', fontSize: '12px', fontWeight: 600,
                    cursor: 'pointer', border: 'none',
                    boxShadow: '0 4px 12px rgba(99,102,241,0.3)',
                    transition: 'all 0.2s',
                  }}>Book Now →</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {showBookModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 300, animation: 'fadeIn 0.2s ease-out',
        }} onClick={() => setShowBookModal(null)}>
          <div style={{
            background: 'white', borderRadius: '20px', padding: '32px',
            maxWidth: '480px', width: '90%', animation: 'scaleIn 0.3s ease-out',
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>Book Appointment</h3>
              <button onClick={() => setShowBookModal(null)} style={{ fontSize: '20px', color: '#94a3b8', cursor: 'pointer', background: 'none', border: 'none' }}>✕</button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', borderRadius: '12px', background: '#f8fafc', marginBottom: '20px' }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '12px',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontWeight: 700, fontSize: '16px',
              }}>{showBookModal.initials}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '15px', color: '#0f172a' }}>{showBookModal.name}</div>
                <div style={{ fontSize: '13px', color: '#64748b' }}>{showBookModal.specialization} • ₹{showBookModal.consultationFee}</div>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Consultation Type</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[
                  { value: 'video', label: '📹 Video Call', desc: 'Online' },
                  { value: 'inperson', label: '🏥 In-Person', desc: 'Clinic' },
                ].map(t => (
                  <button key={t.value} onClick={() => setBookingType(t.value)}
                    style={{
                      flex: 1, padding: '12px', borderRadius: '10px',
                      background: bookingType === t.value ? 'rgba(99,102,241,0.1)' : '#f8fafc',
                      border: `2px solid ${bookingType === t.value ? '#6366f1' : '#e2e8f0'}`,
                      cursor: 'pointer', textAlign: 'center',
                    }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>{t.label}</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>{t.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Select Date</label>
              <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)}
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: '10px',
                  border: '2px solid #e2e8f0', fontSize: '14px', color: '#0f172a',
                  outline: 'none',
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Available Slots</label>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00'].map(time => (
                  <button key={time} onClick={() => setSelectedTime(time)}
                    style={{
                      padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 500,
                      background: selectedTime === time ? '#6366f1' : '#f1f5f9',
                      color: selectedTime === time ? 'white' : '#334155',
                      border: `1px solid ${selectedTime === time ? '#6366f1' : '#e2e8f0'}`,
                      cursor: 'pointer', transition: 'all 0.15s',
                    }}>{time}</button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', borderRadius: '12px', background: '#f8fafc', marginBottom: '20px' }}>
              <span style={{ fontSize: '14px', color: '#64748b' }}>Consultation Fee</span>
              <span style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>₹{showBookModal.consultationFee}</span>
            </div>

            <button onClick={() => { setShowBookModal(null); alert('Appointment booked successfully! (Prototype)'); }}
              style={{
                width: '100%', padding: '14px', borderRadius: '12px',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: 'white', fontWeight: 700, fontSize: '15px',
                cursor: 'pointer', border: 'none',
                boxShadow: '0 8px 25px rgba(99,102,241,0.4)',
              }}>Confirm & Pay ₹{showBookModal.consultationFee} →</button>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
