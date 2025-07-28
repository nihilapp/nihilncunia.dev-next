'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { checkGuardStatus } from '@/(auth)/auth/guard/_actions/check-guard-status';

interface Props {
  isAuthGuard?: boolean;
}

export function DetectPath({ isAuthGuard = false, }: Props) {
  const router = useRouter();

  useEffect(() => {
    const checkAuthStatus = async () => {
      if (isAuthGuard) {
        const { isCompleted, } = await checkGuardStatus();
        if (isCompleted) {
          router.push('/');
        }
      }
    };

    checkAuthStatus();
  }, [
    isAuthGuard,
    router,
  ]);

  return null;
}
