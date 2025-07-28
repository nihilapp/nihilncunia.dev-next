import type { RateLimitData, RateLimitResult } from '@/_entities/auth/auth.types';
import { CookieHelper } from '@/_libs/tools/cookie.tools';

export class RateLimiter {
  private static readonly CONFIGS = {
    passcode: {
      maxAttempts: 5,
      windowMs: 5 * 60 * 1000, // 5분
      lockDurations: [
        5 * 60,
        15 * 60,
        60 * 60,
      ], // 5분, 15분, 1시간 (초)
    },
    otp: {
      maxAttempts: 3,
      windowMs: 10 * 60 * 1000, // 10분
      lockDurations: [
        10 * 60,
        30 * 60,
        2 * 60 * 60,
      ], // 10분, 30분, 2시간 (초)
    },
  };

  static async checkLimit(
    identifier: string,
    type: 'passcode' | 'otp'
  ): Promise<RateLimitResult> {
    const config = this.CONFIGS[type];
    const cookieKey = `rate_limit_${type}_${identifier}`;
    const now = Date.now();

    const rateLimitData = await CookieHelper.get<RateLimitData>(cookieKey);

    if (!rateLimitData) {
      return {
        allowed: true,
        attemptsLeft: config.maxAttempts - 1,
        lockTimeLeft: 0,
        message: '',
      };
    }

    // 잠금 상태 확인
    if (rateLimitData.lockUntil && now < rateLimitData.lockUntil) {
      const lockTimeLeft = Math.ceil((rateLimitData.lockUntil - now) / 1000);
      const minutes = Math.ceil(lockTimeLeft / 60);

      return {
        allowed: false,
        attemptsLeft: 0,
        lockTimeLeft,
        message: `너무 많은 시도로 인해 ${minutes}분간 잠금되었습니다.`,
      };
    }

    // 윈도우 시간 확인 (만료된 경우 초기화)
    if (now - rateLimitData.firstAttempt > config.windowMs) {
      await CookieHelper.remove(cookieKey);
      return {
        allowed: true,
        attemptsLeft: config.maxAttempts - 1,
        lockTimeLeft: 0,
        message: '',
      };
    }

    // 최대 시도 횟수 확인
    if (rateLimitData.attempts >= config.maxAttempts) {
      const lockIndex = Math.min(
        Math.floor(rateLimitData.attempts / config.maxAttempts) - 1,
        config.lockDurations.length - 1
      );
      const lockDuration = config.lockDurations[lockIndex] * 1000; // 밀리초로 변환
      const lockUntil = now + lockDuration;

      const updatedData: RateLimitData = {
        ...rateLimitData,
        attempts: rateLimitData.attempts + 1,
        lockUntil,
      };

      await CookieHelper.set(cookieKey, JSON.stringify(updatedData), '2h');

      const minutes = Math.ceil(lockDuration / 60000);
      return {
        allowed: false,
        attemptsLeft: 0,
        lockTimeLeft: Math.ceil(lockDuration / 1000),
        message: `너무 많은 시도로 인해 ${minutes}분간 잠금되었습니다.`,
      };
    }

    const attemptsLeft = config.maxAttempts - rateLimitData.attempts - 1;
    return {
      allowed: true,
      attemptsLeft,
      lockTimeLeft: 0,
      message: attemptsLeft === 0
        ? '다음 실패 시 잠금됩니다.'
        : '',
    };
  }

  static async recordAttempt(
    identifier: string,
    type: 'passcode' | 'otp',
    success: boolean
  ): Promise<void> {
    const cookieKey = `rate_limit_${type}_${identifier}`;
    const now = Date.now();

    if (success) {
      // 성공 시 기록 삭제
      await CookieHelper.remove(cookieKey);
      return;
    }

    const rateLimitData = await CookieHelper.get<RateLimitData>(cookieKey);

    if (!rateLimitData) {
      // 첫 번째 실패
      const newData: RateLimitData = {
        attempts: 1,
        firstAttempt: now,
      };
      await CookieHelper.set(cookieKey, JSON.stringify(newData), '2h');
    }
    else {
      // 기존 실패에 추가
      const updatedData: RateLimitData = {
        ...rateLimitData,
        attempts: rateLimitData.attempts + 1,
      };
      await CookieHelper.set(cookieKey, JSON.stringify(updatedData), '2h');
    }
  }

  static async getRemainingTime(
    identifier: string,
    type: 'passcode' | 'otp'
  ): Promise<number> {
    const cookieKey = `rate_limit_${type}_${identifier}`;
    const rateLimitData = await CookieHelper.get<RateLimitData>(cookieKey);

    if (!rateLimitData?.lockUntil) {
      return 0;
    }

    const now = Date.now();
    return Math.max(0, Math.ceil((rateLimitData.lockUntil - now) / 1000));
  }
}
