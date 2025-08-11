import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';

import { FormLabel } from '@/(common)/_components/ui/form';
import { RadioGroupItem } from '@/(common)/_components/ui/radio-group';
import type { Option } from '@/_entities/common/hooks/use-parse-options';
import { cn } from '@/_libs';

const itemVariants = cva(
  'p-2 rounded-md border flex flex-row items-center gap-2',
  {
    variants: {
      variant: {
        default: 'border-gray-200',
        error: 'border-destructive',
      },
      checked: {
        true: 'border-blue-300 bg-blue-50',
        false: '',
      },
      disabled: {
        true: 'cursor-not-allowed',
        false: 'cursor-pointer',
      },
    },
    defaultVariants: {
      variant: 'default',
      checked: false,
      disabled: false,
    },
  }
);

const radioVariants = cva(
  'data-[state=checked]:bg-blue-400 data-[state=checked]:border-blue-400',
  {
    variants: {
      variant: {
        default: 'border-gray-300 bg-white',
        error: 'border-destructive bg-white',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const labelVariants = cva(
  'text-sm font-normal',
  {
    variants: {
      variant: {
        default: 'text-gray-700',
        error: 'text-destructive',
      },
      disabled: {
        true: 'cursor-not-allowed text-gray-400',
        false: 'cursor-pointer',
      },
    },
    defaultVariants: {
      variant: 'default',
      disabled: false,
    },
  }
);

interface RadioOptionProps
  extends VariantProps<typeof itemVariants>,
  VariantProps<typeof radioVariants>,
  VariantProps<typeof labelVariants> {
  option: Option;
  name: string;
  isChecked: boolean;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  itemClassName?: string;
  radioClassName?: string;
  labelClassName?: string;
}

export function RadioOption({
  option,
  name,
  isChecked,
  disabled = false,
  variant = 'default',
  itemClassName,
  radioClassName,
  labelClassName,
}: RadioOptionProps) {
  const handleBackgroundClick = (e: React.MouseEvent) => {
    // 라디오나 라벨이 클릭된 경우는 무시
    if (e.target === e.currentTarget) {
      const radioElement = document.getElementById(`${name}-${option.value}`);
      if (radioElement && !option.disabled) {
        radioElement.click();
      }
    }
  };

  return (
    <div
      className={cn(
        itemVariants({
          variant,
          checked: isChecked,
          disabled: option.disabled || disabled,
        }),
        itemClassName
      )}
      onClick={handleBackgroundClick}
    >
      <RadioGroupItem
        id={`${name}-${option.value}`}
        value={option.value}
        disabled={option.disabled || disabled}
        className={cn(
          radioVariants({ variant, }),
          radioClassName
        )}
      />
      <FormLabel
        htmlFor={`${name}-${option.value}`}
        className={cn(
          labelVariants({
            variant,
            disabled: option.disabled || disabled,
          }),
          labelClassName
        )}
      >
        {option.label}
      </FormLabel>
    </div>
  );
}
