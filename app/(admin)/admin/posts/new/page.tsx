import React from 'react';

import { setMeta } from '@/_libs';

import { AdminPostNew } from './_components/AdminPostNew';

interface Props {}

export const metadata = setMeta({
  title: '게시글 만들기',
  url: '/admin/posts/new',
});

export default function AdminPostNewPage() {
  return (
    <AdminPostNew />
  );
}
