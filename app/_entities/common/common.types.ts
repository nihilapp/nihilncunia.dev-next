import type { UseMutationOptions } from '@tanstack/react-query';

export interface ApiError {
  message: string;
  result?: null;
  status: number;
}

export interface ApiResponse<T> {
  message: string;
  result: T;
  status: number;
}

export interface CreateResponse<T> {
  message?: string;
  result?: T;
  status: number;
}

export interface CreateResponseWithHeaders<T> {
  message?: string;
  result?: T;
  status: number;
  headers?: Headers;
}

export interface ApiErrorWithHeaders {
  message: string;
  result?: null;
  status: number;
  headers?: Headers;
}

export type MutationOptions<TData, TVariables> = UseMutationOptions<
  ApiResponse<TData>,
  unknown,
  TVariables
>;

type OpenGraphType = 'article' | 'book' | 'music.song' | 'music.album' | 'music.playlist' | 'music.radio_station' | 'profile' | 'website' | 'video.tv_show' | 'video.other' | 'video.movie' | 'video.episode';

export interface SiteMetadata {
  title: string;
  url: string;
  description?: string;
  author?: string;
  keywords?: string;
  type?: OpenGraphType;
  tags?: string;
  section?: string;
  created?: string;
  updated?: string;
  imageLink?: string;
  imageAlt?: string;
  robots?: 'index, follow' | 'noindex, nofollow' | 'index, nofollow' | 'noindex, follow';
}

export interface SiteConfig {
  title: string;
  description: string;
  url: string;
  type: OpenGraphType;
  cover: {
    link: string;
    alt: string;
  };
  logo: string;
  darkLogo: string;
  keywords: string;
  author: {
    name: string;
    url: string;
  };
  version: string;
  googleVerfi: string;
  googleAdSrc: string;
  googleAnalyticsId: string;
  apiRoute: string;
}
