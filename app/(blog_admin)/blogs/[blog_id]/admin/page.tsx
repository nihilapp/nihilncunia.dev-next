import React from 'react';

import { setMeta } from '@/_libs';

import { BlogAdmin } from './_components';

interface Props {
  params: Promise<{ blog_id: string }>;
}

export async function generateMetadata({ params, }: Props) {
  const { blog_id, } = await params;

  return setMeta({
    title: `블로그 관리`,
    url: `/blogs/${blog_id}/admin`,
  });
}

export default async function BlogAdminPage({ params, }: Props) {
  const { blog_id, } = await params;

  return (
    <BlogAdmin blogId={blog_id} />
  );
}
