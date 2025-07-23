import React from 'react';

import { Guestbook } from '@/(blog)/_components';
import { setMeta } from '@/_libs';

interface Props {
  params: Promise<{ blog_id: string }>;
}

export async function generateMetadata({ params, }: Props) {
  const { blog_id, } = await params;
  return setMeta({
    title: `방명록`,
    url: `/blogs/${blog_id}/guestbook`,
  });
}

export default async function BlogGuestbookPage({ params, }: Props) {
  const { blog_id, } = await params;
  return <Guestbook blogId={blog_id} />;
}
