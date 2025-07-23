import React from 'react';

import { AdminCategoriesList } from '@/(admin)/_components';
import { setMeta } from '@/_libs';

interface Props {}

export const metadata = setMeta({
  title: '카테고리 리스트',
  url: '/admin/categories/list',
});

export default function AdminCategoriesListPage() {
  return (
    <AdminCategoriesList />
  );
}
