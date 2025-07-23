import React from 'react';

import { AdminTagNew } from '@/(admin)/_components';
import { setMeta } from '@/_libs';

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
