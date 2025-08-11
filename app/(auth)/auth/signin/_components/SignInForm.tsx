'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { cva, type VariantProps } from 'class-variance-authority';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';

import { FormInput } from '@/(common)/_components/form';
import { Button } from '@/(common)/_components/ui/button';
import { Form } from '@/(common)/_components/ui/form';
import { useSignIn } from '@/_entities/auth';
import { useAuthStore } from '@/_entities/auth/auth.store';
import { signInFormModel, type SignInFormData } from '@/_entities/auth/signin.form-model';
import { cn } from '@/_libs';
import { ToastHelper } from '@/_libs/tools/toast.tools';

interface Props
  extends React.FormHTMLAttributes<HTMLFormElement>,
  VariantProps<typeof cssVariants> {
  className?: string;
}

const cssVariants = cva(
  [ `space-y-6`, ],
  {
    variants: {},
    defaultVariants: {},
    compoundVariants: [],
  }
);

export function SignInForm({ className, ...props }: Props) {
  const router = useRouter();
  const { login, } = useAuthStore();

  const signInMutation = useSignIn({
    onSuccess: (user) => {
      // 로그인 성공 시 store에 사용자 정보 저장
      login(user);
      ToastHelper.success('로그인에 성공했습니다.');
      router.push('/');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || '로그인에 실패했습니다.';
      ToastHelper.error(errorMessage);
      console.error('로그인 실패:', error);
    },
  });

  const form = useForm<SignInFormData>({
    mode: 'all',
    resolver: zodResolver(signInFormModel),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: SignInFormData) => {
    signInMutation.mutate({
      email: data.email,
      password: data.password,
    });
  };

  return (
    <Form {...form}>
      <form
        className={cn(
          cssVariants({}),
          className
        )}
        onSubmit={form.handleSubmit(onSubmit)}
        {...props}
      >
        {/* 이메일 */}
        <FormInput
          form={form}
          name='email'
          label='이메일'
          placeholder='이메일을 입력해주세요'
          type='email'
        />

        {/* 비밀번호 */}
        <FormInput
          form={form}
          name='password'
          label='비밀번호'
          placeholder='비밀번호를 입력해주세요'
          type='password'
        />

        {/* 제출 버튼 */}
        <Button
          type='submit'
          className='w-full h-12'
          disabled={signInMutation.isPending}
        >
          {signInMutation.isPending
            ? '처리중...'
            : '로그인'}
        </Button>

        {/* 회원가입 링크 */}
        <div className='text-center'>
          <span className='text-sm text-muted-foreground'>계정이 없으신가요? </span>
          <Button variant='link' size='sm' className='p-0 h-auto font-medium' asChild>
            <Link href='/auth/signup'>
              회원가입
            </Link>
          </Button>
        </div>
      </form>
    </Form>
  );
}
