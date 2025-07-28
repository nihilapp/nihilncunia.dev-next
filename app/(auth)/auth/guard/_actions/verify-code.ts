'use server';

import { CookieHelper } from '@/_libs/tools/cookie.tools';
import { Logger } from '@/_libs/tools/logger.tools';
import { RateLimiter } from '@/_libs/tools/rate-limit.tools';

type VerifyCodeResult = {
  step: number;
  message: string;
};

/**
 * 사용자가 입력한 패스코드를 쿠키에 저장된 패스코드와 비교하여 검증합니다.
 *
 * Rate limiting을 적용하여 브루트 포스 공격을 방어합니다.
 * 검증 성공 시 쿠키에서 패스코드를 삭제하여 재사용을 방지합니다.
 *
 * @param passCode - 사용자가 입력한 패스코드
 * @returns 검증 성공 여부
 */
export async function verifyCode(passCode: string): Promise<VerifyCodeResult> {
  try {
    // Rate limiting 확인
    const identifier = 'passcode_verify'; // 패스코드는 시스템 전체에 하나만 존재
    const rateLimitResult = await RateLimiter.checkLimit(identifier, 'passcode');

    if (!rateLimitResult.allowed) {
      Logger.authError('패스코드 검증 rate limit 초과', { identifier, lockTimeLeft: rateLimitResult.lockTimeLeft });
      return {
        step: 2,
        message: rateLimitResult.message,
      };
    }

    const storedCode = await CookieHelper.get<string>('auth_passcode');
    Logger.auth('저장된 패스코드 가져오기 시도');

    if (!storedCode) {
      Logger.warn('AUTH', '저장된 패스코드가 없어 검증 실패');
      return {
        step: 1,
        message: '패스코드가 만료되었거나 유효하지 않습니다.',
      };
    }
    Logger.auth('저장된 패스코드 확인');

    const isValid = passCode === storedCode;
    Logger.auth('패스코드 비교 결과', { isValid });

    // Rate limiting 기록
    await RateLimiter.recordAttempt(identifier, 'passcode', isValid);

    if (isValid) {
      await CookieHelper.remove('auth_passcode');
      Logger.auth('검증 성공, 패스코드 쿠키 삭제');
      return {
        step: 3,
        message: '패스코드가 일치합니다.',
      };
    }

    // 실패 시 남은 시도 횟수 안내
    const warningMessage = rateLimitResult.attemptsLeft > 0
      ? `패스코드가 일치하지 않습니다. (남은 시도: ${rateLimitResult.attemptsLeft}회)`
      : '패스코드가 일치하지 않습니다.';

    return {
      step: 2,
      message: warningMessage,
    };
  } catch (error) {
    Logger.authError('패스코드 검증 중 예외 발생', { error });

    return {
      step: 1,
      message: '패스코드 검증에 실패했습니다. 다시 시도해주세요.',
    };
  }
}
