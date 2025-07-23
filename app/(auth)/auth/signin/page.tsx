import React from 'react';

import { setMeta } from '@/_libs';

import { SignIn } from './_components/SignIn';

interface Props {}

export const metadata = setMeta({
  title: `로그인`,
  url: `/auth/signin`,
});

export default function SignInPage() {
  return (
    <SignIn />
  );
}
