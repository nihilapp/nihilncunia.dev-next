'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import React, { useActionState, useEffect } from 'react';

import { passCodeAction } from '@/(auth)/auth/guard/_actions/passcode.action';
import { Button } from '@/(common)/_components/ui/button';
import { useAuthActions, useAuthCard } from '@/_entities/auth';
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

export function SendPasscode({ className, ...props }: Props) {
  const [
    state,
    action,
    isPending,
  ] = useActionState(
    passCodeAction,
    { step: 1, message: '', }
  );

  const { setGuardStep, } = useAuthActions();

  useEffect(() => {
    if (state.step === 2) {
      setGuardStep(state.step);
    }
  }, [
    state,
    setGuardStep,
  ]);

  useAuthCard(
    '패스코드 발송',
    '버튼을 클릭해 패스코드를 발송하세요.'
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
        value='send'
      />

      <Button
        type='submit'
        disabled={isPending}
        className='w-full max-w-xs'
      >
        {state.step === 2
          ? '패스코드 발송 중...'
          : '패스코드 발송'}
      </Button>
    </form>
  );
}
