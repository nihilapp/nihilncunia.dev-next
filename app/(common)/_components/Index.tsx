'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function Index() {
  const router = useRouter();

  useEffect(() => {
    router.push('/home');
  }, [ router, ]);

  return '';
}
