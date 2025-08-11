'use client';

import { useSession } from '@/_entities/auth';

interface Props {
  children: React.ReactNode;
}

export function SessionProvider({ children, }: Props) {
  // 세션 초기화 (전역에서 세션 상태 관리)
  useSession();

  return <>{children}</>;
}
