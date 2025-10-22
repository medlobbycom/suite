// src/app/admin/users/new/layout.tsx
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Add New User - Admin Dashboard | Medicportal', 
  description: 'Create a new user account.',
};

export default function NewUserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}