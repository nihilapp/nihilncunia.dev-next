'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { useRouter } from 'next/navigation';
import React from 'react';

import { Button } from '@/(common)/_components/ui/button';
import { useAuthCard } from '@/_entities/auth';
import { cn } from '@/_libs';

interface Props
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cssVariants> {
  className?: string;
}

const cssVariants = cva([``], {
  variants: {},
  defaultVariants: {},
  compoundVariants: [],
});

export function SignUpComplete({ className, ...props }: Props) {
  const router = useRouter();

  useAuthCard(
    '계정 생성 완료',
    '계정 생성이 성공적으로 완료되었습니다. 로그인 페이지로 이동해주세요.'
  );

  const onClickSignIn = () => {
    router.push('/auth/signin');
  };

  return (
    <div className={cn(cssVariants({}), className)} {...props}>
      <Button onClick={onClickSignIn} className="w-full">
        로그인 페이지로
      </Button>
    </div>
  );
}
