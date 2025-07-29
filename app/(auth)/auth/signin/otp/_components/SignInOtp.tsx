'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'next/navigation';
import React, { useActionState, startTransition } from 'react';
import { useForm } from 'react-hook-form';

import { useAuthCard, otpSchema, type OtpFormData } from '@/_entities/auth';
import { cn } from '@/_libs';

import { verifyOtpAction, VerifyOtpFormState } from '../_actions/verify-otp.action';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function SignInOtp({ className, ...props }: Props) {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  const [
    state,
    action,
    isPending,
  ] = useActionState<VerifyOtpFormState, FormData>(
    verifyOtpAction,
    { step: 1, message: '', }
  );

  const {
    register,
    handleSubmit,
    formState: { errors, },
  } = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: { email, },
  });

  const footerContent = (
    <div>
      OTP 인증 단계
    </div>
  );

  useAuthCard(
    'OTP 인증',
    '로그인을 완료하려면 OTP 코드를 입력해주세요.',
    footerContent
  );

  const onSubmit = (data: OtpFormData) => {
    const formData = new FormData();
    formData.append('email', data.email);
    formData.append('otpCode', data.otpCode);
    startTransition(() => {
      action(formData);
    });
  };

  return (
    <div className={cn(className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='space-y-4'>
          <div className='text-center mb-4'>
            <p className='text-sm text-gray-600'>
              <strong>{email}</strong>
              로 로그인하려고 합니다.
            </p>
            <p className='text-sm text-gray-600 mt-2'>
              인증 앱에서 6자리 OTP 코드를 확인하여 입력해주세요.
            </p>
          </div>

          <div>
            <label htmlFor='otpCode' className='block text-sm font-medium text-gray-700 mb-2'>
              OTP 코드 (6자리)
            </label>
            <input
              type='text'
              id='otpCode'
              {...register('otpCode')}
              maxLength={6}
              pattern='[0-9]{6}'
              disabled={isPending}
              className='w-full text-center text-2xl py-3 px-4 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:opacity-50'
              placeholder='000000'
              autoComplete='one-time-code'
            />
            {errors.otpCode && (
              <p className='mt-1 text-sm text-red-600'>{errors.otpCode.message}</p>
            )}
          </div>

          {state.message && (
            <div className={`text-sm ${state.message.includes('성공')
              ? 'text-green-600'
              : 'text-red-600'}`}
            >
              {state.message}
            </div>
          )}

          <button
            type='submit'
            disabled={isPending}
            className='w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50'
          >
            {isPending
              ? '인증 중...'
              : '로그인 완료'}
          </button>
        </div>
      </form>
    </div>
  );
}
