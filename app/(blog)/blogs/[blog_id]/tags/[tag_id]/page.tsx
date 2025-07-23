import React from 'react';

import { TagPosts } from '@/(blog)/_components';
import { setMeta } from '@/_libs';

interface Props {
  params: Promise<{
    blog_id: string;
    tag_id: string;
  }>;
}

export async function generateMetadata({ params, }: Props) {
  const {
    blog_id,
    tag_id,
  } = await params;
  return setMeta({
    title: `태그별 포스트`,
    url: `/blogs/${blog_id}/tags/${tag_id}`,
  });
}

export default async function BlogTagPostsPage({ params, }: Props) {
  const {
    blog_id,
    tag_id,
  } = await params;
  return <TagPosts blogId={blog_id} tagId={tag_id} />;
}
