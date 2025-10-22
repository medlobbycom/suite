import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Site Settings | Admin',
  description: 'Manage common settings for the site, exams, quizzes, and content.',
};

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
