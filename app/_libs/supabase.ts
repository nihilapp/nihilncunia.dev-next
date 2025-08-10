import {
  createServerClient,
  parseCookieHeader,
  serializeCookieHeader
} from '@supabase/ssr';

import type { Database } from '@/_entities/common/supabase.types';

// 앱 설정 import
import { app } from '@/_libs/tools/config.loader';

// 설정에서 Supabase 정보 가져오기
const supabaseUrl = app.server.supabase.public.url;
const supabaseServiceKey = app.server.supabase.secret.secret_key;

if (!supabaseUrl) {
  throw new Error('Supabase URL이 설정되지 않았습니다. private.config.json을 확인하세요.');
}

if (!supabaseServiceKey) {
  throw new Error('Supabase Service Key가 설정되지 않았습니다. private.config.json을 확인하세요.');
}

/**
 * 서버사이드에서 사용할 Supabase 클라이언트를 생성합니다.
 * 쿠키 기반 인증을 지원하며, refresh token 에러를 안전하게 처리합니다.
 * @param request - Next.js Request 객체
 * @returns Supabase 클라이언트와 응답 헤더를 포함한 객체
 */
export function supaServerClient(request: Request) {
  // 응답 헤더를 저장할 Headers 객체 생성
  const headers = new Headers();

  // Supabase 서버 클라이언트 생성
  const client = createServerClient<Database>(
    supabaseUrl,
    supabaseServiceKey,
    {
      // 쿠키 처리 설정
      cookies: {
        // 모든 쿠키를 가져오는 함수
        getAll() {
          // 요청 헤더에서 쿠키 문자열을 파싱
          const parsedCookies = parseCookieHeader(request.headers.get('Cookie') ?? '');
          // 쿠키 객체 배열로 변환하여 반환
          return parsedCookies.map(({ name, value, }) => ({
            name,
            value: value ?? '',
          }));
        },
        // 쿠키를 설정하는 함수
        setAll(cookiesToSet) {
          // 각 쿠키를 Set-Cookie 헤더로 변환하여 추가
          cookiesToSet.forEach(({ name, value, options, }) => {
            headers.append(
              'Set-Cookie',
              serializeCookieHeader(name, value, options)
            );
          });
        },
      },
      // 인증 설정
      auth: {
        detectSessionInUrl: false,
        flowType: 'pkce',
        autoRefreshToken: true,
        persistSession: true,
      },
    }
  );

  // 인증 객체에 대한 프록시 생성 (refresh token 에러 처리)
  const authProxy = new Proxy(client.auth, {
    get(target, prop, receiver) {
      // getUser 메서드에 대한 특별 처리
      if (prop === 'getUser') {
        return async (...args: any[]) => {
          try {
            // 원본 getUser 메서드 호출
            const result = await target.getUser(...args);
            // refresh token이 없는 경우 에러 대신 null 사용자 반환
            if (
              result.error
              && result.error.message
              === 'Invalid Refresh Token: Refresh Token Not Found'
            ) {
              return {
                data: { user: null, },
                error: null,
              };
            }
            return result;
          }
          catch (error: any) {
            // 예외 발생 시에도 refresh token 에러는 안전하게 처리
            if (
              error.message === 'Invalid Refresh Token: Refresh Token Not Found'
            ) {
              return {
                data: { user: null, },
                error: null,
              };
            }
            throw error;
          }
        };
      }
      // 다른 메서드는 그대로 반환
      return Reflect.get(target, prop, receiver);
    },
  });

  // 전체 클라이언트에 대한 프록시 생성
  const clientProxy = new Proxy(client, {
    get(target, prop, receiver) {
      // auth 속성에 접근할 때 프록시된 auth 객체 반환
      if (prop === 'auth') {
        return authProxy;
      }
      // 다른 속성은 그대로 반환
      return Reflect.get(target, prop, receiver);
    },
  });

  // 클라이언트와 헤더를 포함한 객체 반환
  return {
    client: clientProxy,
    headers,
  };
}

/**
 * 미들웨어에서 사용할 Supabase 클라이언트를 생성합니다.
 * 쿠키 기반 인증을 지원하지만 응답 헤더는 반환하지 않습니다.
 * @param request - Next.js Request 객체
 * @returns Supabase 클라이언트
 */
export function supaMiddleClient(request: Request) {
  return createServerClient<Database>(
    supabaseUrl,
    supabaseServiceKey,
    {
      cookies: {
        getAll() {
          const parsedCookies = parseCookieHeader(request.headers.get('Cookie') ?? '');
          return parsedCookies.map(({ name, value, }) => ({
            name,
            value: value ?? '',
          }));
        },
        setAll() {
          // 미들웨어에서는 쿠키 설정을 무시
        },
      },
      auth: {
        detectSessionInUrl: false,
        flowType: 'pkce',
        autoRefreshToken: true,
        persistSession: true,
      },
    }
  );
}

// 타입 정의
export type ServerClientType = ReturnType<typeof supaServerClient>;
export type ServerClientClientType = ServerClientType['client'];
export type MiddlewareClientType = ReturnType<typeof supaMiddleClient>;

// 기존 호환성을 위한 별칭
export const serverClient = supaServerClient;
