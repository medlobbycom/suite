// src/context/AuthContext.tsx
'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  email: string;
  name: string | null;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loadingUser: boolean;
  login: (userData: User, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true); // Start loading initially
  const router = useRouter();

  // Check for token on initial load (e.g., page refresh)
  useEffect(() => {
    const checkUserStatus = async () => {
      console.log("AuthContext: Checking user status..."); // Log start
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {

            headers: { 'Authorization': `Bearer ${token}` },
          });
          console.log("AuthContext: /users/me response status:", response.status); // Log response
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          } else {
            // Token invalid, clear it
            localStorage.removeItem('token');
            setUser(null);
            console.log("AuthContext: Token invalid or fetch failed, cleared token."); // Log clear
          }
        } catch (error) {
          console.error("Failed to fetch user on load:", error);
          localStorage.removeItem('token');
          setUser(null);
        }
              } else {
        console.log("AuthContext: No token found."); // Log no token
      }
        console.log("AuthContext: Finished checking. Setting loadingUser to false."); // Log finish
      setLoadingUser(false); // Finished checking
    };
    checkUserStatus();
  }, []); // Run only once on mount

  const login = (userData: User, token: string) => {
    localStorage.setItem('token', token);
    setUser(userData);
    router.push('/dashboard'); // Redirect after setting state
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loadingUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};