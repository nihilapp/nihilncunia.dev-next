import { SiteConfig } from '@/_entities/common/common.types';
import { nihilLogo, nihilLogoWhite } from '@/_images';

export const siteConfig: SiteConfig = {
  title: '니힐 블로그',
  description: '초보 개발자의 개발 블로그입니다.',
  keywords: 'JavaScript, TypeScript, React, Next.js, Node.js, 풀스택, 프론트엔드, 백엔드, 웹개발, 개발블로그',
  author: {
    name: 'NIHILncunia',
    url: 'https://github.com/NIHILncunia',
  },
  type: 'website',
  url: {
    development: 'http://localhost:3000',
    production: 'http://localhost:3000',
  },
  cover: {
    link: '/opengraph-image.png',
    alt: 'site image',
  },
  logo: nihilLogo.src,
  darkLogo: nihilLogoWhite.src,
  version: 'v0.0.0',
  googleVerfi: '',
  googleAdSrc: '',
  googleAnalyticsId: '',
  get apiRoute() {
    return `${this.url}/api`;
  },
};
