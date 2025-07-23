import React from 'react';

import { setMeta } from '@/_libs';

import { BlogAdminPostsList } from './_components/BlogAdminPostsList';

interface Props {
  params: Promise<{ blog_id: string }>;
}

export async function generateMetadata({ params, }: Props) {
  const { blog_id, } = await params;
  return setMeta({
    title: `게시글 리스트`,
    url: `/blogs/${blog_id}/admin/posts/list`,
  });
}

export default async function BlogAdminPostsListPage({ params, }: Props) {
  const { blog_id, } = await params;
  return <BlogAdminPostsList blogId={blog_id} />;
}
