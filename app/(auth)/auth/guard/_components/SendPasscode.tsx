'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import React, { useEffect } from 'react';
import { useActionState } from 'react';

import { SubmitButton } from '@/(common)/_components/ui/SubmitButton';
import { useAuthActions, useAuthCard } from '@/_entities/auth';
import { sendPasscodeFormAction } from '@/_entities/auth/actions';
import { cn } from '@/_libs';

interface Props
  extends React.FormHTMLAttributes<HTMLFormElement>,
  VariantProps<typeof cssVariants> {
  className?: string;
}

const cssVariants = cva([``], {
  variants: {},
  defaultVariants: {},
  compoundVariants: [],
});

interface FormState {
  success: boolean;
  step?: number;
  error?: ActionError;
}

export function SendPasscode({ className, ...props }: Props) {
  const [state, action] = useActionState(sendPasscodeFormAction, {
    success: false,
  });

  const { setGuardStep } = useAuthActions();
  useAuthCard('패스코드 발송', '발송 버튼을 클릭해 패스코드를 발송하세요.');

  // formAction 결과에 따라 step 업데이트
  useEffect(() => {
    if (state.success && state.step) {
      setGuardStep(state.step);
    }
  }, [state.success, state.step, setGuardStep]);

  return (
    <form className={cn(cssVariants({}), className)} action={action} {...props}>
      <SubmitButton disabled={state.success} loadingText="발송 중...">
        패스코드 발송
      </SubmitButton>
      {state.error && (
        <p className="mt-2 text-sm text-red-500">{state.error.message}</p>
      )}
    </form>
  );
}
