import { ManageUsersClient } from '@/components/dashboard/ManageUsersClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Manage Users | Admin | CrowdFund',
};

export default function ManageUsersPage() {
  return <ManageUsersClient />;
}
