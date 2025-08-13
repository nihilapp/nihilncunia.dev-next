import type { SignUpData, AdminSignUpData, ChangePasswordData } from '@/_entities/auth/auth.types';
import type { PrismaReturn } from '@/_entities/common';
import type { User } from '@/_prisma';

import type { UserWithOmitPassword, UserWithPassword } from '../users.types';

/**
 * User 도메인의 Service 레이어 인터페이스
 * 사용자 엔티티 관련 모든 비즈니스 로직을 정의
 */
export type UserServiceType = {
  // 사용자 조회 관련 메서드들

  /**
   * ID로 사용자 조회 (민감 정보 제외)
   * @param id 사용자 ID
   * @returns PrismaReturn<UserWithOmitPassword | null> 사용자 정보
   */
  getUserById(id: string): PrismaReturn<UserWithOmitPassword | null>;

  /**
   * 이메일로 사용자 조회
   * @param email 사용자 이메일
   * @returns PrismaReturn<User | null> 사용자 정보
   */
  getUserByEmail(email: string): PrismaReturn<User | null>;

  /**
   * 이메일로 사용자 조회 (비밀번호 포함)
   * @param email 사용자 이메일
   * @returns PrismaReturn<UserWithPassword | null> 비밀번호 포함 사용자 정보
   */
  getUserByEmailWithPassword(email: string): PrismaReturn<UserWithPassword | null>;

  /**
   * ID로 사용자 조회 (비밀번호 포함)
   * @param id 사용자 ID
   * @returns PrismaReturn<UserWithPassword | null> 비밀번호 포함 사용자 정보
   */
  getUserByIdWithPassword(id: string): PrismaReturn<UserWithPassword | null>;

  // 사용자 생성 관련 메서드들

  /**
   * 일반 사용자 생성
   * 이메일 중복 체크 후 USER 권한으로 사용자 생성
   * @param signUpData 회원가입 데이터 (이메일, 사용자명, 비밀번호)
   * @returns PrismaReturn<UserWithOmitPassword | null> 생성된 사용자 정보
   */
  createUser(signUpData: SignUpData): PrismaReturn<UserWithOmitPassword | null>;

  /**
   * 관리자 사용자 생성
   * 이메일 중복 체크 후 ADMIN 권한으로 사용자 생성
   * @param signUpData 관리자 회원가입 데이터 (이메일, 사용자명, 비밀번호)
   * @returns PrismaReturn<UserWithOmitPassword | null> 생성된 관리자 정보
   */
  createAdminUser(signUpData: AdminSignUpData): PrismaReturn<UserWithOmitPassword | null>;

  // 사용자 정보 업데이트 관련 메서드들

  /**
   * 비밀번호 변경 (로그인 사용자)
   * 현재 비밀번호 검증 후 새 비밀번호로 변경
   * @param userId 사용자 ID
   * @param changePasswordData 현재/새 비밀번호 데이터
   * @returns PrismaReturn<boolean> 비밀번호 변경 성공 여부
   */
  changePassword(
    userId: string,
    changePasswordData: Omit<ChangePasswordData, 'confirmPassword'>
  ): PrismaReturn<boolean>;

  /**
   * 사용자의 리프레시 토큰 업데이트 (내부 사용)
   * @param userId 사용자 ID
   * @param refreshToken 리프레시 토큰 (null일 경우 토큰 제거)
   * @returns PrismaReturn<void> 업데이트 성공 여부
   */
  updateRefreshToken(userId: string, refreshToken: string | null): PrismaReturn<void>;

  /**
   * 사용자의 비밀번호 업데이트 (내부 사용)
   * @param userId 사용자 ID
   * @param hashedPassword 해시된 새 비밀번호
   * @returns PrismaReturn<void> 업데이트 성공 여부
   */
  updatePassword(userId: string, hashedPassword: string): PrismaReturn<void>;
};
