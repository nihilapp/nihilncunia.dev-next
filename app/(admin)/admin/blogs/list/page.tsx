import React from 'react';

import { AdminBlogsList } from '@/(admin)/_components';
import { setMeta } from '@/_libs';

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
