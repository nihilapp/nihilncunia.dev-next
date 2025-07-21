'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { useRouter } from 'next/navigation';
import React from 'react';

import { cn } from '@/_libs';

interface Props
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
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

export function SignOutButton({ className, ...props }: Props) {
  const router = useRouter();

  const onClickSignOut = () => {
    // TODO: Supabase Auth 로그아웃 구현 필요
    router.push('/auth/signin');
  };

  return (
    <button
      className={cn(
        cssVariants({}),
        className
      )}
      {...props}
      onClick={onClickSignOut}
    >
      로그아웃
    </button>
  );
}
