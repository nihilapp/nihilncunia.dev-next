import React from 'react';

import { setMeta } from '@/_libs';

import { SearchResults } from './_components/SearchResults';

interface Props {
  params: Promise<{ blog_id: string }>;
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ params, searchParams, }: Props) {
  const { blog_id, } = await params;
  const { q, } = await searchParams;
  return setMeta({
    title: `검색 결과`,
    url: `/blogs/${blog_id}/search${q
      ? `?q=${q}`
      : ''}`,
  });
}

export default async function BlogSearchPage({ params, searchParams, }: Props) {
  const { blog_id, } = await params;
  const { q, } = await searchParams;
  return <SearchResults blogId={blog_id} query={q || ''} />;
}
