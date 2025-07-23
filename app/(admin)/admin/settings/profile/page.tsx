import React from 'react';

import { setMeta } from '@/_libs';

import { AdminProfile } from './_components/AdminProfile';

interface Props {}

export const metadata = setMeta({
  title: `프로필 설정`,
  url: `/admin/settings/profile`,
});

export default function AdminProfilePage() {
  return (
    <AdminProfile />
  );
}
