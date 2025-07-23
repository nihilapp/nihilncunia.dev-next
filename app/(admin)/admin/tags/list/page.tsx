import React from 'react';

import { setMeta } from '@/_libs';

import { AdminTagsList } from './_components/AdminTagsList';

interface Props {}

export const metadata = setMeta({
  title: '태그 리스트',
  url: '/admin/tags/list',
});

export default function AdminTagsListPage() {
  return (
    <AdminTagsList />
  );
}
