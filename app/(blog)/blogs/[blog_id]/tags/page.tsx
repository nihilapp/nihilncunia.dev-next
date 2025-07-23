import React from 'react';

import { setMeta } from '@/_libs';

import { TagList } from './_components/TagList';

interface Props {
  params: Promise<{ blog_id: string }>;
}

export async function generateMetadata({ params, }: Props) {
  const { blog_id, } = await params;
  return setMeta({
    title: `태그 목록`,
    url: `/blogs/${blog_id}/tags`,
  });
}

export default async function BlogTagsPage({ params, }: Props) {
  const { blog_id, } = await params;
  return <TagList blogId={blog_id} />;
}
