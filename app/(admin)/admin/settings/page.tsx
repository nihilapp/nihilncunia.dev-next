import React from 'react';

import { AdminSettings } from '@/(admin)/_components';
import { setMeta } from '@/_libs';

interface Props {}

export const metadata = setMeta({
  title: `설정`,
  url: `/admin/settings`,
});

export default function AdminSettingsPage() {
  return (
    <AdminSettings />
    // asd
  );
}
