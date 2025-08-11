'use client';

import { cva } from 'class-variance-authority';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

import { useRequestAdminSignUp, useCompleteAdminSignUp } from '@/_entities/auth';
import type { AdminSignUpFormData, VerificationCodeData } from '@/_entities/auth';
import { cn } from '@/_libs';
import { ToastHelper } from '@/_libs/tools/toast.tools';

import { InitialStep } from './InitialStep';
import { ProgressIndicator } from './ProgressIndicator';
import { VerificationStep } from './VerificationStep';

const cssVariants = cva([ 'space-y-6', ]);

export function AdminSignUpForm({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const router = useRouter();
  const [
    step,
    setStep,
  ] = useState<'initial' | 'verify'>('initial');
  const [
    formData,
    setFormData,
  ] = useState<AdminSignUpFormData | null>(null);

  // 1단계: 관리자 정보 제출 (또는 개발 환경에서 즉시 가입)
  const requestMutation = useRequestAdminSignUp({
    onSuccess: (data) => {
      // 개발 환경에서 메일 발송이 비활성화되어 있으면 즉시 성공하여 리디렉션
      if (process.env.NODE_ENV === 'development' && !data.message) {
        ToastHelper.success('관리자 계정이 생성되었습니다.');
        router.push('/auth/signin');
        return;
      }
      // 메일 발송이 활성화되어 있거나 운영 환경에서는 인증 단계로 이동
      if (data.message) {
        ToastHelper.success(data.message);
      }
      setStep('verify');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || '오류가 발생했습니다.';
      ToastHelper.error(errorMessage);
    },
  });

  // 2단계: 인증번호 제출 및 최종 가입
  const completeMutation = useCompleteAdminSignUp({
    onSuccess: () => {
      ToastHelper.success('관리자 계정이 성공적으로 생성되었습니다.');
      router.push('/auth/signin');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || '오류가 발생했습니다.';
      ToastHelper.error(errorMessage);
    },
  });

  const onInitialSubmit = (data: AdminSignUpFormData) => {
    setFormData(data);
    requestMutation.mutate(data);
  };

  const onFinalSubmit = (data: VerificationCodeData) => {
    if (!formData) return;
    completeMutation.mutate({
      ...formData,
      verificationCode: data.code,
    });
  };

  const goBackToInitial = () => {
    setStep('initial');
    setFormData(null);
  };

  return (
    <div
      className={cn(cssVariants(), className)}
      {...props}
    >
      <ProgressIndicator step={step} />

      {step === 'initial' && (
        <InitialStep
          onSubmit={onInitialSubmit}
          isPending={requestMutation.isPending}
        />
      )}

      {step === 'verify' && (
        <VerificationStep
          onSubmit={onFinalSubmit}
          onBack={goBackToInitial}
          isPending={completeMutation.isPending}
        />
      )}
    </div>
  );
}
