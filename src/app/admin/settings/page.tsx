'use client'; // We need state for the toggle switches
import React, { useState } from 'react';

// --- Reusable Helper Components ---

// Card style from settings/support page
const SettingsSection = ({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) => (
  <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg rounded-xl shadow-lg p-6 mb-8">
    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{title}</h2>
    <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">{description}</p>
    <div className="space-y-4">{children}</div>
  </div>
);

// Form input style
const InputField = ({
  label,
  type,
  id,
  defaultValue,
}: {
  label: string;
  type: string;
  id: string;
  defaultValue: string;
}) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
      {label}
    </label>
    <input
      type={type}
      id={id}
      defaultValue={defaultValue}
      className="block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
    />
  </div>
);

// Toggle switch component
const ToggleSwitch = ({
  label,
  id,
  enabled,
  setEnabled,
}: {
  label: string;
  id: string;
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
}) => (
  <div className="flex items-center justify-between">
    <label htmlFor={id} className="text-sm font-medium text-gray-900 dark:text-gray-100">
      {label}
    </label>
    <button
      id={id}
      onClick={() => setEnabled(!enabled)}
      className={`${
        enabled ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'
      } relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
    >
      <span
        className={`${
          enabled ? 'translate-x-6' : 'translate-x-1'
        } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
      />
    </button>
  </div>
);

// --- Main Page Component ---
export default function AdminSettingsPage() {
  // --- States for our toggles ---
  // You would fetch these initial values from your API
  const [mocksEnabled, setMocksEnabled] = useState(true);
  const [studyMaterialEnabled, setStudyMaterialEnabled] = useState(true);
  const [learningPointsEnabled, setLearningPointsEnabled] = useState(true);
  const [notesEnabled, setNotesEnabled] = useState(true);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-8">
        Site Settings
      </h1>

      {/* --- GENERAL SETTINGS --- */}
      <SettingsSection
        title="General Settings"
        description="Manage the public-facing name and title of the site."
      >
        <InputField label="Site Name" id="siteName" type="text" defaultValue="MedicPortal" />
        <InputField label="Site Title" id="siteTitle" type="text" defaultValue="MedicPortal | Your Medical Exam Hub" />
        <button className="mt-2 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          Save General Settings
        </button>
      </SettingsSection>

      {/* --- EXAM & QUIZ SETTINGS --- */}
      <SettingsSection
        title="Module Settings"
        description="Enable or disable entire sections of the application."
      >
        <ToggleSwitch label="Mock Exams" id="mocksToggle" enabled={mocksEnabled} setEnabled={setMocksEnabled} />
        <ToggleSwitch label="Quiz (Qbank)" id="quizToggle" enabled={true} setEnabled={() => {}} />
        <ToggleSwitch label="Study Material" id="studyMaterialToggle" enabled={studyMaterialEnabled} setEnabled={setStudyMaterialEnabled} />
        <ToggleSwitch label="Learning Points" id="learningPointsToggle" enabled={learningPointsEnabled} setEnabled={setLearningPointsEnabled} />
        <ToggleSwitch label="User Notes" id="notesToggle" enabled={notesEnabled} setEnabled={setNotesEnabled} />
        <button className="mt-2 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          Save Module Settings
        </button>
      </SettingsSection>
    </div>
  );
}
