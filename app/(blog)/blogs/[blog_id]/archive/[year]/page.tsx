import React from 'react';

import { YearlyArchive } from '@/(blog)/_components';
import { setMeta } from '@/_libs';

interface Props {
  params: Promise<{
    blog_id: string;
    year: string;
  }>;
}

export async function generateMetadata({ params, }: Props) {
  const { blog_id, year, } = await params;
  return setMeta({
    title: `${year}년 아카이브`,
    url: `/blogs/${blog_id}/archive/${year}`,
  });
}

export default async function BlogYearlyArchivePage({ params, }: Props) {
  const { blog_id, year, } = await params;
  return <YearlyArchive blogId={blog_id} year={year} />;
}
