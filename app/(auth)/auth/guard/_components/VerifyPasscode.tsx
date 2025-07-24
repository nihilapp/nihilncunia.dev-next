'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';

import { Button } from '@/(common)/_components/ui/button';
import { Input } from '@/(common)/_components/ui/input';
import { Label } from '@/(common)/_components/ui/label';
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

export function VerifyPasscode({ className, ...props }: Props) {
  const [
    passCode,
    setPassCode,
  ] = React.useState('');

  const handleVerifyPasscode = async () => {
    if (!passCode.trim()) {
      alert('인증 코드를 입력해주세요.');
      return;
    }

    // TODO: 패스코드 검증 로직 구현
    console.log('패스코드 검증:', passCode);
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
        인증 코드 확인
      </h2>

      <p className='text-center text-gray-600'>
        전송된 인증 코드를 입력해주세요.
      </p>

      <div className='w-full max-w-xs space-y-2'>
        <Label htmlFor='passCode'>
          인증 코드
        </Label>

        <Input
          id='passCode'
          type='text'
          value={passCode}
          onChange={(e) => setPassCode(e.target.value)}
          placeholder='인증 코드를 입력하세요'
          className='w-full'
          required
        />
      </div>

      <Button
        onClick={handleVerifyPasscode}
        className='w-full max-w-xs'
        disabled={!passCode.trim()}
      >
        인증 코드 확인
      </Button>
    </div>
  );
}
