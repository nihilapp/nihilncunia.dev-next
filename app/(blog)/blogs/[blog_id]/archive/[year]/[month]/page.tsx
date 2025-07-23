import React from 'react';

import { MonthlyArchive } from '@/(blog)/_components';
import { setMeta } from '@/_libs';

interface Props {
  params: Promise<{
    blog_id: string;
    year: string;
    month: string;
  }>;
}

export async function generateMetadata({ params, }: Props) {
  const { blog_id, year, month, } = await params;
  return setMeta({
    title: `${year}년 ${month}월 아카이브`,
    url: `/blogs/${blog_id}/archive/${year}/${month}`,
  });
}

export default async function BlogMonthlyArchivePage({ params, }: Props) {
  const { blog_id, year, month, } = await params;
  return <MonthlyArchive blogId={blog_id} year={year} month={month} />;
}
