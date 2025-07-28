'use client';

import React, { useActionState, useEffect, useState } from 'react';

import { useAuthCard } from '@/_entities/auth';
import { cn } from '@/_libs';

import { setupOtpAction, SetupOtpFormState } from '../_actions/setup-otp.action';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function SignUpOtp({ className, ...props }: Props) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [showOtpInput, setShowOtpInput] = useState(false);

  const [state, action, isPending] = useActionState<SetupOtpFormState, FormData>(
    setupOtpAction,
    { step: 1, message: '' }
  );

  useEffect(() => {
    if (state.qrCodeUrl) {
      setQrCodeUrl(state.qrCodeUrl);
    }
    if (state.step === 3) {
      setShowOtpInput(true);
    }
  }, [state]);

  const footerContent = (
    <div>
      OTP 설정 단계
    </div>
  );

  useAuthCard(
    'OTP 설정',
    '계정 보안을 위해 OTP 인증을 설정해주세요.',
    footerContent
  );

  return (
    <div className={cn(className)} {...props}>
      <form action={action}>
        
        <div className='space-y-6'>
          {state.step === 1 && (
            <div className='text-center'>
              <p className='mb-4'>OTP 인증을 설정하려면 발급 버튼을 클릭하세요.</p>
              <button
                type='submit'
                name='_action'
                value='generate'
                disabled={isPending}
                className='w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50'
              >
                {isPending ? 'OTP 발급 중...' : 'OTP 발급'}
              </button>
            </div>
          )}

          {state.step === 2 && qrCodeUrl && (
            <div className='text-center'>
              <p className='mb-4'>QR 코드를 스캔하여 OTP 앱에 등록하세요.</p>
              <div className='flex justify-center mb-4'>
                <img src={qrCodeUrl} alt='OTP QR Code' className='border rounded' />
              </div>
              <button
                type='submit'
                name='_action'
                value='verify'
                disabled={isPending}
                className='w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50'
              >
                OTP 인증
              </button>
            </div>
          )}

          {showOtpInput && (
            <div>
              <label htmlFor='otpCode' className='block text-sm font-medium text-gray-700 mb-2'>
                OTP 코드 입력 (6자리)
              </label>
              <input
                type='text'
                id='otpCode'
                name='otpCode'
                maxLength={6}
                pattern='[0-9]{6}'
                required
                disabled={isPending}
                className='w-full text-center text-2xl py-3 px-4 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:opacity-50'
                placeholder='000000'
              />
              <button
                type='submit'
                name='_action'
                value='complete'
                disabled={isPending}
                className='w-full mt-4 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50'
              >
                {isPending ? '계정 생성 중...' : '계정 생성 완료'}
              </button>
            </div>
          )}

          {state.message && (
            <div className={`text-sm ${state.message.includes('성공') ? 'text-green-600' : 'text-red-600'}`}>
              {state.message}
            </div>
          )}
        </div>
      </form>
    </div>
  );
}