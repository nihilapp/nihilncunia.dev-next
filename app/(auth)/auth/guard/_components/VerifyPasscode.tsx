'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { useRouter } from 'next/navigation';
import React, { useActionState, useEffect } from 'react';

import { Input } from '@/(common)/_components/ui/input';
import { Label } from '@/(common)/_components/ui/label';
import { SubmitButton } from '@/(common)/_components/ui/SubmitButton';
import { type ActionError } from '@/_entities/auth';
import { useAuthCard } from '@/_entities/auth';
import { validatePasscodeFormAction } from '@/_entities/auth/actions';
import { cn } from '@/_libs';

interface Props
  extends React.FormHTMLAttributes<HTMLFormElement>,
  VariantProps<typeof cssVariants> {
  className?: string;
}

const cssVariants = cva(['space-y-4'], {
  variants: {},
  defaultVariants: {},
  compoundVariants: [],
});

interface FormState {
  success: boolean;
  error?: ActionError;
}

export function VerifyPasscode({ className, ...props }: Props) {
  const router = useRouter();
  const [state, action] = useActionState(validatePasscodeFormAction, {
    success: false,
  });

  useAuthCard('패스코드 인증', '패스코드를 입력해 인증하세요.');

  // 성공 시 리다이렉트
  useEffect(() => {
    if (state.success) {
      router.push('/auth/guard/complete');
    }
  }, [state.success, router]);

  return (
    <form
      className={cn(cssVariants({}), className)}
      action={action}
      {...props}
    >
      <div className="space-y-2">
        <Label htmlFor="passcode">패스코드</Label>
        <Input
          id="passcode"
          name="passcode"
          type="text"
          placeholder="60자리 숫자를 입력하세요"
          minLength={60}
          maxLength={60}
          autoComplete="one-time-code"
          required
        />
      </div>

      {state.error && (
        <p className="text-sm text-red-500">{state.error.message}</p>
      )}

      <SubmitButton
        disabled={state.success}
        className="w-full"
        loadingText="인증 중..."
      >
        패스코드 인증
      </SubmitButton>
    </form>
  );
}
