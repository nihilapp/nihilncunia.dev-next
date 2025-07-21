import { cookies } from 'next/headers';

/**
 * 쿠키 헬퍼
 * - 서버사이드 쿠키 get/set/remove 등 조작 유틸리티
 */
export class CookieHelper {
  /**
   * next/headers의 cookies 객체 반환
   */
  static async store() {
    return cookies();
  }

  /**
   * '1y', '2M', '3d', '4h', '5m', '6s' 등 문자열을 초 단위로 변환
   * 여러 단위 조합도 지원 (예: '1y2M3d4h5m6s')
   *
   * year: y, month: M, day: d, hour: h, minute: m, second: s
   * (month: M, minute: m 구분)
   */
  static parseExpireString(expire: string): number {
    const regex = /([0-9]+)([yMdhms])/g;
    let match: RegExpExecArray | null;
    let seconds = 0;
    while ((match = regex.exec(expire)) !== null) {
      const value = parseInt(match[1], 10);
      switch (match[2]) {
      case 'y':
        seconds += value * 31536000; // 365일 기준
        break;
      case 'M':
        seconds += value * 2592000; // 30일 기준
        break;
      case 'd':
        seconds += value * 86400;
        break;
      case 'h':
        seconds += value * 3600;
        break;
      case 'm':
        seconds += value * 60;
        break;
      case 's':
        seconds += value;
        break;
      }
    }
    return seconds;
  }

  /**
   * 쿠키 저장 (httpOnly, secure, sameSite, path 등 옵션 적용)
   * expiresAt: 초(number) 또는 문자열('1y2M3d4h5m6s' 등) 지원
   */
  static async set(name: string, value: string, expiresAt: number | string) {
    let maxAge: number;
    if (typeof expiresAt === 'string') {
      maxAge = this.parseExpireString(expiresAt);
    }
    else {
      maxAge = expiresAt;
    }
    (await this.store()).set(
      name,
      value,
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge,
      }
    );
  }

  /**
   * 쿠키명으로 값을 가져와 파싱하여 반환, 없으면 null
   */
  static async get<T>(name: string): Promise<T | null> {
    const cookieStore = await this.store();
    const cookie = cookieStore.get(name);

    if (!cookie) {
      return null;
    }

    try {
      return JSON.parse(cookie.value) as T;
    }
    catch {
      // 파싱 실패 시 문자열 그대로 반환
      return cookie.value as unknown as T;
    }
  }

  /**
   * 쿠키 삭제 (maxAge: 0)
   */
  static async remove(name: string) {
    (await this.store()).set(
      name,
      '',
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 0,
      }
    );
  }
}
