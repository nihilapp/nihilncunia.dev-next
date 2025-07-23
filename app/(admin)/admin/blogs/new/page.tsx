import React from 'react';

import { AdminBlogNew } from '@/(admin)/_components';
import { setMeta } from '@/_libs';

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
