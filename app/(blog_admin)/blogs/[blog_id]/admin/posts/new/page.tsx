import React from 'react';

import { setMeta } from '@/_libs';

import { BlogAdminPostNew } from '../../_components';

interface Props {
  params: Promise<{ blog_id: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { blog_id } = await params;
  return setMeta({
    title: `[${blog_id}] 게시글 생성`,
    url: `/blogs/${blog_id}/admin/posts/new`,
  });
}

export default async function BlogAdminPostNewPage({ params }: Props) {
  const { blog_id } = await params;
  return <BlogAdminPostNew blogId={blog_id} />;
}
