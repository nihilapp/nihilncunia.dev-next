import { PrismaHelper } from '@/_libs/tools/prisma.tools';
import type { PasswordResetToken, AdminVerificationCode } from '@/_prisma';

import type { AuthDaoType } from './auth.dao.interface';

/**
 * Auth 도메인의 Data Access Object 구현체
 * AuthDaoType 인터페이스를 구현하여 실제 데이터베이스 작업을 수행
 * 순수한 인증 관련 데이터베이스 작업만 담당 (비밀번호 재설정 토큰, 관리자 인증 코드)
 */
export class AuthDao implements AuthDaoType {
  /**
   * 비밀번호 재설정 토큰 생성
   * @param userId 사용자 ID
   * @param tokenHash 해시된 토큰
   * @param expiresAt 만료 시간
   * @returns Promise<PasswordResetToken> 생성된 토큰 정보
   */
  async createPasswordResetToken(userId: string, tokenHash: string, expiresAt: Date): Promise<PasswordResetToken> {
    return await PrismaHelper.client.passwordResetToken.create({
      data: {
        user_id: userId,
        token_hash: tokenHash,
        expires_at: expiresAt,
      },
    });
  }

  /**
   * 해시된 토큰으로 유효한 비밀번호 재설정 토큰 조회
   * @param tokenHash 해시된 토큰
   * @returns Promise<PasswordResetToken | null> 유효한 토큰 정보
   */
  async findValidPasswordResetTokenByHash(tokenHash: string): Promise<PasswordResetToken | null> {
    return await PrismaHelper.client.passwordResetToken.findFirst({
      where: {
        token_hash: tokenHash,
        used: false,
        expires_at: {
          gt: new Date(),
        },
      },
    });
  }

  /**
   * 비밀번호 재설정 토큰을 사용됨으로 표시
   * @param tokenId 토큰 ID
   * @returns Promise<void>
   */
  async markPasswordResetTokenAsUsed(tokenId: string): Promise<void> {
    await PrismaHelper.client.passwordResetToken.update({
      where: { id: tokenId, },
      data: { used: true, },
    });
  }

  /**
   * 사용자의 모든 비밀번호 재설정 토큰 무효화
   * 새 토큰 생성 시 기존 토큰들을 모두 무효화
   * @param userId 사용자 ID
   * @returns Promise<void>
   */
  async invalidateAllPasswordResetTokens(userId: string): Promise<void> {
    await PrismaHelper.client.passwordResetToken.updateMany({
      where: {
        user_id: userId,
        used: false,
      },
      data: { used: true, },
    });
  }

  // 관리자 인증 코드 관련 메소드들

  /**
   * 관리자 인증 코드 생성
   * @param codeHash 해시된 인증 코드
   * @param expiresAt 만료 시간
   * @param ipAddress 요청 IP 주소 (선택사항)
   * @returns Promise<AdminVerificationCode> 생성된 인증 코드 정보
   */
  async createAdminVerificationCode(codeHash: string, expiresAt: Date, ipAddress?: string): Promise<AdminVerificationCode> {
    return await PrismaHelper.client.adminVerificationCode.create({
      data: {
        code_hash: codeHash,
        expires_at: expiresAt,
        ip_address: ipAddress,
      },
    });
  }

  /**
   * 유효한 관리자 인증 코드들 조회
   * 만료되지 않고 사용되지 않은 코드들만 반환
   * @returns Promise<AdminVerificationCode[]> 유효한 인증 코드들
   */
  async findValidAdminVerificationCodes(): Promise<AdminVerificationCode[]> {
    return await PrismaHelper.client.adminVerificationCode.findMany({
      where: {
        used: false,
        expires_at: {
          gte: new Date(),
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  /**
   * 관리자 인증 코드를 사용됨으로 표시
   * @param codeId 인증 코드 ID
   * @returns Promise<void>
   */
  async markAdminVerificationCodeAsUsed(codeId: string): Promise<void> {
    await PrismaHelper.client.adminVerificationCode.update({
      where: { id: codeId, },
      data: { used: true, },
    });
  }

  /**
   * 모든 관리자 인증 코드 무효화
   * 새 코드 생성 시 기존 코드들을 모두 무효화
   * @returns Promise<void>
   */
  async invalidateAllAdminVerificationCodes(): Promise<void> {
    await PrismaHelper.client.adminVerificationCode.updateMany({
      where: {
        used: false,
        expires_at: {
          gte: new Date(),
        },
      },
      data: { used: true, },
    });
  }
}
