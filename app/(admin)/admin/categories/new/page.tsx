import React from 'react';

import { setMeta } from '@/_libs';

import { AdminCategoryNew } from './_components/AdminCategoryNew';

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
