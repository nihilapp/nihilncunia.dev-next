'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';

import { cn } from '@/_libs';

interface Props
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cssVariants> {
  blogId: string;
  className?: string;
}

const cssVariants = cva([``], {
  variants: {},
  defaultVariants: {},
  compoundVariants: [],
});

export function BlogAdminTagsList({ blogId, className, ...props }: Props) {
  return (
    <div className={cn(cssVariants({}), className)} {...props}>
      {blogId} - 태그 리스트
    </div>
  );
}
