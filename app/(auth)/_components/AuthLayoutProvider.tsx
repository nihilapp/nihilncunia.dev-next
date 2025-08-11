'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useSession } from '@/_entities/auth';

interface Props {
  children: React.ReactNode;
}

export function AuthLayoutProvider({ children, }: Props) {
  const router = useRouter();
  const { isAuthenticated, isLoading, } = useSession();

  useEffect(() => {
    // 로딩 중이 아니고 이미 인증된 상태라면 홈으로 리다이렉트
    if (!isLoading && isAuthenticated) {
      router.push('/');
    }
  }, [
    isAuthenticated,
    isLoading,
    router,
  ]);

  // 로딩 중이거나 이미 인증된 상태라면 로딩 표시
  if (isLoading || isAuthenticated) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4'></div>
          <p className='text-muted-foreground'>로딩 중...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
