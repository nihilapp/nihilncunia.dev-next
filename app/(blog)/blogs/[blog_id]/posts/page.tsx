import React from 'react';

import { PostList } from '@/(blog)/_components';
import { setMeta } from '@/_libs';

interface Props {
  params: Promise<{ blog_id: string }>;
}

export async function generateMetadata({ params, }: Props) {
  const { blog_id, } = await params;

  return setMeta({
    title: `게시글 리스트`,
    url: `/blogs/${blog_id}/posts`,
  });
}

export default async function BlogPostsPage({ params, }: Props) {
  const { blog_id, } = await params;

  return (
    <PostList blogId={blog_id} />
  );
}
