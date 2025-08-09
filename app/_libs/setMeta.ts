import { Metadata } from 'next';

import { siteConfig } from '@/_config';
import type { SiteMetadata } from '@/_entities/common';

export const setMeta = (meta: SiteMetadata): Metadata => {
  const siteDescription = meta.description || siteConfig.description;
  const siteKeywords = meta.keywords
    ? `${siteConfig.keywords}, ${meta.keywords}`
    : siteConfig.keywords;
  const url = process.env.NODE_ENV === 'development'
    ? siteConfig.url.development
    : siteConfig.url.production;
  const siteUrl = `${url}${meta.url}`;
  const siteImageLink = meta.imageLink
    ? `${url}${meta.imageLink}`
    : `${url}${siteConfig.cover.link}`;
  const siteImageAlt = meta.imageAlt || siteConfig.cover.alt;
  const siteType = meta.type || siteConfig.type;

  return {
    metadataBase: new URL(url),
    title: meta.title,
    description: siteDescription,
    keywords: siteKeywords,
    robots: meta.robots || 'index, follow',
    authors: {
      name: siteConfig.author.name,
      url: siteConfig.author.url,
    },
    openGraph: {
      title: meta.title,
      description: siteDescription,
      locale: 'ko_KR',
      type: siteType,
      siteName: siteConfig.title,
      url: siteUrl,
      images: [ {
        url: siteImageLink,
        width: 1920,
        height: 1080,
        alt: siteImageAlt,
      }, ],
    },
    alternates: {
      canonical: siteUrl,
    },
    other: {
      version: siteConfig.version,
    },
  };
};
