'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { FormInput } from '@/(common)/_components/form';
import { Button } from '@/(common)/_components/ui/button';
import { Form } from '@/(common)/_components/ui/form';
import { adminSignUpFormModel } from '@/_entities/auth';
import type { AdminSignUpFormData } from '@/_entities/auth';

interface Props {
  onSubmit: (data: AdminSignUpFormData) => void;
  isPending: boolean;
}

export function InitialStep({ onSubmit, isPending, }: Props) {
  const form = useForm<AdminSignUpFormData>({
    mode: 'all',
    resolver: zodResolver(adminSignUpFormModel),
    defaultValues: {
      email: '',
      username: '',
      password: '',
      role: 'ADMIN',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <FormInput
          form={form}
          name='email'
          label='이메일'
          placeholder='이메일을 입력해주세요'
          type='email'
        />

        <FormInput
          form={form}
          name='username'
          label='이름'
          placeholder='이름을 입력해주세요'
        />

        <FormInput
          form={form}
          name='password'
          label='비밀번호'
          placeholder='비밀번호를 입력해주세요'
          type='password'
        />

        <Button
          type='submit'
          className='w-full h-12'
          disabled={isPending}
        >
          {isPending
            ? '처리중...'
            : '관리자 가입 요청'}
        </Button>
      </form>
    </Form>
  );
}
