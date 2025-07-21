'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { cva, type VariantProps } from 'class-variance-authority';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { z } from 'zod';

import { signUpModel } from '@/_entities/profiles';
import { cn } from '@/_libs';
import type { ProfileRole } from '@/_entities/profiles/profiles.table';

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
  username: string;
  role: ProfileRole;
  password: string;
  passwordConfirm: string;
}

export function SignUpForm({ className, ...props }: Props) {
  const form = useForm<FormValues>({
    mode: 'all',
    resolver: zodResolver(signUpModel),
    defaultValues: {
      email: '',
      username: '',
      role: 'USER' as ProfileRole,
      password: '',
      passwordConfirm: '',
    },
  });

  const { formState: { errors, }, } = form;

  useEffect(() => {
    form.trigger();
  }, [ form, ]);

  const router = useRouter();

  const onSubmitForm: SubmitHandler<z.infer<typeof signUpModel>>
    = (data) => {
      // TODO: Supabase Auth 회원가입 구현 필요
      router.push('/auth/signin');
    }
  ;

  const onResetForm = () => {
    form.reset();
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

      <label htmlFor='username'>
        <span>사용자명</span>
        <input
          type='text'
          id='username'
          {...form.register('username')}
        />
        {errors.username && (
          <span>{errors.username.message}</span>
        )}
      </label>

      <div>
        <div>
          <label htmlFor='roleUser'>
            <input
              type='radio'
              id='roleUser'
              value='USER'
              {...form.register('role')}
            />
            <span>사용자</span>
          </label>

          <label htmlFor='roleAdmin'>
            <input
              type='radio'
              id='roleAdmin'
              value='ADMIN'
              {...form.register('role')}
            />
            <span>관리자</span>
          </label>
        </div>
        {errors.role && (
          <span>{errors.role.message}</span>
        )}
      </div>

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

      <label htmlFor='passwordConfirm'>
        <span>비밀번호 확인</span>
        <input
          type='password'
          id='passwordConfirm'
          {...form.register('passwordConfirm')}
        />
        {errors.passwordConfirm && (
          <span>{errors.passwordConfirm.message}</span>
        )}
      </label>
      <div>
        <button>회원가입</button>
        <button
          type='button'
          onClick={onResetForm}
        >
          초기화
        </button>
      </div>
    </form>
  );
}
