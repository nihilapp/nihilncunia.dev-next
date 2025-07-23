import React from 'react';

import { PostEdit } from '@/(blog)/_components';
import { setMeta } from '@/_libs';

interface Props {
  params: Promise<{
    blog_id: string;
    post_id: string;
  }>;
}

export async function generateMetadata({ params, }: Props) {
  const {
    blog_id,
    post_id,
  } = await params;

  return setMeta({
    title: `게시글 수정`,
    url: `/blogs/${blog_id}/posts/${post_id}/edit`,
  });
}

export default async function BlogPostEditPage({ params, }: Props) {
  const {
    blog_id, post_id,
  } = await params;

  return (
    <PostEdit blogId={blog_id} postId={post_id} />
  );
}
