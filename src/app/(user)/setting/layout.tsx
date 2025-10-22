import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Account Settings | MedicPortal',
  description: 'Manage your profile, password, and subscription details.',
};

export default function SettingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
