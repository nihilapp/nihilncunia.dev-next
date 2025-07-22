import { compare, hash } from 'bcryptjs';

/**
 * 비밀번호 해시/검증 유틸리티
 */
export class BcryptHelper {
  /**
   * 평문 데이터를 bcrypt 해시로 변환합니다.
   * @param data - 해싱할 평문 데이터(주로 비밀번호)
   * @returns 해시 문자열(Promise)
   */
  static async dataToHash(data: string): Promise<string> {
    return hash(data, 10);
  }

  /**
   * 해시와 평문 데이터를 비교하여 일치 여부를 반환합니다.
   * @param hashedData - 저장된 해시 문자열
   * @param data - 비교할 평문 데이터(주로 비밀번호)
   * @returns 일치 여부(boolean, Promise)
   */
  static async dataCompare(hashedData: string, data: string): Promise<boolean> {
    return compare(data, hashedData);
  }
}
