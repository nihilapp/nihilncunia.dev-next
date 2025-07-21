import React from 'react';

import { setMeta } from '@/_libs';

interface Props {}

export const metadata = setMeta({
  title: `정보`,
  url: `/info`,
});

export default function InfoPage() {
  return (
    <div>info</div>
  );
}
