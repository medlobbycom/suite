'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image'; // Import the Image component
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Import useRouter
import LandingHeader from '@/components/LandingHeader'; // <-- Import the header
interface LoginResponse {
  token: string;
  user: {
    id: number;
    email: string;
    name: string | null;
    role: string;
  };
}
interface LoginErrorResponse {
  message?: string;
}

export default function LoginPage() {
  const { login, user } = useAuth();
  const router = useRouter(); // Initialize router

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorData = data as LoginErrorResponse;
        throw new Error(errorData.message || 'Login failed');
      }

      const successData = data as LoginResponse;
      login(successData.user, successData.token);

      // --- ADDED REDIRECT ---
      router.push('/dashboard'); // Redirect after successful login

    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred during login.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <> 
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-white dark:from-gray-900 dark:via-gray-900 relative overflow-hidden">
      {/* Animated blobs */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <svg className="blob blob-1" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="g1" x1="0" x2="1">
              <stop offset="0%" stopColor="#7c3aed" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
          <g transform="translate(300,300)">
            <path fill="url(#g1)" d="M120,-160C156,-121,179,-76,193,-25C207,26,213,82,189,120C165,158,111,178,59,188C7,199,-44,200,-86,179C-128,158,-161,116,-178,69C-195,22,-197,-29,-170,-73C-143,-118,-86,-156,-30,-175C26,-195,53,-199,120,-160Z" />
          </g>
        </svg>
        <svg className="blob blob-2" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="g2" x1="0" x2="1">
              <stop offset="0%" stopColor="#a78bfa" />
              <stop offset="100%" stopColor="#60a5fa" />
            </linearGradient>
          </defs>
          <g transform="translate(300,300)">
            <path fill="url(#g2)" d="M100,-130C130,-90,150,-50,160,-5C170,40,170,85,145,115C121,145,73,160,28,172C-17,185,-58,195,-96,176C-135,158,-172,111,-187,60C-202,9,-195,-47,-167,-89C-139,-131,-87,-159,-35,-184C18,-210,36,-224,100,-130Z" />
          </g>
        </svg>
      </div>

<LandingHeader /> {/* <-- Add the header here */}
      {/* --- TWO COLUMN LAYOUT --- */}
      <main className="relative z-10 w-full max-w-6xl mx-auto p-4 lg:p-8 grid lg:grid-cols-3 gap-8 items-center">

        {/* --- LEFT COLUMN (INFO) --- */}
        <div className="lg:col-span-1 text-center lg:text-left">
          <Link href="/" className="inline-block mb-6">
             {/* Use the same dual-logo setup as the sidebar */}
             <img
              src="/assets/logos/logo-color.png"
              alt="MedicPortal Home"
              className="h-10 w-auto dark:hidden"
            />
            <img
              src="/assets/logos/logo-final.png"
              alt="MedicPortal Home"
              className="h-10 w-auto hidden dark:block"
            />
          </Link>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 leading-tight">
            Welcome Back to MedicPortal
          </h1>


          {/* --- IMAGE ADDED HERE --- 
          <div className="my-8 flex justify-center">
            <Image
              src="/assets/logos/medlobbysuite.png" // Replace with your desired image path
              alt="Welcome Medlobby"
              width={300}
              height={300}
              className="w-auto h-auto max-w-[300px]"
            />
          </div> */}


          <p className="text-lg text-gray-600 dark:text-gray-300">
            Your journey to mastering medical exams continues here. Access thousands of questions, track your progress, and excel.
          </p>
          {/* You could add more info or illustrations here */}
        </div>

        {/* --- RIGHT COLUMN (FORM) --- */}
        <div className="lg:col-span-2 w-full max-w-md mx-auto lg:mx-0 lg:justify-self-end">
          <div className="glass-card relative overflow-hidden rounded-2xl p-8 shadow-2xl border border-white/20">
            <div className="header mb-6 text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Sign In
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                Enter your credentials to access your account.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full px-4 py-2 rounded-lg bg-white/60 dark:bg-gray-800/60 placeholder-gray-500 border border-white/30 dark:border-gray-700/40 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 w-full px-4 py-2 rounded-lg bg-white/60 dark:bg-gray-800/60 placeholder-gray-500 border border-white/30 dark:border-gray-700/40 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-lg font-semibold text-white bg-gradient-to-r from-indigo-600 to-cyan-500 shadow hover:scale-[1.01] active:scale-[0.995] transition-transform disabled:opacity-60"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            {error && <p className="mt-4 text-center text-sm text-red-500">{error}</p>}

            <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400 space-y-2">
              <div>
                Don’t have an account?{' '}
                <Link href="/register" className="font-semibold text-indigo-600 hover:underline">
                  Register
                </Link>
              </div>
              <div>
                <Link href="/reset-password" className="font-semibold text-indigo-600 hover:underline">
                  Forgot your password?
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Styles for glass + blobs + animations */}
      <style jsx>{`
        :global(.blob) {
          position: absolute;
          width: 70vmax;
          height: 70vmax;
          filter: blur(64px) saturate(120%);
          transform-origin: center;
          opacity: 0.85;
          mix-blend-mode: screen;
        }
        :global(.blob-1) {
          left: -15%;
          top: -20%;
          animation: float-1 14s ease-in-out infinite;
        }
        :global(.blob-2) {
          right: -20%;
          bottom: -10%;
          animation: float-2 16s ease-in-out infinite;
        }

        @keyframes float-1 {
          0% { transform: translateY(0) rotate(0deg) scale(1); }
          50% { transform: translateY(-8%) rotate(6deg) scale(1.06); }
          100% { transform: translateY(0) rotate(0deg) scale(1); }
        }
        @keyframes float-2 {
          0% { transform: translateY(0) rotate(0deg) scale(1); }
          50% { transform: translateY(6%) rotate(-6deg) scale(0.96); }
          100% { transform: translateY(0) rotate(0deg) scale(1); }
        }

        .glass-card {
          background: linear-gradient(180deg, rgba(255,255,255,0.50) 0%, rgba(255,255,255,0.18) 100%);
          backdrop-filter: blur(18px) saturate(120%) contrast(1.02);
          -webkit-backdrop-filter: blur(18px) saturate(120%) contrast(1.02);
        }

        /* subtle glass sheen that slides across */
        .glass-card::before {
          content: "";
          position: absolute;
          left: -40%;
          top: -40%;
          width: 200%;
          height: 200%;
          pointer-events: none;
          background: linear-gradient(120deg, rgba(255,255,255,0.18), rgba(255,255,255,0.02) 30%, rgba(255,255,255,0.08) 60%, rgba(255,255,255,0));
          transform: rotate(-12deg);
          mix-blend-mode: overlay;
          animation: sheen 6s linear infinite;
          opacity: 0.9;
        }

        @keyframes sheen {
          0% { transform: translateX(-10%) rotate(-12deg); opacity: 0.8; }
          50% { transform: translateX(10%) rotate(-12deg); opacity: 0.95; }
          100% { transform: translateX(-10%) rotate(-12deg); opacity: 0.8; }
        }

        /* Responsive tuning */
        @media (max-width: 1023px) { /* Changed from 640px to lg breakpoint */
          :global(.blob) { display: none; } /* Hide blobs on mobile/tablet */
          main { /* Center content on smaller screens */
            grid-template-columns: 1fr;
            max-width: 28rem; /* Like max-w-md */
          }
          .lg\\:col-span-1, .lg\\:col-span-2 { /* Remove column spans on smaller screens */
             grid-column: auto / auto;
          }
          .lg\\:text-left { text-align: center; } /* Center text */
          .lg\\:justify-self-end { justify-self: auto; } /* Remove right alignment */
        }
         @media (max-width: 640px) {
          .glass-card { padding: 1.25rem; }
        }


        /* Dark-mode tuning */
        @media (prefers-color-scheme: dark) {
          .glass-card {
            background: linear-gradient(180deg, rgba(10,11,12,0.42) 0%, rgba(20,20,25,0.22) 100%);
            border-color: rgba(255,255,255,0.04);
          }
          :global(.blob) { filter: blur(64px) saturate(120%) contrast(0.9); }
        }
      `}</style>
    </div>
    </> 
  );
}
