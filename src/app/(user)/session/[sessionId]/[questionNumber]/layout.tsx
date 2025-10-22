// src/app/(user)/session/[sessionId]/layout.tsx
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Quiz Session | MedicPortal',
  description: 'An active quiz session on MedicPortal.',
};

export default function SessionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}