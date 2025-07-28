'use client';

import React from 'react';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/(common)/_components/ui/card';
import { useCardDescription, useCardFooter, useCardTitle } from '@/_entities/auth';
import { cn } from '@/_libs';

interface Props {
  children: React.ReactNode;
  className?: string;
}

export function AuthLayoutMain({
  children,
  className,
}: Props) {
  const title = useCardTitle();

  const description = useCardDescription();

  const footer = useCardFooter();

  return (
    <Card
      className={cn(
        'h-[90dvh] w-full max-w-[550px] rounded-2xl border-0 bg-white shadow-xl shadow-black/20',
        'transition-all duration-300 ease-out hover:shadow-2xl hover:shadow-red-500/10 rounded-2 !text-md',
        'backdrop-blur-sm',
        className
      )}
    >
      <div className='flex h-full w-full flex-col overflow-hidden rounded-2xl'>
        <CardHeader className='shrink-0 border-b border-gray-100 bg-white/80 p-8 pb-6'>
          <CardTitle className='text-h3 !font-900 !tracking-tight !text-gray-900'>
            {title}
          </CardTitle>

          <CardDescription className='!mt-3 !text-base !leading-relaxed !text-gray-400 italic'>
            {description}
          </CardDescription>
        </CardHeader>

        <CardContent className='flex-1 overflow-y-auto p-8 pt-6 !text-base !text-gray-700'>
          {children}
        </CardContent>

        {footer && (
          <CardFooter className='shrink-0 border-t border-gray-100 bg-gray-50/50 p-8 pt-6 !text-base !text-gray-600'>
            {footer}
          </CardFooter>
        )}
      </div>
    </Card>
  );
}
