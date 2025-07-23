import React from 'react';

import { setMeta } from '@/_libs';

import { AdminPostsList } from './_components/AdminPostsList';

interface Props {}

export const metadata = setMeta({
  title: '게시글 리스트',
  url: '/admin/posts/list',
});

export default function AdminPostsListPage() {
  return (
    <AdminPostsList />
  );
}
