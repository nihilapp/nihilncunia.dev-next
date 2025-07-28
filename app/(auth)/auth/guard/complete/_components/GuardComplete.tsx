'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { useSearchParams } from 'next/navigation';
import { useActionState } from 'react';
import React from 'react';

import { guardCompleteAction } from '@/(auth)/auth/guard/complete/_actions/guard-complete.action';
import { Button } from '@/(common)/_components/ui/button';
import { useAuthCard } from '@/_entities/auth';
import { cn } from '@/_libs';

interface Props
  extends React.FormHTMLAttributes<HTMLFormElement>,
  VariantProps<typeof cssVariants> {
  className?: string;
}

const cssVariants = cva([ ``, ], {
  variants: {},
  defaultVariants: {},
  compoundVariants: [],
});

export function GuardComplete({ className, ...props }: Props) {
  const searchParams = useSearchParams();
  const callback = searchParams.get('callback');

  useAuthCard('보호막 인증 완료', '인증이 성공적으로 완료되었습니다.');

  const [
    state,
    action,
    isPending,
  ] = useActionState(
    guardCompleteAction,
    { success: false, message: '', }
  );

  return (
    <form
      action={action}
      className={cn(cssVariants({}), className)}
      {...props}
    >
      {callback && <input type='hidden' name='callback' value={callback} />}

      <Button type='submit' className='w-full' disabled={isPending || state.success}>
        {isPending
          ? '처리 중...'
          : state.success
            ? '완료'
            : '돌아가기'}
      </Button>
      {state.message && !state.success && (
        <div className='text-red-500 text-sm mt-2'>{state.message}</div>
      )}
    </form>
  );
}
