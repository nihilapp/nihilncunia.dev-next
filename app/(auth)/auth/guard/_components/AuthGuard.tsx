'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';

import { VerifyPasscode } from '@/(auth)/auth/guard/_components/VerifyPasscode';
import { useAuthActions, useGuardStep } from '@/_entities/auth';
import { cn } from '@/_libs';

import { SendPasscode } from './SendPasscode';

interface Props
  extends React.FormHTMLAttributes<HTMLFormElement>,
  VariantProps<typeof cssVariants> {
  className?: string;
}

const cssVariants = cva(
  [ ``, ],
  {
    variants: {},
    defaultVariants: {},
    compoundVariants: [],
  }
);

export function AuthGuard({ className, ...props }: Props) {
  // 절차를 나타내는 스토어 변수
  const step = useGuardStep();

  return (
    <div>
      {step === 1 && <SendPasscode />}
      {step === 2 && <VerifyPasscode />}
    </div>
  );
}
