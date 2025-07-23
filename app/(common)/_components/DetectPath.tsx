'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface Props {
  isAuthGuard?: boolean;
}

export function DetectPath({ isAuthGuard = false, }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // auth/guard 페이지에서는 리다이렉트하지 않음
    if (isAuthGuard) {
      return;
    }

    // 인증이 필요한 경로 패턴들
    const protectedPaths = [
      /^\/admin(\/.*)?$/, // /admin 경로 전부 포함
      /^\/blogs\/[^/]+\/admin(\/.*)?$/, // /blogs/[blog_id]/admin 경로 전부 포함
      /^\/auth(?!\/guard)(\/.*)?$/, // /auth 경로 전부 포함하되 /auth/guard는 제외
    ];

    // 현재 경로가 보호된 경로인지 확인
    const isProtectedPath = protectedPaths.some((pattern) => pattern.test(pathname));

    // 보호된 경로이고 auth/guard가 아닌 경우 리다이렉트
    if (isProtectedPath) {
      router.push(`/auth/guard?callback=${pathname}`);
    }
  }, [
    pathname,
    isAuthGuard,
    router,
  ]);

  return null;
}
