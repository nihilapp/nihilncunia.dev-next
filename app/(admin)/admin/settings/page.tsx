import React from 'react';

import { setMeta } from '@/_libs';

import { AdminSettings } from './_components/AdminSettings';

interface Props {}

export const metadata = setMeta({
  title: `설정`,
  url: `/admin/settings`,
});

export default function AdminSettingsPage() {
  return (
    <AdminSettings />
  );
}
