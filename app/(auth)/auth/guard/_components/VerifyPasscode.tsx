'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';
import { useState } from 'react';

import { validatePasscode } from '@/_entities/auth/actions/validate-passcode.action';
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

export function VerifyPasscode({ className, ...props }: Props) {
  const [
    passcode,
    setPasscode,
  ] = useState('');
  const [
    loading,
    setLoading,
  ] = useState(false);
  const [
    error,
    setError,
  ] = useState<string | null>(null);
  const [
    success,
    setSuccess,
  ] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const result = await validatePasscode(passcode);
      if (result) {
        setSuccess(true);
      }
      else {
        setError('패스코드가 올바르지 않거나 만료되었습니다.');
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
      onSubmit={handleVerify}
    >
      <input
        type='text'
        placeholder='패스코드 입력'
        value={passcode}
        onChange={(e) => setPasscode(e.target.value)}
        disabled={loading || success}
      />
      <button type='submit' disabled={loading || success}>
        {loading
          ? '검증 중...'
          : '패스코드 확인'}
      </button>
      {error && <div>{error}</div>}
      {success && <div>인증 성공!</div>}
    </form>
  );
}
