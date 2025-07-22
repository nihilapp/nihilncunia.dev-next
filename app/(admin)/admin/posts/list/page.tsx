import React from 'react';

import { AdminPostsList } from '@/(admin)/admin/_components';
import { setMeta } from '@/_libs';

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
