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
import { useSignUp } from '@/_entities/auth/hooks/useSignUp';
import { signUpFormModel, type SignUpFormData } from '@/_entities/auth/signup.form-model';
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

export function SignUpForm({ className, ...props }: Props) {
  const router = useRouter();
  const signUpMutation = useSignUp({
    onSuccess: () => {
      // 회원가입 성공 시 로그인 페이지로 이동
      ToastHelper.success('회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.');
      router.push('/auth/signin');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || '회원가입에 실패했습니다.';
      ToastHelper.error(errorMessage);
      console.error('회원가입 실패:', error);
    },
  });

  const form = useForm<SignUpFormData>({
    mode: 'all',
    resolver: zodResolver(signUpFormModel),
    defaultValues: {
      email: '',
      username: '',
      password: '',
      passwordConfirm: '',
    },
  });

  const onSubmit = (data: SignUpFormData) => {
    signUpMutation.mutate({
      email: data.email,
      username: data.username,
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

        {/* 이름 */}
        <FormInput
          form={form}
          name='username'
          label='이름'
          placeholder='이름을 입력해주세요'
        />

        {/* 비밀번호 */}
        <FormInput
          form={form}
          name='password'
          label='비밀번호'
          placeholder='비밀번호를 입력해주세요'
          type='password'
        />

        {/* 비밀번호 확인 */}
        <FormInput
          form={form}
          name='passwordConfirm'
          label='비밀번호 확인'
          placeholder='비밀번호를 다시 입력해주세요'
          type='password'
        />

        {/* 제출 버튼 */}
        <Button
          type='submit'
          className='w-full h-12'
          disabled={signUpMutation.isPending}
        >
          {signUpMutation.isPending
            ? '처리중...'
            : '회원가입'}
        </Button>

        {/* 로그인 링크 */}
        <div className='text-center'>
          <span className='text-sm text-muted-foreground'>이미 계정이 있으신가요? </span>
          <Button variant='link' size='sm' className='p-0 h-auto font-medium' asChild>
            <Link href='/auth/signin'>
              로그인
            </Link>
          </Button>
        </div>
      </form>
    </Form>
  );
}
