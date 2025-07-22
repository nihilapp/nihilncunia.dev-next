import React from 'react';

import { setMeta } from '@/_libs';

import { BlogAdminTagNew } from '../../_components';

interface Props {
  params: Promise<{ blog_id: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { blog_id } = await params;
  return setMeta({
    title: `[${blog_id}] 태그 생성`,
    url: `/blogs/${blog_id}/admin/tags/new`,
  });
}

export default async function BlogAdminTagNewPage({ params }: Props) {
  const { blog_id } = await params;
  return <BlogAdminTagNew blogId={blog_id} />;
}
