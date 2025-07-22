"use server"

import { DateTools } from '@/_libs/tools/date.tools';
import { CookieHelper } from '@/_libs/tools/cookie.tools';

/**
 * 입력된 패스코드를 쿠키에서 읽어 검증합니다.
 * - 쿠키에 저장된 패스코드와 만료시각을 가져와 비교
 * - 5분 이내, 값이 일치하면 24시간 인증 쿠키 발급
 * - 검증 후 패스코드 관련 쿠키는 삭제
 * @param input 사용자가 입력한 패스코드
 * @returns 성공 여부(boolean)
 */
export async function validatePasscode(input: string): Promise<boolean> {
  // 쿠키에서 패스코드와 만료시각을 읽어옴
  const passcode = await CookieHelper.get<string>('passcode');
  const expires = await CookieHelper.get<string>('passcode_expires');

  // 패스코드 또는 만료시각이 없으면 실패
  if (!passcode || !expires) {
    return false;
  }

  // 만료시각과 현재 시간 비교 (DateTools 사용)
  const now = DateTools.now();
  if (DateTools.isAfter(now, expires)) {
    // 만료됨
    await CookieHelper.remove('passcode');
    await CookieHelper.remove('passcode_expires');
    return false;
  }

  // 입력값이 패스코드와 일치하지 않으면 실패
  if (input !== passcode) {
    return false;
  }

  // 성공: 24시간 인증 쿠키 발급
  await CookieHelper.set('admin_passcode_verified', 'true', 60 * 60 * 24); // 24시간

  // 패스코드 관련 쿠키 삭제(1회성)
  await CookieHelper.remove('passcode');
  await CookieHelper.remove('passcode_expires');

  return true;
} 