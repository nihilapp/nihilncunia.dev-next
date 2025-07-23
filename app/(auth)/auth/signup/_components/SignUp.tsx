'use client';

import React from 'react';

import { cn } from '@/_libs';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function SignUp({ className, ...props }: Props) {
  return (
    <div className={cn(className)} {...props}>
      content
    </div>
  );
}
