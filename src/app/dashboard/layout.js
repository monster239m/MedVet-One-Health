'use client';
import { AuthProvider } from '@/context/AuthContext';
import { LiveDemoProvider } from '@/context/LiveDemoContext';
import Chatbot from '@/components/Chatbot';

export default function DashboardRootLayout({ children }) {
  return (
    <AuthProvider>
      <LiveDemoProvider>
        {children}
        <Chatbot />
      </LiveDemoProvider>
    </AuthProvider>
  );
}
