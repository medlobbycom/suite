import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Account Settings',
  description: 'Manage your profile, password, and subscription details.',
};

// Helper component to create styled sections like on the admin page
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

// Helper component for styled form inputs
const InputField = ({
  label,
  type,
  id,
  defaultValue,
  disabled = false,
}: {
  label: string;
  type: string;
  id: string;
  defaultValue: string;
  disabled?: boolean;
}) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
      {label}
    </label>
    <input
      type={type}
      id={id}
      defaultValue={defaultValue}
      disabled={disabled}
      className="block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-200 dark:disabled:bg-gray-800"
    />
  </div>
);

export default function SettingsPage() {
  // Placeholder user data - you will replace this with data from your useAuth() hook
  const user = {
    name: 'Irfan Murtaza',
    email: 'itkorai@gmail.com',
    plan: 'Pro Plan',
    memberSince: 'October 2025',
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-8">
        Account Settings
      </h1>

      {/* --- PROFILE INFORMATION SECTION --- */}
      <SettingsSection
        title="Profile Information"
        description="Update your personal details."
      >
        <InputField label="Full Name" id="fullName" type="text" defaultValue={user.name} />
        <InputField label="Email Address" id="email" type="email" defaultValue={user.email} disabled />
        <button className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          Save Changes
        </button>
      </SettingsSection>

      {/* --- CHANGE PASSWORD SECTION --- */}
      <SettingsSection
        title="Change Password"
        description="Choose a strong, new password."
      >
        <InputField label="Current Password" id="currentPassword" type="password" defaultValue="" />
        <InputField label="New Password" id="newPassword" type="password" defaultValue="" />
        <InputField label="Confirm New Password" id="confirmPassword" type="password" defaultValue="" />
        <button className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          Update Password
        </button>
      </SettingsSection>
      
      {/* --- SUBSCRIPTION SECTION --- */}
      <SettingsSection
        title="Subscription"
        description={`You are currently on the ${user.plan}.`}
      >
         <button className="px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
          Manage Subscription
        </button>
      </SettingsSection>

      {/* --- DANGER ZONE SECTION --- */}
      <SettingsSection
        title="Danger Zone"
        description="Permanently delete your account and all associated data."
      >
        <button className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
          Delete My Account
        </button>
      </SettingsSection>
    </div>
  );
}
