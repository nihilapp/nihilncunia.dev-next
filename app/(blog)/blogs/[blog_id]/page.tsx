import React from 'react';

import { BlogDetail } from '@/(blog)/_components';
import { setMeta } from '@/_libs';

interface Props {
  params: Promise<{ blog_id: string }>;
}

export async function generateMetadata({ params, }: Props) {
  const { blog_id, } = await params;

  return setMeta({
    title: `블로그 상세`,
    url: `/blogs/${blog_id}`,
  });
}

export default async function BlogDetailPage({ params, }: Props) {
  const { blog_id, } = await params;

  return (
    <BlogDetail blogId={blog_id} />
  );
}
