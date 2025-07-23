import React from 'react';

import { CategoryList } from '@/(blog)/_components';
import { setMeta } from '@/_libs';

interface Props {
  params: Promise<{ blog_id: string }>;
}

export async function generateMetadata({ params, }: Props) {
  const { blog_id, } = await params;
  return setMeta({
    title: `카테고리 목록`,
    url: `/blogs/${blog_id}/categories`,
  });
}

export default async function BlogCategoriesPage({ params, }: Props) {
  const { blog_id, } = await params;
  return <CategoryList blogId={blog_id} />;
}
