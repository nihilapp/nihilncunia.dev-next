import React from 'react';

import { AdminCategoryNew } from '@/(admin)/_components';
import { setMeta } from '@/_libs';

interface Props {}

export const metadata = setMeta({
  title: '카테고리 만들기',
  url: '/admin/categories/new',
});

export default function AdminCategoryNewPage() {
  return (
    <AdminCategoryNew />
  );
}
