import React from 'react';

import { setMeta } from '@/_libs';

import { AdminTagNew } from './_components/AdminTagNew';

interface Props {}

export const metadata = setMeta({
  title: '태그 만들기',
  url: '/admin/tags/new',
});

export default function AdminTagNewPage() {
  return (
    <AdminTagNew />
  );
}
