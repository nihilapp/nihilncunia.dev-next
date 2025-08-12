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
import { useResetPassword } from '@/_entities/auth';
import { resetPasswordFormModel, type ResetPasswordFormData } from '@/_entities/auth/reset-password.form-model';
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

export function ResetPasswordForm({ className, ...props }: Props) {
  const router = useRouter();

  const resetPasswordMutation = useResetPassword({
    onSuccess: (data) => {
      ToastHelper.success(data.message || '비밀번호가 성공적으로 변경되었습니다.');
      router.push('/auth/signin');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || '비밀번호 재설정에 실패했습니다.';
      ToastHelper.error(errorMessage);
      console.error('비밀번호 재설정 실패:', error);
    },
  });

  const form = useForm<ResetPasswordFormData>({
    mode: 'all',
    resolver: zodResolver(resetPasswordFormModel),
    defaultValues: {
      email: '',
      tempPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    resetPasswordMutation.mutate({
      email: data.email,
      tempPassword: data.tempPassword,
      newPassword: data.newPassword,
      confirmPassword: data.confirmPassword,
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

        {/* 임시 비밀번호 */}
        <FormInput
          form={form}
          name='tempPassword'
          label='임시 비밀번호'
          placeholder='이메일로 받은 임시 비밀번호를 입력해주세요'
          type='password'
        />

        {/* 새 비밀번호 */}
        <FormInput
          form={form}
          name='newPassword'
          label='새 비밀번호'
          placeholder='새 비밀번호를 입력해주세요'
          type='password'
        />

        {/* 새 비밀번호 확인 */}
        <FormInput
          form={form}
          name='confirmPassword'
          label='새 비밀번호 확인'
          placeholder='새 비밀번호를 다시 입력해주세요'
          type='password'
        />

        {/* 제출 버튼 */}
        <Button
          type='submit'
          className='w-full h-12'
          disabled={resetPasswordMutation.isPending}
        >
          {resetPasswordMutation.isPending
            ? '처리중...'
            : '비밀번호 변경'}
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
