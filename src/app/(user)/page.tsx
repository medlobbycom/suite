// src/app/page.tsx
import { Metadata } from 'next';
import React from 'react'; // Import React for ReactNode type
import {
  ListChecks,   // For MCQs
  BookOpen,     // For Clinical Notes
  FileText,     // For Mock Tests
  Layers,       // For Study Material
  ScrollText,   // For Guidelines
  BarChart3,    // For Analytics/Progress
  Target,       // For Exam Prep
  Zap,          // For Featured Content
  type LucideProps, // <-- FIX 1: Import the LucideProps type
} from 'lucide-react';

// --- NEW: Page Title & SEO Description ---
export const metadata: Metadata = {
  // This will become "Medicportal" or "Welcome to Medicportal"
  // depending on your root layout's title template
  title: 'Your Medical Exam Prep Hub',
  description: 'Your complete prep hub for AMC, USMLE, PLAB, and more. Access MCQs, mock tests, clinical notes, and study material.',
};

// --- NEW: FeatureCard Component ---
// Styled to match the look of your admin page's glassmorphism blocks
const FeatureCard = ({ icon, title, description, color }: {
  icon: React.ReactElement<LucideProps>; // <-- FIX 2: Use LucideProps
  title: string;
  description: string;
  color: string; // Hex color for the icon
}) => (
  <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg rounded-xl shadow-lg p-6 flex flex-col items-start h-full">
    <div className="flex-shrink-0 mb-4">
      {/* Icon holder with a transparent version of the main color */}
      <div className="p-3 rounded-full" style={{ backgroundColor: `${color}20` }}>
        {/* Clone the icon to apply color and size */}
        {React.cloneElement(icon, { // This will now pass all checks
          className: "w-8 h-8",
          style: { color: color }
        })}
      </div>
    </div>
    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
    <p className="text-gray-700 dark:text-gray-300">{description}</p>
  </div>
);


// --- NEW: InfoListItem Component ---
// A simplified version of your ActivityFeedItem for static lists
const InfoListItem = ({ icon, title, description }: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <li className="flex items-start space-x-4 pb-4 border-b border-gray-200/50 dark:border-gray-700/50 last:border-b-0 last:pb-0">
    <div className="flex-shrink-0 mt-1">{icon}</div>
    <div>
      <h4 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h4>
      <p className="text-gray-700 dark:text-gray-300">{description}</p>
    </div>
  </li>
);


// --- Main Homepage Component ---
export default function HomePage() {
  return (
    <div className="w-full">
      {/* --- HERO SECTION --- */}
      <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
        Your All-in-One Medical Exam Prep Hub
      </h1>
      <p className="text-xl text-gray-600 dark:text-gray-300 mb-12">
        Everything you need to succeed in your AMC, USMLE, and PLAB exams.
      </p>

      {/* --- FEATURES GRID SECTION (like Admin Stats) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">

        <FeatureCard
          title="Extensive MCQ Bank"
          description="Practice with thousands of high-yield questions for AMC, USMLE, and PLAB, complete with detailed explanations."
          icon={<ListChecks />}
          color="#10b981" // Green
        />
        <FeatureCard
          title="Realistic Mock Tests"
          description="Simulate the real exam experience with timed mock tests designed to match the format and difficulty of the actual boards."
          icon={<FileText />}
          color="#3b82f6" // Blue
        />
        <FeatureCard
          title="In-Depth Clinical Notes"
          description="Access concise, high-yield clinical notes, recalls, and study materials covering all essential topics."
          icon={<BookOpen />}
          color="#f59e0b" // Amber
        />
        <FeatureCard
          title="Therapeutic Guidelines"
          description="Stay up-to-date with the latest therapeutic guidelines and protocols, integrated directly into your study flow."
          icon={<ScrollText />}
          color="#6366f1" // Indigo
        />
        <FeatureCard
          title="Study & Recall Materials"
          description="Organize your learning with dedicated study materials, flashcards, and a database of recent exam recalls."
          icon={<Layers />}
          color="#a855f7" // Purple
        />
        <FeatureCard
          title="Performance Analytics"
          description="Track your progress, identify your weaknesses, and focus your study time with our advanced analytics dashboard."
          icon={<BarChart3 />}
          color="#ef4444" // Red
        />

      </div>

      {/* --- INFO FEEDS SECTION (like Admin Feeds) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* COLUMN 1: TARGETED EXAM PREP */}
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4">
            Targeted Exam Prep
          </h2>
          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg rounded-xl shadow-lg p-6 h-full">
            <ul className="space-y-4">
              <InfoListItem
                icon={<Target className="w-5 h-5 text-blue-500" />}
                title="AMC 1 MCQs"
                description="Comprehensive question bank and recalls for the Australian Medical Council exam."
              />
              <InfoListItem
                icon={<Target className="w-5 h-5 text-red-500" />}
                title="USMLE (Step 1 & 2)"
                description="Master the US Medical Licensing Examination with our high-yield resources."
              />
              <InfoListItem
                icon={<Target className="w-5 h-5 text-green-500" />}
                title="PLAB (Part 1)"
                description="Prepare for the UK's Professional and Linguistic Assessments Board test."
              />
            </ul>
          </div>
        </div>

        {/* COLUMN 2: FEATURED RESOURCES */}
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4">
            Featured Resources
          </h2>
          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg rounded-xl shadow-lg p-6 h-full">
            <ul className="space-y-4">
              <InfoListItem
                icon={<Zap className="w-5 h-5 text-yellow-500" />}
                title="New: Cardiology Recalls"
                description="Recently added high-yield recall questions and notes for Cardiology."
              />
              <InfoListItem
                icon={<Zap className="w-5 h-5 text-purple-500" />}
                title="Hot Topic: Endocrinology"
                description="Deep dive into our most popular Endocrinology clinical notes and guidelines."
              />
              <InfoListItem
                icon={<Zap className="w-5 h-5 text-cyan-500" />}
                title="Updated: Paediatrics Guidelines"
                description="Therapeutic guidelines for Paediatrics have been updated for the new year."
              />
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}