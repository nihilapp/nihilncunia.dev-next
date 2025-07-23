import React from 'react';

import { BlogAdminCategoryNew } from '@/(blog_admin)/_components';
import { setMeta } from '@/_libs';

interface Props {
  params: Promise<{ blog_id: string }>;
}

export async function generateMetadata({ params, }: Props) {
  const { blog_id, } = await params;

  return setMeta({
    title: `카테고리 만들기`,
    url: `/blogs/${blog_id}/admin/categories/new`,
  });
}

export default async function BlogAdminCategoryNewPage({ params, }: Props) {
  const { blog_id, } = await params;

  return <BlogAdminCategoryNew blogId={blog_id} />;
}
