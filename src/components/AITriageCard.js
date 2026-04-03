import { useState } from 'react';

const AI_RESPONSES = [
  { keywords: ['vomit', 'throw up', 'puke'], diagnosis: 'Gastroenteritis or Dietary Indiscretion', urgency: 'Medium', recommendation: 'Keep the pet hydrated. Monitor for 24 hours. Book a General Physician.' },
  { keywords: ['bleed', 'cut', 'accident', 'blood'], diagnosis: 'Trauma / Laceration', urgency: 'High', recommendation: 'Apply pressure to the wound. Immediate Veterinary Consultation required.' },
  { keywords: ['fever', 'hot', 'shivering', 'lethargic'], diagnosis: 'Possible Infection / Pyrexia', urgency: 'Medium', recommendation: 'Monitor temperature. If it exceeds 103°F, book an emergency home visit.' },
  { keywords: ['cough', 'sneeze', 'breathe', 'panting'], diagnosis: 'Respiratory Tract Infection', urgency: 'High', recommendation: 'Ensure good ventilation. Book a Vet immediately as respiratory distress can be fatal.' },
  { keywords: ['diarrhea', 'loose', 'poop', 'stomach'], diagnosis: 'Gastric Upset', urgency: 'Low', recommendation: 'Switch to a bland diet (boiled chicken/rice). If persists >48hrs, book a Vet.' },
  { keywords: ['scratch', 'itch', 'fur', 'hair', 'skin'], diagnosis: 'Dermatitis or Parasites', urgency: 'Low', recommendation: 'Check for fleas/ticks. Book an online Dermatology consultation.' },
];

export default function AITriageCard() {
  const [symptom, setSymptom] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const handleTriage = () => {
    if (!symptom.trim()) return;
    setAnalyzing(true);
    setResult(null);

    // Simulate AI thinking delay
    setTimeout(() => {
      const lower = symptom.toLowerCase();
      let matched = AI_RESPONSES.find(r => r.keywords.some(k => lower.includes(k)));
      
      if (!matched) {
        matched = {
          diagnosis: 'General Symptoms / Unclear',
          urgency: 'Medium',
          recommendation: 'Please describe the symptoms in more detail, or book a General Consultation to be safe.',
        };
      }
      
      setResult(matched);
      setAnalyzing(false);
    }, 1500);
  };

  return (
    <div style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', borderRadius: '20px', padding: '24px', color: 'white', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '-20px', right: '-20px', fontSize: '100px', opacity: 0.1 }}>🤖</div>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <span style={{ fontSize: '24px' }}>✨</span>
          <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0 }}>MedVet AI Triage</h3>
        </div>
        <p style={{ fontSize: '14px', opacity: 0.9, marginBottom: '20px' }}>Describe your or your pet's symptoms for an instant AI assessment.</p>
        
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <input 
            type="text" 
            placeholder="E.g., My dog is vomiting and lethargic..." 
            value={symptom}
            onChange={(e) => setSymptom(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleTriage()}
            style={{
              flex: '1 1 250px', padding: '14px 16px', borderRadius: '12px', border: 'none',
              fontSize: '14px', outline: 'none', color: '#0f172a',
            }}
          />
          <button 
            onClick={handleTriage}
            disabled={analyzing}
            style={{
              padding: '14px 24px', borderRadius: '12px', background: '#10b981', color: 'white',
              fontWeight: 700, border: 'none', cursor: analyzing ? 'wait' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              flex: '0 1 auto', minWidth: '120px'
            }}
          >
            {analyzing ? (
              <><span style={{ width: '12px', height: '12px', borderRadius: '50%', border: '2px solid white', borderTopColor: 'transparent', animation: 'spin 1s linear infinite' }} /> Analyzing...</>
            ) : 'Analyze'}
          </button>
        </div>

        {result && (
          <div style={{ marginTop: '20px', background: 'rgba(255,255,255,0.1)', borderRadius: '16px', padding: '16px', border: '1px solid rgba(255,255,255,0.2)', animation: 'slideDown 0.3s ease-out' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.8 }}>AI Diagnosis Assessment</div>
              <div style={{
                fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '999px',
                background: result.urgency === 'High' ? '#fee2e2' : result.urgency === 'Medium' ? '#fef3c7' : '#dcfce7',
                color: result.urgency === 'High' ? '#dc2626' : result.urgency === 'Medium' ? '#d97706' : '#15803d',
              }}>Urgency: {result.urgency}</div>
            </div>
            
            <div style={{ fontSize: '18px', fontWeight: 800, marginBottom: '8px' }}>{result.diagnosis}</div>
            
            <div style={{ display: 'flex', gap: '8px', background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '10px', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '16px' }}>⚕️</span>
              <div style={{ fontSize: '13px', lineHeight: 1.5, opacity: 0.9 }}>
                {result.recommendation}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
