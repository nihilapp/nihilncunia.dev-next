'use client';

import { useEffect } from 'react';

import { useAuthActions } from '@/_entities/auth';

export function useAuthCard(
  title: string,
  description: string,
  footer: React.ReactNode = null
) {
  const { setCardTitle, setCardDescription, setCardFooter, } = useAuthActions();

  useEffect(() => {
    setCardTitle(title);
    setCardDescription(description);
    setCardFooter(footer);
  }, [
    title,
    description,
    footer,
    setCardTitle,
    setCardDescription,
    setCardFooter,
  ]);
}
