import { setMeta } from '@/_libs';

import { ResetPasswordForm } from './_components';

export const metadata = setMeta({
  title: '새 비밀번호 설정',
  url: '/auth/reset-password',
});

export default function ResetPasswordPage() {
  return <ResetPasswordForm />;
}
