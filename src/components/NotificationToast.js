'use client';
import { useState, useEffect } from 'react';

export default function NotificationToast({ notifications = [], onDismiss }) {
  const [visible, setVisible] = useState([]);

  useEffect(() => {
    const unread = notifications.filter(n => !n.read);
    setVisible(unread.slice(-3));
  }, [notifications]);

  useEffect(() => {
    if (visible.length > 0) {
      const timer = setTimeout(() => {
        if (onDismiss && visible[0]) onDismiss(visible[0].id);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [visible, onDismiss]);

  if (visible.length === 0) return null;

  const typeStyles = {
    success: { border: '#22c55e', icon: '✅' },
    error: { border: '#ef4444', icon: '❌' },
    warning: { border: '#f59e0b', icon: '⚠️' },
    urgent: { border: '#6366f1', icon: '🔔' },
    info: { border: '#3b82f6', icon: 'ℹ️' },
  };

  return (
    <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 2000, display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '380px', width: '100%' }}>
      {visible.map((notif, i) => {
        const ts = typeStyles[notif.type] || typeStyles.info;
        return (
          <div key={notif.id} style={{
            background: 'white', borderRadius: '14px', padding: '14px 16px',
            display: 'flex', alignItems: 'flex-start', gap: '12px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.12)', borderLeft: `4px solid ${ts.border}`,
            animation: `slideInRight 0.3s ease-out ${i * 0.1}s both`, position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px' }}>
              <div style={{ height: '100%', background: ts.border, animation: 'shrinkWidth 5s linear forwards' }} />
            </div>
            <span style={{ fontSize: '18px', flexShrink: 0 }}>{ts.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '13px', color: '#0f172a', fontWeight: 500, lineHeight: 1.4 }}>{notif.message}</div>
              <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>{notif.time}</div>
            </div>
            <button onClick={() => onDismiss && onDismiss(notif.id)} style={{
              width: '24px', height: '24px', borderRadius: '6px', background: '#f1f5f9',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: 'none', cursor: 'pointer', fontSize: '12px', color: '#94a3b8',
            }}>✕</button>
          </div>
        );
      })}
    </div>
  );
}
