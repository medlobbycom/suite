'use client';

import { useTheme } from 'next-themes';
import { Sun, Moon, Monitor } from 'lucide-react'; // Import the new icon

export default function ThemeToggle() {
  // theme = the currently SET theme ("light", "dark", or "system")
  const { theme, setTheme } = useTheme();

  // New cycle logic: light -> dark -> system -> light
  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="relative flex items-center justify-center h-10 w-10 rounded-full hover:bg-white/50 dark:hover:bg-gray-700/50"
      aria-label="Toggle theme"
    >
      {/* We now use the 'theme' state to control visibility, not the 'dark:' variant */}
      <Sun
        className={`h-6 w-6 absolute transition-all ${
          theme === 'light' ? 'scale-100' : 'scale-0'
        } text-gray-800`}
      />
      <Moon
        className={`h-6 w-6 absolute transition-all ${
          theme === 'dark' ? 'scale-100' : 'scale-0'
        } text-gray-200`}
      />
      <Monitor
        className={`h-6 w-6 absolute transition-all ${
          theme === 'system' ? 'scale-100' : 'scale-0'
        } text-gray-500`}
      />
    </button>
  );
}
