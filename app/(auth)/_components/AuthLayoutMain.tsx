'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/(common)/_components/ui/card';
import { useCardDescription, useCardFooter, useCardTitle } from '@/_entities/auth';
import { cn } from '@/_libs';

interface Props
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof cssVariants> {
  className?: string;
}

const cssVariants = cva(
  [ ``, ],
  {
    variants: {},
    defaultVariants: {},
    compoundVariants: [],
  }
);

export function AuthLayoutMain({ children, className, ...props }: Props) {
  const title = useCardTitle();
  const description = useCardDescription();
  const footer = useCardFooter();

  return (
    <main
      className={cn(
        cssVariants({}),
        className
      )}
      {...props}
    >
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          {children}
        </CardContent>
        {footer && (
          <CardFooter>
            {footer}
          </CardFooter>
        )}
      </Card>
    </main>
  );
}
