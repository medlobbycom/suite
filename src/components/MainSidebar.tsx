// src/components/MainSidebar.tsx
'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  LayoutGrid,
  Shield,
  Bookmark,
  History,
HelpCircle,
ListChecks,
  GraduationCap,
  Grid3x3, // Icon for 'All Resources'
   Home,    // <-- ADD THIS

} from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import AllResourcesPopup from './AllResourcesPopup'; // Import the popup
import Link from 'next/link';

import { useAuth } from '@/context/AuthContext'; // <-- ADD THIS
interface MainSidebarProps {
  isOpen: boolean;
  onClose: () => void; // Add this prop
}

export default function MainSidebar({ isOpen, onClose }: MainSidebarProps) {
  const pathname = usePathname();
  const [isPopupOpen, setPopupOpen] = useState(false); 
const { user } = useAuth(); // <-- ADD THIS
  const navLinkBase =
    'flex items-center gap-3 p-3 rounded-lg font-medium whitespace-nowrap transition-colors duration-150';
  const activeStyle =
    'bg-gray-200/50 dark:bg-gray-700/50 text-gray-900 dark:text-white';
  const inactiveStyle =
    'text-gray-700 dark:text-gray-300 hover:bg-gray-200/30 dark:hover:bg-gray-700/30';


  // New handler: Only close the sidebar if we're on a mobile screen
  const handleLinkClick = () => {
    if (window.innerWidth < 1024) { // 1024px is the 'lg' breakpoint
      onClose();
    }
  };



  return (
    <>
      <aside
        className={`


          bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg
          h-full fixed top-0 left-0 z-40



          flex flex-col




         overflow-hidden
          transition-all duration-300 ease-in-out
          lg:sticky lg:h-screen ${/* Desktop behavior */ ''}
          w-80 p-6 ${/* Mobile is always w-80 */ ''}
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} ${/* Mobile position toggle */ ''}
          lg:translate-x-0 ${/* Desktop always in place */ ''}
          ${isOpen ? 'lg:w-80 lg:p-6' : 'lg:w-0 lg:p-0'} ${/* Desktop width toggle */ ''}




        `}
      >
        {/* --- SEGMENT 1: LOGO & ALL RESOURCES BUTTON --- */}
        <div className="flex items-center justify-between mb-4">
          {/* Main Logo */}
         





          <Link
            href="/"
            className="text-gray-800 dark:text-white"
            aria-label="MedicPortal Home"
          >
            {/* 1. Light Mode Logo (Visible by default, hidden in dark mode) */}
            {/* REPLACE this src with your dark-text logo */}
            <img
              src="/assets/logos/logo-color.png"
              alt="MedicPortal Home"
              className="h-9 w-auto dark:hidden"
            />
            {/* 2. Dark Mode Logo (Your original white logo) */}
            {/* This is hidden by default, and shown in dark mode */}
            <img
              src="/assets/logos/logo-final.png"
              alt="MedicPortal Home"
              className="h-9 w-auto hidden dark:block"
            />
          </Link>










          {/* "All Resources" Button */}
          <button
            onClick={() => setPopupOpen(true)}
            className={`p-2 rounded-lg ${inactiveStyle}`}
            aria-label="All Resources"
          >
            <Grid3x3 className="h-5 w-5" />
          </button>
        </div>

        {/* This div contains all the scrolling content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden pr-2">
          
          {/* --- SEGMENT 3: "MEDICPORTAL" CARD --- */}
          <div
            className="flex flex-col gap-3 rounded-lg shadow-md p-4"
            style={{
              backgroundImage:
                'radial-gradient(100% 150% at 50% 100%, rgba(214, 139, 255, 0.333), transparent)',
            }}
          >
            <div className="w-9 h-9">
              <svg viewBox="0 0 57 39" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <radialGradient
                    cy="0%"
                    fx="50%"
                    fy="0%"
                    r="100%"
                    gradientTransform="matrix(0 1 -1.27449 0 .5 -.5)"
                    id="logo-grad-1"
                  >
                    <stop stopColor="#42AAFF" offset="0%"></stop>
                    <stop stopColor="#D68BFF" offset="73.527%"></stop>
                    <stop stopColor="#D68BFF" offset="100%"></stop>
                  </radialGradient>
                  <radialGradient
                    cx="37.009%"
                    cy="9.353%"
                    fx="37.009%"
                    fy="9.353%"
                    r="142.638%"
                    gradientTransform="matrix(.09108 .97623 -.83927 .4434 .415 -.31)"
                    id="logo-grad-2"
                  >
                    <stop stopColor="#42AAFF" offset="0%"></stop>
                    <stop stopColor="#D68BFF" offset="63.473%"></stop>
                    <stop stopColor="#D68BFF" offset="100%"></stop>
                  </radialGradient>
                </defs>
                <g
                  transform="translate(.834 .3)"
                  fill="none"
                  fillRule="evenodd"
                >
                  <path
                    d="M8.95 16.657v13.72c0 4.21 8.406 7.623 18.775 7.623 10.37 0 18.775-3.413 18.775-7.622v-13.72"
                    fill="url(#logo-grad-1)"
                  ></path>
                  <path
                    d="M54.124 9.694L31.9.804a11.24 11.24 0 0 0-8.35 0L1.325 9.694a2.108 2.108 0 0 0 0 3.914l22.225 8.89a11.24 11.24 0 0 0 8.35 0l22.224-8.89a2.108 2.108 0 0 0 0-3.914z"
                    fill="url(#logo-grad-2)"
                  ></path>
                </g>
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-white whitespace-nowrap">
              MedicPortal
            </h3>
          </div>

          {/* --- SEGMENT 2: MAIN NAV --- */}
          <nav className="flex flex-col gap-2 mt-4">
       


{/* --- Dashboard Link (This one was correct) --- */}
  <Link
    href="/dashboard"
    onClick={handleLinkClick}
    className={`${navLinkBase} ${
      pathname.startsWith('/dashboard') ? activeStyle : inactiveStyle
    }`}
  >
    <LayoutGrid className="h-5 w-5" />
    <span>Dashboard</span>
  </Link>

  {/* --- Question Bank Link (FIXED) --- */}
  <Link
    href="/clinical/qbank"
    onClick={handleLinkClick}
    className={`${navLinkBase} ${
      // FIX 1: Changed from '/dashboard' to '/clinical/qbank'
      pathname.startsWith('/clinical/qbank') ? activeStyle : inactiveStyle
    }`}
  >
    {/* FIX 2: Changed icon from LayoutGrid to ListChecks */}
    <ListChecks className="h-5 w-5" /> 
    <span>Question Bank</span>
  </Link>






          </nav>

          {/* --- DIVIDER --- */}
          <hr className="my-4 border-gray-300 dark:border-gray-700" />



          {/* --- SEGMENT 4: SECONDARY NAV --- */}
          <nav className="flex flex-col gap-2">
         

<Link
  href="/history"
  onClick={handleLinkClick}
  className={`${navLinkBase} ${
    pathname === '/history' ? activeStyle : inactiveStyle
  }`}
>
  <History className="h-5 w-5" />
  <span>Session History</span>
</Link>


            <a href="#" onClick={handleLinkClick} className={`${navLinkBase} ${inactiveStyle}`}>
              
              <Bookmark className="h-5 w-5" />
              <span>Saved Items</span>
            </a>
            
           {/* --- Session History Link --- */}




            <a href="#" onClick={handleLinkClick} className={`${navLinkBase} ${inactiveStyle}`}>
              <GraduationCap className="h-5 w-5" />
              <span>Learning Points</span>
            </a>



  {/* --- Admin Link (FIXED) --- */}



 {/* --- CONDITIONAL ADMIN LINK --- */}
 {user && user.role === 'ADMIN' && (
   <Link
     href="/admin"
     onClick={handleLinkClick}
     className={`${navLinkBase} ${
       pathname.startsWith('/admin') ? activeStyle : inactiveStyle
     }`}
   >
     <Home className="h-5 w-5" />
     <span>Admin Home</span>
   </Link>
 )}
 {/* --- END CONDITIONAL LINK --- */}
        


          </nav>
        </div>

        {/* --- SEGMENT 5: FOOTER (pinned to bottom) --- */}
        <footer className="mt-auto pt-4">
          
          {/* "Refer a Friend" Card */}
          <div className="bg-gray-200/50 dark:bg-gray-700/50 p-4 rounded-lg flex items-start gap-3 mb-4">
            <span className="text-xl">🎁</span>
            <div className="flex flex-col">
              <strong className="text-sm text-gray-900 dark:text-white whitespace-nowrap">
                Refer a Friend
              </strong>
              <span className="text-xs text-gray-600 dark:text-gray-300">
                Give a free month, get a free month.
              </span>
            </div>
          </div>

          {/* Theme Toggle & Links */}
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <a
              href="#"
              className="text-xs text-gray-600 dark:text-gray-400 hover:underline whitespace-nowrap"
            >
              Privacy
            </a>
            <a
              href="#"
              className="text-xs text-gray-600 dark:text-gray-400 hover:underline whitespace-nowrap"
            >
              Terms
            </a>
          </div>
        </footer>
      </aside>

      {/* --- RENDER THE POPUP --- */}
      <AllResourcesPopup
        isOpen={isPopupOpen}
        onClose={() => setPopupOpen(false)}
      />
    </>
  );
}