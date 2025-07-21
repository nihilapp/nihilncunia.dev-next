'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { cva, type VariantProps } from 'class-variance-authority';
// NextAuth 제거됨 - 커스텀 인증으로 대체 예정
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { cn } from '@/_libs';

import { signInModel } from '@/_entities/profiles';

interface Props
  extends React.FormHTMLAttributes<HTMLFormElement>,
  VariantProps<typeof cssVariants> {
  className?: string;
}

const cssVariants = cva(
  [ ``, ],
  {
    variants: {},
    defaultVariants: {},
    compoundVariants: [],
  }
);

interface FormValues {
  email: string;
  password: string;
}

export function SignInForm({ className, ...props }: Props) {
  const form = useForm<FormValues>({
    mode: 'all',
    resolver: zodResolver(signInModel),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { formState: { errors, }, } = form;

  useEffect(() => {
    form.trigger();
  }, [ form, ]);

  const onSubmitForm = (data: FormValues) => {
    // TODO: Supabase Auth 로그인 구현 필요
  };

  return (
    <form
      className={cn(
        cssVariants({}),
        className
      )}
      {...props}
      onSubmit={form.handleSubmit(onSubmitForm)}
    >
      <label htmlFor='email'>
        <span>이메일</span>
        <input
          type='email'
          id='email'
          {...form.register('email')}
        />
        {errors.email && (
          <span>{errors.email.message}</span>
        )}
      </label>

      <label htmlFor='password'>
        <span>비밀번호</span>
        <input
          type='password'
          id='password'
          {...form.register('password')}
        />
        {errors.password && (
          <span>{errors.password.message}</span>
        )}
      </label>

      <div>
        <button>로그인</button>
        <button type='reset'>초기화</button>
      </div>
    </form>
  );
}
