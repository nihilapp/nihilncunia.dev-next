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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/(common)/_components/ui/select';
import { useParseOptions } from '@/_entities/common/hooks/use-parse-options';
import { cn } from '@/_libs';

interface BaseProps extends VariantProps<typeof cssVariants> {
  name: string;
  label?: string;
  showLabel?: boolean;
  showError?: boolean;
  data: string;
  placeholder?: string;
  className?: string;
}

interface SelectProps extends BaseProps {
  disabled?: boolean;
  form: UseFormReturn<any>;
}

const cssVariants = cva(
  [ 'w-full !p-2 !pl-3 !h-auto !min-h-[44px] rounded-md border flex flex-row items-center gap-2', ],
  {
    variants: {
      variant: {
        default: 'border-gray-200 bg-background',
        error: 'border-destructive',
      },
      disabled: {
        true: 'cursor-not-allowed opacity-50',
        false: 'cursor-pointer',
      },
    },
    defaultVariants: {
      variant: 'default',
      disabled: false,
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

export function FormSelect({
  className,
  name,
  label,
  showLabel = true,
  showError = true,
  data,
  placeholder = '선택해주세요',
  variant,
  disabled = false,
  form,
}: SelectProps) {
  const options = useParseOptions(data);

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
              <FormLabel className={labelVariants({ variant: currentVariant, })}>
                {label}
              </FormLabel>
            )}
            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={disabled}>
              <FormControl>
                <SelectTrigger className={cn(cssVariants({
                  variant: currentVariant,
                  disabled,
                }), className)}
                >
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    disabled={option.disabled}
                    className={cn(
                      'p-2',
                      option.disabled
                        ? '!cursor-not-allowed !opacity-50 !pointer-events-auto'
                        : '!cursor-pointer'
                    )}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {showError && <FormMessage />}
          </FormItem>
        );
      }}
    />
  );
}
