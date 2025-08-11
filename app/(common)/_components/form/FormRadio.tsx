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
import { RadioGroup } from '@/(common)/_components/ui/radio-group';
import { useParseOptions } from '@/_entities/common/hooks/use-parse-options';
import { cn } from '@/_libs';

import { RadioOption } from './RadioOption';

interface BaseProps extends VariantProps<typeof cssVariants> {
  name: string;
  label?: string;
  showLabel?: boolean;
  showError?: boolean;
  data: string;
  className?: string;
}

interface RadioProps extends BaseProps {
  containerProps?: React.HTMLAttributes<HTMLDivElement>;
  containerClassName?: string;
  itemClassName?: string;
  radioClassName?: string;
  labelClassName?: string;
  optionColumns?: 1 | 2 | 3;
  form: UseFormReturn<any>;
}

const cssVariants = cva(
  [ 'w-full', ],
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

const gridVariants = cva(
  [ '', ],
  {
    variants: {
      columns: {
        1: 'space-y-1',
        2: 'grid grid-cols-2 gap-1',
        3: 'grid grid-cols-3 gap-1',
      },
    },
    defaultVariants: {
      columns: 1,
    },
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

export function FormRadio({
  className,
  name,
  label,
  showLabel = true,
  showError = true,
  data,
  variant,
  containerProps,
  containerClassName,
  itemClassName,
  radioClassName,
  labelClassName,
  optionColumns = 1,
  form,
}: RadioProps) {
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
            <FormControl>
              <div
                className={cn(cssVariants({ variant: currentVariant, }), className, containerClassName)}
                {...containerProps}
              >
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className={cn(gridVariants({ columns: optionColumns, }))}
                >
                  {options.map((option) => {
                    const isChecked = field.value === option.value;

                    return (
                      <RadioOption
                        key={option.value}
                        option={option}
                        name={name}
                        isChecked={isChecked}
                        onValueChange={(value) => field.onChange(value)}
                        variant={variant}
                        itemClassName={itemClassName}
                        radioClassName={radioClassName}
                        labelClassName={labelClassName}
                      />
                    );
                  })}
                </RadioGroup>
              </div>
            </FormControl>
            {showError && <FormMessage />}
          </FormItem>
        );
      }}
    />
  );
}
