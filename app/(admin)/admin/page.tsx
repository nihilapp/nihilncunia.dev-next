import React from 'react';

import { Admin } from '@/(admin)/admin/_components';
import { setMeta } from '@/_libs';

interface Props {}

export const metadata = setMeta({
  title: ``,
  url: ``,
});

export default function AdminPage() {
  return (
    <Admin />
  );
}
