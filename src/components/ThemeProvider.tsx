// src/components/ThemeProvider.tsx
'use client';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
// FIX: Import ThemeProviderProps directly from 'next-themes'
import { type ThemeProviderProps } from 'next-themes'; 

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}