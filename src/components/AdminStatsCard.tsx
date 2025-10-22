// apps/frontend/src/components/AdminStatsCard.tsx
import { ArrowRight } from 'lucide-react';

interface AdminStatsCardProps {
  title: string;
  count: number | string;
  icon: React.ReactNode;
  href: string;
  color: string;
}

export default function AdminStatsCard({
  title,
  count,
  icon,
  href,
  color,
}: AdminStatsCardProps) {
  return (
    <a
      href={href}
      className={`
        flex flex-col justify-between p-6 rounded-xl shadow-lg 
        bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg 
        transform transition-all duration-300 hover:scale-[1.03]
        border-t-4
      `}
      style={{ borderTopColor: color }}
    >
      <div className="flex items-start justify-between">
        <div>
          {/* Main Count/Stat */}
          <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-1">
            {count}
          </h3>
          {/* Card Title */}
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
            {title}
          </p>
        </div>
        
        {/* Icon */}
        <div className={`p-3 rounded-full text-white`} style={{ backgroundColor: color }}>
          {icon}
        </div>
      </div>

      {/* Footer link/action */}
      <div className="mt-4 flex items-center text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
        Manage Section
        <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
      </div>
    </a>
  );
}