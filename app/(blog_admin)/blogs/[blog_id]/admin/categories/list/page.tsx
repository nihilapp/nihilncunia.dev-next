import React from 'react';

import { setMeta } from '@/_libs';

import { BlogAdminCategoriesList } from '../../_components';

interface Props {
  params: Promise<{ blog_id: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { blog_id } = await params;
  return setMeta({
    title: `[${blog_id}] 카테고리 리스트`,
    url: `/blogs/${blog_id}/admin/categories/list`,
  });
}

export default async function BlogAdminCategoriesListPage({ params }: Props) {
  const { blog_id } = await params;
  return <BlogAdminCategoriesList blogId={blog_id} />;
}
