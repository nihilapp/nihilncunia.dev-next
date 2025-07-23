import React from 'react';

import { BlogAdminTagsList } from '@/(blog_admin)/_components';
import { setMeta } from '@/_libs';

interface Props {
  params: Promise<{ blog_id: string }>;
}

export async function generateMetadata({ params, }: Props) {
  const { blog_id, } = await params;
  return setMeta({
    title: `태그 리스트`,
    url: `/blogs/${blog_id}/admin/tags/list`,
  });
}

export default async function BlogAdminTagsListPage({ params, }: Props) {
  const { blog_id, } = await params;
  return <BlogAdminTagsList blogId={blog_id} />;
}
