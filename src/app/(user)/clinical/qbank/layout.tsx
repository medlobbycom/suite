// src/app/dashboard/layout.tsx
import { Metadata } from 'next';
import React from 'react';

// --- This is your new page title & SEO ---
export const metadata: Metadata = {
  // Using the "template" method from my last message
  title: 'Clinical Qbank ', 
  description: 'Users dashboard for Medicportal Clinical Qbank.',
};

// This layout just passes the children (your page.tsx) through
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}