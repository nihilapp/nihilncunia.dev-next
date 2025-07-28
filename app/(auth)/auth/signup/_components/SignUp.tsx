'use client';

import React, { useActionState } from 'react';

import { useAuthCard } from '@/_entities/auth';
import { cn } from '@/_libs';

import { signUpAction } from '../_actions/signup.action';
import type { SignUpFormState } from '@/_entities/auth/auth.types';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function SignUp({ className, ...props }: Props) {
  const [
    state,
    action,
    isPending,
  ] = useActionState<SignUpFormState, FormData>(
    signUpAction,
    { step: 1, message: '', }
  );

  const footerContent = (
    <div>
      footer
    </div>
  );

  useAuthCard(
    '계정 생성',
    '새 계정을 만들기 위해 정보를 입력해주세요.',
    footerContent
  );

  return (
    <div className={cn(className)} {...props}>
      <form action={action}>
        <input type='hidden' name='role' value='SUPER_ADMIN' />

        <div className='space-y-4'>
          <div>
            <label htmlFor='email' className='block text-sm font-medium text-gray-700'>
              이메일
            </label>
            <input
              type='email'
              id='email'
              name='email'
              required
              disabled={isPending}
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:opacity-50'
            />
          </div>

          <div>
            <label htmlFor='username' className='block text-sm font-medium text-gray-700'>
              사용자명
            </label>
            <input
              type='text'
              id='username'
              name='username'
              required
              disabled={isPending}
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:opacity-50'
            />
          </div>

          <div>
            <label htmlFor='password' className='block text-sm font-medium text-gray-700'>
              비밀번호
            </label>
            <input
              type='password'
              id='password'
              name='password'
              required
              disabled={isPending}
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:opacity-50'
            />
          </div>

          <div>
            <label htmlFor='confirmPassword' className='block text-sm font-medium text-gray-700'>
              비밀번호 확인
            </label>
            <input
              type='password'
              id='confirmPassword'
              name='confirmPassword'
              required
              disabled={isPending}
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:opacity-50'
            />
          </div>

          {state.message && (
            <div className='text-sm text-red-600'>
              {state.message}
            </div>
          )}

          <button
            type='submit'
            disabled={isPending}
            className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50'
          >
            {isPending
              ? 'OTP 생성...'
              : 'OTP 생성'}
          </button>
        </div>
      </form>
    </div>
  );
}
