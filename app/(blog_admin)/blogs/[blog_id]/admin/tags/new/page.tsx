import React from 'react';

import { BlogAdminTagNew } from '@/(blog_admin)/_components';
import { setMeta } from '@/_libs';

interface Props {
  params: Promise<{ blog_id: string }>;
}

export async function generateMetadata({ params, }: Props) {
  const { blog_id, } = await params;
  return setMeta({
    title: `태그 만들기`,
    url: `/blogs/${blog_id}/admin/tags/new`,
  });
}

export default async function BlogAdminTagNewPage({ params, }: Props) {
  const { blog_id, } = await params;
  return <BlogAdminTagNew blogId={blog_id} />;
}
