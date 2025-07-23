import React from 'react';

import { setMeta } from '@/_libs';

import { NewPassword } from './_components/NewPassword';

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
