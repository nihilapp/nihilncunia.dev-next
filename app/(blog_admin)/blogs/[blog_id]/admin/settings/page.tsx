import React from 'react';

import { setMeta } from '@/_libs';

import { BlogAdminSettings } from './_components/BlogAdminSettings';

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
