import React from 'react';

import { setMeta } from '@/_libs';

import { AdminDefaultPreference } from './_components/AdminDefaultPreference';

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
