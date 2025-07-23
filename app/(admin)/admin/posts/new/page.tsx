import React from 'react';

import { AdminPostNew } from '@/(admin)/_components';
import { setMeta } from '@/_libs';

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
