'use server';

const PASSCODE_LENGTH = 60;
const PASSCODE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

// 쿠키 유틸리티 사용 예시 (실제 쿠키 저장은 필요 시 아래처럼 사용)
// import { CookieHelper } from '@/app/_libs/tools/cookie.tools';

/**
 * 60자리 숫자+영대소문자 패스코드를 생성합니다.
 * - crypto.randomBytes를 사용하여 보안적으로 안전하게 랜덤 바이트를 생성합니다.
 * - 각 바이트를 PASSCODE_CHARS의 인덱스로 변환하여 랜덤 문자열을 만듭니다.
 * - Math.random은 사용하지 않습니다(테스트용 제외).
 * @returns 60자리 패스코드 문자열
 *
 * // 예시: 쿠키에 패스코드 일부를 저장하고 싶을 때
 * // await CookieHelper.set('passcode_hint', passcode.slice(0, 4), 300); // 5분
 */
export async function genCode(): Promise<string> {
  // 패스코드 결과를 저장할 변수
  let passcode = '';

  // Node.js 환경에서 crypto 모듈을 동적으로 import
  const crypto = await import('crypto');

  // 60바이트의 랜덤 데이터를 생성
  const buf = crypto.randomBytes(PASSCODE_LENGTH);

  // 각 바이트를 PASSCODE_CHARS의 인덱스로 변환하여 문자 선택
  for (let i = 0; i < PASSCODE_LENGTH; i++) {
    // buf[i]는 0~255 범위의 값이므로, 문자 집합 길이로 나눈 나머지를 인덱스로 사용
    passcode += PASSCODE_CHARS[buf[i] % PASSCODE_CHARS.length];
  }

  // 최종 60자리 패스코드 반환
  return passcode;
}
