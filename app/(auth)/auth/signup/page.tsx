import React from 'react';

import { SignUp } from '@/(auth)/auth/_components';
import { setMeta } from '@/_libs';

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
