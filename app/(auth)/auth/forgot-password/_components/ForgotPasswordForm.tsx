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
import { useSendResetPasswordEmail } from '@/_entities/auth';
import { forgotPasswordFormModel, type ForgotPasswordFormData } from '@/_entities/auth/forgot-password.form-model';
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

export function ForgotPasswordForm({ className, ...props }: Props) {
  const router = useRouter();

  const sendResetEmailMutation = useSendResetPasswordEmail({
    onSuccess: (data) => {
      ToastHelper.success(data.message || '임시 비밀번호가 이메일로 발송되었습니다.');
      router.push('/auth/reset-password');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || '이메일 발송에 실패했습니다.';
      ToastHelper.error(errorMessage);
      console.error('이메일 발송 실패:', error);
    },
  });

  const form = useForm<ForgotPasswordFormData>({
    mode: 'all',
    resolver: zodResolver(forgotPasswordFormModel),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    sendResetEmailMutation.mutate({
      email: data.email,
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
          placeholder='가입한 이메일을 입력해주세요'
          type='email'
        />

        {/* 제출 버튼 */}
        <Button
          type='submit'
          className='w-full h-12'
          disabled={sendResetEmailMutation.isPending}
        >
          {sendResetEmailMutation.isPending
            ? '처리중...'
            : '임시 비밀번호 발송'}
        </Button>

        {/* 로그인 링크 */}
        <div className='text-center'>
          <span className='text-sm text-muted-foreground'>비밀번호를 기억하셨나요? </span>
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
