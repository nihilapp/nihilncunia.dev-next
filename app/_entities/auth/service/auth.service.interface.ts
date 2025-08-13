import type { PrismaReturn } from '@/_entities/common';

import type {
  SignInData,
  AuthResult
} from '../auth.types';

/**
 * Auth 도메인의 Service 레이어 인터페이스
 * 순수한 인증 관련 비즈니스 로직을 처리하고 PrismaReturn 형태로 응답을 반환
 * 토큰 기반 인증, 세션 관리, 비밀번호 재설정, 관리자 인증을 담당
 */
export type AuthServiceType = {
  /**
   * 사용자 로그인
   * 이메일/비밀번호 검증 후 JWT 토큰 발급
   * @param signInData 로그인 데이터 (이메일, 비밀번호)
   * @returns PrismaReturn<AuthResult | null> 사용자 정보와 토큰
   */
  signIn(signInData: SignInData): PrismaReturn<AuthResult | null>;

  /**
   * 사용자 로그아웃
   * 리프레시 토큰을 데이터베이스에서 제거
   * @param userId 사용자 ID
   * @returns PrismaReturn<boolean> 로그아웃 성공 여부
   */
  signOut(userId: string): PrismaReturn<boolean>;

  /**
   * 세션 검증
   * 액세스 토큰과 리프레시 토큰을 검증하여 세션 유효성 확인
   * @param accessToken 액세스 토큰
   * @param refreshToken 리프레시 토큰
   * @returns PrismaReturn<AuthResult | null> 검증 결과 및 새로운 토큰
   */
  verifySession(accessToken: string, refreshToken: string): PrismaReturn<AuthResult | null>;

  // 비밀번호 재설정 관련 메소드들

  /**
   * 비밀번호 재설정 요청
   * 사용자 이메일로 재설정 토큰 생성 후 이메일 발송
   * @param email 사용자 이메일
   * @returns PrismaReturn<boolean> 이메일 발송 성공 여부
   */
  requestPasswordReset(email: string): PrismaReturn<boolean>;

  /**
   * 비밀번호 재설정 실행
   * 토큰 검증 후 새로운 비밀번호로 변경
   * @param token 재설정 토큰
   * @param newPassword 새 비밀번호
   * @returns PrismaReturn<boolean> 비밀번호 변경 성공 여부
   */
  resetPassword(token: string, newPassword: string): PrismaReturn<boolean>;

  // 관리자 인증 관련 메소드들

  /**
   * 관리자 인증 코드 생성 및 발송
   * 6자리 숫자 코드를 생성하여 해시 후 저장, 이메일로 발송
   * @param ipAddress 요청한 IP 주소 (선택사항)
   * @returns PrismaReturn<boolean> 인증 코드 발송 성공 여부
   */
  createAdminVerification(ipAddress?: string): PrismaReturn<boolean>;

  /**
   * 관리자 인증 코드 검증
   * 입력된 코드를 해시하여 데이터베이스의 유효한 코드와 비교
   * @param code 사용자가 입력한 6자리 인증 코드
   * @returns PrismaReturn<boolean> 인증 성공 여부
   */
  verifyAdminCode(code: string): PrismaReturn<boolean>;
};
