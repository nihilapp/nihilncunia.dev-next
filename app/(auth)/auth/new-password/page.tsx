import React from 'react';

import { NewPassword } from '@/(auth)/auth/_components';
import { setMeta } from '@/_libs';

interface Props {}

export const metadata = setMeta({
  title: `새 비밀번호 설정`,
  url: `/auth/new-password`,
});

export default function NewPasswordPage() {
  return (
    <NewPassword />
  );
}
