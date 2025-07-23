'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';
import { useState } from 'react';
import { z } from 'zod';

import { useAuthActions } from '@/_entities/auth';
import { sendPasscodeEmail } from '@/_entities/auth/actions/send-passcode-email.action';
import { cn } from '@/_libs';

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

export function SendPasscode({ className, ...props }: Props) {
  const { setGuardStep, } = useAuthActions();
  const [
    email,
    setEmail,
  ] = useState('');
  const [
    loading,
    setLoading,
  ] = useState(false);
  const [
    error,
    setError,
  ] = useState<string | null>(null);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // 실제 구현에서는 email을 서버로 전달해야 하지만, 현재 서버 액션 시그니처에 email 없음
      // 임시로 패스코드만 발송
      const result = await sendPasscodeEmail('123456');
      if (result && result.step === 1) {
        setGuardStep(2);
      }
      else {
        setError('패스코드 발송에 실패했습니다.');
      }
    }
    catch {
      setError('서버 오류가 발생했습니다.');
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <form
      className={cn(
        cssVariants({}),
        className
      )}
      {...props}
      onSubmit={handleSend}
    >
      <input
        type='email'
        placeholder='이메일 입력'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={loading}
      />
      <button type='submit' disabled={loading}>
        {loading
          ? '발송 중...'
          : '패스코드 발송'}
      </button>
      {error && <div>{error}</div>}
    </form>
  );
}
