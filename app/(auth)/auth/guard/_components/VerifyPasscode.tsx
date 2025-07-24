'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { useSearchParams } from 'next/navigation';
import React, { useActionState } from 'react';

import { passCodeAction } from '@/(auth)/auth/guard/_actions/passcode.action';
import { Button } from '@/(common)/_components/ui/button';
import { Input } from '@/(common)/_components/ui/input';
import { Label } from '@/(common)/_components/ui/label';
import { useAuthCard } from '@/_entities/auth';
import { cn } from '@/_libs';

interface Props
  extends React.FormHTMLAttributes<HTMLFormElement>,
  VariantProps<typeof cssVariants> {
  className?: string;
}

const cssVariants = cva(
  [ `flex flex-col items-center justify-center space-y-4`, ],
  {
    variants: {},
    defaultVariants: {},
    compoundVariants: [],
  }
);

export function VerifyPasscode({ className, ...props }: Props) {
  const [
    state,
    action,
    isPending,
  ] = useActionState(
    passCodeAction,
    { step: 2, message: '', }
  );

  const searchParams = useSearchParams();
  const callback = searchParams.get('callback');

  useAuthCard(
    '인증 코드 확인',
    '전송된 인증 코드를 입력해주세요.'
  );

  return (
    <form
      action={action}
      className={cn(
        cssVariants({}),
        className
      )}
      {...props}
    >
      <input
        type='hidden'
        name='_action'
        value='verify'
      />

      {callback && (
        <input
          type='hidden'
          name='callback'
          value={callback}
        />
      )}

      <div className='w-full max-w-xs space-y-2'>
        <Label htmlFor='passCode'>
          인증 코드
        </Label>

        <Input
          id='passCode'
          name='passCode'
          type='text'
          placeholder='인증 코드를 입력하세요'
          className='w-full'
          required
        />
      </div>

      <Button
        type='submit'
        className='w-full max-w-xs'
        disabled={isPending}
      >
        {isPending
          ? '인증 코드 확인 중...'
          : '인증 코드 확인'}
      </Button>
    </form>
  );
}
