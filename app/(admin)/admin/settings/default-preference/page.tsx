import React from 'react';

import { AdminDefaultPreference } from '@/(admin)/_components';
import { setMeta } from '@/_libs';

interface Props {}

export const metadata = setMeta({
  title: `기본 설정`,
  url: `/admin/settings/default-preference`,
});

export default function AdminDefaultPreferencePage() {
  return (
    <AdminDefaultPreference />
  );
}
