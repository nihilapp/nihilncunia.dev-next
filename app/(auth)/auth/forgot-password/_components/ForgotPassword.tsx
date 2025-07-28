'use client';

import React from 'react';

import { useAuthCard } from '@/_entities/auth';
import { cn } from '@/_libs';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function ForgotPassword({ className, ...props }: Props) {
  useAuthCard('비밀번호 찾기', '비밀번호 재설정 링크를 받을 이메일 주소를 입력하세요.');

  return (
    <div className={cn(className)} {...props}>
      Forgot Password Page Content
    </div>
  );
}
