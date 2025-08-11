import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';

import { Checkbox } from '@/(common)/_components/ui/checkbox';
import { FormLabel } from '@/(common)/_components/ui/form';
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

const checkboxVariants = cva(
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

interface CheckboxOptionProps
  extends VariantProps<typeof itemVariants>,
  VariantProps<typeof checkboxVariants>,
  VariantProps<typeof labelVariants> {
  option: Option;
  name: string;
  isChecked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  itemClassName?: string;
  checkboxClassName?: string;
  labelClassName?: string;
}

export function CheckboxOption({
  option,
  name,
  isChecked,
  onCheckedChange,
  disabled = false,
  variant = 'default',
  itemClassName,
  checkboxClassName,
  labelClassName,
}: CheckboxOptionProps) {
  const handleBackgroundClick = (e: React.MouseEvent) => {
    // 체크박스나 라벨이 클릭된 경우는 무시
    if (e.target === e.currentTarget) {
      const labelElement = document.getElementById(`${name}-${option.value}`);
      if (labelElement && !option.disabled) {
        labelElement.click();
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
      <Checkbox
        id={`${name}-${option.value}`}
        checked={isChecked}
        onCheckedChange={onCheckedChange}
        disabled={option.disabled || disabled}
        className={cn(
          checkboxVariants({ variant, }),
          checkboxClassName
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
