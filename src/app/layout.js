import './globals.css';

export const metadata = {
  title: 'MedVet One-Health | Unified Healthcare for Humans & Pets',
  description: 'India\'s first integrated telemedicine platform connecting human healthcare and veterinary services under one roof. Consult doctors, order medicines, and manage health records seamlessly.',
  keywords: 'telemedicine, healthcare, veterinary, one health, doctor consultation, pet care, medicine delivery',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0f172a" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
