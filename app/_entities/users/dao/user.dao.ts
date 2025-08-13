import type { SignUpData, AdminSignUpData } from '@/_entities/auth/auth.types';
import { BcryptHelper } from '@/_libs/tools/bcrypt.tools';
import { PrismaHelper } from '@/_libs/tools/prisma.tools';
import type { User } from '@/_prisma';

import type { UserWithOmitPassword, UserWithPassword } from '../users.types';

import type { UserDaoType } from './user.dao.interface';

/**
 * User 도메인의 Data Access Object 구현체
 * UserDaoType 인터페이스를 구현하여 실제 데이터베이스 작업을 수행
 * 사용자 엔티티 관련 모든 CRUD 작업을 담당
 */
export class UserDao implements UserDaoType {
  /**
   * 이메일로 사용자 조회
   * @param email 사용자 이메일
   * @returns Promise<User | null> 사용자 정보
   */
  async findUserByEmail(email: string): Promise<User | null> {
    return await PrismaHelper.client.user.findUnique({
      where: { email, },
    });
  }

  /**
   * ID로 사용자 조회 (민감 정보 제외)
   * @param id 사용자 ID
   * @returns Promise<UserWithOmitPassword | null> 사용자 정보 (비밀번호, 리프레시토큰 제외)
   */
  async findUserById(id: string): Promise<UserWithOmitPassword | null> {
    return await PrismaHelper.client.user.findUnique({
      where: { id, },
      omit: {
        password_hash: true,
        refresh_token: true,
      },
    });
  }

  /**
   * 이메일로 사용자 조회 (비밀번호 포함)
   * @param email 사용자 이메일
   * @returns Promise<UserWithPassword | null> 사용자 정보 (비밀번호 포함)
   */
  async findUserByEmailWithPassword(email: string): Promise<UserWithPassword | null> {
    return (await PrismaHelper.client.user.findUnique({
      where: { email, },
    })) as UserWithPassword | null;
  }

  /**
   * ID로 사용자 조회 (비밀번호 포함)
   * @param id 사용자 ID
   * @returns Promise<UserWithPassword | null> 사용자 정보 (비밀번호 포함)
   */
  async findUserByIdWithPassword(id: string): Promise<UserWithPassword | null> {
    return await PrismaHelper.client.user.findUnique({
      where: { id, },
    }) as UserWithPassword | null;
  }

  /**
   * 일반 사용자 생성
   * 비밀번호 암호화 후 USER 권한으로 사용자 생성
   * @param userData 사용자 생성 데이터 (이메일, 사용자명, 비밀번호)
   * @returns Promise<UserWithOmitPassword> 생성된 사용자 정보 (민감 정보 제외)
   */
  async createUser(userData: SignUpData): Promise<UserWithOmitPassword> {
    const hashedPassword = await BcryptHelper.dataToHash(userData.password);

    return await PrismaHelper.client.user.create({
      data: {
        email: userData.email,
        username: userData.username,
        password_hash: hashedPassword,
        role: 'USER',
      },
      omit: {
        password_hash: true,
        refresh_token: true,
      },
    });
  }

  /**
   * 관리자 사용자 생성
   * 비밀번호 암호화 후 ADMIN 권한으로 사용자 생성
   * @param userData 관리자 생성 데이터 (이메일, 사용자명, 비밀번호)
   * @returns Promise<UserWithOmitPassword> 생성된 관리자 정보 (민감 정보 제외)
   */
  async createAdminUser(userData: AdminSignUpData): Promise<UserWithOmitPassword> {
    const hashedPassword = await BcryptHelper.dataToHash(userData.password);

    return await PrismaHelper.client.user.create({
      data: {
        email: userData.email,
        username: userData.username,
        password_hash: hashedPassword,
        role: 'ADMIN',
      },
      omit: {
        password_hash: true,
        refresh_token: true,
      },
    });
  }

  /**
   * 사용자의 리프레시 토큰 업데이트
   * 로그인 시 토큰 저장, 로그아웃 시 토큰 제거
   * @param userId 사용자 ID
   * @param refreshToken 리프레시 토큰 (null일 경우 토큰 제거)
   * @returns Promise<void>
   */
  async updateRefreshToken(userId: string, refreshToken: string | null): Promise<void> {
    await PrismaHelper.client.user.update({
      where: { id: userId, },
      data: { refresh_token: refreshToken, },
    });
  }

  /**
   * 사용자의 비밀번호 업데이트
   * 비밀번호 재설정 시 새로운 해시된 비밀번호로 업데이트
   * @param userId 사용자 ID
   * @param hashedPassword 해시된 새 비밀번호
   * @returns Promise<void>
   */
  async updatePassword(userId: string, hashedPassword: string): Promise<void> {
    await PrismaHelper.client.user.update({
      where: { id: userId, },
      data: { password_hash: hashedPassword, },
    });
  }
}
