'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { useRouter, useSearchParams } from 'next/navigation';
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

export function GuardComplete({ className, ...props }: Props) {
  const router = useRouter();
  const callbackUrl = useSearchParams().get('callbackUrl');

  useAuthCard('보호막 인증 완료', '인증이 성공적으로 완료되었습니다.');

  const onClickBack = () => {
    router.push(callbackUrl || '/');
  };

  return (
    <div className={cn(cssVariants({}), className)} {...props}>
      <Button onClick={onClickBack} className="w-full">
        돌아가기
      </Button>
    </div>
  );
}
