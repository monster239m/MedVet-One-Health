'use client';

export default function LiveTracker({
  steps = [],
  currentStep = 0,
  eta = null,
  title = 'Live Tracking',
  subtitle = '',
  entityName = '',
  entityIcon = '🚗',
  accentColor = '#6366f1',
}) {
  return (
    <div style={{
      background: 'white', borderRadius: '20px', padding: '24px',
      border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>{title}</h3>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              padding: '3px 10px', borderRadius: '999px',
              background: 'rgba(239,68,68,0.1)', fontSize: '11px',
              fontWeight: 700, color: '#ef4444',
            }}>
              <span style={{
                width: '6px', height: '6px', borderRadius: '50%',
                background: '#ef4444', animation: 'pulse 1.5s ease-in-out infinite',
              }} />
              LIVE
            </div>
          </div>
          {subtitle && <p style={{ fontSize: '13px', color: '#64748b' }}>{subtitle}</p>}
        </div>
        {eta && (
          <div style={{
            padding: '8px 16px', borderRadius: '12px',
            background: `${accentColor}10`, border: `1px solid ${accentColor}30`,
          }}>
            <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 500 }}>ETA</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: accentColor }}>{eta}</div>
          </div>
        )}
      </div>

      {/* Entity Card */}
      {entityName && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          padding: '14px', borderRadius: '14px', marginBottom: '20px',
          background: '#f8fafc', border: '1px solid #f1f5f9',
        }}>
          <div style={{
            width: '44px', height: '44px', borderRadius: '12px',
            background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '20px',
          }}>{entityIcon}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>{entityName}</div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>
              {currentStep < steps.length ? steps[currentStep]?.sublabel || 'In transit' : 'Arrived'}
            </div>
          </div>
          <div style={{
            display: 'flex', gap: '8px',
          }}>
            <button style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: '#e2e8f0', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '16px', border: 'none',
              cursor: 'pointer',
            }}>📞</button>
            <button style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: '#e2e8f0', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '16px', border: 'none',
              cursor: 'pointer',
            }}>💬</button>
          </div>
        </div>
      )}

      {/* Progress Steps */}
      <div style={{ position: 'relative' }}>
        {steps.map((step, i) => {
          const isDone = i < currentStep;
          const isActive = i === currentStep;
          const isPending = i > currentStep;

          return (
            <div key={i} style={{
              display: 'flex', gap: '14px', position: 'relative',
              paddingBottom: i < steps.length - 1 ? '20px' : '0',
            }}>
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div style={{
                  position: 'absolute', left: '15px', top: '32px',
                  width: '2px', height: 'calc(100% - 32px)',
                  background: isDone ? accentColor : '#e2e8f0',
                  transition: 'background 0.5s ease',
                }} />
              )}

              {/* Step circle */}
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, position: 'relative', zIndex: 1,
                background: isDone ? accentColor : isActive ? 'white' : '#f1f5f9',
                border: isActive ? `3px solid ${accentColor}` : isDone ? 'none' : '2px solid #e2e8f0',
                boxShadow: isActive ? `0 0 0 4px ${accentColor}20` : 'none',
                transition: 'all 0.3s ease',
                animation: isActive ? 'pulse 2s ease-in-out infinite' : 'none',
              }}>
                {isDone ? (
                  <span style={{ color: 'white', fontSize: '14px', fontWeight: 700 }}>✓</span>
                ) : (
                  <span style={{ fontSize: '13px' }}>{step.icon || '○'}</span>
                )}
              </div>

              {/* Step content */}
              <div style={{ flex: 1, paddingTop: '4px' }}>
                <div style={{
                  fontSize: '14px', fontWeight: isActive ? 700 : isDone ? 600 : 400,
                  color: isPending ? '#94a3b8' : '#0f172a',
                }}>
                  {step.label}
                </div>
                {step.time && (
                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                    {step.time}
                  </div>
                )}
                {isActive && step.detail && (
                  <div style={{
                    marginTop: '6px', padding: '8px 12px', borderRadius: '8px',
                    background: `${accentColor}08`, border: `1px solid ${accentColor}15`,
                    fontSize: '12px', color: accentColor, fontWeight: 500,
                  }}>
                    {step.detail}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
