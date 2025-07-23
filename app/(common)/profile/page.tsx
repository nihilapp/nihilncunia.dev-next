import React from 'react';

import { Profile } from '@/(common)/_components';
import { setMeta } from '@/_libs';

interface Props {
  params: Promise<{ username: string }>;
}

export const metadata = setMeta({
  title: `'NIHILncunia'의 프로필`,
  url: '/profile',
});

export default async function ProfilePage({ params, }: Props) {
  const { username, } = await params;
  return <Profile username={username} />;
}
