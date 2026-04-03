import { useState, useEffect } from 'react';

export default function TelemedicineRoom({ doctorName = 'Doctor', patientName = 'Patient', onClose }) {
  const [callStatus, setCallStatus] = useState('connecting'); // connecting, calling, connected, ended
  const [micMuted, setMicMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    // Simulate connection flow
    const timers = [
      setTimeout(() => setCallStatus('calling'), 1500),
      setTimeout(() => setCallStatus('connected'), 3500),
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    let interval;
    if (callStatus === 'connected') {
      interval = setInterval(() => setCallDuration(c => c + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [callStatus]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    setCallStatus('ended');
    setTimeout(onClose, 2000);
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999,
      background: '#0f172a', display: 'flex', flexDirection: 'column',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Header */}
      <div style={{ padding: '20px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #10b981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
            {callStatus === 'connected' ? '📞' : '⏳'}
          </div>
          <div>
            <div style={{ color: 'white', fontWeight: 600, fontSize: '18px' }}>MedVet Secure Video Consult</div>
            <div style={{ color: '#94a3b8', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: callStatus === 'connected' ? '#10b981' : '#f59e0b' }}></span>
              {callStatus === 'connecting' && 'Connecting to secure server...'}
              {callStatus === 'calling' && `Ringing ${doctorName}...`}
              {callStatus === 'connected' && `Encrypted Call • ${formatTime(callDuration)}`}
              {callStatus === 'ended' && 'Call Ended'}
            </div>
          </div>
        </div>
        <button onClick={handleEndCall} style={{ background: 'transparent', border: 'none', color: '#64748b', fontSize: '24px', cursor: 'pointer' }}>×</button>
      </div>

      {/* Main Video Area */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        
        {/* Remote Video (Doctor) */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column', gap: '20px', transition: 'all 0.5s',
          opacity: callStatus === 'connected' ? 1 : 0.5,
        }}>
          {callStatus === 'connected' ? (
            <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(doctorName)}&background=334155&color=fff&size=512`} alt="Doctor" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.3 }} />
          ) : (
            <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', color: 'white', boxShadow: '0 0 0 10px rgba(51, 65, 85, 0.3), 0 0 0 20px rgba(51, 65, 85, 0.1)' }}>
              {doctorName.charAt(0)}
            </div>
          )}
          
          <div style={{ position: 'absolute', bottom: '120px', left: '40px', background: 'rgba(0,0,0,0.6)', padding: '10px 20px', borderRadius: '12px', backdropFilter: 'blur(10px)', color: 'white' }}>
            <div style={{ fontWeight: 600, fontSize: '18px' }}>Dr. {doctorName}</div>
            <div style={{ fontSize: '13px', color: '#94a3b8' }}>General Physician</div>
          </div>
        </div>

        {/* Local Video Picture-in-Picture (Patient) */}
        {callStatus === 'connected' && (
          <div style={{
            position: 'absolute', top: '40px', right: '40px', width: '220px', height: '300px',
            background: '#334155', borderRadius: '16px', border: '3px solid rgba(255,255,255,0.2)',
            overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
             {videoOff ? (
               <div style={{ color: 'white', fontSize: '14px', opacity: 0.5 }}>Video Off</div>
             ) : (
               <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(patientName)}&background=10b981&color=fff&size=256`} alt="You" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
             )}
             <div style={{ position: 'absolute', bottom: '10px', left: '10px', background: 'rgba(0,0,0,0.5)', padding: '4px 8px', borderRadius: '6px', color: 'white', fontSize: '12px' }}>You {micMuted && '🎤❌'}</div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div style={{ height: '100px', background: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(20px)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px' }}>
        <button 
          onClick={() => setMicMuted(!micMuted)}
          disabled={callStatus !== 'connected'}
          style={{ width: '60px', height: '60px', borderRadius: '50%', border: 'none', background: micMuted ? '#ef4444' : '#334155', color: 'white', fontSize: '24px', cursor: callStatus === 'connected' ? 'pointer' : 'not-allowed', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          {micMuted ? '🔇' : '🎤'}
        </button>
        <button 
          onClick={() => setVideoOff(!videoOff)}
          disabled={callStatus !== 'connected'}
          style={{ width: '60px', height: '60px', borderRadius: '50%', border: 'none', background: videoOff ? '#ef4444' : '#334155', color: 'white', fontSize: '24px', cursor: callStatus === 'connected' ? 'pointer' : 'not-allowed', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          {videoOff ? '🚫' : '📹'}
        </button>
        <button 
          onClick={handleEndCall}
          style={{ padding: '0 30px', height: '60px', borderRadius: '30px', border: 'none', background: '#ef4444', color: 'white', fontSize: '18px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
        >
           End Call ☎️
        </button>
      </div>
    </div>
  );
}
