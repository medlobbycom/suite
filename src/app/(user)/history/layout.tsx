// src/app/(user)/history/layout.tsx
import { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Session History | MedicPortal',
  description: 'Review your past quiz sessions.',
};

export default function HistoryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}