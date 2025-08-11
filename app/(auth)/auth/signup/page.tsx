import React from 'react';

import { SignUpForm } from '@/(auth)/auth/signup/_components/SignUpForm';
import { setMeta } from '@/_libs';

export const metadata = setMeta({
  title: `회원가입`,
  url: `/auth/signup`,
});

export default function page() {
  return (
    <SignUpForm />
  );
}
