import React from 'react';
import { Metadata } from 'next';
import { GoogleAnalytics } from '@next/third-parties/google';
import '@/_styles/tailwind.css';
import Script from 'next/script';
import { siteConfig } from './_config';
import { Providers } from './_layouts';

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    template: `%s - ${siteConfig.title}`,
    default: siteConfig.title,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: {
    name: siteConfig.author.name,
    url: siteConfig.author.url,
  },
  generator: 'Jetbrains Webstorm',
  openGraph: {
    title: 'home',
    description: siteConfig.description,
    locale: 'ko_KR',
    type: 'website',
    siteName: siteConfig.title,
    url: siteConfig.url,
    images: [
      {
        url: `${siteConfig.url}/opengraph-image.png`,
        width: 1920,
        height: 1080,
        alt: 'site image',
      },
      {
        url: `${siteConfig.url}/twitter-image.png`,
        width: 1920,
        height: 1080,
        alt: 'twitter site image',
      },
    ],
  },
  alternates: {
    canonical: siteConfig.url,
  },
  other: {
    'google-site-verification': siteConfig.googleVerfi,
    version: siteConfig.version,
  },
};

interface Props {
  children: React.ReactNode;
}

export default function AppLayout({ children, }: Props) {
  return (
    <html lang='ko'>
      <head>
        <Script
          async
          src={siteConfig.googleAdSrc}
          crossOrigin='anonymous'
        />
        <GoogleAnalytics gaId={siteConfig.googleAnalyticsId} />
      </head>
      <body suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
