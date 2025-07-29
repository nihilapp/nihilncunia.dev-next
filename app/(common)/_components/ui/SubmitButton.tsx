'use client';

import { Loader2 } from 'lucide-react';
import { useFormStatus } from 'react-dom';

import { Button, type ButtonProps } from '@/(common)/_components/ui/button';

interface SubmitButtonProps extends ButtonProps {
  loadingText?: string;
}

export function SubmitButton({
  children,
  loadingText,
  ...props
}: SubmitButtonProps) {
  const { pending, } = useFormStatus();

  return (
    <Button {...props} type='submit' disabled={pending || props.disabled}>
      {pending && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
      {pending
        ? loadingText || children
        : children}
    </Button>
  );
}
