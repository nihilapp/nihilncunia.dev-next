import React from 'react';

import { setMeta } from '@/_libs';

import { AuthGuard } from './_components/AuthGuard';

interface Props {}

export const metadata = setMeta({
  title: `보호막`,
  url: `/auth/guard`,
});

export default function AuthGuardPage() {
  return (
    <AuthGuard />
  );
}
