import React from 'react';

import { AdminBlogsList } from '@/(admin)/admin/_components';
import { setMeta } from '@/_libs';

interface Props {}

export const metadata = setMeta({
  title: ``,
  url: ``,
});

export default function AdminBlogsListPage() {
  return (
    <AdminBlogsList />
  );
}
