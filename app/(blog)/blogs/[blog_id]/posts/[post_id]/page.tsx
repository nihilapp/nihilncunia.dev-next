import React from 'react';

import { PostDetail } from '@/(blog)/_components';
import { setMeta } from '@/_libs';

interface Props {
  params: Promise<{
    blog_id: string;
    post_id: string;
  }>;
}

export async function generateMetadata({ params, }: Props) {
  const {
    blog_id, post_id,
  } = await params;

  // TODO: 포스트의 정보를 가져오는 함수를 이용해서 제목을 가져와야 함.

  return setMeta({
    title: `게시글 상세`,
    url: `/blogs/${blog_id}/posts/${post_id}`,
  });
}

export default async function BlogPostDetailPage({ params, }: Props) {
  const {
    blog_id, post_id,
  } = await params;

  return (
    <PostDetail blogId={blog_id} postId={post_id} />
  );
}
