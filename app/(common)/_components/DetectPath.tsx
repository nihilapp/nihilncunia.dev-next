'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { checkSession } from '@/(common)/_actions/check-session';

interface Props {
  isAuthGuard?: boolean;
}

export function DetectPath({ isAuthGuard = false, }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      // auth/guard 페이지에서는 리다이렉트하지 않음
      if (isAuthGuard) {
        return;
      }

      // 인증이 필요한 경로 패턴들
      const protectedPaths = [
        /^\/admin(\/.*)?$/, // /admin 경로 전부 포함
        /^\/blogs\/[^/]+\/admin(\/.*)?$/, // /blogs/[blog_id]/admin 경로 전부 포함
        /^\/auth(?!\/guard|\/guard\/complete)(\/.*)?$/, // /auth 경로 전부 포함하되 /auth/guard와 /auth/guard/complete는 제외
      ];

      // 현재 경로가 보호된 경로인지 확인
      const isProtectedPath = protectedPaths.some((pattern) => pattern.test(pathname));

      // 보호된 경로인 경우 세션 확인
      if (isProtectedPath) {
        const { hasSession, } = await checkSession();

        // 세션이 없는 경우에만 패스코드 검증으로 리다이렉트
        if (!hasSession) {
          router.push(`/auth/guard?callback=${pathname}`);
        }
      }
    };

    checkAuth();
  }, [
    pathname,
    isAuthGuard,
    router,
  ]);

  return null;
}
