import React from 'react';

import { AdminCategoryNew } from '@/(admin)/admin/_components';
import { setMeta } from '@/_libs';

interface Props {}

export const metadata = setMeta({
  title: '카테고리 생성',
  url: '/admin/categories/new',
});

export default function AdminCategoryNewPage() {
  return (
    <AdminCategoryNew />
  );
}
