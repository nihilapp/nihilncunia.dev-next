'use client';

import type { Session } from '@supabase/supabase-js';
import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';

import { cn } from '@/_libs';

interface Props
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof cssVariants> {
  className?: string;
  session: Session;
}

const cssVariants = cva(
  [ ``, ],
  {
    variants: {},
    defaultVariants: {},
    compoundVariants: [],
  }
);

export function Home({ className, session, ...props }: Props) {
  return (
    <div
      className={cn(
        cssVariants({}),
        className
      )}
      {...props}
    >
      <div className='p-4'>
        <h1 className='text-2xl font-bold mb-4'>홈페이지</h1>

        <div className='bg-gray-100 p-4 rounded-md'>
          <h2 className='text-lg font-semibold mb-2'>세션 정보</h2>

          {session
            ? (
              <div className='space-y-2'>
                <p>
                  <strong>로그인 상태:</strong>
                  {' '}
                  ✅ 로그인됨
                </p>
                <p>
                  <strong>사용자 ID:</strong>
                  {' '}
                  {session.user?.id}
                </p>
                <p>
                  <strong>이메일:</strong>
                  {' '}
                  {session.user?.email}
                </p>
                <p><strong>메타데이터:</strong></p>
                <pre className='bg-white p-2 rounded text-sm overflow-auto'>
                  {JSON.stringify(session.user?.user_metadata, null, 2)}
                </pre>
              </div>
            )
            : (
              <div>
                <p>
                  <strong>로그인 상태:</strong>
                  {' '}
                  ❌ 로그인되지 않음
                </p>
                <p>계정을 생성하거나 로그인해주세요.</p>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
