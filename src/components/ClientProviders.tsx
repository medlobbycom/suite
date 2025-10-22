'use client';

import { ReactNode } from 'react';
import { ThemeProvider } from '@/components/ThemeProvider';
import { AuthProvider } from '@/context/AuthContext';

interface ClientProvidersProps {
  children: ReactNode;
  interClassName: string;
}

export function ClientProviders({ children, interClassName }: ClientProvidersProps) {
  return (
    // The `suppressHydrationWarning` is needed here for next-themes
    <html lang="en" suppressHydrationWarning>
      <body className={interClassName}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}