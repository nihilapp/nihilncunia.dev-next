import React from 'react';

import { BlogAdminSettings } from '@/(blog_admin)/_components';
import { setMeta } from '@/_libs';

interface Props {
  params: Promise<{ blog_id: string }>;
}

export async function generateMetadata({ params, }: Props) {
  const { blog_id, } = await params;
  return setMeta({
    title: `[${blog_id}] 설정`,
    url: `/blogs/${blog_id}/admin/settings`,
  });
}

export default async function BlogAdminSettingsPage({ params, }: Props) {
  const { blog_id, } = await params;
  return <BlogAdminSettings blogId={blog_id} />;
}
