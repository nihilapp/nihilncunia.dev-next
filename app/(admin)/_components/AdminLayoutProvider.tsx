'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useSession } from '@/_entities/auth';

interface Props {
  children: React.ReactNode;
}

export function AdminLayoutProvider({ children, }: Props) {
  const router = useRouter();
  const { isAuthenticated, isLoading, sessionUser, } = useSession();

  useEffect(() => {
    // 로딩 중이 아니고 인증되지 않은 상태라면 로그인 페이지로 리다이렉트
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/signin');
      return;
    }

    // 로딩 중이 아니고 인증되었지만 관리자가 아닌 경우 홈으로 리다이렉트
    if (!isLoading && isAuthenticated && sessionUser?.role !== 'ADMIN') {
      router.push('/');
    }
  }, [
    isAuthenticated,
    isLoading,
    sessionUser?.role,
    router,
  ]);

  // 로딩 중이거나 인증되지 않은 상태라면 로딩 표시
  if (isLoading || !isAuthenticated) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4'></div>
          <p className='text-muted-foreground'>인증 확인 중...</p>
        </div>
      </div>
    );
  }

  // 관리자가 아닌 경우 로딩 표시 (리다이렉트 중)
  if (sessionUser?.role !== 'ADMIN') {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4'></div>
          <p className='text-muted-foreground'>권한 확인 중...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
