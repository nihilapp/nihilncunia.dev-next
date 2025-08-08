import { NextResponse } from 'next/server';

import type { ErrorPayload, SuccessPayload } from '@/_entities/common';

export function successResponse<T>({ data, status, }: SuccessPayload<T>, headers?: Headers): NextResponse<SuccessPayload<T>> {
  return NextResponse.json({
    data,
    status,
  }, {
    status,
    headers,
  });
}

export function errorResponse({ status, message, }: ErrorPayload, headers?: Headers): NextResponse<ErrorPayload> {
  return NextResponse.json({
    status,
    message,
  }, {
    status,
    headers,
  });
}
