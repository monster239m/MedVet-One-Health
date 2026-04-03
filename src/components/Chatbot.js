'use client';
import { useState, useEffect, useRef } from 'react';
import { CHATBOT_RESPONSES } from '@/data/mockData';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const [hasGreeted, setHasGreeted] = useState(false);

  useEffect(() => {
    if (isOpen && !hasGreeted) {
      setIsTyping(true);
      setTimeout(() => {
        setMessages([{
          id: Date.now(),
          type: 'bot',
          text: CHATBOT_RESPONSES.greeting,
          options: CHATBOT_RESPONSES.options.map(o => ({ id: o.id, label: o.label }))
        }]);
        setIsTyping(false);
        setHasGreeted(true);
      }, 800);
    }
  }, [isOpen, hasGreeted]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleOption = (optionId, isSubOption, parentId) => {
    let option, response, subOptions;
    if (isSubOption && parentId) {
      const parent = CHATBOT_RESPONSES.options.find(o => o.id === parentId);
      option = parent?.subOptions?.find(o => o.id === optionId);
    } else {
      option = CHATBOT_RESPONSES.options.find(o => o.id === optionId);
    }
    if (!option) return;

    setMessages(prev => [...prev, { id: Date.now(), type: 'user', text: option.label }]);
    setIsTyping(true);

    setTimeout(() => {
      const botMsg = {
        id: Date.now() + 1,
        type: 'bot',
        text: option.response,
        options: option.subOptions?.map(o => ({ id: o.id, label: o.label, parentId: isSubOption ? parentId : optionId })) || null
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 1000 + Math.random() * 500);
  };

  const handleBack = () => {
    setMessages([{
      id: Date.now(),
      type: 'bot',
      text: "What else can I help you with? 😊",
      options: CHATBOT_RESPONSES.options.map(o => ({ id: o.id, label: o.label }))
    }]);
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 8px 30px rgba(99,102,241,0.5)',
          zIndex: 601,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
          transform: isOpen ? 'rotate(180deg) scale(0.9)' : 'scale(1)',
        }}
        id="chatbot-toggle"
        aria-label="Toggle AI Assistant"
      >
        {isOpen ? '✕' : '🤖'}
      </button>

      {/* Pulse ring */}
      {!isOpen && (
        <span style={{
          position: 'fixed', bottom: '24px', right: '24px', width: '60px', height: '60px',
          borderRadius: '50%', border: '3px solid rgba(99,102,241,0.4)',
          zIndex: 600, animation: 'pulse 2s infinite', pointerEvents: 'none'
        }} />
      )}

      {/* Chat Window */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '96px',
          right: '24px',
          width: '400px',
          maxWidth: 'calc(100vw - 48px)',
          height: '560px',
          maxHeight: 'calc(100vh - 120px)',
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
          zIndex: 600,
          display: 'flex',
          flexDirection: 'column',
          animation: 'scaleIn 0.3s ease-out',
          border: '1px solid rgba(255,255,255,0.1)',
        }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a78bfa 100%)',
            padding: '20px',
            color: 'white',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '12px',
                background: 'rgba(255,255,255,0.2)', display: 'flex',
                alignItems: 'center', justifyContent: 'center', fontSize: '22px',
                backdropFilter: 'blur(10px)',
              }}>🤖</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '16px' }}>MedVet AI Assistant</div>
                <div style={{ fontSize: '12px', opacity: 0.9, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{
                    width: '7px', height: '7px', borderRadius: '50%', background: '#4ade80',
                    boxShadow: '0 0 6px rgba(74,222,128,0.5)', display: 'inline-block'
                  }}></span>
                  Online • Ready to help
                </div>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px',
            background: '#f8fafc',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}>
            {messages.map(msg => (
              <div key={msg.id} style={{
                display: 'flex',
                justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start',
                animation: 'fadeIn 0.3s ease-out',
              }}>
                <div style={{
                  maxWidth: '85%',
                  padding: msg.type === 'user' ? '10px 16px' : '14px 16px',
                  borderRadius: msg.type === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  background: msg.type === 'user'
                    ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                    : 'white',
                  color: msg.type === 'user' ? 'white' : '#1e293b',
                  fontSize: '14px',
                  lineHeight: '1.5',
                  boxShadow: msg.type === 'user' ? 'none' : '0 1px 3px rgba(0,0,0,0.08)',
                  border: msg.type === 'user' ? 'none' : '1px solid #e2e8f0',
                }}>
                  <div style={{ whiteSpace: 'pre-line' }} dangerouslySetInnerHTML={{
                    __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  }} />
                  {msg.options && (
                    <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {msg.options.map(opt => (
                        <button key={opt.id} onClick={() => handleOption(opt.id, !!opt.parentId, opt.parentId)}
                          style={{
                            padding: '8px 14px', borderRadius: '10px',
                            background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.08))',
                            border: '1px solid rgba(99,102,241,0.2)',
                            color: '#4f46e5', fontSize: '13px', fontWeight: 500,
                            cursor: 'pointer', textAlign: 'left',
                            transition: 'all 0.2s',
                          }}
                          onMouseOver={e => { e.target.style.background = 'rgba(99,102,241,0.15)'; e.target.style.transform = 'translateX(4px)'; }}
                          onMouseOut={e => { e.target.style.background = 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.08))'; e.target.style.transform = 'translateX(0)'; }}
                        >{opt.label}</button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div style={{ display: 'flex', gap: '4px', padding: '12px 16px', background: 'white', borderRadius: '16px', width: 'fit-content', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0' }}>
                {[0,1,2].map(i => (
                  <span key={i} style={{
                    width: '8px', height: '8px', borderRadius: '50%', background: '#94a3b8',
                    animation: `pulse 1.4s infinite ease-in-out`, animationDelay: `${i * 0.2}s`
                  }}></span>
                ))}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Footer */}
          <div style={{
            padding: '12px 16px',
            background: 'white',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <button onClick={handleBack} style={{
              padding: '8px 16px', borderRadius: '10px',
              background: '#f1f5f9', color: '#64748b',
              fontSize: '13px', fontWeight: 500, cursor: 'pointer',
              border: '1px solid #e2e8f0', transition: 'all 0.2s',
              whiteSpace: 'nowrap',
            }}>↩ Main Menu</button>
            <div style={{
              flex: 1, padding: '8px 14px', borderRadius: '10px',
              background: '#f1f5f9', color: '#94a3b8', fontSize: '13px',
              border: '1px solid #e2e8f0',
            }}>Select an option above...</div>
          </div>
        </div>
      )}
    </>
  );
}
