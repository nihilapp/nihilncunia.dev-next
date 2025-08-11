'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { AuthCard, AuthFooter, AuthHeader } from '@/(auth)/_components';
import { FormInput } from '@/(common)/_components/form';
import { Button } from '@/(common)/_components/ui/button';
import { Form } from '@/(common)/_components/ui/form';
import { setMeta } from '@/_libs';

const signInSchema = z.object({
  email: z.string().email('올바른 이메일을 입력해주세요'),
  password: z.string().min(1, '비밀번호를 입력해주세요'),
});

type SignInData = z.infer<typeof signInSchema>;

export default function SignInPage() {
  const form = useForm<SignInData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: SignInData) => {
    console.log('로그인 데이터:', data);
    // TODO: 로그인 로직 구현
  };

  return (
    <>
      {setMeta({
        title: '로그인',
        url: '/auth/signin',
      })}

      <AuthHeader
        title='로그인'
        description='계정에 로그인하여 서비스를 이용하세요'
      />

      <AuthCard>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormInput
              name='email'
              label='이메일'
              type='email'
              placeholder='이메일을 입력하세요'
            />

            <FormInput
              name='password'
              label='비밀번호'
              type='password'
              placeholder='비밀번호를 입력하세요'
            />

            <Button type='submit' className='w-full'>
              로그인
            </Button>
          </form>
        </Form>
      </AuthCard>

      <AuthFooter>
        <div className='space-y-4'>
          <div className='flex justify-center space-x-4 text-sm'>
            <Link
              href='/auth/forgot-password'
              className='text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors'
            >
              비밀번호 찾기
            </Link>
            <span className='text-slate-400'>•</span>
            <Link
              href='/auth/signup'
              className='text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors'
            >
              회원가입
            </Link>
          </div>

          <div className='text-xs text-slate-500 dark:text-slate-500'>
            계속 진행하면
            {' '}
            <Link
              href='/terms'
              className='underline hover:text-slate-700 dark:hover:text-slate-300'
            >
              이용약관
            </Link>
            과
            {' '}
            <Link
              href='/privacy'
              className='underline hover:text-slate-700 dark:hover:text-slate-300'
            >
              개인정보처리방침
            </Link>
            에 동의하는 것으로 간주됩니다.
          </div>
        </div>
      </AuthFooter>
    </>
  );
}
