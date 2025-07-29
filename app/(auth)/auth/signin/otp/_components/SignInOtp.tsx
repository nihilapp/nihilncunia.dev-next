'use client';

import { useSearchParams } from 'next/navigation';
import React, { useActionState } from 'react';

import { useAuthCard } from '@/_entities/auth';
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

  return (
    <div className={cn(className)} {...props}>
      <form action={action}>
        <input type='hidden' name='email' value={email} />

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
              name='otpCode'
              maxLength={6}
              pattern='[0-9]{6}'
              required
              disabled={isPending}
              className='w-full text-center text-2xl py-3 px-4 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:opacity-50'
              placeholder='000000'
              autoComplete='one-time-code'
            />
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
