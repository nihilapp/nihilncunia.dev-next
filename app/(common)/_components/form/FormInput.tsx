'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';
import { UseFormReturn } from 'react-hook-form';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/(common)/_components/ui/form';
import { Input } from '@/(common)/_components/ui/input';
import { Textarea } from '@/(common)/_components/ui/textarea';
import { cn } from '@/_libs';

interface BaseProps extends VariantProps<typeof cssVariants> {
  name: string;
  label?: string;
  showLabel?: boolean;
  showError?: boolean;
  multiline?: boolean;
  rows?: number;
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
  form: UseFormReturn<any>;
}

interface InputProps extends BaseProps, Omit<React.InputHTMLAttributes<HTMLInputElement>, 'name' | 'form'> {
  multiline?: false;
}

interface TextareaProps extends BaseProps, Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'name' | 'form'> {
  multiline: true;
}

type Props = InputProps | TextareaProps;

const cssVariants = cva(
  [ 'w-full !p-2 !h-auto', ],
  {
    variants: {
      variant: {
        default: 'border border-input bg-background',
        error: 'border-destructive',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
    compoundVariants: [],
  }
);

const labelVariants = cva(
  'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
  {
    variants: {
      variant: {
        default: 'text-foreground',
        error: 'text-destructive',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export function FormInput({
  className,
  name,
  label,
  showLabel = true,
  showError = true,
  multiline = false,
  rows = 3,
  variant,
  inputClassName,
  labelClassName,
  form,
  ...props
}: Props) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field, fieldState, }) => {
        const hasError = !!fieldState.error;
        const currentVariant = hasError
          ? 'error'
          : variant || 'default';

        return (
          <FormItem className='w-full'>
            {showLabel && label && (
              <FormLabel className={cn(
                labelVariants({ variant: currentVariant, }),
                labelClassName
              )}
              >
                {label}
              </FormLabel>
            )}
            <FormControl>
              {multiline
                ? (
                  <Textarea
                    {...field}
                    rows={rows}
                    className={cn(
                      cssVariants({ variant: currentVariant, }),
                      'resize-none',
                      inputClassName,
                      className
                    )}
                    {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
                  />
                )
                : (
                  <Input
                    {...field}
                    className={cn(
                      cssVariants({ variant: currentVariant, }),
                      inputClassName,
                      className
                    )}
                    {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
                  />
                )}
            </FormControl>
            {showError && <FormMessage />}
          </FormItem>
        );
      }}
    />
  );
}
