import React from 'react';

import { AdminTagsList } from '@/(admin)/admin/_components';
import { setMeta } from '@/_libs';

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
