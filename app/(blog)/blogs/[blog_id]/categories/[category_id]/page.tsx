import React from 'react';

import { CategoryPosts } from '@/(blog)/_components';
import { setMeta } from '@/_libs';

interface Props {
  params: Promise<{
    blog_id: string;
    category_id: string;
  }>;
}

export async function generateMetadata({ params, }: Props) {
  const {
    blog_id, category_id,
  } = await params;
  return setMeta({
    title: `카테고리별 포스트`,
    url: `/blogs/${blog_id}/categories/${category_id}`,
  });
}

export default async function BlogCategoryPostsPage({ params, }: Props) {
  const {
    blog_id, category_id,
  } = await params;
  return <CategoryPosts blogId={blog_id} categoryId={category_id} />;
}
