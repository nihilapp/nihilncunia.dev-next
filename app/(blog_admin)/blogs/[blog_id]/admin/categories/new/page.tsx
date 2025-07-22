import React from 'react';

import { setMeta } from '@/_libs';

import { BlogAdminCategoryNew } from '../../_components';

interface Props {
  params: Promise<{ blog_id: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { blog_id } = await params;
  return setMeta({
    title: `[${blog_id}] 카테고리 생성`,
    url: `/blogs/${blog_id}/admin/categories/new`,
  });
}

export default async function BlogAdminCategoryNewPage({ params }: Props) {
  const { blog_id } = await params;
  return <BlogAdminCategoryNew blogId={blog_id} />;
}
