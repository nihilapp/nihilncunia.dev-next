import { SiteConfig } from '@/_entities/common/common.types';
import { nihilLogo, nihilLogoWhite } from '@/_images';
import { app } from '@/_libs/tools/config.loader';

const { public: { site, global, api, }, } = app;

const baseUrl = process.env.NODE_ENV === 'development'
  ? site.url.development
  : site.url.production;

export const siteConfig: SiteConfig = {
  title: site.title,
  description: site.description,
  keywords: site.keywords,
  author: { ...site.author, },
  type: 'website' as const,
  url: baseUrl,
  cover: { ...site.cover, },
  logo: nihilLogo.src,
  darkLogo: nihilLogoWhite.src,
  version: global.version,
  googleVerfi: site.googleVerfi,
  googleAdSrc: site.googleAdSrc,
  googleAnalyticsId: site.googleAnalyticsId,
  baseApiUrl: `${baseUrl}${api.url}`,
  apiVersion: api.version,
};
