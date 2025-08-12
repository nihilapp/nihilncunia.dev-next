import { setMeta } from '@/_libs';

import { ForgotPasswordForm } from './_components';

export const metadata = setMeta({
  title: '비밀번호 재설정',
  url: '/auth/forgot-password',
});

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
