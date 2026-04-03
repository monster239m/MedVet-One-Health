'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { MOCK_USERS } from '@/data/mockData';

const sidebarItems = [
  { label: 'Main', items: [
    { icon: '🏠', label: 'Dashboard', href: '/dashboard/patient' },
    { icon: '📅', label: 'Appointments', href: '/dashboard/patient/appointments' },
    { icon: '🔍', label: 'Find Doctors', href: '/dashboard/patient/doctors' },
  ]},
  { label: 'Health', items: [
    { icon: '💊', label: 'Prescriptions', href: '/dashboard/patient/prescriptions' },
    { icon: '🏪', label: 'Medicines', href: '/dashboard/patient/medicines' },
    { icon: '📋', label: 'Queue Status', href: '/dashboard/patient/queue' },
    { icon: '📦', label: 'My Orders', href: '/dashboard/patient/orders' },
  ]},
  { label: 'More', items: [
    { icon: '🐾', label: 'My Pets', href: '/dashboard/patient/pets' },
    { icon: '📁', label: 'Health Records', href: '/dashboard/patient/records' },
    { icon: '💬', label: 'Messages', href: '/dashboard/patient/messages' },
    { icon: '⚙️', label: 'Settings', href: '/dashboard/patient/settings' },
  ]},
];

const MOCK_CONVERSATIONS = [
  {
    id: 'CONV001',
    doctorId: 'DOC001',
    doctorName: 'Dr. Arun Mehta',
    specialty: 'General Physician',
    initials: 'AM',
    isOnline: true,
    lastMessage: 'Your blood sugar levels look stable. Continue with the current medication.',
    lastTime: '10 min ago',
    unread: 2,
    messages: [
      { id: 1, sender: 'doctor', text: 'Hello Rahul! I reviewed your latest lab reports.', time: '10:15 AM' },
      { id: 2, sender: 'doctor', text: 'Your HbA1c has improved from 7.2 to 6.8. Great progress! 🎉', time: '10:16 AM' },
      { id: 3, sender: 'patient', text: 'Thank you Doctor! I have been following the diet plan strictly.', time: '10:20 AM' },
      { id: 4, sender: 'doctor', text: 'That\'s wonderful to hear. Keep it up!', time: '10:22 AM' },
      { id: 5, sender: 'patient', text: 'Should I continue the same Metformin dosage?', time: '10:25 AM' },
      { id: 6, sender: 'doctor', text: 'Yes, continue Metformin 500mg twice daily. I\'ll adjust in our next review.', time: '10:28 AM' },
      { id: 7, sender: 'doctor', text: 'Your blood sugar levels look stable. Continue with the current medication.', time: '10:30 AM' },
    ],
  },
  {
    id: 'CONV002',
    doctorId: 'DOC002',
    doctorName: 'Dr. Sneha Reddy',
    specialty: 'Veterinary Surgeon',
    initials: 'SR',
    isOnline: true,
    lastMessage: 'Bruno is recovering well. Just make sure he doesn\'t scratch the stitches.',
    lastTime: '2 hours ago',
    unread: 0,
    messages: [
      { id: 1, sender: 'patient', text: 'Hi Dr. Sneha, Bruno seems to be limping slightly after the surgery.', time: '9:00 AM' },
      { id: 2, sender: 'doctor', text: 'That\'s normal post-surgery. Is he putting weight on the leg?', time: '9:05 AM' },
      { id: 3, sender: 'patient', text: 'Yes, he walks but slowly. No swelling that I can see.', time: '9:08 AM' },
      { id: 4, sender: 'doctor', text: 'Good sign! The mild limping should resolve in 3-5 days.', time: '9:10 AM' },
      { id: 5, sender: 'doctor', text: 'Bruno is recovering well. Just make sure he doesn\'t scratch the stitches.', time: '9:12 AM' },
    ],
  },
  {
    id: 'CONV003',
    doctorId: 'DOC004',
    doctorName: 'Dr. Meera Joshi',
    specialty: 'Dermatologist',
    initials: 'MJ',
    isOnline: false,
    lastMessage: 'Apply the prescribed ointment twice daily for 14 days.',
    lastTime: 'Yesterday',
    unread: 0,
    messages: [
      { id: 1, sender: 'patient', text: 'Doctor, the rash on my arm has spread to my neck area.', time: 'Yesterday, 3:00 PM' },
      { id: 2, sender: 'doctor', text: 'Can you share a photo of the affected area?', time: 'Yesterday, 3:15 PM' },
      { id: 3, sender: 'patient', text: '📸 [Photo attached]', time: 'Yesterday, 3:20 PM' },
      { id: 4, sender: 'doctor', text: 'This looks like a contact dermatitis reaction. Have you changed any soaps or detergents recently?', time: 'Yesterday, 3:25 PM' },
      { id: 5, sender: 'patient', text: 'Yes, I switched to a new laundry detergent last week!', time: 'Yesterday, 3:28 PM' },
      { id: 6, sender: 'doctor', text: 'That\'s likely the cause. Switch back to your old product.', time: 'Yesterday, 3:30 PM' },
      { id: 7, sender: 'doctor', text: 'Apply the prescribed ointment twice daily for 14 days.', time: 'Yesterday, 3:32 PM' },
    ],
  },
];

export default function PatientMessagesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeConv, setActiveConv] = useState('CONV001');
  const [newMessage, setNewMessage] = useState('');
  const [conversations, setConversations] = useState(MOCK_CONVERSATIONS);
  const [search, setSearch] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'patient')) router.push('/login');
  }, [user, loading, router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConv, conversations]);

  if (loading || !user) return null;

  const currentConv = conversations.find(c => c.id === activeConv);
  const filteredConvs = search ? conversations.filter(c => c.doctorName.toLowerCase().includes(search.toLowerCase())) : conversations;

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    const msg = { id: Date.now(), sender: 'patient', text: newMessage, time: 'Just now' };
    setConversations(prev => prev.map(c =>
      c.id === activeConv ? { ...c, messages: [...c.messages, msg], lastMessage: newMessage, lastTime: 'Just now' } : c
    ));
    setNewMessage('');
    // Simulate doctor typing response
    setTimeout(() => {
      const reply = { id: Date.now() + 1, sender: 'doctor', text: 'Thank you for the update. I\'ll review and get back to you shortly. 🩺', time: 'Just now' };
      setConversations(prev => prev.map(c =>
        c.id === activeConv ? { ...c, messages: [...c.messages, reply], lastMessage: reply.text, lastTime: 'Just now' } : c
      ));
    }, 2000);
  };

  return (
    <DashboardLayout sidebarItems={sidebarItems}>
      <div style={{ animation: 'fadeIn 0.5s ease-out', height: 'calc(100vh - 140px)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: '20px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>Messages 💬</h1>
          <p style={{ fontSize: '15px', color: '#64748b' }}>Chat with your doctors securely</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '0', flex: 1, borderRadius: '16px', overflow: 'hidden', border: '1px solid #e2e8f0', background: 'white' }}>
          {/* Conversations List */}
          <div style={{ borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '16px', borderBottom: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f1f5f9', borderRadius: '10px', padding: '8px 12px' }}>
                <span style={{ fontSize: '14px' }}>🔍</span>
                <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search conversations..."
                  style={{ flex: 1, background: 'none', border: 'none', fontSize: '13px', outline: 'none', color: '#0f172a' }}
                />
              </div>
            </div>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {filteredConvs.map(conv => (
                <button key={conv.id} onClick={() => { setActiveConv(conv.id); setConversations(prev => prev.map(c => c.id === conv.id ? {...c, unread: 0} : c)); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '14px 16px', width: '100%', textAlign: 'left',
                    background: activeConv === conv.id ? '#f1f5f9' : 'transparent',
                    borderBottom: '1px solid #f8fafc', cursor: 'pointer',
                    border: 'none', transition: 'background 0.15s',
                  }}
                >
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <div style={{
                      width: '46px', height: '46px', borderRadius: '50%',
                      background: conv.specialty.includes('Vet') ? 'linear-gradient(135deg, #14b8a6, #06b6d4)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'white', fontWeight: 700, fontSize: '15px',
                    }}>{conv.initials}</div>
                    {conv.isOnline && (
                      <div style={{ position: 'absolute', bottom: '1px', right: '1px', width: '12px', height: '12px', borderRadius: '50%', background: '#22c55e', border: '2px solid white' }} />
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>{conv.doctorName}</span>
                      <span style={{ fontSize: '10px', color: '#94a3b8' }}>{conv.lastTime}</span>
                    </div>
                    <div style={{ fontSize: '11px', color: '#6366f1', fontWeight: 500 }}>{conv.specialty}</div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{conv.lastMessage}</div>
                  </div>
                  {conv.unread > 0 && (
                    <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#6366f1', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, flexShrink: 0 }}>{conv.unread}</div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {/* Chat Header */}
            <div style={{ padding: '14px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '50%',
                  background: currentConv?.specialty.includes('Vet') ? 'linear-gradient(135deg, #14b8a6, #06b6d4)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontWeight: 700, fontSize: '14px',
                }}>{currentConv?.initials}</div>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>{currentConv?.doctorName}</div>
                  <div style={{ fontSize: '12px', color: currentConv?.isOnline ? '#22c55e' : '#94a3b8', fontWeight: 500 }}>
                    {currentConv?.isOnline ? '● Online' : '○ Offline'}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#f1f5f9', border: 'none', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📹</button>
                <button style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#f1f5f9', border: 'none', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📞</button>
                <button style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#f1f5f9', border: 'none', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>⋯</button>
              </div>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', background: '#f8fafc' }}>
              {/* Encrypted notice */}
              <div style={{ textAlign: 'center', padding: '8px', marginBottom: '8px' }}>
                <span style={{ fontSize: '11px', color: '#94a3b8', background: '#f1f5f9', padding: '4px 14px', borderRadius: '999px' }}>🔒 Messages are end-to-end encrypted</span>
              </div>
              {currentConv?.messages.map(msg => (
                <div key={msg.id} style={{
                  display: 'flex',
                  justifyContent: msg.sender === 'patient' ? 'flex-end' : 'flex-start',
                  animation: 'fadeIn 0.3s ease-out',
                }}>
                  <div style={{
                    maxWidth: '70%', padding: '10px 16px', borderRadius: msg.sender === 'patient' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                    background: msg.sender === 'patient' ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'white',
                    color: msg.sender === 'patient' ? 'white' : '#0f172a',
                    boxShadow: msg.sender === 'patient' ? '0 2px 8px rgba(99,102,241,0.3)' : '0 1px 3px rgba(0,0,0,0.06)',
                    border: msg.sender === 'patient' ? 'none' : '1px solid #e2e8f0',
                  }}>
                    <div style={{ fontSize: '13px', lineHeight: 1.5 }}>{msg.text}</div>
                    <div style={{
                      fontSize: '10px', marginTop: '4px', textAlign: 'right',
                      color: msg.sender === 'patient' ? 'rgba(255,255,255,0.7)' : '#94a3b8',
                    }}>{msg.time} {msg.sender === 'patient' && '✓✓'}</div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div style={{ padding: '14px 20px', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '10px', background: 'white' }}>
              <button style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#f1f5f9', border: 'none', cursor: 'pointer', fontSize: '16px' }}>📎</button>
              <input type="text" value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message..."
                style={{
                  flex: 1, padding: '10px 16px', borderRadius: '12px',
                  background: '#f1f5f9', border: 'none', fontSize: '14px',
                  outline: 'none', color: '#0f172a',
                }}
              />
              <button onClick={sendMessage} style={{
                width: '40px', height: '40px', borderRadius: '12px',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                border: 'none', cursor: 'pointer', color: 'white', fontSize: '16px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(99,102,241,0.3)',
              }}>➤</button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
