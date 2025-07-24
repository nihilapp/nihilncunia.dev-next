'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';

import { Button } from '@/(common)/_components/ui/button';
import { cn } from '@/_libs';

interface Props
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof cssVariants> {
  className?: string;
}

const cssVariants = cva(
  [ `flex flex-col items-center justify-center space-y-4 p-6`, ],
  {
    variants: {},
    defaultVariants: {},
    compoundVariants: [],
  }
);

export function SendPasscode({ className, ...props }: Props) {
  const handleSendPasscode = async () => {
    // TODO: 패스코드 전송 로직 구현
    console.log('패스코드 전송');
  };

  return (
    <div
      className={cn(
        cssVariants({}),
        className
      )}
      {...props}
    >
      <h2 className='text-2xl font-bold text-center'>
        인증 코드 전송
      </h2>

      <p className='text-center text-gray-600'>
        인증 코드를 전송하시겠습니까?
      </p>

      <Button
        onClick={handleSendPasscode}
        className='w-full max-w-xs'
      >
        인증 코드 전송
      </Button>
    </div>
  );
}
