import type { SignUpData, AdminSignUpData } from '@/_entities/auth/auth.types';
import type { User } from '@/_prisma';

import type { UserWithOmitPassword, UserWithPassword } from '../users.types';

/**
 * User 도메인의 Data Access Object 인터페이스
 * 사용자 엔티티 관련 모든 데이터베이스 작업을 정의
 */
export type UserDaoType = {
  /**
   * 이메일로 사용자 조회
   * @param email 사용자 이메일
   * @returns Promise<User | null> 사용자 정보
   */
  findUserByEmail(email: string): Promise<User | null>;

  /**
   * ID로 사용자 조회 (민감 정보 제외)
   * @param id 사용자 ID
   * @returns Promise<UserWithOmitPassword | null> 사용자 정보 (비밀번호, 리프레시토큰 제외)
   */
  findUserById(id: string): Promise<UserWithOmitPassword | null>;

  /**
   * 이메일로 사용자 조회 (비밀번호 포함)
   * @param email 사용자 이메일
   * @returns Promise<UserWithPassword | null> 사용자 정보 (비밀번호 포함)
   */
  findUserByEmailWithPassword(email: string): Promise<UserWithPassword | null>;

  /**
   * ID로 사용자 조회 (비밀번호 포함)
   * @param id 사용자 ID
   * @returns Promise<UserWithPassword | null> 사용자 정보 (비밀번호 포함)
   */
  findUserByIdWithPassword(id: string): Promise<UserWithPassword | null>;

  /**
   * 일반 사용자 생성
   * @param userData 사용자 생성 데이터
   * @returns Promise<UserWithOmitPassword> 생성된 사용자 정보 (민감 정보 제외)
   */
  createUser(userData: SignUpData): Promise<UserWithOmitPassword>;

  /**
   * 관리자 사용자 생성
   * @param userData 관리자 생성 데이터
   * @returns Promise<UserWithOmitPassword> 생성된 관리자 정보 (민감 정보 제외)
   */
  createAdminUser(userData: AdminSignUpData): Promise<UserWithOmitPassword>;

  /**
   * 사용자의 리프레시 토큰 업데이트
   * @param userId 사용자 ID
   * @param refreshToken 리프레시 토큰 (null일 경우 토큰 제거)
   * @returns Promise<void>
   */
  updateRefreshToken(userId: string, refreshToken: string | null): Promise<void>;

  /**
   * 사용자의 비밀번호 업데이트
   * @param userId 사용자 ID
   * @param hashedPassword 해시된 새 비밀번호
   * @returns Promise<void>
   */
  updatePassword(userId: string, hashedPassword: string): Promise<void>;
};
