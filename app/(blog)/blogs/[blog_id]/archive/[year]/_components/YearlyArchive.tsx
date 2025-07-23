'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';

import { cn } from '@/_libs';

interface Props
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof cssVariants> {
  className?: string;
  blogId: string;
  year: string;
}

const cssVariants = cva(
  [ ``, ],
  {
    variants: {},
    defaultVariants: {},
    compoundVariants: [],
  }
);

export function YearlyArchive({ className, blogId, year, ...props }: Props) {
  console.log('blogId', blogId);
  console.log('year', year);

  return (
    <div
      className={cn(
        cssVariants({}),
        className
      )}
      {...props}
    >
      content
    </div>
  );
}
