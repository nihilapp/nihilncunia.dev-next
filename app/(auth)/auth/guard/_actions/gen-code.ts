'use server';

import { randomInt as nodeRandomInt } from 'crypto';

/**
 * 60자리의 숫자와 영대소문자로 구성된 안전한 패스코드를 생성합니다.
 *
 * 보안을 위해 Node.js crypto 모듈을 사용하여 예측 불가능한 랜덤값을 생성합니다.
 * 생성된 패스코드는 인증이 필요한 페이지 접근 시 사용자에게 이메일로 전송됩니다.
 *
 * @returns 60자리 랜덤 패스코드 (숫자 + 영대문자 + 영소문자)
 * @example
 * const passcode = await genCode();
 * // 결과: "aB3kP9mN2xQ7vR4tY8wZ1cF6gH9jK3lM5nO7pQ2sT8uV4wX6yZ9aB1cD3eF5gH7"
 */
export async function genCode(): Promise<string> {
  // 사용할 문자셋 정의
  const digits = '0123456789';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';

  // 모든 문자를 하나의 배열로 결합
  const allChars = [
    ...digits,
    ...uppercase,
    ...lowercase,
  ];

  // 60자리 패스코드 생성
  let passcode = '';

  for (let i = 0; i < 60; i++) {
    const randomIndex = nodeRandomInt(0, allChars.length);
    passcode += allChars[randomIndex];
  }

  return passcode;
}
