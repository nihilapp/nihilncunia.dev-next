'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { Button } from '@/(common)/_components/ui/button';
import { cn } from '@/_libs';

interface Props
  extends React.HTMLAttributes<HTMLElement>,
  VariantProps<typeof cssVariants> {
  className?: string;
  title?: string;
  description?: string;
}

const cssVariants = cva(
  [ `border-b border-border bg-background`, ],
  {
    variants: {},
    defaultVariants: {},
    compoundVariants: [],
  }
);

export function AuthHeader({ className, title, description, ...props }: Props) {
  return (
    <header
      className={cn(
        cssVariants({}),
        'px-6 py-4',
        className
      )}
      {...props}
    >
      <div className='w-full flex items-center justify-between'>
        <Link href='/' className='flex items-center space-x-3 hover:opacity-80 transition-opacity'>
          <div className='relative w-8 h-8'>
            <Image
              src='/images/nihil-logo.png'
              alt='nihilncunia logo'
              fill
              sizes='32px'
              className='object-contain'
              priority
            />
          </div>
          <span className='text-lg font-900 text-foreground'>NIHILNCUNIA.DEV</span>
        </Link>

        <nav className='flex items-center space-x-2'>
          <Button variant='ghost' size='sm' asChild>
            <Link href='/'>
              홈
            </Link>
          </Button>
          <Button variant='ghost' size='sm' asChild>
            <Link href='/auth/login'>
              로그인
            </Link>
          </Button>
        </nav>
      </div>

      {title && (
        <div className='mt-8 text-center'>
          <h1 className='text-2xl font-bold text-foreground'>{title}</h1>
          {description && (
            <p className='mt-2 text-sm text-muted-foreground'>{description}</p>
          )}
        </div>
      )}
    </header>
  );
}
