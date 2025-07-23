import React from 'react';

import { setMeta } from '@/_libs';

import { AdminCategoriesList } from './_components/AdminCategoriesList';

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
