'use client';

import { useState, useEffect, useRef } from 'react'; // Import hooks
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import { Menu, X } from 'lucide-react'; // Import icons

export default function LandingHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu if clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    }
    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => document.body.classList.remove('overflow-hidden');
  }, [isMobileMenuOpen]);

  return (

    // --- FIX: Changed 'absolute' to 'fixed' to make it sticky ---
    <header className="fixed top-0 left-0 right-0 z-20 py-4 px-4 sm:px-6 lg:px-8 bg-white/30 dark:bg-gray-800/30 backdrop-blur-md border-b border-white/20 dark:border-gray-700/20">
  
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" aria-label="MedicPortal Home">
          {/* Dual Logo Setup */}
          <img
            src="/assets/logos/logo-color.png" // Your dark text logo
            alt="MedicPortal Home"
            className="h-9 w-auto dark:hidden"
          />
          <img
            src="/assets/logos/logo-final.png" // Your white logo
            alt="MedicPortal Home"
            className="h-9 w-auto hidden dark:block"
          />
        </Link>

        {/* Navigation & Actions */}
        <div className="flex items-center gap-4">
           {/* You could add nav links here if needed later */}
           {/* <nav className="hidden md:flex gap-6">
             <Link href="/features" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">Features</Link>
             <Link href="/pricing" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">Pricing</Link>
           </nav> */}



           <div className="hidden md:flex items-center gap-2"> {/* Changed sm:flex to md:flex */}
            <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            >
                Log In
            </Link>
            <Link
                href="/register"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md shadow hover:bg-indigo-700"
            >
                Register
            </Link>
           </div>

           {/* --- ThemeToggle Moved Here --- */}
           <ThemeToggle />

           {/* --- MOBILE MENU BUTTON --- */}
           <div className="md:hidden">
             <button
               onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
               className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
               aria-label="Toggle mobile menu"
               aria-expanded={isMobileMenuOpen}
             >
               {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
             </button>
           </div>
        </div>
      </div>

      {/* --- MOBILE MENU DRAWER --- */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-30 bg-black/50 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          ></div>

          {/* Drawer Content */}
          <div
            ref={menuRef} // Attach ref for click outside detection
            className="fixed top-0 right-0 z-40 h-full w-64 bg-white dark:bg-gray-800 shadow-lg p-6 transform transition-transform duration-300 ease-in-out md:hidden"
            style={{ transform: isMobileMenuOpen ? 'translateX(0)' : 'translateX(100%)' }}
          >
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="Close mobile menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="flex flex-col gap-4">
              <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Log In</Link>
              <Link href="/register" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700">Register</Link>
              {/* Add other mobile links here if needed */}
            </nav>
          </div>
        </>
      )}
    </header>
  );
}

