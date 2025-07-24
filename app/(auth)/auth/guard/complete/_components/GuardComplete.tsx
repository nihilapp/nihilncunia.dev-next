'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { useSearchParams } from 'next/navigation';
import React from 'react';

import { setAuthCompleteAction } from '@/(auth)/auth/guard/complete/_actions/set-auth-complete-action';
import { Button } from '@/(common)/_components/ui/button';
import { useAuthCard } from '@/_entities/auth';
import { cn } from '@/_libs';

interface Props
  extends React.FormHTMLAttributes<HTMLFormElement>,
  VariantProps<typeof cssVariants> {
  className?: string;
}

const cssVariants = cva([ ``, ], {
  variants: {},
  defaultVariants: {},
  compoundVariants: [],
});

export function GuardComplete({ className, ...props }: Props) {
  const searchParams = useSearchParams();
  const callback = searchParams.get('callback');

  useAuthCard(
    '보호막 인증 완료', '인증이 성공적으로 완료되었습니다.'
  );

  const handleSubmit = async (formData: FormData) => {
    try {
      // 서버 액션 실행
      await setAuthCompleteAction({ success: false, message: '', }, formData);
    }
    catch (error) {
      // 리다이렉트 에러는 정상적인 동작이므로 무시
      console.log('인증 완료 처리됨');
    }
  };

  return (
    <form
      action={handleSubmit}
      className={cn(
        cssVariants({}),
        className
      )}
      {...props}
    >
      {callback && (
        <input
          type='hidden'
          name='callback'
          value={callback}
        />
      )}

      <Button
        type='submit'
        className='w-full'
      >
        돌아가기
      </Button>
    </form>
  );
}
