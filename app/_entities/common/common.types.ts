import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

export interface SuccessPayload<T> {
  status: number;
  data: T;
  message?: string;
}

export interface ErrorPayload {
  status: number;
  message: string;
}

interface PrismaResponse<T> {
  data: T;
  message: string;
}

export type PrismaReturn<T> = Promise<PrismaResponse<T>>;

export type QueryOptionType<T> = UseQueryOptions<SuccessPayload<T>, AxiosError<ErrorPayload>, T>;

export type MutationOptionType<TData, TVariables> = Omit<UseMutationOptions<TData, AxiosError<ErrorPayload>, TVariables>, 'mutationFn'>;

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
  baseApiUrl: string;
  apiVersion: string;
}
