'use client';

import React from 'react';

import { useAuthCard } from '@/_entities/auth';
import { cn } from '@/_libs';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function NewPassword({ className, ...props }: Props) {
  useAuthCard('새 비밀번호 설정', '새로 사용할 비밀번호를 입력해주세요.');

  return (
    <div className={cn(className)} {...props}>
      content
    </div>
  );
}
