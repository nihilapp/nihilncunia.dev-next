'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/(common)/_components/ui/card';
import { cn } from '@/_libs';

interface Props
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof cssVariants> {
  className?: string;
}

const cssVariants = cva(
  [ `w-full max-w-md`, ],
  {
    variants: {},
    defaultVariants: {},
    compoundVariants: [],
  }
);

export function AuthCard({ className, children, ...props }: Props) {
  return (
    <main
      className={cn(
        cssVariants({}),
        className
      )}
      {...props}
    >
      <Card className='border-0 shadow-lg bg-white'>
        <CardHeader className='pb-6'>
          <CardTitle className='text-xl font-semibold text-gray-900 text-center'>
            회원가입
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-6'>
          {children}
        </CardContent>
      </Card>
    </main>
  );
}
