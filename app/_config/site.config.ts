import { nihilLogo, nihilLogoWhite } from '@/_images';
import { SiteConfig } from '@/_types/common.types';

export const siteConfig: SiteConfig = {
  title: '사이트 이름',
  description: '사이트 설명',
  keywords: '',
  author: {
    name: 'NIHILncunia',
    url: 'https://github.com/NIHILncunia',
  },
  type: 'website',
  url: process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : 'http://localhost:3000',
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
