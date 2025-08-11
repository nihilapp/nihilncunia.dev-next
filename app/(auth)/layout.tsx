import React from 'react';

import { AuthCard } from '@/(auth)/_components/AuthCard';
import { AuthHeader } from '@/(auth)/_components/AuthHeader';

interface Props {
  children: React.ReactNode;
}

export default function layout({ children, }: Props) {
  return (
    <div className='min-h-screen bg-gray-50 flex flex-col text-black-base'>
      <AuthHeader />

      <div className='flex-1 flex items-center justify-center p-6'>
        <AuthCard>
          {children}
        </AuthCard>
      </div>
    </div>
  );
}
