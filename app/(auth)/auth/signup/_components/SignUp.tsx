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
import { useAuthCard, signUpSchema, type SignUpFormData } from '@/_entities/auth';
import type { SignUpFormState } from '@/_entities/auth/auth.types';
import { cn } from '@/_libs';

import { signUpAction } from '../_actions/signup.action';

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

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
      role: 'SUPER_ADMIN',
    },
  });

  const { handleSubmit, trigger, } = form;

  const footerContent = (
    <div className='space-y-2 text-center w-full'>
      <div className='text-sm text-gray-600'>
        이미 계정이 있으신가요?
        {' '}
        <Link
          href='/auth/signin'
          className='text-indigo-600 hover:text-indigo-500 font-medium transition-colors'
        >
          로그인
        </Link>
      </div>
    </div>
  );

  useAuthCard(
    '계정 생성',
    '새 계정을 만들기 위해 정보를 입력해주세요.',
    footerContent
  );

  useEffect(() => {
    trigger();
  }, [ trigger, ]);

  const onSubmit = (data: SignUpFormData) => {
    const formData = new FormData();
    formData.append('email', data.email);
    formData.append('password', data.password);
    formData.append('confirmPassword', data.confirmPassword);
    formData.append('username', data.username);
    formData.append('role', data.role || 'SUPER_ADMIN');
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
            name='username'
            render={({ field, }) => (
              <FormItem>
                <FormLabel>사용자명</FormLabel>
                <FormControl>
                  <Input
                    type='text'
                    placeholder='사용자명을 입력해주세요'
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

          <FormField
            control={form.control}
            name='confirmPassword'
            render={({ field, }) => (
              <FormItem>
                <FormLabel>비밀번호 확인</FormLabel>
                <FormControl>
                  <Input
                    type='password'
                    placeholder='비밀번호를 다시 입력해주세요'
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
              ? 'OTP 생성 중...'
              : 'OTP 생성'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
