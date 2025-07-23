import React from 'react';

import { setMeta } from '@/_libs';

import { AdminBlogNew } from './_components/AdminBlogNew';

interface Props {}

export const metadata = setMeta({
  title: `블로그 만들기`,
  url: `/admin/blogs/new`,
});

export default function AdminBlogNewPage() {
  return (
    <AdminBlogNew />
  );
}
