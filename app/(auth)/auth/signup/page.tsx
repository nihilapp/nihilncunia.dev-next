import React from 'react';

import { setMeta } from '@/_libs';

import { SignUp } from './_components/SignUp';

interface Props {}

export const metadata = setMeta({
  title: `회원가입`,
  url: `/auth/signup`,
});

export default function SignUpPage() {
  return (
    <SignUp />
  );
}
