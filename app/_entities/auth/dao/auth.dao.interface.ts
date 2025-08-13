import type { PasswordResetToken, AdminVerificationCode } from '@/_prisma';

/**
 * Auth 도메인의 Data Access Object 인터페이스
 * 순수한 인증 관련 데이터베이스 접근 레이어를 정의
 * 비밀번호 재설정 토큰 및 관리자 인증 코드 관련 데이터 조작을 담당
 */
export type AuthDaoType = {

  // 비밀번호 재설정 토큰 관련 메소드들

  /**
   * 비밀번호 재설정 토큰 생성
   * @param userId 사용자 ID
   * @param tokenHash 해시된 토큰
   * @param expiresAt 만료 시간
   * @returns Promise<PasswordResetToken> 생성된 토큰 정보
   */
  createPasswordResetToken(userId: string, tokenHash: string, expiresAt: Date): Promise<PasswordResetToken>;

  /**
   * 해시된 토큰으로 유효한 비밀번호 재설정 토큰 조회
   * @param tokenHash 해시된 토큰
   * @returns Promise<PasswordResetToken | null> 유효한 토큰 정보
   */
  findValidPasswordResetTokenByHash(tokenHash: string): Promise<PasswordResetToken | null>;

  /**
   * 비밀번호 재설정 토큰을 사용됨으로 표시
   * @param tokenId 토큰 ID
   * @returns Promise<void>
   */
  markPasswordResetTokenAsUsed(tokenId: string): Promise<void>;

  /**
   * 사용자의 모든 비밀번호 재설정 토큰 무효화
   * 새 토큰 생성 시 기존 토큰들을 모두 무효화
   * @param userId 사용자 ID
   * @returns Promise<void>
   */
  invalidateAllPasswordResetTokens(userId: string): Promise<void>;

  // 관리자 인증 코드 관련 메소드들

  /**
   * 관리자 인증 코드 생성
   * @param codeHash 해시된 인증 코드
   * @param expiresAt 만료 시간
   * @param ipAddress 요청 IP 주소 (선택사항)
   * @returns Promise<AdminVerificationCode> 생성된 인증 코드 정보
   */
  createAdminVerificationCode(codeHash: string, expiresAt: Date, ipAddress?: string): Promise<AdminVerificationCode>;

  /**
   * 유효한 관리자 인증 코드들 조회
   * 만료되지 않고 사용되지 않은 코드들만 반환
   * @returns Promise<AdminVerificationCode[]> 유효한 인증 코드들
   */
  findValidAdminVerificationCodes(): Promise<AdminVerificationCode[]>;

  /**
   * 관리자 인증 코드를 사용됨으로 표시
   * @param codeId 인증 코드 ID
   * @returns Promise<void>
   */
  markAdminVerificationCodeAsUsed(codeId: string): Promise<void>;

  /**
   * 모든 관리자 인증 코드 무효화
   * 새 코드 생성 시 기존 코드들을 모두 무효화
   * @returns Promise<void>
   */
  invalidateAllAdminVerificationCodes(): Promise<void>;
};
