// src/app/layout.tsx
// NO 'use client' - This is now a Server Component!

import { Inter } from 'next/font/google';
import './globals.css';
import { ClientProviders } from '@/components/ClientProviders'; // Import our new client component
import { Metadata } from 'next'; // Import the Metadata type

const inter = Inter({ subsets: ['latin'] });

// --- NEW: DEFAULT SITE METADATA & TITLE ---
export const metadata: Metadata = {
  title: {
    default: 'MedicPortal', // Title on the homepage
    template: '%s | MedicPortal', // Title for other pages (e.g., "Dashboard | MedicPortal")
  },
  description: 'Your all-in-one portal for medical exam preparation, question banks, and recalls.',
  // You can add more SEO tags here (keywords, openGraph, etc.)
};
// ---

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // The <html> and <body> tags are now in the ClientProviders
    // to allow 'suppressHydrationWarning' to be on the <html> tag
    // while keeping this component a Server Component.
    <ClientProviders interClassName={inter.className}>
      {children}
    </ClientProviders>
  );
}