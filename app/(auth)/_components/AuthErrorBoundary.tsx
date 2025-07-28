'use client';

import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { Logger } from '@/_libs/tools/logger.tools';
import type { AuthErrorInfo } from '@/_entities/auth/auth.types';

interface Props {
  children: React.ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
  resetButtonText?: string;
}

function AuthErrorFallback({
  error,
  resetErrorBoundary,
  title = '인증 오류가 발생했습니다',
  message = '예상치 못한 오류가 발생했습니다. 다시 시도해주세요.',
  resetButtonText = '다시 시도',
}: {
  error: Error;
  resetErrorBoundary: () => void;
  title?: string;
  message?: string;
  resetButtonText?: string;
}) {
  return (
    <div className='flex flex-col items-center justify-center p-8 bg-red-50 border border-red-200 rounded-lg'>
      <div className='text-center space-y-4'>
        <div className='text-red-600'>
          <svg
            className='w-12 h-12 mx-auto mb-4'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
            />
          </svg>
        </div>
        
        <div>
          <h3 className='text-lg font-semibold text-red-800 mb-2'>
            {title}
          </h3>
          <p className='text-red-700 mb-4'>
            {message}
          </p>
          <details className='text-sm text-red-600 mb-4'>
            <summary className='cursor-pointer hover:text-red-800'>
              기술적 세부사항 보기
            </summary>
            <pre className='mt-2 p-2 bg-red-100 rounded text-xs overflow-auto'>
              {error.message}
            </pre>
          </details>
        </div>

        <div className='flex gap-2 justify-center'>
          <button
            onClick={resetErrorBoundary}
            className='px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2'
          >
            {resetButtonText}
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className='px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2'
          >
            홈으로 이동
          </button>
        </div>
      </div>
    </div>
  );
}

export function AuthErrorBoundary({
  children,
  fallbackTitle,
  fallbackMessage,
  resetButtonText,
}: Props) {
  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    const authErrorInfo: AuthErrorInfo = {
      componentStack: errorInfo.componentStack,
      errorBoundary: 'AuthErrorBoundary',
      eventType: 'react-error-boundary',
    };

    Logger.authError('React Error Boundary에서 에러 캐치', {
      error: error.message,
      stack: error.stack,
      authErrorInfo,
    });

    // 추가적인 에러 리포팅이 필요한 경우 여기에 구현
    // 예: Sentry, Rollbar 등으로 전송
  };

  const handleReset = () => {
    Logger.auth('Error Boundary 리셋 시도');
    
    // 필요한 경우 상태 초기화
    // 예: 쿠키 정리, 로컬 스토리지 정리 등
  };

  return (
    <ErrorBoundary
      FallbackComponent={({ error, resetErrorBoundary }) => (
        <AuthErrorFallback
          error={error}
          resetErrorBoundary={resetErrorBoundary}
          title={fallbackTitle}
          message={fallbackMessage}
          resetButtonText={resetButtonText}
        />
      )}
      onError={handleError}
      onReset={handleReset}
    >
      {children}
    </ErrorBoundary>
  );
}