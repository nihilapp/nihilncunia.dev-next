import { useMemo } from 'react';

export interface Option {
  label: string;
  value: string;
  disabled: boolean;
}

export function useParseOptions(data: string): Option[] {
  return useMemo((): Option[] => {
    return data.split(',').map((item) => {
      const trimmedItem = item.trim();
      const isDisabled = trimmedItem.endsWith('-N');

      if (isDisabled) {
        const itemWithoutSuffix = trimmedItem.slice(0, -2);
        const parts = itemWithoutSuffix.split('|');
        const optionLabel = parts[0] || itemWithoutSuffix;
        const value = parts[1] || itemWithoutSuffix;
        return {
          label: optionLabel,
          value,
          disabled: true,
        } as Option;
      }

      const isSelectable = trimmedItem.endsWith('-Y');
      if (isSelectable) {
        const itemWithoutSuffix = trimmedItem.slice(0, -2);
        const parts = itemWithoutSuffix.split('|');
        const optionLabel = parts[0] || itemWithoutSuffix;
        const value = parts[1] || itemWithoutSuffix;
        return {
          label: optionLabel,
          value,
          disabled: false,
        } as Option;
      }

      // 기본값 (구분자가 없는 경우)
      return {
        label: trimmedItem,
        value: trimmedItem,
        disabled: false,
      } as Option;
    });
  }, [ data, ]);
}
