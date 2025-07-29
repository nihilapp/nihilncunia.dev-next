'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { cva, type VariantProps } from 'class-variance-authority';
import { useSearchParams } from 'next/navigation';
import React, { useActionState, startTransition } from 'react';
import { useForm } from 'react-hook-form';

import { passCodeAction } from '@/(auth)/auth/guard/_actions/passcode.action';
import { Button } from '@/(common)/_components/ui/button';
import { Input } from '@/(common)/_components/ui/input';
import { Label } from '@/(common)/_components/ui/label';
import { useAuthCard, passcodeSchema, type PasscodeFormData } from '@/_entities/auth';
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

  const {
    register,
    handleSubmit,
    formState: { errors, },
  } = useForm<PasscodeFormData>({ resolver: zodResolver(passcodeSchema), });

  useAuthCard(
    '인증 코드 확인',
    '전송된 인증 코드를 입력해주세요.'
  );

  const onSubmit = (data: PasscodeFormData) => {
    const formData = new FormData();
    formData.append('_action', 'verify');
    formData.append('passCode', data.passCode);
    if (callback) {
      formData.append('callback', callback);
    }
    startTransition(() => {
      action(formData);
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn(
        cssVariants({}),
        className
      )}
      {...props}
    >
      <div className='w-full max-w-xs space-y-2'>
        <Label htmlFor='passCode'>
          인증 코드
        </Label>

        <Input
          id='passCode'
          {...register('passCode')}
          type='text'
          placeholder='인증 코드를 입력하세요'
          className='w-full'
        />
        {errors.passCode && (
          <p className='text-sm text-red-600'>{errors.passCode.message}</p>
        )}
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
