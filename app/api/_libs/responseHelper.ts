import { NextResponse } from 'next/server';

import type { ApiError, ApiResponse, CreateResponse, CreateResponseWithHeaders, ApiErrorWithHeaders } from '@/_entities/common';

export function createResponse<T>(
  {
    message = '',
    result = null,
    status,
  }: CreateResponse<T>,
  headers?: Headers
) {
  const responseHeaders = new Headers();
  
  if (headers) {
    headers.forEach((value, key) => {
      responseHeaders.set(key, value);
    });
  }

  return NextResponse.json(
    {
      message,
      result,
      status,
    } satisfies ApiResponse<T>,
    {
      status,
      headers: responseHeaders,
    }
  );
}

/**
 * 에러 응답을 생성하는 헬퍼 함수
 * @param message - 에러 메시지
 * @param status - HTTP 상태 코드 (기본값: 500)
 * @returns NextResponse 객체
 */
export function createErrorResponse(
  {
    message,
    status = 500,
  }: ApiError,
  headers?: Headers
) {
  const responseHeaders = new Headers();
  
  if (headers) {
    headers.forEach((value, key) => {
      responseHeaders.set(key, value);
    });
  }

  return NextResponse.json(
    {
      message,
      result: null,
      status,
    } satisfies ApiError,
    {
      status,
      headers: responseHeaders,
    }
  );
}
