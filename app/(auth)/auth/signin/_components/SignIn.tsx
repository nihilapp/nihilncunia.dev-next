'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import React, { useActionState, startTransition, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/(common)/_components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/(common)/_components/ui/form';
import { Input } from '@/(common)/_components/ui/input';
import { useAuthCard, signInSchema, type SignInFormData } from '@/_entities/auth';
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

  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { handleSubmit, trigger, } = form;

  const footerContent = (
    <div className='space-y-2 text-center w-full'>
      <div className='text-sm text-gray-600'>
        계정이 없으신가요?
        {' '}
        <Link
          href='/auth/signup'
          className='text-indigo-600 hover:text-indigo-500 font-medium transition-colors'
        >
          계정 생성
        </Link>
      </div>

      <div className='text-sm text-gray-600'>
        비밀번호를 잊으셨나요?
        {' '}
        <Link
          href='/auth/forgot-password'
          className='text-indigo-600 hover:text-indigo-500 font-medium transition-colors'
        >
          비밀번호 재설정
        </Link>
      </div>
    </div>
  );

  useAuthCard(
    '로그인',
    '계정에 로그인하기 위해 정보를 입력해주세요.',
    footerContent
  );

  useEffect(() => {
    trigger();
  }, [ trigger, ]);

  const onSubmit = (data: SignInFormData) => {
    const formData = new FormData();
    formData.append('email', data.email);
    formData.append('password', data.password);
    startTransition(() => {
      action(formData);
    });
  };

  return (
    <div className={cn(className)} {...props}>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <FormField
            control={form.control}
            name='email'
            render={({ field, }) => (
              <FormItem>
                <FormLabel>이메일</FormLabel>
                <FormControl>
                  <Input
                    type='email'
                    placeholder='이메일을 입력해주세요'
                    disabled={isPending}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='password'
            render={({ field, }) => (
              <FormItem>
                <FormLabel>비밀번호</FormLabel>
                <FormControl>
                  <Input
                    type='password'
                    placeholder='비밀번호를 입력해주세요'
                    disabled={isPending}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {state.message && (
            <div className='text-sm text-red-600'>
              {state.message}
            </div>
          )}

          <Button
            type='submit'
            disabled={isPending}
            className='w-full bg-blue-500 hover:bg-blue-600 cursor-pointer'
            size='lg'
          >
            {isPending
              ? '로그인 중...'
              : '로그인'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
