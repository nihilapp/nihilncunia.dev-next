import { setMeta } from '@/_libs';

import { SignInForm } from './_components';

export const metadata = setMeta({
  title: '로그인',
  url: '/auth/signin',
});

export default function SignInPage() {
  return <SignInForm />;
}
