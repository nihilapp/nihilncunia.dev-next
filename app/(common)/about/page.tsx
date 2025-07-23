import React from 'react';

import { About } from '@/(common)/_components';
import { setMeta } from '@/_libs';

export const metadata = setMeta({
  title: '소개',
  url: '/about',
});

export default function AboutPage() {
  return <About />;
}
