// apps/frontend/src/app/admin/page.tsx
import { Metadata } from 'next';
import {
  ListChecks,
  BookOpen,
  FileText,
  ClipboardList,
  Layers,
  MessageCircle,
  Clock, // Used for Recent Activity
  MonitorPlay, // Used for Recent Sessions
} from 'lucide-react';
import AdminStatsCard from '@/components/AdminStatsCard';
import React from 'react'; // Import React for ReactNode type

// --- NEW: Page Title & SEO Description ---
export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Manage questions, users, sessions, and system settings.',
};

// Helper function to simulate formatted date/time (e.g., YYYY-MM-DD @ HH:MM AM/PM)
const formatDate = (daysAgo: number, timeString: string) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);

  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');

  return `${yyyy}-${mm}-${dd} @ ${timeString}`;
};


// --- PLACEHOLDER DATA ---

// 1. Recent Sessions (User progress/test status)
const recentSessions = [
  { user: 'Babar A.', action: 'Created a new', type: 'Session', course: 'Basic Science', time: '1 minute ago', status: 'info', timestamp: formatDate(0, '10:25 AM') },
  { user: 'Irfan S.', action: 'Completed a', type: 'Mock Test', course: 'Clinical Medicine', time: '15 minutes ago', status: 'success', timestamp: formatDate(0, '10:10 AM') },
  { user: 'Sarah K.', action: 'Failed a', type: 'Quiz', course: 'GPRA Clinical Cases', time: '1 hour ago', status: 'warning', timestamp: formatDate(0, '9:25 AM') },
  { user: 'Ali Z.', action: 'Resumed a', type: 'Session', course: 'AMC MCQ Ed 1', time: '5 hours ago', status: 'info', timestamp: formatDate(0, '5:25 AM') },
];

// 2. Recent Activity (Admin/System changes)
const recentActivity = [
  { user: 'Admin User', action: 'Archived 5 old Questions.', time: '10 minutes ago', status: 'warning', timestamp: formatDate(0, '10:15 AM') },
  { user: 'System Bot', action: 'Ran scheduled database optimization.', time: '3 hours ago', status: 'success', timestamp: formatDate(0, '7:22 AM') },
  { user: 'Zainab M.', action: 'Logged in and checked user statistics.', time: '1 day ago', status: 'info', timestamp: formatDate(1, '04:00 PM') },
  { user: 'David W.', action: 'Published a new Study Material pack.', time: '2 days ago', status: 'success', timestamp: formatDate(2, '11:45 AM') },
];


const getColorClass = (status: string) => {
  switch (status) {
    case 'success': return 'text-green-500 dark:text-green-400';
    case 'warning': return 'text-yellow-500 dark:text-yellow-400';
    case 'info': return 'text-blue-500 dark:text-blue-400';
    default: return 'text-gray-500 dark:text-gray-400';
  }
};

// --- FIX: Define Interface for ActivityFeedItem Props ---
interface ActivityFeedItemProps {
  icon: React.ReactNode;
  timestamp: string;
  user: string;
  action: string;
  type?: string; // Optional for sessions
  course?: string; // Optional for sessions
}

// --- FIX: Remove 'status' from destructuring, use the Interface ---
const ActivityFeedItem = ({ icon, timestamp, user, action, type, course }: ActivityFeedItemProps) => (
  <li
    className="border-b border-gray-200/50 dark:border-gray-700/50 pb-4 last:border-b-0 last:pb-0"
  >
    <div className="flex items-start space-x-4 mb-1">
      {icon}
      {/* Display Formatted Timestamp */}
      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium flex-shrink-0">
        {timestamp}
      </p>
    </div>
    <p className="text-gray-900 dark:text-white font-medium pl-9">
      <span className="font-bold mr-1">{user}</span>
      {action}
      {type && <span className="font-bold mx-1">{type}</span>}
      {course && <> in <span className="text-sm font-semibold italic text-gray-700 dark:text-gray-300">{course}</span>.</>}
    </p>
  </li>
);

export default function AdminPage() {
  return (
    <div className="w-full">
      <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-8">
        Admin Dashboard
      </h1>

      {/* --- STATS CARDS SECTION --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">

        <AdminStatsCard title="Questions" count="12,450" icon={<ListChecks className="w-6 h-6" />} href="/admin/questions" color="#10b981" />
        <AdminStatsCard title="Mock Tests" count="12" icon={<FileText className="w-6 h-6" />} href="/admin/mock-tests" color="#3b82f6" />
        <AdminStatsCard title="Study Material" count="480" icon={<BookOpen className="w-6 h-6" />} href="/admin/study-material" color="#f59e0b" />
        <AdminStatsCard title="Quiz Categories" count="235" icon={<Layers className="w-6 h-6" />} href="/admin/quizzes" color="#ef4444" />
        <AdminStatsCard title="User Annotations" count="980" icon={<MessageCircle className="w-6 h-6" />} href="/admin/notes" color="#6366f1" />
        <AdminStatsCard title="Active Users" count="1,200" icon={<ClipboardList className="w-6 h-6" />} href="/admin/users" color="#a855f7" />

      </div>

      {/* --- RECENT FEEDS SECTION (RESPONSIVE 1 OR 2 COLUMNS) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* COLUMN 1: RECENT SESSIONS */}
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4">
            Recent Sessions
          </h2>

          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg rounded-xl shadow-lg p-6 h-full">
            <ul className="space-y-4">
              {recentSessions.map((session, index) => (
                <ActivityFeedItem
                  key={index}
                  icon={<MonitorPlay className={`w-5 h-5 mt-1 flex-shrink-0 ${getColorClass(session.status)}`} />} // getColorClass is used here
                  timestamp={session.timestamp}
                  user={session.user}
                  action={session.action}
                  type={session.type}
                  course={session.course}
                />
              ))}
            </ul>
          </div>
        </div>

        {/* COLUMN 2: RECENT ACTIVITY */}
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4">
            Recent Activity
          </h2>

          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg rounded-xl shadow-lg p-6 h-full">
            <ul className="space-y-4">
              {recentActivity.map((activity, index) => (
                <ActivityFeedItem
                  key={index}
                  icon={<Clock className={`w-5 h-5 mt-1 flex-shrink-0 ${getColorClass(activity.status)}`} />} // getColorClass is used here
                  timestamp={activity.timestamp}
                  user={activity.user}
                  action={activity.action}
                />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}