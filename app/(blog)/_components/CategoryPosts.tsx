'use client';

import {
  cva, type VariantProps
} from 'class-variance-authority';
import React from 'react';

import { cn } from '@/_libs';

interface Props
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof cssVariants> {
  className?: string;
  blogId: string;
  categoryId: string;
}

const cssVariants = cva(
  [ ``, ],
  {
    variants: {},
    defaultVariants: {},
    compoundVariants: [],
  }
);

export function CategoryPosts({
  className, blogId, categoryId, ...props
}: Props) {
  console.log('blogId', blogId);
  console.log('categoryId', categoryId);

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
