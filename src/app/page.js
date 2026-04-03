'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [statsVisible, setStatsVisible] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      if (window.scrollY > 400) setStatsVisible(true);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % 6);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    { icon: '🩺', title: 'Unified Healthcare', desc: 'One platform for human and veterinary care. Consult doctors for yourself and your pets.', color: '#6366f1' },
    { icon: '📹', title: 'Video Consultations', desc: 'HD video calls with certified doctors. Get expert advice from the comfort of your home.', color: '#14b8a6' },
    { icon: '💊', title: 'Medicine Delivery', desc: 'Order prescriptions online with doorstep delivery. Both human and veterinary medicines.', color: '#f59e0b' },
    { icon: '📋', title: 'Smart Queue System', desc: 'Real-time queue management. Know your wait time and position before you visit.', color: '#ef4444' },
    { icon: '🤖', title: 'AI Health Assistant', desc: 'Get instant health guidance from our AI chatbot. Available 24/7 for quick answers.', color: '#8b5cf6' },
    { icon: '📊', title: 'Health Records', desc: 'Digital health records for you and your pets. Access prescriptions and reports anytime.', color: '#06b6d4' },
  ];

  const stats = [
    { number: '50K+', label: 'Patients Served', icon: '👥' },
    { number: '500+', label: 'Verified Doctors', icon: '👨‍⚕️' },
    { number: '100+', label: 'Cities Covered', icon: '🏙️' },
    { number: '4.8⭐', label: 'Average Rating', icon: '⭐' },
  ];

  const testimonials = [
    { name: 'Ananya K.', role: 'Patient', text: 'MedVet made it so easy to manage both my health and my dog\'s health from one app. The video consultation was seamless!', rating: 5 },
    { name: 'Dr. Sanjay P.', role: 'Cardiologist', text: 'As a doctor, the platform helps me manage my patients efficiently. The queue system is a game-changer.', rating: 5 },
    { name: 'Meera R.', role: 'Pet Parent', text: 'Finding a good vet was always a struggle. MedVet connected me with Dr. Sneha who saved my cat\'s life!', rating: 5 },
  ];

  return (
    <div style={{ background: '#0f172a', color: 'white', minHeight: '100vh' }}>
      {/* Navbar */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        background: scrolled ? 'rgba(15,23,42,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.08)' : 'none',
        transition: 'all 0.3s',
        padding: '0 40px',
      }}>
        <div className="home-nav-container" style={{
          maxWidth: '1280px', margin: '0 auto',
        }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: 'white' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '12px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '20px',
            }}>🏥</div>
            <div>
              <span style={{ fontWeight: 800, fontSize: '20px', letterSpacing: '-0.02em' }}>MedVet</span>
              <span style={{ fontSize: '11px', color: '#6366f1', marginLeft: '6px', fontWeight: 600 }}>ONE-HEALTH</span>
            </div>
          </Link>
          
          <button className="mobile-menu-btn" onClick={() => setMobileMenu(!mobileMenu)}>
            ☰
          </button>

          <div className={`home-nav-links ${mobileMenu ? 'mobile-open' : ''}`}>
            {['Features', 'How it Works', 'Doctors', 'Pricing'].map(item => (
              <a key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`}
                style={{ color: '#94a3b8', fontSize: '14px', fontWeight: 500, textDecoration: 'none', transition: 'color 0.2s', ...(mobileMenu && { margin: '8px 0', fontSize: '16px' }) }}
                onClick={() => setMobileMenu(false)}
                onMouseOver={e => e.target.style.color='white'}
                onMouseOut={e => e.target.style.color='#94a3b8'}
              >{item}</a>
            ))}
            <Link href="/login" onClick={() => setMobileMenu(false)} style={{
              padding: '8px 20px', borderRadius: '10px', border: '1px solid rgba(99,102,241,0.5)',
              color: '#a5b4fc', fontSize: '14px', fontWeight: 600, textDecoration: 'none',
              transition: 'all 0.2s', ...(mobileMenu && { width: '100%', textAlign: 'center', marginTop: '12px' })
            }}>Sign In</Link>
            <Link href="/register" onClick={() => setMobileMenu(false)} style={{
              padding: '8px 20px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: 'white', fontSize: '14px', fontWeight: 600, textDecoration: 'none',
              boxShadow: '0 4px 15px rgba(99,102,241,0.4)',
              transition: 'all 0.2s', ...(mobileMenu && { width: '100%', textAlign: 'center', marginTop: '12px' })
            }}>Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        padding: '0 40px',
      }}>
        {/* Animated background orbs */}
        <div style={{
          position: 'absolute', top: '-20%', right: '-10%',
          width: '600px', height: '600px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
          animation: 'float 6s ease-in-out infinite',
        }}></div>
        <div style={{
          position: 'absolute', bottom: '-10%', left: '-5%',
          width: '400px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(20,184,166,0.1) 0%, transparent 70%)',
          animation: 'float 8s ease-in-out infinite reverse',
        }}></div>
        <div style={{
          position: 'absolute', top: '30%', left: '40%',
          width: '300px', height: '300px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)',
          animation: 'float 7s ease-in-out infinite 1s',
        }}></div>

        <div className="home-hero-grid" style={{ maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
          <div className="home-hero-content">
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '6px 16px', borderRadius: '999px',
              background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)',
              fontSize: '13px', color: '#a5b4fc', fontWeight: 500, marginBottom: '24px',
            }}>
              <span>✨</span> India&apos;s First One-Health Platform
            </div>
            <h1 style={{
              fontSize: '56px', fontWeight: 900, lineHeight: 1.1,
              letterSpacing: '-0.03em', marginBottom: '24px',
            }}>
              Healthcare for{' '}
              <span style={{
                background: 'linear-gradient(135deg, #6366f1, #a78bfa, #14b8a6)',
                WebkitBackgroundClip: 'text', backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                Everyone
              </span>
              <br />You & Your Pets 🐾
            </h1>
            <p style={{
              fontSize: '18px', color: '#94a3b8', lineHeight: 1.7,
              marginBottom: '36px', maxWidth: '520px',
            }}>
              Connect with certified doctors and veterinarians through video consultations,
              manage prescriptions, order medicines, and track your health — all in one unified platform.
            </p>
            <div style={{ display: 'flex', gap: '16px', marginBottom: '48px' }}>
              <Link href="/register" style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '14px 32px', borderRadius: '14px',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: 'white', fontWeight: 700, fontSize: '16px',
                boxShadow: '0 8px 30px rgba(99,102,241,0.4)',
                transition: 'all 0.3s', textDecoration: 'none',
              }}>
                Start Free Consultation →
              </Link>
              <Link href="/login" style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '14px 32px', borderRadius: '14px',
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)',
                color: 'white', fontWeight: 600, fontSize: '16px',
                transition: 'all 0.3s', textDecoration: 'none',
              }}>
                ▶ Watch Demo
              </Link>
            </div>

            {/* Trust badges */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <div style={{ display: 'flex' }}>
                {['RS', 'PP', 'AK', 'SR'].map((initials, i) => (
                  <div key={i} style={{
                    width: '36px', height: '36px', borderRadius: '50%',
                    background: `hsl(${240 + i * 30}, 70%, ${55 + i * 5}%)`,
                    border: '2px solid #0f172a',
                    marginLeft: i > 0 ? '-8px' : 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '11px', fontWeight: 700, zIndex: 4 - i,
                  }}>{initials}</div>
                ))}
              </div>
              <div>
                <div style={{ display: 'flex', gap: '2px', marginBottom: '2px' }}>
                  {[1,2,3,4,5].map(i => <span key={i} style={{ color: '#fbbf24', fontSize: '14px' }}>★</span>)}
                </div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Trusted by <strong style={{ color: '#94a3b8' }}>50,000+</strong> patients</div>
              </div>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="home-hero-visual">
            <div style={{
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '24px', padding: '32px', backdropFilter: 'blur(20px)',
            }}>
              {/* Mini dashboard preview */}
              <div style={{
                background: 'rgba(255,255,255,0.08)', borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden',
              }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }}></div>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }}></div>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#22c55e' }}></div>
                  <span style={{ marginLeft: '8px', fontSize: '12px', color: '#64748b' }}>MedVet Dashboard</span>
                </div>
                <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {[
                    { label: 'Appointments', value: '3', icon: '📅', color: '#6366f1' },
                    { label: 'Prescriptions', value: '5', icon: '💊', color: '#14b8a6' },
                    { label: 'Messages', value: '12', icon: '💬', color: '#f59e0b' },
                    { label: 'Health Score', value: '92%', icon: '❤️', color: '#ef4444' },
                  ].map((item, i) => (
                    <div key={i} style={{
                      padding: '16px', borderRadius: '12px',
                      background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                      animation: `fadeIn 0.5s ease-out ${0.5 + i * 0.15}s both`,
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '20px' }}>{item.icon}</span>
                        <span style={{ fontSize: '20px', fontWeight: 800, color: item.color }}>{item.value}</span>
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>{item.label}</div>
                    </div>
                  ))}
                </div>
                <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#14b8a6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>AM</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '12px', fontWeight: 600 }}>Dr. Arun Mehta</div>
                      <div style={{ fontSize: '10px', color: '#22c55e' }}>● Available Now</div>
                    </div>
                    <div style={{
                      padding: '4px 12px', borderRadius: '999px', fontSize: '11px',
                      background: 'rgba(99,102,241,0.2)', color: '#a5b4fc', fontWeight: 600,
                    }}>Consult</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating cards */}
            <div style={{
              position: 'absolute', top: '-20px', right: '-20px',
              padding: '12px 18px', borderRadius: '12px',
              background: 'rgba(20,184,166,0.15)', border: '1px solid rgba(20,184,166,0.3)',
              backdropFilter: 'blur(10px)', animation: 'float 4s ease-in-out infinite',
              fontSize: '13px',
            }}>
              🐾 Vet Available Now
            </div>
            <div style={{
              position: 'absolute', bottom: '-10px', left: '-30px',
              padding: '12px 18px', borderRadius: '12px',
              background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)',
              backdropFilter: 'blur(10px)', animation: 'float 5s ease-in-out infinite 1s',
              fontSize: '13px',
            }}>
              ✅ 4,200+ consultations today
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{
        padding: '80px 40px',
        background: 'linear-gradient(180deg, #0f172a, #1e1b4b)',
        position: 'relative',
      }}>
        <div className="home-stats-grid" style={{
          maxWidth: '1280px', margin: '0 auto',
        }}>
          {stats.map((stat, i) => (
            <div key={i} style={{
              textAlign: 'center', padding: '32px',
              background: 'rgba(255,255,255,0.05)', borderRadius: '20px',
              border: '1px solid rgba(255,255,255,0.08)',
              transition: 'all 0.3s', cursor: 'default',
              animation: statsVisible ? `fadeInUp 0.6s ease-out ${i * 0.15}s both` : 'none',
            }}
            onMouseOver={e => { e.currentTarget.style.transform='translateY(-8px)'; e.currentTarget.style.background='rgba(255,255,255,0.08)'; }}
            onMouseOut={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.background='rgba(255,255,255,0.05)'; }}
            >
              <div style={{ fontSize: '36px', marginBottom: '8px' }}>{stat.icon}</div>
              <div style={{
                fontSize: '36px', fontWeight: 900, marginBottom: '4px',
                background: 'linear-gradient(135deg, #a5b4fc, #14b8a6)',
                WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>{stat.number}</div>
              <div style={{ fontSize: '14px', color: '#94a3b8', fontWeight: 500 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={{ padding: '100px 40px', background: '#0f172a' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '6px 16px', borderRadius: '999px',
              background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)',
              fontSize: '13px', color: '#a5b4fc', fontWeight: 500, marginBottom: '16px',
            }}>🚀 Platform Features</div>
            <h2 style={{ fontSize: '42px', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '16px' }}>
              Everything You Need,{' '}
              <span style={{
                background: 'linear-gradient(135deg, #6366f1, #14b8a6)',
                WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>One Platform</span>
            </h2>
            <p style={{ fontSize: '18px', color: '#64748b', maxWidth: '600px', margin: '0 auto' }}>
              From consultations to medicine delivery, we&apos;ve got healthcare covered for your entire family — including the furry members.
            </p>
          </div>

          <div className="home-features-grid">
            {features.map((feature, i) => (
              <div key={i} style={{
                padding: '32px',
                borderRadius: '20px',
                background: activeFeature === i ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${activeFeature === i ? `${feature.color}40` : 'rgba(255,255,255,0.06)'}`,
                transition: 'all 0.4s',
                cursor: 'default',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseOver={e => { setActiveFeature(i); }}
              >
                {activeFeature === i && (
                  <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
                    background: `linear-gradient(90deg, ${feature.color}, ${feature.color}80)`,
                  }}></div>
                )}
                <div style={{
                  width: '56px', height: '56px', borderRadius: '14px',
                  background: `${feature.color}20`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '28px', marginBottom: '20px',
                }}>{feature.icon}</div>
                <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '10px' }}>{feature.title}</h3>
                <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.7 }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" style={{ padding: '100px 40px', background: 'linear-gradient(180deg, #0f172a, #1e1b4b)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '6px 16px', borderRadius: '999px',
              background: 'rgba(20,184,166,0.12)', border: '1px solid rgba(20,184,166,0.25)',
              fontSize: '13px', color: '#2dd4bf', fontWeight: 500, marginBottom: '16px',
            }}>📖 How It Works</div>
            <h2 style={{ fontSize: '42px', fontWeight: 800, letterSpacing: '-0.03em' }}>
              Get Started in <span style={{ color: '#14b8a6' }}>3 Simple Steps</span>
            </h2>
          </div>

          <div className="home-steps-grid">
            {/* Connecting Line */}
            <div className="connecting-line" style={{
              position: 'absolute', top: '48px', left: '20%', right: '20%',
              height: '2px', background: 'linear-gradient(90deg, #6366f1, #14b8a6, #f59e0b)',
              opacity: 0.3,
            }}></div>
            {[
              { step: '01', icon: '📝', title: 'Create Account', desc: 'Sign up in 30 seconds. Add your health profile and pet details to get personalized care recommendations.' },
              { step: '02', icon: '🔍', title: 'Find Your Doctor', desc: 'Browse our network of verified doctors and vets. Filter by specialization, rating, and availability.' },
              { step: '03', icon: '💬', title: 'Start Consultation', desc: 'Connect via video call or visit in-person. Get prescriptions, order medicines, and track your health.' },
            ].map((item, i) => (
              <div key={i} style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                <div style={{
                  width: '96px', height: '96px', borderRadius: '50%',
                  background: 'rgba(255,255,255,0.05)', border: '2px solid rgba(255,255,255,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 24px', fontSize: '40px',
                  position: 'relative',
                }}>
                  {item.icon}
                  <div style={{
                    position: 'absolute', top: '-4px', right: '-4px',
                    width: '28px', height: '28px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '12px', fontWeight: 800,
                  }}>{item.step}</div>
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '10px' }}>{item.title}</h3>
                <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.7, maxWidth: '280px', margin: '0 auto' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: '100px 40px', background: '#0f172a' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '6px 16px', borderRadius: '999px',
              background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.25)',
              fontSize: '13px', color: '#fbbf24', fontWeight: 500, marginBottom: '16px',
            }}>💬 Testimonials</div>
            <h2 style={{ fontSize: '42px', fontWeight: 800, letterSpacing: '-0.03em' }}>
              Loved by <span style={{ color: '#f59e0b' }}>Thousands</span>
            </h2>
          </div>

          <div className="home-testimonials-grid">
            {testimonials.map((t, i) => (
              <div key={i} style={{
                padding: '32px', borderRadius: '20px',
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                transition: 'all 0.3s',
              }}
              onMouseOver={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.borderColor='rgba(99,102,241,0.3)'; }}
              onMouseOut={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.08)'; }}
              >
                <div style={{ display: 'flex', gap: '2px', marginBottom: '16px' }}>
                  {Array(t.rating).fill(0).map((_, j) => <span key={j} style={{ color: '#fbbf24', fontSize: '16px' }}>★</span>)}
                </div>
                <p style={{ fontSize: '15px', color: '#cbd5e1', lineHeight: 1.7, marginBottom: '24px' }}>
                  &ldquo;{t.text}&rdquo;
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '50%',
                    background: `hsl(${240 + i * 40}, 60%, 60%)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: '14px',
                  }}>{t.name[0]}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '14px' }}>{t.name}</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: '100px 40px',
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: '600px', height: '600px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)',
        }}></div>
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '700px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '48px', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: '20px' }}>
            Ready to Transform Your Healthcare?
          </h2>
          <p style={{ fontSize: '18px', color: '#a5b4fc', marginBottom: '40px', lineHeight: 1.7 }}>
            Join 50,000+ users who trust MedVet for their healthcare needs. Start your journey today — it&apos;s free!
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <Link href="/register" style={{
              padding: '16px 40px', borderRadius: '14px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: 'white', fontWeight: 700, fontSize: '17px',
              boxShadow: '0 8px 30px rgba(99,102,241,0.5)',
              textDecoration: 'none', transition: 'all 0.3s',
            }}>
              Create Free Account →
            </Link>
            <Link href="/login" style={{
              padding: '16px 40px', borderRadius: '14px',
              background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
              color: 'white', fontWeight: 600, fontSize: '17px',
              textDecoration: 'none', transition: 'all 0.3s',
            }}>
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '60px 40px 30px',
        background: '#020617',
        borderTop: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div className="home-footer-grid" style={{
          maxWidth: '1280px', margin: '0 auto',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🏥</div>
              <span style={{ fontWeight: 800, fontSize: '18px' }}>MedVet <span style={{ color: '#6366f1', fontSize: '12px' }}>ONE-HEALTH</span></span>
            </div>
            <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.7, maxWidth: '300px' }}>
              Bridging human healthcare and veterinary services with cutting-edge technology. Making health accessible for everyone.
            </p>
          </div>
          {[
            { title: 'Product', links: ['Features', 'Pricing', 'Doctors', 'Medicines','API'] },
            { title: 'Company', links: ['About Us', 'Careers', 'Blog', 'Press', 'Contact'] },
            { title: 'Legal', links: ['Privacy Policy', 'Terms of Service', 'HIPAA Compliance', 'Data Protection'] },
          ].map((col, i) => (
            <div key={i}>
              <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '16px', color: '#e2e8f0' }}>{col.title}</div>
              {col.links.map(link => (
                <a key={link} href="#" style={{ display: 'block', fontSize: '13px', color: '#64748b', marginBottom: '10px', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseOver={e => e.target.style.color='#a5b4fc'}
                  onMouseOut={e => e.target.style.color='#64748b'}
                >{link}</a>
              ))}
            </div>
          ))}
        </div>
        <div className="home-footer-bottom" style={{
          maxWidth: '1280px', margin: '0 auto', paddingTop: '24px',
        }}>
          <div style={{ fontSize: '13px', color: '#475569' }}>© 2026 MedVet One-Health. All rights reserved.</div>
          <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: '#475569' }}>
            <span>Made with ❤️ in India</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
