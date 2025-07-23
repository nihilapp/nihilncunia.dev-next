import React from 'react';

import { BlogAdmin } from '@/(blog_admin)/_components';
import { setMeta } from '@/_libs';

interface Props {
  params: Promise<{ blog_id: string }>;
}

export async function generateMetadata({ params, }: Props) {
  const { blog_id, } = await params;

  return setMeta({
    title: `블로그 관리 대시보드`,
    url: `/blogs/${blog_id}/admin`,
  });
}

export default async function BlogAdminPage({ params, }: Props) {
  const { blog_id, } = await params;

  return (
    <BlogAdmin blogId={blog_id} />
  );
}
