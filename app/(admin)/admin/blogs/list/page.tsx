import React from 'react';

import { setMeta } from '@/_libs';

import { AdminBlogsList } from './_components/AdminBlogsList';

interface Props {}

export const metadata = setMeta({
  title: `블로그 리스트`,
  url: `/admin/blogs/list`,
});

export default function AdminBlogsListPage() {
  return (
    <AdminBlogsList />
  );
}
