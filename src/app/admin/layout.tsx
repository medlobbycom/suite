// src/app/admin/layout.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar'; // Your ADMIN sidebar
import MainHeader from '@/components/MainHeader';   // We can RE-USE the MainHeader
import { useAuth } from '@/context/AuthContext';     // Import useAuth

// This interface is only for the *initial* check
interface UserCheck {
  role: string;
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, loadingUser, logout } = useAuth(); // Get live user data

  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);


  // --- START RESPONSIVE SIDEBAR FIX ---
  const ADMIN_SIDEBAR_STATE_KEY = 'adminSidebarOpen'; // Key for localStorage
  const [isSidebarOpen, setSidebarOpen] = useState<boolean | null>(null);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);


  // This hook loads the sidebar state from localStorage or sets a default.
  useEffect(() => {
    const storedValue = localStorage.getItem(ADMIN_SIDEBAR_STATE_KEY);
    if (storedValue !== null) {
      setSidebarOpen(JSON.parse(storedValue));
    } else {
      setSidebarOpen(window.innerWidth >= 1024); // Open on desktop, closed on mobile
    }
  }, []); // Runs once on mount

  // This hook saves the state to localStorage AND handles the scroll lock.
  useEffect(() => {
    if (isSidebarOpen !== null) {
      localStorage.setItem(ADMIN_SIDEBAR_STATE_KEY, JSON.stringify(isSidebarOpen));
    }
    if (isSidebarOpen && window.innerWidth < 1024) { // Only on mobile
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => document.body.classList.remove('overflow-hidden');
  }, [isSidebarOpen]); // This runs every time isSidebarOpen changes
  // --- END RESPONSIVE SIDEBAR FIX ---



  // Your original auth check logic
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!response.ok) throw new Error('Authentication failed');
        
        const userCheck: UserCheck = await response.json();
        
        if (userCheck.role === 'ADMIN') {
          setIsAuthorized(true);
        } else {
          router.push('/dashboard'); // Redirect non-admins
        }
      } catch (_error) {
        localStorage.removeItem('token');
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  // Show a loading screen during the auth check
  if (loading || loadingUser || isSidebarOpen === null) {
    return <div className="flex h-screen items-center justify-center">Verifying access...</div>;
  }

  // If authorized, render the full ADMIN layout
  if (isAuthorized && user) {
    return (



      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 lg:flex">
        {/* Backdrop for mobile sidebar */}
        {isSidebarOpen && (
          <div 
            onClick={toggleSidebar} 
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
            aria-hidden="true"
          ></div>
        )}
        <AdminSidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setSidebarOpen(false)}
        />
        {/* Fix double scrollbar: remove min-h-screen */}
        <div className="flex-1 flex flex-col">






          <MainHeader
            toggleSidebar={toggleSidebar}
            userName={user.name || 'Admin'}
            userRole={user.role}
            onLogout={logout}
          />

          {/* Fix double scrollbar: remove overflow-y-auto */}
          <main className="flex-1 p-4 md:p-8">

            {children}
          </main>
        </div>
      </div>
    );
  }

  // Otherwise, render nothing while redirecting.
  return null;
}