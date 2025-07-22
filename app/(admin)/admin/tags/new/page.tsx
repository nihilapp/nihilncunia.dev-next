import React from 'react';

import { AdminTagNew } from '@/(admin)/admin/_components';
import { setMeta } from '@/_libs';

interface Props {}

export const metadata = setMeta({
  title: '태그 생성',
  url: '/admin/tags/new',
});

export default function AdminTagNewPage() {
  return (
    <AdminTagNew />
  );
}
