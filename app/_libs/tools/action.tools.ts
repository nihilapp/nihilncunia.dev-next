import type { ActionResult } from '@/_entities/auth';

export function createActionSuccess<T>(data: T): ActionResult<T> {
  return { success: true, data, };
}

export function createActionError(
  code: string,
  message: string
): ActionResult<never> {
  return { success: false, error: { code, message, }, };
}
