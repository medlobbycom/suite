'use client';

import { Menu, LogOut, Settings, LifeBuoy } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import Link from 'next/link'; // Import Link
import { useState, useEffect, useRef } from 'react';

interface MainHeaderProps {
  toggleSidebar: () => void;
  userName: string;
  userRole: string;
  onLogout: () => void;
}

export default function MainHeader({
  toggleSidebar,
  userName,
  userRole,
  onLogout,
}: MainHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // --- DEBUG LOGS ---
  console.log('MainHeader Rendered. Props received:');
  console.log('userName:', userName);
  console.log('userRole:', userRole);
  // --- END DEBUG LOGS ---

  const isLoggedIn = userName !== 'Guest' && userName !== 'Loading...';

  // --- DEBUG LOG ---
  console.log('isLoggedIn calculated as:', isLoggedIn);
  // --- END DEBUG LOG ---

  const userInitial =
    userName && userName.length > 0 && isLoggedIn
      ? userName.charAt(0).toUpperCase()
      : '?';

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuRef]);

  return (
    <header className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg p-4 shadow-md sticky top-0 z-10 border-b border-white/20 dark:border-gray-700/20">
      <div className="flex justify-between items-center">
        {/* Left Side */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-full hover:bg-white/50 dark:hover:bg-gray-700/50"
            aria-label="Toggle Sidebar"
          >
            <Menu className="h-6 w-6 text-gray-800 dark:text-gray-200" />
          </button>
          <div className="hidden sm:block text-xl font-bold text-gray-800 dark:text-white">
            MedicPortal
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          <div className="relative" ref={menuRef}>
            {/* --- START FIX: Conditionally render Link or Button --- */}
            {!isLoggedIn ? (
              // --- GUEST VERSION (LOGIN/REGISTER LINKS) ---
              <div className="flex items-center gap-2">
                <Link href="/login" aria-label="Login">
                  <div // Use a div styled like a button
                    className={`flex items-center gap-3 px-3 py-1.5 rounded-full cursor-pointer bg-gray-200/50 dark:bg-gray-700/50 hover:bg-gray-200 dark:hover:bg-gray-700`}
                  >
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                      Login
                    </span>
                  </div>
                </Link>
                <Link href="/register" aria-label="Register">
                  <div // Use a div styled like a button
                    className={`flex items-center gap-3 px-3 py-1.5 rounded-full cursor-pointer bg-indigo-100/60 dark:bg-indigo-900/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/60`}
                  >
                    <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">
                      Register
                    </span>
                  </div>
                </Link>
              </div>
            ) : (
              // --- LOGGED-IN VERSION (ORIGINAL BUTTON) ---
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`flex items-center gap-3 px-3 py-1.5 rounded-full bg-indigo-100/60 dark:bg-indigo-900/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 cursor-pointer`}
                aria-expanded={isMenuOpen}
                aria-haspopup="true"
              >
                {/* Name and Role Stack */}
                <div className="flex flex-col items-start leading-tight text-left">
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate max-w-[120px] sm:max-w-[180px]">
                    {userName}
                  </span>
                  {/* ROLE DISPLAY */}
                  <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium truncate max-w-[120px] sm:max-w-[180px]">
                    {userRole}
                  </span>
                </div>
                {/* Avatar Initial */}
                <div
                  className={`w-8 h-8 rounded-full bg-indigo-500 dark:bg-indigo-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}
                >
                  {userInitial}
                </div>
              </button>
            )}
            {/* --- END FIX --- */}

            {/* Dropdown Menu */}
            {isLoggedIn && isMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-700 rounded-lg shadow-xl py-2 z-20 border border-gray-200 dark:border-gray-600">
                {/* --- FIX: Changed to Link --- */}
                <Link
                  href="/setting"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 text-left"
                >
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </Link>
                {/* --- FIX: Changed to Link --- */}
                <Link
                  href="/support"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 text-left"
                >
                  <LifeBuoy className="h-4 w-4" />
                  <span>Contact Support</span>
                </Link>
                <hr className="my-1 border-gray-200 dark:border-gray-600" />
                <button
                  onClick={() => {
                    onLogout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-gray-600 text-left"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
          {/* <ThemeToggle /> Theme white mode */}
        </div>
      </div>
    </header>
  );
}

