'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';

import { cn } from '@/_libs';

interface Props extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof cssVariants> {
  className?: string;
}

const cssVariants = cva([ ``, ], {
  variants: {},
  defaultVariants: {},
  compoundVariants: [],
});

export function AdminCategoriesList({ className, ...props }: Props) {
  return (
    <div className={cn(cssVariants({}), className)} {...props}>
      카테고리 리스트
    </div>
  );
}
