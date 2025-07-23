import React from 'react';

import { AdminProfile } from '@/(admin)/_components';
import { setMeta } from '@/_libs';

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
