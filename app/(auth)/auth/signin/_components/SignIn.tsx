'use client';

import React, { useActionState } from 'react';

import { useAuthCard } from '@/_entities/auth';
import { cn } from '@/_libs';

import { signInAction, SignInFormState } from '../_actions/signin.action';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function SignIn({ className, ...props }: Props) {
  const [
    state,
    action,
    isPending,
  ] = useActionState<SignInFormState, FormData>(
    signInAction,
    { step: 1, message: '', }
  );

  const footerContent = (
    <div>
      footer
    </div>
  );

  useAuthCard(
    '로그인',
    '계정에 로그인하기 위해 정보를 입력해주세요.',
    footerContent
  );

  return (
    <div className={cn(className)} {...props}>
      <form action={action}>
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
              ? '로그인 중...'
              : '로그인'}
          </button>
        </div>
      </form>
    </div>
  );
}
