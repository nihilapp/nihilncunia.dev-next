'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';

import { SendPasscode } from '@/(auth)/auth/guard/_components/SendPasscode';
import { VerifyPasscode } from '@/(auth)/auth/guard/_components/VerifyPasscode';
import { useGuardStep } from '@/_entities/auth';
import { cn } from '@/_libs';

interface Props
  extends React.HTMLAttributes<HTMLDivElement>,
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
  const step = useGuardStep();

  return (
    <div
      className={cn(
        cssVariants({}),
        className
      )}
      {...props}
    >
      {step === 1 && <SendPasscode />}
      {step === 2 && <VerifyPasscode />}
    </div>
  );
}
