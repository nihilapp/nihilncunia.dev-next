'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';
import { cn } from '@/_libs';

interface Props
  extends React.HTMLAttributes<HTMLElement>,
  VariantProps<typeof cssVariants> {
  className?: string;
}

const cssVariants = cva(
  [
    ``,
    ],
    {
      variants: {},
      defaultVariants: {},
    compoundVariants: [],
  }
);

export function CommonFooter({ className, ...props }: Props) {
  return (
    <footer
      className={cn(
        cssVariants({}),
        className
      )}
      {...props}
    >
      footer
    </footer>
  );
}
